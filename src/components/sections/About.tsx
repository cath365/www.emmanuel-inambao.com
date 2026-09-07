'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Layers3, RadioTower, GraduationCap } from 'lucide-react'

const principles = [
  {
    number: '01',
    icon: Cpu,
    title: 'Problem before technology',
    description: 'The engineering decision starts with the operational problem, constraints and users — not with a framework or device.',
  },
  {
    number: '02',
    icon: Layers3,
    title: 'Hardware and software together',
    description: 'Sensors, firmware, APIs, dashboards and deployment are designed as one system rather than separate pieces.',
  },
  {
    number: '03',
    icon: RadioTower,
    title: 'Built for real conditions',
    description: 'Offline operation, unstable connectivity, power constraints and maintainability are treated as design inputs from day one.',
  },
  {
    number: '04',
    icon: GraduationCap,
    title: 'Engineering that transfers knowledge',
    description: 'Documentation, training and mentoring are part of the outcome so teams can understand and operate what is built.',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-[#F7F3EC] py-20 text-[#402924] lg:py-28" aria-labelledby="about-heading">
      <div className="pointer-events-none absolute right-[-7rem] top-[-7rem] h-72 w-72 rounded-full border border-[#402924]/10" aria-hidden="true" />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20"
        >
          <div>
            <p className="eyebrow text-[#7B5F3E]">01 / About</p>
            <h2 id="about-heading" className="editorial-serif mt-5 text-5xl leading-[0.98] tracking-[-0.025em] text-[#402924] sm:text-6xl lg:text-7xl">
              Engineering from sensor to system.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-3xl text-xl leading-8 text-[#402924] sm:text-2xl sm:leading-9">
              I work across electronics, embedded control, IoT, robotics and full-stack software. The objective is not simply to make technology work — it is to make the complete system useful, resilient and understandable.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#402924]/72">
              That means considering the circuit, firmware, connectivity, data model, user interface, security and field environment as one engineering problem. My strongest work sits exactly at those boundaries.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 border-t border-[#402924]/20">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="grid gap-4 border-b border-[#402924]/20 py-7 sm:grid-cols-[5rem_3.2rem_0.75fr_1.25fr] sm:items-start sm:gap-7"
            >
              <span className="text-xs font-bold tracking-[0.18em] text-[#7B5F3E]">{principle.number}</span>
              <principle.icon className="h-6 w-6 text-[#402924]" />
              <h3 className="editorial-serif text-2xl leading-tight text-[#402924]">{principle.title}</h3>
              <p className="max-w-2xl text-sm leading-6 text-[#402924]/68 sm:text-base">{principle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
