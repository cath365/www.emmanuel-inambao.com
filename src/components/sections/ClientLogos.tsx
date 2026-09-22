'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const organizations = [
  {
    name: 'Zambia Bureau of Standards',
    shortName: 'ZABS',
    type: 'Government / Standards',
    website: 'https://www.zabs.org.zm',
    logoUrl: 'https://www.google.com/s2/favicons?domain_url=https://www.zabs.org.zm&sz=256',
  },
  {
    name: 'ZESCO Limited',
    shortName: 'ZESCO',
    type: 'Energy',
    website: 'https://www.zesco.co.zm',
    logoUrl: 'https://www.google.com/s2/favicons?domain_url=https://www.zesco.co.zm&sz=256',
  },
  {
    name: 'MTN Zambia',
    shortName: 'MTN',
    type: 'Telecommunications',
    website: 'https://www.mtn.zm',
    logoUrl: 'https://www.google.com/s2/favicons?domain_url=https://www.mtn.zm&sz=256',
  },
  {
    name: 'University of Zambia',
    shortName: 'UNZA',
    type: 'Education',
    website: 'https://www.unza.zm',
    logoUrl: 'https://www.google.com/s2/favicons?domain_url=https://www.unza.zm&sz=256',
  },
  {
    name: 'Zamtel',
    shortName: 'Zamtel',
    type: 'Telecommunications',
    website: 'https://www.zamtel.zm',
    logoUrl: 'https://www.google.com/s2/favicons?domain_url=https://www.zamtel.zm&sz=256',
  },
] as const

const stats = [
  { value: '15+', label: 'IoT Systems Deployed' },
  { value: '200+', label: 'Students Trained' },
  { value: '5+', label: 'Years Experience' },
  { value: '5', label: 'Featured Projects' },
]

export default function ClientLogos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="border-y border-[#DDD7CC] bg-[#FCFBF7] py-14 dark:border-dark-800/70 dark:bg-dark-950/35 lg:py-20"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-400">
            Institutional connections
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-[#10243E] dark:text-white sm:text-3xl">
            Organizations & Institutions Connected to My Work
          </h2>
        </motion.div>

        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:mb-16 lg:grid-cols-5">
          {organizations.map((organization, index) => (
            <motion.a
              key={organization.name}
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex min-h-44 flex-col items-center justify-center rounded-sm border border-[#DDD7CC] bg-white/75 p-5 text-center transition-colors duration-200 hover:border-[#AAB6C2] hover:bg-white dark:border-dark-700/50 dark:bg-dark-800/30 dark:hover:border-dark-600 dark:hover:bg-dark-800/40"
              aria-label={`Visit ${organization.name} website`}
            >
              <div className="mb-4 flex h-16 w-24 items-center justify-center rounded-sm bg-white px-3 py-2 shadow-[0_1px_4px_rgba(16,36,62,0.08)] dark:bg-white">
                {/* Official-site identity mark resolved from the organization's public web domain. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={organization.logoUrl}
                  alt={`${organization.name} logo`}
                  className="max-h-12 max-w-20 object-contain"
                  loading="lazy"
                />
              </div>

              <p className="text-sm font-semibold leading-5 text-[#10243E] dark:text-dark-100">
                {organization.shortName}
              </p>
              <p className="mt-1 text-xs leading-4 text-[#667384] dark:text-dark-400">
                {organization.name}
              </p>
              <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A918F] dark:text-dark-600">
                {organization.type}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.25 + index * 0.08 }}
              className="text-center"
            >
              <p className="mb-1 font-display text-3xl font-medium text-[#10243E] dark:text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm text-[#687382] dark:text-dark-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
