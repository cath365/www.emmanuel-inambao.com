'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error boundary:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex p-4 rounded-full bg-red-900/20 border border-red-700/30 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-dark-400 mb-8">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        {error.digest && (
          <p className="text-xs text-dark-500 mb-6 font-mono">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
