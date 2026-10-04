'use client'

import { put } from '@vercel/blob/client'

const imageTypes: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/avif': 'avif',
}

// Images travel directly to storage, avoiding the server request body limit.
// Documents and videos retain the existing Cloudinary upload flow.
export async function uploadPortfolioMedia(form: FormData): Promise<Response> {
  const file = form.get('file')
  if (!(file instanceof File)) throw new Error('Choose a file first.')
  if (!file.type.startsWith('image/')) {
    const response = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' })
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Upload failed. The file may exceed the server upload limit.')
    }
    return response
  }
  const extension = imageTypes[file.type]
  if (!extension) throw new Error('Save this image as JPG, PNG, WebP, GIF or AVIF before uploading.')
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('Images must be between 1 byte and 10 MB.')
  const pathname = `media/portfolio/${crypto.randomUUID()}.${extension}`
  const authorization = await fetch('/api/upload/blob', {
    method: 'POST', credentials: 'include', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'blob.generate-client-token', payload: { pathname, multipart: false } }),
  })
  const grant = await authorization.json().catch(() => null)
  if (!authorization.ok || typeof grant?.clientToken !== 'string') {
    throw new Error(grant?.error || `Image upload authorization failed (HTTP ${authorization.status}). Please log in again and retry.`)
  }
  const blob = await put(pathname, file, {
    access: 'public', token: grant.clientToken, contentType: file.type,
  })
  return Response.json({ success: true, url: blob.url, publicId: blob.pathname, fileName: file.name })
}
