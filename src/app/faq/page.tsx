'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

const faqs = [
  {
    question: 'What is Delta-8 THC?',
    answer:
      'Delta-8 THC is a cannabinoid found in hemp plants. It offers mild psychoactive effects that are generally less intense than Delta-9 THC, providing a more relaxed experience. Delta-8 is federally legal under the 2018 Farm Bill when derived from hemp containing less than 0.3% Delta-9 THC.',
  },
  {
    question: 'Are your products lab tested?',
    answer:
      'Yes, all our products undergo rigorous third-party lab testing to ensure purity, potency, and safety. Lab reports verify the cannabinoid content and check for harmful contaminants like heavy metals, pesticides, and residual solvents. Lab reports are available upon request for any product we carry.',
  },
  {
    question: 'Do I need to be 21 to purchase?',
    answer:
      'Yes, you must be 21 years or older to purchase hemp products from THC Plus. We verify age upon entry to our website and at our physical store location. Valid government-issued ID is required for all purchases.',
  },
  {
    question: 'What are your store hours?',
    answer:
      'We are open daily Monday through Sunday until 11:00 PM. Our store is located at 8302 N Eldridge Pkwy, Houston, TX 77041. Feel free to call us at (346) 206-3949 if you have any questions about our hours or availability.',
  },
  {
    question: 'What types of products do you carry?',
    answer:
      'We offer a wide range of hemp-derived products including Delta-8 THC, Delta-9 THC (hemp-derived), THCA, HHC, CBD, kratom, vape products, edibles, tinctures, topicals, and premium glass pipes and accessories. All products are sourced from reputable manufacturers and undergo lab testing.',
  },
  {
    question: 'Is Delta-8 legal in Texas?',
    answer:
      'Yes, Delta-8 THC derived from hemp is currently legal in Texas under both federal and state law, provided it contains less than 0.3% Delta-9 THC on a dry weight basis. However, laws can change, so we recommend staying informed about current regulations.',
  },
  {
    question: 'Do you offer delivery or online ordering?',
    answer:
      'Currently, we operate as a brick-and-mortar retail location. Please visit us in-store for the best selection and expert guidance from our knowledgeable staff. We are happy to answer questions via phone at (346) 206-3949 or through our contact form.',
  },
  {
    question: 'Can I return or exchange products?',
    answer:
      'Due to the nature of our products, we cannot accept returns or exchanges on opened items. Unopened products may be eligible for exchange within 7 days of purchase with a valid receipt. Please speak with our staff for more details about our return policy.',
  },
  {
    question: 'Do you provide guidance for first-time users?',
    answer:
      'Absolutely! Our knowledgeable staff is here to help educate customers about different cannabinoids, product types, dosing recommendations, and expected effects. We believe in empowering our customers with information to make informed choices that suit their needs.',
  },
  {
    question: 'Are there any side effects I should know about?',
    answer:
      'Hemp-derived cannabinoids are generally well-tolerated, but some people may experience mild side effects such as dry mouth, drowsiness, or changes in appetite. Start with a low dose and go slow, especially if you are new to these products. Consult with a healthcare professional if you have concerns or are taking medications.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="border-gray-200 hover:border-primary/30 transition-colors">
      <CardContent className="p-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-primary text-lg">{question}</span>
          <ChevronDown
            className={`h-6 w-6 text-primary flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about our products, services, and policies
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Still Have Questions?</h2>
              <p className="text-gray-600 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Our friendly team is here to
                help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+13462063949"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Call Us: (346) 206-3949
                </a>
                <a
                  href="/#contact"
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                >
                  Contact Us Online
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
