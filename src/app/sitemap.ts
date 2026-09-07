import type { MetadataRoute } from 'next'
import { defaultProjects } from '@/lib/project-catalog'
import { caseStudies } from '@/lib/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuel-inambao-eight.vercel.app'
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: baseUrl + '/projects', lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: baseUrl + '/case-studies', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/blog', lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: baseUrl + '/start-project', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/resume', lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: baseUrl + '/changelog', lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const projectPages: MetadataRoute.Sitemap = defaultProjects.map(project => ({
    url: baseUrl + '/projects/' + project.id,
    lastModified,
    changeFrequency: 'monthly',
    priority: project.featured ? 0.85 : 0.7,
  }))

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map(study => ({
    url: baseUrl + '/case-studies/' + study.slug,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...projectPages, ...caseStudyPages]
}
