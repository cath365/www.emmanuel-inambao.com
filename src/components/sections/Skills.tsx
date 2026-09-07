'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Code2, Wifi, Shield, Cog } from 'lucide-react'
import { useSkills } from '@/lib/skills'

const iconMap = {
  hardware: Cpu,
  software: Code2,
  iot: Wifi,
  security: Shield,
  default: Cog,
}

const tools = [
  'Arduino IDE', 'PlatformIO', 'VS Code', 'Git', 'Postman', 'Figma',
  'Firebase', 'Vercel', 'GitHub', 'Multimeter', 'Oscilloscope',
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { skillCategories } = useSkills()

  return (
    <section id="skills" ref={ref} className="bg-[#7CA7EB] py-20 text-[#000B26] lg:py-28" aria-labelledby="skills-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid gap-8 border-b border-[#000B26]/25 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>
            <p className="eyebrow text-[#000B26]/60">03 / Capability stack</p>
            <h2 id="skills-heading" className="editorial-serif mt-4 text-5xl leading-none tracking-[-0.025em] text-[#000B26] sm:text-6xl">
              One engineer, multiple layers.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#000B26]/70 lg:justify-self-end">
            My work crosses the boundaries between electronics and software. Instead of presenting ability as decorative percentages, this section shows the actual disciplines and technologies I use to build complete systems.
          </p>
        </motion.div>

        <div className="mt-2">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.id as keyof typeof iconMap] || iconMap.default
            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="grid gap-5 border-b border-[#000B26]/20 py-8 md:grid-cols-[4rem_0.72fr_1.28fr] md:items-start md:gap-8"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-[#000B26]/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="editorial-serif text-2xl leading-tight">{category.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#000B26]/60">{category.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:pt-1">
                  {category.skills.map(skill => (
                    <span key={skill.name} className="border border-[#000B26]/30 bg-[#F7F3EC]/25 px-3 py-2 text-xs font-semibold text-[#000B26] sm:text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#000B26]/60">Tools & platforms</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {tools.map(tool => <span key={tool} className="text-sm font-medium text-[#000B26]/80">{tool}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
