'use client'

import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar } from 'lucide-react'
import { useCertifications } from '@/lib/certifications'
import Image from 'next/image'

export default function Certifications() {
  const { certifications } = useCertifications()

  if (certifications.length === 0) {
    return null
  }

  return (
    <section id="certifications" className="py-20 bg-[#FCFBF7] dark:bg-dark-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#10243E] dark:text-white mb-4">
            <span className="text-[#526E8A] dark:text-primary-500">Certifications</span> & Credentials
          </h2>
          <p className="text-[#667384] dark:text-[#566273] dark:text-dark-300 max-w-2xl mx-auto">
            Professional certifications and achievements that validate my expertise
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white/70 dark:bg-dark-800/50 border border-[#DDD7CC] dark:border-dark-700 rounded-sm overflow-hidden hover:border-[#AAB6C2] dark:hover:border-primary-500/50 transition-all duration-300"
            >
              {cert.image ? (
                <div className="relative h-40 bg-dark-700 overflow-hidden">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-primary-600/20 to-dark-800 flex items-center justify-center">
                  <Award className="w-16 h-16 text-primary-500/50" />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#10243E] dark:text-white mb-2 group-hover:text-[#526E8A] dark:text-primary-400 transition-colors">
                  {cert.name}
                </h3>
                <p className="text-[#526E8A] dark:text-primary-400 font-medium mb-3">{cert.issuer}</p>

                <div className="flex items-center gap-2 text-sm text-[#697483] dark:text-dark-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Issued: {cert.issueDate}</span>
                  {cert.expiryDate && (
                    <span className="text-[#7C8792] dark:text-dark-500">• Expires: {cert.expiryDate}</span>
                  )}
                </div>

                {cert.credentialId && (
                  <p className="text-xs text-[#7C8792] dark:text-dark-500 mb-3">
                    Credential ID: {cert.credentialId}
                  </p>
                )}

                {cert.description && (
                  <p className="text-[#566273] dark:text-dark-300 text-sm mb-4 line-clamp-2">
                    {cert.description}
                  </p>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#526E8A] dark:text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Verify Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
