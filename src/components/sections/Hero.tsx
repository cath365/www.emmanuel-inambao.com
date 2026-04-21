'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, ChevronDown, MapPin, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'
import { useLanguage } from '@/lib/i18n'
import TypeWriter from '@/components/ui/TypeWriter'
import AudioIntroduction from '@/components/ui/AudioIntroduction'
import StatsCounter from '@/components/ui/StatsCounter'

export default function Hero() {
  const { profile } = useProfile()
  const { t } = useLanguage()

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  const nameParts = profile.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ')
  const lastName = nameParts[nameParts.length - 1]

  return (
    <section id="hero" className="relative" aria-label="Introduction">
      {/* Cover Banner - LinkedIn style */}
      <div className="relative w-full h-48 sm:h-56 md:h-72 lg:h-80 overflow-hidden">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-900 to-dark-950">
            {/* Default cover pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            {/* Gradient overlay for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-dark-950/80 to-transparent" />
          </div>
        )}
        {/* Bottom gradient fade into profile section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-950 to-transparent" />
      </div>

      {/* Profile Card - overlapping the cover */}
      <div className="relative section-container -mt-16 sm:-mt-20 z-10">
        <div className="bg-dark-900/90 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 sm:p-6 md:p-8">
          {/* Top row: Profile photo + name + status */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 -mt-16 sm:-mt-20 self-center sm:self-start"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-dark-900 shadow-2xl bg-dark-800">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500 text-4xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Name + Title + Status */}
            <div className="flex-1 text-center sm:text-left pt-0 sm:pt-2">
              <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {firstName}{' '}
                  <span className="gradient-text">{lastName}</span>
                </h1>
              </motion.div>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl text-dark-300 font-medium mt-1"
              >
                <TypeWriter
                  words={[
                    'Electronic Engineer',
                    'IoT Developer',
                    'Robotics Expert',
                    'Full-Stack Engineer',
                    'AI/ML Enthusiast',
                  ]}
                  className="text-primary-400"
                />
              </motion.p>

              {/* Meta info row - like LinkedIn */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-3 text-sm text-dark-400"
              >
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  5+ years experience
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  500+ connections
                </span>
              </motion.div>

              {/* Status badge */}
              <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {profile.status || 'Available for Engineering Projects'}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Bio */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="text-sm sm:text-base text-dark-400 mt-4 sm:mt-6 leading-relaxed max-w-3xl"
          >
            {profile.bio}
          </motion.p>

          {/* CTA Buttons - like LinkedIn action buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 mt-5 sm:mt-6"
          >
            <Link href="/start-project" className="btn-primary group text-sm sm:text-base">
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#projects" className="btn-primary group text-sm sm:text-base">
              {t('hero.cta.projects')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {profile.cv && (
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary group text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                {t('hero.cta.cv')}
              </a>
            )}
            <Link href="#contact" className="btn-accent text-sm sm:text-base">
              <Mail className="w-4 h-4" />
              {t('hero.cta.contact')}
            </Link>
          </motion.div>

          {/* Audio Introduction */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-4">
            <AudioIntroduction />
          </motion.div>
        </div>

        {/* Stats counters - below the card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <StatsCounter />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex justify-center mt-6 sm:mt-8 pb-4"
      >
        <Link
          href="#about"
          className="flex flex-col items-center gap-2 text-dark-500 hover:text-primary-400 transition-colors"
          aria-label="Scroll to About section"
        >
          <span className="text-sm font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
