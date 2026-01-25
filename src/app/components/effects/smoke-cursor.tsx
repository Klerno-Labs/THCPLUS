'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CursorSmoke {
  id: number
  x: number
  y: number
  timestamp: number
}

/**
 * Smoke Cursor Trail
 *
 * Creates a subtle smoke trail that follows the user's cursor.
 * Optimized for performance with throttling and automatic cleanup.
 *
 * @param enabled - Whether the cursor trail is enabled
 * @param color - Color of the smoke trail
 * @param throttle - Milliseconds between smoke particles (default: 100)
 */
export function SmokeCursor({
  enabled = true,
  color = 'rgba(147, 51, 234, 0.3)',
  throttle = 100,
}: {
  enabled?: boolean
  color?: string
  throttle?: number
}) {
  const [smokeTrail, setSmokeTrail] = useState<CursorSmoke[]>([])
  const [lastEmit, setLastEmit] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()

      // Throttle smoke emission
      if (now - lastEmit < throttle) return

      const newSmoke: CursorSmoke = {
        id: now,
        x: e.clientX,
        y: e.clientY + window.scrollY,
        timestamp: now,
      }

      setSmokeTrail((prev) => [...prev, newSmoke].slice(-10)) // Keep last 10
      setLastEmit(now)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Cleanup old particles
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setSmokeTrail((prev) => prev.filter((smoke) => now - smoke.timestamp < 2000))
    }, 500)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(cleanupInterval)
    }
  }, [enabled, throttle, lastEmit])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {smokeTrail.map((smoke) => (
          <motion.div
            key={smoke.id}
            className="absolute rounded-full"
            style={{
              left: smoke.x,
              top: smoke.y,
              width: 40,
              height: 40,
              background: color,
              filter: 'blur(20px)',
            }}
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{
              opacity: 0,
              scale: 2,
              y: -50,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Hover Smoke Effect
 *
 * Component that emits smoke particles on hover.
 * Wrap interactive elements with this component.
 */
export function HoverSmoke({
  children,
  color = 'rgba(147, 51, 234, 0.4)',
}: {
  children: React.ReactNode
  color?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (!isHovered) return

    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          x: Math.random() * 100 - 50,
          y: 0,
        },
      ])
    }, 150)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setParticles([])
      }}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `calc(50% + ${particle.x}px)`,
                bottom: '0',
                width: 30,
                height: 30,
                background: color,
                filter: 'blur(15px)',
              }}
              initial={{ opacity: 0.6, scale: 0.3 }}
              animate={{
                opacity: 0,
                scale: 1.5,
                y: -100,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
