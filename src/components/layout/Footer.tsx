'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Rss } from 'lucide-react'
import { useProfile } from '@/lib/profile'

const quickLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
]

const resourceLinks = [
  { label: 'Start Project', href: '/start-project' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'Changelog', href: '/changelog' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { profile } = useProfile()

  const socialLinks = [
    profile.socialLinks.github
      ? { label: 'GitHub', href: profile.socialLinks.github, icon: Github }
      : null,
    profile.socialLinks.linkedin
      ? { label: 'LinkedIn', href: profile.socialLinks.linkedin, icon: Linkedin }
      : null,
  ].filter(Boolean) as Array<{
    label: string
    href: string
    icon: typeof Github
  }>

  return (
    <footer
      className="border-t border-brand-cream/10 bg-brand-navy text-brand-cream"
      role="contentinfo"
    >
      <div className="section-container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Emmanuel Inambao home">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-brand-sky/40 bg-brand-sky/10 font-serif text-lg font-semibold text-brand-sky">
                EI
              </span>
              <span>
                <span className="block font-serif text-2xl font-semibold leading-none">
                  Emmanuel Inambao
                </span>
                <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-camel">
                  Systems Engineer
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-xl text-sm leading-7 text-brand-cream/60">
              Turning ideas into intelligent real-world solutions through AI, IoT, robotics,
              embedded systems, mobile applications and full-stack development.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={'mailto:' + profile.email}
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-cream/15 text-brand-cream/70 transition hover:border-brand-sky hover:text-brand-sky"
                aria-label="Email Emmanuel Inambao"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-brand-cream/15 text-brand-cream/70 transition hover:border-brand-sky hover:text-brand-sky"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                )
              })}
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-cream/15 text-brand-cream/70 transition hover:border-brand-camel hover:text-brand-camel"
                aria-label="RSS feed"
              >
                <Rss className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-camel">
              Profile
            </h2>
            <ul className="mt-5 grid gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-cream/60 transition hover:text-brand-sky"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-camel">
              Resources
            </h2>
            <ul className="mt-5 grid gap-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-cream/60 transition hover:text-brand-sky"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-brand-cream/35 transition hover:text-brand-cream/65"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-brand-cream/10 pt-6 text-xs text-brand-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Emmanuel Inambao. All rights reserved.</p>
          <p>Designed and built in Lusaka, Zambia.</p>
        </div>
      </div>
    </footer>
  )
}
