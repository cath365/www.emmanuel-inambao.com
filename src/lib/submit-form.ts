'use client'

// Keep a Response-shaped API so every form handles HTTP and delivery failures.
export async function submitPortfolioForm(url: string, options: RequestInit): Promise<Response> {
  const response = await fetch(url, options)
  const result = await response.json().catch(() => ({ error: 'The service returned an invalid response. Please try again.' }))
  if (!response.ok || !result.browserNotification) {
    return Response.json(result, { status: response.ok && result.success !== true ? 503 : response.status })
  }
  const { browserNotification, ...safeResult } = result
  try {
    const delivery = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(browserNotification), signal: AbortSignal.timeout(15000),
    })
    const receipt = await delivery.json().catch(() => null)
    if (delivery.ok && receipt?.success === true) {
      delete safeResult.error
      return Response.json({ ...safeResult, success: true, emailSent: true, emailProvider: 'web3forms' })
    }
  } catch { /* A saved request remains available to the owner if email fails. */ }
  if (safeResult.saved) return Response.json({ ...safeResult, success: true, emailSent: false })
  return Response.json({ ...safeResult, success: false,
    error: 'Your request could not be delivered. Please try again or email denuelinambao@gmail.com.' }, { status: 503 })
}
