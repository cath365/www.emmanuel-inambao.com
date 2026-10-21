'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Resource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'template' | 'guide' | 'checklist'
  fileUrl: string
  fileSize: string
  downloads: number
  icon: string
  createdAt: string
}

interface ResourcesContextType {
  resources: Resource[]
  addResource: (resource: Omit<Resource, 'id' | 'downloads' | 'createdAt'>) => void
  updateResource: (id: string, resource: Partial<Resource>) => void
  deleteResource: (id: string) => void
  audioIntroUrl: string
  setAudioIntroUrl: (url: string) => void
}

const ResourcesContext = createContext<ResourcesContextType | null>(null)

const STORAGE_KEY = 'portfolio_resources'
const AUDIO_STORAGE_KEY = 'portfolio_audio_intro'

const defaultResources: Resource[] = []

const legacyPlaceholderResourceTitles = new Set([
  'IoT Project Starter Guide',
  'PCB Design Checklist',
  'ESP32 Project Template',
])

function normalizeResources(data: unknown): Resource[] {
  if (!Array.isArray(data)) return defaultResources

  return data.filter((item): item is Resource => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as Partial<Resource>
    const legacyPlaceholder =
      Boolean(candidate.title && legacyPlaceholderResourceTitles.has(candidate.title)) &&
      candidate.fileUrl === '#coming-soon'
    return !legacyPlaceholder
  })
}

function saveResourcesToServer(data: Resource[]) {
  void persistPortfolioData('resources', data).catch(error => console.error('Failed to save resources:', error))
}

function saveAudioToServer(url: string) {
  void persistPortfolioData('audio', url).catch(error => console.error('Failed to save audio:', error))
}

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [audioIntroUrl, setAudioIntroUrlState] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolio-data?key=resources', { cache: 'no-store' }).then(r => r.json()).catch(() => null),
      fetch('/api/portfolio-data?key=audio', { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]).then(([resourcesData, audioData]) => {
      setResources(normalizeResources(resourcesData))

      if (typeof audioData === 'string' && audioData) {
        setAudioIntroUrlState(audioData)
      } else {
        setAudioIntroUrlState('')
      }
    }).finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources))
    }
  }, [resources, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(AUDIO_STORAGE_KEY, audioIntroUrl)
    }
  }, [audioIntroUrl, isLoaded])

  const addResource = (resource: Omit<Resource, 'id' | 'downloads' | 'createdAt'>) => {
    const newResource: Resource = { ...resource, id: Date.now().toString(), downloads: 0, createdAt: new Date().toISOString() }
    setResources(prev => {
      const updated = [newResource, ...prev]
      saveResourcesToServer(updated)
      return updated
    })
  }

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      saveResourcesToServer(updated)
      return updated
    })
  }

  const deleteResource = (id: string) => {
    setResources(prev => {
      const updated = prev.filter(r => r.id !== id)
      saveResourcesToServer(updated)
      return updated
    })
  }

  const setAudioIntroUrl = (url: string) => {
    setAudioIntroUrlState(url)
    saveAudioToServer(url)
  }

  return (
    <ResourcesContext.Provider value={{
      resources,
      addResource,
      updateResource,
      deleteResource,
      audioIntroUrl,
      setAudioIntroUrl,
    }}>
      {children}
    </ResourcesContext.Provider>
  )
}

export function useResources() {
  const context = useContext(ResourcesContext)
  if (!context) {
    throw new Error('useResources must be used within a ResourcesProvider')
  }
  return context
}
