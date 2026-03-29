'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Globe, Smartphone, FileText, Play, ChevronRight } from 'lucide-react'
import { useProjects } from '@/lib/projects'
import Image from 'next/image'

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { projects } = useProjects()

  const project = projects.find((p) => p.id === slug)

  if (!project) {
    return (
      <main className="min-h-screen bg-dark-950 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-dark-400 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/#projects" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </main>
    )
  }

  const otherProjects = projects.filter((p) => p.id !== slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-x-hidden">
      <div className="section-container max-w-5xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </Link>
        </motion.div>

        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {project.featured && (
            <span className="inline-block bg-accent-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              Featured Project
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-400 font-medium mb-4 sm:mb-6">
            {project.purpose}
          </p>
        </motion.div>

        {/* Project image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-dark-800 border border-dark-700 mb-8 sm:mb-12"
        >
          {project.image && project.image !== '' ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-800 to-accent-900/30" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-600/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-400">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm">{project.title}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3 sm:mb-4">
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-800 text-dark-200 rounded-lg border border-dark-700 text-xs sm:text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Detail sections */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-900/50 border border-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-base sm:text-lg font-bold">?</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">The Problem</h2>
            </div>
            <p className="text-dark-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {project.problemSolved}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-900/50 border border-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-base sm:text-lg font-bold">&lt;/&gt;</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">How It Works</h2>
            </div>
            <p className="text-dark-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {project.systemLogic}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-dark-900/50 border border-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-base sm:text-lg font-bold">+</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Outcome & Impact</h2>
            </div>
            <p className="text-dark-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {project.outcome}
            </p>
          </motion.div>
        </div>

        {/* Action links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-16"
        >
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm sm:text-base">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm sm:text-base">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> Live Demo
            </a>
          )}
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm sm:text-base">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> Website
            </a>
          )}
          {project.appStoreUrl && (
            <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm sm:text-base">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" /> App Store
            </a>
          )}
          {project.playStoreUrl && (
            <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm sm:text-base">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" /> Play Store
            </a>
          )}
          {project.docsUrl && (
            <a href={project.docsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm sm:text-base">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Docs
            </a>
          )}
          {project.videoUrl && (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-accent text-sm sm:text-base">
              <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Watch Video
            </a>
          )}
        </motion.div>

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group bg-dark-900/50 border border-dark-800 rounded-xl p-4 sm:p-6 hover:border-primary-500/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                    {p.purpose}
                  </p>
                  <div className="flex items-center gap-1 text-primary-400 text-sm font-medium">
                    View Project <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
