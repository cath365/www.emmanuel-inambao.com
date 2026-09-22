'use client'

import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Profile {
  name: string
  title: string
  subtitle: string
  bio: string
  location: string
  email: string
  phone: string
  image: string
  coverImage?: string
  cv?: string
  status: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
}

const defaultProfile: Profile = {
  name: 'Emmanuel Inambao',
  title: 'Embedded Systems | IoT & Robotics',
  subtitle: 'Full-Stack Systems Engineer',
  bio: 'I build complete technology systems across embedded electronics, firmware, APIs, mobile and web applications, and cloud infrastructure. My work focuses on practical AI, IoT and robotics solutions designed for real-world conditions, including unreliable connectivity and constrained hardware.',
  location: 'Lusaka, Zambia',
  email: 'denuelinambao@gmail.com',
  phone: '+260 973 914 432',
  image: '/images/profile/profile.jpg',
  coverImage: '',
  cv: '/cv/emmanuel-inambao-cv.pdf',
  status: 'Available for Engineering Projects',
  socialLinks: {
    github: 'https://github.com/cath365',
    linkedin: 'https://linkedin.com/in/emmanuelinambao',
    twitter: '',
    website: 'https://emmanuelinambao.com',
  },
}

interface ProfileContextType {
  profile: Profile
  updateProfile: (profile: Partial<Profile>) => void
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio_profile'

function saveToServer(data: Profile) {
  void persistPortfolioData('profile', data).catch(error => console.error('Failed to save profile:', error))
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=profile')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setProfile({ ...defaultProfile, ...data })
        } else {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            try { setProfile({ ...defaultProfile, ...JSON.parse(stored) }) } catch {}
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try { setProfile({ ...defaultProfile, ...JSON.parse(stored) }) } catch {}
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Cache to localStorage for fast subsequent loads
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }
  }, [profile, isLoading])

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates }
      saveToServer(updated)
      return updated
    })
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
