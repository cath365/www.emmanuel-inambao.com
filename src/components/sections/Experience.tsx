'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { useExperience } from '@/lib/experience'

export default function Experience() {
  const { experiences } = useExperience()

  if (experiences.length === 0) return null

  return (
    <section id="experience" className="bg-[#F7F3EC] py-20 text-[#000B26] lg:py-28" aria-labelledby="experience-heading">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#7B5F3E]">Professional context</p>
            <h2 id="experience-heading" className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              Experience around the systems.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#000B26]/58 sm:text-base">
              Product work is only part of the picture. This is the professional context behind the engineering, delivery, mentoring and technical decision-making.
            </p>
          </div>

          <div className="border-t border-[#000B26]/20">
            {experiences.map((exp, index) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="grid gap-5 border-b border-[#000B26]/20 py-7 lg:grid-cols-[0.78fr_1.22fr]"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7B5F3E]">
                    <Briefcase className="h-3.5 w-3.5" />
                    {exp.current ? 'Current role' : 'Experience'}
                  </div>
                  <h3 className="editorial-serif mt-3 text-2xl leading-tight">{exp.position}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#000B26]/68">{exp.company}</p>

                  <div className="mt-4 space-y-2 text-xs text-[#000B26]/45">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-7 text-[#000B26]/60">{exp.description}</p>
                  <div className="mt-6 border-t border-[#000B26]/15 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#000B26]/35">
                      Detailed responsibilities and outcomes are maintained in the CV and case studies.
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
