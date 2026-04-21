'use client'

import { MessageCircle } from 'lucide-react'
import { useProfile } from '@/lib/profile'

export default function WhatsAppQuickAction({ floatingVisible = true }: { floatingVisible?: boolean }) {
  const { profile } = useProfile()
  const phone = profile.phone.replace(/\D/g, '')
  const href = `https://wa.me/${phone}?text=${encodeURIComponent('Hello Emmanuel, I visited your portfolio and would like to discuss a project.')}`

  if (!floatingVisible) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-40 end-6 z-40 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
      aria-label="Send a WhatsApp message"
      title="WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  )
}
