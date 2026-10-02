'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const domains = [
  {
    title: 'Water & Climate',
    description:
      'Monitoring water use, detecting abnormal behaviour and designing systems that can help teams investigate leaks, losses and inefficient irrigation earlier.',
    href: '/projects/aquawatch-nrw',
  },
  {
    title: 'Accessibility',
    description:
      'Assistive systems that combine sensing, connected devices and guidance workflows to support safer mobility and greater independence.',
    href: '/projects/smart-walking-stick',
  },
  {
    title: 'Education',
    description:
      'Project-based robotics and STEM programmes where students learn programming, electronics and engineering through systems they can build and test.',
    href: '/projects/robotics-stem-project-programmes',
  },
  {
    title: 'Agriculture',
    description:
      'Practical IoT concepts for irrigation, livestock monitoring and field decision-making where connectivity, power and cost are real constraints.',
    href: '/projects/smart-irrigation-rd',
  },
  {
    title: 'Civic Technology',
    description:
      'Digital tools that organise public civic information into clearer, mobile-friendly discovery and navigation experiences.',
    href: '/projects/constituency226',
  },
  {
    title: 'Business Systems',
    description:
      'Replacing fragmented manual workflows with software that connects customers, quotations, payments, records, reporting and operational follow-up.',
    href: '/projects/quotation-platform',
  },
]

export default function ProblemDomains() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="problems"
      ref={ref}
      className="border-y border-[#DED8CE] bg-[#FCFBF7] py-16 dark:border-dark-800/60 dark:bg-dark-950 sm:py-20 lg:py-24"
      aria-labelledby="problems-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="max-w-4xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
            Problems I work on
          </p>
          <h2 id="problems-heading" className="section-heading mt-3">
            Engineering starts with the operating problem, not the technology list.
          </h2>
          <p className="section-subheading mt-4 max-w-3xl">
            I work on systems where software, electronics, sensing, automation or connected devices can make a practical process easier to understand, operate or improve. Each project is presented with its real stage, my role and the evidence available.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain, index) => (
            <motion.article
              key={domain.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex min-h-[230px] flex-col rounded-sm border border-[#DDD7CC] bg-white/70 p-5 dark:border-dark-800 dark:bg-dark-900/55 sm:p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A918F] dark:text-dark-500">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-[#10243E] dark:text-white">{domain.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#667384] dark:text-dark-400">{domain.description}</p>
              <Link
                href={domain.href}
                className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#526E8A] hover:text-[#10243E] dark:text-primary-400 dark:hover:text-primary-300"
              >
                See a related solution <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
