'use client'

import { useState } from 'react'
import { Image as ImageIcon, X, RefreshCw } from 'lucide-react'

interface MediaItem { id: string; name: string; url: string; type?: string; kind?: string }
export default function MediaLibraryPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = async () => {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/portfolio-data?key=mediaLibrary', { cache: 'no-store', credentials: 'include' })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Could not read the image library.')
      setItems(Array.isArray(data) ? data.filter((item: MediaItem) => item && (item.type === 'image' || item.kind === 'image') && /^https:\/\//.test(item.url)) : [])
    } catch (e) { setError(e instanceof Error ? e.message : 'Media library unavailable') }
    finally { setBusy(false) }
  }
  return <>
    <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-200 hover:border-primary-500" onClick={() => { setOpen(true); void load() }}>
      <ImageIcon className="h-4 w-4" /> Choose from Media Library
    </button>
    {open && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label="Select an uploaded image">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-dark-700 bg-dark-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Select an uploaded image</h2>
          <div className="flex gap-3">
            <button type="button" onClick={() => void load()} disabled={busy} aria-label="Reload images" className="p-2 text-dark-200"><RefreshCw className="h-5 w-5" /></button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close image picker" className="p-2 text-dark-200"><X className="h-5 w-5" /></button>
          </div>
        </div>
        {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
        {busy && <p className="text-sm text-dark-300">Loading…</p>}
        {!busy && !error && items.length === 0 && <p className="text-dark-300">No images found. Upload them in Admin → Media first.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map(item => <button type="button" key={item.id} title={item.name} className="overflow-hidden rounded-lg border border-dark-700 text-left hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={() => { onSelect(item.url); setOpen(false) }}>
            <img src={item.url} alt={item.name} loading="lazy" className="aspect-video w-full object-cover" />
            <span className="block truncate px-2 py-2 text-xs text-dark-200">{item.name}</span>
          </button>)}
        </div>
      </div>
    </div>}
  </>
}
