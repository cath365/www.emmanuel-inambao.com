/**
 * Normalize phone numbers for wa.me links.
 * Zambian local mobile numbers like 097..., 096..., 077... become 260...
 * Numbers from other countries must include the international country code.
 * Valid formatting does not confirm the phone has a WhatsApp account.
 */
export function normalizeWhatsAppNumber(value?: string | null): string | null {
  const raw = (value || '').trim()
  if (!raw || !/^\+?[0-9\s()\-]+$/.test(raw)) return null
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (/^0[79]\d{8}$/.test(digits)) digits = '260' + digits.slice(1)
  else if (/^[79]\d{8}$/.test(digits)) digits = '260' + digits
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null
}
