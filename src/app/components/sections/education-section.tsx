'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, FlaskConical, Scale } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const topics = [
  {
    icon: FlaskConical,
    title: 'Cannabinoid Guide',
    description: 'Learn about HHC, THCA, CBD, and other hemp-derived cannabinoids.',
    link: '/education#cannabinoids',
  },
  {
    icon: Scale,
    title: 'Legal Information',
    description: 'Understand the 2018 Farm Bill and how it affects hemp product legality in Texas.',
    link: '/education#legal',
  },
  {
    icon: BookOpen,
    title: 'Product Types',
    description: 'Explore the differences between flower, edibles, vapes, tinctures, and more.',
    link: '/education#products',
  },
]

export function EducationSection() {
  return (
    <section className="relative py-20 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Education Hub</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Knowledge is power. We believe in empowering our customers with the information they
            need to make informed decisions about hemp products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-none">
                <Link href={topic.link}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                      <topic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary group-hover:text-secondary transition-colors">
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{topic.description}</p>
                    <div className="flex items-center mt-4 text-primary group-hover:text-secondary transition-colors">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/education">
              Visit Our Education Hub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
