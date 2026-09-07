'use client'

import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { useProjects } from '@/lib/projects'

export default function ProjectsDirectory() {
  const { projects } = useProjects()

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => (
        <article key={project.id} className="group flex min-h-[330px] flex-col rounded-2xl border border-dark-800 bg-dark-900/60 p-6 transition hover:-translate-y-1 hover:border-primary-500/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">{project.role || 'Engineering project'}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{project.title}</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-dark-500 transition group-hover:text-primary-400" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-dark-400">{project.purpose}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map(tech => <span key={tech} className="tech-badge text-xs">{tech}</span>)}
          </div>

          <div className="mt-auto pt-7">
            {project.status && <p className="mb-3 text-xs font-medium text-dark-500">Status: {project.status}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <Link href={'/projects/' + project.id} className="text-sm font-semibold text-primary-400 hover:text-primary-300">
                Engineering details →
              </Link>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-dark-300 hover:text-white">
                  Live <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
