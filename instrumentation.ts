/**
 * Next.js Instrumentation Hook
 *
 * Allows you to integrate observability tools and run initialization code
 * when the Next.js server starts up.
 *
 * This file is automatically called by Next.js when the server initializes.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Validate environment variables on startup (Node.js only, not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateProductionEnv, getEnvironmentInfo } = await import('./src/lib/env')

    // Log environment info for debugging
    console.log('🚀 Starting THC Plus application...')
    console.log('Environment:', getEnvironmentInfo())

    // Validate production environment variables
    try {
      validateProductionEnv()
    } catch (error) {
      console.error('Environment validation failed:', error)
      // In production, we want to fail fast if env vars are missing
      if (process.env.NODE_ENV === 'production') {
        throw error
      }
    }

    // Initialize Sentry for server-side error tracking
    await import('./sentry.server.config')
  }

  // Initialize Sentry for Edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
