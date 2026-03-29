'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
  image?: string
  featured: boolean
}

interface ServiceContextType {
  services: Service[]
  addService: (service: Service) => void
  updateService: (id: string, service: Partial<Service>) => void
  deleteService: (id: string) => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

function saveToServer(data: Service[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'services', data }),
  }).catch(e => console.error('Failed to save services:', e))
}

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=services')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          const saved = localStorage.getItem('portfolio-services')
          if (saved) {
            try { setServices(JSON.parse(saved)) } catch {}
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('portfolio-services')
        if (saved) {
          try { setServices(JSON.parse(saved)) } catch {}
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio-services', JSON.stringify(services))
    }
  }, [services, isLoaded])

  const addService = (service: Service) => {
    setServices(prev => {
      const updated = [service, ...prev]
      saveToServer(updated)
      return updated
    })
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s)
      saveToServer(updated)
      return updated
    })
  }

  const deleteService = (id: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  return (
    <ServiceContext.Provider value={{ services, addService, updateService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider')
  }
  return context
}
