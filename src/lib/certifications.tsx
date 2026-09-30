'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  image?: string
  description?: string
}

interface CertificationContextType {
  certifications: Certification[]
  addCertification: (certification: Certification) => void
  updateCertification: (id: string, certification: Partial<Certification>) => void
  deleteCertification: (id: string) => void
}

const legacyUnsupportedCertificationIds = new Set([
  'cisco-iot',
  'arduino-pro',
  'aws-iot',
  'siemens-plc',
])

const defaultCertifications: Certification[] = [
  {
    id: 'tme-basic-electronics-programming-2023',
    name: 'Basic Electronics and Programming',
    issuer: 'TME Education',
    issueDate: '2023',
    description: 'Certificate of Participation in basic electronics and programming.',
  },
]

const CertificationContext = createContext<CertificationContextType | undefined>(undefined)

function saveToServer(data: Certification[]) {
  void persistPortfolioData('certifications', data).catch(error => console.error('Failed to save certifications:', error))
}

export function CertificationProvider({ children }: { children: ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=certifications', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const verifiedOrCustom = data.filter(
            (item: Certification) => !legacyUnsupportedCertificationIds.has(item.id)
          )
          setCertifications(verifiedOrCustom.length > 0 ? verifiedOrCustom : defaultCertifications)
        } else {
          setCertifications(defaultCertifications)
        }
      })
      .catch(() => {
        setCertifications(defaultCertifications)
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio-certifications', JSON.stringify(certifications))
    }
  }, [certifications, isLoaded])

  const addCertification = (certification: Certification) => {
    setCertifications(prev => {
      const updated = [certification, ...prev]
      saveToServer(updated)
      return updated
    })
  }

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      saveToServer(updated)
      return updated
    })
  }

  const deleteCertification = (id: string) => {
    setCertifications(prev => {
      const updated = prev.filter(c => c.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  return (
    <CertificationContext.Provider value={{ certifications, addCertification, updateCertification, deleteCertification }}>
      {children}
    </CertificationContext.Provider>
  )
}

export function useCertifications() {
  const context = useContext(CertificationContext)
  if (!context) {
    throw new Error('useCertifications must be used within CertificationProvider')
  }
  return context
}
