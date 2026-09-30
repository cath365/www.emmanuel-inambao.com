'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EasterEggs() {
  const [showKonami, setShowKonami] = useState(false)

  useEffect(() => {
    // Console Easter Egg
    const styles = [
      'color: #3b82f6',
      'font-size: 14px',
      'font-weight: bold',
      'padding: 10px',
    ].join(';')

    const artStyles = [
      'color: #fbbf24',
      'font-size: 11px',
      'font-family: monospace',
    ].join(';')

    console.log(
      '%c⚡ Emmanuel Inambao — Electronic Engineer & IoT Developer',
      styles
    )
    console.log(
      '%c' +
      '╔══════════════════════════════════════════╗\n' +
      '║  🔧 Hardware meets Software              ║\n' +
      '║  🌍 Building from Lusaka, Zambia          ║\n' +
      '║  📧 denuelinambao@gmail.com              ║\n' +
      '║                                          ║\n' +
      '║  Try the Konami Code: ↑↑↓↓←→←→BA        ║\n' +
      '╚══════════════════════════════════════════╝',
      artStyles
    )
    console.log(
      '%cLooking at the source? I like your style. Let\'s connect!',
      'color: #60a5fa; font-size: 12px;'
    )

    // Konami Code Easter Egg
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA',
    ]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setShowKonami(true)
          konamiIndex = 0
          setTimeout(() => setShowKonami(false), 5000)
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AnimatePresence>
      {showKonami && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <p className="text-2xl font-bold mb-2">You found the secret!</p>
            <p className="text-white/80">
              You&apos;re a real one. Emmanuel approves. Connect with me!
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm opacity-75">
              <span>&#8593;&#8593;&#8595;&#8595;&#8592;&#8594;&#8592;&#8594;BA</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
