import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json(
    {
      provider: 'groq',
      configured: Boolean(process.env.GROQ_API_KEY),
      chatModel: process.env.GROQ_CHAT_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      caseStudyModel: process.env.GROQ_CASE_STUDY_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
