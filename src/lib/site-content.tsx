'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { persistPortfolioData } from '@/lib/portfolio-persistence'

export interface CopyCard { title: string; description: string; image?: string }
export interface FaqEntry { question: string; answer: string }
export interface SiteContent {
  about: { eyebrow: string; heading: string; intro: string; paragraphs: string[]; pillars: CopyCard[] }
  process: { eyebrow: string; heading: string; intro: string; steps: CopyCard[] }
  faq: { eyebrow: string; heading: string; intro: string; questions: FaqEntry[] }
  vision: { eyebrow: string; heading: string; intro: string; horizons: CopyCard[] }
}

export const defaultSiteContent: SiteContent = {
  vision: {
    eyebrow: 'Engineering with a long-term purpose',
    heading: 'Building reliable systems for real problems, not demonstrations alone.',
    intro: 'My direction for 2026–2036 is to turn tested engineering work into dependable products and services that solve practical challenges in Zambia and can scale responsibly. The stages below are priorities and goals—not claims of completed outcomes.',
    horizons: [
      { title: 'Now — evidence and reliability', description: 'Show working demonstrations, honest project status, measured tests, engineering decisions, limitations, and clear responsibility for each system.' },
      { title: 'Next — pilots and repeatable delivery', description: 'Work with real users and organisations, validate costs and maintenance, improve safety and usability, and document outcomes from controlled deployments.' },
      { title: 'Long term — lasting African technology', description: 'Build sustainable products and partnerships in connected devices, automation, accessibility and education, with local support and measurable social or commercial value.' },
    ],
  },
  about: {
    eyebrow: 'Professional profile',
    heading: 'Engineering across hardware, software and project delivery.',
    intro: 'I am Emmanuel Inambao, a Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager based in Lusaka, Zambia.',
    paragraphs: [
      'My work combines electronics, embedded systems, robotics, IoT and software engineering with the planning needed to move a technical project from an idea into a testable and deployable system. I work across requirements, architecture, component planning, implementation, troubleshooting, testing, documentation and improvement rather than treating hardware, software and delivery as separate activities.',
      'At Robotix Institute, I contribute to engineering and R&D work, technical project coordination and project-based STEM programmes. This includes planning practical robotics and coding projects, defining what learners should understand from each project, selecting suitable technologies and supporting technical delivery with students, team members and stakeholders.',
    ],
    pillars: [
      { title: 'Robotics & Embedded Engineering', description: 'Designing and troubleshooting robotics, IoT and embedded systems using microcontrollers, sensors, actuators, wireless communication and practical electronics.' },
      { title: 'Full-Stack Systems Development', description: 'Building the software around physical systems and business workflows: web applications, mobile applications, APIs, databases, dashboards, authentication and cloud deployment.' },
      { title: 'Technical Project Management', description: 'Turning a problem into requirements, scope, architecture, components, milestones, budgets, risks, testing plans and an implementation path that can be coordinated and delivered.' },
      { title: 'STEM Project & Programme Planning', description: 'Planning practical engineering projects for learners: defining objectives, selecting technologies, structuring project stages and designing activities that demonstrate real learning.' },
    ],
  },
  process: {
    eyebrow: 'How I work',
    heading: 'From problem definition to delivery.',
    intro: 'This workflow is why technical project management is part of my engineering role: the work is not only building the system, but defining, planning, coordinating, testing and improving it.',
    steps: [
      { title: 'Discover', description: 'Understand the problem, users, operating environment and constraints before deciding what to build.' },
      { title: 'Define', description: 'Convert the problem into clear requirements, objectives, scope and acceptance criteria.' },
      { title: 'Plan', description: 'Determine architecture, components, resources, budget, timeline, milestones, dependencies and risks.' },
      { title: 'Design', description: 'Design the electronics, firmware, software, APIs, interfaces and system architecture required for the solution.' },
      { title: 'Build', description: 'Develop the hardware and software, integrate the parts and keep implementation aligned with the agreed scope.' },
      { title: 'Test', description: 'Validate functionality, reliability, usability and hardware/software integration against the project requirements.' },
      { title: 'Deploy', description: 'Move the solution into its real operating environment with documentation, configuration and handover planning.' },
      { title: 'Improve', description: 'Use feedback and test evidence to fix weaknesses, reduce risk and plan the next iteration.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ', heading: 'Frequently Asked Questions', intro: 'Everything you need to know about working with me.',
    questions: [
      { question: 'What kinds of technical work do you take on?', answer: 'My strongest fit is work that combines robotics, IoT, embedded systems, full-stack software or technical project planning. That can include prototypes, connected devices, dashboards, mobile applications, APIs, automation workflows and engineering-learning projects.' },
      { question: 'Can you plan a project before development starts?', answer: 'Yes. Technical project planning is part of my role. I can help turn a problem into requirements, scope, architecture, component needs, milestones, risks, testing plans and an implementation path before the build begins.' },
      { question: 'Do you work across both hardware and software?', answer: 'Yes. I work with Arduino and ESP32-class devices, sensors, motors, Bluetooth, Wi-Fi, GSM and GPS, as well as web applications, APIs, databases, dashboards and React Native / Expo mobile applications. The exact stack is chosen according to the problem rather than treated as the goal.' },
      { question: 'Can you support an existing system or prototype?', answer: 'Yes. Existing projects can be reviewed for architecture, integration, firmware or software issues, unreliable workflows, missing documentation, testing gaps and deployment problems. The first step is to understand the current system and evidence before recommending changes.' },
      { question: 'How long does a project take?', answer: 'Timelines depend on requirements, hardware availability, integrations, testing and the maturity of the existing system. I define an estimated timeline and milestones after discovery instead of using one fixed duration for every project.' },
      { question: 'Do you provide post-deployment support?', answer: 'Support, maintenance and iteration can be included in the agreed project scope. I do not assume the same support period for every engagement; the handover and follow-up plan should be clear before implementation begins.' },
      { question: 'How do we get started?', answer: 'Send the problem, intended users, operating environment, required hardware or software, timeline and any constraints. I can then assess the scope and respond with a more useful technical discussion or preliminary quotation.' },
    ],
  },
}

function normalize(value: unknown): SiteContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultSiteContent
  const v = value as Partial<SiteContent>
  return {
    about: { ...defaultSiteContent.about, ...(v.about || {}), pillars: Array.isArray(v.about?.pillars) ? v.about.pillars : defaultSiteContent.about.pillars, paragraphs: Array.isArray(v.about?.paragraphs) ? v.about.paragraphs : defaultSiteContent.about.paragraphs },
    process: { ...defaultSiteContent.process, ...(v.process || {}), steps: Array.isArray(v.process?.steps) ? v.process.steps : defaultSiteContent.process.steps },
    faq: { ...defaultSiteContent.faq, ...(v.faq || {}), questions: Array.isArray(v.faq?.questions) ? v.faq.questions : defaultSiteContent.faq.questions },
    vision: { ...defaultSiteContent.vision, ...(v.vision || {}), horizons: Array.isArray(v.vision?.horizons) ? v.vision.horizons : defaultSiteContent.vision.horizons },
  }
}

interface ContentContext { content: SiteContent; saveContent: (value: SiteContent) => Promise<void>; isLoading: boolean }
const Context = createContext<ContentContext | null>(null)
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultSiteContent)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch('/api/portfolio-data?key=siteContent', { cache: 'no-store' })
        if (!response.ok) return
        const result = await response.json()
        if (result && !result.error) setContent(normalize(result))
      } catch { /* Use safely checked, preinstalled defaults when offline. */ }
      finally { setIsLoading(false) }
    }
    void refresh()
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'portfolio_last_published_change') return
      try { if (JSON.parse(event.newValue || '{}').key === 'siteContent') void refresh() } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const saveContent = async (value: SiteContent) => { await persistPortfolioData('siteContent', value); setContent(normalize(value)) }
  return <Context.Provider value={{ content, saveContent, isLoading }}>{children}</Context.Provider>
}
export function useSiteContent() { const context = useContext(Context); if (!context) throw new Error('SiteContentProvider missing'); return context }
