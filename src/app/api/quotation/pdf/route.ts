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
    email?: string
    phone?: string
    company?: string
  }
  selection: ProjectQuoteSelection
}

type RGB = [number, number, number]

const PAGE_W = 595
const PAGE_H = 842
const NAVY: RGB = [0.063, 0.141, 0.243]
const BLUE: RGB = [0.322, 0.431, 0.541]
const GOLD: RGB = [0.702, 0.573, 0.333]
const IVORY: RGB = [0.969, 0.961, 0.937]
const LIGHT: RGB = [0.933, 0.945, 0.949]
const MID: RGB = [0.41, 0.455, 0.514]
const DARK: RGB = [0.16, 0.204, 0.259]
const WHITE: RGB = [1, 1, 1]
const BORDER: RGB = [0.84, 0.82, 0.78]

function clean(value: unknown) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

function pdfEscape(text: string) {
  return text
    .replace(/[–—]/g, '-')
    .replace(/×/g, 'x')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/([\\()])/g, '\\$1')
}

function rgb(color: RGB) {
  return color.map(value => value.toFixed(3)).join(' ')
}

function textCommand(
  text: string,
  x: number,
  y: number,
  size = 10,
  bold = false,
  color: RGB = DARK
) {
  return [
    'BT',
    `${rgb(color)} rg`,
    `/${bold ? 'F2' : 'F1'} ${size} Tf`,
    `1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm`,
    `(${pdfEscape(text)}) Tj`,
    'ET',
  ].join('\n')
}

function rectCommand(x: number, y: number, width: number, height: number, fill: RGB, stroke?: RGB) {
  const commands = ['q', `${rgb(fill)} rg`]
  if (stroke) {
    commands.push(`${rgb(stroke)} RG`, '0.8 w')
  }
  commands.push(`${x} ${y} ${width} ${height} re`, stroke ? 'B' : 'f', 'Q')
  return commands.join('\n')
}

function lineCommand(x1: number, y1: number, x2: number, y2: number, color: RGB = BORDER, width = 0.7) {
  return [
    'q',
    `${rgb(color)} RG`,
    `${width} w`,
    `${x1} ${y1} m`,
    `${x2} ${y2} l`,
    'S',
    'Q',
  ].join('\n')
}

