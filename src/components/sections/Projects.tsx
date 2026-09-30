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
  const featuredProjects = projects.filter(project => project.featured).slice(0, 6)
  const featuredIds = new Set(featuredProjects.map(project => project.id))
  const remainingProjects = projects.filter(project => !featuredIds.has(project.id))

  return (
    <section id="projects" ref={ref} className="bg-[#F1EEE7] dark:bg-dark-900/45 py-20 lg:py-28 border-y border-[#DED8CE] dark:border-dark-800/50" aria-labelledby="projects-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-500">01 — Engineering Work</span>
            <h2 id="projects-heading" className="section-heading mt-2">Flagship systems built for real-world use.</h2>
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

        {remainingProjects.length > 0 && (
          <div className="mt-16 border-t border-[#D8D2C8] pt-10 dark:border-dark-800">
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
                  More Engineering Projects
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#10243E] dark:text-white">
                  Additional systems from the portfolio
                </h3>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-[#526E8A] hover:text-[#10243E] dark:text-primary-400 dark:hover:text-primary-300">
                Browse full archive →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {remainingProjects.map(project => (
                <Link
                  key={project.id}
                  href={'/projects/' + project.id}
                  className="group rounded-xl border border-[#D8D2C8] bg-white/45 p-5 transition hover:-translate-y-0.5 hover:border-[#AAB6C2] dark:border-dark-800 dark:bg-dark-900/45 dark:hover:border-primary-500/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A8491] dark:text-dark-500">
                    {project.status || 'Portfolio project'}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-[#10243E] dark:text-white">
                    {project.title}
                  </h4>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667384] dark:text-dark-400">
                    {project.purpose}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-[#526E8A] dark:text-primary-400">
                    View project →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
