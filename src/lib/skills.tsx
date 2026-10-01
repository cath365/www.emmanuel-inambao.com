'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
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
    title: 'Robotics & Embedded Engineering',
    description: 'Microcontrollers, electronics, sensing, motion and physical-system prototyping',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Arduino', level: 85 },
      { name: 'ESP32 / ESP32-CAM', level: 85 },
      { name: 'Sensors', level: 85 },
      { name: 'DC Motors & Servos', level: 80 },
      { name: 'Motor Drivers', level: 80 },
      { name: 'Bluetooth', level: 80 },
      { name: 'Wi-Fi', level: 80 },
      { name: 'GSM / SIM800', level: 80 },
      { name: 'GPS', level: 75 },
      { name: 'Embedded Electronics & Prototyping', level: 85 },
    ],
  },
  {
    id: 'iot',
    title: 'Internet of Things',
    description: 'Connected devices, telemetry, monitoring and device-to-software integration',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Connected Sensors', level: 85 },
      { name: 'Remote Monitoring', level: 80 },
      { name: 'Telemetry', level: 80 },
      { name: 'Device-to-Cloud Communication', level: 80 },
      { name: 'Alerts & Notifications', level: 80 },
      { name: 'IoT Dashboards', level: 80 },
      { name: 'REST IoT APIs', level: 85 },
      { name: 'Offline-First Device Workflows', level: 80 },
    ],
  },
  {
    id: 'software',
    title: 'Software Engineering',
    description: 'Web platforms, APIs, databases, authentication and production systems',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Next.js', level: 85 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'JavaScript', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Prisma', level: 80 },
      { name: 'REST APIs', level: 85 },
      { name: 'Authentication & Authorization', level: 80 },
      { name: 'Admin Systems & Dashboards', level: 85 },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Engineering',
    description: 'Cross-platform application development and mobile deployment workflows',
    color: 'from-indigo-500 to-violet-500',
    skills: [
      { name: 'React Native', level: 80 },
      { name: 'Expo', level: 85 },
      { name: 'Android', level: 80 },
      { name: 'iOS', level: 75 },
      { name: 'Mobile API Integration', level: 80 },
    ],
  },
  {
    id: 'ai-data',
    title: 'AI & Data',
    description: 'Anomaly detection, AI-assisted workflows and data-driven system behaviour where the project problem justifies it',
    color: 'from-slate-500 to-blue-500',
    skills: [
      { name: 'Anomaly Detection', level: 80 },
      { name: 'AI-Assisted Workflows', level: 80 },
      { name: 'Time-Series Analysis', level: 75 },
      { name: 'Rule-Based Decision Logic', level: 85 },
      { name: 'Model/API Integration', level: 80 },
      { name: 'Data Validation & Experimentation', level: 80 },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & Deployment',
    description: 'Production hosting, storage, APIs and deployment workflows that keep software systems usable beyond local development',
    color: 'from-sky-500 to-indigo-500',
    skills: [
      { name: 'Vercel', level: 85 },
      { name: 'Cloud Storage', level: 80 },
      { name: 'API Integrations', level: 85 },
      { name: 'Production Deployment', level: 85 },
      { name: 'Environment Configuration', level: 80 },
      { name: 'Git / GitHub Workflows', level: 85 },
    ],
  },
  {
    id: 'project-management',
    title: 'System Design & Project Delivery',
    description: 'Requirements, scope, architecture, planning, coordination, testing and delivery',
    color: 'from-amber-500 to-orange-500',
    skills: [
      { name: 'Requirements & Scope', level: 85 },
      { name: 'Technical Architecture', level: 85 },
      { name: 'Component & Resource Planning', level: 85 },
      { name: 'Budget Estimation', level: 80 },
      { name: 'Timeline & Milestones', level: 80 },
      { name: 'Risk Identification', level: 80 },
      { name: 'Team / Stakeholder Coordination', level: 80 },
      { name: 'Documentation', level: 85 },
      { name: 'Testing & Delivery Planning', level: 85 },
    ],
  },
  {
    id: 'stem',
    title: 'STEM & Technical Education',
    description: 'Project-based robotics, coding and engineering-learning programme support',
    color: 'from-teal-500 to-cyan-500',
    skills: [
      { name: 'Robotics Project Planning', level: 85 },
      { name: 'Programming Projects', level: 80 },
      { name: 'Electronics Activities', level: 85 },
      { name: 'Engineering Learning Projects', level: 85 },
      { name: 'Learning Objectives & Project Stages', level: 85 },
      { name: 'Practical STEM Programme Support', level: 85 },
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

function normalizeSkillData(data: unknown): SkillCategory[] {
  if (!Array.isArray(data) || data.length === 0) return defaultSkillCategories

  const categories = data.filter(
    (item): item is SkillCategory => Boolean(item && typeof item === 'object' && 'id' in item)
  )
  const looksLikeLegacyDefaults =
    categories.length === 4 &&
    categories.some(item => item.id === 'security' && item.title === 'Security & Systems') &&
    categories.some(item => item.id === 'hardware' && item.title === 'Hardware & Embedded') &&
    categories.some(item => item.id === 'software' && item.title === 'Software & Web')

  if (looksLikeLegacyDefaults) return defaultSkillCategories

  const migrated = categories.map(category =>
    category.id === 'project-management' && category.title === 'Technical Project Management'
      ? { ...category, title: 'System Design & Project Delivery', description: 'Requirements, scope, architecture, planning, coordination, testing and delivery' }
      : category
  )

  const existingIds = new Set(migrated.map(category => category.id))
  const missingProblemFocusedCategories = defaultSkillCategories.filter(category =>
    ['ai-data', 'cloud'].includes(category.id) && !existingIds.has(category.id)
  )

  return [...migrated, ...missingProblemFocusedCategories]
}

function saveToServer(data: SkillCategory[]) {
  void persistPortfolioData('skills', data).catch(error => console.error('Failed to save skills:', error))
}

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skillCategories, setSkillCategoriesState] = useState<SkillCategory[]>(defaultSkillCategories)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=skills', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setSkillCategoriesState(normalizeSkillData(data))
      })
      .catch(() => {
        setSkillCategoriesState(defaultSkillCategories)
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
