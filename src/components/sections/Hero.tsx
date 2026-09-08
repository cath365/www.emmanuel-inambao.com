'use client'

import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Download, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'

const disciplines = ['Embedded Systems', 'IoT', 'Robotics', 'AI', 'Full-Stack']

export default function Hero() {
  const { profile } = useProfile()
  const displayName = profile.name.replace(/^Prof\.\s*/i, '')

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] overflow-hidden bg-[#000B26] text-[#F7F3EC]"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border border-[#7CA7EB]/25 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-8 top-40 h-52 w-52 rounded-full bg-[#7CA7EB]/10 sm:h-80 sm:w-80" />
        <div className="absolute bottom-0 left-[6%] h-px w-[88%] bg-[#F7F3EC]/15" />
        <div className="absolute left-[8%] top-0 h-full w-px bg-[#F7F3EC]/[0.06]" />
      </div>

      <div className="section-container relative flex min-h-[92vh] flex-col justify-center pb-14 pt-28 lg:pb-20 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.72fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7CA7EB] sm:text-xs">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#CBB08A]" />
              <span>Systems Engineer</span>
            </div>

            <h1 className="editorial-serif mt-7 max-w-5xl text-[3.25rem] leading-[0.94] tracking-[-0.035em] text-[#F7F3EC] sm:text-6xl md:text-7xl lg:text-[5.9rem]">
              I build intelligent systems that connect the
              <span className="text-[#7CA7EB]"> physical </span>
              and digital world.
            </h1>

            <div className="mt-8 max-w-3xl border-l border-[#CBB08A] pl-5 sm:pl-7">
              <p className="text-base leading-7 text-[#F7F3EC]/70 sm:text-lg sm:leading-8">
                {profile.bio}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-[#F7F3EC] bg-[#F7F3EC] px-5 py-3 text-sm font-semibold text-[#000B26] transition hover:bg-[#7CA7EB] hover:border-[#7CA7EB]"
              >
                Explore selected work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 border border-[#F7F3EC]/30 px-5 py-3 text-sm font-semibold text-[#F7F3EC] transition hover:border-[#F7F3EC] hover:bg-[#F7F3EC]/5"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile.cv && (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[#CBB08A] transition hover:text-[#F7F3EC]"
                >
                  <Download className="h-4 w-4" />
                  CV
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[31rem] lg:mx-0 lg:justify-self-end"
          >
            <div className="absolute -left-5 -top-5 h-[74%] w-[78%] bg-[#7CA7EB]" aria-hidden="true" />
            <div className="absolute -bottom-5 -right-5 h-[54%] w-[58%] bg-[#CBB08A]" aria-hidden="true" />

            <div className="relative aspect-[4/5] overflow-hidden bg-[#402924]">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={displayName}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 88vw, 31rem"
                />
              ) : (
                <div className="flex h-full items-center justify-center editorial-serif text-8xl text-[#F7F3EC]">
                  {displayName.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000B26]/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#CBB08A]">Engineer / Developer</p>
                <p className="editorial-serif mt-2 text-3xl leading-none text-[#F7F3EC] sm:text-4xl">{displayName}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-[#F7F3EC]/15 pt-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CBB08A]">Core disciplines</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {disciplines.map(item => (
              <span key={item} className="text-sm text-[#F7F3EC]/60">{item}</span>
            ))}
          </div>
          <Link href="#about" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7CA7EB] hover:text-[#F7F3EC]">
            Continue
            <ArrowDownRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
