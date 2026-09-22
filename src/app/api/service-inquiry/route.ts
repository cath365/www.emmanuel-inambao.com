import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { isAuthenticated } from '@/lib/auth-helpers'
import {
  buildProjectQuotation,
  formatZmw,
  type ProjectQuoteSelection,
  type QuoteLineItem,
} from '@/lib/project-quotation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LEADS_BLOB_PATH = 'data/leads.json'

const LEAD_STATUSES = [
  'new',
  'quotation-sent',
  'accepted',
  'deposit-paid',
  'in-progress',
  'completed',
  'lost',
] as const

type LeadStatus = (typeof LEAD_STATUSES)[number]

interface LeadQuotation {
  quoteId: string
  currency: 'ZMW'
  lineItems: QuoteLineItem[]
  knownTotal: number
  upfrontAmount: number
  balanceAmount: number
  hasCustomPricing: boolean
  selection: ProjectQuoteSelection
  pdfPath?: string
  clientCompany?: string
  createdAt: string
}

interface ServiceLead {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: LeadStatus
  notes?: string
  updatedAt?: string
  quotation?: LeadQuotation
}

function normalizeStatus(value: unknown): LeadStatus {
  if (value === 'contacted') return 'quotation-sent'
  if (value === 'closed') return 'completed'
  return LEAD_STATUSES.includes(value as LeadStatus) ? (value as LeadStatus) : 'new'
}

function normalizeQuoteSelection(raw: any): ProjectQuoteSelection {
  const mobilePlatforms = ['android', 'ios', 'both', 'not-sure'] as const
  const timelines = ['flexible', '4-8-weeks', '2-4-weeks', 'urgent'] as const

  return {
    website: Boolean(raw?.website),
    ecommerce: Boolean(raw?.ecommerce),
    adminDashboard: Boolean(raw?.adminDashboard),
    paymentIntegration: Boolean(raw?.paymentIntegration),
    mobileApplication: Boolean(raw?.mobileApplication),
    mobilePlatform: mobilePlatforms.includes(raw?.mobilePlatform) ? raw.mobilePlatform : 'not-sure',
    iotIntegration: Boolean(raw?.iotIntegration),
    iotDetails: typeof raw?.iotDetails === 'string' ? raw.iotDetails.slice(0, 5000) : '',
    customFeatures: Array.isArray(raw?.customFeatures)
      ? raw.customFeatures
          .filter((item: unknown): item is string => typeof item === 'string')
          .map((item: string) => item.trim())
          .filter(Boolean)
          .slice(0, 30)
      : [],
    projectDescription:
      typeof raw?.projectDescription === 'string' ? raw.projectDescription.slice(0, 8000) : '',
    timeline: timelines.includes(raw?.timeline) ? raw.timeline : 'flexible',
  }
}

function normalizeLead(raw: any): ServiceLead {
  return {
    id: String(raw?.id || `lead-${Date.now()}`),
    name: String(raw?.name || ''),
    email: String(raw?.email || ''),
    service: String(raw?.service || ''),
    details: String(raw?.details || ''),
    submittedAt: String(raw?.submittedAt || new Date().toISOString()),
    status: normalizeStatus(raw?.status),
    notes: typeof raw?.notes === 'string' ? raw.notes : '',
    updatedAt: typeof raw?.updatedAt === 'string' ? raw.updatedAt : undefined,
    quotation: raw?.quotation,
  }
}

async function readLeads(): Promise<ServiceLead[]> {
  try {
    const { blobs } = await list({ prefix: LEADS_BLOB_PATH })
    if (blobs.length === 0) return []

    const res = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return []

    const payload = await res.json()
    return Array.isArray(payload) ? payload.map(normalizeLead) : []
  } catch (error) {
    console.error('readLeads error:', error)
    return []
  }
}

