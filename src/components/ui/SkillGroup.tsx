import type { SkillGroupData } from '@/data/portfolio'

interface SkillGroupProps {
  group: SkillGroupData
  index: number
}

export default function SkillGroup({ group, index }: SkillGroupProps) {
  return (
    <article className="editorial-card h-full p-5 sm:p-7">
      <div className="flex items-start justify-between gap-5 border-b border-brand-navy/10 pb-5 dark:border-brand-cream/10">
        <div>
          <p className="editorial-label">0{index + 1}</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-navy dark:text-brand-cream">
            {group.title}
          </h3>
        </div>
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand-sky" aria-hidden="true" />
      </div>

      <p className="mt-5 text-sm leading-6 text-brand-chocolate/75 dark:text-brand-cream/65">
        {group.description}
      </p>

      <ul className="mt-6 grid gap-3" aria-label={`${group.title} skills`}>
        {group.skills.map((skill) => (
          <li
            key={skill.name}
            className="rounded-2xl border border-brand-navy/8 bg-brand-cream/70 p-4 dark:border-brand-cream/10 dark:bg-white/[0.035]"
          >
            <p className="font-semibold text-brand-navy dark:text-brand-cream">{skill.name}</p>
            <p className="mt-1 text-sm leading-6 text-brand-chocolate/65 dark:text-brand-cream/55">
              {skill.description}
            </p>
          </li>
        ))}
      </ul>
    </article>
  )
}
