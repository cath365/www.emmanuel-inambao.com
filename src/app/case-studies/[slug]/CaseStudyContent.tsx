'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Network, Wrench, Gauge } from 'lucide-react'
import type { CaseStudy } from '@/lib/case-studies'

export default function CaseStudyContent({ study }: { study: CaseStudy }) {
  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <article className="section-container max-w-6xl">
        <Link href="/case-studies" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> All case studies
        </Link>

        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-primary-400/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{study.status}</span>
            <span className="rounded-full border border-dark-700 bg-dark-900 px-3 py-1 text-xs font-medium text-dark-300">{study.role}</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{study.title}</h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-dark-300 sm:text-xl">{study.subtitle}</p>
          <p className="mt-3 text-sm text-dark-500">{study.timeline}</p>
        </motion.header>

        <section className="mt-10 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Overview</h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-dark-300">{study.overview}</p>
          {study.links && study.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {study.links.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {link.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.results.map(result => (
            <div key={result.label} className="rounded-2xl border border-dark-800 bg-dark-900/55 p-5">
              <Gauge className="h-5 w-5 text-primary-400" />
              <div className="mt-4 text-2xl font-bold text-white">{result.value}</div>
              <div className="mt-1 text-sm font-semibold text-primary-300">{result.label}</div>
              <p className="mt-2 text-xs leading-relaxed text-dark-500">{result.description}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-red-400" /><h2 className="text-2xl font-bold text-white">Engineering challenge</h2></div>
            <ul className="mt-5 space-y-4">
              {study.challenge.map(item => (
                <li key={item} className="flex items-start gap-3 text-dark-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-400" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-400" /><h2 className="text-2xl font-bold text-white">Solution</h2></div>
            <ul className="mt-5 space-y-4">
              {study.solution.map(item => (
                <li key={item} className="flex items-start gap-3 text-dark-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" /> {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3"><Network className="h-5 w-5 text-accent-400" /><h2 className="text-2xl font-bold text-white">System architecture</h2></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {study.architecture.map((item, index) => (
              <div key={item} className="rounded-xl border border-dark-800 bg-dark-950/60 p-4">
                <span className="text-xs font-semibold text-primary-400">0{index + 1}</span>
                <p className="mt-2 font-medium text-dark-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Technology stack</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {study.technologies.map(tech => <span key={tech} className="tech-badge">{tech}</span>)}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-950/30 p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">Project enquiry</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Need a system with similar engineering depth?</h2>
          <p className="mt-3 max-w-2xl text-dark-300">Share the operational problem, hardware constraints, software requirements and deployment environment.</p>
          <Link href="/start-project" className="btn-primary mt-6">Start a project</Link>
        </section>
      </article>
    </main>
  )
}