async function writeLeads(leads: ServiceLead[]) {
  await put(LEADS_BLOB_PATH, JSON.stringify(leads), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await readLeads()
    return NextResponse.json(
      { leads, count: leads.length },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    )
  } catch (error) {
    console.error('Failed to read leads:', error)
    return NextResponse.json({ leads: [], error: String(error) })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = String(body?.id || '')
    if (!id) return NextResponse.json({ error: 'Lead id is required' }, { status: 400 })

    const hasStatus = typeof body?.status === 'string'
    const requestedStatus = hasStatus ? normalizeStatus(body.status) : undefined
    const hasNotes = typeof body?.notes === 'string'

    const leads = await readLeads()
    let found = false

    const updated = leads.map(lead => {
      if (lead.id !== id) return lead
      found = true
      return {
        ...lead,
        ...(requestedStatus ? { status: requestedStatus } : {}),
        ...(hasNotes ? { notes: body.notes.slice(0, 5000) } : {}),
        updatedAt: new Date().toISOString(),
      }
    })

    if (!found) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    await writeLeads(updated)
    const lead = updated.find(item => item.id === id)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Failed to update lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const leads = await readLeads()
    const updated = leads.filter(lead => lead.id !== id)
    await writeLeads(updated)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data?.name || !data?.email || !data?.service) {
      return NextResponse.json(
        { error: 'Name, email, and service are required' },
        { status: 400 }
      )
    }

    let quotation: LeadQuotation | undefined

    if (data?.quotation?.selection && data?.quotation?.quoteId) {
      const selection = normalizeQuoteSelection(data.quotation.selection)
      const calculated = buildProjectQuotation(selection)

      quotation = {
        quoteId: String(data.quotation.quoteId),
        currency: 'ZMW',
        lineItems: calculated.lineItems,
        knownTotal: calculated.knownTotal,
        upfrontAmount: calculated.upfrontAmount,
        balanceAmount: calculated.balanceAmount,
        hasCustomPricing: calculated.hasCustomPricing,
        selection,
        pdfPath:
          typeof data.quotation.pdfPath === 'string' &&
          data.quotation.pdfPath.startsWith('data/quotations/')
            ? data.quotation.pdfPath
            : undefined,
        clientCompany:
          typeof data.quotation.clientCompany === 'string'
            ? data.quotation.clientCompany.slice(0, 200)
            : undefined,
        createdAt:
          typeof data.quotation.createdAt === 'string'
            ? data.quotation.createdAt
            : new Date().toISOString(),
      }
    }

    const acceptedQuote =
      data.service === 'Accepted AI Project Quotation' && Boolean(quotation)

    const newLead: ServiceLead = {
      id: String(data.id || `lead-${Date.now()}`),
      name: String(data.name).slice(0, 200),
      email: String(data.email).slice(0, 320),
      service: String(data.service).slice(0, 200),
      details: String(data.details || '').slice(0, 12000),
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: acceptedQuote ? 'accepted' : 'new',
      notes: '',
      updatedAt: new Date().toISOString(),
      quotation,
    }

    let saved = false
    try {
      const existing = await readLeads()
      const withoutDuplicate = existing.filter(lead => lead.id !== newLead.id)
      await writeLeads([newLead, ...withoutDuplicate])
      saved = true
    } catch (blobError) {
      console.error('Blob write failed:', blobError)
    }

    const quoteSummary = quotation
      ? [
          `Quotation: ${quotation.quoteId}`,
          `Total: ${formatZmw(quotation.knownTotal)}`,
          `35% upfront: ${formatZmw(quotation.upfrontAmount)}`,
          `65% balance: ${formatZmw(quotation.balanceAmount)}`,
        ].join('\n')
      : ''

    const inquiryDetails = [
      '🔔 NEW SERVICE INQUIRY',
      '',
      `👤 Name: ${newLead.name}`,
      `📧 Email: ${newLead.email}`,
      `🔧 Service: ${newLead.service}`,
      quotation?.clientCompany ? `🏢 Company: ${quotation.clientCompany}` : '',
      quoteSummary,
      '',
      `📝 Details: ${newLead.details || 'Not provided'}`,
      '',
      `📅 Submitted: ${new Date(newLead.submittedAt).toLocaleString()}`,
      '',
      `Reply to ${newLead.email} to follow up.`,
    ].filter(Boolean).join('\n')

    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
    let emailSent = false

    if (WEB3FORMS_KEY) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `🔔 New Service Inquiry: ${newLead.service} - ${newLead.name}`,
            from_name: 'Portfolio AI Chatbot',
            name: newLead.name,
            email: newLead.email,
            message: inquiryDetails,
            replyto: newLead.email,
          }),
        })
        if (response.ok) emailSent = true
      } catch (error) {
        console.error('Web3Forms failed:', error)
      }
    }

    const FORMSPREE_ID = process.env.FORMSPREE_ID
    if (FORMSPREE_ID && !emailSent) {
      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: newLead.name,
            email: newLead.email,
            _subject: `🔔 Service Inquiry: ${newLead.service}`,
            message: inquiryDetails,
          }),
        })
        emailSent = response.ok
      } catch (error) {
        console.error('Formspree failed:', error)
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
      leadId: newLead.id,
      message: emailSent
        ? 'Inquiry saved and email notification sent.'
        : 'Inquiry saved to the Admin Leads area. Email notification is not configured or could not be delivered.',
    })
  } catch (error) {
    console.error('Service inquiry error:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}
