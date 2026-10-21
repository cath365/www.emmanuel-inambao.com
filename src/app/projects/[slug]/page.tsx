import type { Metadata } from 'next'
import { defaultProjects } from '@/lib/project-catalog'
import ProjectDetailClient from './ProjectDetailClient'

export function generateStaticParams() {
  return defaultProjects.map(project => ({ slug: project.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = defaultProjects.find(item => item.id === params.slug)

  if (!project) {
    return {
      title: 'Engineering Project',
      description: 'Engineering project by Emmanuel Inambao.',
    }
  }

  const description = [project.problemTagline || project.problemSolved, project.solutionSummary || project.purpose]
    .filter(Boolean)
    .join(' ')

  return {
    title: project.domain ? `${project.title} — ${project.domain}` : project.title,
    description,
    alternates: { canonical: '/projects/' + project.id },
    openGraph: {
      title: project.title,
      description,
      type: 'article',
    },
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetailClient slug={params.slug} />
}
