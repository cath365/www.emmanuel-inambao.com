import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { isAuthenticated } from '@/lib/auth-helpers'
import { storageToken } from '@/lib/blob-json'

export const runtime = 'nodejs'
const headers = { 'Cache-Control': 'no-store' }
const mediaPath = /^media\/portfolio\/[a-f0-9-]{36}\.(jpg|png|webp|gif|avif)$/

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as HandleUploadBody | null
  if (!body || !['blob.generate-client-token', 'blob.upload-completed'].includes(body.type)) {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400, headers })
  }
  // Completion callbacks are authenticated by the SDK, not admin cookies.
  if (body.type === 'blob.generate-client-token') {
    if (!(await isAuthenticated())) return NextResponse.json({ error: 'Please log in before uploading.' }, { status: 401, headers })
    if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid upload origin.' }, { status: 403, headers })
    if (!mediaPath.test(body.payload?.pathname || '')) return NextResponse.json({ error: 'Invalid image path.' }, { status: 400, headers })
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json({ error: 'Image storage is unavailable. Connect the public Blob store using BLOB_READ_WRITE_TOKEN and redeploy.' }, { status: 503, headers })
  }
  try {
    const result = await handleUpload({
      body, request, token: storageToken('public'),
      onBeforeGenerateToken: async pathname => {
        if (!mediaPath.test(pathname)) throw new Error('Invalid image path')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          validUntil: Date.now() + 10 * 60 * 1000,
          addRandomSuffix: false, allowOverwrite: false,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(result, { headers })
  } catch {
    return NextResponse.json({ error: 'Image upload could not be authorized. Check the public Blob store connection and try again.' }, { status: 503, headers })
  }
}
