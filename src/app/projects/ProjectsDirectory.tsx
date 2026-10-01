'use client'

import Link from 'next/link'
import { ArrowUpRight, ExternalLink, Globe } from 'lucide-react'
import { useProjects } from '@/lib/projects'

export default function ProjectsDirectory() {
  const { projects } = useProjects()

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => (
        <article key={project.id} className="group flex min-h-[330px] flex-col rounded-2xl border border-dark-800 bg-dark-900/60 p-6 transition hover:-translate-y-1 hover:border-primary-500/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-dark-500">
                <span>{project.domain || project.projectType || 'Engineering project'}</span>
                {project.status && <span>· {project.status}</span>}
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">{project.title}</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{project.problemTagline || project.problemSolved}</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-dark-500 transition group-hover:text-primary-400" />
          </div>

          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-dark-400">{project.solutionSummary || project.purpose}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map(tech => <span key={tech} className="tech-badge text-xs">{tech}</span>)}
          </div>

          <div className="mt-auto pt-7">
            <div className="mb-3 space-y-1 text-xs text-dark-500">
              {project.role && <p>Role: {project.role}</p>}
              {project.contribution && <p>Contribution: {project.contribution}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href={'/projects/' + project.id} className="text-sm font-semibold text-primary-400 hover:text-primary-300">
                Engineering details →
              </Link>
              {project.websiteUrl && (
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-green-300 hover:text-green-200">
                  Visit Website <Globe className="h-3.5 w-3.5" />
                </a>
              )}
              {project.liveUrl && project.liveUrl !== project.websiteUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-dark-300 hover:text-white">
                  Live system <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
