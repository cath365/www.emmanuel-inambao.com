'use client'

import { uploadPortfolioMedia } from '@/lib/portfolio-upload'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Award, Calendar, 
  ExternalLink, Upload
} from 'lucide-react'
import { useCertifications, Certification } from '@/lib/certifications'
import Image from 'next/image'

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

export default function CertificationEditor({ onNotify }: Props) {
  const { certifications, addCertification, updateCertification, deleteCertification } = useCertifications()
  const [editing, setEditing] = useState<Certification | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreate = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
      description: ''
    }
    setEditing(newCert)
    setIsCreating(true)
  }

  const handleSave = (cert: Certification) => {
    if (isCreating) {
      addCertification(cert)
      onNotify('success', 'Certification added!')
    } else {
      updateCertification(cert.id, cert)
      onNotify('success', 'Certification updated!')
    }
    setEditing(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteCertification(id)
    setDeleteConfirm(null)
    onNotify('success', 'Certification deleted!')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-primary-500" />
            Certifications
          </h1>
          <p className="text-dark-400 mt-1">Manage your professional certifications</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden">
            {cert.image ? (
              <div className="h-32 relative bg-dark-700">
                <Image src={cert.image} alt={cert.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-br from-primary-600/20 to-dark-800 flex items-center justify-center">
                <Award className="w-12 h-12 text-primary-500/50" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">{cert.name || 'Untitled'}</h3>
              <p className="text-primary-400 text-sm">{cert.issuer}</p>
              <p className="text-dark-500 text-xs mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {cert.issueDate}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { setEditing(cert); setIsCreating(false) }}
                  className="flex-1 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(cert.id)}
                  className="px-3 py-1.5 bg-dark-700 hover:bg-red-600/20 text-dark-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="col-span-full text-center py-12 text-dark-400">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No certifications added yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <CertificationModal
            certification={editing}
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
              <h3 className="text-lg font-semibold text-white mb-2">Delete Certification?</h3>
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

function CertificationModal({ 
  certification, 
  onSave, 
  onClose 
}: { 
  certification: Certification
  onSave: (cert: Certification) => void
  onClose: () => void 
}) {
  const [form, setForm] = useState<Certification>(certification)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'certification')
    try {
      const res = await uploadPortfolioMedia(formData)
      const data = await res.json()
      if (data.success) setForm({ ...form, image: data.url })
      else alert(data.error || 'Upload failed')
    } catch (err) { console.error('Upload error:', err); alert('Upload failed') }
    finally { setUploading(false) }
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
            {certification.name ? 'Edit Certification' : 'Add Certification'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Certificate Image</label>
            <div className="flex items-start gap-4">
              {form.image ? (
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-dark-700 relative">
                  <Image src={form.image} alt="Certificate" fill className="object-cover" />
                  <button
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-24 rounded-lg bg-dark-700 flex items-center justify-center">
                  <Award className="w-8 h-8 text-dark-500" />
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>
          </div>

          {/* Name & Issuer */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Certification Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="AWS Solutions Architect"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Issuing Organization *</label>
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Amazon Web Services"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Issue Date *</label>
              <input
                type="text"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Jan 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Expiry Date (Optional)</label>
              <input
                type="text"
                value={form.expiryDate || ''}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Jan 2027"
              />
            </div>
          </div>

          {/* Credential Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Credential ID</label>
              <input
                type="text"
                value={form.credentialId || ''}
                onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="ABC123XYZ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Verification URL</label>
              <input
                type="url"
                value={form.credentialUrl || ''}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="https://verify.example.com/..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white resize-none"
              placeholder="Brief description of the certification..."
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name || !form.issuer || !form.issueDate}
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
