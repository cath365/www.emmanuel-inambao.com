import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { createGroqCompletion } from '@/lib/groq'
import { marketRangeSummary, resolveMarketPricing } from '@/lib/market-pricing'
import {
  buildProjectQuotation,
  fallbackQuoteExplanation,
  projectImprovementIdeas,
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

async function readMarketPricing() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
    if (!token) return resolveMarketPricing(null)

    const { blobs } = await list({
      prefix: 'data/portfolio/marketPricing.json',
      token,
    })
    if (blobs.length === 0) return resolveMarketPricing(null)

    const url = new URL(blobs[0].url)
    url.searchParams.set('v', String(Date.now()))
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return resolveMarketPricing(null)

    return resolveMarketPricing(await response.json())
  } catch {
    return resolveMarketPricing(null)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuoteAssistantRequest
    const question = sanitizeQuestion(body.question)

    if (!question || !body.selection) {
      return NextResponse.json({ error: 'Question and quote context are required.' }, { status: 400 })
    }

    const quotation = buildProjectQuotation(body.selection)
    const marketPricing = await readMarketPricing()
    const marketRanges = marketRangeSummary(marketPricing)
      .filter(item => ['basic-website', 'business-website', 'ecommerce'].includes(item.category))
    const marketText = marketPricing.enabled && marketRanges.length > 0
      ? [
          `Approved Zambia public-market benchmark (updated ${marketPricing.updatedAt}):`,
          ...marketRanges.map(item =>
            `- ${item.label}: about ZMW ${item.min.toLocaleString('en-ZM')} to ZMW ${item.max.toLocaleString('en-ZM')} across ${item.sourceCount} approved reference${item.sourceCount === 1 ? '' : 's'}`
          ),
          'Use these as context only. They do not replace Emmanuel\'s deterministic prices.',
        ].join('\n')
      : 'No Zambia market benchmark is currently enabled.'

    const improvements = projectImprovementIdeas(body.selection, quotation)
    const improvementText = improvements.length
      ? [
          'Approved improvement ideas with deterministic price impact:',
          ...improvements.map(idea =>
            `- ${idea.title} [${idea.stage}]: WITHOUT: ${idea.withoutChange} WITH: ${idea.withChange} Added investment +ZMW ${idea.priceImpact.toLocaleString('en-ZM')}; new known total ZMW ${idea.newKnownTotal.toLocaleString('en-ZM')}; 35% upfront increases by ZMW ${idea.upfrontImpact.toLocaleString('en-ZM')}. Practical impact: ${idea.impact}`
          ),
        ].join('\n')
      : 'No deterministic improvement suggestion is currently triggered by the client description.'

    const fallbackBase = fallbackQuoteExplanation(body.selection, quotation)
    const asksAboutMarket = /\b(expensive|cheap|affordable|market|zambia|competitor|agency|developer|compare|comparison)\b/i.test(question)
    const fallback = asksAboutMarket
      ? `${fallbackBase}\n\n${marketText}`
      : fallbackBase

    const groq = await createGroqCompletion({
      model: process.env.GROQ_QUOTE_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.25,
      maxCompletionTokens: 950,
      reasoningEffort: 'low',
      timeoutMs: 12_000,
      messages: [
        {
          role: 'system',
          content: [
            'You are Emmanuel Inambao\'s project sales and quotation assistant.',
            'Your job is to act as a project strategist and sales assistant: understand what the client is trying to achieve, explain how the proposed system will help, identify useful improvements, explain the business or operational impact of each improvement, handle price objections professionally, and help the client reach a confident decision without pressure.',
            'Do not behave like a passive quotation bot. Proactively translate the client description into the likely users, workflow, problem being solved and measurable operational outcomes, while clearly labelling assumptions that the client has not confirmed.',
            'For each selected paid item, explain the outcome it enables before discussing its price. For each suggested improvement, explain the problem it solves, who benefits, what changes in the workflow, the exact added price, the new known total, and the exact 35% upfront increase.',
            'Use a value-difference method: describe the client experience WITHOUT the improvement, then WITH the improvement, then connect the difference to the added investment. The client must be able to see what changed for the money instead of seeing a price alone.',
            'When useful, separate recommendations into Core now, High-impact improvement, and Later phase so a budget-conscious client can see what is essential versus optional without feeling pressured.',
            'If the client describes a business, school, agriculture, NGO, government, healthcare, retail or field-service use case, adapt the explanation to that operating context instead of giving generic software marketing language.',
            'The deterministic pricing engine is the ONLY authority for prices and calculations.',
            'Whenever you recommend a priced improvement, use only an approved improvement supplied in the user context or an already-selected deterministic line item.',
            'For every approved improvement you mention, show: current known total -> price increase -> new known total -> change to the 35% upfront payment, then explain the practical benefit the client receives for that increase.',
            'Do not present a feature as automatically included when it is not selected.',
            'If a potentially valuable idea is not covered by the approved deterministic improvements or fixed pricing rules, describe it as an idea that requires scope review and do not invent a price.',
            'When answering broad questions, structure the response in short sections: What you are building, Why this is different from a basic version, Before vs after improvements, Price impact, Recommended next step.',
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
            'When the client asks whether the quotation is expensive, cheap, competitive, affordable, or how Zambia agencies/developers charge, use the supplied approved Zambia market benchmark as context. State that it is a public reference benchmark and never use it to silently alter the deterministic quote.',
            'You may suggest an MVP or phased delivery when it genuinely helps the client fit a budget.',
            'If asked for a discount, explain that Emmanuel must personally approve any commercial adjustment after scope review; do not promise or calculate a discount.',
            'Do not use fake scarcity, misleading urgency, guilt, or pressure tactics.',
            'If IoT is selected, explain that hardware, sensors, connectivity, quantity, power, enclosure and field conditions affect the final amount.',
            'Third-party fees, purchased hardware, hosting and requirements outside the selected scope are not automatically included.',
            'Be persuasive through clarity, value and practical trade-offs. Explain outcomes in client language such as saving staff time, reducing manual work, improving customer access, reducing payment friction, improving reliability, or making management easier when those outcomes are genuinely supported by the selected scope.',
            'Explain differentiation in plain language: what makes this proposed system more useful than a basic website/app or a competitor offering only the minimum. Do not attack competitors or claim superiority without evidence; focus on the concrete workflow and capability differences in the selected scope.',
            'Never guarantee revenue, profit, adoption or business success. Present benefits as practical potential, not promises.',
            'Be concise, professional, warm and easy to understand. Use ZMW, not USD.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Client question: ${question}`,
            '',
            'Current deterministic quotation:',
            quotationSummary(body.selection, quotation),
            '',
            marketText,
            '',
            improvementText,
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
