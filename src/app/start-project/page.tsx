'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bot,
  Calculator,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Globe2,
  LayoutDashboard,
  MessageCircle,
  Plus,
  RefreshCcw,
  Send,
  ShoppingCart,
  Smartphone,
  Cpu,
  X,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import {
  buildProjectQuotation,
  formatZmw,
  quotationSummary,
  type ProjectQuoteSelection,
  type ProjectTimeline,
  type MobilePlatform,
} from '@/lib/project-quotation'

type Step =
  | 'deliverables'
  | 'extras'
  | 'mobile'
  | 'iot'
  | 'description'
  | 'timeline'
  | 'contact'
  | 'review'
  | 'done'

interface ClientDetails {
  name: string
  email: string
  company: string
}

const DEFAULT_SELECTION: ProjectQuoteSelection = {
  website: false,
  ecommerce: false,
  adminDashboard: false,
  paymentIntegration: false,
  mobileApplication: false,
  mobilePlatform: 'not-sure',
  iotIntegration: false,
  iotDetails: '',
  customFeatures: [],
  projectDescription: '',
  timeline: 'flexible',
}

const DEFAULT_CLIENT: ClientDetails = {
  name: '',
  email: '',
  company: '',
}

const timelineLabels: Record<ProjectTimeline, string> = {
  flexible: 'Flexible / discuss with Emmanuel',
  '4-8-weeks': '4–8 weeks',
  '2-4-weeks': '2–4 weeks',
  urgent: 'Urgent / under 2 weeks',
}

const mobileLabels: Record<MobilePlatform, string> = {
  android: 'Android',
  ios: 'iOS',
  both: 'Android + iOS',
  'not-sure': 'Not sure yet',
}

