'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What types of projects do you work on?',
    answer: 'I specialize in IoT systems, embedded firmware, industrial automation, robotics, and full-stack web applications. From a single sensor node to a complete smart factory system — I handle the entire engineering stack.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'It depends on complexity. A simple IoT prototype takes 2-4 weeks. A full industrial automation system with custom PCB design, firmware, and a web dashboard typically takes 2-4 months. I provide detailed timelines during the discovery phase.',
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Absolutely. I work with clients across Africa, Europe, and beyond. All communication is handled professionally via video calls, and I support 7 languages. Time zone differences are never a problem.',
  },
  {
    question: 'Can you help with an existing project that needs improvement?',
    answer: 'Yes. I regularly audit and improve existing embedded systems, optimize firmware performance, fix hardware issues, and modernize legacy industrial control systems. I can review your current setup and propose targeted improvements.',
  },
  {
    question: 'What is your tech stack?',
    answer: 'Hardware: Arduino, ESP32, STM32, Raspberry Pi, custom PCB design. Software: C/C++, Python, TypeScript, React/Next.js, Node.js. Protocols: MQTT, LoRa, BLE, Wi-Fi, Modbus, RS-485. Cloud: AWS IoT, Firebase, Vercel.',
  },
  {
    question: 'Do you provide post-deployment support?',
    answer: 'Every project includes a support period after deployment. I also offer ongoing maintenance contracts for mission-critical systems. Your systems will always have someone who knows them inside out.',
  },
  {
    question: 'How do we get started?',
    answer: 'Simple — book a free 30-minute discovery call or send me a message through the contact form. We\'ll discuss your requirements, I\'ll provide an initial assessment, and if it\'s a good fit, we move forward with a detailed proposal.',
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
