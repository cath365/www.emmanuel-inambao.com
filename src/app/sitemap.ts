import type { MetadataRoute } from 'next'
import { defaultProjects, mergeWithCurrentCatalog, type Project } from '@/lib/project-catalog'
import { getAllCaseStudies } from '@/lib/case-study-runtime'
import { getInitialPortfolio } from '@/lib/portfolio-server'
import { blogPosts } from '@/lib/blog-posts'

// Rebuilt periodically so projects and case studies added in admin reach search engines.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuel-inambao-eight.vercel.app'
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: baseUrl + '/projects', lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: baseUrl + '/hire', lastModified, changeFrequency: 'monthly', priority: 0.95 },
    { url: baseUrl + '/hire/dossier', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/capabilities', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/capabilities/government', lastModified, changeFrequency: 'monthly', priority: 0.88 },
    { url: baseUrl + '/capabilities/aviation', lastModified, changeFrequency: 'monthly', priority: 0.88 },
    { url: baseUrl + '/capabilities/request', lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: baseUrl + '/case-studies', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/blog', lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: baseUrl + '/start-project', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/cv', lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: baseUrl + '/changelog', lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const { projects: savedProjects } = await getInitialPortfolio()
  const projects: Project[] = Array.isArray(savedProjects) && savedProjects.length > 0
    ? mergeWithCurrentCatalog(savedProjects)
    : defaultProjects

  const projectPages: MetadataRoute.Sitemap = projects
    .filter(project => project?.id)
    .map(project => ({
      url: baseUrl + '/projects/' + project.id,
      lastModified,
      changeFrequency: 'monthly',
      priority: project.featured ? 0.85 : 0.7,
    }))

  const caseStudyPages: MetadataRoute.Sitemap = (await getAllCaseStudies()).map(study => ({
    url: baseUrl + '/case-studies/' + study.slug,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = Object.keys(blogPosts).map(slug => ({
    url: baseUrl + '/blog/' + slug,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages, ...caseStudyPages, ...blogPages]
}
