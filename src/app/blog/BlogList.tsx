'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  author: string
  publishedAt: string
  readingTime: string
  tags: string[]
}

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-2 gap-8"
    >
      {posts.map((post) => (
        <motion.article
          key={post.id}
          variants={itemVariants}
          className="group bg-dark-900/50 light:bg-white border border-dark-800 light:border-slate-200 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300"
        >
          {/* Cover image */}
          <div className="relative h-48 bg-dark-800 light:bg-slate-100 overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Tag className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            {/* Category badge */}
            <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500/90 text-white text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-dark-400 light:text-slate-500 mb-3">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-dark-400 light:text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-dark-800 light:bg-slate-100 text-dark-300 light:text-slate-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Read more */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors group/link"
            >
              Read Article
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
