'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

// Contact information
const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'denuelinambao@gmail.com',
    href: 'mailto:denuelinambao@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+260 973 914 432',
    href: 'https://wa.me/260973914432',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Lusaka, Zambia',
    href: null,
  },
]

// Social links
const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/bolo3574',
    username: '@bolo3574',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/emmanuelinambao',
    username: 'Emmanuel Inambao',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setFormStatus('success')
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' })
          setFormStatus('idle')
        }, 3000)
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 lg:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
              {t('contact.title')}
            </span>
            <h2 id="contact-heading" className="section-heading mt-2">
              {t('contact.subtitle')}
            </h2>
            <p className="section-subheading mx-auto mt-4">
              {t('contact.description')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6">
                Contact Information
              </h3>
              
              {/* Contact cards */}
              <div className="space-y-4 mb-8">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-center gap-4 p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-all duration-300">
                      <div className="p-3 rounded-lg bg-primary-600/10">
                        <Icon className="w-5 h-5 text-primary-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-dark-400 text-sm">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  )

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  )
                })}
              </div>

              {/* Social links */}
              <h3 className="text-xl font-bold text-white mb-4">
                Connect Online
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-all duration-300 group"
                      aria-label={`${social.label}: ${social.username}`}
                    >
                      <Icon className="w-5 h-5 text-dark-400 group-hover:text-primary-400 transition-colors" aria-hidden="true" />
                      <div>
                        <p className="text-white text-sm font-medium">{social.label}</p>
                        <p className="text-dark-500 text-xs">{social.username}</p>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Availability note */}
              <div className="mt-8 p-4 bg-green-900/20 border border-green-700/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 mt-1 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  <div>
                    <p className="text-green-400 font-medium">Available for Projects</p>
                    <p className="text-dark-400 text-sm mt-1">
                      Currently accepting new engineering projects and consultations.
                      Response time: typically within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-primary-400" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white">Send a Message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-dark-300 mb-2"
                    >
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-dark-300 mb-2"
                    >
                      {t('contact.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject field */}
                  <div>
                    <label 
                      htmlFor="subject" 
                      className="block text-sm font-medium text-dark-300 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="project">Project Inquiry</option>
                      <option value="consultation">Technical Consultation</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="mentorship">Mentorship / Training</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-dark-300 mb-2"
                    >
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'success'}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" aria-hidden="true" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" aria-hidden="true" />
                        {t('contact.send')}
                      </>
                    )}
                  </button>

                  {/* Form status messages */}
                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
                      <p className="text-green-400 text-sm">
                        Thank you! I'll get back to you soon.
                      </p>
                    </motion.div>
                  )}

                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/30 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
                      <p className="text-red-400 text-sm">
                        Something went wrong. Please try again or email directly.
                      </p>
                    </motion.div>
                  )}
                </form>

                {/* Direct email option */}
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <p className="text-dark-400 text-sm text-center mb-3">
                    Prefer email? Reach me directly at:
                  </p>
                  <a 
                    href="mailto:denuelinambao@gmail.com?subject=Portfolio%20Contact" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-dark-800/50 border border-dark-700 rounded-lg text-primary-400 hover:bg-dark-700/50 hover:border-primary-500/50 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    denuelinambao@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
