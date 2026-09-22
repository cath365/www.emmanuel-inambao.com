'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n'
import { useSkills, SkillCategory } from '@/lib/skills'

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
  Code, 
  Shield, 
  Cog,
  Wifi
} from 'lucide-react'

const iconMap = {
  hardware: Cpu,
  software: Code,
  iot: Wifi,
  security: Shield,
  default: Cog,
}

const toolPlatforms = [
  { name: 'Arduino IDE', iconUrl: 'https://cdn.simpleicons.org/arduino/00878F' },
  { name: 'VS Code', iconUrl: 'https://cdn.simpleicons.org/visualstudiocode/007ACC' },
  { name: 'Git', iconUrl: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'Postman', iconUrl: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'Figma', iconUrl: 'https://cdn.simpleicons.org/figma/F24E1E' },
  {
    name: 'Fritzing',
    iconUrl:
      'https://fritzing.org/assets/uploads/logo/badge-sticker-color-34a71dbc561316150ec471202b72fe5e3510c93acd5f83d6326e836979887426.svg',
  },
  { name: 'PlatformIO', iconUrl: 'https://cdn.simpleicons.org/platformio/F5822A' },
  { name: 'Firebase Console', iconUrl: 'https://cdn.simpleicons.org/firebase/FFCA28' },
  { name: 'Vercel', iconUrl: 'https://cdn.simpleicons.org/vercel/000000/FFFFFF' },
  { name: 'GitHub', iconUrl: 'https://cdn.simpleicons.org/github/181717/FFFFFF' },
] as const

function MultimeterIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" role="img" aria-label="Multimeter">
      <rect x="10" y="4" width="28" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="15" y="9" width="18" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="29" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 29l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="39" r="1.5" fill="currentColor" />
      <circle cx="31" cy="39" r="1.5" fill="currentColor" />
      <path d="M17 40c-4 2-5 4-6 6M31 40c4 2 5 4 6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function OscilloscopeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" role="img" aria-label="Oscilloscope">
      <rect x="4" y="7" width="40" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="11" width="26" height="20" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 22h4l3-6 5 12 4-10 3 4h3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="39" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="39" cy="23" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 39v4M36 39v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Skill badge component
function SkillBadge({ name, level }: { name: string; level: number }) {
  return (
    <div className="group relative">
      <div className="flex items-center justify-between p-3 bg-white/65 dark:bg-dark-800/50 rounded-sm border border-[#DDD7CC] dark:border-dark-700 hover:border-[#AAB6C2] dark:hover:border-primary-500/50 transition-all duration-300">
        <span className="text-[#39495A] dark:text-dark-200 text-sm font-medium">{name}</span>
        <span className="text-[#526E8A] dark:text-primary-400 text-xs font-mono">{level}%</span>
      </div>
      {/* Skill level bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-[#526E8A] dark:bg-gradient-to-r dark:from-primary-500 dark:to-accent-500 rounded-b-lg transition-all duration-500 group-hover:h-1" 
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
  category: SkillCategory
  index: number 
}) {
  const Icon = iconMap[category.id as keyof typeof iconMap] || iconMap.default

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
          <h3 className="text-xl font-bold text-[#10243E] dark:text-white">{category.title}</h3>
          <p className="text-[#697483] dark:text-dark-400 text-sm mt-1">{category.description}</p>
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
  const { skillCategories } = useSkills()

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
          <span className="text-[#526E8A] dark:text-primary-500 font-medium text-sm uppercase tracking-wider">
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
          <h3 className="text-lg font-semibold text-[#10243E] dark:text-white mb-6">
            Tools & Platforms I Work With
          </h3>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {toolPlatforms.map(tool => (
              <div
                key={tool.name}
                className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-sm border border-[#DDD7CC] bg-white/65 px-4 py-5 transition-colors duration-200 hover:border-[#AAB6C2] hover:bg-white dark:border-dark-700 dark:bg-dark-800/50 dark:hover:border-primary-500/50 dark:hover:bg-dark-800"
              >
                {/* Brand marks are loaded as SVGs so they remain crisp at every screen size. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.iconUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-9 w-9 object-contain"
                  loading="lazy"
                />
                <span className="text-sm font-medium text-[#39495A] dark:text-dark-200">
                  {tool.name}
                </span>
              </div>
            ))}

            <div className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-sm border border-[#DDD7CC] bg-white/65 px-4 py-5 text-[#526E8A] transition-colors duration-200 hover:border-[#AAB6C2] hover:bg-white dark:border-dark-700 dark:bg-dark-800/50 dark:text-primary-400 dark:hover:border-primary-500/50 dark:hover:bg-dark-800">
              <MultimeterIcon />
              <span className="text-sm font-medium text-[#39495A] dark:text-dark-200">Multimeter</span>
            </div>

            <div className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-sm border border-[#DDD7CC] bg-white/65 px-4 py-5 text-[#526E8A] transition-colors duration-200 hover:border-[#AAB6C2] hover:bg-white dark:border-dark-700 dark:bg-dark-800/50 dark:text-primary-400 dark:hover:border-primary-500/50 dark:hover:bg-dark-800">
              <OscilloscopeIcon />
              <span className="text-sm font-medium text-[#39495A] dark:text-dark-200">Oscilloscope</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
