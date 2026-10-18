'use client'

import { useEffect, useState } from 'react'
import { defaultEngineeringDirection, readEngineeringDirection, type EngineeringDirection } from '@/lib/engineering-direction'

const field = 'w-full rounded-lg border border-dark-700 bg-dark-950 p-3 text-white focus:border-primary-500 focus:outline-none'

export default function EngineeringDirectionEditor({ onNotify }: { onNotify: (type: 'success' | 'error', message: string) => void }) {
  const [draft, setDraft] = useState<EngineeringDirection>(defaultEngineeringDirection)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    fetch('/api/portfolio-data?key=engineeringDirection', { cache: 'no-store', credentials: 'include' })
      .then(async response => {
        const body = await response.json().catch(() => null)
        if (!response.ok) throw new Error(body?.error || 'Cannot load published direction.')
        if (active) setDraft(readEngineeringDirection(body))
      })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Load failed') })
    return () => { active = false }
  }, [])
  const publish = async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/portfolio-data', {
        method: 'POST', credentials: 'include', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'engineeringDirection', data: draft }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success !== true) throw new Error(result?.error || 'Publishing failed')
      localStorage.setItem('portfolio_last_published_change', JSON.stringify({ key: 'engineeringDirection', at: Date.now() }))
      onNotify('success', 'Engineering direction verified and published. Refresh your homepage to check.')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not publish'
      setError(message); onNotify('error', message)
    } finally { setBusy(false) }
  }
  const updateCard = (index: number, key: 'title' | 'description' | 'image', value: string) =>
    setDraft(previous => ({ ...previous, horizons: previous.horizons.map((card, i) => i === index ? { ...card, [key]: value } : card) }))
  return <div className="space-y-5">
    <div><h2 className="text-2xl font-bold text-white">Engineering Direction • 2026–2036</h2>
      <p className="mt-2 text-sm text-dark-400">Edit long-term ambitions; do not represent future goals as delivered results.</p></div>
    {error && <p role="alert" className="rounded-lg border border-red-800 p-3 text-sm text-red-300">{error}</p>}
    {(['eyebrow', 'heading', 'intro'] as const).map(key => <label key={key} className="block text-sm capitalize text-dark-200">{key}
      <textarea rows={key === 'intro' ? 4 : 2} className={field} value={draft[key]} onChange={event => setDraft(previous => ({ ...previous, [key]: event.target.value }))} />
    </label>)}
    {draft.horizons.map((card, index) => <div key={index} className="space-y-2 rounded-xl border border-dark-700 p-4">
      <p className="text-sm font-semibold text-primary-400">Direction {index + 1}</p>
      <input className={field} value={card.title} placeholder="Priority" onChange={event => updateCard(index, 'title', event.target.value)} />
      <textarea rows={4} className={field} value={card.description} placeholder="Goals, not unsupported claims" onChange={event => updateCard(index, 'description', event.target.value)} />
      <input className={field} value={card.image || ''} placeholder="Optional image URL from Media Upload" onChange={event => updateCard(index, 'image', event.target.value)} />
      <button type="button" className="text-sm text-red-300" onClick={() => setDraft(previous => ({ ...previous, horizons: previous.horizons.filter((_, i) => i !== index) }))}>Remove this direction</button>
    </div>)}
    <div className="flex flex-wrap gap-3">
      <button type="button" className="btn-secondary" disabled={busy} onClick={() => setDraft(previous => ({ ...previous, horizons: [...previous.horizons, { title: '', description: '' }] }))}>Add direction</button>
      <button type="button" className="btn-primary" disabled={busy} onClick={() => void publish()}>{busy ? 'Verifying save…' : 'Save & publish'}</button>
    </div>
  </div>
}
