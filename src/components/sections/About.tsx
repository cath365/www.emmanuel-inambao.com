'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FileText, Lightbulb, Target, Users, Wrench } from 'lucide-react'

const principles = [
  {
    icon: Target,
    title: 'Requirements before implementation',
    description: 'I begin with the operational problem, users, constraints and acceptance criteria before selecting the technical solution.',
  },
  {
    icon: Wrench,
    title: 'End-to-end systems thinking',
    description: 'Electronics, firmware, connectivity, APIs and interfaces are treated as parts of one maintainable system.',
  },
  {
    icon: Lightbulb,
    title: 'Practical field resilience',
    description: 'Power, connectivity, recovery behavior and real operating conditions are considered early rather than after deployment.',
  },
  {
    icon: FileText,
    title: 'Documentation & handover',
    description: 'Architecture, test evidence, user guidance and technical handover are part of responsible engineering delivery.',
  },
]

const capabilitySummary = [
  { label: 'Embedded & connected systems', value: 'Hardware · Firmware · IoT' },
  { label: 'Digital product delivery', value: 'Mobile · Web · APIs' },
  { label: 'Collaboration model', value: 'Documented · Reviewable · Remote-ready' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section
      id="about"
      ref={ref}
      className="border-y border-dark-800/60 bg-dark-950 py-20 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="mb-12 max-w-4xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
              Professional profile
            </span>
            <h2 id="about-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Engineering with an institutional mindset.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-dark-400 sm:text-lg">
              My work combines hands-on product engineering with the discipline organizations need when technology must be supportable, explainable and ready for real users.
            </p>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <motion.div variants={itemVariants}>
              <div className="space-y-5 text-base leading-8 text-dark-300">
                <p>
                  I’m <strong className="font-semibold text-white">Emmanuel Inambao</strong>, an engineer based in Lusaka, Zambia, working across embedded systems, IoT, robotics and full-stack product development.
                </p>
                <p>
                  I build systems from the physical layer upward: sensors and electronics, firmware and local control, connectivity, APIs, mobile or web interfaces, and the operational tools needed to manage the result.
                </p>
                <p>
                  The goal is not technology for presentation alone. I focus on solutions that can move from prototype into dependable use, particularly where connectivity, power, affordability, maintainability and clear handover matter.
                </p>
                <p>
                  For institutional and international work, I emphasize written requirements, transparent constraints, reviewable milestones and communication that technical and non-technical stakeholders can follow.
                </p>
              </div>

              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-dark-800 bg-dark-800 sm:grid-cols-3">
                {capabilitySummary.map(item => (
                  <div key={item.label} className="bg-dark-900/75 p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-dark-500">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-4 sm:grid-cols-2">
              {principles.map(principle => {
                const Icon = principle.icon
                return (
                  <motion.article
                    key={principle.title}
                    variants={itemVariants}
                    className="rounded-2xl border border-dark-800 bg-dark-900/55 p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-700 bg-dark-950">
                      <Icon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-dark-400">{principle.description}</p>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-10 flex items-start gap-3 rounded-2xl border border-dark-800 bg-dark-900/40 p-5">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
            <p className="text-sm leading-6 text-dark-400">
              Collaboration can support private companies, public institutions, NGOs, research teams and international partners, subject to the technical, legal, procurement and safety requirements of each engagement.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
