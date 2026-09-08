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

const defaultTestimonials: Testimonial[] = []

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined)

function saveToServer(data: Testimonial[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'testimonials', data }),
  }).catch(e => console.error('Failed to save testimonials:', e))
}

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=testimonials')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data.map((t: Testimonial) => ({ ...t, status: t.status || 'approved' })))
        } else {
          const saved = localStorage.getItem('portfolio-testimonials')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              const mapped = parsed.map((t: Testimonial) => ({ ...t, status: t.status || 'approved' }))
              setTestimonials(mapped.length > 0 ? mapped : defaultTestimonials)
            } catch { setTestimonials(defaultTestimonials) }
          } else {
            setTestimonials(defaultTestimonials)
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('portfolio-testimonials')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            const mapped = parsed.map((t: Testimonial) => ({ ...t, status: t.status || 'approved' }))
            setTestimonials(mapped.length > 0 ? mapped : defaultTestimonials)
          } catch { setTestimonials(defaultTestimonials) }
        } else {
          setTestimonials(defaultTestimonials)
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio-testimonials', JSON.stringify(testimonials))
    }
  }, [testimonials, isLoaded])

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => {
      const updated = [testimonial, ...prev]
      saveToServer(updated)
      return updated
    })
  }

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t)
      saveToServer(updated)
      return updated
    })
  }

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  const approveTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status: 'approved' as const } : t)
      saveToServer(updated)
      return updated
    })
  }

  const rejectTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t)
      saveToServer(updated)
      return updated
    })
  }

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
