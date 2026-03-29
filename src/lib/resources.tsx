'use client'

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

const defaultResources: Resource[] = [
  {
    id: '1',
    title: 'IoT Project Starter Guide',
    description: 'Complete guide to starting your first IoT project, from hardware selection to cloud deployment.',
    type: 'guide',
    fileUrl: '/resources/iot-starter-guide.pdf',
    fileSize: '2.4 MB',
    downloads: 1250,
    icon: '📘',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'PCB Design Checklist',
    description: 'Essential checklist for PCB design review before manufacturing. Avoid common mistakes.',
    type: 'checklist',
    fileUrl: '/resources/pcb-design-checklist.pdf',
    fileSize: '850 KB',
    downloads: 890,
    icon: '✅',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'ESP32 Project Template',
    description: 'Ready-to-use ESP32 project template with WiFi, MQTT, and OTA updates pre-configured.',
    type: 'template',
    fileUrl: '/resources/esp32-template.zip',
    fileSize: '1.2 MB',
    downloads: 2100,
    icon: '📦',
    createdAt: new Date().toISOString(),
  },
]

function saveResourcesToServer(data: Resource[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'resources', data }),
  }).catch(e => console.error('Failed to save resources:', e))
}

function saveAudioToServer(url: string) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'audio', data: url }),
  }).catch(e => console.error('Failed to save audio:', e))
}

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [audioIntroUrl, setAudioIntroUrlState] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolio-data?key=resources').then(r => r.json()).catch(() => null),
      fetch('/api/portfolio-data?key=audio').then(r => r.json()).catch(() => null),
    ]).then(([resourcesData, audioData]) => {
      if (Array.isArray(resourcesData) && resourcesData.length > 0) {
        setResources(resourcesData)
      } else {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try { setResources(JSON.parse(stored)) } catch {}
        }
      }

      if (typeof audioData === 'string' && audioData) {
        setAudioIntroUrlState(audioData)
      } else {
        const storedAudio = localStorage.getItem(AUDIO_STORAGE_KEY)
        if (storedAudio) setAudioIntroUrlState(storedAudio)
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
