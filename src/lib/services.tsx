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

const defaultServices: Service[] = [
  {
    id: 'iot-systems',
    title: 'IoT System Design & Development',
    description: 'End-to-end IoT solutions — from sensor selection and PCB design to cloud dashboards. Specializing in ESP32, LoRa, and MQTT-based architectures for agriculture, industry, and smart buildings.',
    icon: 'wifi',
    features: ['Custom sensor networks', 'Real-time dashboards', 'MQTT & LoRa connectivity', 'Offline-first design', 'Remote OTA updates'],
    price: 'From $500',
    featured: true,
  },
  {
    id: 'embedded-firmware',
    title: 'Embedded Systems & Firmware',
    description: 'Low-level firmware for microcontrollers (ESP32, STM32, Arduino). Motor control, sensor fusion, communication protocols, and power-optimized designs for battery-operated devices.',
    icon: 'cpu',
    features: ['ESP32 / STM32 / Arduino', 'Custom PCB design (KiCad)', 'Motor & actuator control', 'Power optimization', 'Communication protocols'],
    price: 'From $300',
    featured: true,
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    description: 'Modern web applications with Next.js, React, and TypeScript. Real-time data visualization dashboards, admin panels, and progressive web apps optimized for performance and SEO.',
    icon: 'code',
    features: ['Next.js & React', 'TypeScript', 'REST & WebSocket APIs', 'Responsive design', 'SEO optimization'],
    price: 'From $400',
    featured: true,
  },
  {
    id: 'robotics',
    title: 'Robotics & Automation',
    description: 'Custom robotic systems for industrial and educational use. From concept to deployment — mechanical design, motor control, sensor integration, and web-based remote operation interfaces.',
    icon: 'settings',
    features: ['Industrial automation', 'Conveyor & sorting systems', 'Web-controlled robots', 'Safety interlocks', 'PLC programming'],
    price: 'From $800',
    featured: false,
  },
  {
    id: 'consulting',
    title: 'Technical Consulting & Training',
    description: 'Expert guidance for IoT projects, embedded systems architecture, and technical team training. Curriculum development for educational institutions and hands-on workshops.',
    icon: 'zap',
    features: ['Architecture review', 'Technology selection', 'Team training', 'Curriculum development', 'Project mentorship'],
    price: 'From $100/hr',
    featured: false,
  },
]

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
        if (Array.isArray(data) && data.length > 0) {
          setServices(data)
        } else {
          const saved = localStorage.getItem('portfolio-services')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              setServices(parsed.length > 0 ? parsed : defaultServices)
            } catch { setServices(defaultServices) }
          } else {
            setServices(defaultServices)
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('portfolio-services')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setServices(parsed.length > 0 ? parsed : defaultServices)
          } catch { setServices(defaultServices) }
        } else {
          setServices(defaultServices)
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
