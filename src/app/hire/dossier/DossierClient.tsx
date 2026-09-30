'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  Printer,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import { useExperience } from '@/lib/experience'
import { useSkills } from '@/lib/skills'

const selectedProjectIds = [
  'smart-walking-stick',
  'the-spot-app',
  'quotation-platform',
  'aquawatch-nrw',
  'smart-cooking-oil-dispenser',
]

const coreCompetencies = [
  'Robotics, IoT & embedded-system development',
  'Full-stack web, API & dashboard development',
  'Mobile application development and deployment',
  'Requirements, scope & technical architecture',
  'Component, budget, timeline & milestone planning',
  'Hardware/software integration and troubleshooting',
  'Testing, documentation & deployment planning',
  'Project-based STEM programme planning',
]

function formatPeriod(startDate: string, endDate: string, current: boolean) {
  if (!startDate) return current ? 'Current' : endDate || 'Date to confirm'
  return `${startDate} – ${current ? 'Present' : endDate || 'Date to confirm'}`
}

export default function DossierClient() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { experiences } = useExperience()
  const { skillCategories } = useSkills()

  const selectedProjects = selectedProjectIds
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-[#F3F0E9] pb-16 pt-24 text-[#293442] dark:bg-dark-950 dark:text-dark-100 print:bg-white print:pb-0 print:pt-0">
      <div className="section-container max-w-5xl print:max-w-none print:px-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/hire" className="inline-flex items-center gap-2 text-sm font-medium text-[#667384] hover:text-[#10243E] dark:text-dark-400 dark:hover:text-primary-300">
            <ArrowLeft className="h-4 w-4" /> Back to hiring profile
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/cv" className="btn-secondary text-sm">
              <Download className="h-4 w-4" /> Detailed CV
            </Link>
            <button onClick={() => window.print()} className="btn-primary text-sm">
              <Printer className="h-4 w-4" /> Print / Save Resume PDF
            </button>
          </div>
        </div>

        <article className="overflow-hidden rounded-sm border border-[#D8D2C8] bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900/70 print:border-0 print:shadow-none">
          <header className="grid gap-5 border-b border-[#DDD7CC] p-6 sm:grid-cols-[96px_1fr] sm:p-8 dark:border-dark-800 print:grid-cols-[80px_1fr] print:p-5">
            <div className="relative h-24 w-24 overflow-hidden rounded-sm border border-[#DDD7CC] bg-[#EEEAE2] dark:border-dark-700 dark:bg-dark-800 print:h-20 print:w-20">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#7A8491]">EI</div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
                Professional Resume
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-[#10243E] dark:text-white sm:text-4xl print:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-base font-semibold text-[#39495A] dark:text-dark-200">
                Robotics & IoT Engineer | Full-Stack Systems Developer | Technical Project Manager
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#667384] dark:text-dark-400">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.location}</span>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-[#10243E] dark:hover:text-white">
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
                <span>{profile.phone}</span>
              </div>
            </div>
          </header>

          <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr] print:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-7 border-b border-[#DDD7CC] p-6 sm:p-8 dark:border-dark-800 lg:border-b-0 lg:border-r print:border-slate-300 print:p-5">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Professional Summary</h2>
                <p className="mt-3 text-sm leading-6 text-[#4E5B69] dark:text-dark-300">
                  Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager with practical experience designing and delivering software, embedded systems, robotics, IoT and AI-enabled solutions. Experienced in taking technical projects from problem definition and requirements through architecture, planning, prototyping, development, testing and deployment. At Robotix Institute, I work across robotics engineering, IoT development, R&D, project-based STEM programmes and technical project coordination.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Professional Experience</h2>
                <div className="mt-4 space-y-5">
                  {experiences.slice(0, 4).map(exp => (
                    <article key={exp.id}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-[#10243E] dark:text-white">{exp.position}</h3>
                          <p className="text-sm font-medium text-[#526E8A] dark:text-primary-300">{exp.company} · {exp.location}</p>
                        </div>
                        <span className="shrink-0 text-xs text-[#7A8491] dark:text-dark-500">{formatPeriod(exp.startDate, exp.endDate, exp.current)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-[#5D6875] dark:text-dark-400">{exp.description}</p>
                      {exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {exp.achievements.slice(0, exp.id === 'robotix-institute' ? 6 : 3).map(item => (
                            <li key={item} className="flex items-start gap-2 text-xs leading-5 text-[#5D6875] dark:text-dark-400">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#526E8A] dark:text-primary-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Selected Projects</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 print:grid-cols-2">
                  {selectedProjects.map(project => project && (
                    <article key={project.id} className="rounded-sm border border-[#DDD7CC] p-3 dark:border-dark-800">
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8491] dark:text-dark-500">
                        <span>{project.projectType || project.status || 'Project'}</span>
                        {project.organization && <span>· {project.organization}</span>}
                      </div>
                      <h3 className="mt-1 font-semibold text-[#10243E] dark:text-white">{project.title}</h3>
                      <p className="mt-1 text-xs font-medium text-[#526E8A] dark:text-primary-300">{project.role}</p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#5D6875] dark:text-dark-400">{project.purpose}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-7 p-6 sm:p-8 print:p-5">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Core Competencies</h2>
                <ul className="mt-3 space-y-2">
                  {coreCompetencies.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-5 text-[#4E5B69] dark:text-dark-300">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#526E8A] dark:text-primary-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Education & Training</h2>
                <div className="mt-3 space-y-3 text-xs leading-5 text-[#4E5B69] dark:text-dark-300">
                  <div>
                    <p className="font-semibold text-[#10243E] dark:text-white">Diploma in Information Technology</p>
                    <p>Chalimbana University in association with Phoenix Research Institute</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#10243E] dark:text-white">Basic Electronics and Programming</p>
                    <p>TME Education · Certificate of Participation · 2023</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#10243E] dark:text-white">Software Engineering</p>
                    <p>Tech Master Event · Six-month programme · 2023</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Technical Capability</h2>
                <div className="mt-3 space-y-3">
                  {skillCategories.slice(0, 6).map(category => (
                    <div key={category.id}>
                      <p className="text-xs font-semibold text-[#10243E] dark:text-white">{category.title}</p>
                      <p className="mt-1 text-[11px] leading-5 text-[#667384] dark:text-dark-400">
                        {category.skills.slice(0, 6).map(skill => skill.name).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-sm border border-[#D8D2C8] bg-[#F7F5EF] p-4 dark:border-dark-800 dark:bg-dark-950/40">
                <h2 className="text-sm font-bold text-[#10243E] dark:text-white">Professional focus</h2>
                <p className="mt-2 text-xs leading-5 text-[#5D6875] dark:text-dark-400">
                  Roles and projects where hardware, software and project delivery need to be understood together: robotics, IoT, embedded systems, full-stack platforms, technical project management, R&D and STEM engineering programmes.
                </p>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </main>
  )
}
