'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already verified
    const verified = localStorage.getItem('age-verified') === 'true'
    if (verified) {
      setIsVerified(true)
    }
    setIsLoading(false)
  }, [])

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true')
    setIsVerified(true)
  }

  const handleDeny = () => {
    // Redirect to a neutral site
    window.location.href = 'https://www.google.com'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {!isVerified && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
        >
          <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-2xl">3C</span>
              </div>
              <h1 className="text-2xl font-bold text-primary mb-4">Age Verification</h1>
              <p className="text-gray-700 mb-6">
                You must be 21 years of age or older to enter this site.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={handleVerify}
                  className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold"
                >
                  I am 21 or older
                </Button>
                <Button
                  onClick={handleDeny}
                  variant="outline"
                  className="w-full"
                >
                  I am under 21
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-6">
                By entering this site, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {isVerified && children}
    </AnimatePresence>
  )
}
