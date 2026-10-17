import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

import { updatePrivateJson } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'
import { normalizeWhatsAppNumber } from '@/lib/whatsapp'

export const runtime = 'nodejs'

const LEADS_BLOB_PATH = 'data/leads.json'

interface StoredLead {
  id: string
  name: string
  email: string
  phone?: string
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

    const { name, email, phone, subject, message, _honeypot } = body

    if (_honeypot) {
      return NextResponse.json({ success: true, message: 'Message received.' })
    }

    if (
      typeof name !== 'string' || !name.trim() || name.length > 200 ||
      typeof message !== 'string' || !message.trim() || message.length > 20000 ||
      (email != null && typeof email !== 'string') ||
      (phone != null && typeof phone !== 'string') ||
      (subject != null && typeof subject !== 'string')
    ) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 })
    }

    const cleanEmail = String(email || '').trim().toLowerCase()
    const cleanPhone = String(phone || '').trim()
    const normalizedNumber = cleanPhone ? normalizeWhatsAppNumber(cleanPhone) : null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (cleanEmail.length > 254 || (cleanEmail && !emailRegex.test(cleanEmail))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (cleanPhone && !normalizedNumber) {
      return NextResponse.json({ error: 'Please enter a valid WhatsApp number including its country code (e.g. +260...).' }, { status: 400 })
    }
    if (!cleanEmail && !normalizedNumber) {
      return NextResponse.json({ error: 'Provide an email address, a WhatsApp number, or both.' }, { status: 400 })
    }

    const submittedAt = new Date().toISOString()
    const lead: StoredLead = {
      id: `contact-${crypto.randomUUID()}`,
      name: String(name).trim(),
      email: cleanEmail,
      phone: normalizedNumber ? '+' + normalizedNumber : '',
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
      message: `Name: ${lead.name}\nEmail: ${lead.email || 'Not provided'}\nWhatsApp: ${lead.phone || 'Not provided'}\n\n${lead.details}`,
    }, 'Thank you. Your message has been received.')
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Unable to process your message right now. Please try again.' },
      { status: 500 }
    )
  }
}
