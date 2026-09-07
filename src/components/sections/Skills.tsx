'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import SkillGroup from '@/components/ui/SkillGroup'
import { skillGroups } from '@/data/portfolio'

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="skills"
      ref={ref}
      className="content-auto bg-brand-cream py-20 dark:bg-brand-navy sm:py-24 lg:py-32"
      aria-labelledby="skills-heading"
    >
      <div className="section-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
        >
          <div className="grid gap-6 border-b border-brand-navy/10 pb-10 dark:border-brand-cream/10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="editorial-label">Skills</p>
              <h2 id="skills-heading" className="section-heading mt-4">
                Built around real systems, not percentages.
              </h2>
            </div>
            <p className="section-subheading lg:ml-auto">
              My work spans intelligent software, embedded electronics, connected devices,
              automation and the delivery discipline required to bring those pieces together.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {skillGroups.map((group, index) => (
              <SkillGroup key={group.id} group={group} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
