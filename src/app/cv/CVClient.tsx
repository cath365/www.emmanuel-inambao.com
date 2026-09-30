'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Mail,
  MapPin,
  Printer,
  Wrench,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import { useExperience } from '@/lib/experience'
import { useSkills } from '@/lib/skills'
import { useInstitutionalPrograms } from '@/lib/institutional-programs'

const selectedProjectIds = [
  'smart-walking-stick',
  'aquawatch-nrw',
  'smart-cooking-oil-dispenser',
  'the-spot-app',
  'quotation-platform',
  'constituency226',
  'livestock-collar-tracker',
  'edutrack',
  'zpay',
  'denuel-one-pro-ai-x',
]



function formatPeriod(startDate: string, endDate: string, current: boolean) {
  if (!startDate) return current ? 'Current' : endDate || 'Date to confirm'
  return `${startDate} – ${current ? 'Present' : endDate || 'Date to confirm'}`
}

export default function CVClient() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { experiences } = useExperience()
  const { skillCategories } = useSkills()
  const { programs: institutionalPrograms } = useInstitutionalPrograms()

  const selectedProjects = selectedProjectIds
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-[#F3F0E9] pb-16 pt-24 text-[#293442] dark:bg-dark-950 dark:text-dark-100 print:bg-white print:pb-0 print:pt-0">
      <div className="section-container max-w-6xl print:max-w-none print:px-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/resume" className="inline-flex items-center gap-2 text-sm font-medium text-[#667384] hover:text-[#10243E] dark:text-dark-400 dark:hover:text-primary-300">
            <ArrowLeft className="h-4 w-4" /> Resume
          </Link>
          <div className="flex flex-wrap gap-2">
            {profile.cv && (
              <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                Uploaded CV document
              </a>
            )}
            <button onClick={() => window.print()} className="btn-primary text-sm">
              <Printer className="h-4 w-4" /> Print / Save CV PDF
            </button>
          </div>
        </div>

        <article className="overflow-hidden rounded-sm border border-[#D8D2C8] bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900/70 print:border-0 print:shadow-none">
          <header className="grid gap-5 border-b border-[#DDD7CC] p-6 sm:grid-cols-[108px_1fr] sm:p-8 dark:border-dark-800 print:grid-cols-[86px_1fr] print:p-5">
            <div className="relative h-28 w-28 overflow-hidden rounded-sm border border-[#DDD7CC] bg-[#EEEAE2] dark:border-dark-700 dark:bg-dark-800 print:h-[86px] print:w-[86px]">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="112px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#7A8491]">EI</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">Curriculum Vitae</p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-[#10243E] dark:text-white sm:text-4xl">{profile.name}</h1>
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

          <div className="space-y-9 p-6 sm:p-8 print:p-5">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Professional Profile</h2>
              <p className="mt-3 max-w-5xl text-sm leading-7 text-[#4E5B69] dark:text-dark-300">
                Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager with practical experience designing and delivering software, embedded systems, robotics, IoT and AI-enabled solutions. Experienced in taking technical projects from problem definition and requirements gathering through architecture, planning, development, prototyping, testing and deployment. At Robotix Institute, I work across robotics engineering, IoT development, research and development, project-based STEM programmes and technical project coordination. My work combines hardware, software and project management to create practical solutions for businesses, schools, communities and institutions.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Professional Experience</h2>
              <div className="mt-4 space-y-5">
                {experiences.map(exp => (
                  <article key={exp.id} className="break-inside-avoid">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-[#10243E] dark:text-white">{exp.position}</h3>
                        <p className="text-sm font-medium text-[#526E8A] dark:text-primary-300">{exp.company} · {exp.location}</p>
                      </div>
                      <span className="shrink-0 text-xs text-[#7A8491] dark:text-dark-500">{formatPeriod(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5D6875] dark:text-dark-400">{exp.description}</p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {exp.achievements.map(item => (
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

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-sm border border-[#DDD7CC] p-5 dark:border-dark-800">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                  <h2 className="text-lg font-semibold text-[#10243E] dark:text-white">Technical Project Management</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5D6875] dark:text-dark-400">
                  Requirements discovery, project objectives, technical scope, architecture, hardware/software planning, component lists, budget estimates, timelines, milestones, risk identification, testing plans, task coordination, stakeholder communication, documentation, deployment planning and iterative improvement.
                </p>
              </div>
              <div className="rounded-sm border border-[#DDD7CC] p-5 dark:border-dark-800">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                  <h2 className="text-lg font-semibold text-[#10243E] dark:text-white">Engineering & R&D</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5D6875] dark:text-dark-400">
                  Robotics, IoT, embedded systems, electronics, automation, smart devices, assistive technologies and AI-enabled prototypes. Work includes sensing, wireless communication, hardware/software integration, troubleshooting, system testing and prototype iteration.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                <h2 className="text-lg font-semibold text-[#10243E] dark:text-white">STEM & Institutional Programs</h2>
              </div>
              <p className="mt-3 max-w-5xl text-sm leading-6 text-[#5D6875] dark:text-dark-400">
                Through my work at Robotix Institute, I contribute to planning and supporting project-based robotics, coding and engineering programmes involving schools and technology institutions. Responsibilities include defining learning objectives, selecting appropriate technologies and components, structuring project stages, supporting programme delivery, troubleshooting student projects and improving future programme plans.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {institutionalPrograms.map(program => (
                  <div key={program.id} className="rounded-sm border border-[#DDD7CC] p-3 dark:border-dark-800">
                    <p className="text-sm font-semibold text-[#10243E] dark:text-white">{program.shortName || program.institution}</p>
                    <p className="mt-1 text-xs leading-5 text-[#667384] dark:text-dark-400">{program.institution}</p>
                    <p className="mt-2 text-[11px] leading-5 text-[#7A8491] dark:text-dark-500">{program.myRole}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-[#7A8491] dark:text-dark-500">
                These are programmes or institutional contexts connected to my work through Robotix Institute; this wording does not claim that I personally established or own the institutional relationships.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Selected Projects & Systems</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {selectedProjects.map(project => project && (
                  <article key={project.id} className="break-inside-avoid rounded-sm border border-[#DDD7CC] p-4 dark:border-dark-800">
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8491] dark:text-dark-500">
                      <span>{project.projectType || 'Project'}</span>
                      <span>· {project.status || 'Status to confirm'}</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-[#10243E] dark:text-white">{project.title}</h3>
                    <p className="mt-1 text-xs font-medium text-[#526E8A] dark:text-primary-300">Role: {project.role || 'Role to confirm'}</p>
                    {project.contribution && <p className="mt-1 text-xs text-[#7A8491] dark:text-dark-500">Contribution: {project.contribution}</p>}
                    <p className="mt-2 text-xs leading-5 text-[#5D6875] dark:text-dark-400">{project.purpose}</p>
                    <p className="mt-2 text-[11px] leading-5 text-[#667384] dark:text-dark-500">{project.techStack.slice(0, 8).join(' · ')}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                  <h2 className="text-lg font-semibold text-[#10243E] dark:text-white">Education & Technical Training</h2>
                </div>
                <div className="mt-4 space-y-4 text-sm leading-6 text-[#5D6875] dark:text-dark-400">
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
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#10243E] dark:text-white">Professional Capability Map</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {skillCategories.map(category => (
                    <div key={category.id} className="rounded-sm border border-[#DDD7CC] p-3 dark:border-dark-800">
                      <p className="text-sm font-semibold text-[#10243E] dark:text-white">{category.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#667384] dark:text-dark-400">
                        {category.skills.map(skill => skill.name).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Languages</h2>
                <p className="mt-3 text-sm leading-6 text-[#5D6875] dark:text-dark-400">English · Nyanja · Bemba · Lozi · Ila</p>
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#526E8A] dark:text-primary-400">Professional Interests</h2>
                <p className="mt-3 text-sm leading-6 text-[#5D6875] dark:text-dark-400">
                  Robotics engineering, IoT, embedded systems, full-stack platforms, technical project management, assistive technology, engineering R&D, STEM programmes and practical digital systems for institutions and businesses.
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  )
}
