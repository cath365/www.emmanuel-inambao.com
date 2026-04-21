import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per 15 minutes per IP
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
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, subject, message, _honeypot } = body

    // Honeypot anti-spam: bots fill hidden fields, real users don't
    if (_honeypot) {
      // Silently succeed so bots think it worked
      return NextResponse.json({ success: true, message: 'Message sent successfully!' })
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    const FORMSPREE_ID = process.env.FORMSPREE_ID

    if (!WEB3FORMS_KEY && !FORMSPREE_ID) {
      console.error('Contact form not configured: set WEB3FORMS_ACCESS_KEY or FORMSPREE_ID')
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable. Please email directly.' },
        { status: 503 }
      )
    }

    let emailSent = false

    if (WEB3FORMS_KEY && !emailSent) {
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name,
            email,
            subject: subject || 'New Portfolio Contact',
            message,
            from_name: 'Portfolio Contact Form',
          }),
        })

        if (web3Response.ok) {
          const result = await web3Response.json()
          if (result.success) {
            emailSent = true
          }
        }
      } catch (e) {
        console.error('Web3Forms failed:', e)
      }
    }

    if (FORMSPREE_ID && !emailSent) {
      try {
        const formspreeResponse = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            subject: subject || 'New Portfolio Contact',
            message,
            _subject: `Portfolio Contact: ${subject || 'New Message'}`,
          }),
        })

        if (formspreeResponse.ok) {
          emailSent = true
        }
      } catch (e) {
        console.error('Formspree failed:', e)
      }
    }

    console.log('Contact form submission:', { name, email, subject, message: message.substring(0, 100), timestamp: new Date().toISOString(), emailSent })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Unable to deliver your message right now. Please email directly at denuelinambao@gmail.com.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
