'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface InstitutionalProgram {
  id: string
  institution: string
  shortName?: string
  website?: string
  programme: string
  myRole: string
  description: string
  technologies: string[]
  learningObjectives: string[]
  status: string
  image?: string
}

export const defaultInstitutionalPrograms: InstitutionalProgram[] = [
  {
    id: 'lics',
    institution: 'Lusaka International Community School',
    shortName: 'LICS',
    website: 'https://lics.sch.zm/',
    programme: 'Robotics / engineering learning programme involvement through Robotix Institute',
    myRole: 'STEM project planning and technical support',
    description: 'Contributes through Robotix Institute to planning and supporting practical robotics, coding and engineering-learning activities. Specific programme names, dates and learner numbers remain to be confirmed before publication.',
    technologies: [],
    learningObjectives: [],
    status: 'Programme context verified · details to confirm',
  },
  {
    id: 'aisl',
    institution: 'American International School of Lusaka',
    shortName: 'AISL',
    website: 'https://www.aislusaka.org/',
    programme: 'Robotics / engineering learning programme involvement through Robotix Institute',
    myRole: 'STEM project planning and technical support',
    description: 'Contributes through Robotix Institute to planning and supporting practical robotics, coding and engineering-learning activities. Specific programme names, dates and learner numbers remain to be confirmed before publication.',
    technologies: [],
    learningObjectives: [],
    status: 'Programme context verified · details to confirm',
  },
  {
    id: 'isl',
    institution: 'International School of Lusaka',
    shortName: 'ISL',
    website: 'https://www.isl.sch.zm/',
    programme: 'Robotics / engineering learning programme involvement through Robotix Institute',
    myRole: 'STEM project planning and technical support',
    description: 'Contributes through Robotix Institute to planning and supporting practical robotics, coding and engineering-learning activities. Specific programme names, dates and learner numbers remain to be confirmed before publication.',
    technologies: [],
    learningObjectives: [],
    status: 'Programme context verified · details to confirm',
  },
  {
    id: 'bongohive',
    institution: 'BongoHive',
    shortName: 'BongoHive',
    website: 'https://bongohive.co.zm/',
    programme: 'Technology / engineering programme involvement through Robotix Institute',
    myRole: 'Technical project planning and programme support',
    description: 'Contributes through Robotix Institute to technical programme planning and support connected with the institution. Specific activity names, dates and outcomes remain to be confirmed before publication.',
    technologies: [],
    learningObjectives: [],
    status: 'Programme context verified · details to confirm',
  },
]

interface InstitutionalProgramsContextValue {
  programs: InstitutionalProgram[]
  isLoading: boolean
  savePrograms: (programs: InstitutionalProgram[]) => Promise<void>
}

const InstitutionalProgramsContext = createContext<InstitutionalProgramsContextValue | undefined>(undefined)

export function InstitutionalProgramsProvider({ children }: { children: ReactNode }) {
  const [programs, setProgramsState] = useState<InstitutionalProgram[]>(defaultInstitutionalPrograms)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=institutionalPrograms', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setProgramsState(data)
        else setProgramsState(defaultInstitutionalPrograms)
      })
      .catch(() => setProgramsState(defaultInstitutionalPrograms))
      .finally(() => setIsLoading(false))
  }, [])

  const savePrograms = async (next: InstitutionalProgram[]) => {
    await persistPortfolioData('institutionalPrograms', next)
    setProgramsState(next)
  }

  return (
    <InstitutionalProgramsContext.Provider value={{ programs, isLoading, savePrograms }}>
      {children}
    </InstitutionalProgramsContext.Provider>
  )
}

export function useInstitutionalPrograms() {
  const context = useContext(InstitutionalProgramsContext)
  if (!context) throw new Error('useInstitutionalPrograms must be used within InstitutionalProgramsProvider')
  return context
}
