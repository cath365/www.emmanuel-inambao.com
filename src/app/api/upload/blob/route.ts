import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

export const runtime = 'nodejs'

/** Browser-to-public-Blob image uploads: avoids the Vercel function request-size cap. */
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) return NextResponse.json({ error: 'Public Blob storage is not configured.' }, { status: 503 })

  try {
    const body = await request.json() as HandleUploadBody
    const json = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async pathname => {
        if (!(await isAuthenticated())) throw new Error('Unauthorized')
        if (!/^portfolio\/images\/[a-zA-Z0-9._-]{1,130}$/.test(pathname)) throw new Error('Invalid upload path')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {
        // The browser publishes the verified URL to the media library only after upload succeeds.
        // The provider's callback has no user session, so never authorize writes here.
      },
    })
    return NextResponse.json(json, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Public media upload failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Image upload could not be authorized. Check your login and public Blob configuration.' }, { status: 400 })
  }
}
