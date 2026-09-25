import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { isAuthenticated } from '@/lib/auth-helpers'

function getPrivateBlobToken() {
  const token = process.env.PRIVATE_BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) {
    throw new Error('Private storage is not configured. Connect a private Vercel Blob store to Production and set PRIVATE_BLOB_READ_WRITE_TOKEN.')
  }
  return token
}

const LEADS_BLOB_PATH = 'data/leads.json'

interface ServiceLead {
  id: string
  name: string
  email?: string
  phone?: string
  service: string
  details: string
  submittedAt: string
  status: 'new' | 'contacted' | 'approved' | 'closed'
}

async function readLeads(): Promise<ServiceLead[]> {
  try {
    const { blobs } = await list({ prefix: LEADS_BLOB_PATH, token: getPrivateBlobToken() })
    if (blobs.length === 0) return []
    const res = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${getPrivateBlobToken()}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('readLeads error:', e)
    return []
  }
}

async function writeLeads(leads: ServiceLead[]) {
  await put(LEADS_BLOB_PATH, JSON.stringify(leads), {
    access: 'private',
    token: getPrivateBlobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

// GET - fetch all leads for admin panel
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()
    const allowedStatuses: ServiceLead['status'][] = ['new', 'contacted', 'approved', 'closed']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid lead status' }, { status: 400 })
    }

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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

    const email = String(data.email || '').trim()
    const phone = String(data.phone || '').trim()
    const phoneDigits = phone.replace(/\D/g, '')
    const validEmail = !email || /^\S+@\S+\.\S+$/.test(email)

    if (!data.name || !data.service || !validEmail || (!email && phoneDigits.length < 7)) {
      return NextResponse.json(
        { error: 'Name, service, and at least one valid email or WhatsApp number are required' },
        { status: 400 }
      )
    }

    const newLead: ServiceLead = {
      id: data.id || `lead-${Date.now()}`,
      name: data.name,
      email,
      phone,
      service: data.service,
      details: data.details || '',
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: 'new',
    }

    let saved = false
    try {
      const existing = await readLeads()
      await writeLeads([newLead, ...existing])
      saved = true
    } catch (blobError) {
      console.error('Blob write failed:', blobError)
    }

    // Send email notification. Quotations use a distinct subject so they stand out
    // when Emmanuel is away from the admin dashboard.
    const isQuotation = /quotation/i.test(data.service)
    const inquiryDetails = [
      isQuotation ? '📄 NEW QUOTATION AWAITING REVIEW' : '🔔 NEW SERVICE INQUIRY',
      '',
      `👤 Name: ${data.name}`,
      `📧 Email: ${email || 'Not provided'}`,
      `📱 WhatsApp: ${phone || 'Not provided'}`,
      `🔧 Service: ${data.service}`,
      `📝 Details: ${data.details || 'Not provided'}`,
      '',
      `📅 Submitted: ${new Date(data.submittedAt || new Date().toISOString()).toLocaleString()}`,
      '',
      email ? `Reply to ${email} to follow up.` : `Follow up on WhatsApp: ${phone}`,
    ].join('\n')

    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY?.trim()
    const FORMSPREE_ID = process.env.FORMSPREE_ID?.trim()
    const emailProviderConfigured = Boolean(WEB3FORMS_KEY || FORMSPREE_ID)
    let emailSent = false
    let emailProvider: 'web3forms' | 'formspree' | null = null

    if (WEB3FORMS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: isQuotation
              ? `📄 New quotation awaiting review - ${data.name}`
              : `🔔 New Service Inquiry: ${data.service} - ${data.name}`,
            from_name: isQuotation ? 'Portfolio Quotation Assistant' : 'Portfolio AI Chatbot',
            name: data.name,
            ...(email ? { email, replyto: email } : {}),
            message: inquiryDetails,
          }),
        })
        if (response.ok) {
          const result = await response.json().catch(() => null)
          emailSent = result?.success === true || response.ok
          if (emailSent) emailProvider = 'web3forms'
        }
      } catch (e) {
        console.error('Web3Forms failed:', e)
      }
    }

    if (FORMSPREE_ID && !emailSent) {
      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: data.name,
            ...(email ? { email } : {}),
            _subject: isQuotation
              ? `📄 New quotation awaiting review - ${data.name}`
              : `🔔 Service Inquiry: ${data.service}`,
            message: inquiryDetails,
          }),
        })
        emailSent = response.ok
        if (emailSent) emailProvider = 'formspree'
      } catch (e) {
        console.error('Formspree failed:', e)
      }
    }

    if (!saved && !emailSent) {
      return NextResponse.json(
        {
          error:
            'The inquiry could not be saved or delivered. Please use the direct email or WhatsApp option.',
          saved,
          emailSent,
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      saved,
      emailSent,
      emailProvider,
      emailProviderConfigured,
      message: emailSent
        ? 'Inquiry saved and email notification sent.'
        : emailProviderConfigured
          ? 'Inquiry saved, but the configured email provider did not confirm delivery.'
          : 'Inquiry saved to Admin Leads. Email notifications are not configured in Production.',
    })
  } catch (error) {
    console.error('Service inquiry error:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}
