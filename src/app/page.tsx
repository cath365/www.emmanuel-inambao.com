import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'
import Education from '@/components/sections/Education'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import HowIWork from '@/components/sections/HowIWork'
import EngineeringCTA from '@/components/sections/EngineeringCTA'
import ProofOfWork from '@/components/sections/ProofOfWork'
import SectionViewTracker from '@/components/ui/SectionViewTracker'

export default function Home() {
  return (
    <>
      <SectionViewTracker />

      {/* 01 — First impression */}
      <Hero />

      {/* 02 — Positioning and proof */}
      <About />
      <Projects />

      {/* 03 — Engineering depth */}
      <Skills />
      <HowIWork />

      {/* 04 — Human proof of the work */}
      <Gallery />
      <ProofOfWork />

      {/* 05 — Professional context */}
      <Experience />
      <Education />

      {/* 06 — Commercial fit */}
      <Services />
      <Testimonials />
      <EngineeringCTA />

      {/* 07 — Clear finish */}
      <Contact />
    </>
  )
}
