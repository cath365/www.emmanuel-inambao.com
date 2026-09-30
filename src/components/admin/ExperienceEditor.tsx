'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Briefcase, MapPin, 
  Calendar, Upload, Check, Building
} from 'lucide-react'
import { useExperience, Experience } from '@/lib/experience'
import Image from 'next/image'

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

export default function ExperienceEditor({ onNotify }: Props) {
  const { experiences, addExperience, updateExperience, deleteExperience } = useExperience()
  const [editing, setEditing] = useState<Experience | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreate = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      logo: ''
    }
    setEditing(newExp)
    setIsCreating(true)
  }

  const handleSave = (exp: Experience) => {
    if (isCreating) {
      addExperience(exp)
      onNotify('success', 'Experience added!')
    } else {
      updateExperience(exp.id, exp)
      onNotify('success', 'Experience updated!')
    }
    setEditing(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteExperience(id)
    setDeleteConfirm(null)
    onNotify('success', 'Experience deleted!')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-500" />
            Work Experience
          </h1>
          <p className="text-dark-400 mt-1">Manage your professional experience</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              {exp.logo ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                  <Image src={exp.logo} alt={exp.company} width={48} height={48} className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-primary-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">{exp.position || 'Untitled'}</h3>
                <p className="text-primary-400">{exp.company}</p>
                <p className="text-dark-400 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(exp); setIsCreating(false) }}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(exp.id)}
                  className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No experience added yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <ExperienceModal
            experience={editing}
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
              <h3 className="text-lg font-semibold text-white mb-2">Delete Experience?</h3>
              <p className="text-dark-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ExperienceModal({ 
  experience, 
  onSave, 
  onClose 
}: { 
  experience: Experience
  onSave: (exp: Experience) => void
  onClose: () => void 
}) {
  const [form, setForm] = useState<Experience>(experience)
  const [uploading, setUploading] = useState(false)
  const [newAchievement, setNewAchievement] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'experience')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setForm({ ...form, logo: data.url })
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setForm({ ...form, achievements: [...form.achievements, newAchievement.trim()] })
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setForm({ ...form, achievements: form.achievements.filter((_, i) => i !== index) })
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
            {experience.id ? 'Edit Experience' : 'Add Experience'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-dark-700 overflow-hidden">
                {form.logo ? (
                  <Image src={form.logo} alt="Logo" width={64} height={64} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <Building className="w-8 h-8" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm"
              >
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>
          </div>

          {/* Position & Company */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Position *</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Tech Company"
              />
            </div>
          </div>

          {/* Location & Dates */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Start Date</label>
              <input
                type="text"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Jan 2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">End Date</label>
              <input
                type="text"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.current}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white disabled:opacity-50"
                placeholder="Dec 2023"
              />
            </div>
          </div>

          {/* Current Position */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })}
              className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500"
            />
            <span className="text-dark-300">I currently work here</span>
          </label>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white resize-none"
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Key Achievements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                className="flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white text-sm"
                placeholder="Add an achievement"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {form.achievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-2 bg-dark-900 px-3 py-2 rounded-lg">
                  <Check className="w-4 h-4 text-primary-500" />
                  <span className="flex-1 text-dark-300 text-sm">{ach}</span>
                  <button onClick={() => removeAchievement(i)} className="text-dark-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.position || !form.company}
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
