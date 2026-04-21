// Simple in-memory rate limiter for API routes.
// For production at scale, consider Redis-backed rate limiting (e.g. @upstash/ratelimit).

const store: Record<string, { count: number; resetAt: number }> = {}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  const keys = Object.keys(store)
  for (let i = 0; i < keys.length; i++) {
    if (store[keys[i]].resetAt <= now) delete store[keys[i]]
  }
}, 60_000)

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check and consume a rate limit token.
 * @param key   Unique identifier (e.g. IP or IP+route)
 * @param limit Max requests within the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = store[key]

  if (!entry || entry.resetAt <= now) {
    store[key] = { count: 1, resetAt: now + windowMs }
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}
