'use client'
import { useState } from 'react'

type Check = { name: string; ok: boolean; detail: string }
export default function IntegrationStatus() {
  const [checks, setChecks] = useState<Check[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const check = async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/admin/integrations', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not check integrations.')
      setChecks(result.checks)
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not check integrations.') }
    finally { setBusy(false) }
  }
  return <details className="mb-6 rounded-xl border border-dark-700 bg-dark-900/60 p-4">
    <summary className="cursor-pointer text-sm font-medium text-white">Storage, email and video service status</summary>
    <p className="my-3 text-sm text-dark-400">Check connected services when submissions or publishing fail. This does not send a test email.</p>
    <button type="button" onClick={check} disabled={busy} className="btn-secondary min-h-11 text-sm">{busy ? 'Checking…' : 'Check integrations'}</button>
    {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    <div className="mt-3 grid gap-3 md:grid-cols-2">{checks.map(item => <div key={item.name} className="rounded-lg border border-dark-700 p-3">
      <p className={item.ok ? 'text-green-400' : 'text-amber-400'}>{item.name}: {item.ok ? 'Configured' : 'Needs attention'}</p>
      <p className="mt-1 break-words text-sm text-dark-300">{item.detail}</p>
    </div>)}</div>
  </details>
}
