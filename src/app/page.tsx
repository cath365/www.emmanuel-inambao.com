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
import EngineeringCTA from '@/components/sections/EngineeringCTA'
import SectionViewTracker from '@/components/ui/SectionViewTracker'

export default function Home() {
  return (
    <>
      <SectionViewTracker />
      <Hero />
      <ClientLogos />
      <About />
      <Skills />
      <GitHubContributions username="bolo3574" />
      <Services />
      <HowIWork />
      <Projects />
      <EngineeringCTA />
      <AchievementTimeline />
      <Experience />
      <Certifications />
      <OpenSource />
      <Testimonials />
      <Pricing />
      <Education />
      <DownloadableResources />
      <Gallery />
      <FAQ />
      <Newsletter />
      <Contact />
    </>
  )
}
