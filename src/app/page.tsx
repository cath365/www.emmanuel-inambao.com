import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Services from '@/components/sections/Services'
import HowIWork from '@/components/sections/HowIWork'
import Certifications from '@/components/sections/Certifications'
import Education from '@/components/sections/Education'
import DownloadableResources from '@/components/sections/DownloadableResources'
import Gallery from '@/components/sections/Gallery'
import FAQ from '@/components/sections/FAQ'
import Newsletter from '@/components/sections/Newsletter'
import Contact from '@/components/sections/Contact'
import SectionViewTracker from '@/components/ui/SectionViewTracker'

export default function Home() {
  return (
    <>
      <SectionViewTracker />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />

      {/* Existing working content retained below the redesigned professional profile. */}
      <Services />
      <HowIWork />
      <Certifications />
      <Education />
      <DownloadableResources />
      <Gallery />
      <FAQ />
      <Newsletter />

      <Contact />
    </>
  )
}
