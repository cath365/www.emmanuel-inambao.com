import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

/** Only disclose storage status to an authenticated administrator, never credentials. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  async function check(key: 'BLOB_READ_WRITE_TOKEN' | 'PRIVATE_BLOB_READ_WRITE_TOKEN') {
    const token = process.env[key]?.trim()
    if (!token) return 'not-configured'
    try {
      await list({ token, limit: 1 })
      return 'connected'
    } catch {
      return 'unavailable'
    }
  }

  const [publicMedia, privateSubmissions] = await Promise.all([
    check('BLOB_READ_WRITE_TOKEN'),
    check('PRIVATE_BLOB_READ_WRITE_TOKEN'),
  ])

  return NextResponse.json(
    { publicMedia, privateSubmissions, checkedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}
