'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/lib/i18n'

const navLinks = [
  { href: '/#about', label: 'Profile' },
  { href: '/#projects', label: 'Engineering Work' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/hire', label: 'Work With Me' },
  { href: '/hire/dossier', label: 'Dossier' },
  { href: '/case-studies', label: 'Case Studies' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-dark-800/80 bg-dark-950/95 backdrop-blur-xl light:border-slate-200 light:bg-white/95'
          : 'border-transparent bg-dark-950/55 backdrop-blur-md'
      }`}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/"
            className="flex items-center gap-3 text-white transition hover:text-primary-300"
            aria-label="Emmanuel Inambao - Home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-700 bg-dark-900">
              <Cpu className="h-5 w-5 text-primary-400" aria-hidden="true" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold tracking-wide">Emmanuel Inambao</span>
              <span className="block text-[10px] uppercase tracking-[0.16em] text-dark-500">
                Engineering Systems
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-dark-300 transition-colors hover:text-white light:text-slate-600 light:hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={openCommandPalette}
              className="hidden items-center gap-2 rounded-lg border border-dark-700 bg-dark-900/60 px-3 py-1.5 text-xs text-dark-400 transition hover:border-dark-600 hover:text-dark-200 xl:flex"
              aria-label="Search portfolio"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="font-mono text-[10px] text-dark-500">Ctrl K</kbd>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />

            <Link href="/#contact" className="btn-primary px-4 py-2 text-sm">
              Discuss an opportunity
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-dark-300 transition-colors hover:text-white lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="border-t border-dark-800 py-4">
                <div className="grid gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-dark-300 transition hover:bg-dark-900 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-dark-800 pt-4">
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/#contact"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Discuss an opportunity
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
