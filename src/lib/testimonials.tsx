'use client'

import { useAuth } from '@/lib/auth'
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
  loadError: string
  approvedTestimonials: Testimonial[]
  pendingTestimonials: Testimonial[]
  addTestimonial: (testimonial: Testimonial) => Promise<void>
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>
  deleteTestimonial: (id: string) => Promise<void>
  approveTestimonial: (id: string) => Promise<void>
  rejectTestimonial: (id: string) => Promise<void>
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined)

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadError, setLoadError] = useState('')
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const response = await fetch('/api/testimonials', { cache: 'no-store' })
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload)) throw new Error(payload?.error || 'Could not load testimonials.')
        if (active) { setTestimonials(payload); setLoadError('') }
      } catch (error) { if (active) setLoadError(error instanceof Error ? error.message : 'Could not load testimonials.') }
    }
    refresh()
    window.addEventListener('focus', refresh)
    return () => { active = false; window.removeEventListener('focus', refresh) }
  }, [isAuthenticated])

  const save = async (testimonial: Testimonial) => {
    const response = await fetch('/api/testimonials', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testimonial }) })
    const result = await response.json()
    if (!response.ok || !result.success) throw new Error(result.error || 'Could not save testimonial.')
    setTestimonials(previous => [testimonial, ...previous.filter(item => item.id !== testimonial.id)])
  }
  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const existing = testimonials.find(item => item.id === id)
    if (!existing) throw new Error('Testimonial not found.')
    await save({ ...existing, ...updates })
  }
  const deleteTestimonial = async (id: string) => {
    const response = await fetch('/api/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const result = await response.json()
    if (!response.ok || !result.success) throw new Error(result.error || 'Could not delete testimonial.')
    setTestimonials(previous => previous.filter(item => item.id !== id))
  }
  return <TestimonialContext.Provider value={{
    testimonials, loadError,
    approvedTestimonials: testimonials.filter(item => item.status === 'approved'),
    pendingTestimonials: testimonials.filter(item => item.status === 'pending'),
    addTestimonial: save, updateTestimonial, deleteTestimonial,
    approveTestimonial: id => updateTestimonial(id, { status: 'approved' }),
    rejectTestimonial: id => updateTestimonial(id, { status: 'rejected' }),
  }}>{children}</TestimonialContext.Provider>
}

export function useTestimonials() {
  const context = useContext(TestimonialContext)
  if (!context) {
    throw new Error('useTestimonials must be used within TestimonialProvider')
  }
  return context
}
