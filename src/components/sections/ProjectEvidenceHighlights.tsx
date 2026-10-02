'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink, FileText, Image as ImageIcon, MonitorPlay, PackageCheck } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useProjects } from '@/lib/projects'
import { useGallery } from '@/lib/gallery'

const evidencePriority = {
  'Live application': 0,
  Deployment: 1,
  Prototype: 2,
  Video: 3,
  Photo: 4,
  Testing: 5,
  Repository: 6,
  Document: 7,
  Event: 8,
  Other: 9,
} as const

const evidenceIcons = {
  Prototype: PackageCheck,
  Photo: ImageIcon,
  Video: MonitorPlay,
  'Live application': ExternalLink,
  Repository: ExternalLink,
  Document: FileText,
  Testing: PackageCheck,
  Deployment: ExternalLink,
  Event: FileText,
  Other: FileText,
} as const

export default function ProjectEvidenceHighlights() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { projects } = useProjects()
  const { items: galleryItems } = useGallery()

  const evidenceItems = useMemo(
    () => {
      const projectEvidence = projects.flatMap(project => {
        const structuredEvidence = (project.evidence || []).map(item => ({
          ...item,
          projectId: project.id,
          projectTitle: project.title,
          domain: project.domain,
        }))

        const mediaEvidence = (project.media || [])
          .filter(item => item.src && (item.caption || item.alt))
          .map(item => ({
            label: item.caption || item.alt,
            type: 'Photo' as const,
            description: item.caption || undefined,
            url: '/projects/' + project.id,
            projectId: project.id,
            projectTitle: project.title,
            domain: project.domain,
          }))

        return [...structuredEvidence, ...mediaEvidence]
      })

      const linkedGalleryEvidence = galleryItems
        .filter(item => item.projectId)
        .map(item => {
          const project = projects.find(project => project.id === item.projectId)
          return {
            label: item.title,
            type: item.type === 'video' ? ('Video' as const) : ('Photo' as const),
            description: item.description || undefined,
            url: '/projects/' + item.projectId,
            projectId: item.projectId as string,
            projectTitle: project?.title || 'Project evidence',
            domain: project?.domain,
          }
        })

      const featuredIds = new Set(projects.filter(project => project.featured).map(project => project.id))
      const ranked = [...projectEvidence, ...linkedGalleryEvidence]
        .filter(item => item.label)
        .sort((a, b) => {
          const featuredDifference = Number(featuredIds.has(b.projectId)) - Number(featuredIds.has(a.projectId))
          if (featuredDifference !== 0) return featuredDifference
          return evidencePriority[a.type] - evidencePriority[b.type]
        })

      const seenProjects = new Set<string>()
      return ranked
        .filter(item => {
          if (seenProjects.has(item.projectId)) return false
          seenProjects.add(item.projectId)
          return true
        })
        .slice(0, 6)
    },
    [projects, galleryItems]
  )

  if (evidenceItems.length === 0) return null

  return (
    <section
      id="evidence"
      ref={ref}
      className="border-b border-[#DED8CE] bg-[#FCFBF7] py-16 dark:border-dark-800/60 dark:bg-dark-950 sm:py-20 lg:py-24"
      aria-labelledby="evidence-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
              Real-world work & evidence
            </p>
            <h2 id="evidence-heading" className="section-heading mt-3">
              Claims should be backed by something you can inspect.
            </h2>
            <p className="section-subheading mt-4 max-w-3xl">
              These links point to live systems, case studies, documents, prototypes or other project evidence already attached to the portfolio. More evidence can be added from the Admin dashboard without changing the page code.
            </p>
          </div>
          <Link href="/projects" className="btn-secondary">
            Browse project evidence <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evidenceItems.map((item, index) => {
            const Icon = evidenceIcons[item.type] || FileText
            const card = (
              <div className="h-full rounded-sm border border-[#DDD7CC] bg-white/70 p-5 transition hover:border-[#AAB6C2] dark:border-dark-800 dark:bg-dark-900/55 dark:hover:border-primary-500/35">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#EEF1F3] text-[#526E8A] dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A918F] dark:text-dark-500">
                    {item.type}
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#526E8A] dark:text-primary-400">
                  {item.projectTitle}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#10243E] dark:text-white">{item.label}</h3>
                {item.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667384] dark:text-dark-400">{item.description}</p>
                )}
                <p className="mt-4 text-xs text-[#8A918F] dark:text-dark-500">
                  {item.domain || 'Engineering project'}
                </p>
              </div>
            )

            if (item.url?.startsWith('http')) {
              return (
                <motion.a
                  key={item.projectId + item.label + index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  aria-label={item.label + ' — opens external evidence'}
                >
                  {card}
                </motion.a>
              )
            }

            return (
              <motion.div
                key={item.projectId + item.label + index}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link href={item.url || '/projects/' + item.projectId}>{card}</Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
