'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  GraduationCap,
  Users,
  Plane,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { coreCapabilities } from '@/lib/institutional-capabilities'

const sectors = [
  {
    icon: Building2,
    title: 'Government & public sector',
    text: 'Digital services, systems integration, ICT workflows, monitoring and field technology for institutions.',
    href: '/capabilities/government',
  },
  {
    icon: Plane,
    title: 'Aviation & transport operations',
    text: 'Ground-equipment telemetry, asset tracking, operational software and non-flight-critical connected systems.',
    href: '/capabilities/aviation',
  },
  {
    icon: Factory,
    title: 'Industry & utilities',
    text: 'Automation, equipment monitoring, telemetry, dashboards and connected field systems.',
    href: '/projects',
  },
  {
    icon: Users,
    title: 'NGOs & development programs',
    text: 'Field data, assistive technology, mobile workflows and offline-first digital services.',
    href: '/hire',
  },
  {
    icon: GraduationCap,
    title: 'Education & research',
    text: 'Technical training, prototypes, connected laboratories and research-oriented engineering support.',
    href: '/hire',
  },
  {
    icon: Stethoscope,
    title: 'Health & community programs',
    text: 'Mobile products, administrative workflows and appropriate connected-system prototypes.',
    href: '/projects/the-spot-app',
  },
]

const delivery = [
  'Discovery and operational requirements',
  'Architecture and interface definition',
  'Prototype / proof-of-concept where appropriate',
  'Implementation in reviewable milestones',
  'Testing against written acceptance criteria',
  'Deployment, documentation and handover',
  'Support / maintenance scope agreed separately',
]

export default function CapabilitiesClient() {
  const { profile } = useProfile()

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container max-w-7xl">
        <section className="rounded-3xl border border-dark-800 bg-dark-900/60 p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">Institutional capability statement</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Engineering and digital systems capability for organizations that need more than a website.
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-dark-300">
            I work across embedded devices, IoT connectivity, applications, APIs, monitoring and technical handover. The strongest fit is where an organization needs physical systems and software to work together, or where digital services must remain usable under real operational constraints.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/capabilities/request" className="btn-primary">
              Submit institutional brief <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/hire/dossier" className="btn-secondary">
              Professional dossier
            </Link>
            <a href={`mailto:${profile.email}?subject=Institutional%20Engineering%20Opportunity`} className="btn-secondary">
              Contact directly
            </a>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Core capability</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">From device behavior to operational software.</h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coreCapabilities.map(item => (
              <article key={item.title} className="rounded-2xl border border-dark-800 bg-dark-900/55 p-5">
                <Cpu className="h-5 w-5 text-primary-400" />
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-400">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Sector entry points</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Show each organization the capability most relevant to them.</h2>
            <p className="mt-4 leading-relaxed text-dark-400">
              The sector pages translate the same engineering evidence into operational use cases without claiming experience or certifications that are not documented.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sectors.map(item => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.href} className="group rounded-2xl border border-dark-800 bg-dark-900/55 p-6 transition hover:border-primary-500/40">
                  <Icon className="h-6 w-6 text-primary-400" />
                  <h3 className="mt-5 text-xl font-bold text-white group-hover:text-primary-300">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-400">{item.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-300">
                    Review capability <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Workflow className="h-5 w-5 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">Typical delivery approach</h2>
            </div>
            <ol className="mt-6 space-y-4">
              {delivery.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="text-sm font-bold text-primary-400">{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-relaxed text-dark-300">{item}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Institutional delivery principles</h2>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                'Requirements and assumptions written before implementation',
                'Security and access boundaries considered early',
                'Existing systems integrated where replacement is unnecessary',
                'Offline/recovery behavior defined where continuity matters',
                'Prototype status distinguished from production readiness',
                'Test evidence and technical documentation retained',
                'Training and handover included when the scope requires it',
                'Procurement and regulatory requirements checked per engagement',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-primary-500/20 bg-primary-950/20 p-7 sm:p-10">
          <h2 className="text-3xl font-bold text-white">Have an institutional requirement or tender opportunity?</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-dark-300">
            Send a structured project or RFQ brief. The form captures the technical, operational and procurement context needed for a useful first review.
          </p>
          <Link href="/capabilities/request" className="btn-primary mt-6">
            Open institutional RFQ form <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  )
}
