'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, ChevronDown, MapPin, Cpu, Briefcase } from 'lucide-react'
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
    <section id="hero" className="relative bg-[#F7F5EF] dark:bg-dark-950" aria-label="Introduction">
      {/* Cover Banner - LinkedIn style */}
      <div className="relative h-28 w-full overflow-hidden bg-[#DCE4E9] sm:h-40 md:h-44 lg:h-52 xl:h-56 dark:bg-dark-900">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Portfolio cover"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 42%' }}
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#DCE4E9] via-[#E9E6DF] to-[#F7F5EF] dark:from-slate-800 dark:via-dark-900 dark:to-dark-950">
            {/* Default cover pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            {/* Gradient overlay for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#F7F5EF]/90 to-transparent dark:from-dark-950/80" />
          </div>
        )}
      </div>

      {/* Profile Card - overlapping the cover like a LinkedIn profile */}
      <div className="relative section-container -mt-8 sm:-mt-12 lg:-mt-14 z-10">
        <div className="bg-[#FCFBF7]/96 dark:bg-dark-900/95 backdrop-blur-md border border-[#D9D2C4] dark:border-dark-700/80 rounded-sm p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(16,36,62,0.08)] dark:shadow-xl dark:shadow-black/10">
          {/* Top row: Profile photo + name + status */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 -mt-12 sm:-mt-16 self-center sm:self-start"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-[#FCFBF7] dark:border-dark-900 shadow-lg bg-[#E9E6DF] dark:bg-dark-800">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={160}
                    height={160}
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#10243E] dark:text-white tracking-tight font-display">
                  {firstName}{' '}
                  <span className="text-[#526E8A] dark:text-primary-300">{lastName}</span>
                </h1>
              </motion.div>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl text-[#465465] dark:text-dark-300 font-medium mt-1"
              >
                <TypeWriter
                  words={[
                    'Embedded Systems Engineer',
                    'IoT & Robotics Developer',
                    'Full-Stack Systems Engineer',
                    'AI-Integrated Product Builder',
                  ]}
                  className="text-[#526E8A] dark:text-primary-400"
                />
              </motion.p>

              {/* Meta info row - like LinkedIn */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-3 text-sm text-[#667384] dark:text-dark-400"
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
                  <Cpu className="w-4 h-4" />
                  Hardware + Software
                </span>
              </motion.div>

              {/* Status badge */}
              <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F1EEE7] dark:bg-green-500/5 border border-[#CDBB92] dark:border-green-500/20 rounded-sm text-xs uppercase tracking-[0.08em] text-[#7C6840] dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full " />
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
            className="text-sm sm:text-base text-[#566273] dark:text-dark-400 mt-4 sm:mt-6 leading-relaxed max-w-3xl"
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
            <Link href="/start-project" className="btn-primary group text-sm sm:text-base rounded-md">
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/hire" className="btn-secondary group text-sm sm:text-base rounded-md">
              Hire / Work With Me
              <Briefcase className="w-4 h-4" />
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
            <Link href="#contact" className="btn-accent text-sm sm:text-base rounded-md">
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
          className="flex flex-col items-center gap-2 text-[#7A8491] dark:text-dark-500 hover:text-[#10243E] dark:hover:text-dark-300 transition-colors"
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
