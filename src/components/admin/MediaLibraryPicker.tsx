'use client'

import { useEffect, useState } from 'react'
import { ImageIcon, Library, X } from 'lucide-react'
import { fetchMediaLibrary, type MediaAsset } from '@/lib/media-library'

/** Reuse an already uploaded image without uploading it again. */
export default function MediaLibraryPicker({ onSelect, label = 'Choose from library' }: {
  onSelect: (url: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError('')
    fetchMediaLibrary().then(setItems).catch(err => setError(err instanceof Error ? err.message : 'Library unavailable'))
      .finally(() => setLoading(false))
  }, [open])

  const visible = items.filter(item => item.kind === 'image' && `${item.name} ${item.alt}`.toLowerCase().includes(search.toLowerCase()))
  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-white hover:border-primary-500">
      <Library className="h-4 w-4" />{label}
    </button>
    {open && <div role="dialog" aria-modal="true" aria-label="Choose an image" className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-3 sm:p-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-dark-700 bg-dark-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div><h2 className="text-xl font-bold text-white">Choose an image</h2><p className="text-sm text-dark-400">Select a picture previously uploaded under Media Upload.</p></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close library" className="p-2 text-white"><X /></button>
        </div>
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by filename or description" aria-label="Search images" className="mb-4 w-full rounded-lg border border-dark-600 bg-dark-950 p-3 text-white" />
        {loading && <p className="text-dark-300">Loading images…</p>}
        {error && <p role="alert" className="text-red-300">{error}</p>}
        {!loading && !error && visible.length === 0 && <p className="flex items-center gap-2 text-dark-400"><ImageIcon className="h-5 w-5" />No matching images. Upload one in the Media Upload tab first.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map(item => <button type="button" key={item.id} onClick={() => { onSelect(item.url); setOpen(false) }} className="overflow-hidden rounded-lg border border-dark-700 bg-dark-800 text-left hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400" title={`Use ${item.name}`}>
            <img src={item.url} alt={item.alt || item.name} loading="lazy" className="aspect-video w-full object-cover" />
            <span className="block truncate p-2 text-xs text-white">{item.name}</span>
          </button>)}
        </div>
      </div>
    </div>}
  </>
}
