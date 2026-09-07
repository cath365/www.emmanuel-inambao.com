import type { ProfessionalRole } from '@/data/portfolio'

interface ExperienceTimelineProps {
  roles: ProfessionalRole[]
}

export default function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <ol className="relative grid gap-0 border-l border-brand-navy/15 pl-6 dark:border-brand-cream/15 sm:pl-9">
      {roles.map((role, index) => (
        <li key={role.title} className="relative pb-10 last:pb-0">
          <span
            className="absolute -left-[2.05rem] top-1 grid h-8 w-8 place-items-center rounded-full border border-brand-sky bg-brand-cream text-[0.65rem] font-bold tracking-wider text-brand-navy dark:bg-brand-navy dark:text-brand-cream sm:-left-[2.8rem]"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="editorial-label">Professional profile</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold text-brand-navy dark:text-brand-cream sm:text-4xl">
            {role.title}
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-7 text-brand-chocolate/72 dark:text-brand-cream/65">
            {role.description}
          </p>
        </li>
      ))}
    </ol>
  )
}
