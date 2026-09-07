import SkillGroup from '@/components/ui/SkillGroup'
import { skillGroups } from '@/data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="bg-brand-cream py-16 text-brand-navy sm:py-20 lg:py-24" aria-labelledby="skills-heading">
      <div className="section-container">
        <div className="border-t border-brand-navy/10 pt-10">
          <div className="grid gap-5 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-chocolate/65">Capabilities</p>
              <h2 id="skills-heading" className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] text-brand-navy sm:text-5xl">Skills</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-brand-chocolate/70 lg:justify-self-end">
              The technologies and engineering disciplines I use to build connected products and software systems.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {skillGroups.map((group, index) => (
              <SkillGroup key={group.id} group={group} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
