'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { Button } from '../ui/button'

const testimonials = [
  {
    id: 1,
    name: 'Michael R.',
    location: 'Houston, TX',
    rating: 5,
    text: 'Best smoke shop in Houston, hands down! The staff is incredibly knowledgeable and helped me find exactly what I was looking for. The quality of their products is unmatched.',
  },
  {
    id: 2,
    name: 'Sarah L.',
    location: 'Katy, TX',
    rating: 5,
    text: "I was new to hemp products and the team here took the time to educate me on everything. They didn't try to upsell me - they genuinely wanted to help me find the right product for my needs.",
  },
  {
    id: 3,
    name: 'James T.',
    location: 'Sugar Land, TX',
    rating: 5,
    text: "The fact that all their products are lab-tested gives me peace of mind. I've been a loyal customer for over a year now and the consistency in quality keeps me coming back.",
  },
  {
    id: 4,
    name: 'Amanda K.',
    location: 'The Woodlands, TX',
    rating: 5,
    text: 'Clean, professional shop with premium products. The staff remembered my preferences from my first visit. This level of customer service is rare!',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="relative py-20 bg-primary overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Don&apos;t just take our word for it. Here&apos;s what our valued customers have to say
            about their experience at 3rd Coast Smoke Company.
          </p>
          <a
            href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <Star className="h-5 w-5 fill-current" />
            Leave a Google Review
          </a>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
            >
              <Quote className="h-12 w-12 text-secondary/30 mb-6" />
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">{testimonials[currentIndex].name}</p>
                  <p className="text-gray-500 text-sm">{testimonials[currentIndex].location}</p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-secondary w-6' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
