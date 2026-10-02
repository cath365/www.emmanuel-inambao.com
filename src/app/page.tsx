import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import ProblemDomains from '@/components/sections/ProblemDomains'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import ProjectEvidenceHighlights from '@/components/sections/ProjectEvidenceHighlights'
import Experience from '@/components/sections/Experience'
import Services from '@/components/sections/Services'
import Certifications from '@/components/sections/Certifications'
import Testimonials from '@/components/sections/Testimonials'
import Education from '@/components/sections/Education'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import Newsletter from '@/components/sections/Newsletter'
import DownloadableResources from '@/components/sections/DownloadableResources'
import ClientLogos from '@/components/sections/ClientLogos'
import HowIWork from '@/components/sections/HowIWork'
import FAQ from '@/components/sections/FAQ'
import OpenSource from '@/components/sections/OpenSource'
import SectionViewTracker from '@/components/ui/SectionViewTracker'

export default function Home() {
  return (
    <>
      <SectionViewTracker />
      <Hero />
      <ProblemDomains />
      <Projects />
      <ProjectEvidenceHighlights />
      <HowIWork />
      <About />
      <ClientLogos />
      <Experience />
      <Skills />
      <Education />
      <Services />
      <Certifications />
      <OpenSource />
      <Testimonials />
      <Gallery />
      <DownloadableResources />
      <FAQ />
      <Newsletter />
      <Contact />
    </>
  )
}