function wrap(text: string, width = 82) {
  const words = clean(text).split(/\s+/)
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

function buildPdf(pageStreams: string[]) {
  const objects: string[] = []
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'

  const pageObjectNumbers: number[] = []
  const contentObjectNumbers: number[] = []
  let nextObject = 5

  for (let i = 0; i < pageStreams.length; i++) {
    pageObjectNumbers.push(nextObject++)
    contentObjectNumbers.push(nextObject++)
  }

  objects[2] = `<< /Type /Pages /Count ${pageStreams.length} /Kids [${pageObjectNumbers
    .map(number => `${number} 0 R`)
    .join(' ')}] >>`

  pageStreams.forEach((content, index) => {
    const pageObject = pageObjectNumbers[index]
    const contentObject = contentObjectNumbers[index]
    objects[pageObject] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`
    objects[contentObject] = `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`
  })

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (let i = 1; i < objects.length; i++) {
    offsets[i] = Buffer.byteLength(pdf, 'latin1')
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`
  }

  const xrefOffset = Buffer.byteLength(pdf, 'latin1')
  pdf += `xref\n0 ${objects.length}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i < objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return Buffer.from(pdf, 'latin1')
}

function buildProfessionalQuotation(body: PdfRequest) {
  const quotation = buildProjectQuotation(body.selection)
  const pages: string[][] = []
  let page: string[] = []
  let y = 0

  const addFooter = () => {
    page.push(lineCommand(46, 54, 549, 54, BORDER))
    page.push(textCommand('Emmanuel Inambao', 46, 37, 8.5, true, NAVY))
    page.push(textCommand('Systems Engineering | IoT | Robotics | Software | Zambia', 145, 37, 8, false, MID))
    page.push(textCommand(clean(body.quoteId), 475, 37, 8, false, MID))
  }

  const newPage = (continuation = false) => {
    if (page.length) {
      addFooter()
      pages.push(page)
    }
    page = []
    page.push(rectCommand(0, 0, PAGE_W, PAGE_H, WHITE))

    if (continuation) {
      page.push(rectCommand(0, 780, PAGE_W, 62, NAVY))
      page.push(textCommand('PROJECT QUOTATION', 46, 809, 17, true, WHITE))
      page.push(textCommand(`Quotation ${clean(body.quoteId)} - continued`, 46, 792, 8.5, false, LIGHT))
      page.push(rectCommand(46, 768, 74, 3, GOLD))
      y = 738
    } else {
      page.push(rectCommand(0, 690, PAGE_W, 152, NAVY))
      page.push(rectCommand(46, 714, 58, 58, BLUE))
      page.push(textCommand('EI', 63, 735, 20, true, WHITE))
      page.push(textCommand('PROJECT QUOTATION', 130, 758, 27, true, WHITE))
      page.push(textCommand('Software, mobile, IoT and connected systems', 130, 737, 10.5, false, LIGHT))
      page.push(textCommand('Prepared by Emmanuel Inambao', 130, 719, 9.5, false, LIGHT))
      page.push(rectCommand(46, 694, 86, 4, GOLD))
      y = 654
    }
  }

  const ensure = (height: number) => {
    if (y - height < 78) newPage(true)
  }

  const sectionTitle = (title: string) => {
    ensure(28)
    page.push(textCommand(title.toUpperCase(), 46, y, 9, true, BLUE))
    page.push(rectCommand(46, y - 8, 38, 2, GOLD))
    y -= 28
  }

  const paragraph = (text: string, width = 88, size = 9.5, lineHeight = 13) => {
    const lines = wrap(text, width)
    ensure(lines.length * lineHeight + 4)
    for (const line of lines) {
      page.push(textCommand(line, 46, y, size, false, DARK))
      y -= lineHeight
    }
    y -= 4
  }

  newPage(false)

  // Quote and client metadata
  page.push(rectCommand(46, 606, 503, 58, IVORY, BORDER))
  page.push(textCommand('QUOTATION', 62, 642, 8, true, MID))
  page.push(textCommand(clean(body.quoteId), 62, 622, 12, true, NAVY))
  page.push(textCommand('PREPARED FOR', 218, 642, 8, true, MID))
  page.push(textCommand(clean(body.client.name), 218, 622, 11, true, NAVY))
  page.push(textCommand('DATE', 432, 642, 8, true, MID))
  page.push(textCommand(new Date().toLocaleDateString('en-ZM'), 432, 622, 10, true, NAVY))
  y = 582

  if (body.client.company || body.client.email || body.client.phone) {
    sectionTitle('Client details')
    if (body.client.company) {
      page.push(textCommand('Organization', 46, y, 8.5, true, MID))
      page.push(textCommand(clean(body.client.company), 145, y, 9.5, false, DARK))
      y -= 17
    }
    if (body.client.email) {
      page.push(textCommand('Email', 46, y, 8.5, true, MID))
      page.push(textCommand(clean(body.client.email), 145, y, 9.5, false, DARK))
      y -= 17
    }
    if (body.client.phone) {
      page.push(textCommand('WhatsApp', 46, y, 8.5, true, MID))
      page.push(textCommand(clean(body.client.phone), 145, y, 9.5, false, DARK))
      y -= 17
    }
    y -= 9
  }

  sectionTitle('Project scope')
  paragraph(body.selection.projectDescription || 'Project scope to be finalized during discovery.')

  sectionTitle('Investment breakdown')
  ensure(32)
  page.push(rectCommand(46, y - 4, 503, 24, NAVY))
  page.push(textCommand('DELIVERABLE / FEATURE', 58, y + 4, 8.5, true, WHITE))
  page.push(textCommand('INVESTMENT', 452, y + 4, 8.5, true, WHITE))
  y -= 34

  for (const item of quotation.lineItems) {
    const reasonLines = wrap(item.reason, 76)
    const rowHeight = 28 + reasonLines.length * 11
    ensure(rowHeight + 6)

    page.push(textCommand(item.label, 58, y, 9.5, true, NAVY))
    page.push(
      textCommand(
        item.amount === null ? 'Custom quotation' : formatZmw(item.amount),
        452,
        y,
        9.5,
        true,
        NAVY
      )
    )
    y -= 15

    for (const line of reasonLines) {
      page.push(textCommand(line, 58, y, 8.2, false, MID))
      y -= 11
    }

    page.push(lineCommand(46, y - 4, 549, y - 4, BORDER))
    y -= 15
  }

  ensure(150)
  page.push(rectCommand(46, y - 120, 503, 120, IVORY, BORDER))
  page.push(textCommand('PROJECT TOTAL', 62, y - 22, 8.5, true, MID))
  page.push(textCommand(formatZmw(quotation.knownTotal), 62, y - 48, 22, true, NAVY))

  page.push(textCommand('UPFRONT PAYMENT', 304, y - 22, 8.5, true, MID))
  page.push(textCommand('35%', 304, y - 48, 22, true, GOLD))
  page.push(textCommand(formatZmw(quotation.upfrontAmount), 365, y - 48, 16, true, NAVY))
  page.push(
    textCommand(
      `${formatZmw(quotation.knownTotal)} x 35% = ${formatZmw(quotation.upfrontAmount)}`,
      304,
      y - 67,
      8.5,
      false,
      MID
    )
  )

  page.push(textCommand('REMAINING BALANCE', 62, y - 88, 8.5, true, MID))
  page.push(textCommand(`65% - ${formatZmw(quotation.balanceAmount)}`, 177, y - 88, 10, true, NAVY))
  y -= 142

  sectionTitle('Payment and quotation notes')
  paragraph(
    'The initial project payment is 35% of the known quotation total. The remaining 65% is the balance after the upfront payment. Any commercial adjustment outside these fixed rules requires Emmanuel Inambao to review and approve it.'
  )

  if (quotation.hasCustomPricing) {
    paragraph(
      'IoT / connected-device engineering is intentionally excluded from the known total until hardware, sensors, connectivity, power, enclosure, unit quantity and field requirements are confirmed.'
    )
  }

  if (body.selection.iotDetails) {
    ensure(70)
    page.push(rectCommand(46, y - 54, 503, 54, LIGHT, BORDER))
    page.push(textCommand('IoT discovery notes', 58, y - 17, 8.5, true, BLUE))
    const noteLines = wrap(body.selection.iotDetails, 80).slice(0, 3)
    let noteY = y - 32
    for (const line of noteLines) {
      page.push(textCommand(line, 58, noteY, 8.2, false, DARK))
      noteY -= 10
    }
    y -= 66
  }

  ensure(110)
  sectionTitle('Acceptance context')
  paragraph(
    'This document is a preliminary project estimate based on the scope selected by the client. Third-party fees, hosting, app-store fees, purchased hardware and requirements outside the listed scope are confirmed separately before implementation.'
  )

  page.push(rectCommand(46, y - 72, 503, 62, NAVY))
  page.push(textCommand('NEXT STEP', 62, y - 33, 8.5, true, GOLD))
  page.push(textCommand('Confirm scope with Emmanuel and proceed with the 35% upfront payment.', 62, y - 52, 10.5, true, WHITE))
  y -= 92

  addFooter()
  pages.push(page)

  return buildPdf(pages.map(commands => commands.join('\n')))
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PdfRequest

    const email = String(body?.client?.email || '').trim()
    const phoneDigits = String(body?.client?.phone || '').replace(/\D/g, '')

    if (
      !body?.quoteId ||
      !body?.client?.name ||
      !body?.selection ||
      (!email && phoneDigits.length < 7) ||
      (email && !/^\S+@\S+\.\S+$/.test(email))
    ) {
      return new Response('Missing or invalid quotation details', { status: 400 })
    }

    const pdf = buildProfessionalQuotation(body)

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
