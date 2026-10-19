'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useSiteContent, type FaqEntry } from '@/lib/site-content'

function FAQItem({ faq, index, isInView }: { faq: FaqEntry; index: number; isInView: boolean }) {
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
  const { content } = useSiteContent()
  const { faq } = content
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
            {faq.eyebrow}
          </p>
          <h2 className="section-heading">{faq.heading}</h2>
          <p className="section-subheading mx-auto">
            {faq.intro}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faq.questions.map((faq, index) => (
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
