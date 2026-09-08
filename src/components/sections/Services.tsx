'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useServices } from '@/lib/services'

export default function Services() {
  const { services } = useServices()

  if (services.length === 0) return null

  return (
    <section id="services" className="bg-[#CBB08A] py-20 text-[#402924] lg:py-28" aria-labelledby="services-heading">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-[#402924]/60">04 / What I build</p>
            <h2 id="services-heading" className="editorial-serif mt-4 text-5xl leading-none tracking-[-0.025em] sm:text-6xl">
              Engineering services with a system view.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#402924]/70">
              Projects can begin with hardware, software or an operational problem. The engagement is structured around the complete outcome, not isolated technical tasks.
            </p>
            <Link href="/start-project" className="mt-7 inline-flex items-center gap-2 border-b border-[#402924] pb-1 text-sm font-bold">
              Discuss a project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-[#402924]/25">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="grid gap-5 border-b border-[#402924]/25 py-8 sm:grid-cols-[4rem_1fr] sm:gap-7"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-[#402924]/50">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <h3 className="editorial-serif max-w-2xl text-3xl leading-tight">{service.title}</h3>
                    {service.price && <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[#402924]/60">{service.price}</span>}
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-[#402924]/70 sm:text-base sm:leading-7">{service.description}</p>
                  {service.features.length > 0 && (
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {service.features.slice(0, 6).map(feature => (
                        <div key={feature} className="flex items-start gap-2 text-sm text-[#402924]/75">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
