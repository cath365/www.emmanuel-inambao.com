'use client'

export type PortfolioSaveState = 'saving' | 'saved' | 'error'

export interface PortfolioSaveEventDetail {
  key: string
  state: PortfolioSaveState
  message?: string
}

function emit(detail: PortfolioSaveEventDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<PortfolioSaveEventDetail>('portfolio-save-state', { detail }))
}

export async function persistPortfolioData(key: string, data: unknown) {
  emit({ key, state: 'saving' })

  try {
    const response = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ key, data }),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok || payload?.success !== true) {
      const message = payload?.error || `Unable to save ${key}.`
      throw new Error(message)
    }

    emit({ key, state: 'saved' })

    // Lets other open portfolio tabs refresh after a successful admin change.
    try {
      localStorage.setItem(
        'portfolio_last_published_change',
        JSON.stringify({ key, at: Date.now() })
      )
    } catch {
      // localStorage can be unavailable in privacy-restricted browsers.
    }

    return payload
  } catch (error) {
    const message = error instanceof Error ? error.message : `Unable to save ${key}.`
    emit({ key, state: 'error', message })
    throw error
  }
}
