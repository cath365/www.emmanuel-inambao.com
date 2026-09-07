import type { Metadata } from 'next'
import CaseStudyList from './CaseStudyList'

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Engineering case studies from Emmanuel Inambao covering AI, IoT, robotics, embedded systems, mobile applications and full-stack product development.',
}

export default function CaseStudiesPage() {
  return (
    <section className="min-h-screen bg-brand-cream pb-24 pt-32 dark:bg-brand-navy sm:pt-36">
      <div className="section-container">
        <div className="grid gap-8 border-b border-brand-navy/10 pb-10 dark:border-brand-cream/10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="editorial-label">Engineering Work</p>
            <h1 className="section-heading mt-4">Case Studies</h1>
          </div>
          <p className="section-subheading lg:ml-auto">
            Detailed project views focused on the problem, proposed solution, architecture,
            workflow, current status and next engineering steps. No invented customer results or
            performance statistics are used.
          </p>
        </div>

        <div className="mt-10">
          <CaseStudyList />
        </div>
      </div>
    </section>
  )
}
