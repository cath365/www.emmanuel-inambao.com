import { Metadata } from 'next'
import BlogList from './BlogList'

export const metadata: Metadata = {
  title: 'Blog | Emmanuel Inambao',
  description: 'Technical articles, tutorials, and insights on embedded systems, IoT, robotics, and engineering solutions by Emmanuel Inambao.',
  openGraph: {
    title: 'Blog | Emmanuel Inambao',
    description: 'Technical articles, tutorials, and insights on embedded systems, IoT, robotics, and engineering.',
  },
}

// Keep titles and reading times in sync with src/app/blog/[slug]/page.tsx.
// Leave coverImage empty unless the file exists in /public; BlogList shows a fallback.
const blogPosts = [
  {
    id: '1',
    slug: 'getting-started-with-esp32',
    title: 'Getting Started with ESP32 for IoT Projects',
    excerpt: 'A comprehensive guide to setting up your first ESP32 project, from hardware selection to your first sensor reading.',
    coverImage: '',
    category: 'IoT',
    author: 'Emmanuel Inambao',
    publishedAt: '',
    readingTime: '8 min read',
    tags: ['ESP32', 'IoT', 'Tutorial', 'Arduino'],
  },
  {
    id: '2',
    slug: 'smart-irrigation-system',
    title: 'Planning a Smart Irrigation Prototype for Field Conditions',
    excerpt: 'A design note on planning an offline-capable irrigation prototype using sensing, control logic and field-friendly connectivity.',
    coverImage: '',
    category: 'Engineering Notes',
    author: 'Emmanuel Inambao',
    publishedAt: '',
    readingTime: '8 min read',
    tags: ['Agriculture', 'IoT', 'Automation', 'Prototype Planning'],
  },
  {
    id: '3',
    slug: 'pcb-design-best-practices',
    title: 'PCB Design Review Checklist for Embedded Systems',
    excerpt: 'A practical checklist of grounding, trace routing, component placement and design-review considerations for embedded boards.',
    coverImage: '',
    category: 'Hardware',
    author: 'Emmanuel Inambao',
    publishedAt: '',
    readingTime: '8 min read',
    tags: ['PCB', 'Hardware', 'Design Review'],
  },
  {
    id: '4',
    slug: 'nextjs-for-iot-dashboards',
    title: 'Building Real-Time IoT Dashboards with Next.js',
    excerpt: 'How to create responsive, real-time dashboards for monitoring IoT devices using Next.js, WebSockets, and Chart.js.',
    coverImage: '',
    category: 'Web Dev',
    author: 'Emmanuel Inambao',
    publishedAt: '',
    readingTime: '15 min read',
    tags: ['Next.js', 'React', 'IoT', 'Dashboard'],
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-dark-950 light:bg-slate-50 pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white light:text-slate-900 mt-2">
            Technical <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-dark-400 light:text-slate-600 mt-4 max-w-2xl mx-auto">
            Sharing knowledge on embedded systems, IoT, robotics, and full-stack development.
          </p>
        </div>

        {/* Blog list */}
        <BlogList posts={blogPosts} />
      </div>
    </main>
  )
}
