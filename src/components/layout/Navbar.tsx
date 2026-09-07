'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/lib/i18n'

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/#services', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <header className={'fixed inset-x-0 top-0 z-50 transition-all duration-300 ' + (isScrolled ? 'bg-[#000B26]/95 backdrop-blur-xl border-b border-[#F7F3EC]/10' : 'bg-[#000B26]/80 backdrop-blur-md')}>
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Link href="/" className="group flex items-baseline gap-3 text-[#F7F3EC]" aria-label="Emmanuel Inambao home">
            <span className="editorial-serif text-xl leading-none sm:text-2xl">Emmanuel</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7CA7EB] sm:inline">Systems</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-xs font-semibold uppercase tracking-[0.13em] text-[#F7F3EC]/70 transition hover:text-[#F7F3EC]">
                {link.label}
              </Link>
            ))}
            <button onClick={openCommandPalette} className="p-2 text-[#F7F3EC]/55 transition hover:text-[#7CA7EB]" aria-label="Search portfolio">
              <Search className="h-4 w-4" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/start-project" className="border border-[#CBB08A] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#CBB08A] transition hover:bg-[#CBB08A] hover:text-[#402924]">
              Start project
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(value => !value)}
            className="border border-[#F7F3EC]/20 p-2 text-[#F7F3EC] lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-[#F7F3EC]/10 lg:hidden"
            >
              <div className="py-4">
                {navLinks.map((link, index) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                    <Link href={link.href} onClick={() => setIsOpen(false)} className="block border-b border-[#F7F3EC]/10 py-4 text-sm font-semibold text-[#F7F3EC]/80">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Link href="/start-project" onClick={() => setIsOpen(false)} className="mt-5 inline-flex border border-[#CBB08A] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#CBB08A]">
                  Start project
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
