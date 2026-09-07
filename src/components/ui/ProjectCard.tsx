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
  const details = [
    ['Problem', project.caseStudy.problem],
    ['Built', project.caseStudy.solution],
    ['Technology', project.caseStudy.technologies.slice(0, 6).join(', ')],
    ['Status', project.caseStudy.status],
  ] as const

  return (
    <article className="grid gap-7 border-t border-brand-navy/10 py-10 first:mt-8 dark:border-brand-cream/10 sm:py-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-14">
      <div>
        <p className="text-xs font-semibold text-brand-chocolate/45 dark:text-brand-cream/40">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-4 text-base leading-7 text-brand-chocolate/70 dark:text-brand-cream/65">
          {project.description}
        </p>

        <p className="mt-5 text-sm leading-6 text-brand-chocolate/55 dark:text-brand-cream/50">
          {project.categories.join(' · ')}
        </p>

        <div className="mt-6">
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy underline decoration-brand-sky decoration-2 underline-offset-4 dark:text-brand-cream"
            >
              View case study
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={'/case-studies/' + project.slug}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy underline decoration-brand-sky decoration-2 underline-offset-4 dark:text-brand-cream"
            >
              View case study
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <dl className="grid border border-brand-navy/10 bg-white dark:border-brand-cream/10 dark:bg-white/[0.03] sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label} className="border-b border-brand-navy/10 p-5 last:border-b-0 dark:border-brand-cream/10 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-brand-chocolate/50 dark:text-brand-camel">
              {label}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-brand-chocolate/75 dark:text-brand-cream/65">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
