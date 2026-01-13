import { NextRequest, NextResponse } from 'next/server'

interface TestimonialSubmission {
  name: string
  role: string
  company: string
  content: string
  rating: number
  email: string
  photo?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: TestimonialSubmission = await request.json()

    // Validate required fields
    if (!data.name || !data.content || !data.email) {
      return NextResponse.json(
        { error: 'Name, testimonial content, and email are required' },
        { status: 400 }
      )
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Send notification email to admin via Web3Forms
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    
    if (WEB3FORMS_KEY) {
      const stars = '⭐'.repeat(data.rating)
      
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `⭐ New Testimonial from ${data.name}`,
          from_name: 'Portfolio Testimonials',
          message: `
NEW TESTIMONIAL SUBMISSION
==========================

👤 Name: ${data.name}
💼 Role: ${data.role || 'Not specified'}
🏢 Company: ${data.company || 'Not specified'}
📧 Email: ${data.email}

Rating: ${stars} (${data.rating}/5)

TESTIMONIAL:
"${data.content}"

---
To approve this testimonial, add it to your admin dashboard.
          `.trim(),
        }),
      })

      console.log('✅ Testimonial notification sent to admin')
    }

    // Log the submission
    console.log('📝 New testimonial submission:', {
      name: data.name,
      email: data.email,
      rating: data.rating,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your testimonial! It will be reviewed and published soon.',
    })

  } catch (error) {
    console.error('Testimonial submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit testimonial. Please try again.' },
      { status: 500 }
    )
  }
}
