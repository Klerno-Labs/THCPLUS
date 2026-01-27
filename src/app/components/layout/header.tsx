'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-primary/95 backdrop-blur-sm shadow-md' : 'bg-primary/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3" aria-label="THC Plus home">
          <div className="relative w-14 h-14">
            <Image
              src="/images/cross2.png"
              alt="THC Plus Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span className="font-bold text-xl text-white">THC Plus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          <Link
            href="/#about"
            className="text-white hover:text-secondary transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="/education"
            className="text-white hover:text-secondary transition-colors font-medium"
          >
            Education
          </Link>
          <Link
            href="/faq"
            className="text-white hover:text-secondary transition-colors font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/#testimonials"
            className="text-white hover:text-secondary transition-colors font-medium"
          >
            Testimonials
          </Link>
          <Link
            href="/visit-us"
            className="text-white hover:text-secondary transition-colors font-medium"
          >
            Visit Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.nav
          id="mobile-menu"
          className="md:hidden bg-primary/95 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/#about"
              className="text-white hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/education"
              className="text-white hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Education
            </Link>
            <Link
              href="/faq"
              className="text-white hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/#testimonials"
              className="text-white hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/visit-us"
              className="text-white hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Visit Us
            </Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}
