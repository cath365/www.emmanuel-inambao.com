'use client'

import { motion, useInView } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Calculator, MessageCircle, Send } from 'lucide-react'
import { useProfile } from '@/lib/profile'

type ProjectType = 'iot-prototype' | 'industrial-automation' | 'embedded-product' | 'web-dashboard' | 'custom'
type Complexity = 'basic' | 'standard' | 'advanced'
type Timeline = 'normal' | 'fast' | 'urgent'

interface QuoteForm {
  projectType: ProjectType
  complexity: Complexity
  timeline: Timeline
  hardwareUnits: number
  needsDashboard: boolean
  needsCloud: boolean
  integrations: number
  supportMonths: number
}

const DEFAULT_FORM: QuoteForm = {
  projectType: 'iot-prototype',
  complexity: 'standard',
  timeline: 'normal',
  hardwareUnits: 1,
  needsDashboard: true,
  needsCloud: false,
  integrations: 1,
  supportMonths: 1,
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
  const min = Math.round(final * 0.85)
  const max = Math.round(final * 1.2)
  return { min, max }
}

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { profile } = useProfile()
  const [form, setForm] = useState<QuoteForm>(DEFAULT_FORM)

  const quote = useMemo(() => estimateQuote(form), [form])

  const waPhone = profile.phone.replace(/\D/g, '')
  const summary = [
    'Hello Emmanuel, I need a project quote.',
    `Project Type: ${form.projectType}`,
    `Complexity: ${form.complexity}`,
    `Timeline: ${form.timeline}`,
    `Hardware Units: ${form.hardwareUnits}`,
    `Dashboard: ${form.needsDashboard ? 'Yes' : 'No'}`,
    `Cloud: ${form.needsCloud ? 'Yes' : 'No'}`,
    `Integrations: ${form.integrations}`,
    `Support (months): ${form.supportMonths}`,
    `Estimated Range: $${quote.min} - $${quote.max}`,
  ].join('\n')

  const whatsappHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(summary)}`

  return (
    <section ref={ref} id="pricing" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="section-heading">Project Quote Estimator</h2>
          <p className="section-subheading mx-auto">
            Answer a few questions and get a live estimate based on your real project needs.
            Final pricing is confirmed after technical scoping.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 border border-dark-700 rounded-2xl p-6 sm:p-8 bg-dark-800/50"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-primary-400" />
              <h3 className="text-white text-lg font-semibold">Tell us what you need</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm text-dark-300">
                Project Type
                <select
                  value={form.projectType}
                  onChange={e => setForm(prev => ({ ...prev, projectType: e.target.value as ProjectType }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                >
                  <option value="iot-prototype">IoT Prototype</option>
                  <option value="industrial-automation">Industrial Automation</option>
                  <option value="embedded-product">Embedded Product</option>
                  <option value="web-dashboard">Web Dashboard</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </label>

              <label className="text-sm text-dark-300">
                Complexity
                <select
                  value={form.complexity}
                  onChange={e => setForm(prev => ({ ...prev, complexity: e.target.value as Complexity }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>

              <label className="text-sm text-dark-300">
                Timeline
                <select
                  value={form.timeline}
                  onChange={e => setForm(prev => ({ ...prev, timeline: e.target.value as Timeline }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>

              <label className="text-sm text-dark-300">
                Hardware Units
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={form.hardwareUnits}
                  onChange={e => setForm(prev => ({ ...prev, hardwareUnits: Number(e.target.value) || 1 }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                />
              </label>

              <label className="text-sm text-dark-300">
                External Integrations
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={form.integrations}
                  onChange={e => setForm(prev => ({ ...prev, integrations: Math.max(0, Number(e.target.value) || 0) }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                />
              </label>

              <label className="text-sm text-dark-300">
                Support (months)
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={form.supportMonths}
                  onChange={e => setForm(prev => ({ ...prev, supportMonths: Math.max(0, Number(e.target.value) || 0) }))}
                  className="mt-2 w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsDashboard}
                  onChange={e => setForm(prev => ({ ...prev, needsDashboard: e.target.checked }))}
                  className="w-4 h-4"
                />
                Need Dashboard/UI
              </label>
              <label className="inline-flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsCloud}
                  onChange={e => setForm(prev => ({ ...prev, needsCloud: e.target.checked }))}
                  className="w-4 h-4"
                />
                Need Cloud Integration
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-primary-500/40 rounded-2xl p-6 sm:p-8 bg-primary-500/5"
          >
            <h3 className="text-white text-lg font-semibold mb-2">Estimated Budget</h3>
            <p className="text-dark-400 text-sm mb-4">Auto-calculated from your answers.</p>

            <div className="text-3xl font-bold text-white mb-1">
              ${quote.min.toLocaleString()} - ${quote.max.toLocaleString()}
            </div>
            <p className="text-dark-500 text-xs mb-6">USD estimated project range</p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send on WhatsApp
            </a>

            <a
              href="#contact"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-dark-100 font-medium py-3 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Request Formal Proposal
            </a>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-dark-500 text-sm mt-8"
        >
          This estimator gives a realistic range based on your inputs. Final quote depends on full scope,
          hardware availability, deployment environment, and compliance requirements.
        </motion.p>
      </div>
    </section>
  )
}
