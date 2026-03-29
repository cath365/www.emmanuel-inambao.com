import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const LEADS_BLOB_PATH = 'data/leads.json'

interface ServiceLead {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: 'new' | 'contacted' | 'closed'
}

async function readLeads(): Promise<ServiceLead[]> {
  try {
    const { blobs } = await list({ prefix: LEADS_BLOB_PATH })
    if (blobs.length === 0) return []
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('readLeads error:', e)
    return []
  }
}

async function writeLeads(leads: ServiceLead[]) {
  await put(LEADS_BLOB_PATH, JSON.stringify(leads), {
    access: 'public',
    addRandomSuffix: false,
  })
}

// GET - fetch all leads for admin panel
export async function GET() {
  try {
    const leads = await readLeads()
    return NextResponse.json({ leads, count: leads.length })
  } catch (error) {
    console.error('Failed to read leads:', error)
    return NextResponse.json({ leads: [], error: String(error) })
  }
}

// PATCH - update lead status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const leads = await readLeads()
    const updated = leads.map(l => l.id === id ? { ...l, status } : l)
    await writeLeads(updated)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update lead:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE - remove a lead
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const leads = await readLeads()
    const updated = leads.filter(l => l.id !== id)
    await writeLeads(updated)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// POST - save new lead + send email
export async function POST(request: NextRequest) {
  try {
    const data: ServiceLead = await request.json()

    if (!data.name || !data.email || !data.service) {
      return NextResponse.json(
        { error: 'Name, email, and service are required' },
        { status: 400 }
      )
    }

    // Save to Vercel Blob (non-critical — don't fail the inquiry if blob errors)
    const newLead: ServiceLead = {
      id: data.id || `lead-${Date.now()}`,
      name: data.name,
      email: data.email,
      service: data.service,
      details: data.details || '',
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: 'new',
    }

    try {
      const existing = await readLeads()
      await writeLeads([newLead, ...existing])
    } catch (blobError) {
      console.error('Blob write failed (non-critical):', blobError)
    }

    // Send email notification
    const inquiryDetails = `🔔 NEW SERVICE INQUIRY\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n🔧 Service: ${data.service}\n📝 Details: ${data.details || 'Not provided'}\n\n📅 Submitted: ${new Date(data.submittedAt || '').toLocaleString()}\n\nReply to ${data.email} to follow up.`

    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    let emailSent = false

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
        console.error('Web3Forms failed:', e)
      }
    }

    const FORMSPREE_ID = process.env.FORMSPREE_ID
    if (FORMSPREE_ID && !emailSent) {
      try {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: data.name, email: data.email, _subject: `🔔 Service Inquiry: ${data.service}`, message: inquiryDetails }),
        })
      } catch (e) {
        console.error('Formspree failed:', e)
      }
    }

    return NextResponse.json({ success: true, emailSent, message: 'Inquiry submitted successfully!' })
  } catch (error) {
    console.error('Service inquiry error:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}
