'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, Shield, Globe, Cpu, Zap, Wrench } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

const clients = [
  { name: 'Zambia Bureau of Standards', icon: Shield, type: 'Government' },
  { name: 'ZESCO Limited', icon: Zap, type: 'Energy' },
  { name: 'MTN Zambia', icon: Globe, type: 'Telecom' },
  { name: 'University of Zambia', icon: Building2, type: 'Education' },
  { name: 'Zamtel', icon: Cpu, type: 'Telecom' },
  { name: 'Industrial Systems Ltd', icon: Wrench, type: 'Manufacturing' },
]

const stats = [
  { value: '15+', label: 'IoT Systems Deployed' },
  { value: '200+', label: 'Students Trained' },
  { value: '5+', label: 'Years Experience' },
  { value: '5', label: 'Featured Projects' },
]

export default function ClientLogos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  return (
    <section ref={ref} className="py-16 lg:py-24 border-y border-dark-800/50">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Trusted By
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900">
            Organizations That Trust My Work
          </h2>
        </motion.div>

        {/* Client Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-dark-800/30 border border-dark-700/50
                         rounded-xl hover:border-primary-500/30 hover:bg-dark-800/50 transition-all duration-300 group"
            >
              <client.icon className="w-8 h-8 text-dark-400 group-hover:text-primary-400 transition-colors mb-3" />
              <p className="text-xs text-dark-400 group-hover:text-dark-300 text-center font-medium transition-colors">
                {client.name}
              </p>
              <span className="text-[10px] text-dark-600 mt-1">{client.type}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-dark-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
