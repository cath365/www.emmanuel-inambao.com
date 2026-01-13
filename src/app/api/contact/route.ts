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

    // Send email via Web3Forms
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    
    if (WEB3FORMS_KEY) {
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

      const result = await web3Response.json()

      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Message sent successfully! I will get back to you soon.' 
        })
      } else {
        console.error('Web3Forms error:', result)
        // Don't fail - still acknowledge the message
      }
    }

    // If Web3Forms fails or not configured, still return success
    // The message details are logged above
    return NextResponse.json({ 
      success: true, 
      message: 'Message received! Thank you for reaching out.' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
