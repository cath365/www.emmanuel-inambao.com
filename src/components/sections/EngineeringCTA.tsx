import Link from 'next/link'
import { ArrowRight, BarChart3, Bot, ClipboardList } from 'lucide-react'

const capabilities = [
  {
    icon: Bot,
    title: 'AI portfolio assistant',
    description: 'Visitors can ask about projects, skills, services and engineering experience from the floating assistant.',
  },
  {
    icon: BarChart3,
    title: 'Engagement analytics',
    description: 'Page and section events feed the existing analytics pipeline so portfolio engagement can be reviewed from the admin system.',
  },
  {
    icon: ClipboardList,
    title: 'Structured project intake',
    description: 'Potential clients can move from browsing work to a dedicated project brief instead of relying on a generic contact message.',
  },
]

export default function EngineeringCTA() {
  return (
    <section className="border-y border-dark-800 bg-dark-950 py-20">
      <div className="section-container">
        <div className="overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-950/80 via-dark-900 to-dark-950 p-6 sm:p-9 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-400">Portfolio platform</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">The portfolio now works like an engineering product.</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-dark-300">
                Projects are documented in depth, visitors can explore case studies and the site already includes AI assistance, analytics and a structured client intake flow.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/start-project" className="btn-primary">Start a project <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/case-studies" className="btn-secondary">Read case studies</Link>
              </div>
            </div>

            <div className="grid gap-4">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-dark-950/45 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary-500/10 p-3 text-primary-300"><Icon className="h-5 w-5" /></div>
                    <div>
                      <h3 className="font-bold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-dark-400">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
