'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  image?: string
  video?: string
  rating: number
  featured: boolean
  status: 'pending' | 'approved' | 'rejected'
  submittedAt?: string
}

interface TestimonialContextType {
  testimonials: Testimonial[]
  approvedTestimonials: Testimonial[]
  pendingTestimonials: Testimonial[]
  addTestimonial: (testimonial: Testimonial) => void
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
  approveTestimonial: (id: string) => void
  rejectTestimonial: (id: string) => void
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined)

const defaultTestimonials: Testimonial[] = []

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-testimonials')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Migrate old testimonials that don't have status
        const migrated = parsed.map((t: Testimonial) => ({
          ...t,
          status: t.status || 'approved',
        }))
        setTestimonials(migrated)
      } catch (e) {
        console.error('Failed to parse testimonials:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio-testimonials', JSON.stringify(testimonials))
    }
  }, [testimonials, isLoaded])

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev])
  }

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  const approveTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' as const } : t))
  }

  const rejectTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t))
  }

  // Only show approved testimonials publicly
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved')
  const pendingTestimonials = testimonials.filter(t => t.status === 'pending')

  return (
    <TestimonialContext.Provider value={{
      testimonials,
      approvedTestimonials,
      pendingTestimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      approveTestimonial,
      rejectTestimonial,
    }}>
      {children}
    </TestimonialContext.Provider>
  )
}

export function useTestimonials() {
  const context = useContext(TestimonialContext)
  if (!context) {
    throw new Error('useTestimonials must be used within TestimonialProvider')
  }
  return context
}
