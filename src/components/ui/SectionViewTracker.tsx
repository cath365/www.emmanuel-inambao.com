'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'services',
  'certifications',
  'testimonials',
  'education',
  'gallery',
  'faq',
  'contact',
]

export default function SectionViewTracker() {
  const pathname = usePathname()
  const seenRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Track only on home page where section ids exist.
    if (pathname !== '/') return

    let sessionId = sessionStorage.getItem('_vsid')
    if (!sessionId) {
      sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem('_vsid', sessionId)
    }

    const sectionEls = SECTION_IDS
      .map(id => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => Boolean(x.el))

    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          const id = target.id
          if (!id || seenRef.current.has(id)) return

          seenRef.current.add(id)

          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: `/#${id}`,
              referrer: 'section-view',
              sessionId,
              screenWidth: window.innerWidth,
            }),
          }).catch(() => {})
        })
      },
      {
        threshold: 0.35,
      }
    )

    sectionEls.forEach(({ el }) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
