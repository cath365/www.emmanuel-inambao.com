'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  Globe2,
  Handshake,
  Layers3,
  Mail,
  MapPin,
  MessageSquareText,
  Network,
  Rocket,
  ShieldCheck,
  Smartphone,
  Users,
  Workflow,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import { useSkills } from '@/lib/skills'

const evidenceProjectIds = [
  'smart-cooking-oil-dispenser',
  'smart-walking-stick',
  'denuel-one-pro-ai-x',
  'the-spot-app',
]

const capabilityBlocks = [
  {
    icon: Cpu,
    title: 'Embedded & Device Engineering',
    text: 'ESP32/Arduino-class systems, sensors, actuators, local interfaces, GSM, Wi-Fi/Bluetooth and offline device logic.',
  },
  {
    icon: Network,
    title: 'IoT & Connected Systems',
    text: 'Device-to-cloud architecture, telemetry, REST APIs, dashboards, offline queues, remote state and field-oriented connectivity.',
  },
  {
    icon: Smartphone,
    title: 'Mobile & Product Software',
    text: 'Mobile applications, admin workflows, responsive interfaces and production release pipelines that connect to real devices and services.',
  },
  {
    icon: Layers3,
    title: 'Full-Stack Systems',
    text: 'Next.js/React interfaces, APIs, databases, authentication, dashboards, deployment and the software layer around physical products.',
  },
]

const engagementOptions = [
  {
    icon: BriefcaseBusiness,
    title: 'Remote engineering role',
    text: 'For teams hiring across embedded systems, IoT, robotics, product engineering or hardware-connected software.',
    action: 'Discuss a role',
    href: '#contact-options',
  },
  {
    icon: Rocket,
    title: 'Contract product build',
    text: 'For companies that need a prototype, connected device, dashboard, mobile app or end-to-end engineering system delivered in milestones.',
    action: 'Start a project',
    href: '/start-project',
  },
  {
    icon: Handshake,
    title: 'Technical partnership',
    text: 'For organizations looking for a long-term engineering collaborator on R&D, assistive technology, industrial systems or connected products.',
    action: 'Discuss partnership',
    href: '#contact-options',
  },
]

const remotePractices = [
  'Written scope, assumptions and acceptance criteria before implementation',
  'Milestone-based delivery with visible progress and technical documentation',
  'Repository-based collaboration and reviewable engineering changes',
  'Remote demos, test evidence and handover material',
  'Architecture designed around real deployment constraints, not just demos',
  'Clear separation between proven work, prototypes and proposed future features',
]

