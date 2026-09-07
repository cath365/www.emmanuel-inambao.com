'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import CaseStudyModal from '@/components/ui/CaseStudyModal'
import ProjectGallery from '@/components/ui/ProjectGallery'
import type { ShowcaseProject } from '@/data/portfolio'

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const [activeProject, setActiveProject] = useState<ShowcaseProject | null>(null)
  const closeCaseStudy = useCallback(() => setActiveProject(null), [])

  return (
    <section
      id="projects"
      ref={ref}
      className="content-auto bg-brand-sky/10 py-20 dark:bg-brand-navy sm:py-24 lg:py-32"
      aria-labelledby="projects-heading"
    >
      <div className="section-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
        >
          <div className="grid gap-7 border-b border-brand-navy/10 pb-10 dark:border-brand-cream/10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="editorial-label">Selected Projects</p>
              <h2 id="projects-heading" className="section-heading mt-4">
                Products where software meets the physical world.
              </h2>
            </div>
            <p className="section-subheading lg:ml-auto">
              Six representative systems across AI, assistive technology, automation, business
              software, agriculture and embedded robotics. Filter the gallery by engineering
              domain.
            </p>
          </div>

          <div className="mt-8">
            <ProjectGallery onOpenProject={setActiveProject} />
          </div>
        </motion.div>
      </div>

      <CaseStudyModal project={activeProject} onClose={closeCaseStudy} />
    </section>
  )
}
