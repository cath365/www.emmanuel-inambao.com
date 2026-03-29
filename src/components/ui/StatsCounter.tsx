'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  label: string
  value: number
  suffix: string
}

const stats: Stat[] = [
  { label: 'Projects Completed', value: 25, suffix: '+' },
  { label: 'Happy Clients', value: 15, suffix: '+' },
  { label: 'Years Experience', value: 5, suffix: '+' },
  { label: 'Technologies', value: 30, suffix: '+' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-dark-400 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
