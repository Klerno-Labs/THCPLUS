/**
 * Sentry Edge Runtime Configuration
 *
 * Initializes Sentry for Edge runtime (middleware, edge API routes).
 * Edge runtime has limited capabilities compared to Node.js.
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
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Filter out sensitive data before sending to Sentry
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry event (dev mode, not sent):', event)
      return null
    }

    // Remove sensitive data
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }

    return event
  },

  // Add custom tags
  initialScope: {
    tags: {
      app: 'thcplus',
      platform: 'edge',
    },
  },
})
