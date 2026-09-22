'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Cpu, Search } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LanguageSwitcher, useLanguage } from '@/lib/i18n'

// Navigation links configuration
const navLinks: Array<{ href: string; labelKey?: string; label?: string }> = [
  { href: '/#about', labelKey: 'nav.about' },
  { href: '/#skills', labelKey: 'nav.skills' },
  { href: '/#projects', labelKey: 'nav.projects' },
  { href: '/hire', label: 'Hire / Work With Me' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/start-project', labelKey: 'hero.cta.contact' },
  { href: '/case-studies', labelKey: 'nav.caseStudies' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/#contact', labelKey: 'nav.contact' },
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
          ? 'bg-[#F7F5EF]/96 dark:bg-dark-950/96 backdrop-blur-xl border-b border-[#DDD7CC] dark:border-dark-800/80'
          : 'bg-[#F7F5EF]/90 dark:bg-transparent backdrop-blur-md border-b border-[#E5E0D6]/80 dark:border-transparent'
      }`}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[#10243E] dark:text-white font-semibold text-lg hover:text-[#526E8A] dark:hover:text-primary-300 transition-colors tracking-tight"
            aria-label="Emmanuel Inambao - Home"
          >
            <Cpu className="w-5 h-5 text-[#526E8A] dark:text-primary-400" aria-hidden="true" />
            <span className="hidden sm:inline">E.Inambao</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#566273] dark:text-dark-300 hover:text-[#10243E] dark:hover:text-white transition-colors duration-200 font-medium text-sm"
              >
                {link.label || t(link.labelKey || '')}
              </Link>
            ))}

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs text-[#667384] dark:text-dark-400 bg-white/45 dark:bg-dark-800/50
                         border border-[#D9D4CA] dark:border-dark-700 rounded-sm hover:border-[#AAB6C2] dark:hover:border-dark-600 hover:text-[#10243E] dark:hover:text-dark-300 transition-all"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="text-[10px] text-dark-500 font-mono">Ctrl K</kbd>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/#contact" className="btn-primary text-sm rounded-md">
              {t('hero.cta.contact')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#566273] dark:text-dark-300 hover:text-[#10243E] dark:hover:text-white transition-colors"
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
              <div className="py-4 space-y-2 border-t border-[#DDD7CC] dark:border-dark-800">
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
                      className="block py-3 px-4 text-center text-[#566273] dark:text-dark-300 hover:text-[#10243E] dark:hover:text-white hover:bg-white/60 dark:hover:bg-dark-800/50
                                 rounded-lg transition-all duration-200 font-medium"
                    >
                      {link.label || t(link.labelKey || '')}
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
                    href="/#contact"
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
