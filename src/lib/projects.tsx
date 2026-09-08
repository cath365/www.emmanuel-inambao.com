'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { defaultProjects, mergeWithCurrentCatalog, type Project } from '@/lib/project-catalog'

export type { Project } from '@/lib/project-catalog'

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Project) => void
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
  }).catch(error => console.error('Failed to save projects:', error))
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=projects')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data)
          return
        }

        const stored = localStorage.getItem('portfolio_projects')
        if (stored) {
          try {
            setProjects(mergeWithCurrentCatalog(JSON.parse(stored)))
          } catch {
            setProjects(defaultProjects)
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('portfolio_projects')
        if (!stored) return
        try {
          setProjects(mergeWithCurrentCatalog(JSON.parse(stored)))
        } catch {
          setProjects(defaultProjects)
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('portfolio_projects', JSON.stringify(projects))
  }, [projects, isLoaded])

  const addProject = (project: Project) => {
    const newProject: Project = {
      ...project,
      id: project.id || 'project-' + Date.now(),
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProjects(previous => {
      const updated = [...previous, newProject]
      saveToServer(updated)
      return updated
    })
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(previous => {
      const updated = previous.map(project =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
      saveToServer(updated)
      return updated
    })
  }

  const deleteProject = (id: string) => {
    setProjects(previous => {
      const updated = previous.filter(project => project.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  const getProject = (id: string) => projects.find(project => project.id === id)

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) throw new Error('useProjects must be used within a ProjectsProvider')
  return context
}
