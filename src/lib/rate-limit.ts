/**
 * Rate Limiting Utilities
 *
 * Uses Upstash Redis for distributed rate limiting across serverless functions.
 * Prevents abuse of contact forms, age verification, and API endpoints.
 *
 * Free Tier: 10,000 commands/day
 */

import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client (only if credentials are provided)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

/**
 * Rate limiter for contact form submissions
 *
 * Limit: 3 submissions per hour per IP address
 * Algorithm: Sliding window (more accurate than fixed window)
 */
export const contactFormRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
      analytics: true, // Enable analytics in Upstash dashboard
      prefix: '@ratelimit/contact-form',
    })
  : null

/**
 * Rate limiter for age verification attempts
 *
 * Limit: 10 attempts per hour per IP address
 * Prevents automated bypass attempts
 */
export const ageVerificationRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
      analytics: true,
      prefix: '@ratelimit/age-verification',
    })
  : null

/**
 * Rate limiter for API routes (general)
 *
 * Limit: 100 requests per 15 minutes per IP address
 * Protects against API abuse and DDoS attempts
 */
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '15 m'), // 100 requests per 15 minutes
      analytics: true,
      prefix: '@ratelimit/api',
    })
  : null

/**
 * Check if rate limit is exceeded for a given identifier
 *
 * @param identifier - Unique identifier (usually IP address, hashed)
 * @param limiter - Rate limiter instance to use
 * @returns Object with success status and rate limit info
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  error?: string
}> {
  // If Redis is not configured, allow all requests (development mode)
  if (!limiter) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    }
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
      success,
      limit,
      remaining,
      reset,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)

    // On error, allow the request (fail open for better UX)
    // But log the error for monitoring
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      error: 'Rate limit check failed',
    }
  }
}

/**
 * Get time until rate limit reset in a human-readable format
 *
 * @param resetTimestamp - Unix timestamp when rate limit resets
 * @returns Human-readable string (e.g., "15 minutes", "1 hour")
 */
export function getTimeUntilReset(resetTimestamp: number): string {
  const now = Date.now()
  const diff = resetTimestamp - now

  if (diff <= 0) {
    return 'now'
  }

  const minutes = Math.ceil(diff / 1000 / 60)

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  const hours = Math.ceil(minutes / 60)
  return `${hours} hour${hours !== 1 ? 's' : ''}`
}
