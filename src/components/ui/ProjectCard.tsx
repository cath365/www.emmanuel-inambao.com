'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, ChevronRight, Globe, Smartphone, FileText, Play } from 'lucide-react'
import type { Project } from '@/lib/project-catalog'

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.24) }}
      className="grid items-center gap-7 lg:grid-cols-2 lg:gap-12"
    >
      <div className={'relative overflow-hidden ' + (isEven ? 'lg:order-1' : 'lg:order-2')}>
        <Link
          href={'/projects/' + project.id}
          className="group relative block aspect-video overflow-hidden rounded-2xl border border-dark-700 bg-dark-800"
          aria-label={'Open ' + project.title + ' project details'}
        >
          {project.image ? (
            <>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950">
              <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full border border-primary-400/20" />
              <div className="absolute -bottom-16 -left-8 h-64 w-64 rounded-full border border-accent-400/10" />
              <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
                    Engineering system
                  </span>
                  <p className="mt-2 max-w-md text-2xl font-bold text-white sm:text-3xl">
                    {project.title}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {project.featured && (
              <span className="rounded-full border border-accent-300/30 bg-accent-400/15 px-3 py-1 text-xs font-semibold text-accent-300 backdrop-blur">
                Featured
              </span>
            )}
            {project.status && (
              <span className="rounded-full border border-white/10 bg-dark-950/60 px-3 py-1 text-xs font-medium text-dark-200 backdrop-blur">
                {project.status}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
        {project.role && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
            {project.role}
          </p>
        )}

        <h3 className="text-2xl font-bold text-white lg:text-3xl">
          <Link href={'/projects/' + project.id} className="transition-colors hover:text-primary-300">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 font-medium leading-relaxed text-primary-400">{project.purpose}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 7).map(tech => (
            <span key={tech} className="tech-badge text-xs">{tech}</span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-300">Problem</h4>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-dark-400">{project.problemSolved}</p>
          </div>
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-300">Outcome</h4>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-dark-400">{project.outcome}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={'/projects/' + project.id}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-500"
          >
            View engineering details
            <ChevronRight className="h-4 w-4" />
          </Link>

          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary-300 hover:text-primary-200">
              <ExternalLink className="h-4 w-4" /> Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-dark-300 hover:text-white">
              <Github className="h-4 w-4" /> Code
            </a>
          )}
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200">
              <Globe className="h-4 w-4" /> Website
            </a>
          )}
          {project.appStoreUrl && <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" aria-label="App Store"><Smartphone className="h-4 w-4" /></a>}
          {project.playStoreUrl && <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" aria-label="Play Store"><Smartphone className="h-4 w-4" /></a>}
          {project.docsUrl && <a href={project.docsUrl} target="_blank" rel="noopener noreferrer" aria-label="Documentation"><FileText className="h-4 w-4" /></a>}
          {project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Video"><Play className="h-4 w-4" /></a>}
        </div>
      </div>
    </motion.article>
  )
}
