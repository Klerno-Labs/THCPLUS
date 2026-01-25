'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { verifyAge } from '../../actions/verify-age'

export default function AgeVerificationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    setIsLoading(true)

    try {
      const result = await verifyAge(true)

      if (result.success) {
        // Session created successfully - redirect to home
        router.push('/')
        router.refresh() // Force refresh to update middleware check
      } else {
        toast.error(result.error || 'Verification failed. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Age verification error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleDeny = () => {
    // Client-side redirect to avoid CSP warnings
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary font-bold text-lg">THC+</span>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-4">
            Age Verification Required
          </h1>

          <p className="text-gray-600 mb-8">
            You must be 21 years of age or older to enter this website.
            By clicking &quot;I am 21 or older&quot;, you confirm that you meet
            the age requirement.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold py-6 text-lg"
            >
              {isLoading ? 'Verifying...' : 'I am 21 or older'}
            </Button>

            <Button
              onClick={handleDeny}
              disabled={isLoading}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              I am under 21
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            By entering this site, you agree to our{' '}
            <a href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <p className="text-xs text-gray-400 mt-4">
            This website contains information about products containing
            hemp-derived cannabinoids. These products are intended for
            adults 21 years of age or older.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
