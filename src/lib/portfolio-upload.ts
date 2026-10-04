'use client'

import { upload } from '@vercel/blob/client'

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
  const blob = await upload(`media/portfolio/${crypto.randomUUID()}.${extension}`, file, {
    access: 'public', handleUploadUrl: '/api/upload/blob', contentType: file.type,
  })
  return Response.json({ success: true, url: blob.url, publicId: blob.pathname, fileName: file.name })
}
