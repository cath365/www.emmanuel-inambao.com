'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import PixelPhoneMockup from '@/components/ui/PixelPhoneMockup'
import type { ShowcaseProject } from '@/data/portfolio'

interface ProjectCardProps {
  project: ShowcaseProject
  index: number
  onOpen?: (project: ShowcaseProject) => void
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const reduceMotion = useReducedMotion()
  const visualOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
  const copyOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'

  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="grid items-center gap-10 border-t border-brand-navy/10 py-12 first:border-t-0 first:pt-4 dark:border-brand-cream/10 sm:py-16 lg:grid-cols-2 lg:gap-16"
    >
      <div className={'group relative py-5 ' + visualOrder}>
        <div className="absolute inset-x-[10%] bottom-0 h-2/3 rounded-[3rem] bg-brand-sky/10 transition duration-500 group-hover:bg-brand-camel/20" />
        <div className="relative transition duration-500 group-hover:-translate-y-1.5">
          <PixelPhoneMockup project={project} />
        </div>
      </div>

      <div className={copyOrder}>
        <p className="editorial-label">
          Selected project · {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-brand-navy dark:text-brand-cream sm:text-5xl">
          {project.name}
        </h3>

        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label={project.name + ' categories'}
        >
          {project.categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-brand-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-chocolate dark:border-brand-cream/15 dark:text-brand-camel"
            >
              {category}
            </span>
          ))}
        </div>

        <p className="mt-6 max-w-xl text-base leading-8 text-brand-chocolate/75 dark:text-brand-cream/70 sm:text-lg">
          {project.description}
        </p>

        <p className="sr-only">Phone preview includes: {project.screenItems.join(', ')}.</p>

        <div className="mt-8">
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition hover:-translate-y-0.5 hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy dark:hover:bg-brand-camel"
            >
              View Case Study
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={'/case-studies/' + project.slug}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition hover:-translate-y-0.5 hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy dark:hover:bg-brand-camel"
            >
              View Case Study
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}
