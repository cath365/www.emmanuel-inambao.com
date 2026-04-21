import { cookies } from 'next/headers'
import { AUTH_CONFIG, verifySession, SessionPayload } from './auth-config'

async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(AUTH_CONFIG.cookieName)
  return verifySession(sessionCookie?.value)
}

export async function isAuthenticated(): Promise<boolean> {
  return (await readSession()) !== null
}

export async function getCurrentUser(): Promise<{ email: string } | null> {
  const session = await readSession()
  return session ? { email: session.email } : null
}
