import Link from 'next/link'
import { ArrowUpRight, BarChart3, Bot, ClipboardList } from 'lucide-react'

const capabilities = [
  { icon: Bot, title: 'AI assistant', description: 'Visitors can ask about engineering work, skills and services without searching through every page.' },
  { icon: BarChart3, title: 'Engagement analytics', description: 'Page and section activity feed the existing analytics layer for portfolio insight.' },
  { icon: ClipboardList, title: 'Project intake', description: 'A structured brief turns interest into useful technical requirements instead of a vague contact message.' },
]

export default function EngineeringCTA() {
  return (
    <section className="bg-[#F7F3EC] py-20 text-[#000B26] lg:py-24">
      <div className="section-container">
        <div className="grid gap-12 border-y border-[#000B26]/20 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#000B26]/55">Portfolio as a product</p>
            <h2 className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              The website does more than display work.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#000B26]/65">
              The design stays quiet; the useful systems remain available underneath it — AI assistance, analytics and a structured client workflow.
            </p>
            <div className="mt-7 flex flex-wrap gap-6">
              <Link href="/start-project" className="inline-flex items-center gap-2 border-b border-[#000B26] pb-1 text-sm font-bold">
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/case-studies" className="inline-flex items-center gap-2 border-b border-[#7B5F3E] pb-1 text-sm font-bold text-[#7B5F3E]">
                Read case studies <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#000B26]/20 lg:border-t-0">
            {capabilities.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="grid gap-4 border-b border-[#000B26]/20 py-6 sm:grid-cols-[3rem_0.65fr_1.35fr] sm:items-start sm:gap-6">
                <Icon className="h-5 w-5 text-[#7B5F3E]" />
                <h3 className="editorial-serif text-2xl">{title}</h3>
                <p className="text-sm leading-6 text-[#000B26]/62">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
