import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Services from '@/components/sections/Services'
import Certifications from '@/components/sections/Certifications'
import Testimonials from '@/components/sections/Testimonials'
import Education from '@/components/sections/Education'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import AchievementTimeline from '@/components/sections/AchievementTimeline'
import Newsletter from '@/components/sections/Newsletter'
import DownloadableResources from '@/components/sections/DownloadableResources'
import GitHubContributions from '@/components/sections/GitHubContributions'
import ClientLogos from '@/components/sections/ClientLogos'
import HowIWork from '@/components/sections/HowIWork'
import FAQ from '@/components/sections/FAQ'
import Pricing from '@/components/sections/Pricing'
import OpenSource from '@/components/sections/OpenSource'
import SectionViewTracker from '@/components/ui/SectionViewTracker'

/**
 * Main portfolio page for Prof. Emmanuel Inambao
 * Electronic Engineer | IoT & Robotics Developer | Full-Stack Systems Engineer
 *
 * This page assembles all sections of the portfolio in a clean,
 * professional layout optimized for investors, clients, and recruiters.
 */
export default function Home() {
  return (
    <>
      <SectionViewTracker />

      {/* Hero Section - First impression with name, title, and mission */}
      <Hero />

      {/* Social Proof - Trusted by organizations */}
      <ClientLogos />

      {/* About Section - Engineering story and core values */}
      <About />

      {/* Skills Section - Technical expertise grouped by domain */}
      <Skills />

      {/* GitHub Activity - Show coding contributions */}
      <GitHubContributions username="bolo3574" />

      {/* Services Section - What services you offer */}
      <Services />

      {/* How I Work - Engineering process */}
      <HowIWork />

      {/* Projects Section - Featured engineering projects with details */}
      <Projects />

      {/* Achievement Timeline - Career milestones */}
      <AchievementTimeline />

      {/* Experience Section - Work history timeline */}
      <Experience />

      {/* Certifications Section - Professional credentials */}
      <Certifications />

      {/* Open Source - Community contributions */}
      <OpenSource />

      {/* Testimonials Section - Client reviews with video support */}
      <Testimonials />

      {/* Pricing - Transparent packages */}
      <Pricing />

      {/* Education Section - Mentorship and teaching programs */}
      <Education />

      {/* Free Resources - Downloadable guides and templates */}
      <DownloadableResources />

      {/* Gallery Section - Visual portfolio of builds and diagrams */}
      <Gallery />

      {/* FAQ - Common questions answered */}
      <FAQ />

      {/* Newsletter - Email subscription */}
      <Newsletter />

      {/* Contact Section - Get in touch form and contact info */}
      <Contact />
    </>
  )
}
