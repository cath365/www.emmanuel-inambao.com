'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, CheckCircle2, MessageCircle } from 'lucide-react'
import { useProfile } from '@/lib/profile'

type ProjectType = 'iot-prototype' | 'industrial-automation' | 'embedded-product' | 'web-dashboard' | 'custom'
type Complexity = 'basic' | 'standard' | 'advanced'
type Timeline = 'normal' | 'fast' | 'urgent'

interface QuoteForm {
  name: string
  email: string
  company: string
  projectType: ProjectType
  complexity: Complexity
  timeline: Timeline
  hardwareUnits: number
  needsDashboard: boolean
  needsCloud: boolean
  integrations: number
  supportMonths: number
  budget: string
  details: string
}

const DEFAULT_FORM: QuoteForm = {
  name: '',
  email: '',
  company: '',
  projectType: 'iot-prototype',
  complexity: 'standard',
  timeline: 'normal',
  hardwareUnits: 1,
  needsDashboard: true,
  needsCloud: false,
  integrations: 1,
  supportMonths: 1,
  budget: '',
  details: '',
}

function estimateQuote(form: QuoteForm) {
  const typeBase: Record<ProjectType, number> = {
    'iot-prototype': 700,
    'industrial-automation': 2500,
    'embedded-product': 1800,
    'web-dashboard': 900,
    'custom': 1200,
  }
  const complexityFactor: Record<Complexity, number> = {
    basic: 0.85,
    standard: 1,
    advanced: 1.45,
  }
  const timelineFactor: Record<Timeline, number> = {
    normal: 1,
    fast: 1.2,
    urgent: 1.45,
  }

  let base = typeBase[form.projectType]
  base += Math.max(0, form.hardwareUnits - 1) * 140
  if (form.needsDashboard) base += 600
  if (form.needsCloud) base += 500
  base += form.integrations * 120
  base += form.supportMonths * 80

  const final = base * complexityFactor[form.complexity] * timelineFactor[form.timeline]
  return {
    min: Math.round(final * 0.85),
    max: Math.round(final * 1.2),
  }
}

export default function StartProjectPage() {
  const { profile } = useProfile()
  const [form, setForm] = useState<QuoteForm>(DEFAULT_FORM)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const quote = useMemo(() => estimateQuote(form), [form])

  const summary = [
    `Project type: ${form.projectType}`,
    `Complexity: ${form.complexity}`,
    `Timeline: ${form.timeline}`,
    `Hardware units: ${form.hardwareUnits}`,
    `Dashboard: ${form.needsDashboard ? 'Yes' : 'No'}`,
    `Cloud: ${form.needsCloud ? 'Yes' : 'No'}`,
    `Integrations: ${form.integrations}`,
    `Support: ${form.supportMonths} month(s)`,
    `Estimated range: $${quote.min} - $${quote.max}`,
    `Budget provided: ${form.budget || 'Not specified'}`,
    `Details: ${form.details || 'Not provided'}`,
  ].join('\n')

  const waLink = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello Emmanuel, I would like a project quote.\n\n${summary}`
  )}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `quote-${Date.now()}`,
          name: form.name,
          email: form.email,
          service: `Project Quote (${form.projectType})`,
          details: summary,
          submittedAt: new Date().toISOString(),
          status: 'new',
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm(DEFAULT_FORM)
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="section-container max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-dark-900/60 border border-dark-700 rounded-2xl p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Start Your Project</h1>
            <p className="text-dark-400 mb-6">
              Fill this quick questionnaire to get an instant estimate and send your requirements directly.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your email" className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
              </div>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />

              <div className="grid sm:grid-cols-3 gap-4">
                <select value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value as ProjectType })} className="px-3 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white">
                  <option value="iot-prototype">IoT Prototype</option>
                  <option value="industrial-automation">Industrial Automation</option>
                  <option value="embedded-product">Embedded Product</option>
                  <option value="web-dashboard">Web Dashboard</option>
                  <option value="custom">Custom Solution</option>
                </select>
                <select value={form.complexity} onChange={e => setForm({ ...form, complexity: e.target.value as Complexity })} className="px-3 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="advanced">Advanced</option>
                </select>
                <select value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value as Timeline })} className="px-3 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white">
                  <option value="normal">Normal Timeline</option>
                  <option value="fast">Fast Track</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input type="number" min={1} value={form.hardwareUnits} onChange={e => setForm({ ...form, hardwareUnits: Math.max(1, Number(e.target.value) || 1) })} placeholder="Hardware units" className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
                <input type="number" min={0} value={form.integrations} onChange={e => setForm({ ...form, integrations: Math.max(0, Number(e.target.value) || 0) })} placeholder="Integrations" className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
                <input type="number" min={0} value={form.supportMonths} onChange={e => setForm({ ...form, supportMonths: Math.max(0, Number(e.target.value) || 0) })} placeholder="Support months" className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-dark-300">
                <label className="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.needsDashboard} onChange={e => setForm({ ...form, needsDashboard: e.target.checked })} /> Need dashboard</label>
                <label className="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.needsCloud} onChange={e => setForm({ ...form, needsCloud: e.target.checked })} /> Need cloud</label>
              </div>

              <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="Your budget range (optional)" className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />
              <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} rows={5} placeholder="Project details, goals, constraints..." className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white" />

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">{status === 'sending' ? 'Sending...' : 'Send Request'}</button>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Direct
                </a>
              </div>

              {status === 'success' && (
                <p className="text-green-400 text-sm inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Request sent successfully. Check your admin Leads tab.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm">Could not send right now. Please try WhatsApp Direct.</p>
              )}
            </form>
          </section>

          <aside className="bg-dark-900/60 border border-primary-500/30 rounded-2xl p-6 sm:p-8 h-fit">
            <div className="inline-flex items-center gap-2 text-primary-400 mb-3">
              <Calculator className="w-5 h-5" />
              Live Estimate
            </div>
            <p className="text-3xl font-bold text-white mb-1">${quote.min.toLocaleString()} - ${quote.max.toLocaleString()}</p>
            <p className="text-dark-500 text-xs mb-6">Estimated range based on current answers</p>

            <h3 className="text-white font-semibold mb-3">How We Work</h3>
            <ol className="space-y-2 text-sm text-dark-300 list-decimal list-inside">
              <li>Discovery call and scope definition</li>
              <li>Architecture and implementation plan</li>
              <li>Build, test, and deployment</li>
              <li>Handover, training, and support</li>
            </ol>
          </aside>
        </div>
      </div>
    </main>
  )
}
