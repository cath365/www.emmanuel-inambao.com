'use client'

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  Bot,
  Check,
  Copy,
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'
import type {
  Project,
  ProjectDocument,
  ProjectMedia,
} from '@/lib/project-catalog'

type WorkspaceTab = 'details' | 'media' | 'documents' | 'ai' | 'publish'

interface ProjectWorkspaceProps {
  project: Project
  isNew: boolean
  onSave: (project: Project) => void
  onClose: () => void
}

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Media' },
  { id: 'documents', label: 'Documents' },
  { id: 'ai', label: 'AI' },
  { id: 'publish', label: 'Publish' },
]

function uniqueId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ProjectWorkspace({
  project,
  isNew,
  onSave,
  onClose,
}: ProjectWorkspaceProps) {
  const [formData, setFormData] = useState<Project>({
    ...project,
    publishStatus: project.publishStatus || 'published',
    media: project.media || [],
    documents: project.documents || [],
    architecture: project.architecture || [],
    highlights: project.highlights || [],
    cvHighlights: project.cvHighlights || [],
  })
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('details')
  const [techInput, setTechInput] = useState('')
  const [architectureInput, setArchitectureInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [documentType, setDocumentType] = useState<ProjectDocument['type']>('technical')
  const [aiAction, setAiAction] = useState<'improve' | 'case-study' | 'cv' | null>(null)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const published = formData.publishStatus !== 'draft'
  const mediaCount = formData.media?.length || 0
  const documentCount = formData.documents?.length || 0

  const completion = useMemo(() => {
    const checks = [
      Boolean(formData.title.trim()),
      Boolean(formData.purpose.trim()),
      Boolean(formData.problemSolved.trim()),
      Boolean(formData.systemLogic.trim()),
      Boolean(formData.outcome.trim()),
      formData.techStack.length > 0,
      Boolean(formData.image && formData.image !== '/images/projects/default.jpg'),
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [formData])

  const notify = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message })
    window.setTimeout(() => setNotice(null), 3500)
  }

  const uploadFile = async (file: File, type: 'project' | 'resource') => {
    const body = new FormData()
    body.append('file', file)
    body.append('type', type)
    body.append('projectId', formData.id)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.url as string
  }

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploadingCover(true)
    try {
      const url = await uploadFile(file, 'project')
      setFormData(current => ({ ...current, image: url }))
      notify('success', 'Cover image uploaded.')
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Cover upload failed.')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    setUploadingMedia(true)

    try {
      const uploaded: ProjectMedia[] = []

      for (const file of files) {
        const isVideo = file.type.startsWith('video/')
        const isImage = file.type.startsWith('image/')

        if (!isVideo && !isImage) continue

        const url = await uploadFile(file, 'project')
        uploaded.push({
          id: uniqueId('media'),
          type: isVideo ? 'video' : 'image',
          url,
          title: file.name.replace(/\.[^.]+$/, ''),
          caption: '',
        })
      }

      setFormData(current => ({
        ...current,
        media: [...(current.media || []), ...uploaded],
      }))
      notify('success', `${uploaded.length} media file${uploaded.length === 1 ? '' : 's'} added.`)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Media upload failed.')
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleDocumentUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    setUploadingDocument(true)

    try {
      const uploaded: ProjectDocument[] = []

      for (const file of files) {
        const url = await uploadFile(file, 'resource')
        uploaded.push({
          id: uniqueId('document'),
          title: file.name.replace(/\.[^.]+$/, ''),
          url,
          type: documentType,
          fileName: file.name,
          fileSize: fileSizeLabel(file.size),
        })
      }

      setFormData(current => ({
        ...current,
        documents: [...(current.documents || []), ...uploaded],
      }))
      notify('success', `${uploaded.length} document${uploaded.length === 1 ? '' : 's'} added.`)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Document upload failed.')
    } finally {
      setUploadingDocument(false)
    }
  }

  const addListItem = (
    field: 'techStack' | 'architecture' | 'highlights',
    value: string,
    clear: () => void
  ) => {
    const clean = value.trim()
    if (!clean) return

    const current = formData[field] || []
    if (current.includes(clean)) return

    setFormData(previous => ({
      ...previous,
      [field]: [...(previous[field] || []), clean],
    }))
    clear()
  }

  const removeListItem = (
    field: 'techStack' | 'architecture' | 'highlights',
    value: string
  ) => {
    setFormData(previous => ({
      ...previous,
      [field]: (previous[field] || []).filter(item => item !== value),
    }))
  }

  const runAI = async (action: 'improve' | 'case-study' | 'cv') => {
    setAiAction(action)

    try {
      const response = await fetch('/api/admin/project-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, project: formData }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI request failed.')
      }

      if (action === 'improve') {
        setFormData(current => ({
          ...current,
          purpose: data.result.purpose || current.purpose,
          problemSolved: data.result.problemSolved || current.problemSolved,
          systemLogic: data.result.systemLogic || current.systemLogic,
          outcome: data.result.outcome || current.outcome,
          highlights: Array.isArray(data.result.highlights)
            ? data.result.highlights
            : current.highlights,
        }))
        notify('success', 'Project copy improved. Review the changes before saving.')
      }

      if (action === 'case-study') {
        setFormData(current => ({
          ...current,
          caseStudy: data.result.caseStudy || current.caseStudy,
        }))
        notify('success', 'Case study generated and attached to this project.')
      }

      if (action === 'cv') {
        setFormData(current => ({
          ...current,
          cvHighlights: Array.isArray(data.result.cvHighlights)
            ? data.result.cvHighlights
            : current.cvHighlights,
        }))
        notify('success', 'CV-ready bullets generated and stored with the project.')
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'AI request failed.')
    } finally {
      setAiAction(null)
    }
  }

  const saveProject = (event?: FormEvent) => {
    event?.preventDefault()

    if (!formData.title.trim()) {
      setActiveTab('details')
      notify('error', 'Project title is required.')
      return
    }

    const finalProject: Project = {
      ...formData,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    }

    onSave(finalProject)
  }

  const copyCVHighlights = async () => {
    const text = (formData.cvHighlights || []).map(item => `• ${item}`).join('\n')
    if (!text) return

    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[#070B17] text-white">
      {notice && (
        <div
          className={
            'fixed right-4 top-4 z-[90] max-w-sm border px-4 py-3 text-sm shadow-2xl ' +
            (notice.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950 text-emerald-100'
              : 'border-red-500/30 bg-red-950 text-red-100')
          }
        >
          {notice.message}
        </div>
      )}

      <div className="flex h-full flex-col">
        <header className="border-b border-white/10 bg-[#000B26]">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-semibold text-white/55 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </button>

            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold text-white">
                {formData.title || (isNew ? 'New Project' : 'Untitled Project')}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/30">
                Project workspace · {completion}% complete
              </p>
            </div>

            <button
              onClick={() => saveProject()}
              className="flex items-center gap-2 bg-[#F7F3EC] px-4 py-2 text-xs font-bold text-[#000B26] transition hover:bg-[#7CA7EB]"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>

          <nav className="overflow-x-auto border-t border-white/[0.06] px-4 sm:px-6">
            <div className="flex min-w-max gap-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    'border-b-2 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ' +
                    (activeTab === tab.id
                      ? 'border-[#7CA7EB] text-[#7CA7EB]'
                      : 'border-transparent text-white/35 hover:text-white/70')
                  }
                >
                  {tab.label}
                  {tab.id === 'media' && mediaCount > 0 ? ` (${mediaCount})` : ''}
                  {tab.id === 'documents' && documentCount > 0 ? ` (${documentCount})` : ''}
                </button>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            {activeTab === 'details' && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7CA7EB]">
                      Project identity
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                      Define the engineering story.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Keep the language factual. The public AI assistant will use this same record when the project is published.
                    </p>
                  </div>

                  <div className="space-y-5 border border-white/10 bg-[#0B1120] p-5 sm:p-6">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Title *</span>
                      <input
                        value={formData.title}
                        onChange={event => setFormData(current => ({ ...current, title: event.target.value }))}
                        className="mt-2 w-full border border-white/10 bg-[#070B17] px-4 py-3 text-sm outline-none focus:border-[#7CA7EB]"
                        placeholder="Smart Fuel Dispenser"
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Role</span>
                        <input
                          value={formData.role || ''}
                          onChange={event => setFormData(current => ({ ...current, role: event.target.value }))}
                          className="mt-2 w-full border border-white/10 bg-[#070B17] px-4 py-3 text-sm outline-none focus:border-[#7CA7EB]"
                          placeholder="Lead Systems Engineer"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Project status</span>
                        <input
                          value={formData.status || ''}
                          onChange={event => setFormData(current => ({ ...current, status: event.target.value }))}
                          className="mt-2 w-full border border-white/10 bg-[#070B17] px-4 py-3 text-sm outline-none focus:border-[#7CA7EB]"
                          placeholder="Prototype / Active Development"
                        />
                      </label>
                    </div>

                    {[
                      ['purpose', 'Purpose', 'One clear sentence describing what this project exists to do.', 2],
                      ['problemSolved', 'Engineering problem', 'What real problem or operating constraint does it address?', 4],
                      ['systemLogic', 'System design / logic', 'Explain how the system works from input to output.', 6],
                      ['outcome', 'Outcome', 'What was produced or demonstrated? Use only verified results.', 4],
                    ].map(([field, label, placeholder, rows]) => (
                      <label key={String(field)} className="block">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">{label}</span>
                        <textarea
                          value={String(formData[field as keyof Project] || '')}
                          onChange={event =>
                            setFormData(current => ({ ...current, [field]: event.target.value }))
                          }
                          rows={Number(rows)}
                          className="mt-2 w-full resize-y border border-white/10 bg-[#070B17] px-4 py-3 text-sm leading-6 outline-none focus:border-[#7CA7EB]"
                          placeholder={String(placeholder)}
                        />
                      </label>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                  {[
                    {
                      label: 'Technology',
                      field: 'techStack' as const,
                      value: techInput,
                      setValue: setTechInput,
                      placeholder: 'ESP32, Next.js, Flow Sensor…',
                    },
                    {
                      label: 'Architecture',
                      field: 'architecture' as const,
                      value: architectureInput,
                      setValue: setArchitectureInput,
                      placeholder: 'Device control layer…',
                    },
                    {
                      label: 'Highlights',
                      field: 'highlights' as const,
                      value: highlightInput,
                      setValue: setHighlightInput,
                      placeholder: 'Offline recovery…',
                    },
                  ].map(group => (
                    <div key={group.label} className="border border-white/10 bg-[#0B1120] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/40">{group.label}</p>
                      <div className="mt-3 flex gap-2">
                        <input
                          value={group.value}
                          onChange={event => group.setValue(event.target.value)}
                          onKeyDown={event => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              addListItem(group.field, group.value, () => group.setValue(''))
                            }
                          }}
                          className="min-w-0 flex-1 border border-white/10 bg-[#070B17] px-3 py-2 text-sm outline-none focus:border-[#7CA7EB]"
                          placeholder={group.placeholder}
                        />
                        <button
                          onClick={() => addListItem(group.field, group.value, () => group.setValue(''))}
                          className="border border-white/10 p-2 text-white/60 hover:border-[#7CA7EB] hover:text-[#7CA7EB]"
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-2">
                        {(formData[group.field] || []).map(item => (
                          <div key={item} className="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-2 text-xs text-white/55">
                            <span>{item}</span>
                            <button
                              onClick={() => removeListItem(group.field, item)}
                              className="text-white/25 hover:text-red-300"
                              type="button"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="border border-white/10 bg-[#0B1120] p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/40">External links</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {[
                      ['githubUrl', 'GitHub', 'https://github.com/...'],
                      ['liveUrl', 'Live system', 'https://...'],
                      ['websiteUrl', 'Website', 'https://...'],
                      ['docsUrl', 'Documentation', 'https://...'],
                      ['videoUrl', 'Video', 'https://youtube.com/...'],
                      ['playStoreUrl', 'Play Store', 'https://play.google.com/...'],
                      ['appStoreUrl', 'App Store', 'https://apps.apple.com/...'],
                    ].map(([field, label, placeholder]) => (
                      <label key={field} className="block">
                        <span className="text-xs text-white/40">{label}</span>
                        <input
                          type="url"
                          value={String(formData[field as keyof Project] || '')}
                          onChange={event => setFormData(current => ({ ...current, [field]: event.target.value }))}
                          className="mt-2 w-full border border-white/10 bg-[#070B17] px-4 py-3 text-sm outline-none focus:border-[#7CA7EB]"
                          placeholder={placeholder}
                        />
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7CA7EB]">Project media</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Show the system, not just the description.</h2>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Upload the primary cover plus prototype photos, diagrams, field images and demo videos.
                    </p>
                  </div>

                  <div className="border border-white/10 bg-[#0B1120] p-5">
                    <div className="relative aspect-[16/7] overflow-hidden border border-white/10 bg-[#070B17]">
                      {formData.image && formData.image !== '/images/projects/default.jpg' ? (
                        <Image src={formData.image} alt={formData.title || 'Project cover'} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/20">
                          <ImageIcon className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="flex items-center gap-2 bg-[#F7F3EC] px-4 py-2.5 text-xs font-bold text-[#000B26]"
                        type="button"
                      >
                        {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingCover ? 'Uploading…' : 'Upload cover'}
                      </button>
                      <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </div>
                  </div>
                </section>

                <section className="border border-white/10 bg-[#0B1120] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Project gallery</p>
                      <p className="mt-1 text-xs text-white/35">Images and videos can be uploaded together.</p>
                    </div>
                    <button
                      onClick={() => mediaInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="flex items-center justify-center gap-2 border border-[#7CA7EB] px-4 py-2.5 text-xs font-bold text-[#7CA7EB] hover:bg-[#7CA7EB] hover:text-[#000B26]"
                      type="button"
                    >
                      {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {uploadingMedia ? 'Uploading…' : 'Add media'}
                    </button>
                    <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} className="hidden" />
                  </div>

                  {(formData.media || []).length === 0 ? (
                    <div className="mt-6 flex min-h-44 items-center justify-center border border-dashed border-white/10 text-sm text-white/30">
                      No additional project media yet.
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {(formData.media || []).map(item => (
                        <article key={item.id} className="overflow-hidden border border-white/10 bg-[#070B17]">
                          <div className="relative aspect-video bg-black">
                            {item.type === 'image' ? (
                              <Image src={item.url} alt={item.title || 'Project media'} fill className="object-cover" />
                            ) : (
                              <video src={item.url} className="h-full w-full object-cover" controls />
                            )}
                          </div>
                          <div className="space-y-3 p-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#CBB08A]">
                              {item.type === 'video' ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                              {item.type}
                            </div>
                            <input
                              value={item.title || ''}
                              onChange={event =>
                                setFormData(current => ({
                                  ...current,
                                  media: (current.media || []).map(media =>
                                    media.id === item.id ? { ...media, title: event.target.value } : media
                                  ),
                                }))
                              }
                              className="w-full border border-white/10 bg-[#0B1120] px-3 py-2 text-sm outline-none focus:border-[#7CA7EB]"
                              placeholder="Media title"
                            />
                            <textarea
                              value={item.caption || ''}
                              onChange={event =>
                                setFormData(current => ({
                                  ...current,
                                  media: (current.media || []).map(media =>
                                    media.id === item.id ? { ...media, caption: event.target.value } : media
                                  ),
                                }))
                              }
                              rows={2}
                              className="w-full resize-none border border-white/10 bg-[#0B1120] px-3 py-2 text-xs leading-5 outline-none focus:border-[#7CA7EB]"
                              placeholder="Technical caption"
                            />
                            <div className="flex items-center justify-between">
                              {item.type === 'image' && (
                                <button
                                  onClick={() => setFormData(current => ({ ...current, image: item.url }))}
                                  type="button"
                                  className="text-xs font-semibold text-[#7CA7EB]"
                                >
                                  Use as cover
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setFormData(current => ({
                                    ...current,
                                    media: (current.media || []).filter(media => media.id !== item.id),
                                  }))
                                }
                                type="button"
                                className="ml-auto text-xs font-semibold text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#CBB08A]">Project documents</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Attach the engineering evidence.</h2>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Case studies, technical specifications, presentations and reports stay attached to the project record.
                    </p>
                  </div>

                  <div className="border border-white/10 bg-[#0B1120] p-5 sm:p-6">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Document type</span>
                      <select
                        value={documentType}
                        onChange={event => setDocumentType(event.target.value as ProjectDocument['type'])}
                        className="mt-2 w-full border border-white/10 bg-[#070B17] px-4 py-3 text-sm outline-none focus:border-[#7CA7EB]"
                      >
                        <option value="technical">Technical document</option>
                        <option value="case-study">Case study</option>
                        <option value="presentation">Presentation</option>
                        <option value="report">Report</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    <button
                      onClick={() => documentInputRef.current?.click()}
                      disabled={uploadingDocument}
                      type="button"
                      className="mt-4 flex w-full items-center justify-center gap-2 border border-dashed border-white/20 px-4 py-8 text-sm font-semibold text-white/55 transition hover:border-[#CBB08A] hover:text-[#CBB08A]"
                    >
                      {uploadingDocument ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                      {uploadingDocument ? 'Uploading documents…' : 'Upload PDF, Word, PowerPoint, spreadsheet or archive'}
                    </button>
                    <input
                      ref={documentInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.zip,.rar,.7z"
                      multiple
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </div>
                </section>

                <section className="border-t border-white/10">
                  {(formData.documents || []).length === 0 ? (
                    <div className="py-12 text-center text-sm text-white/30">No project documents attached yet.</div>
                  ) : (
                    (formData.documents || []).map(document => (
                      <article
                        key={document.id}
                        className="grid gap-4 border-b border-white/10 py-5 sm:grid-cols-[2.5rem_1fr_10rem_auto] sm:items-center"
                      >
                        <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#CBB08A]">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <input
                            value={document.title}
                            onChange={event =>
                              setFormData(current => ({
                                ...current,
                                documents: (current.documents || []).map(item =>
                                  item.id === document.id ? { ...item, title: event.target.value } : item
                                ),
                              }))
                            }
                            className="w-full bg-transparent text-sm font-semibold outline-none"
                          />
                          <p className="mt-1 truncate text-xs text-white/30">
                            {document.fileName || document.url.split('/').pop()} {document.fileSize ? `· ${document.fileSize}` : ''}
                          </p>
                        </div>

                        <select
                          value={document.type}
                          onChange={event =>
                            setFormData(current => ({
                              ...current,
                              documents: (current.documents || []).map(item =>
                                item.id === document.id
                                  ? { ...item, type: event.target.value as ProjectDocument['type'] }
                                  : item
                              ),
                            }))
                          }
                          className="border border-white/10 bg-[#0B1120] px-3 py-2 text-xs outline-none"
                        >
                          <option value="technical">Technical</option>
                          <option value="case-study">Case study</option>
                          <option value="presentation">Presentation</option>
                          <option value="report">Report</option>
                          <option value="other">Other</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <a href={document.url} target="_blank" rel="noopener noreferrer" className="border border-white/10 p-2 text-white/45 hover:text-white">
                            <Globe className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() =>
                              setFormData(current => ({
                                ...current,
                                documents: (current.documents || []).filter(item => item.id !== document.id),
                              }))
                            }
                            type="button"
                            className="border border-white/10 p-2 text-red-300 hover:border-red-400/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7CA7EB]">Project AI</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Use AI to edit, not invent.</h2>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Every AI action is restricted to the facts already present in this project record.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      {
                        action: 'improve' as const,
                        title: 'Improve project copy',
                        text: 'Tighten the purpose, problem, system logic, outcome and engineering highlights.',
                      },
                      {
                        action: 'case-study' as const,
                        title: 'Generate case study',
                        text: 'Create a structured Markdown case study from the verified project record.',
                      },
                      {
                        action: 'cv' as const,
                        title: 'Prepare CV update',
                        text: 'Generate CV-ready engineering bullets and store them with this project.',
                      },
                    ].map(item => (
                      <button
                        key={item.action}
                        onClick={() => void runAI(item.action)}
                        disabled={aiAction !== null}
                        className="grid gap-3 border border-white/10 bg-[#0B1120] p-5 text-left transition hover:border-[#7CA7EB]/50 disabled:opacity-50 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center"
                        type="button"
                      >
                        <div className="flex h-10 w-10 items-center justify-center border border-[#7CA7EB]/30 text-[#7CA7EB]">
                          {aiAction === item.action ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/40">{item.text}</p>
                        </div>
                        <span className="text-xs font-bold text-[#7CA7EB]">Run AI →</span>
                      </button>
                    ))}
                  </div>
                </section>

                {formData.caseStudy && (
                  <section className="border border-white/10 bg-[#0B1120] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Generated case study</p>
                        <p className="mt-1 text-xs text-white/35">Editable before saving.</p>
                      </div>
                      <Bot className="h-4 w-4 text-[#7CA7EB]" />
                    </div>
                    <textarea
                      value={formData.caseStudy}
                      onChange={event => setFormData(current => ({ ...current, caseStudy: event.target.value }))}
                      rows={18}
                      className="mt-5 w-full resize-y border border-white/10 bg-[#070B17] px-4 py-3 font-mono text-xs leading-6 outline-none focus:border-[#7CA7EB]"
                    />
                  </section>
                )}

                {(formData.cvHighlights || []).length > 0 && (
                  <section className="border border-white/10 bg-[#CBB08A] p-5 text-[#402924] sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold">CV-ready project bullets</p>
                        <p className="mt-1 text-xs text-[#402924]/60">
                          Stored with the project. They do not overwrite your uploaded CV file.
                        </p>
                      </div>
                      <button
                        onClick={() => void copyCVHighlights()}
                        type="button"
                        className="flex items-center gap-2 border border-[#402924]/25 px-3 py-2 text-xs font-bold"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <ul className="mt-5 border-t border-[#402924]/20">
                      {(formData.cvHighlights || []).map((item, index) => (
                        <li key={index} className="grid grid-cols-[1.5rem_1fr] gap-3 border-b border-[#402924]/15 py-3 text-sm leading-6">
                          <span>→</span>
                          <textarea
                            value={item}
                            onChange={event =>
                              setFormData(current => ({
                                ...current,
                                cvHighlights: (current.cvHighlights || []).map((value, itemIndex) =>
                                  itemIndex === index ? event.target.value : value
                                ),
                              }))
                            }
                            rows={2}
                            className="w-full resize-none bg-transparent outline-none"
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'publish' && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#CBB08A]">Publishing</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Control what becomes public.</h2>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Draft projects remain visible in Admin only. Published projects become available to the portfolio and the public AI assistant.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setFormData(current => ({ ...current, publishStatus: 'draft', featured: false }))}
                      type="button"
                      className={
                        'w-full border p-5 text-left transition ' +
                        (!published
                          ? 'border-[#CBB08A] bg-[#CBB08A]/10'
                          : 'border-white/10 bg-[#0B1120] hover:border-white/25')
                      }
                    >
                      <p className="text-sm font-semibold">Draft</p>
                      <p className="mt-1 text-xs leading-5 text-white/40">Keep the project private while content, documents or media are still being prepared.</p>
                    </button>

                    <button
                      onClick={() => setFormData(current => ({ ...current, publishStatus: 'published' }))}
                      type="button"
                      className={
                        'w-full border p-5 text-left transition ' +
                        (published
                          ? 'border-[#7CA7EB] bg-[#7CA7EB]/10'
                          : 'border-white/10 bg-[#0B1120] hover:border-white/25')
                      }
                    >
                      <p className="text-sm font-semibold">Published</p>
                      <p className="mt-1 text-xs leading-5 text-white/40">Show the project publicly and allow the portfolio AI to use it as verified context.</p>
                    </button>

                    <label className="flex items-start gap-3 border border-white/10 bg-[#0B1120] p-5">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.featured)}
                        disabled={!published}
                        onChange={event => setFormData(current => ({ ...current, featured: event.target.checked }))}
                        className="mt-0.5 h-4 w-4"
                      />
                      <span>
                        <span className="block text-sm font-semibold">Feature on homepage</span>
                        <span className="mt-1 block text-xs leading-5 text-white/40">Featured projects compete for the selected-work positions on Home.</span>
                      </span>
                    </label>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                  <div className="border border-white/10 bg-[#0B1120] p-5">
                    <p className="text-3xl font-semibold">{completion}%</p>
                    <p className="mt-2 text-xs text-white/35">Core record complete</p>
                  </div>
                  <div className="border border-white/10 bg-[#0B1120] p-5">
                    <p className="text-3xl font-semibold">{mediaCount}</p>
                    <p className="mt-2 text-xs text-white/35">Gallery media</p>
                  </div>
                  <div className="border border-white/10 bg-[#0B1120] p-5">
                    <p className="text-3xl font-semibold">{documentCount}</p>
                    <p className="mt-2 text-xs text-white/35">Attached documents</p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-white/10 bg-[#000B26] px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
              {published ? 'Published project' : 'Private draft'} · {mediaCount} media · {documentCount} documents
            </p>
            <div className="flex items-center gap-2">
              <button onClick={onClose} type="button" className="px-4 py-2 text-xs font-semibold text-white/45 hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => saveProject()}
                type="button"
                className="flex items-center gap-2 bg-[#F7F3EC] px-5 py-2.5 text-xs font-bold text-[#000B26] hover:bg-[#7CA7EB]"
              >
                <Save className="h-3.5 w-3.5" />
                {isNew ? 'Create project' : 'Save changes'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
