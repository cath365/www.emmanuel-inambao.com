'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  Wrench,
} from 'lucide-react'

const planningAreas = [
  {
    icon: CheckCircle2,
    title: 'Define the learning objective',
    description:
      'Start with what students should understand or demonstrate, then choose a project that makes that learning visible.',
  },
  {
    icon: Cpu,
    title: 'Select components and difficulty',
    description:
      'Choose suitable boards, sensors, motors and supporting parts based on learner level, time, safety and project complexity.',
  },
  {
    icon: Code2,
    title: 'Map programming concepts',
    description:
      'Break the project into programming ideas such as inputs, outputs, conditions, timing, communication and reusable functions.',
  },
  {
    icon: Cpu,
    title: 'Connect electronics and robotics',
    description:
      'Plan the electronics, sensing, motion and communication concepts learners need in order to understand how the system behaves.',
  },
  {
    icon: Wrench,
    title: 'Structure project stages',
    description:
      'Split the build into manageable milestones so learners can assemble, program, troubleshoot and improve one subsystem at a time.',
  },
  {
    icon: CheckCircle2,
    title: 'Test the learning outcome',
    description:
      'Define how students will test the finished project and what evidence shows that the intended engineering concepts were learned.',
  },
]

export default function Education() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="education" ref={ref} className="py-20 lg:py-28" aria-labelledby="education-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
            STEM project planning
          </p>
          <h2 id="education-heading" className="section-heading mt-3">
            Designing projects students can learn engineering from.
          </h2>
          <p className="section-subheading mx-auto mt-4">
            At Robotix Institute, part of my role is helping plan practical robotics, coding and electronics projects rather than only delivering prepared lessons. The project itself becomes the learning framework.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {planningAreas.map((area, index) => {
            const Icon = area.icon
            return (
              <motion.article
                key={area.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-sm border border-[#DDD7CC] bg-white/65 p-5 dark:border-dark-800 dark:bg-dark-900/55"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#EEF1F3] text-[#526E8A] dark:bg-primary-500/10 dark:text-primary-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#10243E] dark:text-white">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#667384] dark:text-dark-400">{area.description}</p>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-8 rounded-sm border border-[#D8D2C8] bg-[#F6F3EC] p-6 dark:border-dark-700 dark:bg-dark-900/55"
        >
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-1 h-6 w-6 shrink-0 text-[#526E8A] dark:text-primary-400" />
            <div>
              <h3 className="text-xl font-semibold text-[#10243E] dark:text-white">Project-based robotics education</h3>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-[#667384] dark:text-dark-400">
                This work includes planning what students should build, defining learning objectives, selecting appropriate technologies and components, setting the difficulty level, structuring project stages, identifying the programming and electronics concepts required, supporting troubleshooting and deciding what final demonstration will show successful learning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
