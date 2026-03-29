'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return

    // Get or create session ID
    let sessionId = sessionStorage.getItem('_vsid')
    if (!sessionId) {
      sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem('_vsid', sessionId)
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || 'direct',
        sessionId,
        screenWidth: window.innerWidth,
      }),
    }).catch(() => {}) // fire and forget — never block the page
  }, [pathname])

  return null
}
