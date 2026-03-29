'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, PenTool, Code, Rocket, MessageSquare, Repeat } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We start with a deep-dive into your requirements, challenges, and goals. I analyze existing systems and identify opportunities.',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    title: 'Architecture & Design',
    description: 'I design the system architecture, create schematics, select components, and plan the tech stack — hardware and software.',
    icon: PenTool,
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Building with precision — firmware, circuits, embedded code, APIs, and frontend interfaces. Every component is tested rigorously.',
    icon: Code,
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '04',
    title: 'Testing & QA',
    description: 'Comprehensive testing across all environments — unit tests, integration tests, hardware validation, and user acceptance testing.',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: '05',
    title: 'Deployment',
    description: 'Seamless deployment with monitoring, documentation, and training. Your system goes live with zero surprises.',
    icon: Rocket,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    number: '06',
    title: 'Support & Iterate',
    description: 'Ongoing maintenance, performance monitoring, and iterative improvements. I stay with you beyond launch.',
    icon: Repeat,
    color: 'from-indigo-500 to-purple-500',
  },
]

export default function HowIWork() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="process" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">
            My Process
          </p>
          <h2 className="section-heading">How I Work</h2>
          <p className="section-subheading mx-auto">
            A battle-tested engineering process refined over years of delivering
            real-world IoT, embedded, and full-stack systems.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="card h-full hover:translate-y-[-4px] transition-all duration-300">
                {/* Step Number */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl
                                bg-gradient-to-br ${step.color} mb-4`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                {/* Number badge */}
                <span className="absolute top-4 right-4 text-4xl font-black text-dark-800/50 light:text-slate-200/50 select-none">
                  {step.number}
                </span>

                <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-primary">
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  )
}
