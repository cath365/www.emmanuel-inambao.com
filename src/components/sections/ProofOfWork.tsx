import Link from 'next/link'
import { ArrowUpRight, Cpu, Globe2, Layers3, Trophy } from 'lucide-react'

const evidence = [
  {
    icon: Trophy,
    eyebrow: 'Recognition',
    title: 'ZICTA Innovation ICT — 2026',
    description: 'The Smart Cooking Oil Dispenser was selected for ZICTA’s 2026 Innovation ICT programme.',
  },
  {
    icon: Cpu,
    eyebrow: 'Embedded product',
    title: 'Smart Cooking Oil Dispenser',
    description: 'ESP32 control, flow measurement, operator PINs, offline recovery, sales records and a web management layer in one product architecture.',
  },
  {
    icon: Layers3,
    eyebrow: 'Platform engineering',
    title: 'Denuel-dev',
    description: 'A Zambia-focused deployment control-plane foundation covering organizations, RBAC, audit logs, Git integration and deployment workflows.',
  },
  {
    icon: Globe2,
    eyebrow: 'Public product',
    title: 'Kulima Farm Marketplace',
    description: 'A deployed marketplace experience designed around low-friction farmer onboarding and mobile-first product discovery.',
  },
]

export default function ProofOfWork() {
  return (
    <section className="bg-[#402924] py-20 text-[#F7F3EC] lg:py-28" aria-labelledby="proof-heading">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-[#CBB08A]">Evidence, not vanity metrics</p>
            <h2 id="proof-heading" className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              Proof should be specific.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F7F3EC]/60 sm:text-base">
              Instead of generic counters, this portfolio points to concrete systems, deployments and recognition that can be inspected in the work itself.
            </p>
            <Link
              href="/case-studies"
              className="mt-8 inline-flex items-center gap-2 border-b border-[#CBB08A] pb-1 text-sm font-bold text-[#CBB08A]"
            >
              Read the case studies <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-[#F7F3EC]/20">
            {evidence.map(({ icon: Icon, eyebrow, title, description }, index) => (
              <article
                key={title}
                className="grid gap-5 border-b border-[#F7F3EC]/20 py-7 sm:grid-cols-[3rem_0.72fr_1.28fr] sm:items-start sm:gap-7"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-[#CBB08A]/40 text-[#CBB08A]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#CBB08A]">
                    {String(index + 1).padStart(2, '0')} · {eyebrow}
                  </p>
                  <h3 className="editorial-serif mt-2 text-2xl leading-tight">{title}</h3>
                </div>
                <p className="text-sm leading-6 text-[#F7F3EC]/58">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
