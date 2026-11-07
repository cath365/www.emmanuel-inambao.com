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

// Defaults use only real project media from /public/images/projects. Never use stock
// photography here: visitors read every gallery item as Emmanuel's own work.
const defaultItems: GalleryItem[] = [
  {
    id: 'cooking-oil-prototype',
    title: 'Smart Cooking Oil Dispenser',
    description: 'Internal hardware prototype used to validate the embedded dispensing architecture and device integration.',
    url: '/images/projects/cooking-oil-prototype.webp',
    type: 'image',
    category: 'prototype',
    featured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'walking-stick-sensor',
    title: 'AI Smart Walking Stick: sensor prototype',
    description: 'Ultrasonic obstacle-detection sensor prototype used for ranging tests in the assistive-device development work.',
    url: '/images/projects/walking-stick-sensor-prototype.webp',
    type: 'image',
    category: 'prototype',
    featured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'the-spot-app',
    title: 'The Spot App',
    description: 'Production mobile interface showing the home, health-library and cycle-tracking flows.',
    url: '/images/projects/the-spot-hero.webp',
    type: 'image',
    category: 'project',
    featured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'quotation-platform',
    title: 'Astro City CRM quotation platform',
    description: 'Production screens from the quotation and business-operations platform.',
    url: '/images/projects/quotation-platform-hero.webp',
    type: 'image',
    category: 'project',
    featured: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'constituency226',
    title: 'Constituency226',
    description: 'Mobile screens showing civic discovery, candidate information and public-information interfaces.',
    url: '/images/projects/constituency226-hero.webp',
    type: 'image',
    category: 'project',
    featured: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

function saveToServer(data: GalleryItem[]) {
  void persistPortfolioData('gallery', data).catch(error => console.error('Failed to save gallery:', error))
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>(defaultItems)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=gallery', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        } else {
          setItems(defaultItems)
        }
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
