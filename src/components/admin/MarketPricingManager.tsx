'use client'

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Plus, RefreshCw, Save, Trash2, TrendingUp } from 'lucide-react'
import {
  defaultMarketPricing,
  marketCategoryLabel,
  marketRangeSummary,
  resolveMarketPricing,
  type MarketPricingCategory,
  type MarketPricingConfig,
  type MarketPricingEntry,
} from '@/lib/market-pricing'

const categories: MarketPricingCategory[] = [
  'basic-website',
  'business-website',
  'ecommerce',
  'maintenance',
]

export default function MarketPricingManager() {
  const [config, setConfig] = useState<MarketPricingConfig>(defaultMarketPricing)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const summary = useMemo(() => marketRangeSummary(config), [config])

  useEffect(() => {
    fetch('/api/portfolio-data?key=marketPricing', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setConfig(resolveMarketPricing(data)))
      .catch(() => setConfig(defaultMarketPricing))
      .finally(() => setLoading(false))
  }, [])

  const updateEntry = (id: string, updates: Partial<MarketPricingEntry>) => {
    setConfig(previous => ({
      ...previous,
      entries: previous.entries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    }))
  }

  const addEntry = () => {
    const now = new Date().toISOString().slice(0, 10)
    const entry: MarketPricingEntry = {
      id: 'market-' + Date.now(),
      provider: 'New Zambia source',
      category: 'business-website',
      label: 'Website package',
      min: 0,
      max: null,
      currency: 'ZMW',
      sourceUrl: '',
      checkedAt: now,
      enabled: true,
      note: '',
    }
    setConfig(previous => ({ ...previous, entries: [...previous.entries, entry] }))
  }

  const removeEntry = (id: string) => {
    setConfig(previous => ({
      ...previous,
      entries: previous.entries.filter(entry => entry.id !== id),
    }))
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    const payload: MarketPricingConfig = {
      ...config,
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    try {
      const response = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ key: 'marketPricing', data: payload }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to publish market benchmark.')
      }
      setConfig(payload)
      setMessage('Zambia market benchmark published. The AI can now use these approved references.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to publish market benchmark.')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setConfig({
      ...defaultMarketPricing,
      entries: defaultMarketPricing.entries.map(entry => ({ ...entry })),
    })
    setMessage('Seed benchmark restored locally. Press Save Benchmark to publish it.')
  }

  if (loading) {
    return <div className="py-16 text-center text-dark-400">Loading Zambia market pricing…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">Zambia Market Pricing</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-dark-400">
            Approved public market references used by the AI when a client asks whether a quotation is
            expensive, cheap or within the Zambia market. These references never change your fixed prices.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-700 px-4 py-2 text-sm text-dark-200 hover:border-dark-500"
          >
            <RefreshCw className="h-4 w-4" /> Reset seed data
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Publishing…' : 'Save Benchmark'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-dark-700 bg-dark-900/60 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex items-center gap-3 text-sm text-dark-200">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={event => setConfig(previous => ({ ...previous, enabled: event.target.checked }))}
              className="h-4 w-4"
            />
            Allow the AI to use Zambia market benchmark data
          </label>
          <span className="text-xs text-dark-500">Last benchmark update: {config.updatedAt}</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map(item => (
            <div key={item.category} className="rounded-lg border border-dark-700 bg-dark-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-dark-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                ZMW {item.min.toLocaleString()} – {item.max.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-dark-500">{item.sourceCount} approved source{item.sourceCount === 1 ? '' : 's'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {config.entries.map(entry => (
          <div key={entry.id} className="rounded-xl border border-dark-700 bg-dark-900/50 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <label className="flex items-center gap-2 text-sm text-dark-300 xl:w-28">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={event => updateEntry(entry.id, { enabled: event.target.checked })}
                />
                Approved
              </label>

              <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="text-xs text-dark-400">
                  Provider / source
                  <input
                    value={entry.provider}
                    onChange={event => updateEntry(entry.id, { provider: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>

                <label className="text-xs text-dark-400">
                  Category
                  <select
                    value={entry.category}
                    onChange={event => updateEntry(entry.id, { category: event.target.value as MarketPricingCategory })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{marketCategoryLabel(category)}</option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-dark-400">
                  Minimum (ZMW)
                  <input
                    type="number"
                    min="0"
                    value={entry.min}
                    onChange={event => updateEntry(entry.id, { min: Number(event.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>

                <label className="text-xs text-dark-400">
                  Maximum (ZMW)
                  <input
                    type="number"
                    min="0"
                    value={entry.max ?? ''}
                    placeholder="Open-ended"
                    onChange={event => updateEntry(entry.id, {
                      max: event.target.value === '' ? null : Number(event.target.value) || 0,
                    })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>

                <label className="text-xs text-dark-400 md:col-span-2">
                  Package label
                  <input
                    value={entry.label}
                    onChange={event => updateEntry(entry.id, { label: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>

                <label className="text-xs text-dark-400">
                  Date checked
                  <input
                    type="date"
                    value={entry.checkedAt}
                    onChange={event => updateEntry(entry.id, { checkedAt: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>

                <label className="text-xs text-dark-400">
                  Public source URL
                  <div className="mt-1 flex gap-2">
                    <input
                      type="url"
                      value={entry.sourceUrl}
                      onChange={event => updateEntry(entry.id, { sourceUrl: event.target.value })}
                      className="min-w-0 flex-1 rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                    />
                    {entry.sourceUrl && (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-dark-700 text-dark-300 hover:text-white"
                        title="Open public source"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </label>

                <label className="text-xs text-dark-400 md:col-span-2 xl:col-span-4">
                  Notes
                  <input
                    value={entry.note || ''}
                    onChange={event => updateEntry(entry.id, { note: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="rounded-lg p-2 text-dark-500 hover:bg-red-500/10 hover:text-red-400"
                title="Remove source"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-dark-600 px-4 py-3 text-sm text-dark-300 hover:border-primary-500 hover:text-primary-300"
      >
        <Plus className="h-4 w-4" /> Add Zambia pricing source
      </button>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-amber-100/80">
        {config.disclaimer}
      </div>

      {message && (
        <div className="rounded-lg border border-dark-700 bg-dark-900 px-4 py-3 text-sm text-dark-200">
          {message}
        </div>
      )}
    </div>
  )
}
