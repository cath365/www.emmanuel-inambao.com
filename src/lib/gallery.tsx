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

const defaultItems: GalleryItem[] = []

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
