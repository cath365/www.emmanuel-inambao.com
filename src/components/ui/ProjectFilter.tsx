'use client'

import type { ProjectFilter as ProjectFilterValue } from '@/data/portfolio'

interface ProjectFilterProps {
  filters: ProjectFilterValue[]
  activeFilter: ProjectFilterValue
  onChange: (filter: ProjectFilterValue) => void
}

export default function ProjectFilter({
  filters,
  activeFilter,
  onChange,
}: ProjectFilterProps) {
  return (
    <div
      className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      aria-label="Filter selected projects"
    >
      <div className="flex min-w-max gap-2" role="group" aria-label="Project categories">
        {filters.map((filter) => {
          const active = filter === activeFilter
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange(filter)}
              aria-pressed={active}
              className={
                'min-h-10 rounded-full border px-4 text-sm font-semibold transition ' +
                (active
                  ? 'border-brand-navy bg-brand-navy text-brand-cream dark:border-brand-sky dark:bg-brand-sky dark:text-brand-navy'
                  : 'border-brand-navy/10 bg-transparent text-brand-chocolate hover:border-brand-sky hover:text-brand-navy dark:border-brand-cream/10 dark:text-brand-cream/60 dark:hover:text-brand-sky')
              }
            >
              {filter}
            </button>
          )
        })}
      </div>
    </div>
  )
}
