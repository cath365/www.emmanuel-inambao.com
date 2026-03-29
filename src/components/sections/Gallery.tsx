'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Image as ImageIcon,
  X,
  ZoomIn,
  Play,
  Star
} from 'lucide-react'
import Image from 'next/image'
import { useGallery, GalleryItem } from '@/lib/gallery'

// Gallery categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects' },
  { id: 'prototype', label: 'Prototypes' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'event', label: 'Events' },
]

const categoryColors: Record<string, string> = {
  project: 'bg-blue-600',
  prototype: 'bg-orange-600',
  workshop: 'bg-green-600',
  event: 'bg-purple-600',
  other: 'bg-gray-600',
}

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const { items } = useGallery()

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory)

  // Sort to show featured items first
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-20 lg:py-32 bg-dark-900/50"
      aria-labelledby="gallery-heading"
    >
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            Gallery
          </span>
          <h2 id="gallery-heading" className="section-heading mt-2">
            My Work in{' '}
            <span className="gradient-text">Action</span>
          </h2>
          <p className="section-subheading mx-auto mt-4">
            Photos and videos from projects, workshops, and events - 
            showcasing engineering in the real world.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-square bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`View ${item.title}`}
            >
              {/* Media */}
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}

              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute top-3 left-3 p-2 bg-dark-900/80 rounded-full">
                  <Play className="w-4 h-4 text-white" fill="white" />
                </div>
              )}

              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-3 right-3 p-1.5 bg-yellow-500 rounded-full">
                  <Star className="w-3 h-3 text-yellow-900" fill="currentColor" />
                </div>
              )}

              {/* Category badge */}
              <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs text-white ${categoryColors[item.category] || categoryColors.other}`}>
                {item.category}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-sm truncate">{item.title}</p>
                  <p className="text-dark-400 text-xs mt-1 truncate">{item.description}</p>
                </div>
              </div>

              {/* Zoom icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 bg-dark-900/80 rounded-full">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Empty state */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/95 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-dark-900/80 rounded-full text-dark-300 hover:text-white transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media */}
              <div className="aspect-video bg-dark-900 relative">
                {selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${categoryColors[selectedItem.category] || categoryColors.other}`}>
                    {selectedItem.category}
                  </span>
                  {selectedItem.featured && (
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-500 text-yellow-900 flex items-center gap-1">
                      <Star className="w-3 h-3" fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedItem.title}</h3>
                <p className="text-dark-400">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
