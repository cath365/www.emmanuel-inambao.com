import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_CONFIG, verifySession } from '@/lib/auth-config'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(AUTH_CONFIG.cookieName)
  const session = verifySession(sessionCookie?.value)

  if (!session) {
    if (sessionCookie) cookieStore.delete(AUTH_CONFIG.cookieName)
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    user: { email: session.email },
  })
}
