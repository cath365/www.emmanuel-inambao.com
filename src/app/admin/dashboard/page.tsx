'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, LogOut, Save, X, Cpu,
  FolderOpen, ExternalLink, Github, Image as ImageIcon,
  User, Upload, Camera, Check, AlertCircle, Briefcase,
  Quote, Award, Settings, Video, FileText, GalleryHorizontal,
  Globe, Smartphone, Play, Bell, Mail, Clock, Calendar
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProjects, Project } from '@/lib/projects'
import { useProfile, Profile } from '@/lib/profile'
import Link from 'next/link'
import Image from 'next/image'
import ExperienceEditor from '@/components/admin/ExperienceEditor'
import TestimonialEditor from '@/components/admin/TestimonialEditor'
import CertificationEditor from '@/components/admin/CertificationEditor'
import ServiceEditor from '@/components/admin/ServiceEditor'
import MediaUploader from '@/components/admin/MediaUploader'
import ResourcesEditor from '@/components/admin/ResourcesEditor'
import GalleryEditor from '@/components/admin/GalleryEditor'

type TabType = 'projects' | 'profile' | 'experience' | 'testimonials' | 'certifications' | 'services' | 'media' | 'resources' | 'gallery' | 'leads' | 'bookings'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth()
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const { profile, updateProfile } = useProfile()
  
  const [activeTab, setActiveTab] = useState<TabType>('projects')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const handleSaveProject = (project: Project) => {
    if (isCreating) {
      addProject(project)
      setNotification({ type: 'success', message: 'Project created successfully!' })
    } else {
      updateProject(project.id, project)
      setNotification({ type: 'success', message: 'Project updated successfully!' })
    }
    setEditingProject(null)
    setIsCreating(false)
  }

  const handleDeleteProject = (id: string) => {
    deleteProject(id)
    setDeleteConfirm(null)
    setNotification({ type: 'success', message: 'Project deleted successfully!' })
  }

  const handleCreateNew = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      purpose: '',
      image: '/images/projects/default.jpg',
      techStack: [],
      problemSolved: '',
      systemLogic: '',
      outcome: '',
      featured: false,
      githubUrl: '',
      liveUrl: '',
      appStoreUrl: '',
      playStoreUrl: '',
      websiteUrl: '',
      docsUrl: '',
      videoUrl: ''
    }
    setEditingProject(newProject)
    setIsCreating(true)
  }

  return (
    <div className="min-h-screen bg-dark-950">
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
            {notification.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <Cpu className="w-6 h-6 text-primary-500" />
              Admin Dashboard
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-dark-400 text-sm hidden sm:block">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-dark-900/50 border-b border-dark-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'experience'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Experience
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Quote className="w-5 h-5" />
              Testimonials
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'certifications'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Award className="w-5 h-5" />
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'services'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              Services
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'media'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              Media
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'resources'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Resources
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <GalleryHorizontal className="w-5 h-5" />
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              Leads
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'text-primary-400 border-primary-500'
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'projects' ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Projects Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-primary-500" />
                    Manage Projects
                  </h1>
                  <p className="text-dark-400 mt-1">Add, edit, or remove portfolio projects</p>
                </div>
                
                <button
                  onClick={handleCreateNew}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>

              {/* Projects grid */}
              <div className="grid gap-6">
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-dark-800/50 border border-dark-700 rounded-xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Project image */}
                        <div className="lg:w-48 h-32 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {project.image && project.image !== '/images/projects/default.jpg' ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-dark-500">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Project info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {project.title || 'Untitled Project'}
                              </h3>
                              {project.featured && (
                                <span className="inline-block px-2 py-1 bg-accent-500/20 text-accent-400 text-xs rounded mt-1">
                                  Featured
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setEditingProject(project)
                                  setIsCreating(false)
                                }}
                                className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(project.id)}
                                className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-dark-400 text-sm mt-3 line-clamp-2">
                            {project.purpose || 'No description'}
                          </p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.techStack.slice(0, 5).map((tech: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 5 && (
                              <span className="px-2 py-1 text-dark-400 text-xs">
                                +{project.techStack.length - 5} more
                              </span>
                            )}
                          </div>

                          {/* Links */}
                          <div className="flex flex-wrap items-center gap-3 mt-4">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-primary-400 text-sm transition-colors"
                              >
                                <Github className="w-4 h-4" />
                                GitHub
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-primary-400 text-sm transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Demo
                              </a>
                            )}
                            {project.websiteUrl && (
                              <a
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-green-400 text-sm transition-colors"
                              >
                                <Globe className="w-4 h-4" />
                                Website
                              </a>
                            )}
                            {project.appStoreUrl && (
                              <a
                                href={project.appStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-blue-400 text-sm transition-colors"
                              >
                                <Smartphone className="w-4 h-4" />
                                App Store
                              </a>
                            )}
                            {project.playStoreUrl && (
                              <a
                                href={project.playStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-green-400 text-sm transition-colors"
                              >
                                <Smartphone className="w-4 h-4" />
                                Play Store
                              </a>
                            )}
                            {project.docsUrl && (
                              <a
                                href={project.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-yellow-400 text-sm transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                Docs
                              </a>
                            )}
                            {project.videoUrl && (
                              <a
                                href={project.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-dark-400 hover:text-red-400 text-sm transition-colors"
                              >
                                <Play className="w-4 h-4" />
                                Video
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete confirmation */}
                      {deleteConfirm === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-dark-700"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-red-400 text-sm">
                              Are you sure you want to delete this project?
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 text-dark-300 hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {projects.length === 0 && (
                  <div className="text-center py-16">
                    <FolderOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-dark-300">No projects yet</h3>
                    <p className="text-dark-500 mt-1">Click &quot;Add Project&quot; to create your first project</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Profile Tab */}
              <ProfileEditor
                profile={profile}
                onSave={(updates) => {
                  updateProfile(updates)
                  setNotification({ type: 'success', message: 'Profile updated successfully!' })
                }}
              />
            </motion.div>
          ) : activeTab === 'experience' ? (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ExperienceEditor 
                onNotify={(type, message) => setNotification({ type, message })}
              />
            </motion.div>
          ) : activeTab === 'testimonials' ? (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TestimonialEditor 
                onNotify={(type, message) => setNotification({ type, message })}
              />
            </motion.div>
          ) : activeTab === 'certifications' ? (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CertificationEditor 
                onNotify={(type, message) => setNotification({ type, message })}
              />
            </motion.div>
          ) : activeTab === 'services' ? (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ServiceEditor 
                onNotify={(type, message) => setNotification({ type, message })}
              />
            </motion.div>
          ) : activeTab === 'media' ? (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MediaUploader 
                onNotify={(type, message) => setNotification({ type, message })}
              />
            </motion.div>
          ) : activeTab === 'resources' ? (
            <motion.div
              key="resources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ResourcesEditor />
            </motion.div>
          ) : activeTab === 'gallery' ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GalleryEditor />
            </motion.div>
          ) : activeTab === 'leads' ? (
            <motion.div
              key="leads"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ServiceLeadsPanel />
            </motion.div>
          ) : activeTab === 'bookings' ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BookingsPanel />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Quick links */}
        <div className="mt-8 pt-8 border-t border-dark-700">
          <Link 
            href="/" 
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            ← View Portfolio
          </Link>
        </div>
      </main>

      {/* Edit/Create Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <ProjectModal
            project={editingProject}
            isNew={isCreating}
            onSave={handleSaveProject}
            onClose={() => {
              setEditingProject(null)
              setIsCreating(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Profile Editor Component
interface ProfileEditorProps {
  profile: Profile
  onSave: (updates: Partial<Profile>) => void
}

function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [formData, setFormData] = useState<Profile>(profile)
  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'profile')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
        credentials: 'include', // Ensure cookies are sent
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, image: data.url })
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Image upload error:', err)
      alert('Upload failed. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'profile')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, coverImage: data.url })
      } else {
        alert(data.error || 'Cover upload failed')
      }
    } catch (err) {
      console.error('Cover upload error:', err)
      alert('Cover upload failed.')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCV(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'cv')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
        credentials: 'include', // Ensure cookies are sent
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, cv: data.url })
      } else {
        alert(data.error || 'CV upload failed')
      }
    } catch (err) {
      console.error('CV upload error:', err)
      alert('CV upload failed. Check console for details.')
    } finally {
      setUploadingCV(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-primary-500" />
          Edit Profile
        </h1>
        <p className="text-dark-400 mt-1">Update your personal information and profile picture</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image Section */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-dark-700 border-4 border-dark-600">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-dark-300">Click the camera icon to upload a new photo</p>
              <p className="text-dark-500 text-sm mt-1">Recommended: Square image, at least 256x256px</p>
              <p className="text-dark-500 text-sm">Max file size: 5MB (JPG, PNG, WebP)</p>
            </div>
          </div>
        </div>

        {/* Cover Image Section */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Cover Banner</h2>
          <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden bg-dark-700 border border-dark-600 mb-4">
            {formData.coverImage ? (
              <Image
                src={formData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-700 via-primary-900 to-dark-950 flex items-center justify-center">
                <p className="text-dark-400 text-sm">No cover image — a gradient will be shown</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {uploadingCover ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload Cover
            </button>
            {formData.coverImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: '' })}
                className="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg text-sm hover:bg-dark-600 transition-colors"
              >
                Remove
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>
          <p className="text-dark-500 text-sm mt-2">Recommended: 1400x400px (landscape). Appears at top of your portfolio like LinkedIn.</p>
        </div>

        {/* Basic Info */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Electronic Engineer | IoT Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Full-Stack Systems Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Status</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Available for Engineering Projects"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                placeholder="Tell people about yourself..."
              />
            </div>
          </div>
        </div>

        {/* CV Upload Section */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">CV / Resume</h2>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1">
              <p className="text-dark-300 mb-4">Upload your CV or resume to make it available for download on your portfolio.</p>
              
              {formData.cv && (
                <div className="mb-4 p-4 bg-dark-900 rounded-lg border border-dark-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">CV Uploaded</p>
                        <a 
                          href={formData.cv} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-400 text-sm hover:underline"
                        >
                          View CV →
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cv: '' })}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={uploadingCV}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
              >
                {uploadingCV ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {formData.cv ? 'Replace CV' : 'Upload CV'}
                  </>
                )}
              </button>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCVUpload}
                className="hidden"
              />
              <p className="text-dark-500 text-sm mt-2">Accepted formats: PDF, DOC, DOCX (max 10MB)</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="+260 XXX XXX XXX"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Social Links</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">GitHub</label>
              <input
                type="url"
                value={formData.socialLinks.github || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Twitter/X</label>
              <input
                type="url"
                value={formData.socialLinks.twitter || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Website</label>
              <input
                type="url"
                value={formData.socialLinks.website || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, website: e.target.value } })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}

// Project Edit/Create Modal Component
interface ProjectModalProps {
  project: Project
  isNew: boolean
  onSave: (project: Project) => void
  onClose: () => void
}

function ProjectModal({ project, isNew, onSave, onClose }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>(project)
  const [techInput, setTechInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'project')
    form.append('projectId', formData.id)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ ...formData, image: data.url })
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Project image upload error:', err)
      alert('Upload failed. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t: string) => t !== tech)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? 'Add New Project' : 'Edit Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Project Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-24 bg-dark-700 rounded-lg overflow-hidden relative flex-shrink-0">
                {formData.image && formData.image !== '/images/projects/default.jpg' ? (
                  <Image
                    src={formData.image}
                    alt="Project"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
                <p className="text-dark-500 text-xs mt-1">JPG, PNG, WebP (max 5MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="Enter project title"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Purpose *
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="Brief purpose of the project"
            />
          </div>

          {/* Problem Solved */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Problem Solved *
            </label>
            <textarea
              value={formData.problemSolved}
              onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              placeholder="Describe the problem this project solves"
            />
          </div>

          {/* System Logic */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              System Logic *
            </label>
            <textarea
              value={formData.systemLogic}
              onChange={(e) => setFormData({ ...formData, systemLogic: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              placeholder="Explain how the system works"
            />
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Outcome *
            </label>
            <textarea
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              required
              rows={2}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              placeholder="Results and achievements"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
              />
              <span className="text-dark-300">Featured Project</span>
            </label>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Tech Stack
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Add technology (press Enter)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.techStack.map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 text-dark-300 text-sm rounded-lg"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-dark-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-dark-300 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Project Links
            </h4>
            
            {/* Row 1: GitHub & Live Demo */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <Github className="w-4 h-4 inline mr-1" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <ExternalLink className="w-4 h-4 inline mr-1" /> Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://demo.example.com"
                />
              </div>
            </div>

            {/* Row 2: Website & Documentation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" /> Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://www.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" /> Documentation URL
                </label>
                <input
                  type="url"
                  value={formData.docsUrl || ''}
                  onChange={(e) => setFormData({ ...formData, docsUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://docs.example.com"
                />
              </div>
            </div>

            {/* Row 3: App Store & Play Store */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-1" /> App Store URL
                </label>
                <input
                  type="url"
                  value={formData.appStoreUrl || ''}
                  onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://apps.apple.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-1" /> Play Store URL
                </label>
                <input
                  type="url"
                  value={formData.playStoreUrl || ''}
                  onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://play.google.com/store/apps/..."
                />
              </div>
            </div>

            {/* Row 4: Video */}
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">
                <Play className="w-4 h-4 inline mr-1" /> Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-dark-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isNew ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Service Leads Panel Component
interface ServiceLead {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: 'new' | 'contacted' | 'closed'
}

function ServiceLeadsPanel() {
  const [leads, setLeads] = useState<ServiceLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/service-inquiry')
      .then(r => r.json())
      .then(data => setLeads(data.leads || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false))
  }, [])

  const updateLeadStatus = async (id: string, status: ServiceLead['status']) => {
    await fetch('/api/service-inquiry', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const deleteLead = async (id: string) => {
    await fetch('/api/service-inquiry', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  const newLeads = leads.filter(l => l.status === 'new')
  const contactedLeads = leads.filter(l => l.status === 'contacted')
  const closedLeads = leads.filter(l => l.status === 'closed')

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16">
        <Bell className="w-16 h-16 text-dark-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Service Inquiries Yet</h3>
        <p className="text-dark-400">When visitors ask about your services through the AI chatbot, their inquiries will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Service Inquiries</h2>
        {newLeads.length > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {newLeads.length} New
          </span>
        )}
      </div>

      {/* New Leads */}
      {newLeads.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" /> New Inquiries
          </h3>
          <div className="space-y-4">
            {newLeads.map(lead => (
              <div key={lead.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{lead.name}</h4>
                      <span className="text-xs bg-yellow-500 text-dark-900 px-2 py-0.5 rounded-full font-bold">NEW</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-dark-300 mb-3">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Settings className="w-4 h-4" /> {lead.service}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(lead.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-dark-300">{lead.details}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${lead.email}?subject=Re: ${lead.service} Inquiry&body=Hi ${lead.name},%0D%0A%0D%0AThank you for your interest in my ${lead.service} services.%0D%0A%0D%0ABest regards,%0D%0AEmmanuel Inambao`}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" /> Reply
                    </a>
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'contacted')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Contacted
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacted Leads */}
      {contactedLeads.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Contacted ({contactedLeads.length})</h3>
          <div className="space-y-3">
            {contactedLeads.map(lead => (
              <div key={lead.id} className="bg-dark-800/50 border border-dark-700 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">{lead.name} — <span className="text-dark-400">{lead.service}</span></p>
                    <p className="text-dark-400 text-sm">{lead.email} · {new Date(lead.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'closed')}
                      className="px-3 py-1.5 bg-dark-700 text-dark-300 rounded-lg text-sm hover:bg-dark-600 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed Leads */}
      {closedLeads.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-dark-500 mb-4">Closed ({closedLeads.length})</h3>
          <div className="space-y-2">
            {closedLeads.map(lead => (
              <div key={lead.id} className="bg-dark-800/30 border border-dark-800 rounded-lg p-3 opacity-60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-dark-400 text-sm">{lead.name} — {lead.service} · {new Date(lead.submittedAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-dark-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Bookings Panel Component
interface Booking {
  id: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  timezone: string
  duration: number
  topic: string
  submittedAt: string
  status: 'pending' | 'confirmed' | 'cancelled'
  source: 'chatbot' | 'scheduler'
}

function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/booking')
      .then(r => r.json())
      .then(data => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: Booking['status']) => {
    await fetch('/api/booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const deleteBooking = async (id: string) => {
    await fetch('/api/booking', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const pending = bookings.filter(b => b.status === 'pending')
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
        <p className="text-dark-400">When visitors book a meeting via the AI chatbot or booking form, they will appear here.</p>
      </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className={`bg-dark-900/50 border rounded-xl p-4 sm:p-5 ${
      booking.status === 'pending' ? 'border-yellow-500/40' :
      booking.status === 'confirmed' ? 'border-green-500/40' : 'border-dark-700'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <p className="font-semibold text-white">{booking.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
              'bg-dark-700 text-dark-400'
            }`}>
              {booking.status.toUpperCase()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-dark-400">
              via {booking.source}
            </span>
          </div>
          <div className="space-y-1 text-sm text-dark-300">
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-dark-500 flex-shrink-0" />{booking.email}</p>
            {booking.phone && <p className="flex items-center gap-2"><Bell className="w-3.5 h-3.5 text-dark-500 flex-shrink-0" />{booking.phone}</p>}
            <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-dark-500 flex-shrink-0" />{booking.date} at {booking.time} · {booking.duration} min · {booking.timezone}</p>
            {booking.topic && <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-dark-500 flex-shrink-0" />{booking.topic}</p>}
            <p className="text-dark-500 text-xs">Received: {new Date(booking.submittedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${booking.email}?subject=Your booking on ${booking.date} at ${booking.time}&body=Hi ${booking.name},%0A%0AThank you for booking a meeting!`}
            className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-lg text-sm hover:bg-primary-600/30 transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" /> Reply
          </a>
          {booking.status === 'pending' && (
            <button
              onClick={() => updateStatus(booking.id, 'confirmed')}
              className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 transition-colors"
            >
              Confirm
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <button
              onClick={() => updateStatus(booking.id, 'cancelled')}
              className="px-3 py-1.5 bg-dark-700 text-dark-400 rounded-lg text-sm hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => deleteBooking(booking.id)}
            className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Meeting Bookings</h2>
        <span className="text-sm text-dark-400">{bookings.length} total · {pending.length} pending</span>
      </div>

      {pending.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Pending ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {confirmed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Confirmed ({confirmed.length})</h3>
          <div className="space-y-3">
            {confirmed.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {cancelled.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-dark-500 mb-4">Cancelled ({cancelled.length})</h3>
          <div className="space-y-2">
            {cancelled.map(b => (
              <div key={b.id} className="bg-dark-800/30 border border-dark-800 rounded-lg p-3 opacity-60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-dark-400 text-sm">{b.name} — {b.date} at {b.time} · {new Date(b.submittedAt).toLocaleDateString()}</p>
                  <button onClick={() => deleteBooking(b.id)} className="text-dark-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
