import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudyBySlug } from '@/lib/case-study-runtime'
import CaseStudyContent from './CaseStudyContent'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const study = await getCaseStudyBySlug(params.slug)

  if (!study) return { title: 'Case Study Not Found' }

  return {
    title: study.title + ' | Case Study',
    description: study.overview,
    alternates: { canonical: '/case-studies/' + study.slug },
  }
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study) notFound()
  return <CaseStudyContent study={study} />
}
