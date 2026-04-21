'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/auth'
import { ProjectsProvider } from '@/lib/projects'
import { ProfileProvider } from '@/lib/profile'
import { ExperienceProvider } from '@/lib/experience'
import { TestimonialProvider } from '@/lib/testimonials'
import { CertificationProvider } from '@/lib/certifications'
import { ServiceProvider } from '@/lib/services'
import { ResourcesProvider } from '@/lib/resources'
import { GalleryProvider } from '@/lib/gallery'
import { SkillsProvider } from '@/lib/skills'
import { ThemeProvider } from '@/components/ui/ThemeToggle'
import { LanguageProvider } from '@/lib/i18n'
import AIChatbot from '@/components/ui/AIChatbot'
import CookieConsent from '@/components/ui/CookieConsent'
import BookingScheduler from '@/components/ui/BookingScheduler'
import WhatsAppQuickAction from '@/components/ui/WhatsAppQuickAction'
import SkipToContent from '@/components/ui/SkipToContent'
import ScrollProgress from '@/components/ui/ScrollProgress'
import ServiceWorkerRegistrar from '@/components/ui/ServiceWorkerRegistrar'
import EasterEggs from '@/components/ui/EasterEggs'

// Lazy load command palette for performance
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false })

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const [floatingWidgetsVisible, setFloatingWidgetsVisible] = useState(true)

  useEffect(() => {
    if (isAdminPage) return

    const handleSingleClick = () => {
      setFloatingWidgetsVisible(true)
    }

    const handleDoubleClick = () => {
      setFloatingWidgetsVisible(false)
    }

    window.addEventListener('click', handleSingleClick)
    window.addEventListener('dblclick', handleDoubleClick)

    return () => {
      window.removeEventListener('click', handleSingleClick)
      window.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [isAdminPage])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProfileProvider>
            <ProjectsProvider>
              <ExperienceProvider>
                <TestimonialProvider>
                  <CertificationProvider>
                    <ServiceProvider>
                      <SkillsProvider>
                        <ResourcesProvider>
                          <GalleryProvider>
                          {/* Skip to main content for accessibility */}
                          <SkipToContent />

                          {/* Scroll progress bar */}
                          {!isAdminPage && <ScrollProgress />}

                          {/* Navigation - hidden on admin pages */}
                          {!isAdminPage && <Navbar />}

                          {/* Main content */}
                          <main id="main-content" className="overflow-x-hidden">
                            {children}
                          </main>

                          {/* Footer - hidden on admin pages */}
                          {!isAdminPage && <Footer />}

                          {/* AI Chatbot - visible on all public pages */}
                          {!isAdminPage && <AIChatbot floatingVisible={floatingWidgetsVisible} />}

                          {/* Booking Scheduler - visible on all public pages */}
                          {!isAdminPage && <BookingScheduler floatingVisible={floatingWidgetsVisible} />}

                          {/* WhatsApp quick action */}
                          {!isAdminPage && <WhatsAppQuickAction floatingVisible={floatingWidgetsVisible} />}

                          {/* Cookie Consent Banner - visible on all pages */}
                          <CookieConsent />

                          {/* Command Palette (Ctrl+K) */}
                          {!isAdminPage && <CommandPalette />}

                          {/* Easter Eggs */}
                          {!isAdminPage && <EasterEggs />}

                          {/* Service Worker Registration */}
                          <ServiceWorkerRegistrar />
                          </GalleryProvider>
                        </ResourcesProvider>
                      </SkillsProvider>
                    </ServiceProvider>
                  </CertificationProvider>
                </TestimonialProvider>
              </ExperienceProvider>
            </ProjectsProvider>
          </ProfileProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
