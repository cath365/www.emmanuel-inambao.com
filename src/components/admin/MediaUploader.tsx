'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ExternalLink, File, Image as ImageIcon, RefreshCw, Upload, Video, X } from 'lucide-react'
import { fetchMediaLibrary, type MediaAsset } from '@/lib/media-library'
import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { upload as uploadToBlob } from '@vercel/blob/client'

interface Props { onNotify: (type: 'success' | 'error', message: string) => void }

function kindOf(file: File): MediaAsset['kind'] {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return 'document'
}

export default function MediaUploader({ onNotify }: Props) {
  const [items, setItems] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [currentFile, setCurrentFile] = useState('')
  const [copied, setCopied] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [recoveryUrl, setRecoveryUrl] = useState('')
  const [storageStatus, setStorageStatus] = useState<{ publicMedia: string; privateSubmissions: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try { setItems(await fetchMediaLibrary()) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load the media library.') }
    finally { setLoading(false) }
  }
  useEffect(() => {
    void load()
    void fetch('/api/admin/storage-health', { credentials: 'include', cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(result => { if (result?.publicMedia && result?.privateSubmissions) setStorageStatus(result) })
      .catch(() => { /* Admin may be on an older deployment. */ })
  }, [])

  const publish = async (next: MediaAsset[]) => {
    await persistPortfolioData('mediaLibrary', next)
    setItems(next)
  }

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length || busy) return
    setBusy(true)
    let next = [...items]
    setRecoveryUrl('')
    let uploaded = 0
    try {
      // Sequential writes prevent one upload's index update overwriting another.
      for (const file of Array.from(files)) {
        setCurrentFile(file.name)
        const kind = kindOf(file)
        const limit = kind === 'video' ? 100 : kind === 'document' ? 50 : 10
        if (!file.size || file.size > limit * 1024 * 1024) {
          throw new Error(`${file.name}: file must be smaller than ${limit}MB.`)
        }
        if (kind === 'image' && !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type)) {
          throw new Error(`${file.name}: please choose a JPG, PNG, WebP, GIF or AVIF picture.`)
        }
        let uploadedUrl = ''
        if (kind === 'image') {
          // Direct browser-to-Blob uploads bypass the host's ~4.5MB function-body limit.
          // A server route checks the signed admin session before issuing a token.
          try {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100)
            const result = await uploadToBlob(`portfolio/images/${crypto.randomUUID()}-${safeName}`, file, {
              access: 'public', handleUploadUrl: '/api/upload/blob',
            })
            uploadedUrl = result.url
          } catch (error) {
            throw new Error(`${file.name}: ${error instanceof Error ? error.message : 'Public Blob upload failed.'}`)
          }
        } else {
          const form = new FormData()
          form.append('file', file)
          form.append('type', kind === 'document' ? 'resource' : kind)
          const response = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' })
          const body = await response.json().catch(() => ({}))
          if (!response.ok || !body.success || !body.url) throw new Error(`${file.name}: ${body.error || 'upload failed'}`)
          uploadedUrl = body.url
        }
        const asset: MediaAsset = {
          id: crypto.randomUUID(), name: file.name, url: uploadedUrl, kind,
          mimeType: file.type, size: file.size, alt: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
          createdAt: new Date().toISOString(),
        }
        // Never publish a stale index if the latest library cannot be read.
        // Keep the uploaded URL recoverable if indexing fails after a successful upload.
        try {
          const latest = await fetchMediaLibrary()
          next = [asset, ...latest.filter(item => item.url !== asset.url)]
          await publish(next)
        } catch {
          setRecoveryUrl(uploadedUrl)
          throw new Error(`${file.name} uploaded successfully but its library record could not be saved. Keep the recovery URL below and retry when publishing is available.`)
        }
        uploaded++
      }
      onNotify('success', `${uploaded} file${uploaded === 1 ? '' : 's'} uploaded and saved to the media library.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
      onNotify('error', err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      setCurrentFile('')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const updateItem = async (id: string, alt: string) => {
    try { await publish(items.map(item => item.id === id ? { ...item, alt } : item)); onNotify('success', 'Image description saved.') }
    catch (err) { onNotify('error', err instanceof Error ? err.message : 'Could not save image description.') }
  }

  const removeItem = async (item: MediaAsset) => {
    if (!window.confirm(`Remove “${item.name}” from the media library? This does not delete the original cloud file or remove it from pages where it is used.`)) return
    try { await publish(items.filter(other => other.id !== item.id)); onNotify('success', 'Removed from the library index (original file preserved).') }
    catch (err) { onNotify('error', err instanceof Error ? err.message : 'Could not update the library.') }
  }

  const copyUrl = async (item: MediaAsset) => {
    try { await navigator.clipboard.writeText(item.url); setCopied(item.id); onNotify('success', 'Media URL copied.') }
    catch { onNotify('error', 'Copy failed. Open the file and copy its URL instead.') }
  }

  const visible = items.filter(item => `${item.name} ${item.alt} ${item.kind}`.toLowerCase().includes(search.toLowerCase()))

  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="flex items-center gap-2 text-2xl font-bold text-white"><Upload className="h-6 w-6 text-primary-500" />Media Library</h1>
        <p className="mt-1 text-sm text-dark-400">Upload pictures, videos, audio and documents. Files stay in your cloud storage; this list is saved to public portfolio data.</p></div>
      <button type="button" onClick={() => void load()} disabled={busy || loading} className="btn-secondary inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh</button>
    </div>
    <label className={`block cursor-pointer rounded-xl border-2 border-dashed border-primary-500/50 bg-dark-900 p-8 text-center hover:border-primary-400 ${busy ? 'pointer-events-none opacity-60' : ''}`}>
      <div className="mb-2 flex justify-center gap-4 text-primary-400"><ImageIcon /><Video /><File /></div>
      <span className="font-medium text-white">{busy ? `Uploading and publishing: ${currentFile}` : 'Choose images or other files (multiple files supported)'}</span>
      <p className="mt-2 text-xs text-dark-400">Images JPG, PNG, WebP, GIF, AVIF • Videos MP4/WebM/MOV • documents PDF/DOCX • Max 10MB image; other files require Cloudinary and may be limited by host request size.</p>
      <input ref={inputRef} type="file" multiple disabled={busy} className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={e => void uploadFiles(e.target.files)} />
    </label>
    {storageStatus && <p className="rounded-lg border border-dark-700 p-3 text-sm text-dark-300" aria-live="polite">Public image storage: <strong className={storageStatus.publicMedia === 'connected' ? 'text-green-400' : 'text-amber-300'}>{storageStatus.publicMedia}</strong> · Private enquiry storage: <strong className={storageStatus.privateSubmissions === 'connected' ? 'text-green-400' : 'text-amber-300'}>{storageStatus.privateSubmissions}</strong>. These stores must remain separate.</p>}
    {error && <div role="alert" className="rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-200">{error}</div>}
    {recoveryUrl && <div className="rounded-lg border border-amber-700 p-3 text-sm text-amber-200"><p>Upload completed; library publishing failed. Save this image URL so you can attach it later:</p><input aria-label="Recovery image URL" className="mt-2 w-full rounded bg-dark-950 p-2 text-xs" readOnly value={recoveryUrl} onFocus={event => event.currentTarget.select()} /></div>}
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-white">Saved files ({items.length})</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved media" aria-label="Search saved media" className="rounded-lg border border-dark-700 bg-dark-900 p-2 text-white" /></div>
    {loading && <p className="text-dark-300">Loading saved media…</p>}
    {!loading && !error && !visible.length && <p className="text-dark-400">No files yet. Upload one above to start your library.</p>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(item => <article key={item.id} className="min-w-0 overflow-hidden rounded-xl border border-dark-700 bg-dark-800/50">
        <div className="relative flex aspect-video items-center justify-center bg-dark-950">
          {item.kind === 'image' ? <img src={item.url} alt={item.alt || item.name} loading="lazy" className="h-full w-full object-contain" />
            : item.kind === 'video' ? <video src={item.url} controls preload="metadata" className="h-full w-full" />
            : <File className="h-12 w-12 text-dark-500" />}
          <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-xs capitalize text-white">{item.kind}</span>
        </div>
        <div className="space-y-3 p-4">
          <p className="truncate font-semibold text-white" title={item.name}>{item.name}</p>
          <p className="text-xs text-dark-400">{(item.size / 1024 / 1024).toFixed(2)} MB · {new Date(item.createdAt).toLocaleDateString()}</p>
          {item.kind === 'image' && <label className="block text-xs text-dark-300">Image description (alt text)
            <input key={`${item.id}-${item.alt}`} defaultValue={item.alt} onBlur={e => { if (e.target.value !== item.alt) void updateItem(item.id, e.target.value) }} className="mt-1 w-full rounded border border-dark-600 bg-dark-950 p-2 text-sm text-white" />
          </label>}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void copyUrl(item)} className="flex flex-1 items-center justify-center gap-2 rounded bg-dark-700 p-2 text-xs text-white hover:bg-dark-600">{copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === item.id ? 'Copied' : 'Copy URL'}</button>
            <a href={item.url} rel="noopener noreferrer" target="_blank" title="Open original file" className="rounded bg-dark-700 p-2 text-white"><ExternalLink className="h-4 w-4" /></a>
            <button type="button" onClick={() => void removeItem(item)} title="Remove library entry only" aria-label={`Remove ${item.name} from library`} className="rounded bg-dark-700 p-2 text-red-300 hover:bg-red-950"><X className="h-4 w-4" /></button>
          </div>
        </div>
      </article>)}
    </div>
    <p className="text-xs text-dark-500">For security, removing an entry does not delete the cloud asset or break pages using its URL. Uploaded media is public; never upload private client data here.</p>
  </section>
}
