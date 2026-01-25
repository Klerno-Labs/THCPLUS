'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Global Error Handler
 *
 * Catches errors in the root layout and provides a minimal fallback UI.
 * This is a last-resort error boundary that wraps the entire application.
 *
 * NOTE: Must include <html> and <body> tags since it replaces the root layout.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log critical error to Sentry with high priority
    Sentry.captureException(error, {
      level: 'fatal', // Highest severity level
      tags: {
        errorBoundary: 'global',
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
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '1rem',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              background: 'white',
              padding: '3rem 2rem',
              borderRadius: '1rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 2rem',
                background: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="40"
                height="40"
                fill="none"
                stroke="#dc2626"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '1rem',
              }}
            >
              Critical Error
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '2rem',
                lineHeight: '1.6',
              }}
            >
              We encountered a critical error. Please try refreshing the page or contact support if
              the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '2rem',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#374151',
                    wordBreak: 'break-all',
                  }}
                >
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#6b7280',
                      marginTop: '0.5rem',
                    }}
                  >
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#1A3A1A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0f2a0f'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1A3A1A'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'white',
                  color: '#1A3A1A',
                  border: '2px solid #1A3A1A',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
