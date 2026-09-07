import { ArrowUpRight } from 'lucide-react'
import type { ProfessionalRole } from '@/data/portfolio'

interface ExperienceTimelineProps {
  roles: ProfessionalRole[]
}

export default function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <ol className="grid gap-4">
      {roles.map((role, index) => (
        <li key={role.title} className="group grid gap-4 rounded-xl border border-brand-sky/20 bg-brand-sky/[0.05] p-5 transition hover:bg-brand-sky/[0.09] sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-5 sm:p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-sky text-[0.66rem] font-bold tracking-[0.12em] text-brand-chocolate" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-sky/75">Professional profile</p>
            <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-sky sm:text-4xl">{role.title}</h3>
            <p className="mt-3 max-w-3xl text-base leading-7 text-brand-sky/70">{role.description}</p>
          </div>
          <ArrowUpRight className="hidden h-5 w-5 text-brand-sky/40 transition group-hover:text-brand-sky sm:block" aria-hidden="true" />
        </li>
      ))}
    </ol>
  )
}
