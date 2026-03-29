import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { cookies } from 'next/headers'
import { AUTH_CONFIG } from '@/lib/auth-config'

export interface Visit {
  id: string
  timestamp: string
  page: string
  referrer: string
  country: string
  city: string
  device: 'mobile' | 'desktop' | 'tablet'
  browser: string
  sessionId: string
}

function dayKey(date: Date) {
  return date.toISOString().split('T')[0]
}

function blobPath(day: string) {
  return `data/analytics/${day}.json`
}

async function readDay(day: string): Promise<Visit[]> {
  try {
    const { blobs } = await list({ prefix: blobPath(day) })
    if (blobs.length === 0) return []
    const res = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function writeDay(day: string, visits: Visit[]) {
  await put(blobPath(day), JSON.stringify(visits), {
    access: 'private',
    addRandomSuffix: false,
  })
}

function parseDevice(ua: string, screenWidth?: number): Visit['device'] {
  if (screenWidth !== undefined) {
    if (screenWidth < 768) return 'mobile'
    if (screenWidth < 1024) return 'tablet'
    return 'desktop'
  }
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|mini|windows ce|palm/i.test(ua)) return 'mobile'
  return 'desktop'
}

function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\/|Opera/i.test(ua)) return 'Opera'
  if (/Chrome\//i.test(ua)) return 'Chrome'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  return 'Other'
}

function parseReferrer(ref: string): string {
  if (!ref || ref === 'direct') return 'Direct'
  try {
    const url = new URL(ref)
    const host = url.hostname.replace('www.', '')
    if (host.includes('google')) return 'Google'
    if (host.includes('linkedin')) return 'LinkedIn'
    if (host.includes('github')) return 'GitHub'
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X'
    if (host.includes('facebook')) return 'Facebook'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('whatsapp')) return 'WhatsApp'
    return host
  } catch {
    return 'Unknown'
  }
}

// POST — track a visit (public, no auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, sessionId, screenWidth } = body

    // Skip bots
    const ua = request.headers.get('user-agent') || ''
    if (/bot|crawl|spider|slurp|wget|curl/i.test(ua)) {
      return NextResponse.json({ ok: true })
    }

    const country = decodeURIComponent(
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') || 'Unknown'
    )
    const city = decodeURIComponent(
      request.headers.get('x-vercel-ip-city') || 'Unknown'
    )

    const visit: Visit = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      page: page || '/',
      referrer: parseReferrer(referrer),
      country,
      city,
      device: parseDevice(ua, screenWidth),
      browser: parseBrowser(ua),
      sessionId: sessionId || 'unknown',
    }

    const day = dayKey(new Date())
    const existing = await readDay(day)

    // Deduplicate: same session + same page within 5 minutes
    const recent = existing.find(
      v => v.sessionId === visit.sessionId &&
        v.page === visit.page &&
        Date.now() - new Date(v.timestamp).getTime() < 5 * 60 * 1000
    )
    if (recent) return NextResponse.json({ ok: true })

    await writeDay(day, [visit, ...existing])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

// GET — read analytics for admin (requires auth)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(AUTH_CONFIG.cookieName)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString())
    if (sessionData.exp < Date.now()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = parseInt(request.nextUrl.searchParams.get('days') || '30')
  const allVisits: Visit[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const visits = await readDay(dayKey(date))
    allVisits.push(...visits)
  }

  return NextResponse.json({ visits: allVisits, days })
}
