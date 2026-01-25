import { z } from 'zod'

/**
 * Environment variable validation schema
 *
 * Validates all required environment variables at application startup.
 * Fails fast with clear error messages if any required variables are missing or invalid.
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/validations/env'
 * console.log(env.NEXT_PUBLIC_SITE_URL) // Guaranteed to exist and be valid
 * ```
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Public environment variables (accessible in browser)
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Database (added in Phase 2)
  POSTGRES_PRISMA_URL: z.string().url().optional(),
  POSTGRES_URL_NON_POOLING: z.string().url().optional(),

  // Email service (added in Phase 2)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Authentication (added in Phase 7)
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Error tracking (added in Phase 4)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_ORG: z.string().optional(),

  // Rate limiting (added in Phase 5)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Admin credentials (initial setup only)
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
})

/**
 * Validated and typed environment variables
 *
 * Use this instead of process.env to get type-safe, validated environment variables
 */
export const env = envSchema.parse(process.env)

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>
