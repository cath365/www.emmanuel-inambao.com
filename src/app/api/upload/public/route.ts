import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Rate limiting for public uploads (stricter)
const uploadAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_UPLOADS_PER_HOUR = 5

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = uploadAttempts.get(ip)
  
  if (!record || now > record.resetTime) {
    uploadAttempts.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }
  
  if (record.count >= MAX_UPLOADS_PER_HOUR) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting (stricter for public)
    const ip = getClientIP(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Upload limit reached. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Upload service not configured' },
        { status: 500 }
      )
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
      api_key: process.env.CLOUDINARY_API_KEY?.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Only allow testimonial uploads from public endpoint
    if (type !== 'testimonials' && type !== 'testimonial-video') {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    // Validate file type - only videos and images for testimonials
    const allowedTypes = [
      'video/webm', 'video/mp4', 'video/quicktime', 'video/x-msvideo',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please use video or image format.' },
        { status: 400 }
      )
    }

    // Max 50MB for public uploads
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      )
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to testimonials folder
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'portfolio/testimonials',
      public_id: `testimonial-${Date.now()}`,
      resource_type: resourceType,
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    })
  } catch (error) {
    console.error('Public upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
