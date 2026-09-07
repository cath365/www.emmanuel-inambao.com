'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import ExperienceTimeline from '@/components/ui/ExperienceTimeline'
import { professionalRoles } from '@/data/portfolio'

export default function Experience() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="experience"
      ref={ref}
      className="content-auto bg-brand-camel/20 py-20 dark:bg-brand-chocolate/40 sm:py-24 lg:py-32"
      aria-labelledby="experience-heading"
    >
      <div className="section-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
          className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="editorial-label">Experience</p>
            <h2 id="experience-heading" className="section-heading mt-4">
              A cross-disciplinary engineering profile.
            </h2>
            <p className="section-subheading mt-6">
              These are the roles that describe how I contribute across complete technology
              projects. They are intentionally presented without invented dates, client counts or
              performance statistics.
            </p>
          </div>

          <ExperienceTimeline roles={professionalRoles} />
        </motion.div>
      </div>
    </section>
  )
}
