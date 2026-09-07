import { NextRequest, NextResponse } from 'next/server'
import { getClientIP, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit('contact:' + ip, 5, 15 * 60 * 1000)

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          },
        },
      )
    }

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const honeypot = cleanString(body._honeypot, 200)
    if (honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
      })
    }

    const name = cleanString(body.name, 120)
    const email = cleanString(body.email, 254)
    const subject = cleanString(body.subject, 120)
    const projectType = cleanString(body.projectType, 120)
    const budget = cleanString(body.budget, 80)
    const message = cleanString(body.message, 5000)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      )
    }

    if (name.length < 2 || message.length < 20) {
      return NextResponse.json(
        { error: 'Please provide a valid name and a little more detail about the project.' },
        { status: 400 },
      )
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY
    const formspreeId = process.env.FORMSPREE_ID

    if (!web3FormsKey && !formspreeId) {
      console.error(
        'Contact form not configured: set WEB3FORMS_ACCESS_KEY or FORMSPREE_ID',
      )
      return NextResponse.json(
        {
          error:
            'Contact form is temporarily unavailable. Please email denuelinambao@gmail.com directly.',
        },
        { status: 503 },
      )
    }

    const resolvedSubject =
      projectType || subject || 'New Portfolio Project Enquiry'

    const deliveryMessage = [
      'Project type: ' + (projectType || 'Not specified'),
      'Budget range: ' + (budget || 'Not specified'),
      '',
      message,
    ].join('\n')

    let emailSent = false

    if (web3FormsKey) {
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name,
            email,
            subject: resolvedSubject,
            message: deliveryMessage,
            from_name: 'Emmanuel Inambao Portfolio',
          }),
        })

        if (web3Response.ok) {
          const result = await web3Response.json()
          emailSent = Boolean(result.success)
        }
      } catch (error) {
        console.error('Web3Forms delivery failed:', error)
      }
    }

    if (formspreeId && !emailSent) {
      try {
        const formspreeResponse = await fetch('https://formspree.io/f/' + formspreeId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            projectType,
            budget,
            subject: resolvedSubject,
            message: deliveryMessage,
            _subject: 'Portfolio Contact: ' + resolvedSubject,
          }),
        })

        emailSent = formspreeResponse.ok
      } catch (error) {
        console.error('Formspree delivery failed:', error)
      }
    }

    if (!emailSent) {
      return NextResponse.json(
        {
          error:
            'Unable to deliver your message right now. Please email denuelinambao@gmail.com directly.',
        },
        { status: 502 },
      )
    }

    console.info('Portfolio contact delivered', {
      projectType: projectType || 'unspecified',
      hasBudget: Boolean(budget),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    )
  }
}
