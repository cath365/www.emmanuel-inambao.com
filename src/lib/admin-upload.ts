'use client'

export type AdminUploadResult =
  | { success: true; url: string; publicId?: string; fileName?: string; error?: undefined }
  | { success: false; url?: undefined; error: string }

// Vercel rejects function request bodies over ~4.5MB; stay safely under it.
const SERVER_UPLOAD_LIMIT = 4 * 1024 * 1024
const MAX_IMAGE_SIDE = 2000
const SHRINK_THRESHOLD = 1.5 * 1024 * 1024

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return await response.json()
  } catch {
    if (response.status === 413) return { error: 'File too large for upload.' }
    return { error: `Upload failed (HTTP ${response.status}).` }
  }
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality))
}

// Phone photos are often 3-12MB; resize them in the browser so they upload quickly.
// Falls back to the original file if the browser cannot decode it (e.g. HEIC in Chrome).
async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  if (file.size <= SHRINK_THRESHOLD) return file

  const sourceUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = sourceUrl
    await image.decode()

    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale)
    canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Older Safari silently returns PNG for webp; use JPEG there instead.
    let blob = await encode(canvas, 'image/webp', 0.9)
    if (!blob || blob.type !== 'image/webp') blob = await encode(canvas, 'image/jpeg', 0.9)
    if (!blob || blob.size >= file.size) return file

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.${extension}`, { type: blob.type })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

async function uploadDirect(file: File, type: string, projectId?: string): Promise<AdminUploadResult> {
  const signResponse = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type, projectId, fileName: file.name, fileType: file.type, size: file.size }),
  })
  const signed = await readJson(signResponse)
  if (!signResponse.ok) return { success: false, error: String(signed.error || 'Could not start upload.') }

  const form = new FormData()
  form.append('file', file)
  form.append('api_key', String(signed.apiKey))
  form.append('signature', String(signed.signature))
  for (const [key, value] of Object.entries(signed.params as Record<string, unknown>)) {
    form.append(key, String(value))
  }

  const uploadResponse = await fetch(String(signed.uploadUrl), { method: 'POST', body: form })
  const result = await readJson(uploadResponse)
  if (!uploadResponse.ok) {
    const message = (result.error as { message?: string } | undefined)?.message
    return { success: false, error: `Upload to cloud storage failed: ${message || uploadResponse.status}` }
  }
  return { success: true, url: String(result.secure_url), publicId: String(result.public_id), fileName: file.name }
}

// Single entry point for every admin upload. Small files go through /api/upload;
// anything still over Vercel's body limit goes straight to Cloudinary.
export async function uploadAdminFile(file: File, type: string, projectId?: string): Promise<AdminUploadResult> {
  try {
    const prepared = await shrinkImage(file)
    if (prepared.size > SERVER_UPLOAD_LIMIT) return await uploadDirect(prepared, type, projectId)

    const form = new FormData()
    form.append('file', prepared)
    form.append('type', type)
    if (projectId) form.append('projectId', projectId)

    const response = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' })
    const data = await readJson(response)
    if (!response.ok || !data.success || typeof data.url !== 'string') {
      return { success: false, error: String(data.error || 'Upload failed') }
    }
    return { success: true, url: data.url, publicId: String(data.publicId), fileName: String(data.fileName) }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed. Check your connection.' }
  }
}
