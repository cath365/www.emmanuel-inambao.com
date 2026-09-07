'use client'

import { useEffect, useRef } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import PixelPhoneMockup from '@/components/ui/PixelPhoneMockup'
import type { ShowcaseProject } from '@/data/portfolio'

interface CaseStudyModalProps {
  project: ShowcaseProject | null
  onClose: () => void
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-6 text-brand-chocolate/75 dark:text-brand-cream/65"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [project, onClose])

  if (!project) return null

  const study = project.caseStudy

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto bg-brand-navy/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="mx-auto my-3 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-brand-cream/15 bg-brand-cream shadow-[0_35px_120px_rgba(0,0,0,0.35)] dark:bg-brand-navy sm:my-8">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-navy/10 bg-brand-cream/95 px-5 py-4 backdrop-blur-xl dark:border-brand-cream/10 dark:bg-brand-navy/95 sm:px-8">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5 dark:text-brand-cream dark:hover:bg-brand-cream/5"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-navy/10 text-brand-navy transition hover:border-brand-sky dark:border-brand-cream/15 dark:text-brand-cream"
            aria-label="Close case study"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <article className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <div>
              <p className="editorial-label">Case Study</p>
              <h2
                id="case-study-modal-title"
                className="mt-4 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.03em] text-brand-navy dark:text-brand-cream sm:text-6xl"
              >
                {project.name}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-brand-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-chocolate dark:border-brand-cream/15 dark:text-brand-camel"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-brand-chocolate/75 dark:text-brand-cream/70">
                {study.overview}
              </p>
              <div className="mt-7 rounded-2xl border border-brand-sky/30 bg-brand-sky/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-chocolate dark:text-brand-camel">
                  Current status
                </p>
                <p className="mt-2 font-semibold text-brand-navy dark:text-brand-cream">
                  {study.status}
                </p>
              </div>
            </div>

            <PixelPhoneMockup project={project} />
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <section className="editorial-card p-6 sm:p-7">
              <p className="editorial-label">Problem</p>
              <p className="mt-4 leading-7 text-brand-chocolate/75 dark:text-brand-cream/68">
                {study.problem}
              </p>
            </section>
            <section className="editorial-card p-6 sm:p-7">
              <p className="editorial-label">Proposed solution</p>
              <p className="mt-4 leading-7 text-brand-chocolate/75 dark:text-brand-cream/68">
                {study.solution}
              </p>
            </section>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section>
              <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
                Technologies used
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.technologies.map((item) => (
                  <span key={item} className="tech-badge">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
                Hardware used
              </h3>
              {study.hardware.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {study.hardware.map((item) => (
                    <span key={item} className="tech-badge">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-brand-chocolate/65 dark:text-brand-cream/55">
                  Software-focused project; no dedicated hardware is required for the current
                  workflow.
                </p>
              )}
            </section>
          </div>

          <section className="mt-10">
            <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
              System workflow
            </h3>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {study.workflow.map((step, index) => (
                <li
                  key={step}
                  className="rounded-2xl border border-brand-navy/10 p-4 dark:border-brand-cream/10"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-sky">
                    Step {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-brand-chocolate/75 dark:text-brand-cream/65">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <section>
              <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
                My role
              </h3>
              <p className="mt-4 text-sm leading-7 text-brand-chocolate/75 dark:text-brand-cream/65">
                {study.role}
              </p>
            </section>
            <section>
              <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
                Challenges
              </h3>
              <TextList items={study.challenges} />
            </section>
            <section>
              <h3 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
                Future improvements
              </h3>
              <TextList items={study.futureImprovements} />
            </section>
          </div>

          <section className="mt-12 border-t border-brand-navy/10 pt-10 dark:border-brand-cream/10">
            <p className="editorial-label">Interface gallery</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
              What the product interface communicates
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.screenItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-brand-navy/10 bg-white/70 p-4 text-sm font-semibold text-brand-navy dark:border-brand-cream/10 dark:bg-white/[0.04] dark:text-brand-cream"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
