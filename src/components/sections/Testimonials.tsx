'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useTestimonials } from '@/lib/testimonials'

const legacyDemoIds = new Set(['testimonial-1', 'testimonial-2', 'testimonial-3'])

export default function Testimonials() {
  const { approvedTestimonials } = useTestimonials()
  const approvedReal = approvedTestimonials.filter(item => !legacyDemoIds.has(item.id))
  const featured = approvedReal.filter(item => item.featured).slice(0, 3)
  const testimonials = featured.length > 0 ? featured : approvedReal.slice(0, 3)

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="bg-[#000B26] py-20 text-[#F7F3EC] lg:py-28" aria-labelledby="testimonials-heading">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#7CA7EB]">Selected feedback</p>
            <h2 id="testimonials-heading" className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              What collaborators say.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#F7F3EC]/55">
              Only approved testimonials are shown here. The homepage keeps the strongest few rather than turning feedback into another long carousel.
            </p>
          </div>

          <div className="border-t border-white/15">
            {testimonials.map((item, index) => (
              <motion.blockquote
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[3rem_1fr]"
              >
                <Quote className="h-5 w-5 text-[#CBB08A]" />
                <div>
                  <p className="editorial-serif text-2xl leading-9 text-[#F7F3EC]/92">“{item.content}”</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                    <span className="font-bold text-[#7CA7EB]">{item.name}</span>
                    {item.position && <span>{item.position}</span>}
                    {item.company && <span>· {item.company}</span>}
                  </div>
                </div>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
