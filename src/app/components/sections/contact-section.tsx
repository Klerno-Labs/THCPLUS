'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact-form'
import { submitContactForm } from '@/app/actions/contact-form'
import { trackContactFormSubmit, trackPhoneClick } from '@/lib/analytics'

// Check if reCAPTCHA is properly configured
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
const isRecaptchaEnabled = RECAPTCHA_SITE_KEY.length > 0 && !RECAPTCHA_SITE_KEY.includes('your_')

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
    if (token) {
      clearErrors('captchaToken')
    }
  }

  const onSubmit = async (data: Omit<ContactFormData, 'captchaToken'>) => {
    // Validate captcha token only if reCAPTCHA is enabled
    if (isRecaptchaEnabled && !captchaToken) {
      setError('captchaToken', {
        type: 'manual',
        message: 'Please complete the captcha verification',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitContactForm({
        ...data,
        captchaToken: captchaToken || 'recaptcha-disabled',
      })

      if (result.success) {
        setSubmitted(true)
        reset()
        setCaptchaToken(null)
        recaptchaRef.current?.reset()
        toast.success(result.message || 'Message sent successfully!')

        // Track successful submission
        trackContactFormSubmit(true)

        // Reset success state after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.')
        // Reset captcha on error
        recaptchaRef.current?.reset()
        setCaptchaToken(null)

        // Track failed submission
        trackContactFormSubmit(false)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      // Reset captcha on error
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">Contact Information</h3>
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">Address</h4>
                    <p className="text-gray-600">8302 N Eldridge Pkwy, Houston, TX 77041</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">Phone</h4>
                    <a
                      href="tel:+13462063949"
                      className="text-gray-600 hover:text-primary transition-colors"
                      onClick={() => trackPhoneClick('contact_section')}
                    >
                      (346) 206-3949
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">Email</h4>
                    <p className="text-gray-600">info@thcplus.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">Hours</h4>
                    <p className="text-gray-600">Monday - Sunday</p>
                    <p className="text-gray-600">Open Daily Until 11:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-primary mb-6">Send us a Message</h3>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" aria-hidden="true" />
                    </div>
                    <h4 className="text-xl font-semibold text-primary mb-2">Message Sent!</h4>
                    <p className="text-gray-600">We&apos;ll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder="Your name"
                        className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="your@email.com"
                        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        placeholder="How can we help you?"
                        rows={4}
                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.message ? 'border-red-500' : ''
                        }`}
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    {isRecaptchaEnabled && (
                      <div>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={RECAPTCHA_SITE_KEY}
                          onChange={onCaptchaChange}
                          theme="light"
                        />
                        {errors.captchaToken && (
                          <p className="text-red-500 text-sm mt-1" role="alert">
                            {errors.captchaToken.message}
                          </p>
                        )}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
