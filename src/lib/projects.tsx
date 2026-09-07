'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'\nimport { showcaseProjects } from '@/data/portfolio'

export interface Project {
  id: string
  title: string
  purpose: string
  image: string
  techStack: string[]
  problemSolved: string
  systemLogic: string
  outcome: string
  featured: boolean
  githubUrl?: string
  liveUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  websiteUrl?: string
  docsUrl?: string
  videoUrl?: string
}

const defaultProjects: Project[] = showcaseProjects.map((project, index) => ({
  id: project.slug,
  title: project.name,
  purpose: project.description,
  image: '',
  techStack: project.caseStudy.technologies,
  problemSolved: project.caseStudy.problem,
  systemLogic: project.caseStudy.workflow.join(' '),
  outcome: 'Current status: ' + project.caseStudy.status,
  featured: index < 3,
}))

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

function saveToServer(data: Project[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'projects', data }),
  }).catch(e => console.error('Failed to save projects:', e))
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data)
        } else {
          const stored = localStorage.getItem('portfolio_projects')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed)
            } catch {}
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('portfolio_projects')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed)
          } catch {}
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects))
    }
  }, [projects, isLoaded])

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: `project-${Date.now()}` }
    setProjects(prev => {
      const updated = [...prev, newProject]
      saveToServer(updated)
      return updated
    })
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveToServer(updated)
      return updated
    })
  }

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  const getProject = (id: string) => projects.find(p => p.id === id)

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
