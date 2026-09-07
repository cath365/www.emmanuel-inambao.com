'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'\nimport { professionalRoles } from '@/data/portfolio'

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
  logo?: string
}

interface ExperienceContextType {
  experiences: Experience[]
  addExperience: (experience: Experience) => void
  updateExperience: (id: string, experience: Partial<Experience>) => void
  deleteExperience: (id: string) => void
}

const defaultExperiences: Experience[] = [
  {
    id: 'freelance-iot',
    company: 'Freelance / Independent Consultant',
    position: 'Lead IoT Engineer & Full-Stack Developer',
    location: 'Lusaka, Zambia',
    startDate: '2021-01',
    endDate: '',
    current: true,
    description: 'Design and deploy IoT systems for agricultural monitoring, industrial automation, and smart buildings. Build full-stack web applications for real-time data visualization.',
    achievements: [
      'Designed and deployed 15+ IoT systems for agriculture, industry, and smart buildings',
      'Built full-stack web applications using Next.js, React, and Node.js',
      'Developed custom PCB designs and embedded firmware for ESP32 and STM32',
      'Implemented MQTT networks supporting 500+ concurrent sensor nodes',
      'Reduced client energy costs by 35% through smart automation',
    ],
  },
  {
    id: 'technical-education',
    company: 'Technical Education Programs',
    position: 'Electronics Instructor & Technical Mentor',
    location: 'Lusaka, Zambia',
    startDate: '2020-01',
    endDate: '',
    current: true,
    description: 'Teach embedded systems, PCB design, and IoT development. Mentor junior engineers through project-based learning.',
    achievements: [
      'Trained 200+ students in embedded systems, PCB design, and IoT',
      'Created curriculum for Arduino, ESP32, and PLC programming',
      'Mentored 30+ junior engineers through hands-on projects',
      'Developed open-source educational resources used across Zambia',
    ],
  },
]

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined)

function saveToServer(data: Experience[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'experiences', data }),
  }).catch(e => console.error('Failed to save experiences:', e))
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=experiences')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data)
        } else {
          const saved = localStorage.getItem('portfolio-experiences')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              setExperiences(parsed.length > 0 ? parsed : defaultExperiences)
            } catch { setExperiences(defaultExperiences) }
          } else {
            setExperiences(defaultExperiences)
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('portfolio-experiences')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setExperiences(parsed.length > 0 ? parsed : defaultExperiences)
          } catch { setExperiences(defaultExperiences) }
        } else {
          setExperiences(defaultExperiences)
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio-experiences', JSON.stringify(experiences))
    }
  }, [experiences, isLoaded])

  const addExperience = (experience: Experience) => {
    setExperiences(prev => {
      const updated = [experience, ...prev]
      saveToServer(updated)
      return updated
    })
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(prev => {
      const updated = prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
      saveToServer(updated)
      return updated
    })
  }

  const deleteExperience = (id: string) => {
    setExperiences(prev => {
      const updated = prev.filter(exp => exp.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  return (
    <ExperienceContext.Provider value={{ experiences, addExperience, updateExperience, deleteExperience }}>
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider')
  }
  return context
}
