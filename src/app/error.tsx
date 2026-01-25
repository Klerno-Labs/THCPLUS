'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/app/components/ui/button'

/**
 * Root Error Boundary
 *
 * Catches errors in the app directory and displays a fallback UI.
 * Automatically logs errors to Sentry for monitoring and alerting.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'root',
      },
      contexts: {
        errorDetails: {
          digest: error.digest,
          message: error.message,
        },
      },
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary-900">
            Something Went Wrong
          </h1>
          <p className="text-gray-600">
            We encountered an unexpected error. Our team has been notified and is working on a
            fix.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-left">
            <p className="text-xs font-mono text-gray-800 break-all">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-gray-600 mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Go Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          If this problem persists, please{' '}
          <a href="/#contact" className="text-secondary-600 hover:text-secondary-700 underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  )
}
