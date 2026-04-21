'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Cpu, Search } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher, useLanguage } from '@/lib/i18n'

// Navigation links configuration
const navLinks = [
  { href: '#about', labelKey: 'nav.about' },
  { href: '#skills', labelKey: 'nav.skills' },
  { href: '#projects', labelKey: 'nav.projects' },
  { href: '/start-project', labelKey: 'hero.cta.contact' },
  { href: '/case-studies', labelKey: 'nav.caseStudies' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '#contact', labelKey: 'nav.contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useLanguage()

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Open command palette
  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/95 light:bg-white/95 backdrop-blur-md border-b border-dark-800 light:border-slate-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-primary-400 transition-colors"
            aria-label="Emmanuel Inambao - Home"
          >
            <Cpu className="w-6 h-6 text-primary-500" aria-hidden="true" />
            <span className="hidden sm:inline">E.Inambao</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-colors duration-200 font-medium text-sm"
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs text-dark-400 bg-dark-800/50
                         border border-dark-700 rounded-lg hover:border-dark-600 hover:text-dark-300 transition-all"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="text-[10px] text-dark-500 font-mono">Ctrl K</kbd>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="#contact" className="btn-primary text-sm">
              {t('hero.cta.contact')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-dark-300 hover:text-white transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-dark-800 light:border-slate-200">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block py-3 px-4 text-center text-dark-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-dark-800/50 light:hover:bg-slate-100
                                 rounded-lg transition-all duration-200 font-medium"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2"
                >
                  <Link
                    href="#contact"
                    onClick={handleLinkClick}
                    className="btn-primary w-full text-center"
                  >
                    {t('hero.cta.contact')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
