import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

export const runtime = 'nodejs'

/** Only authenticated admins may request an upload token for public portfolio images. */
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  if (process.env.VERCEL_ENV === 'preview' && process.env.ALLOW_PREVIEW_CMS_WRITES !== 'true') {
    return NextResponse.json({ error: 'Use an isolated Blob store before testing preview uploads.' }, { status: 403 })
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) return NextResponse.json({ error: 'Public media storage is not configured.' }, { status: 503 })
  try {
    const body = await request.json() as HandleUploadBody
    const result = await handleUpload({
      body, request, token,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthenticated())) throw new Error('Unauthorized')
        if (!/^portfolio\/images\/[A-Za-z0-9._-]{1,130}$/.test(pathname)) throw new Error('Invalid image path')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => { /* Never publish here: the webhook is not a user session. */ },
    })
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Image upload failed:', error instanceof Error ? error.message : 'unexpected')
    return NextResponse.json({ error: 'Upload authorization failed. Verify admin login and Blob configuration.' }, { status: 400 })
  }
}
