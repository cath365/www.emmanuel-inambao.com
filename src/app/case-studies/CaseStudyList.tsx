import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { showcaseProjects } from '@/data/portfolio'

export default function CaseStudyList() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {showcaseProjects.map((project, index) => (
        <article
          key={project.slug}
          className="editorial-card flex h-full flex-col p-6 sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="editorial-label">Case {String(index + 1).padStart(2, '0')}</p>
            <span className="h-3 w-3 shrink-0 rounded-full bg-brand-sky" aria-hidden="true" />
          </div>

          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-brand-navy dark:text-brand-cream sm:text-4xl">
            {project.name}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-brand-navy/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-chocolate dark:border-brand-cream/10 dark:text-brand-camel"
              >
                {category}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-brand-chocolate/75 dark:text-brand-cream/60">
            {project.description}
          </p>

          <div className="mt-6 rounded-2xl bg-brand-sky/10 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-chocolate dark:text-brand-camel">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-navy dark:text-brand-cream">
              {project.caseStudy.status}
            </p>
          </div>

          <Link
            href={'/case-studies/' + project.slug}
            className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-brand-navy px-5 text-sm font-semibold text-brand-cream transition hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy dark:hover:bg-brand-camel"
          >
            Read Case Study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  )
}
