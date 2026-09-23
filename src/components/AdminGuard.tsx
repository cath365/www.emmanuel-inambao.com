'use client'

import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
    if (isAuthenticated && pathname === '/admin/login') {
      router.replace('/admin/dashboard')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  if (isLoading) return null
  if (!isAuthenticated && pathname !== '/admin/login') return null
  return <>{children}</>
}
