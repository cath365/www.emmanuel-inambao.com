import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Use edge runtime for better performance

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = body

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

    let emailSent = false

    // Try Web3Forms first
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    
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

    // Try Formspree as backup
    const FORMSPREE_ID = process.env.FORMSPREE_ID
    
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

    // Log the submission regardless of email status
    console.log('Contact form submission:', { name, email, subject, message: message.substring(0, 100), timestamp: new Date().toISOString(), emailSent })

    // Always return success to user (we've received their message)
    return NextResponse.json({ 
      success: true, 
      message: emailSent 
        ? 'Message sent successfully! I will get back to you soon.' 
        : 'Message received! Thank you for reaching out. I will get back to you soon.' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
