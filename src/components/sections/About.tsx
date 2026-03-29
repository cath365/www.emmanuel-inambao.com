'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Lightbulb, Wrench, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

// Core values/pillars data
const pillars = [
  {
    icon: Target,
    title: 'Problem-First Engineering',
    description: 'Every project starts with a real problem that needs solving. I focus on understanding the challenge before writing a single line of code.',
  },
  {
    icon: Wrench,
    title: 'Hardware + Software',
    description: 'True systems engineering requires mastery of both domains. I design circuits, write firmware, and build the dashboards that bring it all together.',
  },
  {
    icon: Lightbulb,
    title: 'Practical Innovation',
    description: 'Innovation should be deployable, not theoretical. I build systems that work in the field, offline when needed, and serve real users.',
  },
  {
    icon: Users,
    title: 'Knowledge Transfer',
    description: 'Engineering skills must be shared. I actively mentor young engineers and students, building the next generation of African innovators.',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

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
      id="about"
      ref={ref}
      className="py-20 lg:py-32 bg-dark-900/50"
      aria-labelledby="about-heading"
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
              {t('about.title')}
            </span>
            <h2 id="about-heading" className="section-heading mt-2">
              {t('about.heading')}
            </h2>
          </motion.div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Story section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-dark-200 leading-relaxed">
                I'm <strong className="text-white">Professor Emmanuel Inambao</strong>, 
                an Electronic Engineer based in Lusaka, Zambia. With deep expertise in 
                embedded systems, IoT, and full-stack development, I specialize in 
                building complete systems — from the sensor to the dashboard.
              </p>
              <p className="text-dark-400 leading-relaxed">
                My journey in engineering has been driven by one principle: 
                <em className="text-primary-400"> technology must serve people</em>. 
                Whether it's helping farmers automate irrigation, enabling industries 
                to monitor critical systems, or creating assistive devices for those 
                with disabilities — every project I undertake aims to create tangible impact.
              </p>
              <p className="text-dark-400 leading-relaxed">
                I don't just write code or design circuits. I architect complete solutions 
                that consider power constraints, network availability, user experience, 
                and long-term maintenance. My systems are built to work in real African 
                conditions — where internet may be unreliable, power may fluctuate, and 
                robustness is non-negotiable.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-dark-700">
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">15+</p>
                  <p className="text-dark-500 text-xs sm:text-sm">Projects Delivered</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">50+</p>
                  <p className="text-dark-500 text-xs sm:text-sm">Students Mentored</p>
                </div>
                <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">5+</p>
                  <p className="text-dark-500 text-xs sm:text-sm">Years Experience</p>
                </div>
              </div>
            </motion.div>

            {/* Pillars grid */}
            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 gap-4"
            >
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  variants={itemVariants}
                  className="card group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">
                    <pillar.icon 
                      className="w-6 h-6 text-primary-500" 
                      aria-hidden="true" 
                    />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-dark-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
