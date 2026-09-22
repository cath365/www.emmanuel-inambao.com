import { NextRequest } from 'next/server'
import {
  buildProjectQuotation,
  formatZmw,
  type ProjectQuoteSelection,
} from '@/lib/project-quotation'

export const runtime = 'nodejs'

interface PdfRequest {
  quoteId: string
  client: {
    name: string
    email: string
    company?: string
  }
  selection: ProjectQuoteSelection
}

function clean(value: unknown) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

function wrap(text: string, width = 78) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    if (!word) continue
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > width && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function pdfEscape(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/([\\()])/g, '\\$1')
}

function buildSimplePdf(lines: string[]) {
  const pageLineLimit = 47
  const pages: string[][] = []
  for (let i = 0; i < lines.length; i += pageLineLimit) {
    pages.push(lines.slice(i, i + pageLineLimit))
  }

  const objects: string[] = []
  const pageObjectNumbers: number[] = []
  const contentObjectNumbers: number[] = []

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  let nextObject = 4
  for (let i = 0; i < pages.length; i++) {
    pageObjectNumbers.push(nextObject++)
    contentObjectNumbers.push(nextObject++)
  }

  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectNumbers
    .map(n => `${n} 0 R`)
    .join(' ')}] >>`

  pages.forEach((pageLines, index) => {
    const content = [
      'BT',
      '/F1 10 Tf',
      '50 795 Td',
      '14 TL',
      ...pageLines.flatMap((line, lineIndex) => {
        const escaped = pdfEscape(line)
        return lineIndex === 0 ? [`(${escaped}) Tj`] : ['T*', `(${escaped}) Tj`]
      }),
      'ET',
    ].join('\n')

    const pageObject = pageObjectNumbers[index]
    const contentObject = contentObjectNumbers[index]

    objects[pageObject] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObject} 0 R >>`
    objects[contentObject] = `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`
  })

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue
    offsets[i] = Buffer.byteLength(pdf, 'latin1')
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`
  }

  const xrefOffset = Buffer.byteLength(pdf, 'latin1')
  pdf += `xref\n0 ${objects.length}\n`
  pdf += '0000000000 65535 f \n'

  for (let i = 1; i < objects.length; i++) {
    const offset = offsets[i] || 0
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return Buffer.from(pdf, 'latin1')
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PdfRequest

    if (!body?.quoteId || !body?.client?.name || !body?.client?.email || !body?.selection) {
      return new Response('Missing quotation details', { status: 400 })
    }

    const quotation = buildProjectQuotation(body.selection)
    const lines: string[] = [
      'EMMANUEL INAMBAO - PROJECT QUOTATION',
      'Embedded Systems | IoT | Robotics | Full-Stack Systems',
      '',
      `Quotation: ${clean(body.quoteId)}`,
      `Prepared for: ${clean(body.client.name)}`,
      `Email: ${clean(body.client.email)}`,
      body.client.company ? `Company: ${clean(body.client.company)}` : '',
      `Prepared: ${new Date().toLocaleDateString('en-ZM')}`,
      '',
      'PROJECT SCOPE',
      ...wrap(clean(body.selection.projectDescription || 'Project scope to be finalized during discovery.')),
      '',
      'PRICE BREAKDOWN',
    ].filter(Boolean)

    for (const item of quotation.lineItems) {
      lines.push(
        `${item.label}: ${item.amount === null ? 'CUSTOM QUOTATION' : formatZmw(item.amount)}`
      )
      lines.push(...wrap(`Reason: ${item.reason}`))
      lines.push('')
    }

    lines.push('KNOWN SUBTOTAL')
    lines.push(formatZmw(quotation.knownTotal))
    lines.push('')

    if (quotation.hasCustomPricing) {
      lines.push('CUSTOM-PRICED ITEMS')
      lines.push(
        ...wrap(
          'IoT / connected-device engineering is not included in the known subtotal. The final amount depends on hardware, sensors, connectivity, power, enclosure, quantity and field requirements.'
        )
      )
      if (body.selection.iotDetails) {
        lines.push(...wrap(`Client IoT notes: ${clean(body.selection.iotDetails)}`))
      }
      lines.push('')
    }

    if (body.selection.mobileApplication) {
      lines.push(`Mobile platform: ${clean(body.selection.mobilePlatform)}`)
    }
    lines.push(`Requested timeline: ${clean(body.selection.timeline)}`)
    lines.push('')
    lines.push('NOTE')
    lines.push(
      ...wrap(
        'This quotation is based on the scope selected by the client. Any requirements outside the listed scope, third-party fees, hosting charges, hardware purchases or custom IoT engineering are subject to final confirmation before implementation.'
      )
    )
    lines.push('')
    lines.push('Prepared by Emmanuel Inambao')
    lines.push('Engineering Systems - Zambia')

    const pdf = buildSimplePdf(lines)

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${clean(body.quoteId)}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Quotation PDF error:', error)
    return new Response('Unable to generate quotation PDF', { status: 500 })
  }
}
