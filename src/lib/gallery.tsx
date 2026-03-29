'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GalleryItem {
  id: string
  title: string
  description: string
  url: string
  type: 'image' | 'video'
  category: 'project' | 'workshop' | 'event' | 'prototype' | 'other'
  featured: boolean
  createdAt: string
}

interface GalleryContextType {
  items: GalleryItem[]
  addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void
  updateItem: (id: string, item: Partial<GalleryItem>) => void
  deleteItem: (id: string) => void
}

const GalleryContext = createContext<GalleryContextType | null>(null)

const STORAGE_KEY = 'portfolio_gallery'

const defaultItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Smart Agriculture System',
    description: 'IoT sensors monitoring soil moisture and plant health in real-time',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    type: 'image',
    category: 'project',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Industrial Robot Arm',
    description: 'Custom-built 6-axis robotic arm for precision manufacturing',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    type: 'image',
    category: 'prototype',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'PCB Design Workshop',
    description: 'Teaching students advanced PCB design techniques',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    type: 'image',
    category: 'workshop',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Drone Navigation System',
    description: 'Autonomous drone with AI-powered obstacle avoidance',
    url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    type: 'image',
    category: 'project',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'ESP32 Development Board',
    description: 'Custom ESP32 board for IoT applications',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    type: 'image',
    category: 'prototype',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Tech Conference Speaker',
    description: 'Presenting on IoT innovations at TechSummit 2025',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    type: 'image',
    category: 'event',
    featured: false,
    createdAt: new Date().toISOString(),
  },
]

function saveToServer(data: GalleryItem[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'gallery', data }),
  }).catch(e => console.error('Failed to save gallery:', e))
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>(defaultItems)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=gallery')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        } else {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            try { setItems(JSON.parse(stored)) } catch {}
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try { setItems(JSON.parse(stored)) } catch {}
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setItems(prev => {
      const updated = [newItem, ...prev]
      saveToServer(updated)
      return updated
    })
  }

  const updateItem = (id: string, updates: Partial<GalleryItem>) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updates } : item)
      saveToServer(updated)
      return updated
    })
  }

  const deleteItem = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  return (
    <GalleryContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
}
