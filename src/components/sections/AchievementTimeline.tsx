'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Cpu, GraduationCap, Monitor, Wrench } from 'lucide-react'

const journey = [
  {
    period: 'Current',
    title: 'Robotics & IoT Engineer | Technical Project Manager',
    organization: 'Robotix Institute',
    description:
      'Engineering, R&D, technical project coordination and project-based STEM programme planning across robotics, IoT, embedded systems and software-supported learning projects.',
    icon: Cpu,
  },
  {
    period: 'Current',
    title: 'Full-Stack Systems Developer | IoT & Electronics Projects',
    organization: 'Independent / Client Projects',
    description:
      'Build and plan web, mobile, IoT and automation systems, connecting requirements, software, hardware, APIs, deployment and client delivery.',
    icon: Monitor,
  },
  {
    period: '2024 – Feb 2025',
    title: 'Company Secretary / ICT Support',
    organization: 'Almajeed Janmotors Co. Ltd',
    description:
      'Supported company records, office operations, computers, digital systems, inventory and day-to-day ICT needs.',
    icon: Briefcase,
  },
  {
    period: '2022 – 2024',
    title: 'Project Manager',
    organization: 'Tap Code Robotic',
    description:
      'Planned and supported practical robotics and web-development learning activities, project structure and hands-on technology training.',
    icon: Wrench,
  },
  {
    period: '2023',
    title: 'Basic Electronics and Programming',
    organization: 'TME Education — Certificate of Participation',
    description:
      'Documented technical training in basic electronics and programming.',
    icon: GraduationCap,
  },
]

export default function AchievementTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="border-y border-[#E1DBD1] bg-[#FCFBF7] py-20 dark:border-dark-800 dark:bg-dark-900/35">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
            Professional journey
          </p>
          <h2 className="section-heading mt-3">Experience built through engineering and project delivery.</h2>
          <p className="section-subheading mx-auto mt-4">
            A concise timeline of documented roles and technical training. Dates that are not confirmed are intentionally not invented.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl space-y-4">
          {journey.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.article
                key={`${item.period}-${item.title}`}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="grid gap-4 rounded-sm border border-[#DDD7CC] bg-white/70 p-5 dark:border-dark-800 dark:bg-dark-900/55 sm:grid-cols-[130px_1fr]"
              >
                <div>
                  <span className="inline-flex items-center gap-2 rounded-sm bg-[#EEF1F3] px-3 py-1.5 text-xs font-semibold text-[#526E8A] dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon className="h-4 w-4" />
                    {item.period}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#10243E] dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium text-[#526E8A] dark:text-primary-300">{item.organization}</p>
                  <p className="mt-3 text-sm leading-6 text-[#667384] dark:text-dark-400">{item.description}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
