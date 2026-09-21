'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Cpu, FileText, Globe2, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'

const focusAreas = [
  'Embedded & IoT systems',
  'Robotics & assistive technology',
  'Full-stack digital platforms',
  'Institutional systems integration',
]

export default function Hero() {
  const { profile } = useProfile()

  return (
    <section id="hero" className="relative overflow-hidden border-b border-dark-800/70 bg-dark-950" aria-label="Introduction">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-primary-900/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-10 h-80 w-80 rounded-full bg-slate-700/10 blur-3xl" />
      </div>

      <div className="section-container relative pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-dark-700 bg-dark-900/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-300">
                International engineering profile
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-dark-400">
                <Globe2 className="h-4 w-4 text-primary-400" />
                Zambia-based · International collaboration
              </span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-400">
              Embedded systems · IoT · Robotics · Full-stack engineering
            </p>

            <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Engineering systems that connect physical devices, digital services and real-world operations.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-dark-300 sm:text-lg">
              I’m {profile.name}, an engineer and product builder working across electronics, firmware, connected devices, APIs, mobile and web platforms. My focus is dependable technology that can be understood, tested, documented and handed over responsibly.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {focusAreas.map(area => (
                <span
                  key={area}
                  className="rounded-full border border-dark-700/80 bg-dark-900/60 px-3.5 py-2 text-xs font-medium text-dark-300"
                >
                  {area}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary group">
                Review engineering work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/capabilities" className="btn-secondary">
                <Briefcase className="h-4 w-4" />
                Institutional capabilities
              </Link>
              <Link href="/hire/dossier" className="btn-secondary">
                <FileText className="h-4 w-4" />
                Professional dossier
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-dark-800/80 pt-6 text-sm text-dark-400">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-dark-500" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Cpu className="h-4 w-4 text-dark-500" />
                Hardware + software delivery
              </span>
              <Link href="/#contact" className="inline-flex items-center gap-2 font-medium text-dark-300 transition hover:text-white">
                <Mail className="h-4 w-4 text-dark-500" />
                Contact
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto w-full max-w-sm lg:mx-0"
          >
            <div className="overflow-hidden rounded-3xl border border-dark-700/80 bg-dark-900/75 shadow-2xl shadow-black/20">
              <div className="relative aspect-[4/4.5] bg-dark-900">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 384px, 360px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-semibold text-dark-600">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
              </div>

              <div className="border-t border-dark-800 px-6 py-6">
                <p className="text-xl font-semibold text-white">{profile.name}</p>
                <p className="mt-1 text-sm text-primary-300">Embedded Systems · IoT & Robotics · Full-Stack Systems</p>
                <p className="mt-4 text-sm leading-6 text-dark-400">
                  Open to selected engineering roles, institutional projects, R&D collaborations and international technical partnerships.
                </p>
                <Link
                  href="/hire"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-primary-300"
                >
                  Work with Emmanuel <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
