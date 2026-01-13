'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, Play, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTestimonials } from '@/lib/testimonials'
import TestimonialForm from '@/components/ui/TestimonialForm'
import Image from 'next/image'

export default function Testimonials() {
  const { testimonials } = useTestimonials()
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const featuredTestimonials = testimonials.filter(t => t.featured)
  const displayTestimonials = featuredTestimonials.length > 0 ? featuredTestimonials : testimonials

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  // Show section even with no testimonials so visitors can submit theirs
  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-20 bg-dark-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Client <span className="text-primary-500">Testimonials</span>
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto mb-8">
              Have you worked with me? Share your experience!
            </p>
            <TestimonialForm />
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="py-20 bg-dark-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Client <span className="text-primary-500">Testimonials</span>
          </h2>
          <p className="text-dark-300 max-w-2xl mx-auto mb-6">
            What clients and colleagues say about working with me
          </p>
          <TestimonialForm />
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <div className="relative mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-dark-800/50 border border-dark-700 rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Video or Image */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  {displayTestimonials[currentIndex].video ? (
                    <div 
                      className="relative aspect-video rounded-xl overflow-hidden bg-dark-700 cursor-pointer group"
                      onClick={() => setActiveVideo(displayTestimonials[currentIndex].video!)}
                    >
                      {displayTestimonials[currentIndex].image ? (
                        <Image
                          src={displayTestimonials[currentIndex].image!}
                          alt={displayTestimonials[currentIndex].name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-dark-800" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  ) : displayTestimonials[currentIndex].image ? (
                    <div className="aspect-square rounded-xl overflow-hidden bg-dark-700">
                      <Image
                        src={displayTestimonials[currentIndex].image}
                        alt={displayTestimonials[currentIndex].name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-primary-600/20 to-dark-800 flex items-center justify-center">
                      <Quote className="w-16 h-16 text-primary-500/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <Quote className="w-10 h-10 text-primary-500/30 mb-4" />
                  <p className="text-lg md:text-xl text-dark-200 leading-relaxed mb-6">
                    {displayTestimonials[currentIndex].content}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < displayTestimonials[currentIndex].rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-dark-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="text-white font-semibold text-lg">
                      {displayTestimonials[currentIndex].name}
                    </p>
                    <p className="text-primary-400">
                      {displayTestimonials[currentIndex].position}
                    </p>
                    <p className="text-dark-400 text-sm">
                      {displayTestimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {displayTestimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-white hover:bg-dark-700 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-white hover:bg-dark-700 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Dots */}
          {displayTestimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary-500'
                      : 'bg-dark-600 hover:bg-dark-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Testimonials Grid */}
        {testimonials.length > 3 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 hover:border-primary-500/50 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-dark-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-dark-300 mb-4 line-clamp-4">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center">
                      <span className="text-primary-500 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{testimonial.name}</p>
                    <p className="text-dark-400 text-xs">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center text-white hover:bg-dark-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
