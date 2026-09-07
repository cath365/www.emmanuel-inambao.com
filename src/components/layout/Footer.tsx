'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#F7F3EC] text-[#402924]" role="contentinfo">
      <div className="section-container py-14 lg:py-20">
        <div className="grid gap-12 border-t border-[#402924]/20 pt-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="editorial-serif text-4xl leading-none sm:text-5xl">Emmanuel Inambao</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#402924]/70 sm:text-base">
              Systems engineer building embedded, IoT, robotics and full-stack products from Lusaka, Zambia.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://github.com/bolo3574" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="border-b border-[#402924]/30 pb-1 text-[#402924] hover:border-[#402924]"><Github className="h-4 w-4" /></a>
              <a href="https://linkedin.com/in/emmanuelinambao" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="border-b border-[#402924]/30 pb-1 text-[#402924] hover:border-[#402924]"><Linkedin className="h-4 w-4" /></a>
              <a href="mailto:denuelinambao@gmail.com" aria-label="Email" className="border-b border-[#402924]/30 pb-1 text-[#402924] hover:border-[#402924]"><Mail className="h-4 w-4" /></a>
              <a href="https://wa.me/260973914432" aria-label="WhatsApp" className="border-b border-[#402924]/30 pb-1 text-[#402924] hover:border-[#402924]"><Phone className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#7B5F3E]">Work</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/projects" className="hover:underline">Projects</Link></li>
                <li><Link href="/case-studies" className="hover:underline">Case studies</Link></li>
                <li><Link href="/resume" className="hover:underline">Resume</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#7B5F3E]">Explore</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/#about" className="hover:underline">About</Link></li>
                <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                <li><Link href="/#contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#7B5F3E]">Build</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/start-project" className="hover:underline">Start project</Link></li>
                <li><Link href="/admin" className="hover:underline">Admin</Link></li>
                <li><a href="/api/rss" target="_blank" rel="noopener noreferrer" className="hover:underline">RSS</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#402924]/20 pt-6 text-xs text-[#402924]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Emmanuel Inambao. All rights reserved.</p>
          <p>Designed and engineered in Lusaka, Zambia.</p>
        </div>
      </div>
    </footer>
  )
}
