import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import PixelPhoneMockup from '@/components/ui/PixelPhoneMockup'
import type { ShowcaseProject } from '@/data/portfolio'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-7 text-brand-chocolate/75 dark:text-brand-cream/65"
        >
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CaseStudyContent({ project }: { project: ShowcaseProject }) {
  const study = project.caseStudy

  return (
    <article className="min-h-screen bg-brand-cream pb-24 pt-28 dark:bg-brand-navy sm:pt-32">
      <div className="section-container">
        <Link
          href="/#projects"
          className="inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-brand-navy transition hover:text-brand-sky dark:text-brand-cream"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <header className="mt-7 grid items-center gap-10 border-b border-brand-navy/10 pb-12 dark:border-brand-cream/10 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
          <div>
            <p className="editorial-label">Case Study</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-brand-navy dark:text-brand-cream sm:text-6xl lg:text-7xl">
              {project.name}
            </h1>

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
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="editorial-card p-6 sm:p-8">
            <p className="editorial-label">Problem</p>
            <p className="mt-4 leading-8 text-brand-chocolate/75 dark:text-brand-cream/68">
              {study.problem}
            </p>
          </section>
          <section className="editorial-card p-6 sm:p-8">
            <p className="editorial-label">Proposed solution</p>
            <p className="mt-4 leading-8 text-brand-chocolate/75 dark:text-brand-cream/68">
              {study.solution}
            </p>
          </section>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="font-serif text-4xl font-semibold text-brand-navy dark:text-brand-cream">
              Technologies used
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {study.technologies.map((item) => (
                <span key={item} className="tech-badge">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-4xl font-semibold text-brand-navy dark:text-brand-cream">
              Hardware used
            </h2>
            {study.hardware.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {study.hardware.map((item) => (
                  <span key={item} className="tech-badge">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-brand-chocolate/65 dark:text-brand-cream/55">
                Software-focused project; no dedicated hardware is required for the current
                workflow.
              </p>
            )}
          </section>
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-4xl font-semibold text-brand-navy dark:text-brand-cream">
            System workflow
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {study.workflow.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-brand-navy/10 p-5 dark:border-brand-cream/10"
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-sky">
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-7 text-brand-chocolate/75 dark:text-brand-cream/65">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <section>
            <h2 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
              My role
            </h2>
            <p className="mt-4 text-sm leading-7 text-brand-chocolate/75 dark:text-brand-cream/65">
              {study.role}
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
              Challenges
            </h2>
            <BulletList items={study.challenges} />
          </section>
          <section>
            <h2 className="font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream">
              Future improvements
            </h2>
            <BulletList items={study.futureImprovements} />
          </section>
        </div>

        <section className="mt-14 border-t border-brand-navy/10 pt-12 dark:border-brand-cream/10">
          <p className="editorial-label">Interface gallery</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-brand-navy dark:text-brand-cream">
            Product screens and controls
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-brand-navy/10 bg-white/70 p-5 text-sm font-semibold text-brand-navy dark:border-brand-cream/10 dark:bg-white/[0.04] dark:text-brand-cream"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-brand-chocolate p-7 text-brand-cream sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="editorial-label !text-brand-camel">Project discussion</p>
            <p className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight">
              Have a related system or product problem to solve?
            </p>
          </div>
          <Link
            href="/#contact"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-brand-sky px-6 text-sm font-semibold text-brand-navy transition hover:bg-brand-camel"
          >
            Get In Touch
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
