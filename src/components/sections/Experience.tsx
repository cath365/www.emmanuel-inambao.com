'use client'

import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { useExperience } from '@/lib/experience'
import { useLanguage } from '@/lib/i18n'
import Image from 'next/image'

export default function Experience() {
  const { experiences } = useExperience()
  const { t } = useLanguage()

  if (experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="py-20 bg-[#F1EEE7] dark:bg-dark-900 border-y border-[#DED8CE] dark:border-dark-800/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#526E8A] dark:text-primary-400">
            06 — Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#10243E] dark:text-white mb-4">
            {t('experience.title')}
          </h2>
          <p className="text-[#667384] dark:text-dark-300 max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-[#AAB6C2] dark:bg-gradient-to-b dark:from-primary-500 dark:via-primary-600 dark:to-primary-700" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-start mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-2 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#526E8A] dark:bg-primary-500 rounded-full border-4 border-[#F1EEE7] dark:border-dark-900 z-10" />

              {/* Content card */}
              <div className={`ml-6 sm:ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-white/70 dark:bg-dark-800/50 border border-[#DDD7CC] dark:border-dark-700 rounded-sm p-4 sm:p-6 hover:border-[#AAB6C2] dark:hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {exp.logo ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                        <Image
                          src={exp.logo}
                          alt={exp.company}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-[#10243E] dark:text-white">{exp.position}</h3>
                      <p className="text-[#526E8A] dark:text-primary-400 font-medium">{exp.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#697483] dark:text-dark-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                  </div>

                  <p className="mt-4 text-[#566273] dark:text-dark-300">{exp.description}</p>

                  {exp.achievements.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#566273] dark:text-dark-300">
                          <ChevronRight className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
