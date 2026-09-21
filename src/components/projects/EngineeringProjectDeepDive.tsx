import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  Milestone,
  ShieldCheck,
} from 'lucide-react'
import type { EngineeringProjectDetail } from '@/lib/project-engineering-details'

export default function EngineeringProjectDeepDive({ detail }: { detail: EngineeringProjectDetail }) {
  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-2xl border border-primary-500/20 bg-primary-950/20 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Engineering deep dive</p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">System engineering view</h2>
        <p className="mt-4 max-w-4xl leading-relaxed text-dark-300">{detail.focus}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-accent-400" />
            <h2 className="text-2xl font-bold text-white">Hardware layer</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {detail.hardware.map(item => (
              <li key={item} className="flex items-start gap-3 text-dark-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Code2 className="h-5 w-5 text-primary-400" />
            <h2 className="text-2xl font-bold text-white">Software & firmware layer</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {detail.software.map(item => (
              <li key={item} className="flex items-start gap-3 text-dark-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Control & data path</p>
          <h2 className="mt-2 text-2xl font-bold text-white">How the system moves from input to action</h2>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex min-w-max items-stretch gap-2">
            {detail.flow.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className="w-48 rounded-xl border border-dark-700 bg-dark-950/75 p-4">
                  <span className="text-xs font-semibold text-primary-400">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-dark-200">{step}</p>
                </div>
                {index < detail.flow.length - 1 && (
                  <ArrowRight className="h-5 w-5 shrink-0 text-dark-600" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Engineering decisions</h2>
        </div>
        <p className="mt-2 text-sm text-dark-500">Why the architecture is structured this way.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {detail.decisions.map(decision => (
            <article key={decision.title} className="rounded-xl border border-dark-800 bg-dark-950/65 p-5">
              <h3 className="font-semibold text-white">{decision.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">{decision.rationale}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-primary-400" />
            <h2 className="text-2xl font-bold text-white">Validation plan</h2>
          </div>
          <p className="mt-2 text-sm text-dark-500">Acceptance-oriented tests for moving the prototype toward a dependable system.</p>
          <ul className="mt-5 space-y-3">
            {detail.validation.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Constraints & engineering risks</h2>
          </div>
          <p className="mt-2 text-sm text-dark-500">Known design pressures that need to be controlled during development.</p>
          <ul className="mt-5 space-y-3">
            {detail.constraints.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {detail.safetyNote && (
        <section className="rounded-2xl border border-amber-500/25 bg-amber-950/20 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h2 className="font-semibold text-amber-200">Safety boundary</h2>
              <p className="mt-2 text-sm leading-relaxed text-dark-300">{detail.safetyNote}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Milestone className="h-5 w-5 text-accent-400" />
          <h2 className="text-2xl font-bold text-white">Next engineering milestones</h2>
        </div>
        <p className="mt-2 text-sm text-dark-500">The next work should reduce technical risk before adding more product complexity.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {detail.nextMilestones.map((item, index) => (
            <div key={item} className="flex gap-4 rounded-xl border border-dark-800 bg-dark-950/65 p-4">
              <span className="text-sm font-bold text-primary-400">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm leading-relaxed text-dark-300">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
