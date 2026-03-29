import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'denuelinambao@gmail.com'

interface ServiceInquiry {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ServiceInquiry = await request.json()

    if (!data.name || !data.email || !data.service) {
      return NextResponse.json(
        { error: 'Name, email, and service are required' },
        { status: 400 }
      )
    }

    const inquiryDetails = `
🔔 NEW SERVICE INQUIRY

👤 Name: ${data.name}
📧 Email: ${data.email}
🔧 Service: ${data.service}
📝 Details: ${data.details || 'Not provided'}

📅 Submitted: ${new Date(data.submittedAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Africa/Lusaka'
    })}

---
This inquiry was submitted via the AI chatbot on your portfolio.
Reply directly to ${data.email} to follow up.
    `.trim()

    let emailSent = false

    // Try Web3Forms
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    if (WEB3FORMS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `🔔 New Service Inquiry: ${data.service} - ${data.name}`,
            from_name: 'Portfolio AI Chatbot',
            name: data.name,
            email: data.email,
            message: inquiryDetails,
            replyto: data.email,
          }),
        })
        if (response.ok) emailSent = true
      } catch (e) {
        console.error('Web3Forms failed for service inquiry:', e)
      }
    }

    // Try Formspree as backup
    const FORMSPREE_ID = process.env.FORMSPREE_ID
    if (FORMSPREE_ID && !emailSent) {
      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            _subject: `🔔 Service Inquiry: ${data.service} - ${data.name}`,
            message: inquiryDetails,
          }),
        })
        if (response.ok) emailSent = true
      } catch (e) {
        console.error('Formspree failed for service inquiry:', e)
      }
    }

    console.log('🔔 Service inquiry received:', {
      name: data.name,
      email: data.email,
      service: data.service,
      emailSent,
      timestamp: data.submittedAt,
    })

    return NextResponse.json({
      success: true,
      emailSent,
      message: 'Service inquiry submitted successfully!',
    })
  } catch (error) {
    console.error('Service inquiry error:', error)
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}
