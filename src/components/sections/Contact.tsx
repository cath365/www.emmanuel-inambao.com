'use client'

import { useState } from 'react'
import { AlertCircle, ArrowUpRight, CheckCircle2, Github, Linkedin, Loader2, Mail, MapPin, Send } from 'lucide-react'
import { useProfile } from '@/lib/profile'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const projectTypes = [
  'AI and Machine Learning',
  'IoT and Embedded Systems',
  'Robotics and Automation',
  'Mobile Application',
  'Full-Stack Web Application',
  'Technical Consultation',
  'Other',
]

const budgetRanges = [
  'Not decided yet',
  'Under ZMW 5,000',
  'ZMW 5,000–15,000',
  'ZMW 15,000–50,000',
  'Above ZMW 50,000',
  'Prefer to discuss privately',
]

export default function Contact() {
  const { profile } = useProfile()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', projectType: '', budget: '', message: '' })

  const socialLinks = [
    profile.socialLinks.github ? { label: 'GitHub', href: profile.socialLinks.github, icon: Github } : null,
    profile.socialLinks.linkedin ? { label: 'LinkedIn', href: profile.socialLinks.linkedin, icon: Linkedin } : null,
  ].filter(Boolean) as Array<{ label: string; href: string; icon: typeof Github }>

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const form = event.currentTarget
    const honeypot = form.elements.namedItem('_honeypot') as HTMLInputElement | null

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: formData.projectType, _honeypot: honeypot?.value || '' }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to send your message right now.')

      setStatus('success')
      setFormData({ name: '', email: '', projectType: '', budget: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send your message. Please use the email address shown here instead.')
    }
  }

  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-base text-brand-navy outline-none transition placeholder:text-brand-chocolate/40 focus:border-brand-chocolate focus:ring-2 focus:ring-brand-chocolate/15'

  return (
    <section id="contact" className="bg-brand-sky py-20 text-brand-chocolate sm:py-24 lg:py-28" aria-labelledby="contact-heading">
      <div className="section-container">
        <div className="grid gap-10 border-t border-brand-chocolate/20 pt-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-chocolate/70">Contact</p>
            <h2 id="contact-heading" className="mt-4 font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-brand-chocolate sm:text-6xl">
              Build something useful.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-chocolate/75 sm:text-lg">
              Tell me what you are building, the problem you want to solve and where you need engineering support. Written communication is preferred for project enquiries.
            </p>

            <div className="mt-9 grid gap-3">
              <a href={'mailto:' + profile.email} className="flex items-center gap-4 rounded-xl border border-brand-chocolate/20 bg-brand-chocolate/[0.05] p-4 transition hover:bg-brand-chocolate/[0.09]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-chocolate text-brand-sky"><Mail className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-chocolate/60">Email</span>
                  <span className="mt-1 block truncate text-sm font-semibold text-brand-chocolate">{profile.email}</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-brand-chocolate/20 bg-brand-chocolate/[0.05] p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-chocolate text-brand-sky"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-chocolate/60">Location</span>
                  <span className="mt-1 block text-sm font-semibold text-brand-chocolate">Lusaka, Zambia</span>
                </span>
              </div>
            </div>

            {socialLinks.length ? (
              <div className="mt-7 flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-chocolate transition hover:opacity-70">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {social.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-brand-cream p-5 text-brand-navy shadow-[0_24px_70px_rgba(0,11,38,0.14)] sm:p-7 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-chocolate/60">Project enquiry</p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-brand-navy sm:text-4xl">Send a clear project brief.</h3>

            <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="contact-company">Company website</label>
                <input id="contact-company" type="text" name="_honeypot" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="text-sm font-semibold">Name</label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-semibold">Email</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-project-type" className="text-sm font-semibold">Project type</label>
                  <select id="contact-project-type" name="projectType" required value={formData.projectType} onChange={handleChange} className={inputClass}>
                    <option value="">Select project type</option>
                    {projectTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-budget" className="text-sm font-semibold">Budget range</label>
                  <select id="contact-budget" name="budget" required value={formData.budget} onChange={handleChange} className={inputClass}>
                    <option value="">Select a range</option>
                    {budgetRanges.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="text-sm font-semibold">Message</label>
                <textarea id="contact-message" name="message" required minLength={20} maxLength={5000} rows={7} value={formData.message} onChange={handleChange} className={`${inputClass} py-3 leading-7`} placeholder="What problem are you solving, what already exists, and what would you like me to help build?" />
              </div>

              <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 text-sm font-semibold text-brand-camel transition hover:bg-brand-chocolate hover:text-brand-sky disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Sending</> : <><Send className="h-4 w-4" aria-hidden="true" />Submit Project Enquiry</>}
              </button>

              <div aria-live="polite" aria-atomic="true">
                {status === 'success' ? <div className="flex gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><p>Your message was sent successfully. Thank you for the clear project brief.</p></div> : null}
                {status === 'error' ? <div role="alert" className="flex gap-3 rounded-xl border border-red-600/20 bg-red-50 p-4 text-sm text-red-900"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><p>{errorMessage} You can also email {profile.email}.</p></div> : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
