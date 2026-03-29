import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { cookies } from 'next/headers'
import { AUTH_CONFIG } from '@/lib/auth-config'

// Simple rate limiting for uploads
const uploadAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_UPLOADS_PER_MINUTE = 10

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = uploadAttempts.get(ip)
  
  if (!record || now > record.resetTime) {
    uploadAttempts.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }
  
  if (record.count >= MAX_UPLOADS_PER_MINUTE) {
    return false
  }
  
  record.count++
  return true
}

// Check authentication directly in this route
async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(AUTH_CONFIG.cookieName)

    if (!sessionCookie) {
      console.log('Upload auth: No session cookie found')
      return false
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )

    const isValid = sessionData.exp > Date.now()
    if (!isValid) {
      console.log('Upload auth: Session expired')
    }
    return isValid
  } catch (error) {
    console.error('Upload auth error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await checkAuth()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Check rate limiting
    const ip = getClientIP(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many uploads. Please wait a minute.' },
        { status: 429 }
      )
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary not configured. Missing environment variables.')
      return NextResponse.json(
        { error: 'Cloudinary not configured. Please set environment variables in .env.local' },
        { status: 500 }
      )
    }

    // Configure Cloudinary (inside the handler to ensure env vars are loaded)
    // Trim values to remove any whitespace/newlines from env vars
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
      api_key: process.env.CLOUDINARY_API_KEY?.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    })

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('FormData parse error:', error)
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string // 'profile', 'project', or 'cv'
    const projectId = formData.get('projectId') as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (basic check before processing)
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    // Validate file type based on upload type
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif', 'image/avif']
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/3gpp', 'video/x-ms-wmv']
    const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/x-m4a', 'audio/aac', 'audio/flac']
    const documentTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/gzip',
      'application/json',
      'text/plain',
      'text/csv',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'application/xml',
      'application/epub+zip',
      'application/x-photoshop',
      'application/postscript',
      'application/illustrator'
    ]
    
    const isCV = type === 'cv'
    const isVideo = type === 'video' || type === 'testimonial-video' || type === 'testimonials'
    const isAudio = type === 'audio'
    const isResource = type === 'resource'
    const isGallery = type === 'gallery'
    
    let validTypes: string[]
    if (isCV) {
      validTypes = [...documentTypes, ...imageTypes]
    } else if (isVideo) {
      validTypes = [...videoTypes, ...imageTypes] // Allow images for thumbnails too
    } else if (isAudio) {
      validTypes = audioTypes
    } else if (isResource) {
      // Resources can be ANY file type
      validTypes = [...documentTypes, ...imageTypes, ...videoTypes, ...audioTypes]
    } else if (isGallery) {
      validTypes = [...imageTypes, ...videoTypes]
    } else {
      // Default: images and videos
      validTypes = [...imageTypes, ...videoTypes]
    }
    
    // Also check by file extension as fallback (browsers sometimes report wrong MIME)
    const fileName = file.name.toLowerCase()
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.tiff', '.heic', '.heif', '.avif']
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.3gp', '.wmv']
    const hasImageExt = imageExtensions.some(ext => fileName.endsWith(ext))
    const hasVideoExt = videoExtensions.some(ext => fileName.endsWith(ext))
    const fileTypeValid = validTypes.includes(file.type) || hasImageExt || hasVideoExt

    if (!fileTypeValid) {
      if (isCV) {
        return NextResponse.json(
          { error: 'Invalid file type. Use PDF, DOC, DOCX, or image files' },
          { status: 400 }
        )
      }
      if (isVideo) {
        return NextResponse.json(
          { error: 'Invalid video type. Use MP4, WebM, MOV, or AVI' },
          { status: 400 }
        )
      }
      if (isAudio) {
        return NextResponse.json(
          { error: 'Invalid audio type. Use MP3, WAV, OGG, or M4A' },
          { status: 400 }
        )
      }
      if (isResource) {
        // For resources, allow the upload anyway - let Cloudinary handle it
        console.log('Resource upload - allowing file type:', file.type)
      } else {
        return NextResponse.json(
          { error: 'Invalid file type. Use JPG, PNG, WebP, or GIF' },
          { status: 400 }
        )
      }
    }

    // Validate file size (max 100MB for videos, 50MB for resources, 10MB for audio/CV, 5MB for images)
    let maxSize: number
    if (isVideo) {
      maxSize = 100 * 1024 * 1024 // 100MB for videos
    } else if (isResource) {
      maxSize = 50 * 1024 * 1024 // 50MB for resources
    } else if (isCV || isAudio) {
      maxSize = 10 * 1024 * 1024 // 10MB for CV and audio
    } else {
      maxSize = 10 * 1024 * 1024 // 10MB for images (increased from 5MB)
    }
    
    if (file.size > maxSize) {
      const maxSizeStr = isVideo ? '100MB' : (isResource ? '50MB' : ((isCV || isAudio) ? '10MB' : '10MB'))
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSizeStr}` },
        { status: 400 }
      )
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Determine folder and public_id for Cloudinary
    let folder = 'portfolio/uploads'
    let publicId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '')}`

    if (type === 'profile') {
      folder = 'portfolio/profile'
      publicId = 'profile-picture'
    } else if (type === 'cv') {
      folder = 'portfolio/cv'
      publicId = `cv-${Date.now()}`
    } else if (type === 'project' && projectId) {
      folder = 'portfolio/projects'
      publicId = `project-${projectId}-${Date.now()}`
    } else if (type === 'video' || type === 'testimonial-video') {
      folder = 'portfolio/videos'
      publicId = `video-${Date.now()}`
    } else if (type === 'audio') {
      folder = 'portfolio/audio'
      publicId = `audio-${Date.now()}`
    } else if (type === 'resource') {
      folder = 'portfolio/resources'
      publicId = `resource-${Date.now()}`
    } else if (type === 'testimonial') {
      folder = 'portfolio/testimonials'
      publicId = `testimonial-${Date.now()}`
    } else if (type === 'certification') {
      folder = 'portfolio/certifications'
      publicId = `certification-${Date.now()}`
    } else if (type === 'experience') {
      folder = 'portfolio/experience'
      publicId = `experience-${Date.now()}`
    } else if (type === 'service') {
      folder = 'portfolio/services'
      publicId = `service-${Date.now()}`
    }

    // Determine resource type based on file
    const isPDF = file.type === 'application/pdf'
    const isDocument = file.type.includes('document') || file.type.includes('msword') || file.type.includes('spreadsheet') || file.type.includes('presentation') || file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z') || file.type.includes('gzip')
    const isVideoFile = videoTypes.includes(file.type)
    const isAudioFile = audioTypes.includes(file.type)
    const isText = file.type.startsWith('text/') || file.type === 'application/json' || file.type === 'application/xml' || file.type === 'application/javascript'
    const isUnknown = !imageTypes.includes(file.type) && !videoTypes.includes(file.type) && !audioTypes.includes(file.type) && !documentTypes.includes(file.type)
    
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
    if (isPDF || isDocument || isText || isUnknown) {
      resourceType = 'raw' // Use raw for documents and unknown types
    } else if (isVideoFile) {
      resourceType = 'video'
    } else if (isAudioFile) {
      resourceType = 'video' // Cloudinary uses 'video' resource_type for audio files
    }

    // Upload to Cloudinary
    const uploadOptions: Record<string, unknown> = {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: resourceType,
    }

    // Only apply image transformations for images
    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ]
    }

    try {
      const uploadResult = await cloudinary.uploader.upload(dataURI, uploadOptions)

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileName: file.name,
      })
    } catch (cloudinaryError: unknown) {
      console.error('Cloudinary upload error:', cloudinaryError)
      
      // Extract detailed error message from Cloudinary
      let errorMessage = 'Unknown Cloudinary error'
      if (cloudinaryError instanceof Error) {
        errorMessage = cloudinaryError.message
      } else if (typeof cloudinaryError === 'object' && cloudinaryError !== null) {
        const err = cloudinaryError as { message?: string; error?: { message?: string } }
        errorMessage = err.message || err.error?.message || JSON.stringify(cloudinaryError)
      }
      
      return NextResponse.json(
        { error: `Upload to cloud storage failed: ${errorMessage}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    )
  }
}
