'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Users, Leaf } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

const features = [
  {
    icon: Shield,
    title: 'Lab Tested',
    description:
      'All our products undergo rigorous third-party lab testing to ensure purity and potency.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We source only the highest quality hemp products from trusted, licensed farmers.',
  },
  {
    icon: Users,
    title: 'Expert Staff',
    description: 'Our knowledgeable team is here to educate and guide you to the right products.',
  },
  {
    icon: Leaf,
    title: 'Farm Bill Compliant',
    description:
      'All products contain less than 0.3% Delta-9 THC, fully compliant with federal law.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose THC Plus?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re not just another smoke shop. We&apos;re your partners in wellness, committed
            to providing education, quality, and exceptional customer experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-none bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div
          className="mt-20 grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div
              className="rounded-lg overflow-hidden shadow-xl"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
              }}
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/20 rounded-lg -z-10" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in the heart of Houston, THC Plus Company was born from a passion for
              providing Texans with access to premium, legal hemp products. We believe in the power
              of education and transparency in an industry that&apos;s often misunderstood.
            </p>
            <p className="text-gray-600 mb-4">
              Our team consists of enthusiasts and experts who understand the science behind
              hemp-derived cannabinoids. We take pride in personally vetting every product that
              graces our shelves, ensuring you get only the best.
            </p>
            <p className="text-gray-600">
              Whether you&apos;re a curious newcomer or a seasoned connoisseur, we&apos;re here to
              guide you on your journey with personalized recommendations and honest advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
