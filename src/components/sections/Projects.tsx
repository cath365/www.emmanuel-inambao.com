'use client'

import { useCallback, useState } from 'react'
import CaseStudyModal from '@/components/ui/CaseStudyModal'
import ProjectGallery from '@/components/ui/ProjectGallery'
import type { ShowcaseProject } from '@/data/portfolio'

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ShowcaseProject | null>(null)
  const closeCaseStudy = useCallback(() => setActiveProject(null), [])

  return (
    <section id="projects" className="bg-brand-navy py-16 text-brand-cream sm:py-20 lg:py-24" aria-labelledby="projects-heading">
      <div className="section-container">
        <div className="border-t border-brand-cream/10 pt-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-sky">Selected work</p>
            <h2 id="projects-heading" className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">
              Projects
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-cream/60">
              A selection of systems I have designed and built across embedded hardware, IoT, robotics, AI and software.
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
