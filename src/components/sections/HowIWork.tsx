'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const steps = [
  ['01', 'Discovery', 'Define the operational problem, users, constraints, risks and success criteria before choosing technology.'],
  ['02', 'Architecture', 'Map hardware, firmware, APIs, data, interfaces, deployment and failure modes into one system design.'],
  ['03', 'Prototype', 'Build the smallest useful version that proves the critical sensing, control, connectivity and user-flow assumptions.'],
  ['04', 'Validate', 'Test hardware behavior, edge cases, integration paths, usability, recovery and real operating conditions.'],
  ['05', 'Deploy', 'Move the system into its target environment with monitoring, documentation, configuration and handover.'],
  ['06', 'Improve', 'Use real usage and field feedback to improve reliability, maintainability and product value over time.'],
]

export default function HowIWork() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="process" className="relative overflow-hidden bg-[#402924] py-20 text-[#F7F3EC] lg:py-28">
      <div className="pointer-events-none absolute -right-20 top-16 h-80 w-80 rounded-full border border-[#CBB08A]/20" aria-hidden="true" />
      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"
        >
          <div>
            <p className="eyebrow text-[#CBB08A]">05 / Process</p>
            <h2 className="editorial-serif mt-4 text-5xl leading-none tracking-[-0.025em] sm:text-6xl">
              From uncertainty to a working system.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#F7F3EC]/70 lg:justify-self-end">
            The process is deliberately simple: reduce uncertainty early, prove the difficult parts first, and keep hardware, software and operations aligned throughout delivery.
          </p>
        </motion.div>

        <div className="mt-14 grid border-l border-t border-[#F7F3EC]/20 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([number, title, description], index) => (
            <motion.article
              key={number}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="min-h-[15rem] border-b border-r border-[#F7F3EC]/20 p-6 sm:p-7"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-[#CBB08A]">{number}</span>
              <h3 className="editorial-serif mt-8 text-3xl leading-none">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#F7F3EC]/60">{description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/start-project" className="inline-flex items-center gap-2 border-b border-[#F7F3EC] pb-1 text-sm font-bold">
            Start with the problem <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
