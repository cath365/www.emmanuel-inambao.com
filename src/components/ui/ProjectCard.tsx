'use client'

import Link from 'next/link'
import { ArrowUpRight, Layers3 } from 'lucide-react'
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
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.55 }}
      className="grid items-center gap-10 border-t border-brand-navy/10 py-14 first:border-t-0 first:pt-5 dark:border-brand-cream/10 sm:py-18 lg:grid-cols-2 lg:gap-20 lg:py-20"
    >
      <div className={'group relative py-6 ' + visualOrder}>
        <div className="absolute inset-x-[6%] bottom-4 top-16 rounded-[3rem] border border-brand-navy/5 bg-white/55 shadow-editorial-sm transition duration-500 group-hover:-translate-y-1 group-hover:bg-brand-camel/20 dark:border-brand-cream/10 dark:bg-white/5" />
        <div className="absolute left-[8%] top-2 h-20 w-20 rounded-full bg-brand-sky/25 blur-2xl" />
        <div className="relative transition duration-500 group-hover:-translate-y-2">
          <PixelPhoneMockup project={project} />
        </div>
      </div>

      <div className={copyOrder}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-navy/10 bg-brand-camel/35 text-xs font-bold text-brand-navy dark:border-brand-cream/10 dark:text-brand-cream">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="editorial-label">Flagship system</p>
        </div>

        <h3 className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-[0.96] tracking-[-0.03em] text-brand-navy dark:text-brand-cream sm:text-5xl lg:text-[3.6rem]">
          {project.name}
        </h3>

        <div className="mt-5 flex flex-wrap gap-2" aria-label={project.name + ' categories'}>
          {project.categories.map((category) => (
            <span key={category} className="rounded-full border border-brand-navy/10 bg-white/50 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-brand-chocolate dark:border-brand-cream/10 dark:bg-white/5 dark:text-brand-camel">
              {category}
            </span>
          ))}
        </div>

        <p className="mt-7 max-w-xl text-base leading-8 text-brand-chocolate/75 dark:text-brand-cream/70 sm:text-lg">
          {project.description}
        </p>

        <div className="mt-7 rounded-2xl border border-brand-navy/10 bg-white/55 p-4 dark:border-brand-cream/10 dark:bg-white/5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-chocolate/60 dark:text-brand-camel">
            <Layers3 className="h-4 w-4 text-brand-sky" aria-hidden="true" />
            Interface preview
          </div>
          <p className="mt-2 text-sm leading-6 text-brand-navy/75 dark:text-brand-cream/65">
            {project.screenItems.slice(0, 5).join(' · ')}
          </p>
        </div>

        <p className="sr-only">Phone preview includes: {project.screenItems.join(', ')}.</p>

        <div className="mt-8">
          {onOpen ? (
            <button type="button" onClick={() => onOpen(project)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition duration-300 hover:-translate-y-0.5 hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy dark:hover:bg-brand-camel">
              View Case Study
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link href={'/case-studies/' + project.slug} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition duration-300 hover:-translate-y-0.5 hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy dark:hover:bg-brand-camel">
              View Case Study
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}
