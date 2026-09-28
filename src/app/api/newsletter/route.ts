import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { readPrivateJson, updatePrivateJson } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'

export const dynamic = 'force-dynamic'
const BLOB_PATH = 'data/newsletter-subscribers.json'

export async function POST(request: NextRequest) {
  if (!rateLimit(`newsletter:${getClientIP(request)}`, 3, 10 * 60 * 1000).allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  let saved = false
  try {
    await updatePrivateJson<string[]>(BLOB_PATH, [], subscribers =>
      subscribers.includes(email) ? subscribers : [...subscribers, email])
    saved = true
  } catch (error) { console.error('Newsletter storage failed:', error) }
  return submissionResponse(saved, {
    email, subject: 'Portfolio newsletter subscription request',
    message: `Newsletter subscription request from ${email}.\n${saved ? 'Saved to the subscriber list.' : 'Storage was unavailable. Please add this address to the subscriber list.'}`,
  }, saved ? 'Thank you for subscribing.' : 'Your subscription request has been received for processing.')
}

export async function GET() {
  try {
    const subscribers = await readPrivateJson<string[]>(BLOB_PATH, [])
    return NextResponse.json({ count: subscribers.length }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Subscriber count is temporarily unavailable.' }, { status: 503 })
  }
}
