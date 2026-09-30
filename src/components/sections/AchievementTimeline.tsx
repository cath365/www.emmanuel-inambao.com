'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface TimelineItem {
  year: string
  title: string
  description: string
  type: 'work' | 'education' | 'achievement' | 'project'
  icon?: string
}

const timelineData: TimelineItem[] = [
  {
    year: '2024',
    title: 'Full-Stack Systems Engineer',
    description: 'Leading IoT and robotics development for clients. Building scalable solutions with cloud integration and real-time dashboards.',
    type: 'work',
  },
  {
    year: '2023',
    title: 'AWS IoT Core Fundamentals',
    description: 'Achieved AWS certification in cloud-connected IoT architectures, device shadows, and Greengrass.',
    type: 'achievement',
  },
  {
    year: '2023',
    title: 'Smart Irrigation System Deployed',
    description: 'Deployed automated irrigation system across 3 farms in Lusaka region, reducing water usage by 40%.',
    type: 'project',
  },
  {
    year: '2022',
    title: 'Certified IoT Developer — Cisco',
    description: 'Completed Cisco Networking Academy IoT Developer certification covering networking, security, and data analytics.',
    type: 'achievement',
  },
  {
    year: '2021',
    title: 'Lead IoT Engineer & Freelance Consultant',
    description: 'Started independent consulting practice designing and deploying IoT systems for agriculture and industry.',
    type: 'work',
  },
  {
    year: '2021',
    title: 'Advanced Diploma in Electronic Engineering',
    description: 'Graduated from University of Zambia. Specialization in Industrial Automation. Thesis: Smart Irrigation Systems using IoT.',
    type: 'education',
  },
  {
    year: '2020',
    title: 'Electronics Instructor & Mentor',
    description: 'Began teaching embedded systems, PCB design, and IoT development. Trained 200+ students to date.',
    type: 'work',
  },
  {
    year: '2018',
    title: 'Started Electronic Engineering Studies',
    description: 'Enrolled at University of Zambia to pursue Advanced Diploma in Electronic Engineering.',
    type: 'education',
  },
]

const getTypeColor = (type: TimelineItem['type']) => {
  switch (type) {
    case 'work':
      return 'bg-blue-500'
    case 'education':
      return 'bg-green-500'
    case 'achievement':
      return 'bg-yellow-500'
    case 'project':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

const getTypeIcon = (type: TimelineItem['type']) => {
  switch (type) {
    case 'work':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    case 'education':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
        </svg>
      )
    case 'achievement':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      )
    case 'project':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
  }
}

function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content */}
      <div className="w-5/12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${
            isLeft ? 'text-right' : 'text-left'
          }`}
        >
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.year}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
        </motion.div>
      </div>

      {/* Center line and dot */}
      <div className="w-2/12 flex justify-center">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`w-10 h-10 rounded-full ${getTypeColor(item.type)} flex items-center justify-center text-white shadow-lg z-10 relative`}
          >
            {getTypeIcon(item.type)}
          </motion.div>
        </div>
      </div>

      {/* Empty space for alignment */}
      <div className="w-5/12" />
    </motion.div>
  )
}

export default function AchievementTimeline() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of my professional milestones and achievements
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Education</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Achievement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Project</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full" />

          {/* Timeline items */}
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <TimelineItemComponent key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
