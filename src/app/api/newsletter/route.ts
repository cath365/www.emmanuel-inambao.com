import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { put, list } from '@vercel/blob'

const BLOB_PATH = 'data/newsletter-subscribers.json'

async function readSubscribers(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH })
    if (blobs.length === 0) return []

    const response = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })

    if (!response.ok) return []
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Newsletter read failed:', error)
    return []
  }
}

async function writeSubscribers(subscribers: string[]) {
  await put(BLOB_PATH, JSON.stringify(subscribers), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

async function notifyFallback(email: string) {
  const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
  const FORMSPREE_ID = process.env.FORMSPREE_ID

  if (WEB3FORMS_KEY) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New Portfolio Newsletter Subscription',
          from_name: 'Portfolio Newsletter',
          email,
          message: `Newsletter subscription request from ${email}`,
        }),
      })
      if (response.ok) return true
    } catch (error) {
      console.error('Newsletter Web3Forms fallback failed:', error)
    }
  }

  if (FORMSPREE_ID) {
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          _subject: 'New Portfolio Newsletter Subscription',
          message: `Newsletter subscription request from ${email}`,
        }),
      })
      if (response.ok) return true
    } catch (error) {
      console.error('Newsletter Formspree fallback failed:', error)
    }
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit(`newsletter:${ip}`, 3, 10 * 60 * 1000)

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const subscribers = await readSubscribers()

    if (subscribers.includes(email)) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: 'You are already subscribed.',
      })
    }

    try {
      await writeSubscribers([...subscribers, email])
      console.log('New subscriber saved:', email)
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed.',
      })
    } catch (storageError) {
      console.error('Newsletter storage failed:', storageError)

      const notified = await notifyFallback(email)
      if (notified) {
        return NextResponse.json({
          success: true,
          queued: true,
          message: 'Subscription request received.',
        })
      }

      return NextResponse.json(
        { error: 'Subscription storage is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Unable to subscribe right now. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const subscribers = await readSubscribers()
  return NextResponse.json({ count: subscribers.length })
}
