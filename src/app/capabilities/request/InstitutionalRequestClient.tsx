'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'

interface InstitutionalBrief {
  contactName: string
  jobTitle: string
  email: string
  phone: string
  organization: string
  organizationType: string
  department: string
  country: string
  projectTitle: string
  procurementReference: string
  procurementStage: string
  problem: string
  requiredSystem: string
  sites: string
  devices: string
  connectivity: string
  integrations: string
  security: string
  documentation: string
  training: string
  timeline: string
  budget: string
  notes: string
}

const EMPTY_BRIEF: InstitutionalBrief = {
  contactName: '',
  jobTitle: '',
  email: '',
  phone: '',
  organization: '',
  organizationType: 'Government / public institution',
  department: '',
  country: '',
  projectTitle: '',
  procurementReference: '',
  procurementStage: 'Early requirements / market research',
  problem: '',
  requiredSystem: '',
  sites: '',
  devices: '',
  connectivity: '',
  integrations: '',
  security: '',
  documentation: '',
  training: '',
  timeline: '',
  budget: '',
  notes: '',
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <label className="text-sm text-dark-300">
      {label}{required ? ' *' : ''}
      <input
        required={required}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition placeholder:text-dark-600 focus:border-primary-500"
      />
    </label>
  )
}

function Area({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
}) {
  return (
    <label className="block text-sm text-dark-300">
      {label}{required ? ' *' : ''}
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition placeholder:text-dark-600 focus:border-primary-500"
      />
    </label>
  )
}

