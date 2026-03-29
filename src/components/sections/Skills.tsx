'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n'

const SkillGlobe = dynamic(() => import('@/components/ui/SkillGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="text-dark-500 text-sm">Loading 3D Globe...</div>
    </div>
  ),
})
import { 
  Cpu, 
  Globe, 
  Code, 
  Shield, 
  Radio, 
  Cog,
  Database,
  Wifi,
  Lock,
  Server
} from 'lucide-react'

// Skills data organized by category
const skillCategories = [
  {
    id: 'hardware',
    title: 'Hardware & Embedded',
    icon: Cpu,
    description: 'Physical systems and microcontroller development',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Arduino', level: 95 },
      { name: 'ESP32', level: 90 },
      { name: 'Ultrasonic Sensors', level: 92 },
      { name: 'Relays & Switching', level: 88 },
      { name: 'L298N Motor Driver', level: 85 },
      { name: 'Servo & DC Motors', level: 90 },
      { name: 'Power Regulation (12V→5V/9V)', level: 85 },
      { name: 'PCB Design Basics', level: 75 },
    ],
  },
  {
    id: 'software',
    title: 'Software & Web',
    icon: Code,
    description: 'Frontend, backend, and full-stack development',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Next.js', level: 88 },
      { name: 'React', level: 90 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'JavaScript', level: 92 },
      { name: 'TypeScript', level: 80 },
      { name: 'REST APIs', level: 88 },
      { name: 'Admin Dashboards', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    id: 'iot',
    title: 'IoT & Networking',
    icon: Wifi,
    description: 'Connected devices and communication protocols',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Wi-Fi AP/STA Modes', level: 92 },
      { name: 'Local Web Servers', level: 90 },
      { name: 'Offline-First Systems', level: 88 },
      { name: 'MQTT Protocol', level: 82 },
      { name: 'HTTP/HTTPS', level: 90 },
      { name: 'Firebase Integration', level: 78 },
      { name: 'WebSocket', level: 80 },
      { name: 'Serial Communication', level: 88 },
    ],
  },
  {
    id: 'security',
    title: 'Security & Systems',
    icon: Shield,
    description: 'Secure design and access control',
    color: 'from-amber-500 to-orange-500',
    skills: [
      { name: 'Authentication Systems', level: 85 },
      { name: 'Role-Based Access Control', level: 88 },
      { name: 'Offline Validation', level: 90 },
      { name: 'Secure Device Logic', level: 85 },
      { name: 'Data Encryption Basics', level: 75 },
      { name: 'Secure OTA Updates', level: 72 },
    ],
  },
]

// Skill badge component
function SkillBadge({ name, level }: { name: string; level: number }) {
  return (
    <div className="group relative">
      <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300">
        <span className="text-dark-200 text-sm font-medium">{name}</span>
        <span className="text-primary-400 text-xs font-mono">{level}%</span>
      </div>
      {/* Skill level bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-lg transition-all duration-500 group-hover:h-1" 
           style={{ width: `${level}%` }} 
      />
    </div>
  )
}

// Skill category card component
function SkillCard({ 
  category, 
  index 
}: { 
  category: typeof skillCategories[0]
  index: number 
}) {
  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card relative overflow-hidden"
    >
      {/* Gradient accent line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
        aria-hidden="true"
      />
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{category.title}</h3>
          <p className="text-dark-400 text-sm mt-1">{category.description}</p>
        </div>
      </div>
      
      {/* Skills grid */}
      <div className="grid gap-2">
        {category.skills.map((skill) => (
          <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()
  const [showGlobe, setShowGlobe] = useState(false)

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 lg:py-32"
      aria-labelledby="skills-heading"
    >
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            {t('skills.title')}
          </span>
          <h2 id="skills-heading" className="section-heading mt-2">
            {t('skills.heading')}
          </h2>
          <p className="section-subheading mx-auto mt-4">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* 3D Interactive Globe */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          {!showGlobe ? (
            <button
              onClick={() => setShowGlobe(true)}
              className="btn-secondary text-sm"
            >
              View Interactive 3D Skill Globe
            </button>
          ) : (
            <SkillGlobe />
          )}
        </motion.div>

        {/* Additional tools section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Tools & Platforms I Work With
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'Arduino IDE',
              'VS Code',
              'Git',
              'Postman',
              'Figma',
              'Fritzing',
              'PlatformIO',
              'Firebase Console',
              'Vercel',
              'GitHub',
              'Multimeter',
              'Oscilloscope',
            ].map((tool) => (
              <span
                key={tool}
                className="tech-badge hover:border-primary-500/50 hover:text-primary-400 transition-all duration-200"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
