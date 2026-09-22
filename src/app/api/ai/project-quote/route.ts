import { NextRequest, NextResponse } from 'next/server'
import {
  buildProjectQuotation,
  fallbackQuoteExplanation,
  quotationSummary,
  type ProjectQuoteSelection,
} from '@/lib/project-quotation'

export const runtime = 'nodejs'

interface QuoteAssistantRequest {
  question: string
  selection: ProjectQuoteSelection
}

function sanitizeQuestion(value: unknown) {
  return String(value || '').trim().slice(0, 1200)
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuoteAssistantRequest
    const question = sanitizeQuestion(body.question)

    if (!question || !body.selection) {
      return NextResponse.json({ error: 'Question and quote context are required.' }, { status: 400 })
    }

    const quotation = buildProjectQuotation(body.selection)
    const fallback = fallbackQuoteExplanation(body.selection, quotation)
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        response: fallback,
        provider: 'pricing-engine',
        groqConfigured: false,
      })
    }

    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 9000)

    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 450,
          messages: [
            {
              role: 'system',
              content: [
                'You are the project quotation assistant for Emmanuel Inambao.',
                'Your job is to explain a quotation clearly and help a prospective client understand scope.',
                'You MUST NOT invent, change, discount, increase or recalculate any price.',
                'The deterministic pricing engine is the only authority for price.',
                'Website base price is ZMW 5,000.',
                'E-commerce is an additional ZMW 3,000.',
                'Admin dashboard is an additional ZMW 2,500.',
                'Payment integration is an additional ZMW 2,000.',
                'Mobile application base price is ZMW 12,000.',
                'IoT integration is always custom-priced after technical discovery.',
                'If asked for a discount, say Emmanuel can review commercial terms after scope confirmation, but do not promise one.',
                'If IoT is selected, explain that hardware, sensors, connectivity, quantity, power and enclosure requirements affect the final amount.',
                'Be concise, professional and easy to understand. Use ZMW, not USD.',
              ].join(' '),
            },
            {
              role: 'user',
              content: [
                `Client question: ${question}`,
                '',
                'Current deterministic quotation:',
                quotationSummary(body.selection, quotation),
              ].join('\n'),
            },
          ],
        }),
      })

      if (!groqResponse.ok) {
        console.error('Groq quote assistant error:', groqResponse.status, await groqResponse.text())
        return NextResponse.json({
          response: fallback,
          provider: 'pricing-engine',
          groqConfigured: true,
        })
      }

      const data = await groqResponse.json()
      const response = String(data?.choices?.[0]?.message?.content || '').trim()

      return NextResponse.json({
        response: response || fallback,
        provider: response ? 'groq' : 'pricing-engine',
        groqConfigured: true,
      })
    } catch (error) {
      console.error('Groq quote assistant request failed:', error)
      return NextResponse.json({
        response: fallback,
        provider: 'pricing-engine',
        groqConfigured: true,
      })
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error('Quote assistant error:', error)
    return NextResponse.json({ error: 'Unable to answer that quote question right now.' }, { status: 500 })
  }
}
