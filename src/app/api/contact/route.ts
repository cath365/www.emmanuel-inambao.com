import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

import { updatePrivateJson } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'

export const runtime = 'nodejs'

const LEADS_BLOB_PATH = 'data/leads.json'

interface StoredLead {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: 'new' | 'contacted' | 'closed'
}

async function saveLead(lead: StoredLead) {
  await updatePrivateJson<StoredLead[]>(LEADS_BLOB_PATH, [], existing => [lead, ...existing])
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000)

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { name, email, subject, message, _honeypot } = body

    if (_honeypot) {
      return NextResponse.json({ success: true, message: 'Message received.' })
    }

    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || typeof message !== 'string' || !message.trim() || name.length > 200 || email.length > 254 || message.length > 20000) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const submittedAt = new Date().toISOString()
    const lead: StoredLead = {
      id: `contact-${crypto.randomUUID()}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      service: subject ? `Contact Form: ${String(subject)}` : 'Contact Form',
      details: String(message).trim(),
      submittedAt,
      status: 'new',
    }

    let saved = false
    try {
      await saveLead(lead)
      saved = true
    } catch (storageError) {
      console.error('Contact message storage failed:', storageError)
    }

    return submissionResponse(saved, {
      name: lead.name, email: lead.email,
      subject: lead.service,
      message: `Name: ${lead.name}\nEmail: ${lead.email}\n\n${lead.details}`,
    }, 'Thank you. Your message has been received.')
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Unable to process your message right now. Please try again.' },
      { status: 500 }
    )
  }
}
