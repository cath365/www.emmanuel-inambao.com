'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Loader2, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { useProfile } from '@/lib/profile'

export default function Contact() {
  const { profile } = useProfile()
  const phoneDigits = profile.phone.replace(/\D/g, '')
  const whatsappMessage = encodeURIComponent('Hello Emmanuel, I visited your portfolio and would like to discuss a project.')

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus('loading')
    setErrorMessage('')

    const honeypot = event.currentTarget.querySelector<HTMLInputElement>('input[name="_honeypot"]')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, _honeypot: honeypot?.value || '' }),
      })
      const result = await response.json().catch(() => ({}))

      if (response.ok && result.success) {
        setFormStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setFormStatus('error')
        setErrorMessage(result.error || 'Unable to send your message. Please use email or WhatsApp instead.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please use email or WhatsApp instead.')
    }
  }

  return (
    <section id="contact" className="bg-[#F7F3EC] py-20 text-[#000B26] lg:py-28" aria-labelledby="contact-heading">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#7B5F3E]">Start a conversation</p>
            <h2 id="contact-heading" className="editorial-serif mt-4 max-w-xl text-5xl leading-[0.95] sm:text-6xl">
              Have a system that needs to exist?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#000B26]/58">
              Share the problem, the operating environment and what success should look like. A useful engineering conversation starts with the constraint, not the technology.
            </p>

            <div className="mt-9 border-t border-[#000B26]/20">
              <a href={`mailto:${profile.email}`} className="flex items-center justify-between border-b border-[#000B26]/15 py-4 text-sm font-semibold">
                <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#7B5F3E]" />{profile.email}</span>
                <span>↗</span>
              </a>
              <a
                href={`https://wa.me/${phoneDigits}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-[#000B26]/15 py-4 text-sm font-semibold"
              >
                <span className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[#7B5F3E]" />WhatsApp</span>
                <span>↗</span>
              </a>
              <div className="flex items-center gap-3 border-b border-[#000B26]/15 py-4 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-[#7B5F3E]" />
                {profile.location}
              </div>
            </div>

            <Link
              href="/start-project"
              className="mt-8 inline-flex items-center gap-2 border-b border-[#000B26] pb-1 text-sm font-bold"
            >
              Use the full project brief <span>↗</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            className="border border-[#000B26]/20 bg-white p-5 sm:p-7"
          >
            <div className="border-b border-[#000B26]/15 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B5F3E]">Quick message</p>
              <h3 className="editorial-serif mt-2 text-3xl">Tell me what you are building.</h3>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <input
                type="text"
                name="_honeypot"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px]"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/48">
                  Name
                  <input
                    required
                    value={formData.name}
                    onChange={event => setFormData(current => ({ ...current, name: event.target.value }))}
                    className="mt-2 w-full border border-[#000B26]/20 bg-[#F7F3EC] px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[#000B26]"
                  />
                </label>

                <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/48">
                  Email
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={event => setFormData(current => ({ ...current, email: event.target.value }))}
                    className="mt-2 w-full border border-[#000B26]/20 bg-[#F7F3EC] px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[#000B26]"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/48">
                Topic
                <select
                  required
                  value={formData.subject}
                  onChange={event => setFormData(current => ({ ...current, subject: event.target.value }))}
                  className="mt-2 w-full border border-[#000B26]/20 bg-[#F7F3EC] px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[#000B26]"
                >
                  <option value="">Choose one</option>
                  <option value="project">New engineering project</option>
                  <option value="consultation">Technical consultation</option>
                  <option value="partnership">Partnership</option>
                  <option value="training">Robotics / technical training</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/48">
                Message
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={event => setFormData(current => ({ ...current, message: event.target.value }))}
                  placeholder="What problem are you trying to solve?"
                  className="mt-2 w-full resize-none border border-[#000B26]/20 bg-[#F7F3EC] px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none placeholder:text-[#000B26]/28 focus:border-[#000B26]"
                />
              </label>

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="flex w-full items-center justify-center gap-2 bg-[#000B26] px-5 py-3.5 text-sm font-bold text-[#F7F3EC] transition hover:bg-[#10203E] disabled:opacity-60"
              >
                {formStatus === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {formStatus === 'loading' ? 'Sending…' : 'Send message'}
              </button>

              {formStatus === 'success' && (
                <div className="flex items-center gap-2 border border-green-700/20 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  Message sent successfully.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="flex items-start gap-2 border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errorMessage}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
