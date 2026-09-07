import ExperienceTimeline from '@/components/ui/ExperienceTimeline'
import { professionalRoles } from '@/data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="bg-brand-chocolate py-16 text-brand-cream sm:py-20 lg:py-24" aria-labelledby="experience-heading">
      <div className="section-container">
        <div className="grid gap-10 border-t border-brand-cream/10 pt-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-camel">Experience</p>
            <h2 id="experience-heading" className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] text-brand-cream sm:text-5xl">Professional roles</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-brand-cream/60">
              The areas in which I contribute across engineering and product development.
            </p>
          </div>

          <ExperienceTimeline roles={professionalRoles} />
        </div>
      </div>
    </section>
  )
}
