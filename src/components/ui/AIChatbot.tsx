'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'
import { useServices } from '@/lib/services'
import { useProjects } from '@/lib/projects'
import { useSkills } from '@/lib/skills'
import { answerPortfolioQuestion } from '@/lib/local-portfolio-assistant'

interface Message {
  role: 'user' | 'assistant'
  content: string
  options?: string[]
}

interface BookingState {
  active: boolean
  step: 'name' | 'email' | 'phone' | 'date' | 'time' | 'topic' | 'notification' | 'confirm' | null
  data: {
    name: string
    email: string
    phone: string
    date: string
    time: string
    topic: string
    notificationMethod: 'email' | 'whatsapp' | 'both' | null
  }
}

interface LeadState {
  active: boolean
  step: 'name' | 'email' | 'service' | 'details' | 'confirm' | null
  data: {
    name: string
    email: string
    service: string
    details: string
  }
}

export interface ServiceLead {
  id: string
  name: string
  email: string
  service: string
  details: string
  submittedAt: string
  status: 'new' | 'contacted' | 'closed'
}

// Get available dates (next 14 business days)
function getAvailableDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 1; i <= 21 && dates.length < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      dates.push(formatted)
    }
  }
  return dates
}

// Get available times
function getAvailableTimes(): string[] {
  return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
}

