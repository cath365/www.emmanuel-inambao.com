'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Video, Image as ImageIcon, File, Trash2, 
  Copy, Check, ExternalLink, Play
} from 'lucide-react'
import { uploadAdminFile } from '@/lib/admin-upload'
import { useGallery } from '@/lib/gallery'

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

// "IMG_2041-final.jpg" -> "IMG 2041 final"; editable later in the Gallery tab.
function titleFromFileName(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Untitled'
}

export default function MediaUploader({ onNotify }: Props) {
  const { addItem } = useGallery()
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [addToGallery, setAddToGallery] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const uploadOne = async (file: File) => {
    // Determine upload type based on file
    let uploadType = 'image'
    if (file.type.startsWith('video/')) {
      uploadType = 'video'
    } else if (file.type.startsWith('audio/')) {
      uploadType = 'audio'
    } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('spreadsheet') || file.type.includes('presentation') || file.type.includes('zip')) {
      uploadType = 'resource'
    }

    const data = await uploadAdminFile(file, uploadType)
    if (!data.success) throw new Error(`${file.name}: ${data.error}`)

    const type = getFileType(file.type)
    setUploads(prev => [{
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      url: data.url,
      type,
      size: formatFileSize(file.size),
      uploadedAt: new Date()
    }, ...prev])

    // Media uploads are otherwise just hosted files; this is what makes them appear on the homepage.
    if (addToGallery && (type === 'image' || type === 'video')) {
      addItem({ title: titleFromFileName(file.name), description: '', url: data.url, type, category: 'other', featured: false })
      return true
    }
    return false
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    let uploaded = 0
    let published = 0
    const errors: string[] = []
    try {
      // One at a time keeps each request small and the gallery order predictable.
      for (const file of files) {
        try {
          if (await uploadOne(file)) published++
          uploaded++
        } catch (err) {
          console.error('Upload error:', err)
          errors.push(err instanceof Error ? err.message : file.name)
        }
      }

      setUploadProgress(100)
      if (uploaded > 0) {
        onNotify('success', published > 0
          ? `${uploaded} file${uploaded === 1 ? '' : 's'} uploaded — ${published} added to the homepage Gallery. Edit titles in the Gallery tab.`
          : `${uploaded} file${uploaded === 1 ? '' : 's'} uploaded.`)
      }
      if (errors.length > 0) onNotify('error', `Upload failed for ${errors.join('; ')}`)
    } finally {
      clearInterval(progressInterval)
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

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary-500" />
            Media Upload
          </h1>
          <p className="text-dark-400 mt-1">Upload images, videos, and documents</p>
        </div>
      </div>

      <label className="mb-4 flex items-center gap-3 text-sm text-dark-300 cursor-pointer">
        <input
          type="checkbox"
          checked={addToGallery}
          onChange={e => setAddToGallery(e.target.checked)}
          className="h-4 w-4 accent-primary-500"
        />
        Show uploaded photos and videos on the homepage Gallery
      </label>

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
                Click to upload or drag and drop
              </p>
              <p className="text-dark-400 text-sm">
                Images (JPG, PNG, WebP, GIF) • Videos (MP4, WebM, MOV) • Documents (PDF, DOC)
              </p>
              <p className="text-dark-500 text-xs mt-2">
                You can select several files at once · large photos are resized automatically · videos up to 100MB
              </p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,application/pdf,.doc,.docx"
          multiple
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
        <h3 className="text-white font-medium mb-2">💡 Tips</h3>
        <ul className="text-dark-400 text-sm space-y-1">
          <li>• Copy the URL after uploading to use in your content</li>
          <li>• Videos are automatically optimized for web playback</li>
          <li>• Images are resized to max 1200x1200 for better performance</li>
          <li>• All uploads are stored securely on Cloudinary</li>
        </ul>
      </div>
    </div>
  )
}
