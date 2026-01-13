import { NextRequest, NextResponse } from 'next/server'

// Simple rate limiting
const submissions = new Map<string, { count: number; resetTime: number }>()
const MAX_SUBMISSIONS_PER_HOUR = 5

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = submissions.get(ip)
  
  if (!record || now > record.resetTime) {
    submissions.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }
  
  if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const { name, email, subject, message } = await request.json()

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

    // Send email via Web3Forms
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    
    console.log('Contact form: WEB3FORMS_KEY exists:', !!WEB3FORMS_KEY)

    if (WEB3FORMS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name,
            email,
            subject: subject || 'New Contact Form Submission',
            message,
            from_name: 'Portfolio Contact Form',
            // Send to your email
            to: 'denuelinambao@gmail.com',
          }),
        })

        const result = await response.json()
        console.log('Web3Forms response:', result)

        if (result.success) {
          return NextResponse.json({ success: true, message: 'Message sent successfully!' })
        } else {
          console.error('Web3Forms error:', result)
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to send message. Please try again.' 
          }, { status: 500 })
        }
      } catch (fetchError) {
        console.error('Web3Forms fetch error:', fetchError)
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to send message. Please try again.' 
        }, { status: 500 })
      }
    }

    // If no email service configured, log and still return success
    console.log('Contact form submission (no email service):', { 
      name, email, subject, message, timestamp: new Date().toISOString() 
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message received! Thank you for contacting.' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
