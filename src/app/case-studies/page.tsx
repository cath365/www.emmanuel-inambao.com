import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CaseStudyList from './CaseStudyList'

export const metadata: Metadata = {
  title: 'Engineering Case Studies',
  description: 'Evidence-based case studies covering embedded systems, IoT, robotics and platform engineering by Emmanuel Inambao.',
  alternates: { canonical: '/case-studies' },
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-400">Case studies</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">From problem definition to working system.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-400">
            These studies focus on real engineering decisions: constraints, architecture, control logic, platform design and delivery status — without inflated placeholder metrics.
          </p>
        </div>

        <CaseStudyList />
      </div>
    </main>
  )
}
