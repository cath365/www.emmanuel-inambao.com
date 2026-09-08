'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Image as ImageIcon, Play, X } from 'lucide-react'
import { useGallery, type GalleryItem } from '@/lib/gallery'

const categories = [
  { id: 'all', label: 'All work' },
  { id: 'project', label: 'Projects' },
  { id: 'prototype', label: 'Prototypes' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'event', label: 'Events' },
]

export default function Gallery() {
  const { items } = useGallery()
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const filtered = items
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))

  return (
    <section id="gallery" className="bg-[#000B26] py-20 text-[#F7F3EC] lg:py-28" aria-labelledby="gallery-heading">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#7CA7EB]">Inside the workshop</p>
            <h2 id="gallery-heading" className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              The work should look real because it is real.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F7F3EC]/55 sm:text-base">
              Prototypes, electronics, robotics, testing sessions and technical workshops — the physical side of the systems behind the portfolio.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={
                    'border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition ' +
                    (activeCategory === category.id
                      ? 'border-[#7CA7EB] bg-[#7CA7EB] text-[#000B26]'
                      : 'border-white/15 text-white/45 hover:border-white/35 hover:text-white')
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            {filtered.length === 0 ? (
              <div className="flex min-h-72 items-center justify-center border border-white/10 text-center">
                <div>
                  <ImageIcon className="mx-auto h-7 w-7 text-white/25" />
                  <p className="mt-3 text-sm text-white/35">Workshop media will appear here when added from the admin.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2) }}
                    onClick={() => setSelectedItem(item)}
                    className={
                      'group relative overflow-hidden border border-white/10 bg-white/[0.03] text-left ' +
                      (index === 0 && filtered.length > 2 ? 'sm:row-span-2' : '')
                    }
                  >
                    <div className={index === 0 && filtered.length > 2 ? 'relative min-h-[26rem] h-full' : 'relative aspect-[4/3]'}>
                      {item.type === 'video' ? (
                        <video src={item.url} className="absolute inset-0 h-full w-full object-cover" muted />
                      ) : (
                        <Image
                          src={item.url}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.025]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000B26]/95 via-[#000B26]/10 to-transparent" />

                      {item.type === 'video' && (
                        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border border-white/30 bg-[#000B26]/70">
                          <Play className="h-4 w-4" fill="currentColor" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#CBB08A]">{item.category}</p>
                        <h3 className="editorial-serif mt-2 text-2xl leading-tight">{item.title}</h3>
                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/55">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#000B26]/95 p-4 backdrop-blur"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-5xl border border-white/15 bg-[#070B17]"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#CBB08A]">{selectedItem.category}</p>
                  <h3 className="mt-1 font-semibold text-white">{selectedItem.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="border border-white/15 p-2 text-white/55 transition hover:text-white"
                  aria-label="Close media"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                {selectedItem.type === 'video' ? (
                  <video src={selectedItem.url} className="h-full w-full object-contain" controls autoPlay />
                ) : (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                )}
              </div>

              {selectedItem.description && (
                <p className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-white/50">{selectedItem.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
