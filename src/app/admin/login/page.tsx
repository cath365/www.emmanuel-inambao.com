'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <main className="min-h-screen bg-[#000B26] text-[#F7F3EC]">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -left-24 top-28 h-80 w-80 rounded-full border border-[#7CA7EB]/20" />
          <div className="pointer-events-none absolute bottom-[-8rem] right-[-5rem] h-96 w-96 rounded-full bg-[#7CA7EB]/[0.06]" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
          </div>

          <div className="relative max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#7CA7EB]">Private workspace</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] xl:text-6xl">
              Portfolio control for the work behind the work.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/50">
              Manage projects, enquiries, bookings, media and audience performance from one focused engineering workspace.
            </p>
          </div>

          <div className="relative flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4 text-[#CBB08A]" />
            Authenticated access only
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#F7F3EC] px-4 py-10 text-[#000B26] sm:px-8">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#000B26]/65 lg:hidden">
              <ArrowLeft className="h-4 w-4" />
              Portfolio
            </Link>

            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7B5F3E]">Emmanuel Inambao</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Sign in to Portfolio Control.</h2>
            <p className="mt-3 text-sm leading-6 text-[#000B26]/55">
              Use your administrator account to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/55">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000B26]/35" />
                  <input
                    id="admin-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="w-full border border-[#000B26]/20 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#000B26]/25 focus:border-[#000B26]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-[0.12em] text-[#000B26]/55">
                  Password
                </label>
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000B26]/35" />
                  <input
                    id="admin-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full border border-[#000B26]/20 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#000B26]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#000B26]/40 hover:text-[#000B26]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-[#000B26] px-5 py-3.5 text-sm font-bold text-[#F7F3EC] transition hover:bg-[#10203E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-xs leading-5 text-[#000B26]/40">
              Credentials are never displayed on this screen. Access is validated by the portfolio authentication API.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
