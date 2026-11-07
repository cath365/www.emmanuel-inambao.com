import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { cloudinaryConfig } from '@/lib/cloudinary-config'
import { isAuthenticated } from '@/lib/auth-helpers'
import { uploadDestination } from '@/lib/upload-destination'

export const runtime = 'nodejs'

// Vercel rejects request bodies over ~4.5MB, so large admin files (videos, big PDFs)
// skip /api/upload: this route only signs the upload and the browser sends the bytes to Cloudinary.
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const type = typeof body?.type === 'string' ? body.type : ''
  const fileName = typeof body?.fileName === 'string' ? body.fileName.slice(0, 200) : 'upload'
  const fileType = typeof body?.fileType === 'string' ? body.fileType.toLowerCase() : ''
  const projectId = typeof body?.projectId === 'string' ? body.projectId : null

  if (!Number.isFinite(body?.size) || body.size <= 0) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 })
  }
  if (body.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 100MB' }, { status: 400 })
  }

  const config = cloudinaryConfig()
  if (!config) {
    return NextResponse.json({ error: 'Cloudinary upload service is not configured for this deployment.' }, { status: 503 })
  }

  // Cloudinary stores audio under the "video" resource type.
  const resourceType = fileType.startsWith('image/') ? 'image'
    : fileType.startsWith('video/') || fileType.startsWith('audio/') ? 'video'
    : 'raw'
  const { folder, publicId } = uploadDestination(type, fileName, projectId)
  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    folder,
    public_id: publicId,
    overwrite: true,
  }

  return NextResponse.json({
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`,
    apiKey: config.apiKey,
    params,
    signature: cloudinary.utils.api_sign_request(params, config.apiSecret),
  }, { headers: { 'Cache-Control': 'no-store' } })
}
