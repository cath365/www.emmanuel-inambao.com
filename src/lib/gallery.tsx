'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GalleryItem {
  id: string
  title: string
  description: string
  url: string
  type: 'image' | 'video'
  category: 'project' | 'workshop' | 'event' | 'prototype' | 'other'
  featured: boolean
  projectId?: string
  createdAt: string
}

interface GalleryContextType {
  items: GalleryItem[]
  addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => Promise<void>
  updateItem: (id: string, item: Partial<GalleryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

const GalleryContext = createContext<GalleryContextType | null>(null)

const STORAGE_KEY = 'portfolio_gallery'

const defaultItems: GalleryItem[] = []

const legacyPlaceholderGalleryTitles = new Set([
  'Smart Agriculture System',
  'Industrial Robot Arm',
  'PCB Design Workshop',
  'Drone Navigation System',
  'ESP32 Development Board',
  'Tech Conference Speaker',
])

function normalizeGalleryData(data: unknown): GalleryItem[] {
  if (!Array.isArray(data)) return defaultItems

  return data.filter((item): item is GalleryItem => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as Partial<GalleryItem>
    const legacyStockItem =
      Boolean(candidate.title && legacyPlaceholderGalleryTitles.has(candidate.title)) &&
      Boolean(candidate.url?.includes('images.unsplash.com'))
    return !legacyStockItem
  })
}

async function saveToServer(data: GalleryItem[]) {
  await persistPortfolioData('gallery', data)
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>(defaultItems)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=gallery', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setItems(normalizeGalleryData(data))
      })
      .catch(() => {
        setItems(defaultItems)
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = async (item: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }
    const updated = [newItem, ...items]
    await saveToServer(updated)
    setItems(updated)
  }

  const updateItem = async (id: string, updates: Partial<GalleryItem>) => {
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item)
    await saveToServer(updated)
    setItems(updated)
  }

  const deleteItem = async (id: string) => {
    const updated = items.filter(item => item.id !== id)
    await saveToServer(updated)
    setItems(updated)
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
