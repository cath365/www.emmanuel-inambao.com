'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Cpu, MapPin, Radio, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useProfile } from '@/lib/profile'

const disciplines = [
  { label: 'AI', icon: Sparkles },
  { label: 'IoT', icon: Radio },
  { label: 'Embedded', icon: Cpu },
]

export default function Hero() {
  const { profile } = useProfile()
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-brand-navy pb-16 pt-28 text-brand-cream sm:pb-20 sm:pt-32 lg:min-h-[780px] lg:pb-24 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-20 bg-brand-navy" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
        <div className="absolute left-[8%] top-28 h-px w-[84%] bg-brand-cream/10" />
        <div className="absolute bottom-20 left-[18%] top-20 w-px bg-brand-cream/10" />
        <div className="absolute bottom-20 right-[18%] top-20 w-px bg-brand-cream/10" />
      </div>
      <div className="absolute -right-24 top-24 -z-10 h-72 w-72 rounded-full border-[44px] border-brand-sky/15 sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="absolute -left-20 bottom-[-8rem] -z-10 h-64 w-64 rounded-full bg-brand-chocolate/80 sm:h-80 sm:w-80" aria-hidden="true" />

      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              {disciplines.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-brand-cream/10 bg-white/5 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-camel">
                  <Icon className="h-3.5 w-3.5 text-brand-sky" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-brand-cream/45">
              Systems Engineer · Lusaka, Zambia
            </p>

            <h1
              id="hero-heading"
              className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.88] tracking-[-0.04em] text-brand-cream sm:text-6xl md:text-7xl lg:text-[6rem]"
            >
              Emmanuel
              <span className="block text-brand-sky">Inambao.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-brand-cream/75 sm:text-xl">
              I design and build intelligent systems that solve real-world problems and create meaningful impact.
            </p>

            <p className="mt-4 max-w-2xl font-serif text-2xl italic leading-8 text-brand-camel sm:text-3xl">
              Turning ideas into intelligent real-world solutions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-sky px-6 text-sm font-semibold text-brand-navy transition duration-300 hover:-translate-y-0.5 hover:bg-brand-camel">
                View My Work
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-cream/20 px-6 text-sm font-semibold text-brand-cream transition duration-300 hover:-translate-y-0.5 hover:border-brand-camel hover:text-brand-camel">
                Get In Touch
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-3xl gap-4 border-t border-brand-cream/10 pt-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream/45">
                <MapPin className="h-3.5 w-3.5 text-brand-sky" aria-hidden="true" />
                Zambia
              </span>
              <p className="text-sm leading-7 text-brand-cream/65 sm:text-base">
                Artificial Intelligence · IoT · Robotics · Embedded Systems · Mobile Applications · Full-Stack Development
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.08 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="absolute -left-5 top-12 h-28 w-28 rounded-full bg-brand-camel" aria-hidden="true" />
            <div className="absolute -right-7 bottom-10 h-40 w-40 rounded-full border-[26px] border-brand-sky/55" aria-hidden="true" />

            <div className="relative ml-auto max-w-[440px] rounded-[2.2rem] border border-brand-cream/15 bg-white/5 p-3 shadow-[0_36px_110px_rgba(0,0,0,0.38)] backdrop-blur-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] bg-brand-chocolate">
                {profile.image ? (
                  <Image src={profile.image} alt="Professional portrait of Emmanuel Inambao" fill priority sizes="(max-width: 1024px) 90vw, 42vw" className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-brand-chocolate text-center">
                    <span className="font-serif text-8xl font-semibold text-brand-camel" aria-hidden="true">EI</span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-transparent p-6 pt-28">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-camel">Engineering Profile</p>
                  <p className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-cream">
                    Software intelligence,
                    <span className="block text-brand-sky">connected to hardware.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative -mt-7 mr-auto max-w-[310px] rounded-2xl border border-brand-cream/10 bg-brand-navy/95 p-4 shadow-xl backdrop-blur-md sm:-ml-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-brand-camel">System mindset</p>
                  <p className="mt-1 text-sm font-semibold text-brand-cream">Sense → Decide → Control → Report</p>
                </div>
                <span className="h-3 w-3 shrink-0 rounded-full bg-brand-sky shadow-[0_0_0_6px_rgba(124,167,235,0.12)]" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
