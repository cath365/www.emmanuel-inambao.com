import 'server-only'

type GroqMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function groqChat(
  messages: GroqMessage[],
  options?: { maxTokens?: number; temperature?: number; json?: boolean },
) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      temperature: options?.temperature ?? 0.35,
      max_completion_tokens: options?.maxTokens ?? 900,
      ...(options?.json ? { response_format: { type: 'json_object' } } : {}),
    }),
    signal: AbortSignal.timeout(20_000),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error('Groq provider error:', response.status, detail.slice(0, 500))
    throw new Error('Groq provider unavailable')
  }

  const payload = await response.json()
  const text = payload?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Groq returned an empty response')
  }

  return text.trim()
}
