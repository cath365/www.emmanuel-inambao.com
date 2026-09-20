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

// Sample blog posts - in production, fetch from CMS or database
const blogPosts = [
  {
    id: '1',
    slug: 'getting-started-with-esp32',
    title: 'Getting Started with ESP32 for IoT Projects',
    excerpt: 'A comprehensive guide to setting up your first ESP32 project, from hardware selection to your first sensor reading.',
    coverImage: '/images/blog/esp32-guide.jpg',
    category: 'IoT',
    author: 'Emmanuel Inambao',
    publishedAt: '2026-01-05',
    readingTime: '8 min read',
    tags: ['ESP32', 'IoT', 'Tutorial', 'Arduino'],
  },
  {
    id: '2',
    slug: 'smart-irrigation-system',
    title: 'Building a Smart Irrigation System for African Farms',
    excerpt: 'How I designed and deployed an automated irrigation system that works offline and helps farmers conserve water.',
    coverImage: '/images/blog/irrigation.jpg',
    category: 'Projects',
    author: 'Emmanuel Inambao',
    publishedAt: '2025-12-20',
    readingTime: '12 min read',
    tags: ['Agriculture', 'IoT', 'Automation', 'Case Study'],
  },
  {
    id: '3',
    slug: 'pcb-design-best-practices',
    title: 'PCB Design Best Practices for Embedded Systems',
    excerpt: 'Lessons learned from designing dozens of PCBs: grounding, trace routing, component placement, and avoiding common mistakes.',
    coverImage: '/images/blog/pcb-design.jpg',
    category: 'Hardware',
    author: 'Emmanuel Inambao',
    publishedAt: '2025-12-10',
    readingTime: '10 min read',
    tags: ['PCB', 'Hardware', 'Best Practices', 'Design'],
  },
  {
    id: '4',
    slug: 'nextjs-for-iot-dashboards',
    title: 'Building Real-Time IoT Dashboards with Next.js',
    excerpt: 'How to create responsive, real-time dashboards for monitoring IoT devices using Next.js, WebSockets, and Chart.js.',
    coverImage: '/images/blog/dashboard.jpg',
    category: 'Web Dev',
    author: 'Emmanuel Inambao',
    publishedAt: '2025-11-28',
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
