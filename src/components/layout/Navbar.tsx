'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/lib/i18n'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
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
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${isScrolled ? 'border-brand-cream/10 bg-brand-navy/95 backdrop-blur-md' : 'border-transparent bg-brand-navy/80 backdrop-blur-sm'}`}>
      <nav className="section-container" aria-label="Primary navigation">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="inline-flex items-center gap-2.5 text-brand-cream" aria-label="Emmanuel Inambao home">
            <Cpu className="h-5 w-5 text-brand-sky" aria-hidden="true" />
            <span className="font-semibold tracking-tight">E.Inambao</span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-brand-cream/65 transition hover:text-brand-cream">
                {link.label}
              </Link>
            ))}

            <button type="button" onClick={openCommandPalette} className="hidden items-center gap-2 rounded-md border border-brand-cream/10 px-3 py-2 text-xs text-brand-cream/45 transition hover:text-brand-cream xl:inline-flex" aria-label="Open site search">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Ctrl K
            </button>

            <div className="hidden items-center gap-2 2xl:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <Link href="#contact" className="rounded-lg bg-brand-sky px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-camel">
              Contact
            </Link>
          </div>

          <button type="button" onClick={() => setIsOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center text-brand-cream lg:hidden" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="mobile-menu">
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-brand-cream/10 lg:hidden">
              <div className="grid gap-1 py-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-md px-3 py-3 text-base text-brand-cream/75 transition hover:bg-white/5 hover:text-brand-cream">
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 flex items-center gap-3 border-t border-brand-cream/10 pt-4">
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