export default function AIChatbot({ floatingVisible = true }: { floatingVisible?: boolean }) {
  const { profile } = useProfile()
  const { services } = useServices()
  const { projects } = useProjects()
  const { skillCategories } = useSkills()

  const dynamicSkills = Array.from(
    new Set(skillCategories.flatMap(cat => cat.skills.map(s => s.name)).filter(Boolean))
  )
  const dynamicServices = services.map(s => s.title).filter(Boolean)
  const dynamicProjects = projects.map(p => p.title).filter(Boolean)
  const skillLines = (dynamicSkills.length ? dynamicSkills : ['IoT Development', 'Embedded Systems', 'Full-Stack Development'])
    .slice(0, 18)
    .map(s => `• ${s}`)
    .join('\n')
  const serviceLines = (dynamicServices.length ? dynamicServices : ['IoT Development', 'Robotics Solutions', 'Full-Stack Development'])
    .map(s => `• ${s}`)
    .join('\n')
  const projectLines = (dynamicProjects.length ? dynamicProjects : ['Smart Irrigation System', 'ESP32 Cutter Robot', 'Automated Bottle Sorting'])
    .slice(0, 6)
    .map((p, i) => `${i + 1}. ${p}`)
    .join('\n')

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Emmanuel's portfolio assistant. Ask me about a specific project, his technical experience, whether his skills fit your idea, or how to work with him.\n\nWhat would you like to know?",
      options: ['Book a meeting', 'View skills', 'See projects', 'Contact info'],
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [booking, setBooking] = useState<BookingState>({
    active: false,
    step: null,
    data: { name: '', email: '', phone: '', date: '', time: '', topic: '', notificationMethod: null }
  })
  const [lead, setLead] = useState<LeadState>({
    active: false,
    step: null,
    data: { name: '', email: '', service: '', details: '' }
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const trackEvent = (page: string, referrer: string) => {
    let sessionId = sessionStorage.getItem('_vsid')
    if (!sessionId) {
      sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem('_vsid', sessionId)
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer,
        sessionId,
        screenWidth: window.innerWidth,
      }),
    }).catch(() => {})
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle booking flow
  const processBookingStep = (userInput: string): { response: string; options?: string[]; nextStep: BookingState['step'] } => {
    const input = userInput.toLowerCase().trim()
    
    switch (booking.step) {
      case 'name':
        setBooking(prev => ({ ...prev, data: { ...prev.data, name: userInput } }))
        return {
          response: `Nice to meet you, ${userInput}! 📧\n\nWhat's your email address?`,
          nextStep: 'email'
        }
      
      case 'email':
        if (!userInput.includes('@')) {
          return { response: "That doesn't look like a valid email. Please enter your email address:", nextStep: 'email' }
        }
        setBooking(prev => ({ ...prev, data: { ...prev.data, email: userInput } }))
        return {
          response: `Great! 📱\n\nWhat's your phone number? (Include country code, e.g., +260973XXXXXX)\n\nOr type "skip" if you prefer not to share.`,
          nextStep: 'phone'
        }
      
      case 'phone':
        const phone = input === 'skip' ? '' : userInput
        setBooking(prev => ({ ...prev, data: { ...prev.data, phone } }))
        return {
          response: `📅 When would you like to meet?\n\nSelect a date:`,
          options: getAvailableDates(),
          nextStep: 'date'
        }
      
      case 'date':
        setBooking(prev => ({ ...prev, data: { ...prev.data, date: userInput } }))
        return {
          response: `⏰ What time works best for you?\n\nAll times are in Central Africa Time (CAT):`,
          options: getAvailableTimes(),
          nextStep: 'time'
        }
      
      case 'time':
        setBooking(prev => ({ ...prev, data: { ...prev.data, time: userInput } }))
        return {
          response: `📝 What would you like to discuss in the meeting?\n\n(e.g., IoT project, consulting, collaboration)`,
          nextStep: 'topic'
        }
      
      case 'topic':
        setBooking(prev => ({ ...prev, data: { ...prev.data, topic: userInput } }))
        const hasPhone = booking.data.phone && booking.data.phone !== ''
        if (hasPhone) {
          return {
            response: `📬 How would you like to receive the meeting confirmation?`,
            options: ['Email only', 'WhatsApp only', 'Both Email & WhatsApp'],
            nextStep: 'notification'
          }
        }
        setBooking(prev => ({ ...prev, data: { ...prev.data, notificationMethod: 'email' } }))
        return {
          response: `Perfect! Here's your booking summary:\n\n👤 Name: ${booking.data.name}\n📧 Email: ${booking.data.email}\n📅 Date: ${booking.data.date}\n⏰ Time: ${booking.data.time}\n📝 Topic: ${userInput}\n\nShall I confirm this booking?`,
          options: ['✅ Confirm Booking', '❌ Cancel'],
          nextStep: 'confirm'
        }
      
      case 'notification':
        let method: 'email' | 'whatsapp' | 'both' = 'email'
        if (input.includes('whatsapp') && input.includes('email')) method = 'both'
        else if (input.includes('whatsapp')) method = 'whatsapp'
        else method = 'email'
        
        setBooking(prev => ({ ...prev, data: { ...prev.data, notificationMethod: method } }))
        
        const methodText = method === 'both' ? 'Email & WhatsApp' : method === 'whatsapp' ? 'WhatsApp' : 'Email'
        return {
          response: `Perfect! Here's your booking summary:\n\n👤 Name: ${booking.data.name}\n📧 Email: ${booking.data.email}\n📱 Phone: ${booking.data.phone}\n📅 Date: ${booking.data.date}\n⏰ Time: ${booking.data.time}\n📝 Topic: ${booking.data.topic}\n📬 Confirmation via: ${methodText}\n\nShall I confirm this booking?`,
          options: ['✅ Confirm Booking', '❌ Cancel'],
          nextStep: 'confirm'
        }
      
      case 'confirm':
        if (input.includes('confirm') || input.includes('yes') || input.includes('✅')) {
          // Submit the booking
          submitBooking()
          return {
            response: `🎉 Booking confirmed!\n\nYou'll receive a confirmation ${booking.data.notificationMethod === 'both' ? 'via email and WhatsApp' : booking.data.notificationMethod === 'whatsapp' ? 'on WhatsApp' : 'via email'}.\n\nEmmanuel will be in touch soon. Is there anything else I can help with?`,
            options: ['Book another meeting', 'View projects', 'Contact info'],
            nextStep: null
          }
        } else {
          setBooking({ active: false, step: null, data: { name: '', email: '', phone: '', date: '', time: '', topic: '', notificationMethod: null } })
          return {
            response: `No problem! The booking has been cancelled.\n\nIs there anything else I can help you with?`,
            options: ['Book a meeting', 'View skills', 'See projects'],
            nextStep: null
          }
        }
      
      default:
        return { response: '', nextStep: null }
    }
  }

  // Submit booking to API (saves to Vercel Blob + sends email)
  const submitBooking = async (): Promise<boolean> => {
    const newBooking = {
      id: `booking-${Date.now()}`,
      name: booking.data.name,
      email: booking.data.email,
      phone: booking.data.phone,
      date: booking.data.date,
      time: booking.data.time,
      timezone: 'Africa/Lusaka',
      duration: 30,
      topic: booking.data.topic,
      notificationMethod: booking.data.notificationMethod,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
    }

    // Save server-side via API (stores in Vercel Blob + sends email)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.data.name,
          email: booking.data.email,
          phone: booking.data.phone,
          date: booking.data.date,
          time: booking.data.time,
          timezone: 'Africa/Lusaka',
          duration: 30,
          topic: booking.data.topic,
          whatsappConsent: booking.data.notificationMethod === 'whatsapp' || booking.data.notificationMethod === 'both',
          source: 'chatbot',
        }),
      })

      if (!response.ok) return false
      trackEvent('/intent/booking', 'ai-chatbot')
      return true
    } catch (error) {
      console.error('Booking submission error:', error)
      return false
    }
  }

  // Process lead capture steps
  const processLeadStep = (userInput: string): { response: string; options?: string[]; nextStep: LeadState['step'] } => {
    switch (lead.step) {
      case 'name':
        setLead(prev => ({ ...prev, data: { ...prev.data, name: userInput } }))
        return {
          response: `Nice to meet you, ${userInput}! 📧\n\nWhat's your email address so Emmanuel can reach you?`,
          nextStep: 'email'
        }

      case 'email':
        if (!userInput.includes('@')) {
          return { response: "That doesn't look like a valid email. Please enter your email:", nextStep: 'email' }
        }
        setLead(prev => ({ ...prev, data: { ...prev.data, email: userInput } }))
        return {
          response: `Which service are you interested in?`,
          options: ['IoT Development', 'Robotics Solutions', 'Full-Stack Development', 'PCB Design', 'Embedded Systems', 'AI/ML Integration', 'Other'],
          nextStep: 'service'
        }

      case 'service':
        setLead(prev => ({ ...prev, data: { ...prev.data, service: userInput } }))
        return {
          response: `Tell me briefly about your project or what you need help with:`,
          nextStep: 'details'
        }

      case 'details':
        setLead(prev => ({ ...prev, data: { ...prev.data, details: userInput } }))
        return {
          response: `Here's a summary of your inquiry:\n\n👤 Name: ${lead.data.name}\n📧 Email: ${lead.data.email}\n🔧 Service: ${lead.data.service}\n📝 Details: ${userInput}\n\nShall I send this to Emmanuel?`,
          options: ['✅ Yes, send it', '❌ Cancel'],
          nextStep: 'confirm'
        }

      case 'confirm':
        if (userInput.toLowerCase().includes('yes') || userInput.includes('✅')) {
          submitLead()
          return {
            response: `🎉 Your inquiry has been sent!\n\nEmmanuel has been notified via email and will get back to you soon at ${lead.data.email}.\n\nIs there anything else I can help with?`,
            options: ['Book a meeting', 'View skills', 'See projects'],
            nextStep: null
          }
        } else {
          setLead({ active: false, step: null, data: { name: '', email: '', service: '', details: '' } })
          return {
            response: `No problem! Your inquiry has been cancelled.\n\nAnything else I can help with?`,
            options: ['Book a meeting', 'View skills', 'See projects'],
            nextStep: null
          }
        }

      default:
        return { response: '', nextStep: null }
    }
  }

  // Submit lead to API (saves to Vercel Blob + sends email)
  const submitLead = async (): Promise<boolean> => {
    const newLead: ServiceLead = {
      id: `lead-${Date.now()}`,
      name: lead.data.name,
      email: lead.data.email,
      service: lead.data.service,
      details: lead.data.details,
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    // Save server-side via API (stores in Vercel Blob + sends email)
    try {
      const response = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      })

      if (!response.ok) return false
      trackEvent('/intent/service-inquiry', 'ai-chatbot')
      return true
    } catch (error) {
      console.error('Lead submission error:', error)
      return false
    }
  }

  const getSmartLocalAnswer = (text: string) => {
    const answer = answerPortfolioQuestion(text, {
      profile,
      projects,
      services,
      skillCategories,
      activeProjectId,
    })

    if (answer.activeProjectId !== undefined) {
      setActiveProjectId(answer.activeProjectId ?? null)
    }

    return answer
  }

  const getPortfolioAnswer = async (text: string) => {
    const conversation = [
      ...messages
        .filter(message => message.content.trim().length > 0)
        .map(message => ({ role: message.role, content: message.content })),
      { role: 'user' as const, content: text },
    ].slice(-10)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
      })

      if (response.ok) {
        const payload = await response.json()
        if (typeof payload?.answer === 'string' && payload.answer.trim()) {
          trackEvent('/intent/ai-question', 'ai-chatbot')
          return {
            response: payload.answer.trim(),
            options: ['📩 Send inquiry', 'Book a meeting', 'See projects'],
          }
        }
      }
    } catch {
      // The local assistant below keeps the portfolio useful when the AI provider is unavailable.
    }

    return getSmartLocalAnswer(text)
  }

  const thinkingDelay = () => new Promise<void>(resolve => {
    window.setTimeout(resolve, 550)
  })

  const resetBookingFlow = () => {
    setBooking({
      active: false,
      step: null,
      data: { name: '', email: '', phone: '', date: '', time: '', topic: '', notificationMethod: null },
    })
  }

  const resetLeadFlow = () => {
    setLead({
      active: false,
      step: null,
      data: { name: '', email: '', service: '', details: '' },
    })
  }

  const isCancelIntent = (text: string) =>
    /^(cancel|stop|exit|go back|never ?mind|start over|quit)( booking| inquiry| meeting)?[.!]?$/i.test(text.trim())

  const looksLikeOpenQuestion = (text: string) => {
    const trimmed = text.trim()
    if (trimmed.includes('?')) return true

    return /^(tell me|show me|explain|what\b|why\b|how\b|who\b|where\b|which\b|can\b|could\b|would\b|does\b|do\b|is\b|are\b|has\b|have\b|give me|describe|compare|i want to know|i need to know)/i.test(trimmed)
  }

  const shouldInterruptBooking = (text: string) => {
    if (!booking.active || !booking.step) return false
    if (booking.step === 'topic') return false

    const trimmed = text.trim()
    if (booking.step === 'email' && trimmed.includes('@')) return false
    if (booking.step === 'phone' && (/^skip$/i.test(trimmed) || /^\+?[\d\s()-]{7,}$/.test(trimmed))) return false
    if (booking.step === 'date' && getAvailableDates().includes(trimmed)) return false
    if (booking.step === 'time' && getAvailableTimes().includes(trimmed)) return false
    if (booking.step === 'notification' && /email|whatsapp|both/i.test(trimmed)) return false
    if (booking.step === 'confirm' && /confirm|yes|no|cancel|✅|❌/i.test(trimmed)) return false

    return looksLikeOpenQuestion(trimmed)
  }

  const shouldInterruptLead = (text: string) => {
    if (!lead.active || !lead.step) return false
    if (lead.step === 'details') return false

    const trimmed = text.trim()
    if (lead.step === 'email' && trimmed.includes('@')) return false
    if (lead.step === 'service' && dynamicServices.some(service => service.toLowerCase() === trimmed.toLowerCase())) return false
    if (lead.step === 'confirm' && /yes|no|send|cancel|✅|❌/i.test(trimmed)) return false

    return looksLikeOpenQuestion(trimmed)
  }

  // Generate deterministic fallback and action-flow responses
  function generateResponse(query: string): { response: string; options?: string[] } {
    const lowerQuery = query.toLowerCase()
    
    // Check if lead capture flow is active
    if (lead.active && lead.step) {
      const result = processLeadStep(query)
      if (result.nextStep === null) {
        setLead(prev => ({ ...prev, active: false, step: null }))
      } else {
        setLead(prev => ({ ...prev, step: result.nextStep }))
      }
      return { response: result.response, options: result.options }
    }

    // Check if booking flow is active
    if (booking.active && booking.step) {
      const result = processBookingStep(query)
      if (result.nextStep === null) {
        setBooking(prev => ({ ...prev, active: false, step: null }))
      } else {
        setBooking(prev => ({ ...prev, step: result.nextStep }))
      }
      return { response: result.response, options: result.options }
    }

    // Start booking flow
    if (lowerQuery.includes('book') || lowerQuery.includes('meeting') || lowerQuery.includes('schedule') || lowerQuery.includes('appointment')) {
      setBooking(prev => ({ ...prev, active: true, step: 'name' }))
      return {
        response: "Great! Let's schedule a meeting with Emmanuel. 📅\n\nFirst, what's your name?\n\nYou can type “cancel” at any time or ask another question to leave booking mode."
      }
    }
    
    // Greetings
    if (lowerQuery.match(/^(hi|hello|hey|greetings)/)) {
      return {
        response: `Hello! 👋 I'm Emmanuel's AI assistant. How can I help you today?`,
        options: ['Book a meeting', 'View skills', 'See projects', 'Contact info']
      }
    }
    
    // Skills
    if (lowerQuery.includes('skill') || lowerQuery.includes('know') || lowerQuery.includes('tech')) {
      return {
        response: `Emmanuel's current skills include:\n\n${skillLines}\n\nWant to discuss a project using these skills?`,
        options: ['Book a meeting', 'See projects', 'Contact info']
      }
    }
    
    // Projects
    if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built')) {
      return {
        response: `Emmanuel's current featured projects:\n\n${projectLines}\n\nInterested in discussing a similar project?`,
        options: ['Book a meeting', 'View skills', 'Contact info']
      }
    }
    
    // Services / pricing / quotation
    if (lowerQuery.includes('service') || lowerQuery.includes('offer') || lowerQuery.includes('hire') || lowerQuery.includes('help') || lowerQuery.includes('need') || lowerQuery.includes('interested') || lowerQuery.includes('quote') || lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      return {
        response: `For new project quotations, Emmanuel's current pricing starts from:\n\n• Website — ZMW 5,000\n• E-commerce — + ZMW 3,000\n• Admin dashboard — + ZMW 2,500\n• Payment integration — + ZMW 2,000\n• Mobile application — ZMW 12,000\n• IoT integration — custom quotation\n\nThe AI Project Quotation assistant can ask the scope questions, explain each charge and generate a downloadable quotation.`,
        options: ['Get AI quotation', '📩 Send inquiry', 'Book a meeting']
      }
    }

    // Start lead capture flow
    if (lowerQuery.includes('inquiry') || lowerQuery.includes('send inquiry') || lowerQuery.includes('get started') || lowerQuery.includes('interested in')) {
      setLead(prev => ({ ...prev, active: true, step: 'name' }))
      return {
        response: "Great! Let's get your inquiry to Emmanuel. 📩\n\nFirst, what's your name?\n\nYou can type “cancel” at any time or ask another question to leave inquiry mode."
      }
    }
    
    // Contact
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
      return {
        response: `You can reach Emmanuel at:\n\n📧 Email: ${profile.email}\n📱 WhatsApp: ${profile.phone}\n🔗 Direct WhatsApp: https://wa.me/${profile.phone.replace(/\D/g, '')}\n\nOr book a meeting directly!`,
        options: ['Book a meeting', 'View skills', 'See projects']
      }
    }
    
    // Default
    return {
      response: `I can help you with:\n\n• 📅 **Book a meeting** with Emmanuel\n• 💡 Learn about his **skills**\n• 🚀 See his **projects**\n• 📧 Get **contact info**\n\nWhat would you like?`,
      options: ['Book a meeting', 'View skills', 'See projects', 'Contact info']
    }
  }

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isTyping) return

    setInput('')
    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    const lower = text.toLowerCase().trim()
    const isPositiveConfirmation =
      lower.includes('confirm') || lower.includes('yes') || text.includes('✅')

    // A visitor can leave a transactional flow at any time without the chatbot
    // misreading a new portfolio question as form data.
    if ((booking.active || lead.active) && isCancelIntent(text)) {
      if (booking.active) resetBookingFlow()
      if (lead.active) resetLeadFlow()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No problem — I stopped that flow. What would you like to know about Emmanuel or his work?',
        options: ['See projects', 'View skills', 'Book a meeting'],
      }])
      setIsTyping(false)
      return
    }

    if (shouldInterruptBooking(text) || shouldInterruptLead(text)) {
      if (booking.active) resetBookingFlow()
      if (lead.active) resetLeadFlow()

      await thinkingDelay()
      const answer = await getPortfolioAnswer(text)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: answer.response,
        options: answer.options,
      }])
      setIsTyping(false)
      return
    }

    // Transactional actions stay deterministic and only report success after the API confirms it.
    if (booking.active && booking.step === 'confirm' && isPositiveConfirmation) {
      const ok = await submitBooking()
      setBooking({ active: false, step: null, data: { name: '', email: '', phone: '', date: '', time: '', topic: '', notificationMethod: null } })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: ok
          ? '🎉 Booking request received successfully. Emmanuel has been notified and the confirmation workflow has been started.'
          : 'I could not submit the booking right now. Your details were not confirmed as saved. Please try again or use the contact option.',
        options: ok ? ['See projects', 'Contact info'] : ['Book a meeting', 'Contact info'],
      }])
      setIsTyping(false)
      return
    }

    if (lead.active && lead.step === 'confirm' && isPositiveConfirmation) {
      const ok = await submitLead()
      setLead({ active: false, step: null, data: { name: '', email: '', service: '', details: '' } })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: ok
          ? `🎉 Your inquiry was sent successfully. Emmanuel can follow up using ${lead.data.email}.`
          : 'I could not submit the inquiry right now. It has not been confirmed as saved. Please try again or use the contact option.',
        options: ok ? ['Book a meeting', 'See projects'] : ['📩 Send inquiry', 'Contact info'],
      }])
      setIsTyping(false)
      return
    }

    // Existing multi-step booking/inquiry flows remain deterministic.
    if (booking.active || lead.active) {
      const { response, options } = generateResponse(text)
      setMessages(prev => [...prev, { role: 'assistant', content: response, options }])
      setIsTyping(false)
      return
    }

    // Explicit action buttons should open the existing flows immediately.
    const actionRequest =
      lower === 'book a meeting' ||
      lower === 'book another meeting' ||
      lower === '📩 send inquiry' ||
      lower === 'send inquiry' ||
      lower === 'contact info'

    if (actionRequest) {
      const { response, options } = generateResponse(text)
      setMessages(prev => [...prev, { role: 'assistant', content: response, options }])
      setIsTyping(false)
      return
    }

    // Use the server-side grounded AI when configured. Fall back to the live local portfolio assistant.
    await thinkingDelay()
    const answer = await getPortfolioAnswer(text)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: answer.response,
      options: answer.options,
    }])
    setIsTyping(false)
  }

  const handleOptionClick = (option: string) => {
    if (option === 'Get AI quotation') {
      window.location.href = '/start-project'
      return
    }
    handleSend(option)
  }

  useEffect(() => {
    if (!floatingVisible) setIsOpen(false)
  }, [floatingVisible])

  if (!floatingVisible) return null

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform overflow-hidden border-2 border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        {profile.image ? (
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            className={`object-cover transition-all ${isOpen ? 'opacity-40' : 'opacity-100'}`}
            sizes="56px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="w-6 h-6 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Badge */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-[3.5rem] right-4 sm:bottom-[4.5rem] sm:right-6 z-50 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          1
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[360px] max-w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 shrink-0">
                  {profile.image ? (
                    <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="40px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-semibold">E</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Portfolio Assistant</h3>
                  <p className="text-xs text-white/80">Powered by Emmanuel&apos;s portfolio data</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[300px] sm:h-[350px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/40 shrink-0 mt-1">
                      {profile.image ? (
                        <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="32px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-300">E</div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.role === 'assistant' && message.options && index === messages.length - 1 && !isTyping && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                        {message.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 justify-start"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/40 shrink-0">
                    {profile.image ? (
                      <Image src={profile.image} alt={profile.name} fill className="object-cover" sizes="32px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-300">E</div>
                    )}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Thinking</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={booking.active || lead.active ? "Type your answer..." : "Ask about a project or your idea..."}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                  disabled={isTyping}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
