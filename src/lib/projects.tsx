'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { defaultProjects, mergeWithCurrentCatalog, type Project } from '@/lib/project-catalog'

export type { Project } from '@/lib/project-catalog'

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, 'id'>) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProject: (id: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

async function saveToServer(data: Project[]) {
  await persistPortfolioData('projects', data)
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=projects', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(mergeWithCurrentCatalog(data))
        } else {
          setProjects(defaultProjects)
        }
      })
      .catch(() => {
        setProjects(defaultProjects)
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem('portfolio_projects', JSON.stringify(projects))
  }, [projects, isLoaded])

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: 'project-' + Date.now() }
    const updated = [...projects, newProject]
    await saveToServer(updated)
    setProjects(updated)
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = projects.map(project => project.id === id ? { ...project, ...updates } : project)
    await saveToServer(updated)
    setProjects(updated)
  }

  const deleteProject = async (id: string) => {
    const updated = projects.filter(project => project.id !== id)
    await saveToServer(updated)
    setProjects(updated)
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
