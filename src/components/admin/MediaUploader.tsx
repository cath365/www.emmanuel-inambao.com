'use client'

import { useEffect, useState, useRef } from 'react'
import { upload as uploadToBlob } from '@vercel/blob/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Video, Image as ImageIcon, File, Trash2, 
  Copy, Check, ExternalLink, Play
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: string
  uploadedAt: Date
}

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

export default function MediaUploader({ onNotify }: Props) {
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [storageError, setStorageError] = useState('')
  useEffect(() => {
    let active = true
    fetch('/api/portfolio-data?key=mediaLibrary', { cache: 'no-store', credentials: 'include' })
      .then(async response => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error || 'Media library unavailable.')
        if (active && Array.isArray(data)) setUploads(data.filter((x: UploadedFile) => x && typeof x.url === 'string' && /^https:\/\//.test(x.url)))
      })
      .catch(error => { if (active) setStorageError(error instanceof Error ? error.message : 'Could not load media.') })
    return () => { active = false }
  }, [])
  const saveLibrary = async (next: UploadedFile[]) => {
    const res = await fetch('/api/portfolio-data', {
      method: 'POST', credentials: 'include', cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'mediaLibrary', data: next }),
    })
    const result = await res.json().catch(() => null)
    if (!res.ok || result?.success !== true) throw new Error(result?.error || 'Media index could not be saved.')
    setUploads(next)
    setStorageError('')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    return 'document'
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length || uploading) return
    setUploading(true)
    setUploadProgress(0)
    let next = [...uploads]
    let count = 0
    try {
      for (const file of files) {
        const image = file.type.startsWith('image/')
        if (!file.size || image && (file.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type))) {
          throw new Error(file.name + ': unsupported image type or file exceeds 10 MB.')
        }
        let url: string
        if (image) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100)
          const upload = await uploadToBlob('portfolio/images/' + crypto.randomUUID() + '-' + safeName, file, {
            access: 'public', handleUploadUrl: '/api/upload/blob',
          })
          url = upload.url
        } else {
          const formData = new FormData()
          formData.append('file', file)
          const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'resource'
          formData.append('type', type)
          const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
          const result = await res.json().catch(() => null)
          if (!res.ok || result?.success !== true || typeof result.url !== 'string') throw new Error(result?.error || 'Upload failed.')
          url = result.url
        }
        next = [{ id: crypto.randomUUID(), name: file.name, url, type: getFileType(file.type), size: formatFileSize(file.size), uploadedAt: new Date() }, ...next]
        // Save after every successful upload to avoid a partial batch disappearing on error.
        await saveLibrary(next)
        count++
        setUploadProgress(Math.round(count / files.length * 100))
      }
      onNotify('success', count + ' file(s) uploaded and saved to the public media library.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Media upload failed.'
      setStorageError(message)
      onNotify('error', message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    onNotify('success', 'URL copied to clipboard!')
  }

  const removeUpload = async (id: string) => {
    if (!window.confirm('Remove this entry from the media library? Published files will remain available.')) return
    try {
      await saveLibrary(uploads.filter(u => u.id !== id))
      onNotify('success', 'Media entry removed; existing published links remain valid.')
    } catch (error) { onNotify('error', error instanceof Error ? error.message : 'Removal failed.') }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary-500" />
            Media Upload
          </h1>
          <p className="text-dark-400 mt-1">Upload multiple images and files, then reuse their URLs across the portfolio.</p>
        </div>
      </div>

      {storageError && <p role="alert" className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{storageError}</p>}
      {/* Upload Zone */}
      <div className="mb-8">
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            uploading 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-700 hover:border-primary-500 hover:bg-dark-800/50'
          }`}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white">Uploading... {uploadProgress}%</p>
              <div className="w-full max-w-xs mx-auto h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-400" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <File className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-white text-lg mb-2">
                Select one or more files
              </p>
              <p className="text-dark-400 text-sm">
                Images (JPG, PNG, WebP, GIF) • Videos (MP4, WebM, MOV) • Documents (PDF, DOC)
              </p>
              <p className="text-dark-500 text-xs mt-2">
                Images up to 10 MB. Videos and documents use the existing Cloudinary route and hosting limits.
              </p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/*,audio/*,application/pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Recent Uploads */}
      {uploads.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Uploads</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-video bg-dark-900 relative">
                  {upload.type === 'image' && (
                    <img 
                      src={upload.url} 
                      alt={upload.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {upload.type === 'video' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <video src={upload.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="w-12 h-12 text-white" fill="white" />
                      </div>
                    </div>
                  )}
                  {upload.type === 'document' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="w-16 h-16 text-dark-500" />
                    </div>
                  )}
                  
                  {/* Type badge */}
                  <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                    upload.type === 'image' ? 'bg-blue-500/80 text-white' :
                    upload.type === 'video' ? 'bg-purple-500/80 text-white' :
                    'bg-green-500/80 text-white'
                  }`}>
                    {upload.type}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-white font-medium truncate" title={upload.name}>
                    {upload.name}
                  </p>
                  <p className="text-dark-400 text-sm">{upload.size}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => copyToClipboard(upload.url, upload.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm"
                    >
                      {copiedId === upload.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy URL
                        </>
                      )}
                    </button>
                    <a
                      href={upload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => removeUpload(upload.id)}
                      className="p-2 bg-dark-700 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-dark-800/30 border border-dark-700 rounded-xl">
        <h3 className="text-white font-medium mb-2">Media library notes</h3>
        <ul className="text-dark-400 text-sm space-y-1">
          <li>• Copy the URL after uploading to use in your content</li>
          <li>• Public images are stored in Vercel Blob; other files use the existing upload provider.</li>
          <li>• Removing an entry from this list does not delete the original asset or break published pages.</li>
          <li>• Reloading this page restores published media entries from the same public data API.</li>
        </ul>
      </div>
    </div>
  )
}
