import { Braces, Cpu, Gauge, Workflow } from 'lucide-react'
import type { SkillGroupData } from '@/data/portfolio'

interface SkillGroupProps {
  group: SkillGroupData
  index: number
}

const icons = [Braces, Cpu, Gauge, Workflow]

export default function SkillGroup({ group, index }: SkillGroupProps) {
  const Icon = icons[index % icons.length]

  return (
    <article className="h-full overflow-hidden rounded-xl border border-brand-navy/10 bg-white/60">
      <div className="border-b border-brand-navy/10 p-5 text-brand-navy sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-brand-chocolate/65">Capability 0{index + 1}</p>
            <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-[2.15rem]">{group.title}</h3>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand-sky/40 bg-brand-sky/20 text-brand-navy">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-brand-chocolate/70">{group.description}</p>
      </div>

      <ul className="grid gap-0" aria-label={`${group.title} skills`}>
        {group.skills.map((skill, skillIndex) => (
          <li key={skill.name} className="grid grid-cols-[auto_1fr] gap-3 border-b border-brand-navy/10 p-4 last:border-b-0 sm:p-5">
            <span className="mt-1 text-[0.58rem] font-bold tracking-[0.12em] text-brand-chocolate/45">{String(skillIndex + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-semibold text-brand-navy">{skill.name}</p>
              <p className="mt-1 text-sm leading-6 text-brand-chocolate/65">{skill.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
