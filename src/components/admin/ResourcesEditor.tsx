'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Save, X, Upload, FileText, 
  Music, Download, ExternalLink, Check, AlertCircle 
} from 'lucide-react'
import { useResources, Resource } from '@/lib/resources'
import Image from 'next/image'

const typeIcons: Record<string, string> = {
  pdf: '📄',
  template: '📦',
  guide: '📘',
  checklist: '✅',
  video: '🎥',
  audio: '🎵',
  code: '💻',
  design: '🎨',
  spreadsheet: '📊',
  presentation: '📽️',
  archive: '📁',
  other: '📎',
}

const typeColors: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  template: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  guide: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  checklist: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  video: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  audio: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  code: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  design: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  spreadsheet: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  presentation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  archive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
}

export default function ResourcesEditor() {
  const { resources, addResource, updateResource, deleteResource, audioIntroUrl, setAudioIntroUrl } = useResources()
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [uploadingResource, setUploadingResource] = useState(false)
  
  const audioInputRef = useRef<HTMLInputElement>(null)
  const resourceInputRef = useRef<HTMLInputElement>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Upload audio to Cloudinary
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      showNotification('error', 'Please select an audio file (MP3, WAV, etc.)')
      return
    }

    // Validate file size (max 10MB for audio)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'Audio file must be less than 10MB')
      return
    }

    setUploadingAudio(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'audio')

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
      setAudioIntroUrl(data.url)
      showNotification('success', 'Audio introduction uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload audio. Please try again.')
    } finally {
      setUploadingAudio(false)
    }
  }

  // Upload resource file to Cloudinary
  const handleResourceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingResource) return

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showNotification('error', 'File must be less than 50MB')
      return
    }

    setUploadingResource(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'resource')

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
      
      // Format file size
      const fileSizeKB = file.size / 1024
      const fileSize = fileSizeKB > 1024 
        ? `${(fileSizeKB / 1024).toFixed(1)} MB` 
        : `${Math.round(fileSizeKB)} KB`

      setEditingResource({
        ...editingResource,
        fileUrl: data.url,
        fileSize: fileSize,
      })
      
      showNotification('success', 'File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload file. Please try again.')
    } finally {
      setUploadingResource(false)
    }
  }

  const handleCreateNew = () => {
    const newResource: Resource = {
      id: '',
      title: '',
      description: '',
      type: 'pdf',
      fileUrl: '',
      fileSize: '',
      downloads: 0,
      icon: '📄',
      createdAt: '',
    }
    setEditingResource(newResource)
    setIsCreating(true)
  }

  const handleSave = () => {
    if (!editingResource) return

    if (!editingResource.title || !editingResource.fileUrl) {
      showNotification('error', 'Please fill in title and upload a file')
      return
    }

    if (isCreating) {
      addResource({
        title: editingResource.title,
        description: editingResource.description,
        type: editingResource.type,
        fileUrl: editingResource.fileUrl,
        fileSize: editingResource.fileSize,
        icon: typeIcons[editingResource.type] || '📄',
      })
      showNotification('success', 'Resource created successfully!')
    } else {
      updateResource(editingResource.id, editingResource)
      showNotification('success', 'Resource updated successfully!')
    }

    setEditingResource(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteResource(id)
    setDeleteConfirm(null)
    showNotification('success', 'Resource deleted successfully!')
  }

  return (
    <div className="space-y-8">
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

      {/* Audio Introduction Section */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Audio Introduction</h3>
            <p className="text-dark-400 text-sm">Upload your personal voice introduction</p>
          </div>
        </div>

        <div className="space-y-4">
          {audioIntroUrl ? (
            <div className="space-y-3">
              <div className="bg-dark-700/50 rounded-lg p-4">
                <p className="text-dark-300 text-sm mb-2">Current Audio:</p>
                <audio controls className="w-full" src={audioIntroUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => audioInputRef.current?.click()}
                  disabled={uploadingAudio}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingAudio ? 'Uploading...' : 'Replace Audio'}
                </button>
                <button
                  onClick={() => setAudioIntroUrl('')}
                  className="btn-secondary text-red-400 hover:text-red-300 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => audioInputRef.current?.click()}
              className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <Music className="w-12 h-12 text-dark-500 mx-auto mb-3" />
              <p className="text-dark-300 mb-2">
                {uploadingAudio ? 'Uploading...' : 'Click to upload audio introduction'}
              </p>
              <p className="text-dark-500 text-sm">MP3, WAV, or OGG (max 10MB)</p>
            </div>
          )}
          
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Free Resources
            </h2>
            <p className="text-dark-400 mt-1">Manage downloadable resources for visitors</p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {resources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800/50 border border-dark-700 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{resource.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium truncate">{resource.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${typeColors[resource.type]}`}>
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm line-clamp-2">{resource.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-dark-500 text-xs">
                    <span>{resource.fileSize}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setEditingResource(resource)
                      setIsCreating(false)
                    }}
                    className="p-2 text-dark-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(resource.id)}
                    className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              <AnimatePresence>
                {deleteConfirm === resource.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-dark-700"
                  >
                    <p className="text-dark-300 mb-3">Delete this resource?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {resources.length === 0 && (
            <div className="text-center py-12 text-dark-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No resources yet. Click &quot;Add Resource&quot; to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditingResource(null)
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
                  {isCreating ? 'Add New Resource' : 'Edit Resource'}
                </h3>
                <button
                  onClick={() => {
                    setEditingResource(null)
                    setIsCreating(false)
                  }}
                  className="text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Resource title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Description</label>
                  <textarea
                    value={editingResource.description}
                    onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the resource"
                    rows={3}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Type</label>
                  <select
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({ 
                      ...editingResource, 
                      type: e.target.value as Resource['type'],
                      icon: typeIcons[e.target.value] || '📄'
                    })}
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pdf">📄 PDF Document</option>
                    <option value="guide">📘 Guide</option>
                    <option value="template">📦 Template</option>
                    <option value="checklist">✅ Checklist</option>
                    <option value="video">🎥 Video</option>
                    <option value="audio">🎵 Audio</option>
                    <option value="code">💻 Code / Source</option>
                    <option value="design">🎨 Design File</option>
                    <option value="spreadsheet">📊 Spreadsheet</option>
                    <option value="presentation">📽️ Presentation</option>
                    <option value="archive">📁 Archive (ZIP/RAR)</option>
                    <option value="other">📎 Other</option>
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-dark-300 text-sm mb-2">File *</label>
                  {editingResource.fileUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-dark-300 bg-dark-700 px-4 py-2 rounded-lg">
                        <FileText className="w-4 h-4" />
                        <span className="truncate flex-1">{editingResource.fileUrl.split('/').pop()}</span>
                        <span className="text-dark-500 text-sm">{editingResource.fileSize}</span>
                      </div>
                      <button
                        onClick={() => resourceInputRef.current?.click()}
                        disabled={uploadingResource}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingResource ? 'Uploading...' : 'Replace File'}
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => resourceInputRef.current?.click()}
                      className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                      <p className="text-dark-400 text-sm">
                        {uploadingResource ? 'Uploading...' : 'Click to upload file'}
                      </p>
                      <p className="text-dark-500 text-xs mt-1">Any file type (max 50MB)</p>
                    </div>
                  )}
                  <input
                    ref={resourceInputRef}
                    type="file"
                    accept="*/*"
                    onChange={handleResourceFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!editingResource.title || !editingResource.fileUrl || uploadingResource}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Create Resource' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditingResource(null)
                    setIsCreating(false)
                  }}
                  className="btn-secondary"
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
