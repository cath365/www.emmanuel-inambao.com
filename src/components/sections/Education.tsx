'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  GraduationCap, 
  Users, 
  Lightbulb, 
  Heart,
  BookOpen,
  Award,
  Rocket,
  Target
} from 'lucide-react'

// Education and mentorship programs data
const programs = [
  {
    id: 'robotics-kids',
    title: 'Robotics for Kids',
    ageRange: '6-16 years',
    icon: Rocket,
    description: 'Hands-on robotics workshops where young learners build and program their first robots using Arduino and basic sensors.',
    impact: '50+ students trained',
    topics: ['Basic Electronics', 'Arduino Programming', 'Sensor Integration', 'Problem Solving'],
  },
  {
    id: 'arduino-fundamentals',
    title: 'Arduino Project Training',
    ageRange: 'All ages',
    icon: Lightbulb,
    description: 'Comprehensive Arduino courses from beginner to advanced, covering real-world project development and deployment.',
    impact: '30+ projects mentored',
    topics: ['Circuit Design', 'C++ Programming', 'IoT Basics', 'Project Documentation'],
  },
  {
    id: 'stem-community',
    title: 'Community STEM Outreach',
    ageRange: 'Schools & Organizations',
    icon: Users,
    description: 'Free workshops at local schools and community centers, introducing engineering concepts to underserved communities.',
    impact: '10+ schools reached',
    topics: ['Career Awareness', 'Hands-on Demos', 'Mentorship Programs', 'Resource Donation'],
  },
]

// Achievements and certifications
const achievements = [
  {
    title: 'Engineering Excellence',
    description: 'Recognized for innovative solutions in embedded systems',
    year: '2024',
  },
  {
    title: 'Community Impact Award',
    description: 'STEM education contributions in Zambia',
    year: '2023',
  },
  {
    title: 'IoT Innovation',
    description: 'Smart agriculture solutions for local farmers',
    year: '2023',
  },
]

export default function Education() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
      id="education"
      ref={ref}
      className="py-20 lg:py-32"
      aria-labelledby="education-heading"
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
              Education & Mentorship
            </span>
            <h2 id="education-heading" className="section-heading mt-2">
              Building the{' '}
              <span className="gradient-text">Next Generation</span>
            </h2>
            <p className="section-subheading mx-auto mt-4">
              Engineering knowledge is most valuable when shared. I'm committed to 
              mentoring young engineers and making STEM education accessible across Zambia.
            </p>
          </motion.div>

          {/* Philosophy statement */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="card bg-gradient-to-br from-primary-900/20 to-dark-800/50 border-primary-700/30 text-center p-8 lg:p-10">
              <GraduationCap className="w-12 h-12 text-primary-400 mx-auto mb-4" aria-hidden="true" />
              <blockquote className="text-xl lg:text-2xl text-dark-200 italic leading-relaxed">
                "True engineering excellence isn't measured by what you build alone, 
                but by how many others you empower to build alongside you."
              </blockquote>
              <p className="mt-4 text-dark-500">— Emmanuel Inambao</p>
            </div>
          </motion.div>

          {/* Programs grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <motion.div
                  key={program.id}
                  variants={itemVariants}
                  className="card group"
                >
                  {/* Icon and title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary-600/10 group-hover:bg-primary-600/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{program.title}</h3>
                      <p className="text-accent-400 text-sm">{program.ageRange}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-dark-400 text-sm leading-relaxed mb-4">
                    {program.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 bg-dark-700/50 text-dark-300 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Impact */}
                  <div className="pt-4 border-t border-dark-700">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" aria-hidden="true" />
                      <span className="text-sm font-medium text-dark-200">
                        {program.impact}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Achievements and approach */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Teaching approach */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-400" aria-hidden="true" />
                Teaching Philosophy
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Learn by Doing',
                    description: 'Every session involves building something tangible. Theory is introduced through practice, not the other way around.',
                  },
                  {
                    title: 'Problem-First Approach',
                    description: 'Students learn to identify problems before jumping to solutions. This builds critical thinking that lasts beyond any specific technology.',
                  },
                  {
                    title: 'Real-World Relevance',
                    description: 'Projects are inspired by actual African challenges—water management, agriculture, accessibility—making learning meaningful.',
                  },
                  {
                    title: 'Inclusive Access',
                    description: 'Cost should never be a barrier. I use affordable components and provide resources to students who can\'t afford materials.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-dark-400 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-400" aria-hidden="true" />
                Recognition & Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="p-4 bg-dark-800/50 border border-dark-700 rounded-lg hover:border-accent-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <p className="text-dark-400 text-sm mt-1">{achievement.description}</p>
                      </div>
                      <span className="text-accent-400 text-sm font-mono">{achievement.year}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action */}
              <div className="mt-8 p-6 bg-gradient-to-br from-accent-900/20 to-dark-800/50 border border-accent-700/30 rounded-xl">
                <Target className="w-8 h-8 text-accent-400 mb-3" aria-hidden="true" />
                <h4 className="text-white font-semibold mb-2">Want to Partner?</h4>
                <p className="text-dark-400 text-sm mb-4">
                  Schools, organizations, and NGOs interested in STEM education 
                  partnerships are welcome to reach out.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
                >
                  Discuss Partnership →
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
