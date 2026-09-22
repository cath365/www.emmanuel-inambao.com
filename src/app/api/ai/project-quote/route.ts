import { NextRequest, NextResponse } from 'next/server'
import { createGroqCompletion } from '@/lib/groq'
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

    const groq = await createGroqCompletion({
      model: process.env.GROQ_QUOTE_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.25,
      maxCompletionTokens: 650,
      reasoningEffort: 'low',
      timeoutMs: 12_000,
      messages: [
        {
          role: 'system',
          content: [
            'You are Emmanuel Inambao\'s project sales and quotation assistant.',
            'Your job is to understand the client, explain value, handle price objections professionally, encourage a sensible next step and help the client reach a confident decision without pressure.',
            'The deterministic pricing engine is the ONLY authority for prices and calculations.',
            'Never invent, alter, hide, discount or increase a deterministic charge.',
            'Website base price is ZMW 5,000.',
            'E-commerce is an additional ZMW 3,000.',
            'Admin dashboard is an additional ZMW 2,500.',
            'Payment integration is an additional ZMW 2,000.',
            'Mobile application base price is ZMW 12,000.',
            'Every additional custom software feature selected by the client is ZMW 350.',
            'IoT integration is always custom-priced after technical discovery.',
            'The upfront payment is exactly 35% of the known total. Always show the arithmetic when discussing the upfront amount.',
            'The remaining balance is exactly 65% of the known total.',
            'If the client says the price is too high, acknowledge the budget concern, explain the value of the selected scope, show the 35% upfront amount, and suggest reducing or phasing optional features rather than changing fixed prices.',
            'You may suggest an MVP or phased delivery when it genuinely helps the client fit a budget.',
            'If asked for a discount, explain that Emmanuel must personally approve any commercial adjustment after scope review; do not promise or calculate a discount.',
            'Do not use fake scarcity, misleading urgency, guilt, or pressure tactics.',
            'If IoT is selected, explain that hardware, sensors, connectivity, quantity, power, enclosure and field conditions affect the final amount.',
            'Third-party fees, purchased hardware, hosting and requirements outside the selected scope are not automatically included.',
            'Be persuasive through clarity, value and practical trade-offs. Be concise, professional, warm and easy to understand. Use ZMW, not USD.',
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
    })

    if (!groq.ok) {
      if (groq.reason !== 'not_configured') {
        console.error('Groq quote assistant error:', groq.status, groq.detail)
      }

      return NextResponse.json({
        response: fallback,
        provider: 'pricing-engine',
        groqConfigured: groq.reason !== 'not_configured',
      })
    }

    return NextResponse.json({
      response: groq.text,
      provider: 'groq',
      model: groq.model,
      groqConfigured: true,
    })
  } catch (error) {
    console.error('Quote assistant error:', error)
    return NextResponse.json({ error: 'Unable to answer that quote question right now.' }, { status: 500 })
  }
}
