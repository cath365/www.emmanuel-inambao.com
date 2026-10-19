'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Code, CheckCircle2, GraduationCap } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'

export default function About() {
  const { content } = useSiteContent()
  const { about } = content
  const icons = [Cpu, Code, CheckCircle2, GraduationCap]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      className="border-y border-[#E1DBD1] bg-[#F7F5EF] py-20 dark:border-dark-800/60 dark:bg-dark-900/35 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
              {about.eyebrow}
            </p>
            <h2 id="about-heading" className="section-heading mt-3">
              {about.heading}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#39495A] dark:text-dark-200">
              {about.intro}
            </p>
            {about.paragraphs.map((paragraph, index) => <p key={index} className="mt-4 max-w-3xl leading-7 text-[#697483] dark:text-dark-400">{paragraph}</p>)}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {about.pillars.map((pillar, index) => {
              const Icon = icons[index % icons.length]
              return (
                <motion.article
                  key={pillar.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-sm border border-[#DDD7CC] bg-white/60 p-5 dark:border-dark-800 dark:bg-dark-900/55"
                >
                  {pillar.image ? <img src={pillar.image} alt={pillar.title} loading="lazy" className="mb-2 h-32 w-full rounded-sm object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#EEF1F3] text-[#526E8A] dark:bg-primary-500/10 dark:text-primary-400"><Icon className="h-5 w-5" /></div>}
                  <h3 className="mt-4 text-lg font-semibold text-[#10243E] dark:text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#697483] dark:text-dark-400">{pillar.description}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
