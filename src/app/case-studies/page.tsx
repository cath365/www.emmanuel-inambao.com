import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CaseStudyList from './CaseStudyList'
import { getAllCaseStudies } from '@/lib/case-study-runtime'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Engineering Case Studies',
  description: 'Evidence-based case studies covering embedded systems, IoT, robotics and platform engineering by Emmanuel Inambao.',
  alternates: { canonical: '/case-studies' },
}

export default async function CaseStudiesPage() {
  const studies = await getAllCaseStudies()

  return (
    <main className="min-h-screen bg-[#F7F5EF] pb-20 pt-24 text-[#293442] dark:bg-dark-950 dark:text-dark-100">
      <div className="section-container">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#667384] hover:text-[#10243E] dark:text-dark-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#526E8A] dark:text-accent-400">Case studies</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-[#10243E] dark:text-white sm:text-5xl lg:text-6xl">
            From problem definition to working system.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#667384] dark:text-dark-400">
            These studies focus on documented engineering decisions, constraints, architecture, implementation and delivery status without invented metrics.
          </p>
        </div>

        <CaseStudyList studies={studies} />
      </div>
    </main>
  )
}
