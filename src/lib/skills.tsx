'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface SkillItem {
  name: string
  level: number
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  color: string
  skills: SkillItem[]
}

const defaultSkillCategories: SkillCategory[] = [
  {
    id: 'hardware',
    title: 'Hardware & Embedded',
    description: 'Physical systems and microcontroller development',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Arduino', level: 95 },
      { name: 'ESP32', level: 90 },
      { name: 'Ultrasonic Sensors', level: 92 },
      { name: 'Relays & Switching', level: 88 },
      { name: 'L298N Motor Driver', level: 85 },
      { name: 'Servo & DC Motors', level: 90 },
      { name: 'Power Regulation (12V→5V/9V)', level: 85 },
      { name: 'PCB Design Basics', level: 75 },
    ],
  },
  {
    id: 'software',
    title: 'Software & Web',
    description: 'Frontend, backend, and full-stack development',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Next.js', level: 88 },
      { name: 'React', level: 90 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'JavaScript', level: 92 },
      { name: 'TypeScript', level: 80 },
      { name: 'REST APIs', level: 88 },
      { name: 'Admin Dashboards', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    id: 'iot',
    title: 'IoT & Networking',
    description: 'Connected devices and communication protocols',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Wi-Fi AP/STA Modes', level: 92 },
      { name: 'Local Web Servers', level: 90 },
      { name: 'Offline-First Systems', level: 88 },
      { name: 'MQTT Protocol', level: 82 },
      { name: 'HTTP/HTTPS', level: 90 },
      { name: 'Firebase Integration', level: 78 },
      { name: 'WebSocket', level: 80 },
      { name: 'Serial Communication', level: 88 },
    ],
  },
  {
    id: 'security',
    title: 'Security & Systems',
    description: 'Secure design and access control',
    color: 'from-amber-500 to-orange-500',
    skills: [
      { name: 'Authentication Systems', level: 85 },
      { name: 'Role-Based Access Control', level: 88 },
      { name: 'Offline Validation', level: 90 },
      { name: 'Secure Device Logic', level: 85 },
      { name: 'Data Encryption Basics', level: 75 },
      { name: 'Secure OTA Updates', level: 72 },
    ],
  },
]

interface SkillsContextType {
  skillCategories: SkillCategory[]
  setSkillCategories: (categories: SkillCategory[]) => void
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void
  isLoading: boolean
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio_skills'

function saveToServer(data: SkillCategory[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'skills', data }),
  }).catch(e => console.error('Failed to save skills:', e))
}

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skillCategories, setSkillCategoriesState] = useState<SkillCategory[]>(defaultSkillCategories)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=skills')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSkillCategoriesState(data)
        } else {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            try {
              setSkillCategoriesState(JSON.parse(stored))
            } catch {
              // Ignore corrupted local storage.
            }
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            setSkillCategoriesState(JSON.parse(stored))
          } catch {
            // Ignore corrupted local storage.
          }
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skillCategories))
    }
  }, [skillCategories, isLoading])

  const setSkillCategories = (categories: SkillCategory[]) => {
    setSkillCategoriesState(categories)
    saveToServer(categories)
  }

  const updateSkillCategory = (id: string, updates: Partial<SkillCategory>) => {
    setSkillCategoriesState(prev => {
      const updated = prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
      saveToServer(updated)
      return updated
    })
  }

  return (
    <SkillsContext.Provider value={{ skillCategories, setSkillCategories, updateSkillCategory, isLoading }}>
      {children}
    </SkillsContext.Provider>
  )
}

export function useSkills() {
  const context = useContext(SkillsContext)
  if (!context) {
    throw new Error('useSkills must be used within a SkillsProvider')
  }
  return context
}
