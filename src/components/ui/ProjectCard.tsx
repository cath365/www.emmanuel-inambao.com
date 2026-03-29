'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Github, ChevronRight, Globe, Smartphone, FileText, Play } from 'lucide-react'

// Project data type definition
export interface Project {
  id: string
  title: string
  purpose: string
  image: string
  techStack: string[]
  problemSolved: string
  systemLogic: string
  outcome: string
  featured?: boolean
  githubUrl?: string
  liveUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  websiteUrl?: string
  docsUrl?: string
  videoUrl?: string
}

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
        isEven ? '' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Project Image */}
      <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-800 border border-dark-700 group">
          {project.image && project.image !== '' ? (
            <>
              {/* Actual project image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <>
              {/* Placeholder gradient when no image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-800 to-accent-900/30" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-600/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-400">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm">{project.title}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute -top-3 -right-3 bg-accent-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          {project.title}
        </h3>
        
        <p className="text-primary-400 font-medium mb-4">
          {project.purpose}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span key={tech} className="tech-badge text-xs">
              {tech}
            </span>
          ))}
        </div>

        {/* Project details */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-1">
              Problem Solved
            </h4>
            <p className="text-dark-400 text-sm leading-relaxed">
              {project.problemSolved}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-1">
              System Logic
            </h4>
            <p className="text-dark-400 text-sm leading-relaxed">
              {project.systemLogic}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-1">
              Outcome & Impact
            </h4>
            <p className="text-dark-400 text-sm leading-relaxed">
              {project.outcome}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-dark-300 hover:text-white transition-colors"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
              aria-label={`View ${project.title} live demo`}
            >
              <ExternalLink className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Demo</span>
            </a>
          )}
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              aria-label={`Visit ${project.title} website`}
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Website</span>
            </a>
          )}
          {project.appStoreUrl && (
            <a
              href={project.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              aria-label={`Download ${project.title} on App Store`}
            >
              <Smartphone className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">App Store</span>
            </a>
          )}
          {project.playStoreUrl && (
            <a
              href={project.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              aria-label={`Download ${project.title} on Play Store`}
            >
              <Smartphone className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Play Store</span>
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              aria-label={`View ${project.title} documentation`}
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Docs</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              aria-label={`Watch ${project.title} video`}
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Video</span>
            </a>
          )}
          <button 
            className="inline-flex items-center gap-1 text-dark-500 hover:text-dark-300 transition-colors sm:ml-auto"
            aria-label={`Read more about ${project.title}`}
          >
            <span className="text-sm">Details</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
