import 'server-only'

export type GroqMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type GroqRequestOptions = {
  messages: GroqMessage[]
  model?: string
  maxCompletionTokens?: number
  temperature?: number
  reasoningEffort?: 'low' | 'medium' | 'high'
  responseFormat?: { type: 'text' | 'json_object' }
  timeoutMs?: number
}

export type GroqResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: 'not_configured' | 'provider_error' | 'empty_response'; status?: number; detail?: string }

export async function createGroqCompletion(options: GroqRequestOptions): Promise<GroqResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'not_configured' }
  }

  const model = options.model || process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        max_completion_tokens: options.maxCompletionTokens ?? 900,
        temperature: options.temperature ?? 0.25,
        reasoning_effort: options.reasoningEffort ?? 'low',
        reasoning_format: options.responseFormat?.type === 'json_object' ? 'hidden' : undefined,
        response_format: options.responseFormat ?? { type: 'text' },
      }),
      signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
    })

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 800)
      return {
        ok: false,
        reason: 'provider_error',
        status: response.status,
        detail,
      }
    }

    const payload = await response.json()
    const text = payload?.choices?.[0]?.message?.content

    if (typeof text !== 'string' || !text.trim()) {
      return { ok: false, reason: 'empty_response' }
    }

    return { ok: true, text: text.trim(), model }
  } catch (error) {
    return {
      ok: false,
      reason: 'provider_error',
      detail: error instanceof Error ? error.message : String(error),
    }
  }
}
