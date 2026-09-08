'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Network, Wrench, FileText, Image as ImageIcon, Play } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useProjects } from '@/lib/projects'
import { isProjectPublished } from '@/lib/project-catalog'

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const { projects } = useProjects()
  const project = projects.find(item => item.id === slug && isProjectPublished(item))

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
            <Image src={project.image} alt={project.title} fill priority className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" />
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

        <div className="mt-10 flex flex-wrap gap-2">
          {project.techStack.map(tech => <span key={tech} className="tech-badge">{tech}</span>)}
        </div>

        {project.media && project.media.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Project media</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Inside the build</h2>
              </div>
              <span className="text-xs text-dark-500">{project.media.length} item{project.media.length === 1 ? '' : 's'}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {project.media.map(item => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-dark-800 bg-dark-900/60">
                  <div className="relative aspect-video bg-dark-950">
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.title || project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <video src={item.url} className="h-full w-full object-cover" controls />
                    )}
                    <div className="pointer-events-none absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white">
                      {item.type === 'video' ? <Play className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                  {(item.title || item.caption) && (
                    <div className="p-4">
                      {item.title && <h3 className="font-semibold text-white">{item.title}</h3>}
                      {item.caption && <p className="mt-2 text-sm leading-6 text-dark-400">{item.caption}</p>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

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

        {project.architecture && project.architecture.length > 0 && (
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
        )}

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

        {project.caseStudy && (
          <section className="mt-8 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">Case study</p>
            <div className="prose prose-invert mt-5 max-w-none prose-headings:text-white prose-p:text-dark-300 prose-li:text-dark-300">
              <ReactMarkdown>{project.caseStudy}</ReactMarkdown>
            </div>
          </section>
        )}

        {project.documents && project.documents.length > 0 && (
          <section className="mt-8 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-accent-400" />
              <h2 className="text-2xl font-bold text-white">Project documents</h2>
            </div>
            <div className="mt-5 divide-y divide-dark-800 border-y border-dark-800">
              {project.documents.map(document => (
                <a
                  key={document.id}
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 py-4 text-sm transition hover:text-primary-300"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{document.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-dark-500">
                      {document.type.replace('-', ' ')}
                      {document.fileSize ? ` · ${document.fileSize}` : ''}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-dark-500" />
                </a>
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
