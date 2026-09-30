'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
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
import SkipToContent from '@/components/ui/SkipToContent'
import ScrollProgress from '@/components/ui/ScrollProgress'
import ServiceWorkerRegistrar from '@/components/ui/ServiceWorkerRegistrar'

const AIChatbot = dynamic(() => import('@/components/ui/AIChatbot'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent'), { ssr: false })
const BookingScheduler = dynamic(() => import('@/components/ui/BookingScheduler'), { ssr: false })
const WhatsAppQuickAction = dynamic(() => import('@/components/ui/WhatsAppQuickAction'), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false })
const EasterEggs = dynamic(() => import('@/components/ui/EasterEggs'), { ssr: false })

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

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
                            <SkipToContent />
                            {!isAdminPage && <ScrollProgress />}
                            {!isAdminPage && <Navbar />}

                            <main id="main-content" className="overflow-x-hidden">{children}</main>

                            {!isAdminPage && <Footer />}
                            {!isAdminPage && <AIChatbot />}
                            {!isAdminPage && <BookingScheduler />}
                            {!isAdminPage && <WhatsAppQuickAction />}
                            <CookieConsent />
                            {!isAdminPage && <CommandPalette />}
                            {!isAdminPage && <EasterEggs />}
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
