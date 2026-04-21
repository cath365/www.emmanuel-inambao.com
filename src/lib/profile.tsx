'use client'

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
  name: 'Prof. Emmanuel Inambao',
  title: 'Electronic Engineer | IoT & Robotics Developer',
  subtitle: 'Full-Stack Systems Engineer',
  bio: 'I design and build intelligent embedded systems that bridge hardware and software to solve real-world problems. From smart agriculture to industrial automation, I engineer solutions that work offline, scale locally, and create measurable impact.',
  location: 'Lusaka, Zambia',
  email: 'denuelinambao@gmail.com',
  phone: '+260 973 914 432',
  image: '/images/profile/profile.jpg',
  coverImage: '',
  cv: '/cv/emmanuel-inambao-cv.pdf',
  status: 'Available for Engineering Projects',
  socialLinks: {
    github: 'https://github.com/bolo3574',
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
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'profile', data }),
  }).catch(e => console.error('Failed to save profile:', e))
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
