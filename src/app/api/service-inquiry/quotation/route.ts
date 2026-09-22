import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { isAuthenticated } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LEADS_BLOB_PATH = 'data/leads.json'

interface StoredLead {
  id: string
  quotation?: {
    quoteId?: string
    pdfPath?: string
  }
}

async function readLeads(): Promise<StoredLead[]> {
  const { blobs } = await list({ prefix: LEADS_BLOB_PATH })
  if (blobs.length === 0) return []

  const response = await fetch(blobs[0].url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    cache: 'no-store',
  })
  if (!response.ok) return []

  const payload = await response.json()
  return Array.isArray(payload) ? payload : []
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leadId = request.nextUrl.searchParams.get('id')
    if (!leadId) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 })
    }

    const leads = await readLeads()
    const lead = leads.find(item => item.id === leadId)
    const pdfPath = lead?.quotation?.pdfPath
    const quoteId = lead?.quotation?.quoteId || ''
    const safeQuoteId = quoteId.replace(/[^a-zA-Z0-9_-]/g, '_')

    if (
      !lead ||
      !pdfPath ||
      !safeQuoteId ||
      !pdfPath.startsWith('data/quotations/') ||
      !pdfPath.includes(safeQuoteId)
    ) {
      return NextResponse.json({ error: 'Quotation PDF not found' }, { status: 404 })
    }

    const { blobs } = await list({ prefix: pdfPath })
    const blob = blobs.find(item => item.pathname === pdfPath) || blobs[0]

    if (!blob) {
      return NextResponse.json({ error: 'Quotation PDF not found' }, { status: 404 })
    }

    const response = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to read quotation PDF' }, { status: 502 })
    }

    const pdf = await response.arrayBuffer()
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${quoteId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Quotation download error:', error)
    return NextResponse.json({ error: 'Unable to download quotation PDF' }, { status: 500 })
  }
}
