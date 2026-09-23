'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  return (
    <main className="min-h-screen bg-dark-950 px-4 py-16 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-dark-800 bg-dark-900/90 p-6 shadow-2xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Portfolio administration</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Admin Login</h1>
            <p className="mt-2 text-sm leading-relaxed text-dark-400">
              Sign in to manage projects, profile content, media, leads and portfolio settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-dark-200">Email</label>
              <input
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="username"
                required
                className="mt-2 block w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition placeholder:text-dark-600 focus:border-primary-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-dark-200">Password</label>
              <input
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 block w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-white outline-none transition placeholder:text-dark-600 focus:border-primary-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-dark-600">
            Secure server-side authentication
          </p>
        </div>
      </div>
    </main>
  )
}
