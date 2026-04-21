'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import {
  Search, Home, User, Code, Briefcase, Mail, FileText,
  BookOpen, Award, Download, Sun, Moon, Globe, X,
  Cpu, Zap, Shield, Wrench, MessageSquare, Calendar, Calculator
} from 'lucide-react'

const sections = [
  { name: 'Home', href: '/', icon: Home, group: 'Navigation' },
  { name: 'About', href: '#about', icon: User, group: 'Navigation' },
  { name: 'Skills', href: '#skills', icon: Code, group: 'Navigation' },
  { name: 'Projects', href: '#projects', icon: Cpu, group: 'Navigation' },
  { name: 'Experience', href: '#experience', icon: Briefcase, group: 'Navigation' },
  { name: 'Services', href: '#services', icon: Wrench, group: 'Navigation' },
  { name: 'Testimonials', href: '#testimonials', icon: MessageSquare, group: 'Navigation' },
  { name: 'Contact', href: '#contact', icon: Mail, group: 'Navigation' },
  { name: 'Blog', href: '/blog', icon: BookOpen, group: 'Pages' },
  { name: 'Case Studies', href: '/case-studies', icon: FileText, group: 'Pages' },
  { name: 'Start Project', href: '/start-project', icon: Calculator, group: 'Pages' },
  { name: 'Interactive Resume', href: '/resume', icon: Award, group: 'Pages' },
  { name: 'Changelog', href: '/changelog', icon: Zap, group: 'Pages' },
  { name: 'Download CV', href: '/cv/emmanuel-inambao-cv.pdf', icon: Download, group: 'Actions' },
  { name: 'Book a Meeting', href: '#booking', icon: Calendar, group: 'Actions' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = useCallback((href: string) => {
    setOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (href.endsWith('.pdf')) {
      window.open(href, '_blank')
    } else {
      router.push(href)
    }
  }, [router])

  const toggleTheme = useCallback(() => {
    setOpen(false)
    document.documentElement.classList.toggle('light')
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Dialog */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl">
        <Command
          className="bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
          loop
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-dark-700">
            <Search className="w-5 h-5 text-dark-400 shrink-0" />
            <Command.Input
              placeholder="Search pages, sections, actions..."
              className="w-full py-4 bg-transparent text-white placeholder:text-dark-500 outline-none text-base"
              autoFocus
            />
            <button
              onClick={() => setOpen(false)}
              className="shrink-0 p-1 text-dark-500 hover:text-dark-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-dark-500">
              No results found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading="Navigation" className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-2 py-2">
              {sections.filter(s => s.group === 'Navigation').map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.name}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-dark-300
                             data-[selected=true]:bg-primary-600/20 data-[selected=true]:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Pages Group */}
            <Command.Group heading="Pages" className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-2 py-2">
              {sections.filter(s => s.group === 'Pages').map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.name}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-dark-300
                             data-[selected=true]:bg-primary-600/20 data-[selected=true]:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions Group */}
            <Command.Group heading="Actions" className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-2 py-2">
              {sections.filter(s => s.group === 'Actions').map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.name}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-dark-300
                             data-[selected=true]:bg-primary-600/20 data-[selected=true]:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Command.Item>
              ))}
              <Command.Item
                value="Toggle Dark Mode"
                onSelect={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-dark-300
                           data-[selected=true]:bg-primary-600/20 data-[selected=true]:text-white transition-colors"
              >
                <Sun className="w-4 h-4" />
                <span>Toggle Theme</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer hint */}
          <div className="px-4 py-3 border-t border-dark-700 flex items-center justify-between text-xs text-dark-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400 font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400 font-mono">↵</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400 font-mono">Esc</kbd>
              Close
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}

// Trigger button for mobile / visible hint
export function CommandPaletteTrigger() {
  const handleOpen = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <button
      onClick={handleOpen}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-dark-400 bg-dark-800/50
                 border border-dark-700 rounded-lg hover:border-dark-600 hover:text-dark-300 transition-all"
      aria-label="Search (Ctrl+K)"
    >
      <Search className="w-3.5 h-3.5" />
      <span>Search</span>
      <kbd className="text-xs text-dark-500 bg-dark-800 px-1.5 py-0.5 rounded font-mono ml-2">
        Ctrl K
      </kbd>
    </button>
  )
}
