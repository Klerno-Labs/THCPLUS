'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { MapPin, Phone, Mail, Clock, Navigation, Car, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const storeFeatures = [
  'Wide selection of premium hemp products',
  'Knowledgeable and friendly staff',
  'Lab test results available for all products',
  'Comfortable and welcoming atmosphere',
  'First-time customer discounts',
  'Loyalty rewards program',
]

export default function VisitUsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Visit Our Store</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Experience the THC Plus difference in person. Our Houston location offers a premium
            shopping experience with expert guidance.
          </p>
        </div>
      </section>

      {/* Store Info Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="rounded-lg overflow-hidden shadow-lg h-[450px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.4686944857!2d-95.61632892425!3d29.926594475088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640d1b1f1f1f1f1%3A0x1f1f1f1f1f1f1f1f!2s8302%20N%20Eldridge%20Pkwy%2C%20Houston%2C%20TX%2077041!5e0!3m2!1sen!2sus!4v1623325678910!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="THC Plus Location"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=8302+N+Eldridge+Pkwy+Houston+TX+77041"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href="tel:+13462063949">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Store Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-primary mb-8">Store Information</h2>

              <div className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg">Address</h3>
                      <p className="text-gray-600">8302 N Eldridge Pkwy</p>
                      <p className="text-gray-600">Houston, TX 77041</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg">Hours of Operation</h3>
                      <div className="text-gray-600 space-y-1 mt-2">
                        <div>
                          <p>Monday - Sunday</p>
                          <p className="font-medium">Open Daily Until 11:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg">Phone</h3>
                      <a href="tel:+13462063949" className="text-gray-600 hover:text-secondary">
                        (346) 206-3949
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg">Email</h3>
                      <a
                        href="mailto:info@thcplus.com"
                        className="text-gray-600 hover:text-secondary"
                      >
                        info@thcplus.com
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Getting Here Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Getting Here</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re conveniently located in northwest Houston with easy access from major
              highways.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Car className="h-8 w-8 text-secondary mr-3" />
                    <h3 className="text-xl font-semibold text-primary">By Car</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>Ample free parking available</li>
                    <li>Easy access from Sam Houston Tollway (Beltway 8)</li>
                    <li>Convenient to US-290 and I-10</li>
                    <li>Located on N Eldridge Parkway near Spring Cypress</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-8 w-8 text-secondary mr-3" />
                    <h3 className="text-xl font-semibold text-primary">Nearby Landmarks</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>Near Willowbrook Mall area</li>
                    <li>Close to Jersey Village</li>
                    <li>Accessible from Cypress and Spring areas</li>
                    <li>Just minutes from major northwest Houston neighborhoods</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">What to Expect</h2>
              <p className="text-gray-600 mb-8">
                When you visit THC Plus, you&apos;ll be greeted by our friendly and knowledgeable
                staff in a clean, welcoming environment. We&apos;re here to help you find the
                perfect products for your needs.
              </p>
              <ul className="space-y-3">
                {storeFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="THC Plus store experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/20 rounded-lg -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Visit?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              We can&apos;t wait to meet you! Stop by today and experience the THC Plus difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=8302+N+Eldridge+Pkwy+Houston+TX+77041"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Get Directions
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white bg-transparent hover:bg-white hover:text-primary"
              >
                <Link href="/#contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
