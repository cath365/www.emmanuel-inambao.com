'use client'

import { useCallback, useState } from 'react'
import CaseStudyModal from '@/components/ui/CaseStudyModal'
import ProjectGallery from '@/components/ui/ProjectGallery'
import type { ShowcaseProject } from '@/data/portfolio'

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ShowcaseProject | null>(null)
  const closeCaseStudy = useCallback(() => setActiveProject(null), [])

  return (
    <section
      id="projects"
      className="bg-brand-cream py-16 text-brand-navy dark:bg-brand-navy dark:text-brand-cream sm:py-20 lg:py-24"
      aria-labelledby="projects-heading"
    >
      <div className="section-container">
        <div className="border-t border-brand-navy/10 pt-10 dark:border-brand-cream/10">
          <div className="grid gap-5 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-chocolate/60 dark:text-brand-camel">
                Selected work
              </p>
              <h2 id="projects-heading" className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">
                Projects
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-brand-chocolate/65 dark:text-brand-cream/60 lg:justify-self-end">
              Systems I have designed and built across embedded hardware, IoT, robotics, AI and software. Open a project to see the problem, approach, technology and current status.
            </p>
          </div>

          <div className="mt-8">
            <ProjectGallery onOpenProject={setActiveProject} />
          </div>
        </div>
      </div>

      <CaseStudyModal project={activeProject} onClose={closeCaseStudy} />
    </section>
  )
}
