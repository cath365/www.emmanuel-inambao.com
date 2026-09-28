import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { cloudinaryConfig } from '@/lib/cloudinary-config'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// Only signs a scoped upload. File bytes go from the browser to Cloudinary.
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 })
  if (!rateLimit(`testimonial-upload:${getClientIP(request)}`, 10, 60 * 60 * 1000).allowed) {
    return NextResponse.json({ error: 'Upload limit reached. Please try again later.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  const type = typeof body?.type === 'string' ? body.type.split(';')[0].toLowerCase() : ''
  const isVideo = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'].includes(type)
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(type)
  if ((!isVideo && !isImage) || !Number.isFinite(body?.size) || body.size <= 0) {
    return NextResponse.json({ error: 'Choose an MP4, WebM, MOV video or JPG, PNG, WebP photo.' }, { status: 400 })
  }
  if (body.size > (isVideo ? 50 : 5) * 1024 * 1024) return NextResponse.json({ error: isVideo ? 'Video must be under 50MB.' : 'Photo must be under 5MB.' }, { status: 400 })
  const config = cloudinaryConfig()
  if (!config) return NextResponse.json({ error: 'Video and photo uploads are temporarily unavailable. Please use a written testimonial.' }, { status: 503 })
  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: `portfolio/testimonials/${crypto.randomUUID()}`,
    overwrite: false,
    allowed_formats: isVideo ? 'mp4,webm,mov,avi' : 'jpg,jpeg,png,webp',
  }
  return NextResponse.json({
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/${isVideo ? 'video' : 'image'}/upload`,
    apiKey: config.apiKey, params,
    signature: cloudinary.utils.api_sign_request(params, config.apiSecret),
  }, { headers: { 'Cache-Control': 'no-store' } })
}
