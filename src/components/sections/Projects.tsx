'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ProjectCard from '@/components/ui/ProjectCard'
import { useProjects } from '@/lib/projects'
import { isProjectPublished } from '@/lib/project-catalog'

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { projects } = useProjects()
  const featuredProjects = projects.filter(project => isProjectPublished(project) && project.featured).slice(0, 4)

  return (
    <section id="projects" ref={ref} className="bg-[#000B26] py-20 text-[#F7F3EC] lg:py-28" aria-labelledby="projects-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid gap-8 border-b border-[#F7F3EC]/15 pb-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end"
        >
          <div>
            <p className="eyebrow text-[#7CA7EB]">02 / Selected work</p>
            <h2 id="projects-heading" className="editorial-serif mt-4 text-5xl leading-none tracking-[-0.025em] text-[#F7F3EC] sm:text-6xl">
              Systems with real constraints.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-base leading-7 text-[#F7F3EC]/60">
              The strongest projects are shown as engineering stories: what had to work, how the system was structured, and what was delivered.
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              <Link href="/projects" className="inline-flex items-center gap-2 border-b border-[#7CA7EB] pb-1 text-sm font-bold text-[#7CA7EB] hover:text-[#F7F3EC]">
                Project archive <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/case-studies" className="inline-flex items-center gap-2 border-b border-[#CBB08A] pb-1 text-sm font-bold text-[#CBB08A] hover:text-[#F7F3EC]">
                Case studies <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-14 space-y-16 sm:space-y-20 lg:space-y-28">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
