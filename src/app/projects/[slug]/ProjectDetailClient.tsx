'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, Globe, Network, Users, Wrench } from 'lucide-react'
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
          <Link href="/projects" className="btn-primary mt-7">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </div>
      </main>
    )
  }

  const problemHeadline = project.problemTagline || project.problemSolved
  const solution = project.solutionSummary || project.purpose
  const evidence = project.evidence || []
  const supportingMedia = project.media?.filter(item => item.src !== project.image) || []

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <article className="section-container max-w-6xl">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <header className="grid gap-8 lg:grid-cols-[1fr_0.38fr] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.status && (
                <span className="rounded-full border border-primary-400/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                  {project.status}
                </span>
              )}
              {project.domain && (
                <span className="rounded-full border border-dark-700 bg-dark-900 px-3 py-1 text-xs font-medium text-dark-300">
                  {project.domain}
                </span>
              )}
              {project.projectType && (
                <span className="rounded-full border border-dark-700 bg-dark-900 px-3 py-1 text-xs font-medium text-dark-300">
                  {project.projectType}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-400">{project.title}</p>
            <h1 className="mt-3 max-w-5xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {problemHeadline}
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-dark-300">{project.purpose}</p>

            {(project.role || project.contribution) && (
              <div className="mt-5 border-l-2 border-primary-500/35 pl-4">
                {project.role && <p className="text-sm font-semibold text-white">My role: {project.role}</p>}
                {project.contribution && <p className="mt-1 text-sm text-dark-500">{project.contribution}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {project.websiteUrl && (
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
            {project.liveUrl && project.liveUrl !== project.websiteUrl && (
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
              unoptimized
              className={project.media?.[0]?.fit === 'contain' ? 'object-contain' : 'object-cover'}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-end bg-[#10243E] p-7 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                  {project.domain || 'Engineering project'}
                </p>
                <p className="mt-3 max-w-3xl text-2xl font-semibold text-white sm:text-4xl">{project.title}</p>
              </div>
            </div>
          )}
        </div>

        {project.media?.[0]?.caption && project.media[0].src === project.image && (
          <div className="mt-3 rounded-xl border border-dark-800 bg-dark-900/45 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Project evidence</span>
            <p className="mt-1 text-sm leading-relaxed text-dark-400">{project.media[0].caption}</p>
          </div>
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 lg:col-span-2 sm:p-8">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-red-400" />
              <h2 className="text-2xl font-bold text-white">The problem</h2>
            </div>
            <p className="mt-4 leading-7 text-dark-300">{project.problemSolved}</p>
            {project.whyItMatters && (
              <div className="mt-5 border-t border-dark-800 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-dark-500">Why it matters</p>
                <p className="mt-2 text-sm leading-7 text-dark-300">{project.whyItMatters}</p>
              </div>
            )}
          </div>

          {project.targetUsers && (
            <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Who is affected</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-dark-300">{project.targetUsers}</p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Solution</p>
          <h2 className="mt-2 text-2xl font-bold text-white">What the system is designed to do</h2>
          <p className="mt-4 max-w-4xl leading-7 text-dark-300">{solution}</p>

          <div className="mt-6 border-t border-dark-800 pt-6">
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-accent-400" />
              <h3 className="text-lg font-semibold text-white">How it works</h3>
            </div>
            <p className="mt-3 max-w-4xl leading-7 text-dark-300">{project.systemLogic}</p>
          </div>
        </section>

        {(project.role || project.roleAreas?.length || project.contribution) && (
          <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">My role</p>
            {project.role && <h2 className="mt-2 text-2xl font-bold text-white">{project.role}</h2>}
            {project.contribution && <p className="mt-3 text-sm leading-6 text-dark-400">{project.contribution}</p>}
            {project.roleAreas && project.roleAreas.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.roleAreas.map(area => (
                  <span key={area} className="rounded-full border border-dark-700 bg-dark-950/50 px-3 py-1.5 text-xs text-dark-300">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {engineeringDetail ? (
          <EngineeringProjectDeepDive detail={engineeringDetail} />
        ) : project.architecture && project.architecture.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">System architecture</h2>
            <p className="mt-2 text-sm text-dark-500">Core layers and data/control flow documented for this project.</p>
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

        {(evidence.length > 0 || supportingMedia.length > 0) && (
          <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Project evidence</p>
            <h2 className="mt-2 text-2xl font-bold text-white">What can be verified today</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-dark-500">
              Evidence is separated from expected impact so prototypes, live systems and planned work are not presented as the same stage.
            </p>

            {evidence.length > 0 && (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {evidence.map((item, index) => {
                  const card = (
                    <div className="h-full rounded-xl border border-dark-800 bg-dark-950/55 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-400">{item.type}</p>
                      <h3 className="mt-2 font-semibold text-white">{item.label}</h3>
                      {item.description && <p className="mt-2 text-sm leading-6 text-dark-400">{item.description}</p>}
                      {item.url && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-300">Open evidence <ArrowUpRight className="h-3.5 w-3.5" /></span>}
                    </div>
                  )
                  return item.url ? (
                    <a key={item.label + index} href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {card}
                    </a>
                  ) : (
                    <div key={item.label + index}>{card}</div>
                  )
                })}
              </div>
            )}

            {supportingMedia.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {supportingMedia.map((item, index) => (
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
            )}
          </section>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-dark-500">Current outcome</p>
            <p className="mt-3 text-sm leading-7 text-dark-300">{project.outcome}</p>
          </div>

          {project.measuredImpact && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-300">Measured impact</p>
              <p className="mt-3 text-sm leading-7 text-green-100">{project.measuredImpact}</p>
            </div>
          )}

          {project.expectedImpact && (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">Expected / potential impact</p>
              <p className="mt-3 text-sm leading-7 text-blue-100">{project.expectedImpact}</p>
            </div>
          )}
        </section>

        {(project.constraints?.length || project.nextMilestone) && (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {project.constraints && project.constraints.length > 0 && (
              <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white">Challenges & constraints</h2>
                <ul className="mt-4 space-y-3">
                  {project.constraints.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-dark-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.nextMilestone && (
              <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white">Next milestone</h2>
                <p className="mt-4 text-sm leading-7 text-dark-300">{project.nextMilestone}</p>
              </div>
            )}
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">Technology used</h2>
          <p className="mt-2 text-sm text-dark-500">Technology is shown as implementation context, not as the project outcome.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map(tech => <span key={tech} className="tech-badge">{tech}</span>)}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-primary-500/20 bg-primary-950/30 p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">Work with me</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Have a real problem that needs a technical system?</h2>
          <p className="mt-3 max-w-2xl text-dark-300">
            Share the users, operating environment, constraints and desired outcome. I can help define the system before choosing the technology.
          </p>
          <Link href="/start-project" className="btn-primary mt-6">Start a project</Link>
        </section>
      </article>
    </main>
  )
}
