'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, CheckCircle2, Calendar, PenTool, Wrench, FlaskConical, Rocket, RefreshCw } from 'lucide-react'

const steps = [
  { number: '01', title: 'Discover', description: 'Understand the problem, users, operating environment and constraints before deciding what to build.', icon: Search },
  { number: '02', title: 'Define', description: 'Convert the problem into clear requirements, objectives, scope and acceptance criteria.', icon: CheckCircle2 },
  { number: '03', title: 'Plan', description: 'Determine architecture, components, resources, budget, timeline, milestones, dependencies and risks.', icon: Calendar },
  { number: '04', title: 'Design', description: 'Design the electronics, firmware, software, APIs, interfaces and system architecture required for the solution.', icon: PenTool },
  { number: '05', title: 'Build', description: 'Develop the hardware and software, integrate the parts and keep implementation aligned with the agreed scope.', icon: Wrench },
  { number: '06', title: 'Test', description: 'Validate functionality, reliability, usability and hardware/software integration against the project requirements.', icon: FlaskConical },
  { number: '07', title: 'Deploy', description: 'Move the solution into its real operating environment with documentation, configuration and handover planning.', icon: Rocket },
  { number: '08', title: 'Improve', description: 'Use feedback and test evidence to fix weaknesses, reduce risk and plan the next iteration.', icon: RefreshCw },
]

export default function HowIWork() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="process" className="bg-[#F7F5EF] py-20 dark:bg-dark-950 lg:py-28">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">How I work</p>
          <h2 className="section-heading">From problem definition to delivery.</h2>
          <p className="section-subheading mx-auto mt-4">
            This workflow is why technical project management is part of my engineering role: the work is not only building the system, but defining, planning, coordinating, testing and improving it.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-sm border border-[#DDD7CC] bg-white/60 p-5 dark:border-dark-800 dark:bg-dark-900/55"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#10243E] text-white dark:bg-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#8A918F] dark:text-dark-500">{step.number}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#10243E] dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#697483] dark:text-dark-400">{step.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
