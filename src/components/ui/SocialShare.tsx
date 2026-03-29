'use client'

import { useState } from 'react'
import { Share2, Twitter, Linkedin, Link, Check, Facebook, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${url}`
    : url

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description || '')

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-blue-500/20 hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-600/20 hover:text-blue-500',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-700/20 hover:text-blue-600',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      color: 'hover:bg-green-500/20 hover:text-green-400',
    },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = fullUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-dark-400 bg-dark-800/50
                   border border-dark-700 rounded-lg hover:border-primary-500/50 hover:text-primary-400
                   transition-all duration-200"
        aria-label="Share this page"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 p-2 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-50 min-w-[200px]"
          >
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 transition-all ${link.color}`}
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </a>
            ))}
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300
                         hover:bg-dark-700 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
