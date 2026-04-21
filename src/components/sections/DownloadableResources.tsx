'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useResources, Resource } from '@/lib/resources'

const typeColors = {
  pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  template: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  guide: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  checklist: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function DownloadableResources() {
  const [filter, setFilter] = useState<'all' | 'pdf' | 'template' | 'guide' | 'checklist'>('all')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const { resources } = useResources()

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter)

  const handleDownload = async (resource: Resource) => {
    if (resource.fileUrl === '#coming-soon' || !resource.fileUrl || resource.fileUrl.startsWith('#')) {
      return
    }

    setDownloadingId(resource.id)
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setDownloadingId(null)
    
    // Create download link
    const link = document.createElement('a')
    link.href = resource.fileUrl
    link.download = resource.title
    link.click()
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Resources
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Download free guides, templates, and checklists to help with your engineering projects.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['all', 'guide', 'template', 'checklist', 'pdf'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Resources grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{resource.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[resource.type]}`}>
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {resource.fileSize}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {resource.downloads.toLocaleString()} downloads
                    </span>
                    <motion.button
                      onClick={() => handleDownload(resource)}
                      disabled={downloadingId === resource.id || resource.fileUrl === '#coming-soon' || !resource.fileUrl || resource.fileUrl.startsWith('#')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {resource.fileUrl === '#coming-soon' || !resource.fileUrl || resource.fileUrl.startsWith('#') ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Coming Soon
                        </>
                      ) : downloadingId === resource.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Want more resources? Subscribe to get notified when new guides are available.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
