'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResources } from '@/lib/resources'

export default function AudioIntroduction() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { audioIntroUrl: audioUrl } = useResources()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
      setHasError(false)
    }

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    const handleError = () => {
      setHasError(true)
      setIsLoaded(false)
    }

    const handleCanPlay = () => {
      setIsLoaded(true)
      setHasError(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || hasError || !audioUrl) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => {
        console.error('Audio playback error:', err)
        setHasError(true)
      })
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || hasError || !audioUrl) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    audio.currentTime = percentage * audio.duration
  }

  // Don't render if no audio is uploaded
  if (!audioUrl) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl max-w-md mx-auto"
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <div className="flex items-center gap-4">
        {/* Avatar with sound waves */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <span className="text-2xl">🎙️</span>
          </div>
          
          {/* Animated sound waves */}
          <AnimatePresence>
            {isPlaying && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Meet Emmanuel</h3>
          <p className="text-sm text-white/80">Listen to a personal introduction</p>
        </div>

        {/* Play button */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div
          onClick={handleProgressClick}
          className="h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        {/* Time display */}
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Transcript toggle (optional) */}
      <details className="mt-4">
        <summary className="text-sm text-white/80 cursor-pointer hover:text-white">
          View Transcript
        </summary>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Hi, I&apos;m Emmanuel Inambao, an Electronic Engineer passionate about IoT, robotics, 
          and building innovative solutions. With over 5 years of experience, I specialize 
          in creating connected systems that solve real-world problems. I love turning 
          complex engineering challenges into elegant, efficient solutions. Let&apos;s build 
          something amazing together!
        </p>
      </details>
    </motion.div>
  )
}
