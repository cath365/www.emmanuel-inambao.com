'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What kinds of technical work do you take on?',
    answer: 'My strongest fit is work that combines robotics, IoT, embedded systems, full-stack software or technical project planning. That can include prototypes, connected devices, dashboards, mobile applications, APIs, automation workflows and engineering-learning projects.',
  },
  {
    question: 'Can you plan a project before development starts?',
    answer: 'Yes. Technical project planning is part of my role. I can help turn a problem into requirements, scope, architecture, component needs, milestones, risks, testing plans and an implementation path before the build begins.',
  },
  {
    question: 'Do you work across both hardware and software?',
    answer: 'Yes. I work with Arduino and ESP32-class devices, sensors, motors, Bluetooth, Wi-Fi, GSM and GPS, as well as web applications, APIs, databases, dashboards and React Native / Expo mobile applications. The exact stack is chosen according to the problem rather than treated as the goal.',
  },
  {
    question: 'Can you support an existing system or prototype?',
    answer: 'Yes. Existing projects can be reviewed for architecture, integration, firmware or software issues, unreliable workflows, missing documentation, testing gaps and deployment problems. The first step is to understand the current system and evidence before recommending changes.',
  },
  {
    question: 'How long does a project take?',
    answer: 'Timelines depend on requirements, hardware availability, integrations, testing and the maturity of the existing system. I define an estimated timeline and milestones after discovery instead of using one fixed duration for every project.',
  },
  {
    question: 'Do you provide post-deployment support?',
    answer: 'Support, maintenance and iteration can be included in the agreed project scope. I do not assume the same support period for every engagement; the handover and follow-up plan should be clear before implementation begins.',
  },
  {
    question: 'How do we get started?',
    answer: 'Send the problem, intended users, operating environment, required hardware or software, timeline and any constraints. I can then assess the scope and respond with a more useful technical discussion or preliminary quotation.',
  },
]

function FAQItem({ faq, index, isInView }: { faq: typeof faqs[0]; index: number; isInView: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-5 text-left bg-dark-800/30 border border-dark-700/50
                   rounded-xl hover:border-primary-500/30 transition-all duration-300"
        aria-expanded={isOpen}
      >
        <ChevronDown
          className={`w-5 h-5 text-primary-400 shrink-0 mt-0.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white light:text-slate-900 text-sm sm:text-base">
            {faq.question}
          </h3>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-dark-400 text-sm leading-relaxed mt-3 pr-4">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="faq" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subheading mx-auto">
            Everything you need to know about working with me.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-dark-800/30 border border-dark-700/50 rounded-xl">
            <HelpCircle className="w-5 h-5 text-primary-400" />
            <p className="text-dark-300 text-sm">
              Still have questions?{' '}
              <a href="#contact" className="text-primary-400 hover:text-primary-300 font-medium">
                Get in touch
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
