'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'

/**
 * Reusable Error Boundary Component
 *
 * Can be used to wrap specific sections of the app for granular error handling.
 * Falls back to a custom UI when an error occurs in child components.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Dynamically import Sentry to avoid server-side issues
    const Sentry = await import('@sentry/nextjs')

    // Log error to Sentry with component stack trace
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Something went wrong</h3>
              <p className="text-sm text-gray-600">
                We encountered an error while loading this section.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-left">
                <p className="text-xs font-mono text-gray-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Retry Button */}
            <Button onClick={this.resetError} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based wrapper for functional components
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   return (
 *     <ErrorBoundaryWrapper>
 *       <ComponentThatMightError />
 *     </ErrorBoundaryWrapper>
 *   )
 * }
 * ```
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}
