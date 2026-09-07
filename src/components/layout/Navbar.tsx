'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/lib/i18n'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
        isScrolled
          ? 'border-brand-cream/10 bg-brand-navy/95 shadow-[0_8px_30px_rgba(0,11,38,0.16)] backdrop-blur-xl'
          : 'border-transparent bg-brand-navy/88 backdrop-blur-md'
      }`}
    >
      <nav className="section-container" aria-label="Primary navigation">
        <div className="flex h-[4.75rem] items-center justify-between gap-6">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3 text-brand-cream"
            aria-label="Emmanuel Inambao home"
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-sky/45 bg-brand-sky/10 font-serif text-lg font-semibold text-brand-sky"
              aria-hidden="true"
            >
              EI
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-xl font-semibold leading-none tracking-tight sm:text-2xl">
                Emmanuel Inambao
              </span>
              <span className="mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.23em] text-brand-camel">
                Systems Engineer
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <div className="flex items-center gap-5" role="list">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-brand-cream/72 transition hover:text-brand-sky"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-brand-cream/12 text-brand-cream/65 transition hover:border-brand-sky/45 hover:text-brand-sky xl:inline-flex"
              aria-label="Open site search"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="hidden items-center gap-2 2xl:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <Link
              href="#projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-sky px-5 text-sm font-semibold text-brand-navy transition hover:bg-brand-camel"
            >
              View My Work
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-cream/15 text-brand-cream transition hover:border-brand-sky/50 hover:text-brand-sky lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              id="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-brand-cream/10 lg:hidden"
            >
              <div className="grid gap-1 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-brand-cream/80 transition hover:bg-brand-cream/5 hover:text-brand-sky"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-2 grid grid-cols-3 gap-2 border-t border-brand-cream/10 pt-4 text-center text-xs font-semibold uppercase tracking-[0.14em]">
                  <Link href="/case-studies" onClick={() => setIsOpen(false)} className="rounded-lg px-2 py-3 text-brand-camel hover:bg-brand-cream/5">
                    Cases
                  </Link>
                  <Link href="/blog" onClick={() => setIsOpen(false)} className="rounded-lg px-2 py-3 text-brand-camel hover:bg-brand-cream/5">
                    Blog
                  </Link>
                  <Link href="/resume" onClick={() => setIsOpen(false)} className="rounded-lg px-2 py-3 text-brand-camel hover:bg-brand-cream/5">
                    Resume
                  </Link>
                </div>

                <Link
                  href="#projects"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-sky px-5 font-semibold text-brand-navy"
                >
                  View My Work
                </Link>

                <div className="mt-3 flex items-center justify-center gap-3">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  )
}
