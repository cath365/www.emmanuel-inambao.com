'use client'

import Link from 'next/link'
import { Cpu, Github, Linkedin, Mail, Phone, Rss } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="bg-dark-900 border-t border-dark-800" role="contentinfo">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-bold text-xl mb-4"
              aria-label="Emmanuel Inambao - Home"
            >
              <Cpu className="w-6 h-6 text-primary-500" aria-hidden="true" />
              Emmanuel Inambao
            </Link>
            <p className="text-dark-400 max-w-md mb-6">
              Electronic Engineer specializing in IoT, Robotics, and Full-Stack Systems.
              Building intelligent solutions that bridge hardware and software to solve
              real-world challenges across Africa and beyond.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/bolo3574"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/in/emmanuelinambao"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:denuelinambao@gmail.com"
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200"
                aria-label="Email Emmanuel"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/260973914432"
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200"
                aria-label="WhatsApp Emmanuel"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-dark-400 hover:text-orange-400 hover:bg-dark-800 rounded-lg transition-all duration-200"
                aria-label="RSS Feed"
              >
                <Rss className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { key: 'nav.about', href: '#about' },
                { key: 'nav.skills', href: '#skills' },
                { key: 'nav.projects', href: '#projects' },
                { key: 'nav.education', href: '#education' },
                { key: 'nav.contact', href: '#contact' }
              ].map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/start-project" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  Start Project
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  Resume
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  Changelog
                </Link>
              </li>
              <li>
                <a href="/api/rss" target="_blank" className="text-dark-400 hover:text-primary-400 transition-colors duration-200">
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-8 pt-6 border-t border-dark-800/50 text-center">
          <p className="text-dark-600 text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400 font-mono text-[10px]">K</kbd> to search anywhere
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-dark-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-dark-500 text-sm">
              &copy; {currentYear} Prof. Emmanuel Inambao. {t('footer.rights')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Link
                href="/admin"
                className="text-dark-600 hover:text-dark-400 text-sm transition-colors"
              >
                Admin
              </Link>
              <p className="text-dark-600 text-sm">
                Designed & Built with precision in Lusaka, Zambia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
