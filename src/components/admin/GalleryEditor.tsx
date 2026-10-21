'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon, 
  Video, Star, ExternalLink, Check, AlertCircle, Play
} from 'lucide-react'
import { useGallery, GalleryItem } from '@/lib/gallery'
import { useProjects } from '@/lib/projects'
import Image from 'next/image'

const categoryColors = {
  project: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  workshop: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  prototype: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

export default function GalleryEditor() {
  const { items, addItem, updateItem, deleteItem } = useGallery()
  const { projects } = useProjects()
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | GalleryItem['category']>('all')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter)

  // Upload media through the portfolio upload API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingItem) return

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      showNotification('error', 'Please select an image or video file')
      return
    }

    // Validate file size (100MB for videos, 10MB for images)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      showNotification('error', `File must be less than ${isVideo ? '100MB' : '10MB'}`)
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', isVideo ? 'video' : 'image')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      
      setEditingItem({
        ...editingItem,
        url: data.url,
        type: isVideo ? 'video' : 'image',
      })
      
      showNotification('success', 'File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCreateNew = () => {
    const newItem: GalleryItem = {
      id: '',
      title: '',
      description: '',
      url: '',
      type: 'image',
      category: 'project',
      featured: false,
      projectId: '',
      createdAt: '',
    }
    setEditingItem(newItem)
    setIsCreating(true)
  }

  const handleSave = async () => {
    if (!editingItem || saving) return

    if (!editingItem.title || !editingItem.url) {
      showNotification('error', 'Please fill in title and upload a file')
      return
    }

    setSaving(true)
    try {
      if (isCreating) {
        await addItem({
          title: editingItem.title,
          description: editingItem.description,
          url: editingItem.url,
          type: editingItem.type,
          category: editingItem.category,
          featured: editingItem.featured,
          projectId: editingItem.projectId || undefined,
        })
        showNotification('success', 'Media saved and verified in portfolio storage.')
      } else {
        await updateItem(editingItem.id, editingItem)
        showNotification('success', 'Media changes saved and verified in portfolio storage.')
      }

      setEditingItem(null)
      setIsCreating(false)
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Media could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
      setDeleteConfirm(null)
      showNotification('success', 'Media deleted and verified in portfolio storage.')
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Media could not be deleted.')
    }
  }

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      await updateItem(item.id, { featured: !item.featured })
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Featured status could not be saved.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white`}
          >
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-500" />
            Gallery & Media
          </h2>
          <p className="text-dark-400 mt-1">Manage your portfolio gallery - images and videos</p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Media
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'project', 'prototype', 'workshop', 'event', 'other'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden group"
          >
            {/* Media Preview */}
            <div className="relative aspect-video bg-dark-700">
              {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
              
              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </div>
              )}

              {/* Type badge */}
              <div className="absolute top-2 right-2">
                {item.type === 'video' ? (
                  <Video className="w-5 h-5 text-white drop-shadow-lg" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-white drop-shadow-lg" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[item.category]}`}>
                  {item.category}
                </span>
              </div>
              <h4 className="text-white font-medium truncate">{item.title}</h4>
              <p className="text-dark-400 text-sm line-clamp-2 mt-1">{item.description}</p>
              {item.projectId && (
                <p className="mt-2 text-xs font-medium text-primary-400">
                  Linked to: {projects.find(project => project.id === item.projectId)?.title || item.projectId}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-700">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`p-2 rounded transition-colors ${
                    item.featured 
                      ? 'text-yellow-500 hover:text-yellow-400' 
                      : 'text-dark-400 hover:text-yellow-500'
                  }`}
                  title={item.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className="w-4 h-4" fill={item.featured ? 'currentColor' : 'none'} />
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    setEditingItem(item)
                    setIsCreating(false)
                  }}
                  className="p-2 text-dark-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="p-2 text-dark-400 hover:text-red-400 transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Delete confirmation */}
              <AnimatePresence>
                {deleteConfirm === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-dark-700"
                  >
                    <p className="text-dark-300 text-sm mb-3">Delete this item?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 bg-dark-700 text-white rounded-lg hover:bg-dark-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-dark-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No gallery items yet. Click &quot;Add Media&quot; to upload.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (saving) return
              setEditingItem(null)
              setIsCreating(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isCreating ? 'Add New Media' : 'Edit Media'}
                </h3>
                <button
                  onClick={() => {
                    if (saving) return
                    setEditingItem(null)
                    setIsCreating(false)
                  }}
                  disabled={saving}
                  className="text-dark-400 hover:text-white disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Image or Video *</label>
                  {editingItem.url ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video bg-dark-700 rounded-lg overflow-hidden">
                        {editingItem.type === 'video' ? (
                          <video src={editingItem.url} className="w-full h-full object-cover" controls />
                        ) : (
                          <Image src={editingItem.url} alt="Preview" fill className="object-cover" />
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Replace File'}
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      <Upload className="w-10 h-10 text-dark-500 mx-auto mb-2" />
                      <p className="text-dark-400 text-sm">
                        {uploading ? 'Uploading...' : 'Click to upload image or video'}
                      </p>
                      <p className="text-dark-500 text-xs mt-1">Images up to 10MB, Videos up to 100MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      category: e.target.value as GalleryItem['category']
                    })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="project">Project</option>
                    <option value="prototype">Prototype</option>
                    <option value="workshop">Workshop</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm mb-2">Related Project (optional)</label>
                  <select
                    value={editingItem.projectId || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      projectId: e.target.value || undefined,
                    })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Not linked to a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-dark-500">
                    Linking media lets the portfolio surface it as evidence for that project.
                  </p>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="text-dark-300 text-sm">
                    Feature this item (shows prominently in gallery)
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!editingItem.title || !editingItem.url || uploading || saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Publishing…' : isCreating ? 'Add to Gallery' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    if (saving) return
                    setEditingItem(null)
                    setIsCreating(false)
                  }}
                  disabled={saving}
                  className="btn-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
