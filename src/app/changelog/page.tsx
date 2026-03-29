'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Zap, Bug, Sparkles, Shield, Rocket } from 'lucide-react'
import Link from 'next/link'

const changelog = [
  {
    version: '3.0.0',
    date: 'March 2026',
    tag: 'Major',
    tagColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Command Palette (Ctrl+K) for instant navigation' },
      { type: 'feature', icon: Sparkles, text: 'Interactive resume page with animated timeline' },
      { type: 'feature', icon: Sparkles, text: 'Pricing & packages section for transparency' },
      { type: 'feature', icon: Sparkles, text: 'FAQ section answering common client questions' },
      { type: 'feature', icon: Sparkles, text: '"How I Work" process section with 6-step methodology' },
      { type: 'feature', icon: Sparkles, text: 'Client logos & social proof section' },
      { type: 'feature', icon: Sparkles, text: 'Open source contributions showcase' },
      { type: 'feature', icon: Sparkles, text: 'RSS feed for blog subscribers' },
      { type: 'feature', icon: Sparkles, text: 'Social sharing buttons on all content' },
      { type: 'feature', icon: Sparkles, text: 'Service Worker for offline support' },
      { type: 'feature', icon: Sparkles, text: 'Easter eggs (Konami code, console messages)' },
      { type: 'feature', icon: Sparkles, text: 'Magnetic button micro-interactions' },
      { type: 'feature', icon: Sparkles, text: 'GitHub Actions CI/CD pipeline' },
      { type: 'feature', icon: Sparkles, text: 'Playwright E2E test suite' },
      { type: 'improvement', icon: Rocket, text: 'Enhanced micro-interactions and hover effects' },
      { type: 'improvement', icon: Shield, text: 'Added Cloudflare Turnstile CAPTCHA to contact form' },
    ],
  },
  {
    version: '2.5.0',
    date: 'February 2026',
    tag: 'Feature',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Formspree backup for contact form submissions' },
      { type: 'feature', icon: Sparkles, text: 'Direct email option for contact' },
      { type: 'improvement', icon: Rocket, text: 'Edge runtime for contact form API' },
      { type: 'fix', icon: Bug, text: 'Fixed contact form error handling' },
    ],
  },
  {
    version: '2.0.0',
    date: 'January 2026',
    tag: 'Major',
    tagColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Project links (App Store, Play Store, Website, Docs, Video)' },
      { type: 'feature', icon: Sparkles, text: 'Video recording for testimonial submissions' },
      { type: 'feature', icon: Sparkles, text: 'Star rating system for testimonials' },
      { type: 'feature', icon: Sparkles, text: 'AI Chatbot with booking integration' },
      { type: 'feature', icon: Sparkles, text: 'Booking scheduler with timezone support' },
      { type: 'feature', icon: Sparkles, text: 'Cookie consent banner (GDPR compliance)' },
    ],
  },
  {
    version: '1.0.0',
    date: 'December 2025',
    tag: 'Launch',
    tagColor: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
    changes: [
      { type: 'feature', icon: Zap, text: 'Initial portfolio launch' },
      { type: 'feature', icon: Sparkles, text: '7-language internationalization (i18n)' },
      { type: 'feature', icon: Sparkles, text: 'Dark/Light theme with system detection' },
      { type: 'feature', icon: Sparkles, text: '3D interactive skills globe' },
      { type: 'feature', icon: Sparkles, text: 'Admin dashboard with CRUD operations' },
      { type: 'feature', icon: Sparkles, text: 'Blog & case studies sections' },
      { type: 'feature', icon: Sparkles, text: 'Gallery, testimonials, and certifications' },
      { type: 'feature', icon: Sparkles, text: 'SEO optimization with JSON-LD structured data' },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="text-dark-400 hover:text-white transition-colors text-sm flex items-center gap-1 mb-6">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Portfolio
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Changelog</h1>
          <p className="text-dark-400">
            A living record of every improvement, feature, and fix shipped to this portfolio.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-dark-700" />

          <div className="space-y-12">
            {changelog.map((release, releaseIndex) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: releaseIndex * 0.1 }}
                className="relative pl-12"
              >
                {/* Dot on timeline */}
                <div className="absolute left-[12px] top-1 w-[14px] h-[14px] rounded-full bg-primary-500 border-2 border-dark-950" />

                {/* Version Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-white">v{release.version}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${release.tagColor}`}>
                    {release.tag}
                  </span>
                  <span className="text-sm text-dark-500">{release.date}</span>
                </div>

                {/* Changes */}
                <div className="space-y-2">
                  {release.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <change.icon className={`w-4 h-4 shrink-0 mt-0.5 ${
                        change.type === 'feature' ? 'text-green-400' :
                        change.type === 'improvement' ? 'text-blue-400' :
                        change.type === 'fix' ? 'text-orange-400' :
                        'text-dark-400'
                      }`} />
                      <span className="text-dark-300">{change.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
