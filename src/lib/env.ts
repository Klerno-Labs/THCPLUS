/**
 * Environment Variable Utilities
 *
 * Provides runtime checks for required environment variables based on the current environment.
 * Helps ensure production deployments have all necessary configuration.
 */

import { env } from '@/lib/validations/env'

/**
 * Check if all required environment variables for production are present
 *
 * Logs warnings to console for missing optional variables that should be configured.
 * Throws errors for missing critical variables that prevent functionality.
 *
 * @throws Error if critical production variables are missing
 */
export function validateProductionEnv() {
  if (env.NODE_ENV !== 'production') {
    return // Only validate in production
  }

  const errors: string[] = []
  const warnings: string[] = []

  // Critical: Database (required for contact form, age verification)
  if (!env.POSTGRES_PRISMA_URL) {
    errors.push('POSTGRES_PRISMA_URL is required in production')
  }
  if (!env.POSTGRES_URL_NON_POOLING) {
    errors.push('POSTGRES_URL_NON_POOLING is required in production')
  }

  // Critical: Email (required for contact form)
  if (!env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required in production')
  }
  if (!env.RESEND_FROM_EMAIL) {
    errors.push('RESEND_FROM_EMAIL is required in production')
  }

  // Important: Error tracking (highly recommended)
  if (!env.SENTRY_DSN) {
    warnings.push('SENTRY_DSN not set - error tracking disabled')
  }
  if (!env.NEXT_PUBLIC_SENTRY_DSN) {
    warnings.push('NEXT_PUBLIC_SENTRY_DSN not set - client-side error tracking disabled')
  }

  // Important: Rate limiting (prevents abuse)
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    warnings.push('Upstash Redis not configured - rate limiting disabled')
  }

  // Optional: Analytics
  if (!env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    warnings.push('Google Analytics not configured - tracking disabled')
  }

  // Optional: Authentication (only needed if admin dashboard is used)
  if (!env.NEXTAUTH_SECRET) {
    warnings.push('NEXTAUTH_SECRET not set - admin authentication will not work')
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Production Environment Warnings:')
    warnings.forEach((warning) => console.warn(`   - ${warning}`))
    console.warn('')
  }

  // Throw errors (fail deployment)
  if (errors.length > 0) {
    console.error('\n❌ Production Environment Errors:')
    errors.forEach((error) => console.error(`   - ${error}`))
    console.error('')
    throw new Error(
      `Missing required environment variables in production. Check logs above for details.`
    )
  }

  console.log('✅ Production environment validation passed')
}

/**
 * Check if a feature is enabled based on environment variables
 *
 * @param feature - Feature name to check
 * @returns Boolean indicating if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature]()
}

/**
 * Feature flags based on environment configuration
 */
const featureFlags = {
  /** Database is configured and available */
  database: () => Boolean(env.POSTGRES_PRISMA_URL && env.POSTGRES_URL_NON_POOLING),

  /** Email service is configured and available */
  email: () => Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),

  /** Error tracking (Sentry) is configured */
  errorTracking: () => Boolean(env.SENTRY_DSN),

  /** Rate limiting (Upstash) is configured */
  rateLimiting: () => Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),

  /** Admin authentication is configured */
  adminAuth: () => Boolean(env.NEXTAUTH_SECRET && env.NEXTAUTH_URL),

  /** Google Analytics is configured */
  analytics: () => Boolean(env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
} as const

/**
 * Get current environment name
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return env.NODE_ENV
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}

/**
 * Get safe environment info for logging (no sensitive data)
 */
export function getEnvironmentInfo() {
  return {
    environment: getEnvironment(),
    features: {
      database: isFeatureEnabled('database'),
      email: isFeatureEnabled('email'),
      errorTracking: isFeatureEnabled('errorTracking'),
      rateLimiting: isFeatureEnabled('rateLimiting'),
      adminAuth: isFeatureEnabled('adminAuth'),
      analytics: isFeatureEnabled('analytics'),
    },
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
  }
}
