'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { useProfile } from '@/lib/profile'

export default function Hero() {
  const { profile } = useProfile()

  return (
    <section
      id="hero"
      className="bg-brand-cream pb-16 pt-32 text-brand-navy dark:bg-brand-navy dark:text-brand-cream sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
      aria-labelledby="hero-heading"
    >
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-sm font-semibold text-brand-chocolate/70 dark:text-brand-camel">
              Systems Engineer · Lusaka, Zambia
            </p>

            <h1
              id="hero-heading"
              className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              Emmanuel Inambao
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-9 text-brand-chocolate/80 dark:text-brand-cream/75 sm:text-2xl">
              I build practical systems across software, AI, IoT, robotics and embedded hardware.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-chocolate/65 dark:text-brand-cream/60 sm:text-lg">
              My work focuses on turning real problems into working products—from connected ESP32 devices and automation systems to mobile and web applications.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="inline-flex min-h-12 items-center gap-2 bg-brand-navy px-6 text-sm font-semibold text-brand-cream transition hover:bg-brand-chocolate dark:bg-brand-sky dark:text-brand-navy"
              >
                View projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center border border-brand-navy/20 px-6 text-sm font-semibold transition hover:border-brand-navy dark:border-brand-cream/25 dark:hover:border-brand-cream"
              >
                Contact me
              </Link>
            </div>

            <div className="mt-10 border-t border-brand-navy/10 pt-5 dark:border-brand-cream/10">
              <p className="max-w-3xl text-sm leading-7 text-brand-chocolate/60 dark:text-brand-cream/55">
                AI · IoT · Robotics · Embedded Systems · Mobile Applications · Full-Stack Development
              </p>
            </div>
          </div>

          <div className="lg:justify-self-end">
            {profile.image ? (
              <div className="max-w-[420px] border border-brand-navy/10 bg-white p-2 dark:border-brand-cream/10 dark:bg-white/5">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-chocolate">
                  <Image
                    src={profile.image}
                    alt="Professional portrait of Emmanuel Inambao"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 38vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-2 py-3 text-xs text-brand-chocolate/60 dark:text-brand-cream/55">
                  <span>Systems Engineer</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Zambia
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid aspect-[4/5] w-full max-w-[420px] place-items-center border border-brand-navy/10 bg-brand-chocolate text-brand-camel dark:border-brand-cream/10">
                <span className="font-serif text-7xl font-semibold" aria-hidden="true">EI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
