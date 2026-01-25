/**
 * Sentry Server-Side Configuration
 *
 * Initializes Sentry for Node.js server-side error tracking.
 * Used for server actions, API routes, and server components.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  // Get your DSN from: https://sentry.io/settings/projects/your-project/keys/
  dsn: process.env.SENTRY_DSN,

  // Environment (development, staging, production)
  environment: process.env.NODE_ENV,

  // Release version for tracking across deploys
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Percentage of transactions to send to Sentry
  // Lower in production to reduce quota usage
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Ignore common errors that aren't actionable
  ignoreErrors: [
    // Prisma connection errors during cold starts (expected on serverless)
    'P1001',
    'P1002',
    // Client disconnects (user closed tab/window)
    'ECONNRESET',
    'EPIPE',
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
      // Remove query parameters that might contain sensitive data
      if (event.request.url) {
        event.request.url = event.request.url.split('?')[0]
      }
    }

    // Scrub sensitive data from extra context
    if (event.extra) {
      delete event.extra.ipAddress
      delete event.extra.email
    }

    return event
  },

  // Add custom tags for filtering in Sentry dashboard
  initialScope: {
    tags: {
      app: 'thcplus',
      platform: 'server',
    },
  },
})
