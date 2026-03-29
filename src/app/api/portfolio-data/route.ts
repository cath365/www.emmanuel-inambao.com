import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { cookies } from 'next/headers'
import { AUTH_CONFIG } from '@/lib/auth-config'

const ALLOWED_KEYS = ['profile', 'projects', 'testimonials', 'certifications', 'experiences', 'services', 'gallery', 'resources', 'audio']

function blobPath(key: string) {
  return `data/portfolio/${key}.json`
}

async function readSection(key: string) {
  try {
    const { blobs } = await list({ prefix: blobPath(key) })
    if (blobs.length === 0) return null
    const res = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function writeSection(key: string, data: unknown) {
  await put(blobPath(key), JSON.stringify(data), {
    access: 'private',
    addRandomSuffix: false,
  })
}

async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(AUTH_CONFIG.cookieName)
    if (!sessionCookie) return false
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
    return sessionData.exp > Date.now()
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json(null)
  }
  const data = await readSection(key)
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { key, data } = await request.json()
    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }
    await writeSection(key, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
