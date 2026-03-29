import { MetadataRoute } from 'next'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'pt', 'es', 'de', 'ar', 'zh'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'
  const lastModified = new Date()

  // Define all pages
  const pages = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/#about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/#projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/#skills', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/#contact', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/#gallery', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/#education', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/case-studies', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/resume', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/changelog', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  // Generate sitemap entries with alternates for each page
  const sitemapEntries: MetadataRoute.Sitemap = pages.map(page => {
    // Create alternates object for hreflang
    const alternates: { languages: Record<string, string> } = {
      languages: {}
    }
    
    SUPPORTED_LANGUAGES.forEach(lang => {
      alternates.languages[lang] = `${baseUrl}${page.path}?lang=${lang}`
    })
    
    // Add x-default for default language
    alternates.languages['x-default'] = `${baseUrl}${page.path}`

    return {
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates,
    }
  })

  return sitemapEntries
}
