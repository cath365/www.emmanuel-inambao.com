// Server-side only auth configuration. Never imported from client components.
import crypto from 'crypto'

function readRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v || !v.trim()) {
    console.warn(`⚠️  Missing env var: ${name} — admin login will not work. Set it in .env.local`)
    return ''
  }
  return v.trim()
}

export const AUTH_CONFIG = {
  adminEmail: readRequiredEnv('ADMIN_EMAIL'),
  adminPassword: readRequiredEnv('ADMIN_PASSWORD'),
  sessionSecret: readRequiredEnv('SESSION_SECRET'),
  sessionDuration: 24 * 60 * 60 * 1000,
  cookieName: 'portfolio_session',
}

export function validateCredentials(email: string, password: string): boolean {
  if (!AUTH_CONFIG.adminEmail || !AUTH_CONFIG.adminPassword) return false
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(email)
  const b = Buffer.from(AUTH_CONFIG.adminEmail)
  const p = Buffer.from(password)
  const q = Buffer.from(AUTH_CONFIG.adminPassword)
  const emailEq = a.length === b.length && crypto.timingSafeEqual(a, b)
  const passEq = p.length === q.length && crypto.timingSafeEqual(p, q)
  return emailEq && passEq
}

export interface SessionPayload {
  email: string
  iat: number
  exp: number
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

export function signSession(payload: Omit<SessionPayload, 'iat' | 'exp'>): string {
  const now = Date.now()
  const full: SessionPayload = { ...payload, iat: now, exp: now + AUTH_CONFIG.sessionDuration }
  const body = b64url(Buffer.from(JSON.stringify(full)))
  const sig = b64url(
    crypto.createHmac('sha256', AUTH_CONFIG.sessionSecret).update(body).digest()
  )
  return `${body}.${sig}`
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token || !AUTH_CONFIG.sessionSecret) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = b64url(
    crypto.createHmac('sha256', AUTH_CONFIG.sessionSecret).update(body).digest()
  )
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(b64urlDecode(body).toString()) as SessionPayload
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