export default function InstitutionalRequestClient() {
  const { profile } = useProfile()
  const [brief, setBrief] = useState<InstitutionalBrief>(EMPTY_BRIEF)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const set = <K extends keyof InstitutionalBrief,>(key: K, value: InstitutionalBrief[K]) => {
    setBrief(current => ({ ...current, [key]: value }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    setMessage('')

    const details = [
      'INSTITUTIONAL PROJECT / RFQ BRIEF',
      '',
      `Organization: ${brief.organization}`,
      `Organization type: ${brief.organizationType}`,
      `Department / unit: ${brief.department || 'Not specified'}`,
      `Country / region: ${brief.country}`,
      `Contact: ${brief.contactName}`,
      `Job title: ${brief.jobTitle || 'Not specified'}`,
      `Phone: ${brief.phone || 'Not specified'}`,
      '',
      `Project title: ${brief.projectTitle}`,
      `Tender / RFP / procurement reference: ${brief.procurementReference || 'Not specified'}`,
      `Procurement stage: ${brief.procurementStage}`,
      '',
      'PROBLEM / OBJECTIVE',
      brief.problem,
      '',
      'REQUIRED SYSTEM / DELIVERABLE',
      brief.requiredSystem,
      '',
      `Sites / locations: ${brief.sites || 'Not specified'}`,
      `Estimated devices / users / assets: ${brief.devices || 'Not specified'}`,
      `Connectivity conditions: ${brief.connectivity || 'Not specified'}`,
      `Existing integrations / systems: ${brief.integrations || 'Not specified'}`,
      `Security / data requirements: ${brief.security || 'Not specified'}`,
      `Documentation / handover: ${brief.documentation || 'Not specified'}`,
      `Training / capacity building: ${brief.training || 'Not specified'}`,
      `Target timeline: ${brief.timeline || 'Not specified'}`,
      `Budget / procurement range: ${brief.budget || 'Not specified'}`,
      '',
      'ADDITIONAL NOTES',
      brief.notes || 'None',
    ].join('\n')

    try {
      const response = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `institutional-${Date.now()}`,
          name: brief.contactName,
          email: brief.email,
          service: `Institutional RFQ: ${brief.organizationType} — ${brief.projectTitle}`,
          details,
          submittedAt: new Date().toISOString(),
          status: 'new',
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit the brief.')
      }

      setStatus('success')
      setMessage('Your institutional brief has been received for technical review.')
      setBrief(EMPTY_BRIEF)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to submit right now. Please email the brief directly.')
    }
  }

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container max-w-5xl">
        <Link href="/capabilities" className="inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> Engineering capability
        </Link>

        <section className="mt-6 rounded-3xl border border-dark-800 bg-dark-900/60 p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">Institutional project / RFQ brief</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Send enough context for a useful technical review.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-300">
            Designed for government institutions, aviation/transport organizations, companies, NGOs, universities and other teams evaluating a technology project, procurement requirement or technical partnership.
          </p>
        </section>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">1. Organization & contact</h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Contact name" required value={brief.contactName} onChange={value => set('contactName', value)} placeholder="Full name" />
              <Field label="Work email" required type="email" value={brief.email} onChange={value => set('email', value)} placeholder="name@organization.org" />
              <Field label="Job title / role" value={brief.jobTitle} onChange={value => set('jobTitle', value)} placeholder="ICT Manager, Procurement Officer..." />
              <Field label="Phone / WhatsApp" value={brief.phone} onChange={value => set('phone', value)} placeholder="+260..." />
              <Field label="Organization" required value={brief.organization} onChange={value => set('organization', value)} placeholder="Institution or company name" />
              <Field label="Department / unit" value={brief.department} onChange={value => set('department', value)} placeholder="ICT, Engineering, Operations..." />
              <label className="text-sm text-dark-300">
                Organization type *
                <select
                  required
                  value={brief.organizationType}
                  onChange={event => set('organizationType', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition focus:border-primary-500"
                >
                  <option>Government / public institution</option>
                  <option>Aviation / airport / airline</option>
                  <option>Transport / logistics</option>
                  <option>Industrial / utility company</option>
                  <option>NGO / development organization</option>
                  <option>University / research institution</option>
                  <option>Private company</option>
                  <option>Other institution</option>
                </select>
              </label>
              <Field label="Country / region" required value={brief.country} onChange={value => set('country', value)} placeholder="Country and city/region" />
            </div>
          </section>

          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <h2 className="text-2xl font-bold text-white">2. Requirement & procurement context</h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Project / requirement title" required value={brief.projectTitle} onChange={value => set('projectTitle', value)} placeholder="e.g. Remote Equipment Monitoring System" />
              <Field label="Tender / RFP / procurement reference" value={brief.procurementReference} onChange={value => set('procurementReference', value)} placeholder="Reference number if available" />
              <label className="text-sm text-dark-300 sm:col-span-2">
                Procurement stage
                <select
                  value={brief.procurementStage}
                  onChange={event => set('procurementStage', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition focus:border-primary-500"
                >
                  <option>Early requirements / market research</option>
                  <option>Request for information (RFI)</option>
                  <option>Request for quotation (RFQ)</option>
                  <option>Request for proposal (RFP)</option>
                  <option>Formal tender</option>
                  <option>Direct technical engagement</option>
                  <option>Employment / consultancy opportunity</option>
                </select>
              </label>
            </div>

            <div className="mt-4 space-y-4">
              <Area label="Problem / operational objective" required value={brief.problem} onChange={value => set('problem', value)} placeholder="What problem is the organization trying to solve? What happens today, and what needs to improve?" />
              <Area label="Required system / deliverable" required value={brief.requiredSystem} onChange={value => set('requiredSystem', value)} placeholder="Describe the expected device, application, portal, monitoring system, integration, automation or technical deliverable." />
            </div>
          </section>

          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">3. Technical & delivery constraints</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Sites / locations" value={brief.sites} onChange={value => set('sites', value)} placeholder="1 site, 12 branches, national..." />
              <Field label="Devices / users / assets" value={brief.devices} onChange={value => set('devices', value)} placeholder="Approximate quantity if known" />
              <Field label="Connectivity conditions" value={brief.connectivity} onChange={value => set('connectivity', value)} placeholder="Stable fibre, mobile data, intermittent, offline..." />
              <Field label="Existing systems / integrations" value={brief.integrations} onChange={value => set('integrations', value)} placeholder="ERP, API, database, payment system..." />
              <Field label="Target timeline" value={brief.timeline} onChange={value => set('timeline', value)} placeholder="Desired start / completion" />
              <Field label="Budget / procurement range" value={brief.budget} onChange={value => set('budget', value)} placeholder="Optional range / currency" />
            </div>

            <div className="mt-4 space-y-4">
              <Area label="Security / data requirements" value={brief.security} onChange={value => set('security', value)} placeholder="Access control, confidential data, hosting constraints, audit requirements..." rows={3} />
              <Area label="Documentation / handover requirements" value={brief.documentation} onChange={value => set('documentation', value)} placeholder="Technical manual, architecture, source code handover, deployment guide..." rows={3} />
              <Area label="Training / capacity building" value={brief.training} onChange={value => set('training', value)} placeholder="Staff training, administrator handover, operator guidance..." rows={3} />
              <Area label="Additional notes" value={brief.notes} onChange={value => set('notes', value)} placeholder="Any standards, environmental conditions, procurement instructions or other context." rows={3} />
            </div>
          </section>

          <section className="rounded-2xl border border-primary-500/20 bg-primary-950/20 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Submit for technical review</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dark-400">
                  No commitment or quotation is created automatically. The brief provides enough context to evaluate technical fit and determine the appropriate next discussion.
                </p>
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn-primary shrink-0 disabled:opacity-50">
                <Send className="h-4 w-4" />
                {status === 'sending' ? 'Submitting...' : 'Submit brief'}
              </button>
            </div>

            {status === 'success' && (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {message}
              </div>
            )}

            {status === 'error' && (
              <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {message}
              </div>
            )}

            <div className="mt-5 border-t border-dark-800 pt-5 text-sm text-dark-500">
              Have an RFP/tender document to share? Reference it above, then send the document to{' '}
              <a href={`mailto:${profile.email}?subject=Institutional%20RFP%20Document`} className="text-primary-300 hover:text-primary-200">
                {profile.email}
              </a>.
            </div>
          </section>
        </form>

        <div className="mt-8 flex justify-center">
          <Link href="/hire/dossier" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200">
            Review professional dossier →
          </Link>
        </div>
      </div>
    </main>
  )
}
