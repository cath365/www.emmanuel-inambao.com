'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, GraduationCap, Briefcase, FlaskConical, Users, ExternalLink } from 'lucide-react'
import { useInstitutionalPrograms } from '@/lib/institutional-programs'

const workContexts = [
  {
    icon: Building2,
    title: 'Robotix Institute',
    description: 'Robotics, IoT, embedded systems, R&D, STEM project planning and technical project coordination.',
  },
  {
    icon: GraduationCap,
    title: 'Schools & Educational Institutions',
    description: 'Project-based robotics, coding and engineering learning programmes designed around practical outcomes.',
  },
  {
    icon: Briefcase,
    title: 'Businesses & Clients',
    description: 'Web, mobile, IoT, automation and operational software systems shaped around a defined business problem.',
  },
  {
    icon: FlaskConical,
    title: 'Research & Development',
    description: 'Experimental robotics, AI-enabled systems, assistive technology, sensors, automation and connected-device prototypes.',
  },
  {
    icon: Users,
    title: 'Community & Social Impact',
    description: 'Assistive and educational technology projects where engineering is used to improve access, learning or everyday capability.',
  },
]



export default function ClientLogos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { programs } = useInstitutionalPrograms()

  return (
    <section
      id="institutional-programs"
      ref={ref}
      className="border-y border-[#DDD7CC] bg-[#FCFBF7] py-16 dark:border-dark-800/70 dark:bg-dark-950/35 lg:py-20"
      aria-labelledby="institutional-programs-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-400">
            Where I work
          </p>
          <h2 id="institutional-programs-heading" className="mt-3 font-display text-3xl font-medium tracking-tight text-[#10243E] dark:text-white sm:text-4xl">
            Engineering, project delivery and STEM programme environments
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#667384] dark:text-dark-400">
            My work spans engineering and R&D at Robotix Institute, technical systems for clients, and project-based learning environments where students build real robotics, coding and electronics projects.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {workContexts.map((context, index) => {
            const Icon = context.icon
            return (
              <motion.article
                key={context.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-sm border border-[#DDD7CC] bg-white/70 p-5 dark:border-dark-800 dark:bg-dark-900/50"
              >
                <Icon className="h-5 w-5 text-[#526E8A] dark:text-primary-400" />
                <h3 className="mt-4 font-semibold text-[#10243E] dark:text-white">{context.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#697483] dark:text-dark-400">{context.description}</p>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-12 rounded-sm border border-[#D8D2C8] bg-[#F6F3EC] p-5 dark:border-dark-700 dark:bg-dark-900/55 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526E8A] dark:text-primary-400">
            STEM & Institutional Programs
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[#10243E] dark:text-white">
            Programme involvement through Robotix Institute
          </h3>
          <p className="mt-3 max-w-4xl leading-7 text-[#667384] dark:text-dark-400">
            Through my work at Robotix Institute, I contribute to planning and supporting project-based robotics, coding and engineering programmes involving schools and technology institutions. My contribution includes defining practical learning objectives, selecting suitable technologies and components, structuring project stages, supporting delivery, troubleshooting projects and improving future programme plans.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {programs.map((program, index) => (
              <motion.a
                key={program.id}
                href={program.website || '#'}
                target={program.website ? '_blank' : undefined}
                rel={program.website ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.05 }}
                className="group rounded-sm border border-[#DDD7CC] bg-white/75 p-4 transition hover:border-[#AAB6C2] dark:border-dark-800 dark:bg-dark-950/35 dark:hover:border-primary-500/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#10243E] dark:text-white">{program.shortName || program.institution}</p>
                    <p className="mt-1 text-sm leading-5 text-[#667384] dark:text-dark-400">{program.institution}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#8A918F] transition group-hover:text-[#526E8A] dark:text-dark-500 dark:group-hover:text-primary-400" />
                </div>
                <p className="mt-3 text-xs leading-5 text-[#667384] dark:text-dark-400">
                  {program.programme}
                </p>
                <p className="mt-1 text-xs font-medium text-[#526E8A] dark:text-primary-300">
                  Role: {program.myRole}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#7A8491] dark:text-dark-500">
                  {program.status}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
