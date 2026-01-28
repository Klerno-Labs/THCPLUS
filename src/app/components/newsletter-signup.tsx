'use client'

import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'
import { trackNewsletterSignup } from '@/lib/analytics'

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'minimal'
  className?: string
}

export function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Integrate with email service (Resend, Mailchimp, etc.)
      // For now, just simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubscribed(true)
      setEmail('')
      toast.success('Successfully subscribed to our newsletter!')

      // Track newsletter signup
      trackNewsletterSignup(variant)

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000)
    } catch (error) {
      console.error('Newsletter signup error:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1"
            disabled={isSubmitting || isSubscribed}
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-primary/5 rounded-lg p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Get the latest product updates, exclusive deals, and hemp education directly in your
              inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1"
                disabled={isSubmitting || isSubscribed}
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting || isSubscribed}
                className="bg-primary hover:bg-primary/90"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Card variant (default)
  return (
    <Card className={`border-none shadow-lg ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="animate-scale-in">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-6">
            Get exclusive deals, new product announcements, and expert hemp education delivered to
            your inbox.
          </p>

          {isSubscribed ? (
            <div className="py-4 animate-scale-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-green-600 font-semibold">Thanks for subscribing!</p>
              <p className="text-gray-600 text-sm mt-1">Check your email for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full"
                disabled={isSubmitting}
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
