'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Zap, Crown, Rocket } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small IoT prototypes and consultations',
    price: 'From $500',
    period: 'per project',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    popular: false,
    features: [
      'Initial consultation & assessment',
      'Simple IoT prototype',
      'Basic firmware development',
      'Circuit design & schematic',
      '2 weeks of support',
      'Documentation included',
    ],
  },
  {
    name: 'Professional',
    description: 'For production-ready systems and full-stack solutions',
    price: 'From $2,000',
    period: 'per project',
    icon: Crown,
    color: 'from-primary-500 to-purple-500',
    popular: true,
    features: [
      'Everything in Starter, plus:',
      'Custom PCB design & manufacturing',
      'Full embedded firmware',
      'Web/mobile dashboard',
      'Cloud integration (AWS/Firebase)',
      'Testing & quality assurance',
      '3 months of support',
      'Training & handover',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For industrial-scale systems and long-term partnerships',
    price: 'Custom',
    period: 'contact for quote',
    icon: Rocket,
    color: 'from-accent-500 to-orange-500',
    popular: false,
    features: [
      'Everything in Professional, plus:',
      'Industrial automation systems',
      'SCADA/HMI development',
      'Multi-node IoT networks',
      'Custom protocol implementation',
      'Compliance & certification support',
      '12 months of priority support',
      'Dedicated project manager',
      'SLA guarantee',
    ],
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
          <h2 className="section-heading">Packages & Pricing</h2>
          <p className="section-subheading mx-auto">
            Transparent pricing for quality engineering. Every project is unique —
            these are starting points. Let&apos;s discuss your specific needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-lg shadow-primary-500/10'
                  : 'border border-dark-700'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8 bg-dark-800/50">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl
                                bg-gradient-to-br ${plan.color} mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-dark-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-dark-500 text-sm ml-2">/ {plan.period}</span>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-dark-700 text-dark-200 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  Get Started
                </a>

                {/* Features */}
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-dark-300">
                      <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-dark-500 text-sm mt-8"
        >
          All prices are negotiable based on project scope. VAT may apply depending on your location.
        </motion.p>
      </div>
    </section>
  )
}
