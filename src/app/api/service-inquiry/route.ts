import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

import { readPrivateJson, updatePrivateJson, storageError } from '@/lib/blob-json'
import { submissionResponse } from '@/lib/notifications'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

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
  return readPrivateJson<ServiceLead[]>(LEADS_BLOB_PATH, [])
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
    return NextResponse.json({ error: storageError('private') }, { status: 503 })
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

    await updatePrivateJson<ServiceLead[]>(LEADS_BLOB_PATH, [], leads => leads.map(l => l.id === id ? { ...l, status } : l))
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
    await updatePrivateJson<ServiceLead[]>(LEADS_BLOB_PATH, [], leads => leads.filter(l => l.id !== id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// POST - save new lead + send email
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`inquiry:${getClientIP(request)}`, 8, 15 * 60 * 1000).allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const data: ServiceLead = await request.json()

    const email = String(data.email || '').trim()
    const phone = String(data.phone || '').trim()
    const phoneDigits = phone.replace(/\D/g, '')
    const validEmail = !email || /^\S+@\S+\.\S+$/.test(email)

    if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 200 || typeof data.service !== 'string' || !data.service.trim() || data.service.length > 300 || (data.details != null && typeof data.details !== 'string') || (data.details?.length || 0) > 30000 || email.length > 254 || !validEmail || (!email && phoneDigits.length < 7)) {
      return NextResponse.json(
        { error: 'Name, service, and at least one valid email or WhatsApp number are required' },
        { status: 400 }
      )
    }

    const newLead: ServiceLead = {
      id: `lead-${crypto.randomUUID()}`,
      name: data.name,
      email,
      phone,
      service: data.service,
      details: data.details || '',
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    let saved = false
    try {
      await updatePrivateJson<ServiceLead[]>(LEADS_BLOB_PATH, [], existing => [newLead, ...existing])
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

    return submissionResponse(saved, {
      name: newLead.name, email,
      subject: isQuotation ? `New quotation awaiting review - ${newLead.name}` : `New Service Inquiry: ${newLead.service}`,
      message: inquiryDetails,
    }, 'Your inquiry has been received for review.')
  } catch (error) {
    console.error('Service inquiry error:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}
