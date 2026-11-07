import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

import { blogPosts } from '@/lib/blog-posts'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return { title: 'Blog Post Not Found' }
  }
  
  return {
    title: `${post.title} | Blog | Emmanuel Inambao`,
    description: post.content[0],
  }
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-dark-950 light:bg-slate-50 pt-24 pb-16">
      <article className="section-container max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white light:text-slate-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400 light:text-slate-500">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-invert light:prose-slate max-w-none">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-dark-300 light:text-slate-600 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-dark-800 light:border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-dark-500" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-dark-800 light:bg-slate-100 text-dark-300 light:text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author footer */}
        <div className="mt-8 p-6 bg-dark-900/50 light:bg-white border border-dark-800 light:border-slate-200 rounded-xl">
          <p className="text-sm text-dark-400 light:text-slate-500 mb-1">Written by</p>
          <p className="text-white light:text-slate-900 font-semibold">Emmanuel Inambao</p>
          <p className="text-sm text-dark-400 light:text-slate-500">
            Robotics &amp; IoT Engineer, Full-Stack Systems Developer and Technical Project Manager based in Lusaka, Zambia.
          </p>
        </div>
      </article>
    </main>
  )
}
