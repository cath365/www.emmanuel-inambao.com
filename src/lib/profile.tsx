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
    tiktok?: string
    youtube?: string
    website?: string
  }
}

const defaultProfile: Profile = {
  name: 'Emmanuel Inambao',
  title: 'Robotics & IoT Engineer | Full-Stack Systems Developer | Technical Project Manager',
  subtitle: 'Planning, designing, building and delivering practical technology systems',
  bio: 'I work across robotics, IoT, embedded systems, software engineering and technical project delivery. I take projects from problem definition and requirements through architecture, planning, prototyping, development, testing, deployment and improvement. At Robotix Institute, my work includes engineering, R&D, technical project coordination and project-based STEM programme planning.',
  location: 'Lusaka, Zambia',
  email: 'denuelinambao@gmail.com',
  phone: '+260 973 914 432',
  // Empty until a photo is uploaded in /admin; components fall back to a monogram.
  image: '',
  coverImage: '',
  cv: '',
  status: 'Available for Engineering Projects',
  socialLinks: {
    github: 'https://github.com/cath365',
    linkedin: 'https://www.linkedin.com/in/emmanuelinambaob',
    twitter: '',
    tiktok: 'https://www.tiktok.com/@denuel29',
    youtube: 'https://www.youtube.com/@InamTechOfficial',
    website: 'https://emmanuel-inambao-eight.vercel.app',
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
  // socialLinks is merged per key so links added to the defaults (e.g. TikTok, YouTube)
  // appear even when the saved profile predates them.
  const merged = {
    ...defaultProfile,
    ...(data || {}),
    socialLinks: { ...defaultProfile.socialLinks, ...(data?.socialLinks || {}) },
  }
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
    String(data?.bio || '').trim() ===
    'I build complete technology systems across embedded electronics, firmware, APIs, mobile and web applications, and cloud infrastructure. My work focuses on practical AI, IoT and robotics solutions designed for real-world conditions, including unreliable connectivity and constrained hardware.'
  ) {
    merged.bio = defaultProfile.bio
  }
  if (String(data?.cv || '').trim() === '/cv/emmanuel-inambao-cv.pdf') {
    merged.cv = ''
  }
  // The old default pointed at a file that was never committed to /public.
  if (String(data?.image || '').trim() === '/images/profile/profile.jpg') {
    merged.image = ''
  }
  // The old default LinkedIn URL was missing the trailing "b" and pointed at someone else's profile.
  if (/linkedin\.com\/in\/emmanuelinambao\/?$/.test(String(merged.socialLinks.linkedin || '').trim())) {
    merged.socialLinks.linkedin = defaultProfile.socialLinks.linkedin
  }

  return merged
}

function saveToServer(data: Profile) {
  void persistPortfolioData('profile', data).catch(error => console.error('Failed to save profile:', error))
}

function profileFromData(data: unknown): Profile {
  return data && typeof data === 'object' && !('error' in data)
    ? normalizeProfileData(data as Partial<Profile>)
    : defaultProfile
}

// initialData comes from the server render (undefined when the server could not read storage).
export function ProfileProvider({ children, initialData }: { children: ReactNode; initialData?: unknown }) {
  const [profile, setProfile] = useState<Profile>(() => profileFromData(initialData))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio-data?key=profile', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setProfile(profileFromData(data)))
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
