'use client'

import { motion } from 'framer-motion'

const focusAreas = [
  {
    label: 'Robotics & IoT Engineering',
    detail: 'Embedded systems, sensing, automation and connected-device prototypes',
  },
  {
    label: 'Full-Stack Systems',
    detail: 'Web, mobile, APIs, databases, dashboards and deployment',
  },
  {
    label: 'Technical Project Management',
    detail: 'Requirements, scope, architecture, planning, testing and delivery',
  },
  {
    label: 'STEM Project Planning',
    detail: 'Project-based robotics, coding and engineering learning programmes',
  },
]

export default function StatsCounter() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {focusAreas.map((area, index) => (
        <motion.div
          key={area.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="rounded-sm border border-[#DDD7CC] bg-white/60 p-4 dark:border-dark-800 dark:bg-dark-900/55"
        >
          <p className="text-sm font-semibold text-[#10243E] dark:text-white">{area.label}</p>
          <p className="mt-1 text-xs leading-5 text-[#667384] dark:text-dark-400">{area.detail}</p>
        </motion.div>
      ))}
    </div>
  )
}
