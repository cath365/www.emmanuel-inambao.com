'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useProfile } from '@/lib/profile'

export default function Hero() {
  const { profile } = useProfile()
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-brand-navy pb-16 pt-32 text-brand-cream sm:pb-20 sm:pt-36 lg:min-h-[760px] lg:pb-24 lg:pt-40"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-20 bg-brand-navy" aria-hidden="true" />
      <div
        className="absolute -right-24 top-24 -z-10 h-72 w-72 rounded-full border-[44px] border-brand-sky/20 sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 bottom-[-7rem] -z-10 h-60 w-60 rounded-full bg-brand-chocolate/70 sm:h-80 sm:w-80"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-[34%] -z-10 h-24 w-24 rounded-full bg-brand-camel/75"
        aria-hidden="true"
      />

      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          >
            <p className="editorial-label !text-brand-camel">AI • IoT • ROBOTICS</p>

            <h1
              id="hero-heading"
              className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.035em] text-brand-cream sm:text-6xl md:text-7xl lg:text-[5.8rem]"
            >
              Emmanuel
              <span className="block text-brand-sky">Inambao</span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:text-base">
              <span className="font-semibold uppercase tracking-[0.17em] text-brand-cream">
                Systems Engineer
              </span>
              <span className="hidden h-4 w-px bg-brand-cream/25 sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5 text-brand-cream/60">
                <MapPin className="h-4 w-4 text-brand-sky" aria-hidden="true" />
                Lusaka, Zambia
              </span>
            </div>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-brand-cream/75 sm:text-xl">
              I design and build intelligent systems that solve real-world problems and create
              meaningful impact.
            </p>

            <p className="mt-4 max-w-2xl font-serif text-2xl italic leading-8 text-brand-camel sm:text-3xl">
              Turning ideas into intelligent real-world solutions.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#projects"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-sky px-6 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:bg-brand-camel"
              >
                View My Work
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-cream/25 px-6 text-sm font-semibold text-brand-cream transition hover:-translate-y-0.5 hover:border-brand-camel hover:text-brand-camel"
              >
                Get In Touch
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 max-w-3xl border-t border-brand-cream/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream/40">
                Specialisation
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-cream/70 sm:text-base">
                Artificial Intelligence · IoT · Robotics · Embedded Systems · Mobile Applications
                · Full-Stack Development
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.08 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="absolute -left-7 -top-7 h-24 w-24 rounded-full bg-brand-camel sm:h-28 sm:w-28" aria-hidden="true" />
            <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full border-[26px] border-brand-sky/60 sm:h-44 sm:w-44" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-[2rem] border border-brand-cream/20 bg-brand-cream p-3 shadow-[0_34px_100px_rgba(0,0,0,0.32)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-brand-chocolate">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="Professional portrait of Emmanuel Inambao"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-brand-chocolate text-center">
                    <span className="font-serif text-8xl font-semibold text-brand-camel" aria-hidden="true">
                      EI
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent p-6 pt-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-camel">
                    Professional Profile
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-brand-cream">
                    Systems thinking,
                    <span className="block text-brand-sky">built into products.</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
