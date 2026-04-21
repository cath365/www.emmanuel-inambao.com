import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, AUTH_CONFIG, signSession } from '@/lib/auth-config'
import { cookies } from 'next/headers'

// Simple rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip)
  if (!attempts) return false
  
  // Reset if lockout period has passed
  if (Date.now() - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip)
    return false
  }
  
  return attempts.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(ip)
    return
  }
  
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
  loginAttempts.set(ip, {
    count: attempts.count + 1,
    lastAttempt: Date.now(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate credentials on server
    const isValid = validateCredentials(email, password)
    
    // Record the attempt
    recordAttempt(ip, isValid)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const sessionToken = signSession({ email })

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set(AUTH_CONFIG.cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.sessionDuration / 1000, // in seconds
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: { email },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
