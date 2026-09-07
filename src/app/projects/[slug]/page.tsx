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

  return {
    title: project.title,
    description: project.purpose,
    alternates: { canonical: '/projects/' + project.id },
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetailClient slug={params.slug} />
}
