'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Github, GitPullRequest, Star, GitFork, ExternalLink } from 'lucide-react'

const contributions = [
  {
    repo: 'espressif/arduino-esp32',
    description: 'Arduino core for the ESP32 — contributed bug fixes for I2C communication stability',
    type: 'Bug Fix',
    stars: '12.5k',
    language: 'C++',
    languageColor: '#f34b7d',
  },
  {
    repo: 'micropython/micropython',
    description: 'MicroPython firmware — added support for custom sensor drivers',
    type: 'Feature',
    stars: '18.2k',
    language: 'C',
    languageColor: '#555555',
  },
  {
    repo: 'home-assistant/core',
    description: 'Home Assistant — improved Modbus integration for industrial PLCs',
    type: 'Enhancement',
    stars: '68k',
    language: 'Python',
    languageColor: '#3572A5',
  },
  {
    repo: 'platformio/platformio-core',
    description: 'PlatformIO — contributed board definitions for custom STM32 targets',
    type: 'Feature',
    stars: '7.5k',
    language: 'Python',
    languageColor: '#3572A5',
  },
]

const ownProjects = [
  {
    name: 'zambia-iot-toolkit',
    description: 'Open-source toolkit for building IoT solutions optimized for African infrastructure',
    stars: 45,
    forks: 12,
    language: 'TypeScript',
    languageColor: '#2b7489',
  },
  {
    name: 'esp32-modbus-bridge',
    description: 'ESP32-based Modbus RTU to MQTT bridge for industrial automation',
    stars: 89,
    forks: 23,
    language: 'C++',
    languageColor: '#f34b7d',
  },
  {
    name: 'smart-irrigation-firmware',
    description: 'Production firmware for solar-powered smart irrigation controllers',
    stars: 34,
    forks: 8,
    language: 'C',
    languageColor: '#555555',
  },
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
          <h2 className="section-heading">Contributing to the Community</h2>
          <p className="section-subheading mx-auto">
            I believe in giving back. Here are some of my contributions to
            open-source projects and tools I&apos;ve built for the community.
          </p>
        </motion.div>

        {/* Contributions to Major Projects */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-6 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-green-400" />
            Contributions to Major Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributions.map((contrib, index) => (
              <motion.div
                key={contrib.repo}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-dark-400" />
                    <span className="text-primary-400 font-medium text-sm">{contrib.repo}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {contrib.type}
                  </span>
                </div>
                <p className="text-dark-400 text-sm mb-3">{contrib.description}</p>
                <div className="flex items-center gap-4 text-xs text-dark-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: contrib.languageColor }} />
                    {contrib.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {contrib.stars}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Open Source Projects */}
        <div>
          <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-6 flex items-center gap-2">
            <Github className="w-5 h-5 text-primary-400" />
            My Open Source Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ownProjects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {project.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {project.forks}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
