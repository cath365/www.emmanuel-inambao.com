'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { caseStudies } from '@/lib/case-studies'

export default function CaseStudyList() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {caseStudies.map((study, index) => (
        <motion.article
          key={study.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.07 }}
          className="group flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-dark-800 bg-dark-900/65 transition hover:-translate-y-1 hover:border-primary-500/40"
        >
          <div className="relative min-h-44 overflow-hidden bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 p-6">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-primary-400/15" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">{study.status}</p>
            <h2 className="relative mt-3 max-w-lg text-2xl font-bold text-white">{study.title}</h2>
            <p className="relative mt-2 text-sm leading-relaxed text-dark-300">{study.subtitle}</p>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-wrap gap-2">
              {study.technologies.slice(0, 5).map(tech => <span key={tech} className="tech-badge text-xs">{tech}</span>)}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {study.results.slice(0, 4).map(result => (
                <div key={result.label} className="rounded-xl border border-dark-800 bg-dark-950/50 p-3">
                  <div className="font-bold text-primary-300">{result.value}</div>
                  <div className="mt-0.5 text-xs text-dark-500">{result.label}</div>
                </div>
              ))}
            </div>

            <Link href={'/case-studies/' + study.slug} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-primary-400 hover:text-primary-300">
              Read case study <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
