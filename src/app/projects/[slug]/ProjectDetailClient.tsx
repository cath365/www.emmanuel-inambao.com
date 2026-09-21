'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Network, Wrench } from 'lucide-react'
import { useProjects } from '@/lib/projects'
import EngineeringProjectDeepDive from '@/components/projects/EngineeringProjectDeepDive'
import { engineeringProjectDetails } from '@/lib/project-engineering-details'

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const { projects } = useProjects()
  const project = projects.find(item => item.id === slug)
  const engineeringDetail = engineeringProjectDetails[slug]

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-950 px-4">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold text-white">Project not found</h1>
          <p className="mt-3 text-dark-400">This project may have been renamed or removed from the portfolio.</p>
          <Link href="/projects" className="btn-primary mt-7"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <article className="section-container max-w-6xl">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <header className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.status && <span className="rounded-full border border-primary-400/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{project.status}</span>}
              {project.role && <span className="rounded-full border border-dark-700 bg-dark-900 px-3 py-1 text-xs font-medium text-dark-300">{project.role}</span>}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-300">{project.purpose}</p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Live system <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Github className="h-4 w-4" /> Source
              </a>
            )}
          </div>
        </header>

        <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-2xl border border-dark-800 bg-dark-900">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.media?.[0]?.alt || project.title}
              fill
              priority
              className={project.media?.[0]?.fit === 'contain' ? 'object-contain' : 'object-cover'}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950">
              <div className="absolute right-[8%] top-[12%] h-52 w-52 rounded-full border border-primary-400/20" />
              <div className="absolute bottom-[8%] left-[7%] h-36 w-36 rounded-full border border-accent-400/15" />
              <div className="absolute inset-0 flex items-end p-7 sm:p-10">
                <p className="max-w-3xl text-2xl font-bold text-white sm:text-4xl">Architecture-led engineering for {project.title}</p>
              </div>
            </div>
          )}
        </div>

        {project.media?.[0]?.caption && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dark-800 bg-dark-900/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Project evidence</span>
            <p className="max-w-4xl text-sm leading-relaxed text-dark-400">{project.media[0].caption}</p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {project.techStack.map(tech => <span key={tech} className="tech-badge">{tech}</span>)}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 lg:col-span-1">
            <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-red-400" /><h2 className="text-xl font-bold text-white">Problem</h2></div>
            <p className="mt-4 leading-relaxed text-dark-300">{project.problemSolved}</p>
          </section>
          <section className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 lg:col-span-2">
            <div className="flex items-center gap-3"><Network className="h-5 w-5 text-primary-400" /><h2 className="text-xl font-bold text-white">System logic</h2></div>
            <p className="mt-4 leading-relaxed text-dark-300">{project.systemLogic}</p>
          </section>
        </div>

        {engineeringDetail ? (
          <EngineeringProjectDeepDive detail={engineeringDetail} />
        ) : project.architecture && project.architecture.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Architecture</h2>
            <p className="mt-2 text-sm text-dark-500">Core layers and data/control flow.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.architecture.map((item, index) => (
                <div key={item} className="rounded-xl border border-dark-800 bg-dark-950/70 p-4">
                  <span className="text-xs font-semibold text-primary-400">0{index + 1}</span>
                  <p className="mt-2 font-medium text-dark-200">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Outcome</h2>
            <p className="mt-4 leading-relaxed text-dark-300">{project.outcome}</p>
          </div>

          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Engineering highlights</h2>
            <ul className="mt-4 space-y-3">
              {(project.highlights || project.techStack.slice(0, 4)).map(item => (
                <li key={item} className="flex items-start gap-3 text-dark-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {project.media && project.media.length > 1 && (
          <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Project evidence</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Hardware, product and deployment proof</h2>
              <p className="mt-2 text-sm text-dark-500">Real project photos and screens from development and deployment.</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {project.media.slice(1).map((item, index) => (
                <figure key={item.src + index} className="overflow-hidden rounded-xl border border-dark-800 bg-dark-950/70">
                  <div className="relative aspect-video bg-dark-950">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className={item.fit === 'contain' ? 'object-contain' : 'object-cover'}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {item.caption && <figcaption className="p-4 text-sm leading-relaxed text-dark-400">{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-950/30 p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">Build something similar</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Need an embedded, IoT or full-stack system?</h2>
          <p className="mt-3 max-w-2xl text-dark-300">Use the project brief flow to describe the problem, hardware, software and deployment requirements.</p>
          <Link href="/start-project" className="btn-primary mt-6">Start a project</Link>
        </section>
      </article>
    </main>
  )
}
