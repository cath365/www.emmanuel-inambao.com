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
  title: 'Robotics & IoT Engineer | Full-Stack Systems Developer | Technical Project Manager',
  subtitle: 'Planning, designing, building and delivering practical technology systems',
  bio: 'I design and build practical technology solutions for real-world problems using software, embedded systems, sensors, automation and AI. My work spans water monitoring, accessibility, education, agriculture, civic technology and business operations, taking projects from problem definition and system design through prototyping, testing, deployment and improvement.',
  location: 'Lusaka, Zambia',
  email: 'denuelinambao@gmail.com',
  phone: '+260 973 914 432',
  image: '/images/profile/profile.jpg',
  coverImage: '',
  cv: '',
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

function normalizeProfileData(data: Partial<Profile> | null | undefined): Profile {
  const merged = { ...defaultProfile, ...(data || {}) }
  const legacyTitles = new Set([
    'Embedded Systems | IoT & Robotics',
    'Electronic Engineer | IoT & Robotics Developer',
    'Electronic Engineer | IoT Developer',
    'Full-Stack Systems Engineer',
  ])

  if (legacyTitles.has(String(data?.title || '').trim())) {
    merged.title = defaultProfile.title
  }
  if (String(data?.subtitle || '').trim() === 'Full-Stack Systems Engineer') {
    merged.subtitle = defaultProfile.subtitle
  }
  if (
    [
      'I build complete technology systems across embedded electronics, firmware, APIs, mobile and web applications, and cloud infrastructure. My work focuses on practical AI, IoT and robotics solutions designed for real-world conditions, including unreliable connectivity and constrained hardware.',
      'I work across robotics, IoT, embedded systems, software engineering and technical project delivery. I take projects from problem definition and requirements through architecture, planning, prototyping, development, testing, deployment and improvement. At Robotix Institute, my work includes engineering, R&D, technical project coordination and project-based STEM programme planning.',
    ].includes(String(data?.bio || '').trim())
  ) {
    merged.bio = defaultProfile.bio
  }
  if (String(data?.cv || '').trim() === '/cv/emmanuel-inambao-cv.pdf') {
    merged.cv = ''
  }

  return merged
}

function saveToServer(data: Profile) {
  void persistPortfolioData('profile', data).catch(error => console.error('Failed to save profile:', error))
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=profile', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setProfile(normalizeProfileData(data))
        } else {
          setProfile(defaultProfile)
        }
      })
      .catch(() => {
        setProfile(defaultProfile)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const refreshProfile = () => {
      fetch('/api/portfolio-data?key=profile', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
          if (data && !data.error) {
            setProfile(normalizeProfileData(data))
          }
        })
        .catch(() => {})
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'portfolio_last_published_change' || !event.newValue) return
      try {
        const change = JSON.parse(event.newValue) as { key?: string }
        if (change.key === 'profile') refreshProfile()
      } catch {}
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
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