function ToggleCard({
  selected,
  onClick,
  icon: Icon,
  title,
  detail,
}: {
  selected: boolean
  onClick: () => void
  icon: typeof Globe2
  title: string
  detail: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-32 w-full flex-col items-start rounded-sm border p-5 text-left transition-colors ${
        selected
          ? 'border-[#526E8A] bg-[#EEF2F4] dark:border-primary-500 dark:bg-primary-900/20'
          : 'border-[#DDD7CC] bg-white/65 hover:border-[#AAB6C2] dark:border-dark-700 dark:bg-dark-800/40 dark:hover:border-dark-600'
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <Icon className="h-6 w-6 text-[#526E8A] dark:text-primary-400" />
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? 'border-[#526E8A] bg-[#526E8A] text-white dark:border-primary-500 dark:bg-primary-500'
              : 'border-[#C9C3B8] dark:border-dark-600'
          }`}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </span>
      </div>
      <span className="mt-4 font-semibold text-[#10243E] dark:text-white">{title}</span>
      <span className="mt-1 text-sm leading-6 text-[#667384] dark:text-dark-400">{detail}</span>
    </button>
  )
}

export default function StartProjectPage() {
  const { profile } = useProfile()
  const [selection, setSelection] = useState<ProjectQuoteSelection>(DEFAULT_SELECTION)
  const [client, setClient] = useState<ClientDetails>(DEFAULT_CLIENT)
  const [step, setStep] = useState<Step>('deliverables')
  const [aiQuestion, setAiQuestion] = useState('Why does this quotation cost this amount?')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [quoteId, setQuoteId] = useState('')
  const [featureDraft, setFeatureDraft] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState({ saved: false, emailSent: false })

  const quotation = useMemo(() => buildProjectQuotation(selection), [selection])
  const anyDeliverable = selection.website || selection.mobileApplication || selection.iotIntegration

  const toggle = (key: 'website' | 'mobileApplication' | 'iotIntegration') => {
    setSelection(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const addCustomFeature = () => {
    const feature = featureDraft.trim()
    if (!feature) return
    setSelection(prev => {
      const exists = prev.customFeatures.some(item => item.toLowerCase() === feature.toLowerCase())
      if (exists || prev.customFeatures.length >= 30) return prev
      return { ...prev, customFeatures: [...prev.customFeatures, feature] }
    })
    setFeatureDraft('')
  }

  const removeCustomFeature = (index: number) => {
    setSelection(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const goForward = () => {
    if (step === 'deliverables') {
      if (!anyDeliverable) return
      if (selection.website || selection.mobileApplication) setStep('extras')
      else if (selection.iotIntegration) setStep('iot')
      else setStep('description')
      return
    }
    if (step === 'extras') {
      if (selection.mobileApplication) setStep('mobile')
      else if (selection.iotIntegration) setStep('iot')
      else setStep('description')
      return
    }
    if (step === 'mobile') {
      if (selection.iotIntegration) setStep('iot')
      else setStep('description')
      return
    }
    if (step === 'iot') {
      setStep('description')
      return
    }
    if (step === 'description') {
      if (!selection.projectDescription.trim()) return
      setStep('timeline')
      return
    }
    if (step === 'timeline') {
      setStep('contact')
      return
    }
    if (step === 'contact') {
      if (!client.name.trim() || !/^\S+@\S+\.\S+$/.test(client.email)) return
      setStep('review')
      void askAi(
        'Explain this quotation to the client, explain why each selected item is charged, show the 35% upfront calculation, and encourage a sensible next step without changing any fixed price.'
      )
    }
  }

  const goBack = () => {
    if (step === 'extras') setStep('deliverables')
    else if (step === 'mobile') setStep('extras')
    else if (step === 'iot') {
      if (selection.mobileApplication) setStep('mobile')
      else if (selection.website) setStep('extras')
      else setStep('deliverables')
    } else if (step === 'description') {
      if (selection.iotIntegration) setStep('iot')
      else if (selection.mobileApplication) setStep('mobile')
      else if (selection.website) setStep('extras')
      else setStep('deliverables')
    } else if (step === 'timeline') setStep('description')
    else if (step === 'contact') setStep('timeline')
    else if (step === 'review') setStep('contact')
  }

  const askAi = async (questionOverride?: string) => {
    const question = (questionOverride || aiQuestion).trim()
    if (!question) return
    setAiLoading(true)
    setAiAnswer('')

    try {
      const response = await fetch('/api/ai/project-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, selection }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to answer')
      setAiAnswer(data.response)
    } catch {
      setAiAnswer(
        'I could not reach the AI service right now. The displayed prices are still calculated by the fixed portfolio pricing engine and remain valid for this preliminary quotation.'
      )
    } finally {
      setAiLoading(false)
    }
  }

  const buildLeadDetails = (id: string) => {
    return [
      'ACCEPTED AI PROJECT QUOTATION',
      `Quotation ID: ${id}`,
      `Client: ${client.name}`,
      `Company: ${client.company || 'Not specified'}`,
      `Email: ${client.email}`,
      '',
      quotationSummary(selection, quotation),
      '',
      'Client accepted this preliminary quotation and generated the downloadable PDF.',
    ].join('\n')
  }

  const generateAndSend = async () => {
    setStatus('sending')
    setErrorMessage('')

    const id =
      quoteId ||
      `EI-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-5)}`
    setQuoteId(id)

    try {
      const pdfResponse = await fetch('/api/quotation/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: id,
          client,
          selection,
          store: true,
        }),
      })

      if (!pdfResponse.ok) {
        throw new Error('The quotation PDF could not be generated.')
      }

      const pdfPath = pdfResponse.headers.get('X-Quotation-Pdf-Path') || ''
      const blob = await pdfResponse.blob()

      const leadResponse = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `quote-${id}`,
          name: client.name,
          email: client.email,
          service: 'Accepted AI Project Quotation',
          details: buildLeadDetails(id),
          submittedAt: new Date().toISOString(),
          quotation: {
            quoteId: id,
            selection,
            pdfPath,
            clientCompany: client.company,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      const leadResult = await leadResponse.json().catch(() => ({}))

      if (!leadResponse.ok) {
        throw new Error(leadResult.error || 'The quotation could not be delivered to Emmanuel.')
      }

      setDeliveryStatus({
        saved: leadResult.saved === true,
        emailSent: leadResult.emailSent === true,
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${id}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)

      setStatus('success')
      setStep('done')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unable to complete quotation.')
    }
  }

  const reset = () => {
    setSelection(DEFAULT_SELECTION)
    setClient(DEFAULT_CLIENT)
    setStep('deliverables')
    setAiAnswer('')
    setAiQuestion('Why does this quotation cost this amount?')
    setFeatureDraft('')
    setQuoteId('')
    setDeliveryStatus({ saved: false, emailSent: false })
    setStatus('idle')
    setErrorMessage('')
  }

  const waLink = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello Emmanuel, I would like to discuss a project quotation.\n\n${quotationSummary(selection, quotation)}`
  )}`

  return (
    <main className="min-h-screen bg-[#F7F5EF] pb-16 pt-24 text-[#293442] dark:bg-dark-950 dark:text-dark-100">
      <div className="section-container max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#526E8A] hover:text-[#10243E] dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-400">
            AI project quotation
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium text-[#10243E] dark:text-white sm:text-5xl">
            Tell the assistant what you want to build.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#667384] dark:text-dark-400">
            The assistant asks for the scope, explains every charge and prepares a downloadable quotation.
            Prices are calculated from fixed rules — the AI cannot invent or change them.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="rounded-sm border border-[#DDD7CC] bg-[#FCFBF7] p-5 dark:border-dark-700 dark:bg-dark-900/70 sm:p-8">
            <div className="mb-7 flex items-start gap-4 border-b border-[#E1DBD1] pb-6 dark:border-dark-800">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10243E] text-white dark:bg-primary-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A8491] dark:text-dark-500">
                  Emmanuel&apos;s AI project assistant
                </p>
                <p className="mt-1 text-base leading-7 text-[#39495A] dark:text-dark-200">
                  {step === 'deliverables' && 'What do you want Emmanuel to build? Select everything that applies.'}
                  {step === 'extras' && 'Which additional software features does the project need?'}
                  {step === 'mobile' && 'Which mobile platform should the application support?'}
                  {step === 'iot' && 'Tell me about the connected hardware so Emmanuel can prepare the custom IoT portion.'}
                  {step === 'description' && 'What should the finished system actually do for you or your organization?'}
                  {step === 'timeline' && 'When would you like the project delivered? This does not automatically change the displayed price.'}
                  {step === 'contact' && 'Who should the quotation be prepared for?'}
                  {step === 'review' && 'Here is the preliminary quotation. Review the scope and ask me anything before accepting it.'}
                  {step === 'done' && 'Your quotation is complete.'}
                </p>
              </div>
            </div>

            {step === 'deliverables' && (
              <div className="grid gap-3 sm:grid-cols-3">
                <ToggleCard
                  selected={selection.website}
                  onClick={() => toggle('website')}
                  icon={Globe2}
                  title="Website"
                  detail={`Base price ${formatZmw(5000)}`}
                />
                <ToggleCard
                  selected={selection.mobileApplication}
                  onClick={() => toggle('mobileApplication')}
                  icon={Smartphone}
                  title="Mobile application"
                  detail={`Base price ${formatZmw(12000)}`}
                />
                <ToggleCard
                  selected={selection.iotIntegration}
                  onClick={() => toggle('iotIntegration')}
                  icon={Cpu}
                  title="IoT integration"
                  detail="Custom quotation after hardware discovery"
                />
              </div>
            )}

            {step === 'extras' && (
              <div className="space-y-3">
                {selection.website && (
                  <ToggleCard
                    selected={selection.ecommerce}
                    onClick={() => setSelection(prev => ({ ...prev, ecommerce: !prev.ecommerce }))}
                    icon={ShoppingCart}
                    title="E-commerce"
                    detail="+ ZMW 3,000 — product catalogue, cart, checkout and order workflows"
                  />
                )}
                <ToggleCard
                  selected={selection.adminDashboard}
                  onClick={() => setSelection(prev => ({ ...prev, adminDashboard: !prev.adminDashboard }))}
                  icon={LayoutDashboard}
                  title="Admin dashboard"
                  detail="+ ZMW 2,500 — protected management screens and operational controls"
                />
                <ToggleCard
                  selected={selection.paymentIntegration}
                  onClick={() => setSelection(prev => ({ ...prev, paymentIntegration: !prev.paymentIntegration }))}
                  icon={CreditCard}
                  title="Payment integration"
                  detail="+ ZMW 2,000 — gateway integration, verification and payment-flow testing"
                />
                <div className="rounded-sm border border-[#D8D2C8] bg-[#F6F3EC] p-5 dark:border-dark-700 dark:bg-dark-900/60">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-[#10243E] dark:text-white">Additional custom features</p>
                    <p className="text-sm leading-6 text-[#697483] dark:text-dark-400">
                      Add any extra feature not covered above. Each additional feature adds exactly ZMW 350 to the quotation.
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={featureDraft}
                      onChange={e => setFeatureDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomFeature()
                        }
                      }}
                      placeholder="Example: SMS notifications"
                      className="min-w-0 flex-1 rounded-sm border border-[#D4CEC4] bg-white px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                    />
                    <button type="button" onClick={addCustomFeature} className="btn-secondary">
                      <Plus className="h-4 w-4" /> Add feature
                    </button>
                  </div>
                  {selection.customFeatures.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selection.customFeatures.map((feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-sm border border-[#DDD7CC] bg-white/70 px-3 py-2 dark:border-dark-700 dark:bg-dark-800/50"
                        >
                          <span className="text-sm text-[#39495A] dark:text-dark-200">{feature}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#10243E] dark:text-white">+ ZMW 350</span>
                            <button
                              type="button"
                              onClick={() => removeCustomFeature(index)}
                              aria-label={`Remove ${feature}`}
                              className="text-[#7A8491] transition hover:text-red-600 dark:text-dark-400 dark:hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="pt-2 text-sm text-[#7A8491] dark:text-dark-500">
                  Optional additions can be removed or phased later if you want to reduce the initial project scope.
                </p>
              </div>
            )}

            {step === 'mobile' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(['android', 'ios', 'both', 'not-sure'] as MobilePlatform[]).map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setSelection(prev => ({ ...prev, mobilePlatform: platform }))}
                    className={`rounded-sm border p-4 text-left transition-colors ${
                      selection.mobilePlatform === platform
                        ? 'border-[#526E8A] bg-[#EEF2F4] dark:border-primary-500 dark:bg-primary-900/20'
                        : 'border-[#DDD7CC] bg-white/60 hover:border-[#AAB6C2] dark:border-dark-700 dark:bg-dark-800/40'
                    }`}
                  >
                    <span className="font-medium text-[#10243E] dark:text-white">{mobileLabels[platform]}</span>
                  </button>
                ))}
                <p className="sm:col-span-2 text-sm leading-6 text-[#697483] dark:text-dark-400">
                  The current base mobile price remains ZMW 12,000. Platform-specific publishing accounts,
                  store fees or unusual native integrations are confirmed during final scope review.
                </p>
              </div>
            )}

            {step === 'iot' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#39495A] dark:text-dark-300">
                  Hardware / IoT requirements
                </label>
                <textarea
                  rows={7}
                  value={selection.iotDetails}
                  onChange={e => setSelection(prev => ({ ...prev, iotDetails: e.target.value }))}
                  placeholder="Example: ESP32 device with two sensors, SIM/Wi-Fi connectivity, battery power, 10 units for field use..."
                  className="w-full rounded-sm border border-[#D4CEC4] bg-white/80 px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] focus:ring-1 focus:ring-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500"
                />
                <p className="mt-3 text-sm leading-6 text-[#697483] dark:text-dark-400">
                  IoT is custom-priced because sensors, connectivity, hardware quantity, power design, enclosure and
                  deployment conditions can change the engineering cost.
                </p>
              </div>
            )}

            {step === 'description' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#39495A] dark:text-dark-300">
                  Project goal
                </label>
                <textarea
                  rows={8}
                  value={selection.projectDescription}
                  onChange={e => setSelection(prev => ({ ...prev, projectDescription: e.target.value }))}
                  placeholder="Describe the problem, who will use the system, and what you need it to do..."
                  className="w-full rounded-sm border border-[#D4CEC4] bg-white/80 px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] focus:ring-1 focus:ring-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500"
                />
              </div>
            )}

            {step === 'timeline' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(timelineLabels) as ProjectTimeline[]).map(timeline => (
                  <button
                    key={timeline}
                    type="button"
                    onClick={() => setSelection(prev => ({ ...prev, timeline }))}
                    className={`rounded-sm border p-4 text-left transition-colors ${
                      selection.timeline === timeline
                        ? 'border-[#526E8A] bg-[#EEF2F4] dark:border-primary-500 dark:bg-primary-900/20'
                        : 'border-[#DDD7CC] bg-white/60 hover:border-[#AAB6C2] dark:border-dark-700 dark:bg-dark-800/40'
                    }`}
                  >
                    <span className="font-medium text-[#10243E] dark:text-white">{timelineLabels[timeline]}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 'contact' && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={client.name}
                    onChange={e => setClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name *"
                    className="rounded-sm border border-[#D4CEC4] bg-white/80 px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                  />
                  <input
                    type="email"
                    value={client.email}
                    onChange={e => setClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address *"
                    className="rounded-sm border border-[#D4CEC4] bg-white/80 px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                  />
                </div>
                <input
                  value={client.company}
                  onChange={e => setClient(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company / organization (optional)"
                  className="rounded-sm border border-[#D4CEC4] bg-white/80 px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                />
                <p className="text-sm text-[#697483] dark:text-dark-400">
                  The accepted quotation will be sent to Emmanuel&apos;s lead inbox together with these contact details.
                </p>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <div className="divide-y divide-[#E3DDD3] border-y border-[#E3DDD3] dark:divide-dark-800 dark:border-dark-800">
                  {quotation.lineItems.map(item => (
                    <div key={item.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#10243E] dark:text-white">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-[#697483] dark:text-dark-400">{item.reason}</p>
                        </div>
                        <p className="shrink-0 font-semibold text-[#10243E] dark:text-white">
                          {item.amount === null ? 'Custom' : formatZmw(item.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-sm border border-[#D8D2C8] bg-[#F1EEE7] p-5 dark:border-dark-700 dark:bg-dark-800/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A8491] dark:text-dark-500">
                    Project total
                  </p>
                  <p className="mt-2 font-display text-3xl font-medium text-[#10243E] dark:text-white">
                    {formatZmw(quotation.knownTotal)}
                    {quotation.hasCustomPricing && ' + custom IoT'}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-sm border border-[#D8D2C8] bg-white/70 p-4 dark:border-dark-700 dark:bg-dark-900/50">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A8491] dark:text-dark-500">
                        Upfront · 35%
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#10243E] dark:text-white">
                        {formatZmw(quotation.upfrontAmount)}
                      </p>
                      <p className="mt-1 text-xs text-[#697483] dark:text-dark-400">
                        {formatZmw(quotation.knownTotal)} × 35%
                      </p>
                    </div>
                    <div className="rounded-sm border border-[#D8D2C8] bg-white/70 p-4 dark:border-dark-700 dark:bg-dark-900/50">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A8491] dark:text-dark-500">
                        Remaining · 65%
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#10243E] dark:text-white">
                        {formatZmw(quotation.balanceAmount)}
                      </p>
                      <p className="mt-1 text-xs text-[#697483] dark:text-dark-400">
                        Remaining balance after the upfront payment
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#697483] dark:text-dark-400">
                    You do not need to pay the full known total upfront. The initial project payment is 35%.
                    Third-party fees, purchased hardware, hosting and requirements outside this scope are confirmed separately.
                  </p>
                </div>

                <div className="rounded-sm border border-[#DDD7CC] bg-white/60 p-5 dark:border-dark-700 dark:bg-dark-900/50">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                    <h2 className="font-semibold text-[#10243E] dark:text-white">Ask the AI about this price</h2>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={aiQuestion}
                      onChange={e => setAiQuestion(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void askAi()
                        }
                      }}
                      className="min-w-0 flex-1 rounded-sm border border-[#D4CEC4] bg-white px-4 py-3 text-[#10243E] outline-none focus:border-[#526E8A] dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                      placeholder="Ask why an item costs this amount..."
                    />
                    <button type="button" onClick={() => void askAi()} disabled={aiLoading} className="btn-secondary">
                      <Send className="h-4 w-4" />
                      {aiLoading ? 'Thinking...' : 'Ask'}
                    </button>
                  </div>
                  {aiAnswer && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#566273] dark:text-dark-300">
                      {aiAnswer}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void generateAndSend()}
                  disabled={status === 'sending'}
                  className="btn-primary w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  {status === 'sending' ? 'Preparing quotation...' : 'I agree — Generate quotation'}
                </button>

                {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}
              </div>
            )}

            {step === 'done' && (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#526E8A] dark:text-primary-400" />
                <h2 className="mt-4 font-display text-3xl font-medium text-[#10243E] dark:text-white">
                  Quotation generated
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#667384] dark:text-dark-400">
                  Your PDF quotation has been downloaded.
                  {deliveryStatus.emailSent
                    ? ' The accepted scope and price breakdown were also emailed to Emmanuel.'
                    : deliveryStatus.saved
                      ? ' The accepted scope and price breakdown were saved in Emmanuel\'s Admin Leads area. Email notification was not available, so the saved lead is the delivery fallback.'
                      : ' The quotation was generated, but delivery status could not be confirmed.'}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#10243E] dark:text-white">{quoteId}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className="btn-secondary">
                    <RefreshCcw className="h-4 w-4" /> Start another quote
                  </button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <MessageCircle className="h-4 w-4" /> Discuss on WhatsApp
                  </a>
                </div>
              </div>
            )}

            {!['review', 'done'].includes(step) && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E1DBD1] pt-6 dark:border-dark-800">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 'deliverables'}
                  className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goForward}
                  disabled={
                    (step === 'deliverables' && !anyDeliverable) ||
                    (step === 'description' && !selection.projectDescription.trim()) ||
                    (step === 'contact' && (!client.name.trim() || !/^\S+@\S+\.\S+$/.test(client.email)))
                  }
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'review' && (
              <button type="button" onClick={goBack} className="mt-6 text-sm font-medium text-[#526E8A] dark:text-primary-400">
                Change my answers
              </button>
            )}
          </section>

          <aside className="h-fit rounded-sm border border-[#D8D2C8] bg-[#EEEAE2] p-6 dark:border-dark-700 dark:bg-dark-900/70">
            <div className="mb-4 flex items-center gap-2 text-[#526E8A] dark:text-primary-400">
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.12em]">Live quotation</span>
            </div>

            {quotation.lineItems.length === 0 ? (
              <p className="text-sm leading-6 text-[#697483] dark:text-dark-400">
                Select what you want to build and the official pricing breakdown will appear here.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {quotation.lineItems.map(item => (
                    <div key={item.id} className="flex items-start justify-between gap-3 border-b border-[#D7D0C4] pb-3 dark:border-dark-800">
                      <span className="text-sm text-[#566273] dark:text-dark-300">{item.label}</span>
                      <span className="text-right text-sm font-semibold text-[#10243E] dark:text-white">
                        {item.amount === null ? 'Custom' : formatZmw(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#7A8491] dark:text-dark-500">Project total</p>
                  <p className="mt-1 font-display text-3xl font-medium text-[#10243E] dark:text-white">
                    {formatZmw(quotation.knownTotal)}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-[#D7D0C4] pt-4 dark:border-dark-800">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#697483] dark:text-dark-400">Upfront payment · 35%</span>
                      <span className="font-semibold text-[#10243E] dark:text-white">{formatZmw(quotation.upfrontAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#697483] dark:text-dark-400">Remaining balance · 65%</span>
                      <span className="font-semibold text-[#10243E] dark:text-white">{formatZmw(quotation.balanceAmount)}</span>
                    </div>
                  </div>
                  {quotation.hasCustomPricing && (
                    <p className="mt-1 text-xs leading-5 text-[#7A8491] dark:text-dark-500">
                      + IoT/custom engineering after technical discovery
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="mt-7 border-t border-[#D7D0C4] pt-5 dark:border-dark-800">
              <h3 className="text-sm font-semibold text-[#10243E] dark:text-white">Pricing rules</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-[#697483] dark:text-dark-400">
                <li>Website: ZMW 5,000 base</li>
                <li>E-commerce: + ZMW 3,000</li>
                <li>Admin dashboard: + ZMW 2,500</li>
                <li>Payment integration: + ZMW 2,000</li>
                <li>Mobile application: ZMW 12,000 base</li>
                <li>Each additional feature: + ZMW 350</li>
                <li>Upfront payment: 35% of known total</li>
                <li>Remaining balance: 65%</li>
                <li>IoT integration: custom quotation</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
