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
  phone: '+260 XXX XXX XXX',
  image: '/images/profile/profile.jpg',
  coverImage: '',
  cv: '',
  status: 'Available for Engineering Projects',
  socialLinks: {
    github: 'https://github.com/einambao',
    linkedin: 'https://linkedin.com/in/einambao',
    twitter: '',
    website: '',
  },
}

interface ProfileContextType {
  profile: Profile
  updateProfile: (profile: Partial<Profile>) => void
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio_profile'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProfile({ ...defaultProfile, ...parsed })
      } catch {
        // Keep default
      }
    }
    setIsLoading(false)
  }, [])

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }
  }, [profile, isLoading])

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
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
