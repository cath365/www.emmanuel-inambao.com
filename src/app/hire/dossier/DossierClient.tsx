'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Download,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Network,
  Printer,
  ShieldCheck,
  Smartphone,
  Wrench,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import { useSkills } from '@/lib/skills'

const proofIds = [
  'smart-cooking-oil-dispenser',
  'smart-walking-stick',
  'denuel-one-pro-ai-x',
  'the-spot-app',
]

const publicSectorCapabilities = [
  'ICT infrastructure, device support and operational troubleshooting',
  'LAN/WAN, Wi-Fi, connectivity and network-aware systems',
  'Web systems, portals, dashboards and internal digital workflows',
  'APIs, system integration and data exchange between applications',
  'Cybersecurity-aware access control, confidentiality and data handling',
  'IoT, field telemetry and remote monitoring systems',
  'Business-continuity thinking for low-connectivity or offline environments',
  'Technical documentation, reporting, training and stakeholder support',
]

const roleFit = [
  'Embedded Systems / IoT Engineer',
  'Full-Stack Systems Engineer',
  'Applications / Software Developer',
  'ICT / Digital Systems Officer',
  'Technical Support & Systems Integration',
  'GovTech / Digital Service Implementation',
  'R&D / Prototype Engineer',
  'Technical Project / Product Engineering',
]

export default function DossierClient() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { skillCategories } = useSkills()

  const proof = proofIds
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean)

  const topSkills = Array.from(
    new Set(skillCategories.flatMap(category => category.skills.map(skill => skill.name)))
  ).slice(0, 18)

  return (
    <main className="min-h-screen bg-dark-950 pb-16 pt-24 print:bg-white print:pb-0 print:pt-0">
      <div className="section-container max-w-5xl print:max-w-none print:px-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/hire" className="inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
            <ArrowLeft className="h-4 w-4" /> Back to Hire / Work With Me
          </Link>
          <div className="flex flex-wrap gap-2">
            {profile.cv && (
              <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                <Download className="h-4 w-4" /> CV
              </a>
            )}
            <button onClick={() => window.print()} className="btn-primary text-sm">
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        <article className="overflow-hidden rounded-3xl border border-dark-800 bg-dark-900/65 print:rounded-none print:border-0 print:bg-white print:text-slate-900">
          <header className="grid gap-6 border-b border-dark-800 p-6 sm:grid-cols-[auto_1fr] sm:p-8 print:border-slate-300 print:p-6">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-dark-700 bg-dark-800 print:border-slate-300 print:bg-slate-100">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="112px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-dark-500">E</div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 print:text-slate-600">Professional engineering profile</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl print:text-slate-950">{profile.name}</h1>
              <p className="mt-2 text-lg font-medium text-primary-300 print:text-slate-700">
                Embedded Systems • IoT & Robotics • Full-Stack Systems Engineering
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dark-400 print:text-slate-700">
                Engineer and product builder focused on systems where physical devices, firmware, connectivity, APIs and user-facing software must work together. Available for remote engineering roles, contract projects, institutional technology work and technical partnerships.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-dark-400 print:text-slate-700">
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {profile.location}</span>
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.email}</span>
                <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Remote collaboration worldwide</span>
              </div>
            </div>
          </header>

          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8 border-b border-dark-800 p-6 sm:p-8 lg:border-b-0 lg:border-r print:border-slate-300 print:p-6">
              <section>
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Core engineering capability</h2>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Embedded & device systems', 'ESP32/Arduino-class control, sensors, actuators, local UI, GSM and wireless connectivity.'],
                    ['IoT & telemetry', 'Device data, APIs, dashboards, offline queues and remote monitoring.'],
                    ['Applications & platforms', 'Next.js/React interfaces, mobile workflows, databases, authentication and deployment.'],
                    ['Systems integration', 'Connecting hardware, services, data and user workflows into one maintainable product.'],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-xl border border-dark-800 bg-dark-950/60 p-4 print:border-slate-300 print:bg-white">
                      <p className="font-semibold text-white print:text-slate-950">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-dark-500 print:text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Selected proof of work</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {proof.map(project => project && (
                    <div key={project.id} className="rounded-xl border border-dark-800 bg-dark-950/60 p-4 print:border-slate-300 print:bg-white">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-white print:text-slate-950">{project.title}</p>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary-400 print:text-slate-600">{project.role}</p>
                        </div>
                        <span className="text-xs text-dark-500 print:text-slate-600">{project.status}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-dark-400 print:text-slate-700">{project.purpose}</p>
                      <p className="mt-2 text-xs text-dark-500 print:text-slate-600">
                        {project.techStack.slice(0, 7).join(' • ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Public-sector & institutional relevance</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-dark-400 print:text-slate-700">
                  Relevant to government, statutory bodies, NGOs, development programs, universities and public-service institutions that need dependable ICT operations, digital services, systems integration or field technology.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {publicSectorCapabilities.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-dark-300 print:text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400 print:text-slate-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-8 p-6 sm:p-8 print:p-6">
              <section>
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Role fit</h2>
                </div>
                <ul className="mt-4 space-y-2">
                  {roleFit.map(role => (
                    <li key={role} className="flex items-start gap-2 text-sm text-dark-300 print:text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400 print:text-slate-600" />
                      {role}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Professional strengths</h2>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-dark-300 print:text-slate-700">
                  {[
                    'Hardware + software perspective',
                    'Offline / unreliable-connectivity design',
                    'Technical documentation and written communication',
                    'Prototype-to-product engineering mindset',
                    'Remote collaboration and milestone delivery',
                    'Security and confidentiality awareness',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400 print:text-slate-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-accent-400" />
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Technical stack</h2>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {topSkills.map(skill => (
                    <span key={skill} className="rounded-full border border-dark-700 px-3 py-1 text-xs text-dark-300 print:border-slate-300 print:text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-4 print:border-slate-300 print:bg-white">
                <h2 className="font-semibold text-amber-200 print:text-slate-950">Public-sector eligibility note</h2>
                <p className="mt-2 text-xs leading-relaxed text-dark-400 print:text-slate-700">
                  Formal government eligibility varies by vacancy. Degree level, professional-body membership, citizenship, years of experience and certified qualifications should be evaluated against each official job specification. This profile presents engineering capability and portfolio evidence rather than claiming eligibility for every public-sector grade.
                </p>
              </section>

              <section className="rounded-xl border border-primary-500/20 bg-primary-950/20 p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-400 print:text-slate-600">Contact</p>
                <p className="mt-2 font-semibold text-white print:text-slate-950">{profile.email}</p>
                <p className="mt-1 text-sm text-dark-400 print:text-slate-700">{profile.phone}</p>
                <p className="mt-1 text-sm text-dark-400 print:text-slate-700">{profile.location}</p>
                <Link href="/hire" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 print:hidden">
                  Full hiring profile →
                </Link>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </main>
  )
}
