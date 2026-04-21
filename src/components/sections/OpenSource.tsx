'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Github, Star, GitFork, ExternalLink, Code } from 'lucide-react'

const ownProjects = [
  {
    name: 'smart-irrigation',
    description: 'ESP32-based automated irrigation system with soil moisture sensing and web dashboard',
    language: 'C++',
    languageColor: '#f34b7d',
    url: 'https://github.com/bolo3574/smart-irrigation',
  },
  {
    name: 'cutter-robot',
    description: 'Web-controlled precision cutting robot using ESP32 and L298N motor driver',
    language: 'C++',
    languageColor: '#f34b7d',
    url: 'https://github.com/bolo3574/cutter-robot',
  },
  {
    name: 'bottle-sorting',
    description: 'Arduino-based automated bottle sorting system using dual ultrasonic sensors',
    language: 'C++',
    languageColor: '#f34b7d',
    url: 'https://github.com/bolo3574/bottle-sorting',
  },
  {
    name: 'oil-monitoring',
    description: 'Real-time industrial oil tank monitoring with ESP32, MQTT, and Next.js dashboard',
    language: 'TypeScript',
    languageColor: '#2b7489',
    url: 'https://github.com/bolo3574/oil-monitoring',
  },
  {
    name: 'smart-walking-stick',
    description: 'Arduino-based assistive navigation device for visually impaired individuals',
    language: 'C++',
    languageColor: '#f34b7d',
    url: 'https://github.com/bolo3574/smart-walking-stick',
  },
]

const interests = [
  'Arduino & ESP32 ecosystem libraries',
  'Home Assistant integrations',
  'PlatformIO tooling',
  'Embedded systems education resources',
]

export default function OpenSource() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="opensource" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Open Source
          </p>
          <h2 className="section-heading">My Public Projects</h2>
          <p className="section-subheading mx-auto">
            I share my engineering projects on GitHub so others can learn from,
            build upon, and contribute to practical IoT and embedded systems solutions.
          </p>
        </motion.div>

        {/* My Open Source Projects */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-6 flex items-center gap-2">
            <Github className="w-5 h-5 text-primary-400" />
            Public Repositories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownProjects.map((project, index) => (
              <motion.a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group cursor-pointer hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <span className="text-white font-medium text-sm">{project.name}</span>
                </div>
                <p className="text-dark-400 text-xs mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-dark-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.languageColor }} />
                    {project.language}
                  </span>
                  <span className="flex items-center gap-1 ml-auto text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-dark-800/30 border border-dark-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-400" />
            Open Source Interests
          </h3>
          <p className="text-dark-400 text-sm mb-3">
            Areas in the open-source ecosystem I actively follow and contribute to:
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 text-xs bg-dark-700/50 text-dark-300 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/bolo3574"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            View GitHub Profile
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
