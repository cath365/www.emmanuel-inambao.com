import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

export function cloudinaryConfig() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  let apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  let apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
  if (process.env.CLOUDINARY_URL?.trim()) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL.trim())
      if (parsed.protocol !== 'cloudinary:') return null
      cloudName = parsed.hostname
      apiKey = decodeURIComponent(parsed.username)
      apiSecret = decodeURIComponent(parsed.password)
    } catch { return null }
  }
  if (!cloudName || !apiKey || !apiSecret) return null
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  return { cloudName, apiKey, apiSecret }
}

export function testimonialMediaUrl(value: unknown, kind: 'image' | 'video') {
  if (!value) return undefined
  if (typeof value !== 'string' || value.length > 2000) throw new Error('Invalid media URL')
  const config = cloudinaryConfig()
  const url = new URL(value)
  if (!config || url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' ||
      !url.pathname.startsWith(`/${config.cloudName}/${kind}/upload/`) ||
      !url.pathname.includes('/portfolio/testimonials/')) throw new Error('Invalid testimonial media URL')
  return url.toString()
}
