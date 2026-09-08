'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    id: 'independent-systems',
    company: 'Independent Engineering Projects',
    position: 'Systems Engineer & Full-Stack Developer',
    location: 'Lusaka, Zambia',
    startDate: '2021-01',
    endDate: '',
    current: true,
    description: 'Design and build embedded, IoT, robotics and web systems that connect physical devices with useful software workflows.',
    achievements: [
      'Embedded and IoT prototyping with ESP32, sensors, actuators and offline control',
      'Web dashboards, APIs and operational platforms using modern full-stack tools',
      'Technical scoping, testing, documentation and client-facing system design',
    ],
  },
  {
    id: 'technical-education',
    company: 'Technical Education Programs',
    position: 'Robotics & Electronics Instructor',
    location: 'Lusaka, Zambia',
    startDate: '2020-01',
    endDate: '',
    current: true,
    description: 'Teach project-based robotics, electronics and microcontroller fundamentals with an emphasis on hands-on building and debugging.',
    achievements: [
      'Robotics instruction for young learners ages 6–16',
      'Arduino, breadboard and electronics project lessons',
      'Mentorship through wiring, coding, testing and presentation',
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
