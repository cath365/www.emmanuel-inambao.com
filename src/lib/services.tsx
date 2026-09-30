'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
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

const defaultServices: Service[] = [
  {
    id: 'iot-systems',
    title: 'Robotics & IoT Systems',
    description: 'Plan and develop connected or automated systems where sensors, controllers, communication and software need to work together in a real operating environment.',
    icon: 'wifi',
    features: ['ESP32 / Arduino systems', 'Sensor and actuator integration', 'Wireless communication', 'Remote monitoring and alerts', 'Prototype testing and iteration'],
    featured: true,
  },
  {
    id: 'embedded-firmware',
    title: 'Embedded Systems & Prototyping',
    description: 'Develop and troubleshoot embedded electronics, firmware and control logic for prototypes, smart devices and robotics projects.',
    icon: 'cpu',
    features: ['Embedded control logic', 'Motor and servo control', 'GSM / Bluetooth / Wi-Fi integration', 'Hardware-software troubleshooting', 'System testing'],
    featured: true,
  },
  {
    id: 'web-development',
    title: 'Full-Stack Software Systems',
    description: 'Build web platforms, APIs, dashboards and admin systems around a defined workflow or operational problem rather than treating the website itself as the goal.',
    icon: 'code',
    features: ['Next.js & React', 'REST APIs', 'Authentication and authorization', 'PostgreSQL / Prisma', 'Dashboards and admin workflows'],
    featured: true,
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Application Development',
    description: 'Develop React Native / Expo applications for Android and iOS workflows, including API integration, testing and production-release preparation.',
    icon: 'smartphone',
    features: ['React Native & Expo', 'Android and iOS', 'API integration', 'Mobile UX', 'Release and deployment support'],
    featured: false,
  },
  {
    id: 'technical-project-management',
    title: 'Technical Project Planning & Management',
    description: 'Turn a technical idea or operational problem into requirements, scope, architecture, components, milestones, risks, testing and an implementation plan.',
    icon: 'settings',
    features: ['Requirements and scope', 'Architecture planning', 'Component and budget planning', 'Timeline and milestones', 'Testing and delivery planning'],
    featured: true,
  },
  {
    id: 'stem-programs',
    title: 'STEM Engineering Project Planning',
    description: 'Plan project-based robotics, coding and electronics activities that connect a practical build to clear learning objectives and validation.',
    icon: 'zap',
    features: ['Learning objectives', 'Project selection', 'Component planning', 'Stage-by-stage delivery', 'Testing and programme improvement'],
    featured: false,
  },
]

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

const legacyServiceIds = new Set([
  'iot-systems',
  'embedded-firmware',
  'web-development',
  'robotics',
  'consulting',
])

function normalizeServiceData(data: unknown): Service[] {
  if (!Array.isArray(data) || data.length === 0) return defaultServices

  const services = data.filter(
    (item): item is Service => Boolean(item && typeof item === 'object' && 'id' in item)
  )
  const looksLikeLegacyDefaults =
    services.some(item => item.id === 'iot-systems' && item.title === 'IoT System Design & Development' && item.price === 'From $500') ||
    services.some(item => item.id === 'embedded-firmware' && item.title === 'Embedded Systems & Firmware' && item.price === 'From $300')

  if (!looksLikeLegacyDefaults) return services

  const custom = services.filter(item => !legacyServiceIds.has(item.id))
  return [...defaultServices, ...custom]
}

function saveToServer(data: Service[]) {
  void persistPortfolioData('services', data).catch(error => console.error('Failed to save services:', error))
}

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=services', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setServices(normalizeServiceData(data))
      })
      .catch(() => {
        setServices(defaultServices)
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
