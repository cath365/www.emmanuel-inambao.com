'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  FolderOpen,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { useProfile } from '@/lib/profile'
import { useProjects } from '@/lib/projects'
import { useServices } from '@/lib/services'
import { useSkills } from '@/lib/skills'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  options?: string[]
}

interface AIHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

interface BookingData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  topic: string
  notificationMethod: 'email' | 'whatsapp' | 'both' | null
}

interface BookingState {
  active: boolean
  step: 'name' | 'email' | 'phone' | 'date' | 'time' | 'topic' | 'notification' | 'confirm' | null
  data: BookingData
}

interface LeadData {
  name: string
  email: string
  service: string
  details: string
}

interface LeadState {
  active: boolean
  step: 'name' | 'email' | 'service' | 'details' | 'confirm' | null
  data: LeadData
}

interface AssistantReply {
  response: string
  options?: string[]
}

const emptyBooking: BookingState = {
  active: false,
  step: null,
  data: {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    topic: '',
    notificationMethod: null,
  },
}

const emptyLead: LeadState = {
  active: false,
  step: null,
  data: {
    name: '',
    email: '',
    service: '',
    details: '',
  },
}

const initialMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "I'm Emmanuel's portfolio guide. I can explain his engineering work, match your problem to a relevant project, or help you start a project conversation.",
  options: ['Find a relevant project', 'Explore projects', 'Start a project', 'Book a meeting'],
}

