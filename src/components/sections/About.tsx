'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const focusAreas = [
  'Community and accessibility',
  'Agriculture and field systems',
  'Education and robotics',
  'Business and automation',
]

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="about"
      ref={ref}
      className="content-auto bg-brand-cream py-20 text-brand-navy dark:bg-brand-navy dark:text-brand-cream sm:py-24 lg:py-32"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
          className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
        >
          <div>
            <p className="editorial-label">About</p>
            <h2 id="about-heading" className="section-heading mt-4">
              Engineering across the full system.
            </h2>
          </div>

          <div>
            <p className="font-serif text-2xl leading-9 text-brand-navy dark:text-brand-cream sm:text-3xl sm:leading-10">
              I am Emmanuel Inambao, a systems engineer and technology builder from Zambia. I
              design and develop practical solutions using software, artificial intelligence, IoT,
              robotics and embedded systems. My work focuses on solving real problems in
              communities, agriculture, accessibility, education, business and automation.
            </p>

            <div className="mt-10 grid gap-3 border-t border-brand-navy/10 pt-6 dark:border-brand-cream/10 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-3 rounded-2xl border border-brand-navy/8 px-4 py-3 text-sm font-medium text-brand-chocolate dark:border-brand-cream/10 dark:text-brand-cream/70"
                >
                  <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden="true" />
                  {area}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
