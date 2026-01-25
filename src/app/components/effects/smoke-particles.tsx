'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export interface SmokeParticle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
  blur: number
}

export interface SmokeParticlesProps {
  count?: number
  colors?: string[]
  variant?: 'rising' | 'ambient' | 'swirling' | 'dense'
  speed?: 'slow' | 'medium' | 'fast'
  opacity?: number
  className?: string
}

/**
 * Smoke Particles Component
 *
 * Creates realistic animated smoke effects with customizable particles.
 * Optimized for performance with useMemo and will-change CSS.
 *
 * @param count - Number of smoke particles (default: 15)
 * @param colors - Array of colors for particles (default: smoke shop theme)
 * @param variant - Animation style (rising, ambient, swirling, dense)
 * @param speed - Animation speed (slow, medium, fast)
 * @param opacity - Base opacity of particles (0-1)
 */
export function SmokeParticles({
  count = 15,
  colors = [
    'rgba(147, 51, 234, 0.15)', // Purple
    'rgba(34, 197, 94, 0.15)',  // Green
    'rgba(255, 255, 255, 0.1)',  // White
    'rgba(168, 85, 247, 0.12)',  // Light purple
    'rgba(74, 222, 128, 0.12)',  // Light green
  ],
  variant = 'rising',
  speed = 'medium',
  opacity = 1,
  className = '',
}: SmokeParticlesProps) {
  // Speed multipliers
  const speedMultiplier = {
    slow: 1.5,
    medium: 1,
    fast: 0.6,
  }[speed]

  // Generate particles on client-side only to avoid hydration mismatch
  const [particles, setParticles] = useState<SmokeParticle[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // 0-100%
        y: variant === 'rising' ? 100 + Math.random() * 20 : Math.random() * 100,
        size: 150 + Math.random() * 400, // 150-550px (varied sizes for realism)
        duration: (10 + Math.random() * 15) * speedMultiplier, // 10-25s (VERY SLOW like real smoke)
        delay: Math.random() * 5, // 0-5s stagger for more natural appearance
        color: colors[Math.floor(Math.random() * colors.length)],
        blur: 40 + Math.random() * 50, // 40-90px blur (realistic smoke diffusion)
      }))
    )
  }, [count, colors, variant, speedMultiplier])

  // Don't render anything until mounted on client
  if (!isMounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />
  }

  // Get animation variants based on type
  const getAnimationVariants = (particle: SmokeParticle) => {
    switch (variant) {
      case 'rising':
        return {
          initial: {
            x: `${particle.x}%`,
            y: '100%',
            opacity: 0,
            scale: 0.3,
          },
          animate: {
            x: [
              `${particle.x}%`,
              `${particle.x + (Math.random() - 0.5) * 20}%`,
              `${particle.x + (Math.random() - 0.5) * 35}%`,
              `${particle.x + (Math.random() - 0.5) * 45}%`,
            ],
            y: ['100%', '60%', '20%', '-40%'],
            opacity: [0, opacity * 0.3, opacity * 0.6, opacity * 0.8, opacity * 0.5, 0],
            scale: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8],
            rotate: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120],
          },
        }

      case 'ambient':
        return {
          initial: {
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0.5,
          },
          animate: {
            x: [
              `${particle.x}%`,
              `${particle.x + (Math.random() - 0.5) * 15}%`,
              `${particle.x + (Math.random() - 0.5) * 25}%`,
              `${particle.x + (Math.random() - 0.5) * 10}%`,
              `${particle.x}%`,
            ],
            y: [
              `${particle.y}%`,
              `${particle.y + (Math.random() - 0.5) * 12}%`,
              `${particle.y + (Math.random() - 0.5) * 18}%`,
              `${particle.y + (Math.random() - 0.5) * 8}%`,
              `${particle.y}%`,
            ],
            opacity: [0, opacity * 0.4, opacity * 0.7, opacity * 0.5, opacity * 0.3, 0],
            scale: [0.5, 0.8, 1.1, 1.3, 1.1, 0.5],
            rotate: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
          },
        }

      case 'swirling':
        return {
          initial: {
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0.4,
          },
          animate: {
            x: [
              `${particle.x}%`,
              `${particle.x + 18 * Math.cos(particle.id)}%`,
              `${particle.x - 15 * Math.cos(particle.id)}%`,
              `${particle.x + 10 * Math.cos(particle.id)}%`,
              `${particle.x}%`,
            ],
            y: [
              `${particle.y}%`,
              `${particle.y - 15}%`,
              `${particle.y - 30}%`,
              `${particle.y - 50}%`,
              `${particle.y - 65}%`,
            ],
            opacity: [0, opacity * 0.4, opacity * 0.7, opacity * 0.6, opacity * 0.4, 0],
            scale: [0.4, 0.7, 1, 1.3, 1.5, 1.7],
            rotate: [0, 60, 140, 220, 300, 360],
          },
        }

      case 'dense':
        return {
          initial: {
            x: `${particle.x}%`,
            y: '110%',
            opacity: 0,
            scale: 0.3,
          },
          animate: {
            x: [`${particle.x}%`, `${particle.x + (Math.random() - 0.5) * 40}%`],
            y: ['110%', '70%', '30%', '-10%'],
            opacity: [0, opacity, opacity * 0.9, opacity * 0.7, 0],
            scale: [0.3, 0.6, 0.9, 1.2, 1.5],
            rotate: [0, (Math.random() - 0.5) * 120],
          },
        }
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => {
        const variants = getAnimationVariants(particle)

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color.replace(/[\d.]+\)/, '0.5)')} 40%, transparent 75%)`,
              filter: `blur(${particle.blur}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
            initial={variants.initial}
            animate={variants.animate}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Layered smoke effect combining multiple particle systems
 */
export function LayeredSmoke({
  className = '',
  theme = 'default',
}: {
  className?: string
  theme?: 'default' | 'green' | 'purple' | 'rainbow'
}) {
  const themeColors = {
    default: [
      'rgba(147, 51, 234, 0.15)',
      'rgba(34, 197, 94, 0.15)',
      'rgba(255, 255, 255, 0.1)',
    ],
    green: [
      'rgba(34, 197, 94, 0.2)',
      'rgba(74, 222, 128, 0.15)',
      'rgba(134, 239, 172, 0.1)',
    ],
    purple: [
      'rgba(147, 51, 234, 0.2)',
      'rgba(168, 85, 247, 0.15)',
      'rgba(192, 132, 252, 0.1)',
    ],
    rainbow: [
      'rgba(147, 51, 234, 0.15)',
      'rgba(34, 197, 94, 0.15)',
      'rgba(59, 130, 246, 0.15)',
      'rgba(234, 179, 8, 0.15)',
      'rgba(239, 68, 68, 0.15)',
    ],
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Background ambient layer */}
      <SmokeParticles
        count={8}
        variant="ambient"
        speed="slow"
        opacity={0.3}
        colors={themeColors[theme]}
      />

      {/* Main rising smoke */}
      <SmokeParticles
        count={12}
        variant="rising"
        speed="medium"
        opacity={0.6}
        colors={themeColors[theme]}
      />

      {/* Swirling foreground */}
      <SmokeParticles
        count={6}
        variant="swirling"
        speed="fast"
        opacity={0.4}
        colors={themeColors[theme]}
      />
    </div>
  )
}
