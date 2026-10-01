'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Github, Globe } from 'lucide-react'
import type { Project } from '@/lib/project-catalog'

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0
  const problemHeadline = project.problemTagline || project.problemSolved
  const solution = project.solutionSummary || project.purpose

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.18) }}
      className="grid items-center gap-7 lg:grid-cols-2 lg:gap-12"
    >
      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
        <Link
          href={'/projects/' + project.id}
          className="group relative block aspect-video overflow-hidden rounded-sm border border-[#D5D0C7] bg-white/70 dark:border-dark-700 dark:bg-dark-800"
          aria-label={'Open ' + project.title + ' project details'}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.media?.[0]?.alt || project.title}
              fill
              unoptimized
              className={project.media?.[0]?.fit === 'contain' ? 'object-contain' : 'object-cover transition-transform duration-500 group-hover:scale-[1.01]'}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-end bg-[#10243E] p-6 dark:bg-dark-900 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C7D3DE] dark:text-primary-300">
                  {project.domain || 'Engineering solution'}
                </p>
                <p className="mt-2 max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {project.title}
                </p>
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {project.status && (
              <span className="rounded-sm border border-white/20 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">
                {project.status}
              </span>
            )}
            {project.domain && (
              <span className="rounded-sm border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#39495A] backdrop-blur dark:bg-dark-950/75 dark:text-dark-200">
                {project.domain}
              </span>
            )}
          </div>
        </Link>
        {project.media?.[0]?.caption && (
          <p className="mt-2 text-xs leading-5 text-[#7A8491] dark:text-dark-500">
            Evidence: {project.media[0].caption}
          </p>
        )}
      </div>

      <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#526E8A] dark:text-primary-400">
          <span>{project.title}</span>
          {project.projectType && <span className="text-[#8A918F] dark:text-dark-500">· {project.projectType}</span>}
        </div>

        <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-[#10243E] dark:text-white lg:text-4xl">
          <Link href={'/projects/' + project.id} className="transition-colors hover:text-[#526E8A] dark:hover:text-primary-300">
            {problemHeadline}
          </Link>
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-[#DDD7CC] bg-[#FAF8F3] p-4 dark:border-dark-800 dark:bg-dark-900/50">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A8491] dark:text-dark-500">Problem</p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#566273] dark:text-dark-400">{project.problemSolved}</p>
          </div>
          <div className="rounded-sm border border-[#DDD7CC] bg-[#FAF8F3] p-4 dark:border-dark-800 dark:bg-dark-900/50">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A8491] dark:text-dark-500">Solution</p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#566273] dark:text-dark-400">{solution}</p>
          </div>
        </div>

        {(project.role || project.contribution) && (
          <div className="mt-5 border-l-2 border-[#B9C7D5] pl-4 dark:border-primary-500/35">
            {project.role && <p className="text-sm font-semibold text-[#10243E] dark:text-white">My role: {project.role}</p>}
            {project.contribution && <p className="mt-1 text-xs text-[#7A8491] dark:text-dark-500">{project.contribution}</p>}
          </div>
        )}

        {project.expectedImpact && (
          <p className="mt-5 text-sm leading-6 text-[#4F6758] dark:text-green-300">
            <span className="font-semibold">Expected impact:</span> {project.expectedImpact}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map(tech => (
            <span key={tech} className="tech-badge text-xs">{tech}</span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={'/projects/' + project.id}
            className="inline-flex items-center gap-2 rounded-sm bg-[#10243E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B3656] dark:bg-primary-600 dark:hover:bg-primary-500"
          >
            Problem → solution → evidence <ArrowRight className="h-4 w-4" />
          </Link>

          {project.liveUrl && project.liveUrl !== project.websiteUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#526E8A] hover:text-[#10243E] dark:text-primary-300 dark:hover:text-primary-200">
              Live system <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#526E8A] hover:text-[#10243E] dark:text-primary-300 dark:hover:text-primary-200">
              Website <Globe className="h-4 w-4" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#667384] hover:text-[#10243E] dark:text-dark-300 dark:hover:text-white">
              Code <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
