import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

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

async function readLeads(): Promise<StoredLead[]> {
  try {
    const { blobs } = await list({ prefix: LEADS_BLOB_PATH })
    if (blobs.length === 0) return []

    const response = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })

    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Contact lead read failed:', error)
    return []
  }
}

async function saveLead(lead: StoredLead) {
  const existing = await readLeads()
  await put(LEADS_BLOB_PATH, JSON.stringify([lead, ...existing]), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
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

    if (!name || !email || !message) {
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
      id: `contact-${Date.now()}`,
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

    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    const FORMSPREE_ID = process.env.FORMSPREE_ID
    let emailSent = false

    if (WEB3FORMS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name,
            email,
            subject: subject || 'New Portfolio Contact',
            message,
            from_name: 'Portfolio Contact Form',
            replyto: email,
          }),
        })

        if (response.ok) {
          const result = await response.json().catch(() => null)
          emailSent = result?.success === true
        }
      } catch (error) {
        console.error('Web3Forms failed:', error)
      }
    }

    if (FORMSPREE_ID && !emailSent) {
      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject: subject || 'New Portfolio Contact',
            message,
            _subject: `Portfolio Contact: ${subject || 'New Message'}`,
          }),
        })

        emailSent = response.ok
      } catch (error) {
        console.error('Formspree failed:', error)
      }
    }

    console.log('Contact form submission:', {
      name,
      email,
      subject,
      submittedAt,
      saved,
      emailSent,
    })

    if (!saved && !emailSent) {
      return NextResponse.json(
        { error: 'Your message could not be saved or delivered. Please use the direct email or WhatsApp option.' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      saved,
      emailSent,
      message: emailSent
        ? 'Message received and notification sent.'
        : 'Message received and saved successfully.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Unable to process your message right now. Please try again.' },
      { status: 500 }
    )
  }
}
