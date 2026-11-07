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
import { InstitutionalProgramsProvider } from '@/lib/institutional-programs'
import { ThemeProvider } from '@/components/ui/ThemeToggle'
import { LanguageProvider } from '@/lib/i18n'
import SkipToContent from '@/components/ui/SkipToContent'
import ScrollProgress from '@/components/ui/ScrollProgress'
import ServiceWorkerRegistrar from '@/components/ui/ServiceWorkerRegistrar'
import type { InitialPortfolio } from '@/lib/portfolio-server'

const AIChatbot = dynamic(() => import('@/components/ui/AIChatbot'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent'), { ssr: false })
const BookingScheduler = dynamic(() => import('@/components/ui/BookingScheduler'), { ssr: false })
const WhatsAppQuickAction = dynamic(() => import('@/components/ui/WhatsAppQuickAction'), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false })
const EasterEggs = dynamic(() => import('@/components/ui/EasterEggs'), { ssr: false })

export default function Providers({
  children,
  initialPortfolio = {},
}: {
  children: React.ReactNode
  initialPortfolio?: InitialPortfolio
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const initial = initialPortfolio

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProfileProvider initialData={initial.profile}>
            <ProjectsProvider initialData={initial.projects}>
              <ExperienceProvider initialData={initial.experiences}>
                <TestimonialProvider>
                  <CertificationProvider initialData={initial.certifications}>
                    <ServiceProvider initialData={initial.services}>
                      <SkillsProvider initialData={initial.skills}>
                        <InstitutionalProgramsProvider>
                          <ResourcesProvider>
                          <GalleryProvider initialData={initial.gallery}>
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
                        </InstitutionalProgramsProvider>
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
