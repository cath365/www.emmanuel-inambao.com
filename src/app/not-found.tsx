'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <h1 className="text-8xl sm:text-9xl font-bold gradient-text mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-dark-400 mb-8 text-lg">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-primary group inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-dark-800">
            <p className="text-dark-500 text-sm mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/#projects" className="text-primary-400 hover:text-primary-300 transition-colors">
                Projects
              </Link>
              <Link href="/#about" className="text-primary-400 hover:text-primary-300 transition-colors">
                About
              </Link>
              <Link href="/#skills" className="text-primary-400 hover:text-primary-300 transition-colors">
                Skills
              </Link>
              <Link href="/#contact" className="text-primary-400 hover:text-primary-300 transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-primary-400 hover:text-primary-300 transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
