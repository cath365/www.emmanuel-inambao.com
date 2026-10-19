'use client'

import { useEffect } from 'react'

/**
 * Content contexts fetch the published Blob snapshots on mount. When an editor in
 * another tab completes a verified save, refresh the public page so every
 * context (projects, profile, credentials, media, etc.) sees the same snapshot.
 * Admin pages are deliberately excluded to avoid discarding unsaved drafts.
 */
export default function PortfolioPublicationSync() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    const key = 'portfolio_last_published_change'
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || !event.newValue) return
      try {
        const publish = JSON.parse(event.newValue) as { key?: string }
        if (typeof publish.key === 'string') window.location.reload()
      } catch {
        // Ignore malformed browser storage messages.
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  return null
}
