'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, MapPin, Cpu, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '@/lib/profile'
import { useLanguage } from '@/lib/i18n'
import AudioIntroduction from '@/components/ui/AudioIntroduction'
import StatsCounter from '@/components/ui/StatsCounter'

export default function Hero() {
  const { profile } = useProfile()
  const { t } = useLanguage()

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section
      id="hero"
      className="relative bg-[#F7F5EF] pb-6 pt-20 dark:bg-dark-950 sm:pt-24"
      aria-label="Introduction"
    >
      <div className="section-container">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-xl border border-[#D9D2C4] bg-[#FCFBF7] shadow-[0_18px_45px_rgba(16,36,62,0.08)] dark:border-dark-700/80 dark:bg-dark-900 dark:shadow-xl dark:shadow-black/10">
          {/* LinkedIn-style cover. The foreground image uses contain so text/logos are never cropped. */}
          <div className="relative aspect-[7/2] w-full overflow-hidden bg-[#DCE4E9] dark:bg-dark-800">
            {profile.coverImage ? (
              <Image
                src={profile.coverImage}
                alt="Emmanuel Inambao portfolio cover"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1200px) 100vw, 1180px"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#DCE4E9] via-[#E9E6DF] to-[#F7F5EF] dark:from-slate-800 dark:via-dark-900 dark:to-dark-950">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative px-5 pb-6 pt-16 sm:px-7 sm:pb-7 sm:pt-20 md:px-9">
            {/* Profile photo overlaps the cover, like a LinkedIn profile. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="absolute left-5 -top-12 sm:left-7 sm:-top-14 md:left-9 md:-top-16"
            >
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#FCFBF7] bg-[#E9E6DF] shadow-lg dark:border-dark-900 dark:bg-dark-800 sm:h-28 sm:w-28 md:h-32 md:w-32">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={160}
                    height={160}
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-dark-500">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
              <h1 className="font-display text-[2rem] font-medium leading-tight tracking-tight text-[#10243E] dark:text-white sm:text-4xl md:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-base font-semibold text-[#39495A] dark:text-dark-200 sm:text-lg">
                {profile.title}
              </p>
              <p className="mt-1 text-sm text-[#667384] dark:text-dark-400 sm:text-base">
                {profile.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#667384] dark:text-dark-400"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                Engineering projects
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                Hardware + software
              </span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BFD5C4] bg-[#EFF7F1] px-3 py-1.5 text-xs font-semibold text-[#356244] dark:border-green-500/20 dark:bg-green-500/5 dark:text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {profile.status || 'Available for Engineering Projects'}
              </span>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="mt-5 max-w-3xl text-sm leading-7 text-[#566273] dark:text-dark-400 sm:text-base"
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="mt-5 grid gap-3 sm:flex sm:flex-wrap sm:items-center"
            >
              <Link href="/start-project" className="btn-primary group justify-center rounded-md text-sm sm:text-base">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#projects" className="btn-secondary justify-center rounded-md text-sm sm:text-base">
                {t('hero.cta.projects')}
              </Link>
              {profile.cv && (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-center rounded-md text-sm sm:text-base"
                >
                  <Download className="h-4 w-4" />
                  {t('hero.cta.cv')}
                </a>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-[1180px]">
          <AudioIntroduction />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mx-auto mt-6 max-w-[1180px]"
        >
          <StatsCounter />
        </motion.div>
      </div>
    </section>
  )
}
