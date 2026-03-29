'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Quote, Star, 
  Upload, Play, Video, User
} from 'lucide-react'
import { useTestimonials, Testimonial } from '@/lib/testimonials'
import Image from 'next/image'

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

export default function TestimonialEditor({ onNotify }: Props) {
  const { testimonials, pendingTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial, rejectTestimonial } = useTestimonials()
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreate = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      position: '',
      company: '',
      content: '',
      image: '',
      video: '',
      rating: 5,
      featured: false,
      status: 'approved',
    }
    setEditing(newTestimonial)
    setIsCreating(true)
  }

  const handleApprove = (id: string) => {
    approveTestimonial(id)
    onNotify('success', 'Testimonial approved and now visible!')
  }

  const handleReject = (id: string) => {
    rejectTestimonial(id)
    onNotify('success', 'Testimonial rejected')
  }

  const handleSave = (t: Testimonial) => {
    // Ensure status is set
    const withStatus = { ...t, status: t.status || ('approved' as const) }
    if (isCreating) {
      addTestimonial(withStatus)
      onNotify('success', 'Testimonial added!')
    } else {
      updateTestimonial(t.id, withStatus)
      onNotify('success', 'Testimonial updated!')
    }
    setEditing(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteTestimonial(id)
    setDeleteConfirm(null)
    onNotify('success', 'Testimonial deleted!')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Quote className="w-6 h-6 text-primary-500" />
            Testimonials
          </h1>
          <p className="text-dark-400 mt-1">Manage client testimonials and video reviews</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Pending Testimonials (from public submissions) */}
      {pendingTestimonials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Pending Review ({pendingTestimonials.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pendingTestimonials.map((t) => (
              <div key={t.id} className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  {t.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-700 flex-shrink-0">
                      <Image src={t.image} alt={t.name} width={48} height={48} className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{t.name}</h3>
                    <p className="text-dark-400 text-sm">{t.position} at {t.company}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-dark-600'}`} />
                      ))}
                    </div>
                    {t.video && (
                      <a href={t.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary-400 hover:text-primary-300">
                        <Play className="w-3 h-3" /> Watch Video
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-dark-300 text-sm">{t.content}</p>
                {t.submittedAt && (
                  <p className="text-dark-500 text-xs mt-2">Submitted: {new Date(t.submittedAt).toLocaleDateString()}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleApprove(t.id)}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Approve
                  </button>
                  <button onClick={() => handleReject(t.id)}
                    className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-lg text-sm font-medium transition-colors">
                    Reject
                  </button>
                  <button onClick={() => { setEditing({...t}); setIsCreating(false) }}
                    className="py-2 px-3 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-lg text-sm transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Testimonials List */}
      <h2 className="text-lg font-semibold text-white mb-4">All Testimonials ({testimonials.filter(t => t.status !== 'pending').length})</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.filter(t => t.status !== 'pending').map((t) => (
          <div key={t.id} className={`bg-dark-800/50 border rounded-xl p-6 ${t.status === 'rejected' ? 'border-red-500/20 opacity-60' : 'border-dark-700'}`}>
            <div className="flex items-start gap-4">
              {t.image ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-700 flex-shrink-0">
                  <Image src={t.image} alt={t.name} width={48} height={48} className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white">{t.name || 'Unnamed'}</h3>
                  {t.video && <Video className="w-4 h-4 text-primary-400" />}
                  {t.featured && (
                    <span className="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded">Featured</span>
                  )}
                  {t.status === 'rejected' && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Rejected</span>
                  )}
                  {t.status === 'approved' && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Live</span>
                  )}
                </div>
                <p className="text-dark-400 text-sm">{t.position} at {t.company}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-dark-600'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditing(t); setIsCreating(false) }}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(t.id)}
                  className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-dark-300 text-sm line-clamp-2">{t.content}</p>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-2 text-center py-12 text-dark-400">
            <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No testimonials added yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <TestimonialModal
            testimonial={editing}
            onSave={handleSave}
            onClose={() => { setEditing(null); setIsCreating(false) }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Delete Testimonial?</h3>
              <p className="text-dark-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TestimonialModal({ 
  testimonial, 
  onSave, 
  onClose 
}: { 
  testimonial: Testimonial
  onSave: (t: Testimonial) => void
  onClose: () => void 
}) {
  const [form, setForm] = useState<Testimonial>(testimonial)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'testimonial')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
      const data = await res.json()
      if (data.success) setForm({ ...form, image: data.url })
      else alert(data.error || 'Image upload failed')
    } catch (err) { console.error('Image upload error:', err); alert('Image upload failed') }
    finally { setUploadingImage(false) }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'testimonial-video')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
      const data = await res.json()
      if (data.success) setForm({ ...form, video: data.url })
      else alert(data.error || 'Video upload failed')
    } catch (err) { 
      console.error('Video upload error:', err)
      alert('Video upload failed')
    }
    finally { setUploadingVideo(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-2xl my-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">
            {testimonial.name ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image & Video Upload */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Photo</label>
              <div className="flex flex-col items-center gap-3 p-4 bg-dark-900 rounded-lg border border-dark-700">
                {form.image ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image src={form.image} alt="Photo" width={80} height={80} className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center">
                    <User className="w-10 h-10 text-dark-500" />
                  </div>
                )}
                <button
                  onClick={() => imageRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                </button>
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Video Testimonial (Optional)</label>
              <div className="flex flex-col items-center gap-3 p-4 bg-dark-900 rounded-lg border border-dark-700">
                {form.video ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-dark-700 relative">
                    <video src={form.video} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <button
                      onClick={() => setForm({ ...form, video: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-600 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg bg-dark-700 flex flex-col items-center justify-center">
                    <Video className="w-10 h-10 text-dark-500 mb-2" />
                    <p className="text-dark-500 text-xs">MP4, WebM, MOV (max 100MB)</p>
                  </div>
                )}
                <button
                  onClick={() => videoRef.current?.click()}
                  disabled={uploadingVideo}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  {uploadingVideo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </>
                  )}
                </button>
                <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
              </div>
            </div>
          </div>

          {/* Name, Position, Company */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="CEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Tech Corp"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Testimonial Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white resize-none"
              placeholder="What they said about your work..."
            />
          </div>

          {/* Rating & Featured */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="p-1"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-dark-600'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500"
              />
              <span className="text-dark-300">Featured testimonial</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name || !form.content}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
