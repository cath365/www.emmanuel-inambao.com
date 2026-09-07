import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { caseStudies, caseStudiesBySlug } from '@/lib/case-studies'
import CaseStudyContent from './CaseStudyContent'

export function generateStaticParams() {
  return caseStudies.map(study => ({ slug: study.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const study = caseStudiesBySlug[params.slug]

  if (!study) return { title: 'Case Study Not Found' }

  return {
    title: study.title + ' | Case Study',
    description: study.overview,
    alternates: { canonical: '/case-studies/' + study.slug },
  }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudiesBySlug[params.slug]
  if (!study) notFound()
  return <CaseStudyContent study={study} />
}
