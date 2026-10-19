import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

export const runtime = 'nodejs'

/** Browser-to-public-Blob image uploads: avoids the Vercel function request-size cap. */
export async function POST(request: Request) {
  // A Vercel preview alias can differ from the canonical request URL behind
  // the proxy. Validate against the actual Host as well as request.url, rather
  // than rejecting a legitimate same-origin preview upload.
  const origin = request.headers.get('origin')
  if (origin) {
    let originHost: string
    try {
      const parsed = new URL(origin)
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Invalid protocol')
      originHost = parsed.host.toLowerCase()
    } catch {
      return NextResponse.json({ error: 'Invalid upload origin.' }, { status: 403 })
    }
    const allowedHosts = [new URL(request.url).host, request.headers.get('host')]
      .filter((value): value is string => Boolean(value))
      .map(value => value.toLowerCase())
    if (!allowedHosts.includes(originHost)) {
      console.warn('Public image upload refused: origin and host differ.')
      return NextResponse.json({ error: 'Image upload origin does not match this preview. Refresh this page and retry.' }, { status: 403 })
    }
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) return NextResponse.json({ error: 'Public Blob storage is not configured.' }, { status: 503 })

  try {
    const body = await request.json() as HandleUploadBody
    if (body.type === 'blob.generate-client-token' && !(await isAuthenticated())) {
      return NextResponse.json({ error: 'Admin session expired. Sign in again to upload images.' }, { status: 401 })
    }
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
    const message = error instanceof Error ? error.message : 'Unknown error'
    // Error details stay server-side. Return specific actionable messages without
    // exposing tokens, session data, provider responses or internal URLs.
    console.error('Public media token/upload handler failed:', message)
    if (/unauthoriz|session expired/i.test(message)) {
      return NextResponse.json({ error: 'Admin session expired. Sign in again.' }, { status: 401 })
    }
    if (/upload path/i.test(message)) {
      return NextResponse.json({ error: 'Invalid image filename. Rename the file and retry.' }, { status: 400 })
    }
    return NextResponse.json({
      error: 'Public Blob could not generate an upload token. Check the public Blob connection and deployment logs.',
    }, { status: 502 })
  }
}