export default function HireClient() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { skillCategories } = useSkills()

  const evidenceProjects = evidenceProjectIds
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean)

  const skillNames = Array.from(
    new Set(skillCategories.flatMap(category => category.skills.map(skill => skill.name)))
  )

  const whatsapp = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hello Emmanuel, I reviewed your portfolio and would like to discuss a professional opportunity.'
  )}`

  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container max-w-7xl">
        <section className="overflow-hidden rounded-3xl border border-dark-800 bg-dark-900/65">
          <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative min-h-[340px] border-b border-dark-800 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 lg:min-h-[560px] lg:border-b-0 lg:border-r">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  priority
                  className="object-cover object-top opacity-90"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-dark-700">
                  E
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Open to professional opportunities
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                  Embedded Systems
                </span>
                <span className="rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                  IoT & Robotics
                </span>
                <span className="rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                  Full-Stack Systems
                </span>
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
                For hiring teams, clients & technical partners
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Engineering across hardware, firmware, applications and cloud.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-300">
                I build systems where physical devices and software have to work together reliably—from embedded control and IoT connectivity to mobile/web products and deployment. I am based in {profile.location} and open to remote roles, contract projects and technical partnerships worldwide.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="#proof" className="btn-primary">
                  Review proof of work <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/start-project" className="btn-secondary">
                  Start a project
                </Link>
                {profile.cv && (
                  <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <Download className="h-4 w-4" /> CV
                  </a>
                )}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-dark-800 bg-dark-950/50 p-4">
                  <Globe2 className="h-5 w-5 text-primary-400" />
                  <p className="mt-3 font-semibold text-white">Worldwide remote</p>
                  <p className="mt-1 text-sm text-dark-500">Structured async collaboration across time zones.</p>
                </div>
                <div className="rounded-xl border border-dark-800 bg-dark-950/50 p-4">
                  <Workflow className="h-5 w-5 text-accent-400" />
                  <p className="mt-3 font-semibold text-white">End-to-end systems</p>
                  <p className="mt-1 text-sm text-dark-500">Device → API → app/dashboard → deployment.</p>
                </div>
                <div className="rounded-xl border border-dark-800 bg-dark-950/50 p-4">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  <p className="mt-3 font-semibold text-white">Evidence-led</p>
                  <p className="mt-1 text-sm text-dark-500">Production work and prototypes are clearly distinguished.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {engagementOptions.map(option => {
            const Icon = option.icon
            return (
              <article key={option.title} className="flex flex-col rounded-2xl border border-dark-800 bg-dark-900/55 p-6">
                <Icon className="h-6 w-6 text-primary-400" />
                <h2 className="mt-5 text-xl font-bold text-white">{option.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-400">{option.text}</p>
                <Link href={option.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200">
                  {option.action} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Engineering capability</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Useful when the project crosses technical boundaries.</h2>
            <p className="mt-4 leading-relaxed text-dark-400">
              The strongest fit is work that needs both device-level engineering and the software around it, rather than treating hardware, firmware and applications as disconnected deliverables.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {capabilityBlocks.map(block => {
              const Icon = block.icon
              return (
                <article key={block.title} className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary-500/10 p-3">
                      <Icon className="h-5 w-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{block.title}</h3>
                  </div>
                  <p className="mt-4 leading-relaxed text-dark-400">{block.text}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {skillNames.slice(0, 22).map(skill => (
              <span key={skill} className="tech-badge text-xs">{skill}</span>
            ))}
          </div>
        </section>

        <section id="proof" className="mt-16 scroll-mt-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Selected proof of work</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Evidence before promises.</h2>
              <p className="mt-4 leading-relaxed text-dark-400">
                These projects demonstrate different parts of the engineering stack: physical control, assistive technology, embedded product R&D and production mobile software.
              </p>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-primary-300 hover:text-primary-200">
              View all projects →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {evidenceProjects.map(project => project && (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-dark-800 bg-dark-900/55">
                <div className="relative aspect-[16/8] bg-dark-900">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950">
                      <div className="absolute inset-0 flex items-end p-6">
                        <Cpu className="h-12 w-12 text-primary-400/60" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-dark-950/70 px-3 py-1 text-xs font-semibold text-dark-200 backdrop-blur">
                    {project.status || 'Engineering project'}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">{project.role}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-dark-400">{project.purpose}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 6).map(tech => (
                      <span key={tech} className="tech-badge text-xs">{tech}</span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link href={'/projects/' + project.id} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200">
                      Engineering details <ArrowRight className="h-4 w-4" />
                    </Link>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-dark-300 hover:text-white">
                        Live system <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Globe2 className="h-6 w-6 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">Built for international collaboration</h2>
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-dark-400">
              Remote engineering works best when progress is inspectable. The collaboration model emphasizes written requirements, reviewable code, documented architecture, milestone acceptance and demonstrations that can be reviewed across time zones.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {remotePractices.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-dark-800 bg-dark-900/55 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">Good fit</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Where I can add the most value</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Connected products', 'Devices that need firmware, connectivity, APIs and a usable application layer.'],
                ['Field systems', 'Solutions that must tolerate intermittent internet, constrained hardware or real-world operating conditions.'],
                ['Prototype to product', 'Turning a working proof-of-concept into a structured, testable and maintainable system.'],
                ['Technical ownership', 'Projects where one engineer needs to understand the full path from device behavior to user experience.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-dark-800 bg-dark-950/60 p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-dark-500">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section id="contact-options" className="mt-16 scroll-mt-24 rounded-3xl border border-primary-500/20 bg-primary-950/25 p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Next step</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Bring the opportunity, problem or product idea.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-dark-300">
                For a role, include the team, responsibilities and technology stack. For a project, include the problem, users, hardware/software scope, timeline and any constraints. I can then respond with a focused technical discussion rather than a generic introduction.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}?subject=Professional%20Opportunity%20for%20Emmanuel%20Inambao`} className="btn-primary">
                  <Mail className="h-4 w-4" /> Email opportunity
                </a>
                <Link href="/start-project" className="btn-secondary">
                  <Rocket className="h-4 w-4" /> Project brief
                </Link>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <MessageSquareText className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-dark-800 bg-dark-950/60 p-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="font-semibold text-white">{profile.location}</p>
                  <p className="text-sm text-dark-500">Remote collaboration worldwide</p>
                </div>
              </div>
              <div className="mt-4 border-t border-dark-800 pt-4">
                <p className="text-sm text-dark-400">{profile.email}</p>
                <p className="mt-1 text-sm text-dark-400">{profile.phone}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-dark-600">
          <Users className="h-4 w-4" />
          This page presents documented portfolio evidence and does not imply availability for every role or project.
        </div>
      </div>
    </main>
  )
}