function getPreferredDates() {
  const dates: string[] = []
  const today = new Date()

  for (let offset = 1; offset <= 21 && dates.length < 7; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)

    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(
        date.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        })
      )
    }
  }

  return dates
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function nextMessageId() {
  return `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function AIChatbot({ floatingVisible = true }: { floatingVisible?: boolean }) {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { services } = useServices()
  const { skillCategories } = useSkills()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [aiHistory, setAiHistory] = useState<AIHistoryMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [booking, setBooking] = useState<BookingState>(emptyBooking)
  const [lead, setLead] = useState<LeadState>(emptyLead)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const dynamicServices = services.map(service => service.title).filter(Boolean)
  const serviceChoices = (dynamicServices.length
    ? dynamicServices
    : ['Embedded Systems', 'IoT Development', 'Robotics', 'Full-Stack Development']
  ).slice(0, 6)

  const dynamicSkills = Array.from(
    new Set(skillCategories.flatMap(category => category.skills.map(skill => skill.name)).filter(Boolean))
  )

  const featuredProjects = projects.filter(project => project.featured).slice(0, 4)
  const projectChoices = (featuredProjects.length ? featuredProjects : projects.slice(0, 4)).map(project => project.title)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (!floatingVisible) setIsOpen(false)
  }, [floatingVisible])

  const trackEvent = (page: string) => {
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
        referrer: 'portfolio-ai',
        sessionId,
        screenWidth: window.innerWidth,
      }),
    }).catch(() => {})
  }

  const resetConversation = () => {
    setMessages([{ ...initialMessage, id: nextMessageId() }])
    setAiHistory([])
    setBooking(emptyBooking)
    setLead(emptyLead)
    setInput('')
  }

  const submitBooking = async (data: BookingData) => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: data.date,
          time: data.time,
          timezone: 'Africa/Lusaka',
          duration: 30,
          topic: data.topic,
          whatsappConsent: data.notificationMethod === 'whatsapp' || data.notificationMethod === 'both',
          source: 'chatbot',
        }),
      })

      if (response.ok) {
        trackEvent('/intent/booking')
        return true
      }

      return false
    } catch {
      return false
    }
  }

  const submitLead = async (data: LeadData) => {
    try {
      const response = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `lead-${Date.now()}`,
          ...data,
          submittedAt: new Date().toISOString(),
          status: 'new',
        }),
      })

      if (response.ok) {
        trackEvent('/intent/service-inquiry')
        return true
      }

      return false
    } catch {
      return false
    }
  }

  const processBookingStep = async (userInput: string): Promise<AssistantReply> => {
    const normalized = userInput.trim().toLowerCase()

    switch (booking.step) {
      case 'name': {
        const nextData = { ...booking.data, name: userInput.trim() }
        setBooking({ active: true, step: 'email', data: nextData })
        return { response: `Thanks, ${nextData.name}. What email address should Emmanuel use for the meeting request?` }
      }

      case 'email': {
        if (!isValidEmail(userInput)) {
          return { response: 'Please enter a valid email address so the meeting request can be followed up.' }
        }

        const nextData = { ...booking.data, email: userInput.trim() }
        setBooking({ active: true, step: 'phone', data: nextData })
        return {
          response: 'What phone or WhatsApp number should be included? You can type “skip” if you prefer email only.',
        }
      }

      case 'phone': {
        const nextData = {
          ...booking.data,
          phone: normalized === 'skip' ? '' : userInput.trim(),
        }
        setBooking({ active: true, step: 'date', data: nextData })
        return {
          response: 'Choose a preferred meeting date. This is a request, not confirmed calendar availability.',
          options: getPreferredDates(),
        }
      }

      case 'date': {
        const nextData = { ...booking.data, date: userInput.trim() }
        setBooking({ active: true, step: 'time', data: nextData })
        return {
          response: 'Choose a preferred time in Central Africa Time (CAT). Emmanuel will confirm the final slot.',
          options: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        }
      }

      case 'time': {
        const nextData = { ...booking.data, time: userInput.trim() }
        setBooking({ active: true, step: 'topic', data: nextData })
        return { response: 'What would you like to discuss during the meeting?' }
      }

      case 'topic': {
        const nextData = { ...booking.data, topic: userInput.trim() }

        if (nextData.phone) {
          setBooking({ active: true, step: 'notification', data: nextData })
          return {
            response: 'How would you prefer to receive follow-up about the meeting request?',
            options: ['Email only', 'WhatsApp only', 'Email & WhatsApp'],
          }
        }

        nextData.notificationMethod = 'email'
        setBooking({ active: true, step: 'confirm', data: nextData })
        return {
          response:
            `Please review your meeting request:\n\nName: ${nextData.name}\nEmail: ${nextData.email}\nPreferred date: ${nextData.date}\nPreferred time: ${nextData.time} CAT\nTopic: ${nextData.topic}\n\nSend this request to Emmanuel?`,
          options: ['Send meeting request', 'Cancel'],
        }
      }

      case 'notification': {
        let method: BookingData['notificationMethod'] = 'email'

        if (normalized.includes('whatsapp') && normalized.includes('email')) method = 'both'
        else if (normalized.includes('whatsapp')) method = 'whatsapp'

        const nextData = { ...booking.data, notificationMethod: method }
        setBooking({ active: true, step: 'confirm', data: nextData })

        return {
          response:
            `Please review your meeting request:\n\nName: ${nextData.name}\nEmail: ${nextData.email}\nPhone: ${nextData.phone}\nPreferred date: ${nextData.date}\nPreferred time: ${nextData.time} CAT\nTopic: ${nextData.topic}\n\nSend this request to Emmanuel?`,
          options: ['Send meeting request', 'Cancel'],
        }
      }

      case 'confirm': {
        if (normalized.includes('send') || normalized.includes('confirm') || normalized === 'yes') {
          const submitted = await submitBooking(booking.data)
          setBooking(emptyBooking)

          return submitted
            ? {
                response:
                  'Your meeting request has been submitted. It is still pending until Emmanuel confirms the date and time.',
                options: ['Explore projects', 'Start a project'],
              }
            : {
                response:
                  'I could not submit the meeting request right now. Please use the contact section or WhatsApp instead.',
                options: ['Contact Emmanuel', 'Try booking again'],
              }
        }

        setBooking(emptyBooking)
        return {
          response: 'The meeting request was cancelled. Nothing was submitted.',
          options: ['Explore projects', 'Start a project'],
        }
      }

      default:
        return { response: 'The booking workflow has been reset.' }
    }
  }

  const processLeadStep = async (userInput: string): Promise<AssistantReply> => {
    const normalized = userInput.trim().toLowerCase()

    switch (lead.step) {
      case 'name': {
        const nextData = { ...lead.data, name: userInput.trim() }
        setLead({ active: true, step: 'email', data: nextData })
        return { response: `Thanks, ${nextData.name}. What email address should Emmanuel use to reply?` }
      }

      case 'email': {
        if (!isValidEmail(userInput)) {
          return { response: 'Please enter a valid email address.' }
        }

        const nextData = { ...lead.data, email: userInput.trim() }
        setLead({ active: true, step: 'service', data: nextData })
        return {
          response: 'Which area best matches what you need?',
          options: [...serviceChoices, 'Other'],
        }
      }

      case 'service': {
        const nextData = { ...lead.data, service: userInput.trim() }
        setLead({ active: true, step: 'details', data: nextData })
        return {
          response:
            'Describe the problem, operating environment, expected outcome, and any important constraints. A few sentences are enough.',
        }
      }

      case 'details': {
        const nextData = { ...lead.data, details: userInput.trim() }
        setLead({ active: true, step: 'confirm', data: nextData })
        return {
          response:
            `Please review your project inquiry:\n\nName: ${nextData.name}\nEmail: ${nextData.email}\nArea: ${nextData.service}\nBrief: ${nextData.details}\n\nSend this to Emmanuel?`,
          options: ['Send project inquiry', 'Cancel'],
        }
      }

      case 'confirm': {
        if (normalized.includes('send') || normalized === 'yes') {
          const submitted = await submitLead(lead.data)
          setLead(emptyLead)

          return submitted
            ? {
                response: 'Your project inquiry has been sent to Emmanuel for review.',
                options: ['Explore projects', 'Book a meeting'],
              }
            : {
                response:
                  'I could not submit the inquiry right now. Please use the contact section or WhatsApp instead.',
                options: ['Contact Emmanuel', 'Try again'],
              }
        }

        setLead(emptyLead)
        return {
          response: 'The project inquiry was cancelled. Nothing was submitted.',
          options: ['Explore projects', 'Book a meeting'],
        }
      }

      default:
        return { response: 'The project inquiry workflow has been reset.' }
    }
  }

  const localIntent = async (text: string): Promise<AssistantReply | null> => {
    const normalized = text.trim().toLowerCase()

    if (booking.active && booking.step) return processBookingStep(text)
    if (lead.active && lead.step) return processLeadStep(text)

    if (
      normalized.includes('book a meeting') ||
      normalized.includes('book meeting') ||
      normalized.includes('schedule a meeting') ||
      normalized === 'try booking again'
    ) {
      setBooking({ ...emptyBooking, active: true, step: 'name' })
      return {
        response:
          "I can collect a preferred date and time for Emmanuel to confirm. First, what's your name?",
      }
    }

    if (
      normalized === 'start a project' ||
      normalized.includes('send inquiry') ||
      normalized === 'send project inquiry' ||
      normalized === 'try again'
    ) {
      setLead({ ...emptyLead, active: true, step: 'name' })
      return {
        response:
          "I'll turn this into a structured project inquiry for Emmanuel. First, what's your name?",
      }
    }

    if (normalized === 'explore projects' || normalized === 'see projects' || normalized === 'view projects') {
      return {
        response:
          projectChoices.length > 0
            ? `Selected engineering work:\n\n${projectChoices.map((project, index) => `${index + 1}. ${project}`).join('\n')}\n\nAsk me what problem you are trying to solve and I can help match it to a project.`
            : 'Project details are available in the Projects section of the portfolio.',
        options: ['Find a relevant project', 'Start a project', 'Book a meeting'],
      }
    }

    if (normalized === 'view skills' || normalized === 'skills & capabilities') {
      const skills = dynamicSkills.length
        ? dynamicSkills.slice(0, 14)
        : ['Embedded Systems', 'IoT', 'Robotics', 'Full-Stack Development']

      return {
        response: `Core capabilities currently shown in the portfolio:\n\n${skills.map(skill => `• ${skill}`).join('\n')}`,
        options: ['Find a relevant project', 'Start a project'],
      }
    }

    if (normalized === 'services' || normalized === 'view services') {
      return {
        response: `Current service areas:\n\n${serviceChoices.map(service => `• ${service}`).join('\n')}\n\nFor an accurate scope, the best next step is a short project brief.`,
        options: ['Start a project', 'Book a meeting'],
      }
    }

    if (
      normalized === 'contact emmanuel' ||
      normalized === 'contact info' ||
      normalized === 'contact information'
    ) {
      return {
        response: `Public contact details:\n\nEmail: ${profile.email}\nWhatsApp: ${profile.phone}\nLocation: ${profile.location}`,
        options: ['Start a project', 'Book a meeting'],
      }
    }

    return null
  }

  const fallbackResponse = (text: string): AssistantReply => {
    const normalized = text.toLowerCase()

    if (normalized.includes('skill') || normalized.includes('technology') || normalized.includes('stack')) {
      return {
        response:
          'I can show the portfolio capability list, but deeper conversational matching is temporarily unavailable.',
        options: ['Skills & capabilities', 'Explore projects'],
      }
    }

    if (normalized.includes('project') || normalized.includes('build') || normalized.includes('work')) {
      return {
        response:
          'I can still show Emmanuel’s verified projects and collect a project brief while conversational AI is unavailable.',
        options: ['Explore projects', 'Start a project'],
      }
    }

    return {
      response:
        'Conversational AI is temporarily unavailable, but the portfolio actions still work. You can explore projects, start a project inquiry, or request a meeting.',
      options: ['Explore projects', 'Start a project', 'Book a meeting'],
    }
  }

  const askAI = async (text: string): Promise<AssistantReply> => {
    const nextHistory: AIHistoryMessage[] = [
      ...aiHistory,
      { role: 'user', content: text },
    ].slice(-8)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      })

      if (!response.ok) return fallbackResponse(text)

      const data = await response.json()

      if (typeof data.response !== 'string' || !data.response.trim()) {
        return fallbackResponse(text)
      }

      const assistantMessage = data.response.trim()
      setAiHistory(
        [...nextHistory, { role: 'assistant', content: assistantMessage }].slice(-8)
      )

      trackEvent('/intent/ai-assistant')

      return {
        response: assistantMessage,
        options: ['Explore projects', 'Start a project', 'Book a meeting'],
      }
    } catch {
      return fallbackResponse(text)
    }
  }

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim()
    if (!text || isTyping) return

    setInput('')
    setMessages(current => [
      ...current,
      { id: nextMessageId(), role: 'user', content: text },
    ])
    setIsTyping(true)

    try {
      const local = await localIntent(text)
      const reply = local ?? (await askAI(text))

      setMessages(current => [
        ...current,
        {
          id: nextMessageId(),
          role: 'assistant',
          content: reply.response,
          options: reply.options,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage()
  }

  if (!floatingVisible) return null

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(current => !current)}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-4 right-4 z-50 flex h-12 items-center gap-2 border border-[#7CA7EB]/50 bg-[#000B26] px-4 text-[#F7F3EC] shadow-2xl transition hover:border-[#7CA7EB] sm:bottom-6 sm:right-6"
        aria-label={isOpen ? 'Close portfolio AI' : 'Open portfolio AI'}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-[#7CA7EB]" />}
        <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:inline">
          {isOpen ? 'Close' : 'Ask AI'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed bottom-20 right-3 z-50 flex h-[72vh] max-h-[640px] w-[calc(100vw-24px)] flex-col overflow-hidden border border-white/20 bg-[#070B17] shadow-2xl sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[420px]"
            aria-label="Emmanuel portfolio AI assistant"
          >
            <header className="border-b border-white/10 bg-[#000B26] px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#7CA7EB]/40 text-[#7CA7EB]">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-[#F7F3EC]">Emmanuel AI</h2>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Portfolio guide · verified project context
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetConversation}
                  className="border border-white/10 p-2 text-white/40 transition hover:border-white/25 hover:text-white"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    <div className={message.role === 'user' ? 'max-w-[86%]' : 'max-w-[92%]'}>
                      <div
                        className={
                          'px-4 py-3 text-sm leading-6 whitespace-pre-wrap ' +
                          (message.role === 'user'
                            ? 'bg-[#7CA7EB] text-[#000B26]'
                            : 'border border-white/10 bg-[#F7F3EC] text-[#000B26]')
                        }
                      >
                        {message.content}
                      </div>

                      {message.role === 'assistant' &&
                        message.options &&
                        index === messages.length - 1 &&
                        !isTyping && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.options.map(option => (
                              <button
                                key={option}
                                onClick={() => void sendMessage(option)}
                                className="border border-white/20 px-3 py-2 text-left text-[11px] font-semibold text-white/60 transition hover:border-[#7CA7EB] hover:text-[#7CA7EB]"
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
                  <div className="flex justify-start">
                    <div className="border border-white/10 bg-[#F7F3EC] px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map(index => (
                          <span
                            key={index}
                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#000B26]/50"
                            style={{ animationDelay: `${index * 140}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-white/10 bg-[#000B26]">
              {!booking.active && !lead.active && messages.length <= 2 && (
                <div className="grid grid-cols-2 gap-px border-b border-white/10 bg-white/10">
                  {[
                    { label: 'Projects', value: 'Explore projects', icon: FolderOpen },
                    { label: 'Services', value: 'Services', icon: BriefcaseBusiness },
                    { label: 'Project brief', value: 'Start a project', icon: ArrowUpRight },
                    { label: 'Meeting', value: 'Book a meeting', icon: CalendarDays },
                  ].map(action => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => void sendMessage(action.value)}
                        className="flex items-center gap-2 bg-[#000B26] px-4 py-3 text-left text-xs font-semibold text-white/60 transition hover:bg-white/[0.04] hover:text-white"
                      >
                        <Icon className="h-3.5 w-3.5 text-[#CBB08A]" />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
                <textarea
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      if (input.trim()) void sendMessage()
                    }
                  }}
                  rows={1}
                  disabled={isTyping}
                  placeholder={
                    booking.active || lead.active
                      ? 'Type your answer…'
                      : 'Ask about a project, capability, or idea…'
                  }
                  className="max-h-28 min-h-10 flex-1 resize-none border border-white/20 bg-[#070B17] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7CA7EB]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F7F3EC] text-[#000B26] transition hover:bg-[#7CA7EB] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <p className="px-3 pb-3 text-[9px] leading-4 text-white/25">
                AI answers are grounded in public portfolio data. Booking and inquiry details use separate submission workflows.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
