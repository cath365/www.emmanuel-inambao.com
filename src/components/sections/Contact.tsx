'use client'

import { useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from 'lucide-react'
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  })

  const socialLinks = [
    profile.socialLinks.github
      ? { label: 'GitHub', href: profile.socialLinks.github, icon: Github }
      : null,
    profile.socialLinks.linkedin
      ? { label: 'LinkedIn', href: profile.socialLinks.linkedin, icon: Linkedin }
      : null,
  ].filter(Boolean) as Array<{
    label: string
    href: string
    icon: typeof Github
  }>

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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
        body: JSON.stringify({
          ...formData,
          subject: formData.projectType,
          _honeypot: honeypot?.value || '',
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to send your message right now.')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        message: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to send your message. Please use the email address shown here instead.',
      )
    }
  }

  return (
    <section
      id="contact"
      className="content-auto bg-brand-chocolate py-20 text-brand-cream sm:py-24 lg:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="editorial-label !text-brand-camel">Contact</p>
            <h2
              id="contact-heading"
              className="mt-4 font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-brand-cream sm:text-6xl"
            >
              Build something useful.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-cream/72 sm:text-lg">
              Tell me what you are building, the problem you want to solve and where you need
              engineering support. Written communication is preferred for project enquiries.
            </p>

            <div className="mt-9 grid gap-3">
              <a
                href={'mailto:' + profile.email}
                className="group flex items-center gap-4 rounded-2xl border border-brand-cream/12 p-4 transition hover:border-brand-sky/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-sky/15 text-brand-sky">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-camel">
                    Email
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-brand-cream">
                    {profile.email}
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-brand-cream/12 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-camel/15 text-brand-camel">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-camel">
                    Location
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-brand-cream">
                    Lusaka, Zambia
                  </span>
                </span>
              </div>
            </div>

            {socialLinks.length ? (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-cream/45">
                  Professional links
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-cream/15 px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-sky hover:text-brand-sky"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {social.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] bg-brand-cream p-5 text-brand-navy shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-7 lg:p-9">
            <div className="mb-7">
              <p className="editorial-label">Project enquiry</p>
              <h3 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Send a clear project brief.
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5" noValidate={false}>
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="contact-company">Company website</label>
                <input
                  id="contact-company"
                  type="text"
                  name="_honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="text-sm font-semibold">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 min-h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-base outline-none transition placeholder:text-brand-chocolate/35 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/25"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 min-h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-base outline-none transition placeholder:text-brand-chocolate/35 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/25"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-project-type" className="text-sm font-semibold">
                    Project type
                  </label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="mt-2 min-h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-base outline-none transition focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/25"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((projectType) => (
                      <option key={projectType} value={projectType}>
                        {projectType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-budget" className="text-sm font-semibold">
                    Budget range
                  </label>
                  <select
                    id="contact-budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="mt-2 min-h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-base outline-none transition focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/25"
                  >
                    <option value="">Select a range</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 w-full resize-y rounded-xl border border-brand-navy/15 bg-white px-4 py-3 text-base leading-7 outline-none transition placeholder:text-brand-chocolate/35 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/25"
                  placeholder="What problem are you solving, what already exists, and what would you like me to help build?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition hover:bg-brand-chocolate disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Submit Project Enquiry
                  </>
                )}
              </button>

              <div aria-live="polite" aria-atomic="true">
                {status === 'success' ? (
                  <div className="flex gap-3 rounded-2xl border border-emerald-600/20 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <p>Your message was sent successfully. Thank you for the clear project brief.</p>
                  </div>
                ) : null}

                {status === 'error' ? (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-2xl border border-red-600/20 bg-red-50 p-4 text-sm text-red-900"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <p>
                      {errorMessage} You can also email {profile.email}.
                    </p>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
