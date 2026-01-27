'use client'

import { ArrowDown } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background image - optimized with next/image */}
      <Image
        src="https://images.unsplash.com/photo-1536924430914-91f9e2041b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        alt="Hemp products background"
        fill
        priority
        quality={85}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Welcome to
            <span className="block text-secondary mt-2">THC Plus</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in animation-delay-200">
          Houston&apos;s premier destination for premium, lab-tested hemp products. Experience
          quality, education, and exceptional customer service.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
          <Button
            asChild
            size="lg"
            className="bg-secondary text-primary hover:bg-secondary/90 font-semibold"
          >
            <Link href="/visit-us">Visit Our Shop</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white bg-transparent hover:bg-white/20"
          >
            <Link href="/education">Learn More</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <ArrowDown className="h-8 w-8 text-white/60" />
        </div>
      </div>
    </section>
  )
}
