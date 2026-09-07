'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ShowcaseProject } from '@/data/portfolio'

interface ProjectCardProps {
  project: ShowcaseProject
  index: number
  onOpen?: (project: ShowcaseProject) => void
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const visualOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
  const copyOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'

  return (
    <article className="grid items-center gap-8 border-t border-brand-navy/10 py-12 first:border-t-0 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
      <div className={visualOrder}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-brand-navy/10 bg-brand-chocolate p-6 shadow-[0_16px_50px_rgba(64,41,36,0.14)] sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-brand-sky" />
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-camel">
                Project {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 max-w-md font-serif text-3xl font-semibold leading-tight text-brand-cream sm:text-4xl">
                {project.name}
              </h3>
            </div>

            <div>
              <p className="text-sm leading-6 text-brand-cream/60">
                {project.categories.join(' · ')}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-brand-sky">Case study</p>
            </div>
          </div>
        </div>
      </div>

      <div className={copyOrder}>
        <p className="text-sm font-semibold text-brand-chocolate/70">{project.caseStudy.role}</p>
        <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-4 text-base leading-8 text-brand-navy/70">{project.description}</p>

        <div className="mt-6 space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-chocolate">Problem</h4>
            <p className="mt-2 text-sm leading-7 text-brand-navy/65">{project.caseStudy.problem}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-chocolate">Approach</h4>
            <p className="mt-2 text-sm leading-7 text-brand-navy/65">{project.caseStudy.solution}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-chocolate">Technology</h4>
            <p className="mt-2 text-sm leading-7 text-brand-navy/65">
              {project.caseStudy.technologies.slice(0, 7).join(' · ')}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-chocolate">Status</h4>
            <p className="mt-2 text-sm leading-7 text-brand-navy/65">{project.caseStudy.status}</p>
          </div>
        </div>

        <div className="mt-7">
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-chocolate transition hover:text-brand-navy"
            >
              View case study
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={'/case-studies/' + project.slug}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-chocolate transition hover:text-brand-navy"
            >
              View case study
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
