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

const iconMap = {
  hardware: Cpu,
  software: Code,
  iot: Wifi,
  security: Shield,
  default: Cog,
}

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
