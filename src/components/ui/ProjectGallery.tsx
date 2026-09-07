'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ProjectCard from '@/components/ui/ProjectCard'
import ProjectFilter from '@/components/ui/ProjectFilter'
import {
  projectFilters,
  showcaseProjects,
  type ProjectFilter as ProjectFilterValue,
  type ShowcaseProject,
} from '@/data/portfolio'

interface ProjectGalleryProps {
  onOpenProject?: (project: ShowcaseProject) => void
}

export default function ProjectGallery({ onOpenProject }: ProjectGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterValue>('All')
  const reduceMotion = useReducedMotion()

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All') return showcaseProjects
    return showcaseProjects.filter((project) => project.categories.includes(activeFilter))
  }, [activeFilter])

  return (
    <div>
      <ProjectFilter
        filters={projectFilters}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="mt-8" aria-live="polite">
        <p className="sr-only">
          Showing {visibleProjects.length} project{visibleProjects.length === 1 ? '' : 's'}.
        </p>

        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            >
              <ProjectCard project={project} index={index} onOpen={onOpenProject} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
