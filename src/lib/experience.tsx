'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
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
    id: 'robotix-institute',
    company: 'Robotix Institute',
    position: 'Robotics & IoT Engineer | Technical Project Manager',
    location: 'Lusaka, Zambia',
    startDate: '',
    endDate: '',
    current: true,
    description:
      'Plan, develop and coordinate robotics, IoT, embedded-systems and technology projects, including engineering prototypes, research and development activities and project-based STEM programmes.',
    achievements: [
      'Design and troubleshoot robotics, IoT and embedded systems using Arduino, ESP32, sensors, motors and wireless communication technologies.',
      'Translate project requirements into technical scope, architecture, component lists, implementation stages, timelines, risks and testing plans.',
      'Support R&D work involving robotics, IoT, AI-enabled systems, automation, assistive technology and experimental prototypes.',
      'Plan practical robotics, programming and electronics projects for learners by defining learning objectives, technology choices, project stages and validation activities.',
      'Support STEM programmes involving schools and technology institutions through technical preparation, troubleshooting and programme improvement.',
      'Coordinate technical activities with team members, students and stakeholders and prepare project documentation, reports and implementation plans.',
      'Contribute to Robotix Institute website and digital-platform development and improvement.',
    ],
  },
  {
    id: 'independent-systems-work',
    company: 'Independent / Client Projects',
    position: 'Full-Stack Systems Developer | IoT & Electronics Projects',
    location: 'Lusaka, Zambia',
    startDate: '',
    endDate: '',
    current: true,
    description:
      'Develop software, mobile, web, IoT and automation systems for client and independent projects, with emphasis on practical requirements, integration and deployment.',
    achievements: [
      'Build full-stack web systems, APIs, authentication flows, dashboards and cloud deployments.',
      'Develop React Native / Expo mobile applications for Android and iOS workflows.',
      'Integrate ESP32 and Arduino hardware with sensors, communications modules, APIs and user-facing applications.',
    ],
  },
  {
    id: 'tap-code-robotic',
    company: 'Tap Code Robotic',
    position: 'Project Manager',
    location: 'Lusaka, Zambia',
    startDate: '2022',
    endDate: '2024',
    current: false,
    description:
      'Planned and supported practical robotics and web-development learning activities, including project structure, curriculum preparation and hands-on technical delivery.',
    achievements: [
      'Structured practical robotics and web-development workshops for learners.',
      'Prepared project-based learning activities and supported hands-on technology training.',
      'Developed a smart-house prototype as part of practical IoT and embedded-systems work.',
    ],
  },
  {
    id: 'almajeed-janmotors',
    company: 'Almajeed Janmotors Co. Ltd',
    position: 'Company Secretary / ICT Support',
    location: 'Lusaka, Zambia',
    startDate: '2024',
    endDate: 'Feb 2025',
    current: false,
    description:
      'Supported company records, office operations and day-to-day ICT needs alongside inventory, customer-service and digital-system support.',
    achievements: [
      'Maintained company records and operational documentation.',
      'Supported computers and digital systems used in day-to-day operations.',
      'Assisted inventory, customer service and digital communication activities.',
    ],
  },
]

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined)

const legacyUnsupportedExperienceIds = new Set(['freelance-iot', 'technical-education'])

function mergeExperienceData(data: unknown): Experience[] {
  if (!Array.isArray(data)) return defaultExperiences

  const incoming = data.filter(
    (item): item is Experience => Boolean(item && typeof item === 'object' && 'id' in item)
  )
  const cleaned = incoming.filter(item => !legacyUnsupportedExperienceIds.has(item.id))
  const incomingById = new Map(cleaned.map(item => [item.id, item]))
  const defaults = defaultExperiences.map(item => {
    const saved = incomingById.get(item.id)
    return saved ? { ...item, ...saved } : item
  })
  const defaultIds = new Set(defaultExperiences.map(item => item.id))
  const custom = cleaned.filter(item => !defaultIds.has(item.id))

  return [...defaults, ...custom]
}

function saveToServer(data: Experience[]) {
  void persistPortfolioData('experiences', data).catch(error => console.error('Failed to save experiences:', error))
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=experiences', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setExperiences(mergeExperienceData(data))
      })
      .catch(() => {
        setExperiences(defaultExperiences)
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
