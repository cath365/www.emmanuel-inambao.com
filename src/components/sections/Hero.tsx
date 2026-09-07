'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { useProfile } from '@/lib/profile'

export default function Hero() {
  const { profile } = useProfile()

  return (
    <section id="hero" className="relative bg-brand-navy pb-16 text-brand-camel" aria-labelledby="hero-heading">
      <div className="relative h-52 overflow-hidden sm:h-60 md:h-72">
        {profile.coverImage ? (
          <Image src={profile.coverImage} alt="Emmanuel Inambao portfolio cover" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-brand-chocolate">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-brand-sky/20" />
            <div className="absolute bottom-0 left-0 h-2 w-full bg-brand-camel" />
          </div>
        )}
        <div className="absolute inset-0 bg-brand-navy/35" />
      </div>

      <div className="section-container relative -mt-14 sm:-mt-16">
        <div className="border border-brand-camel/20 bg-brand-navy px-5 pb-7 pt-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:px-7 sm:pb-8 lg:px-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="-mt-16 shrink-0 sm:-mt-20">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-brand-navy bg-brand-chocolate sm:h-36 sm:w-36">
                {profile.image ? (
                  <Image src={profile.image} alt="Professional portrait of Emmanuel Inambao" width={144} height={144} priority className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center font-serif text-4xl font-semibold text-brand-sky">EI</div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 id="hero-heading" className="font-sans text-3xl font-bold tracking-[-0.025em] text-brand-camel sm:text-4xl lg:text-5xl">
                Emmanuel Inambao
              </h1>
              <p className="mt-2 text-lg font-semibold text-brand-camel/90 sm:text-xl">Systems Engineer</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-camel/70">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-camel" aria-hidden="true" />
                  Lusaka, Zambia
                </span>
                <span>AI · IoT · Robotics · Embedded Systems · Mobile · Full-Stack</span>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-8 text-brand-camel/80 sm:text-lg">
            I design and build practical technology systems that connect software, intelligent features, electronics and real-world automation.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/start-project" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-camel px-5 text-sm font-semibold text-brand-navy transition hover:bg-brand-sky hover:text-brand-chocolate">
              Start a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#projects" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-camel/25 px-5 text-sm font-semibold text-brand-camel transition hover:bg-brand-camel/10">
              View projects
            </Link>
            <Link href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-camel/25 px-5 text-sm font-semibold text-brand-camel transition hover:bg-brand-camel/10">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </Link>
          </div>

          <div className="mt-7 border-t border-brand-camel/20 pt-5">
            <p className="text-sm leading-7 text-brand-camel/65">
              Turning ideas into intelligent real-world solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
