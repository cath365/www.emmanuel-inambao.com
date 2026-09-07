import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShowcaseProject, showcaseProjects } from '@/data/portfolio'
import CaseStudyContent from './CaseStudyContent'

export function generateStaticParams() {
  return showcaseProjects.map((project) => ({ slug: project.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const project = getShowcaseProject(params.slug)

  if (!project) {
    return { title: 'Case Study Not Found' }
  }

  return {
    title: project.name + ' | Case Study',
    description: project.caseStudy.overview,
  }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getShowcaseProject(params.slug)

  if (!project) notFound()

  return <CaseStudyContent project={project} />
}
