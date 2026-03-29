'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, ChevronDown, Cpu, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'
import { useLanguage } from '@/lib/i18n'
import TypeWriter from '@/components/ui/TypeWriter'
import AudioIntroduction from '@/components/ui/AudioIntroduction'
import StatsCounter from '@/components/ui/StatsCounter'

export default function Hero() {
  const { profile, isLoading } = useProfile()
  const { t } = useLanguage()

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  const floatingIconVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  // Parse name into first and last for styling
  const nameParts = profile.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ')
  const lastName = nameParts[nameParts.length - 1]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20 sm:pb-40"
      aria-label="Introduction"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-dark-950" aria-hidden="true">
        {/* Primary gradient orb */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        {/* Secondary gradient orb */}
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating tech icons (decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-1/4 left-[10%] text-primary-500/20"
        >
          <Cpu className="w-16 h-16" />
        </motion.div>
        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute top-1/3 right-[15%] text-accent-500/20"
        >
          <Zap className="w-12 h-12" />
        </motion.div>
        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-1/3 left-[20%] text-primary-400/15"
        >
          <Globe className="w-14 h-14" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="section-container relative z-10 py-20 lg:py-0">
        {/* Profile Image - Top right on desktop */}
        {profile.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:absolute lg:top-24 lg:right-8 xl:right-16 2xl:right-24 mb-6 lg:mb-0 flex justify-center lg:justify-end"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full overflow-hidden border-4 border-primary-500/30 shadow-2xl shadow-primary-500/20 ring-4 ring-dark-800/50">
              <Image
                src={profile.image}
                alt={profile.name}
                width={224}
                height={224}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl lg:max-w-3xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800/80 border border-dark-700 rounded-full text-sm text-dark-300">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
              {profile.status || 'Available for Engineering Projects'}
            </span>
          </motion.div>

          {/* Name and title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight"
          >
            {firstName}{' '}
            <span className="gradient-text">{lastName}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-dark-300 font-medium mb-6"
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

          {/* Mission statement */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-dark-400 max-w-3xl mx-auto mb-10 leading-relaxed text-balance"
          >
            {profile.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
          >
            <Link href="#projects" className="btn-primary group">
              {t('hero.cta.projects')}
              <ArrowRight 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                aria-hidden="true" 
              />
            </Link>
            {profile.cv && (
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary group"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                {t('hero.cta.cv')}
              </a>
            )}
            <Link href="#contact" className="btn-accent">
              <Mail className="w-4 h-4" aria-hidden="true" />
              {t('hero.cta.contact')}
            </Link>
          </motion.div>

          {/* Location */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-dark-500 text-sm lg:text-left"
          >
            📍 {profile.location}
          </motion.p>
          
          {/* Audio Introduction */}
          <motion.div
            variants={itemVariants}
            className="mt-8"
          >
            <AudioIntroduction />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats counters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-20 sm:bottom-28 left-0 right-0 z-10 hidden sm:block"
      >
        <div className="section-container">
          <div className="border-t border-dark-800 pt-6 sm:pt-8">
            <StatsCounter />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
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
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
