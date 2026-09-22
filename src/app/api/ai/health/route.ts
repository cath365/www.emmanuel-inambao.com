import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    provider: 'groq',
    configured: Boolean(process.env.GROQ_API_KEY),
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  })
}
