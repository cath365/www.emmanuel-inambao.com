'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink, Globe, Search, X } from 'lucide-react'
import { useProjects } from '@/lib/projects'

export default function ProjectsDirectory() {
  const { projects } = useProjects()
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('All')
  const [status, setStatus] = useState('All')

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(project => project.domain).filter(Boolean) as string[])).sort()],
    [projects]
  )

  const statuses = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(project => project.status).filter(Boolean) as string[])).sort()],
    [projects]
  )

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter(project => {
      const matchesDomain = domain === 'All' || project.domain === domain
      const matchesStatus = status === 'All' || project.status === status
      if (!matchesDomain || !matchesStatus) return false
      if (!normalizedQuery) return true

      const searchable = [
        project.title,
        project.domain,
        project.problemTagline,
        project.problemSolved,
        project.targetUsers,
        project.whyItMatters,
        project.solutionSummary,
        project.purpose,
        project.role,
        project.status,
        project.projectType,
        project.organization,
        ...(project.roleAreas || []),
        ...(project.techStack || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [projects, domain, status, query])

  const clearFilters = () => {
    setQuery('')
    setDomain('All')
    setStatus('All')
  }

  return (
    <div>
      <section className="mb-8 rounded-2xl border border-dark-800 bg-dark-900/45 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label htmlFor="project-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-dark-500">
              Find a problem or solution
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-500" />
              <input
                id="project-search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search water, accessibility, ESP32, business systems..."
                className="w-full rounded-xl border border-dark-700 bg-dark-950 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-primary-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-dark-500 hover:bg-dark-800 hover:text-white"
                  aria-label="Clear project search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-dark-400">
            <span className="font-semibold text-white">{filteredProjects.length}</span> of {projects.length} projects
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-500">Problem domain</p>
            <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter projects by problem domain">
          {domains.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setDomain(item)}
              aria-pressed={domain === item}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                domain === item
                  ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                  : 'border-dark-700 bg-dark-950/50 text-dark-400 hover:border-dark-600 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
            </div>
          </div>

          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-500">
            Project stage
            <select
              value={status}
              onChange={event => setStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-dark-700 bg-dark-950 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-primary-500"
            >
              {statuses.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-700 bg-dark-900/35 px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-white">No projects match this filter.</h2>
          <p className="mt-2 text-sm text-dark-400">Try another problem domain, project stage or search term.</p>
          <button type="button" onClick={clearFilters} className="btn-secondary mt-5">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map(project => (
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
                    Problem → solution → evidence
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
      )}
    </div>
  )
}
