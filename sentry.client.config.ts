/**
 * Sentry Client-Side Configuration
 *
 * Initializes Sentry for browser-side error tracking, performance monitoring,
 * and session replay (privacy-safe mode).
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  // Get your DSN from: https://sentry.io/settings/projects/your-project/keys/
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment (development, staging, production)
  environment: process.env.NODE_ENV,

  // Release version for tracking across deploys
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Percentage of events to send to Sentry (1.0 = 100%, 0.1 = 10%)
  // Lower in production to reduce quota usage
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Percentage of sessions to capture replay for
  // Only capture replays for sessions with errors
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions

  // Ignore common errors that aren't actionable
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    // Random network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    // Canceled requests (user navigation)
    'AbortError',
    'The user aborted a request',
    // ResizeObserver loop errors (common React false positive)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  // Privacy-safe session replay configuration
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and input content by default
      maskAllText: true,
      blockAllMedia: true,
      // Don't capture network details for privacy
      networkDetailAllowUrls: [],
    }),
  ],

  // Filter out sensitive data before sending to Sentry
  beforeSend(event, hint) {
    // Don't send events in development (only log to console)
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry event (dev mode, not sent):', event, hint)
      return null
    }

    // Remove sensitive data from event
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }

    return event
  },

  // Add custom tags for filtering in Sentry dashboard
  initialScope: {
    tags: {
      app: 'thcplus',
      platform: 'web',
    },
  },
})
