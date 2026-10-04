'use client'

import { uploadPortfolioMedia } from '@/lib/portfolio-upload'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Settings, CheckCircle2, Upload,
  Cpu, Code, Smartphone, Globe, Zap, Database, Cloud, Shield, Wifi, Monitor, Wrench
} from 'lucide-react'
import { useServices, Service } from '@/lib/services'
import Image from 'next/image'

const iconOptions = [
  { value: 'cpu', label: 'CPU/Hardware', icon: Cpu },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'smartphone', label: 'Mobile', icon: Smartphone },
  { value: 'globe', label: 'Web', icon: Globe },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'zap', label: 'Power/Fast', icon: Zap },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'shield', label: 'Security', icon: Shield },
  { value: 'wifi', label: 'IoT/Wireless', icon: Wifi },
  { value: 'monitor', label: 'Display', icon: Monitor },
  { value: 'wrench', label: 'Maintenance', icon: Wrench },
]

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

export default function ServiceEditor({ onNotify }: Props) {
  const { services, addService, updateService, deleteService } = useServices()
  const [editing, setEditing] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreate = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: 'settings',
      features: [],
      price: '',
      image: '',
      featured: false
    }
    setEditing(newService)
    setIsCreating(true)
  }

  const handleSave = (service: Service) => {
    if (isCreating) {
      addService(service)
      onNotify('success', 'Service added!')
    } else {
      updateService(service.id, service)
      onNotify('success', 'Service updated!')
    }
    setEditing(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteService(id)
    setDeleteConfirm(null)
    onNotify('success', 'Service deleted!')
  }

  const getIcon = (iconName: string) => {
    const found = iconOptions.find(i => i.value === iconName)
    return found ? found.icon : Settings
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-500" />
            Services
          </h1>
          <p className="text-dark-400 mt-1">Manage the services you offer</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const IconComponent = getIcon(service.icon)
          return (
            <div key={service.id} className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">{service.title || 'Untitled'}</h3>
                    {service.featured && (
                      <span className="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded">Featured</span>
                    )}
                  </div>
                  {service.price && <p className="text-primary-400 text-sm">{service.price}</p>}
                  <p className="text-dark-400 text-sm mt-1 line-clamp-2">{service.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setEditing(service); setIsCreating(false) }}
                  className="flex-1 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(service.id)}
                  className="px-3 py-1.5 bg-dark-700 hover:bg-red-600/20 text-dark-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}

        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-dark-400">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No services added yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <ServiceModal
            service={editing}
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
              <h3 className="text-lg font-semibold text-white mb-2">Delete Service?</h3>
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

function ServiceModal({ 
  service, 
  onSave, 
  onClose 
}: { 
  service: Service
  onSave: (s: Service) => void
  onClose: () => void 
}) {
  const [form, setForm] = useState<Service>(service)
  const [uploading, setUploading] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'service')
    try {
      const res = await uploadPortfolioMedia(formData)
      const data = await res.json()
      if (data.success) setForm({ ...form, image: data.url })
      else alert(data.error || 'Upload failed')
    } catch (err) { console.error('Upload error:', err); alert('Upload failed') }
    finally { setUploading(false) }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm({ ...form, features: [...form.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) })
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
            {service.title ? 'Edit Service' : 'Add Service'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Service Image (Optional)</label>
            <div className="flex items-start gap-4">
              {form.image ? (
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-dark-700 relative">
                  <Image src={form.image} alt="Service" fill className="object-cover" />
                  <button
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-24 rounded-lg bg-dark-700 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-dark-500" />
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

          {/* Title & Price */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Service Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="IoT System Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Price (Optional)</label>
              <input
                type="text"
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="From $500 or Contact for Quote"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, icon: opt.value })}
                    className={`p-3 rounded-lg border transition-colors ${
                      form.icon === opt.value
                        ? 'border-primary-500 bg-primary-600/20'
                        : 'border-dark-700 bg-dark-900 hover:border-dark-600'
                    }`}
                    title={opt.label}
                  >
                    <Icon className={`w-5 h-5 mx-auto ${form.icon === opt.value ? 'text-primary-500' : 'text-dark-400'}`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white resize-none"
              placeholder="Describe what this service includes..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Features / What&apos;s Included</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                className="flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white text-sm"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 bg-dark-900 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-primary-500" />
                  <span className="flex-1 text-dark-300 text-sm">{feature}</span>
                  <button onClick={() => removeFeature(i)} className="text-dark-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500"
            />
            <span className="text-dark-300">Featured service (shows prominently)</span>
          </label>
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.title || !form.description}
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
