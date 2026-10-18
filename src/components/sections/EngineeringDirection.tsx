'use client'

import { useEffect, useState } from 'react'
import { defaultEngineeringDirection, readEngineeringDirection, type EngineeringDirection as Direction } from '@/lib/engineering-direction'

export default function EngineeringDirection() {
  const [content, setContent] = useState<Direction>(defaultEngineeringDirection)
  useEffect(() => {
    let active = true
    const reload = async () => {
      try {
        const response = await fetch('/api/portfolio-data?key=engineeringDirection', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          if (active) setContent(readEngineeringDirection(data))
        }
      } catch { /* show curated defaults if offline */ }
    }
    void reload()
    // Update an open homepage when the same browser's admin tab publishes content.
    const changed = (event: StorageEvent) => {
      if (event.key !== 'portfolio_last_published_change') return
      try {
        if (JSON.parse(event.newValue || '{}').key === 'engineeringDirection') void reload()
      } catch { /* ignore malformed storage events */ }
    }
    window.addEventListener('storage', changed)
    return () => { active = false; window.removeEventListener('storage', changed) }
  }, [])
  return <section id="engineering-direction" aria-labelledby="direction-title" className="border-y border-[#DED8CE] bg-[#F7F5EF] py-20 dark:border-dark-800 dark:bg-dark-900/35">
    <div className="section-container">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">{content.eyebrow}</p>
        <h2 id="direction-title" className="section-heading mt-3">{content.heading}</h2>
        <p className="mt-5 text-lg leading-8 text-[#39495A] dark:text-dark-200">{content.intro}</p>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {content.horizons.map((item, index) => <article key={index} className="rounded-xl border border-[#DDD7CC] bg-white/70 p-6 dark:border-dark-700 dark:bg-dark-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#526E8A] dark:text-primary-400">Direction {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 text-xl font-semibold text-[#10243E] dark:text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#697483] dark:text-dark-300">{item.description}</p>
          {item.image && <img loading="lazy" className="mt-4 h-40 w-full rounded-lg object-cover" src={item.image} alt={item.title} />}
        </article>)}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-[#697483] dark:text-dark-400">For verified engineering work, see each project’s current status, implementation details, technical decisions, testing and limitations.</p>
    </div>
  </section>
}
