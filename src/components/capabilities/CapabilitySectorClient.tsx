'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import type { CapabilitySector } from '@/lib/institutional-capabilities'

export default function CapabilitySectorClient({ sector }: { sector: CapabilitySector }) {
  const { profile } = useProfile()
  const { projects } = useProjects()

  const evidence = sector.relevantProjectIds
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container max-w-7xl">
        <Link href="/capabilities" className="inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> All institutional capabilities
        </Link>

        <section className="mt-6 rounded-3xl border border-dark-800 bg-dark-900/60 p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">{sector.eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{sector.title}</h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-dark-300">{sector.subtitle}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/capabilities/request" className="btn-primary">
              Submit institutional brief <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/hire/dossier" className="btn-secondary">
              <FileText className="h-4 w-4" /> Professional dossier
            </Link>
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(sector.eyebrow + ' Opportunity')}`} className="btn-secondary">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Relevant organizations</p>
            <ul className="mt-5 space-y-3">
              {sector.audience.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="grid gap-4 md:grid-cols-2">
            {sector.capabilityAreas.map(item => (
              <article key={item.title} className="rounded-2xl border border-dark-800 bg-dark-900/55 p-5">
                <h2 className="font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-dark-400">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Potential system work</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Where this capability can be applied.</h2>
            <p className="mt-4 leading-relaxed text-dark-400">
              These are example applications of the documented engineering skill set. They are proposals, not claims that every listed system has already been delivered.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sector.useCases.map(item => (
              <article key={item.title} className="rounded-2xl border border-dark-800 bg-dark-900/55 p-5">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-400">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Delivery priorities</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dark-400">
            Institutional work should be evaluated on reliability, traceability, security and handover—not only whether a demo works.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {sector.deliveryPriorities.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Relevant proof of work</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Engineering evidence behind the capability.</h2>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-primary-300 hover:text-primary-200">All projects →</Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {evidence.map(project => project && (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-dark-800 bg-dark-900/55">
                <div className="relative aspect-[16/8] bg-dark-900">
                  {project.image ? (
                    <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-dark-950/70 px-3 py-1 text-xs text-dark-200 backdrop-blur">
                    {project.status || 'Engineering project'}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">{project.role}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-400">{project.purpose}</p>
                  <Link href={'/projects/' + project.id} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200">
                    Review engineering details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-950/15 p-5 sm:p-6">
          <h2 className="font-semibold text-amber-200">{sector.boundaryTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-dark-300">{sector.boundaryText}</p>
        </section>

        <section className="mt-12 rounded-3xl border border-primary-500/20 bg-primary-950/20 p-7 sm:p-10">
          <h2 className="text-3xl font-bold text-white">Discuss an institutional requirement.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-dark-300">
            Share the organization, department, operational problem, required system, sites/devices, integrations, security constraints, timeline and procurement context. The structured brief is designed to make the first technical discussion useful.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/capabilities/request" className="btn-primary">Submit project / RFQ brief</Link>
            <Link href="/hire/dossier" className="btn-secondary">Professional dossier</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
