'use client'

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

const defaultCertifications: Certification[] = [
  {
    id: 'cisco-iot',
    name: 'Certified IoT Developer',
    issuer: 'Cisco Networking Academy',
    issueDate: '2022-06',
    description: 'IoT fundamentals, networking, security, and data analytics for connected devices.',
  },
  {
    id: 'arduino-pro',
    name: 'Arduino Professional Certification',
    issuer: 'Arduino',
    issueDate: '2022-03',
    description: 'Advanced embedded programming, sensor integration, and system design with Arduino platforms.',
  },
  {
    id: 'aws-iot',
    name: 'AWS IoT Core Fundamentals',
    issuer: 'Amazon Web Services',
    issueDate: '2023-01',
    description: 'Cloud-connected IoT architectures using AWS IoT Core, Greengrass, and device shadows.',
  },
  {
    id: 'siemens-plc',
    name: 'PLC Programming — Siemens TIA Portal',
    issuer: 'Siemens',
    issueDate: '2023-04',
    description: 'Industrial automation programming with Siemens S7 PLCs and TIA Portal engineering framework.',
  },
]

const CertificationContext = createContext<CertificationContextType | undefined>(undefined)

function saveToServer(data: Certification[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'certifications', data }),
  }).catch(e => console.error('Failed to save certifications:', e))
}

export function CertificationProvider({ children }: { children: ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=certifications')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCertifications(data)
        } else {
          const saved = localStorage.getItem('portfolio-certifications')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              setCertifications(parsed.length > 0 ? parsed : defaultCertifications)
            } catch { setCertifications(defaultCertifications) }
          } else {
            setCertifications(defaultCertifications)
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('portfolio-certifications')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setCertifications(parsed.length > 0 ? parsed : defaultCertifications)
          } catch { setCertifications(defaultCertifications) }
        } else {
          setCertifications(defaultCertifications)
        }
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
