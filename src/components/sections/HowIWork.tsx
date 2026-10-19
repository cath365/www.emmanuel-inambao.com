'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, CheckCircle2, Calendar, PenTool, Wrench, Rocket, RefreshCw } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'

export default function HowIWork() {
  const { content } = useSiteContent()
  const { process } = content
  const icons = [Search, CheckCircle2, Calendar, PenTool, Wrench, CheckCircle2, Rocket, RefreshCw]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="process" className="bg-[#F7F5EF] py-20 dark:bg-dark-950 lg:py-28">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">{process.eyebrow}</p>
          <h2 className="section-heading">{process.heading}</h2>
          <p className="section-subheading mx-auto mt-4">
            {process.intro}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, index) => {
            const Icon = icons[index % icons.length]
            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-sm border border-[#DDD7CC] bg-white/60 p-5 dark:border-dark-800 dark:bg-dark-900/55"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#10243E] text-white dark:bg-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#8A918F] dark:text-dark-500">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#10243E] dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#697483] dark:text-dark-400">{step.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
