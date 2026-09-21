'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, Cpu, FileText, Globe2, Shield } from 'lucide-react'

const signals = [
  {
    icon: Building2,
    title: 'Institution-ready',
    text: 'Requirements, governance, access boundaries, documentation and handover are treated as part of the engineering work.',
  },
  {
    icon: Globe2,
    title: 'International collaboration',
    text: 'Written scope, reviewable milestones and remote demonstrations make work easier to evaluate across organizations and time zones.',
  },
  {
    icon: Cpu,
    title: 'Hardware + software',
    text: 'Embedded devices, connectivity, APIs, dashboards and applications are designed as one operational system.',
  },
  {
    icon: Shield,
    title: 'Evidence-led delivery',
    text: 'Prototype status, constraints, testing and safety boundaries are stated clearly rather than hidden behind marketing language.',
  },
]

export default function ClientLogos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="border-b border-dark-800/70 bg-dark-900/35 py-12 sm:py-14">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col justify-between gap-4 border-b border-dark-800/70 pb-7 md:flex-row md:items-end"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">Professional operating standard</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Built for serious technical review, institutional engagement and international collaboration.
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-dark-400">
            <FileText className="h-4 w-4" />
            Clear scope · documented evidence · responsible handover
          </div>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-dark-800 bg-dark-800 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = signal.icon
            return (
              <motion.article
                key={signal.title}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="bg-dark-950/75 p-5 sm:p-6"
              >
                <Icon className="h-5 w-5 text-primary-400" />
                <h3 className="mt-4 font-semibold text-white">{signal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-dark-400">{signal.text}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
