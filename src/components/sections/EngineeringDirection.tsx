'use client'

import { useSiteContent } from '@/lib/site-content'
import Link from 'next/link'
import { ArrowRight, FileCheck2 } from 'lucide-react'

/** Aspirational commitments are visually separate from verified project evidence. */
export default function EngineeringDirection() {
  const { content } = useSiteContent()
  const { vision } = content
  return (
    <section id="engineering-direction" aria-labelledby="direction-heading" className="border-y border-[#DED8CE] bg-[#F7F5EF] py-20 dark:border-dark-800 dark:bg-dark-900/35 lg:py-24">
      <div className="section-container">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">{vision.eyebrow}</p>
          <h2 id="direction-heading" className="section-heading mt-3">{vision.heading}</h2>
          <p className="mt-5 text-lg leading-8 text-[#39495A] dark:text-dark-200">{vision.intro}</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {vision.horizons.map((item, index) => (
            <article key={`${index}-${item.title}`} className="rounded-xl border border-[#DDD7CC] bg-white/70 p-6 dark:border-dark-700 dark:bg-dark-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-400">Direction {String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-xl font-semibold text-[#10243E] dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#697483] dark:text-dark-300">{item.description}</p>
              {item.image && <img src={item.image} alt={item.title} className="mt-4 h-40 w-full rounded-lg object-cover" loading="lazy" />}
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/case-studies" className="btn-primary inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4" />Engineering evidence and case studies</Link>
          <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">Project status and demonstrations <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-[#697483] dark:text-dark-400">Priorities above describe future goals, not completed milestones. Case studies and individual project pages document verified work, limitations and next steps.</p>
      </div>
    </section>
  )
}
