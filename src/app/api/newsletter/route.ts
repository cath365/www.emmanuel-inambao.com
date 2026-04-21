import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { put, list } from '@vercel/blob'

const BLOB_PATH = 'data/newsletter-subscribers.json'

async function readSubscribers(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH })
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

async function writeSubscribers(subs: string[]) {
  await put(BLOB_PATH, JSON.stringify(subs), {
    access: 'private',
    addRandomSuffix: false,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 attempts per 10 minutes per IP
    const ip = getClientIP(request)
    const rl = rateLimit(`newsletter:${ip}`, 3, 10 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const subscribers = await readSubscribers()

    if (subscribers.includes(email.toLowerCase())) {
      return NextResponse.json(
        { message: 'Already subscribed!' },
        { status: 200 }
      )
    }

    subscribers.push(email.toLowerCase())
    await writeSubscribers(subscribers)

    console.log(`New subscriber: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return subscriber count (for admin dashboard)
  const subscribers = await readSubscribers()
  return NextResponse.json({
    count: subscribers.length,
  })
}
