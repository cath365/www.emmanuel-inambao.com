'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import ProjectCard from '@/components/ui/ProjectCard'
import { useProjects } from '@/lib/projects'
import { useLanguage } from '@/lib/i18n'

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { projects } = useProjects()
  const { t } = useLanguage()
  const featuredProjects = projects.filter(project => project.featured).slice(0, 4)

  return (
    <section id="projects" ref={ref} className="bg-dark-900/45 py-20 lg:py-28" aria-labelledby="projects-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">{t('projects.title')}</span>
            <h2 id="projects-heading" className="section-heading mt-2">Systems built for real-world use.</h2>
            <p className="section-subheading mt-4">
              Embedded control, IoT, robotics and full-stack platforms presented as engineering systems — problem, architecture, implementation and outcome.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/case-studies" className="btn-secondary">
              <BookOpen className="h-4 w-4" /> Case studies
            </Link>
          </div>
        </motion.div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-28">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
