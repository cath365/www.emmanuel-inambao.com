import 'server-only'
import { NextResponse } from 'next/server'

type Notice = { name?: string; email?: string; subject: string; message: string }

export function emailConfiguration() {
  return {
    resend: Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim()),
    formspree: Boolean(process.env.FORMSPREE_ID?.trim()),
    web3forms: Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim()),
  }
}

export async function notifyOwner(notice: Notice) {
  const config = emailConfiguration()
  const failures: string[] = []
  if (config.resend) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM!.trim(),
          to: [process.env.NOTIFICATION_EMAIL?.trim() || 'denuelinambao@gmail.com'],
          subject: notice.subject, text: notice.message,
          ...(notice.email ? { reply_to: notice.email } : {}),
        }),
      })
      const result = await response.json().catch(() => null)
      if (response.ok && result?.id) return { emailSent: true, emailProvider: 'resend', emailProviderConfigured: true }
      failures.push(`Resend HTTP ${response.status}`)
    } catch { failures.push('Resend unavailable') }
  }
  if (config.formspree) {
    try {
      const response = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_ID!.trim()}`, {
        method: 'POST', signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...notice, _subject: notice.subject }),
      })
      const result = await response.json().catch(() => null)
      if (response.ok && result?.ok === true) return { emailSent: true, emailProvider: 'formspree', emailProviderConfigured: true }
      failures.push(`Formspree HTTP ${response.status}`)
    } catch { failures.push('Formspree unavailable') }
  }
  if (failures.length) console.error('Owner notification failed:', failures.join('; '))
  // Web3Forms explicitly requires browser requests. Its form access key is
  // designed to be public; never include Blob, Resend or Cloudinary secrets here.
  return {
    emailSent: false, emailProvider: null,
    emailProviderConfigured: Object.values(config).some(Boolean),
    ...(config.web3forms ? { browserNotification: {
      access_key: process.env.WEB3FORMS_ACCESS_KEY!.trim(),
      ...notice, from_name: 'Emmanuel Inambao Portfolio',
      ...(notice.email ? { replyto: notice.email } : {}),
    } } : {}),
  }
}

export async function submissionResponse(saved: boolean, notice: Notice, message: string) {
  const notification = await notifyOwner(notice)
  const success = saved || notification.emailSent
  return NextResponse.json({
    ...notification, saved, success, message,
    ...(!success ? { error: 'Your request could not be saved or delivered. Please try again or use the direct email option.' } : {}),
  }, { status: success ? 200 : ('browserNotification' in notification && notification.browserNotification) ? 202 : 503 })
}
