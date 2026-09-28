'use client'

export const MAX_VIDEO_BYTES = 50 * 1024 * 1024
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024

export async function uploadTestimonialMedia(file: File | Blob, onProgress: (percent: number) => void = () => {}) {
  const type = file.type.split(';')[0].toLowerCase()
  const isVideo = type.startsWith('video/')
  if (!file.size || file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES)) {
    throw new Error(isVideo ? 'Video must be under 50MB.' : 'Photo must be under 5MB.')
  }
  const response = await fetch('/api/upload/public', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, size: file.size }),
  })
  const signed = await response.json().catch(() => null)
  if (!response.ok || !signed?.signature) throw new Error(signed?.error || 'The upload service is unavailable.')
  const form = new FormData()
  const extension = type === 'video/mp4' ? 'mp4' : isVideo ? 'webm' : 'jpg'
  form.append('file', file, file instanceof File ? file.name : `testimonial.${extension}`)
  form.append('api_key', signed.apiKey)
  form.append('signature', signed.signature)
  for (const [key, value] of Object.entries(signed.params)) form.append(key, String(value))
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', signed.uploadUrl)
    xhr.timeout = 180000
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)) }
    xhr.onerror = () => reject(new Error('Upload interrupted. Check your connection and try again.'))
    xhr.ontimeout = () => reject(new Error('Upload timed out. Try a shorter video or a stronger connection.'))
    xhr.onload = () => {
      let result
      try { result = JSON.parse(xhr.responseText) } catch { reject(new Error('The upload service returned an invalid response.')); return }
      if (xhr.status >= 200 && xhr.status < 300 && typeof result.secure_url === 'string') resolve(result.secure_url)
      else reject(new Error(result?.error?.message || 'Upload failed. Please try again.'))
    }
    xhr.send(form)
  })
}
