'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Layers3, ClipboardCheck, GraduationCap } from 'lucide-react'

const pillars = [
  {
    icon: Cpu,
    title: 'Robotics & Embedded Engineering',
    description:
      'Designing and troubleshooting robotics, IoT and embedded systems using microcontrollers, sensors, actuators, wireless communication and practical electronics.',
  },
  {
    icon: Layers3,
    title: 'Full-Stack Systems Development',
    description:
      'Building the software around physical systems and business workflows: web applications, mobile applications, APIs, databases, dashboards, authentication and cloud deployment.',
  },
  {
    icon: ClipboardCheck,
    title: 'Technical Project Management',
    description:
      'Turning a problem into requirements, scope, architecture, components, milestones, budgets, risks, testing plans and an implementation path that can be coordinated and delivered.',
  },
  {
    icon: GraduationCap,
    title: 'STEM Project & Programme Planning',
    description:
      'Planning practical engineering projects for learners: defining objectives, selecting technologies, structuring project stages and designing activities that demonstrate real learning.',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      className="border-y border-[#E1DBD1] bg-[#F7F5EF] py-20 dark:border-dark-800/60 dark:bg-dark-900/35 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
              Professional profile
            </p>
            <h2 id="about-heading" className="section-heading mt-3">
              Engineering across hardware, software and project delivery.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#39495A] dark:text-dark-200">
              I am Emmanuel Inambao, a Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager based in Lusaka, Zambia.
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-[#697483] dark:text-dark-400">
              My work combines electronics, embedded systems, robotics, IoT and software engineering with the planning needed to move a technical project from an idea into a testable and deployable system. I work across requirements, architecture, component planning, implementation, troubleshooting, testing, documentation and improvement rather than treating hardware, software and delivery as separate activities.
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-[#697483] dark:text-dark-400">
              At Robotix Institute, I contribute to engineering and R&D work, technical project coordination and project-based STEM programmes. This includes planning practical robotics and coding projects, defining what learners should understand from each project, selecting suitable technologies and supporting technical delivery with students, team members and stakeholders.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.article
                  key={pillar.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-sm border border-[#DDD7CC] bg-white/60 p-5 dark:border-dark-800 dark:bg-dark-900/55"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#EEF1F3] text-[#526E8A] dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#10243E] dark:text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#697483] dark:text-dark-400">{pillar.description}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
