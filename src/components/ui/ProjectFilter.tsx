'use client'

import type { ProjectFilter as ProjectFilterValue } from '@/data/portfolio'

interface ProjectFilterProps {
  filters: ProjectFilterValue[]
  activeFilter: ProjectFilterValue
  onChange: (filter: ProjectFilterValue) => void
}

export default function ProjectFilter({ filters, activeFilter, onChange }: ProjectFilterProps) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-brand-chocolate/20 px-4 sm:mx-0 sm:px-0" aria-label="Filter selected projects">
      <div className="flex min-w-max gap-7" role="group" aria-label="Project categories">
        {filters.map((filter) => {
          const active = filter === activeFilter
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange(filter)}
              aria-pressed={active}
              className={
                'border-b-2 py-3 text-sm font-semibold transition ' +
                (active
                  ? 'border-brand-chocolate text-brand-chocolate'
                  : 'border-transparent text-brand-chocolate/55 hover:text-brand-chocolate')
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
