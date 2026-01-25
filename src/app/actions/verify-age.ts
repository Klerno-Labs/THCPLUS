'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ageVerificationSchema } from '@/lib/validations/age-verification'
import { hashIpAddress, generateSessionId } from '@/lib/crypto'
import { createAgeVerificationSession } from '@/lib/session'
import { checkRateLimit, ageVerificationRateLimit, getTimeUntilReset } from '@/lib/rate-limit'
import type { ApiResponse } from '@/types'

/**
 * Server Action: Verify Age
 *
 * Handles age verification with:
 * - Zod validation
 * - Rate limiting (10 attempts per hour per IP)
 * - Secure session creation (httpOnly cookie)
 * - Database logging for legal compliance
 * - IP hashing for privacy
 * - Cannot be bypassed by client-side manipulation
 *
 * @param accepted - Whether user accepted they are 21+
 * @returns Success/error response
 */
export async function verifyAge(accepted: boolean): Promise<ApiResponse<void>> {
  try {
    // 1. Validate input
    const validatedData = ageVerificationSchema.parse({ accepted })

    if (!validatedData.accepted) {
      // User denied - redirect to Google
      redirect('https://www.google.com')
    }

    // 2. Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // 3. Rate limiting check (10 attempts per hour per IP)
    const hashedIp = hashIpAddress(ipAddress)
    const rateLimitResult = await checkRateLimit(hashedIp, ageVerificationRateLimit)

    if (!rateLimitResult.success) {
      const resetTime = getTimeUntilReset(rateLimitResult.reset)
      return {
        success: false,
        error: `Too many verification attempts. Please try again in ${resetTime}.`,
      }
    }

    // 4. Generate session ID
    const sessionId = generateSessionId()

    // 5. Calculate expiry (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // 6. Save to database for legal compliance (optional in development)
    try {
      await prisma.ageVerification.create({
        data: {
          sessionId,
          ipAddress: hashedIp,
          userAgent,
          expiresAt,
        },
      })
    } catch (dbError) {
      // In development without database configured, log and continue
      if (process.env.NODE_ENV === 'development') {
        console.warn('Database not configured - age verification logging skipped:', dbError)
      } else {
        // In production, database is required for legal compliance
        throw dbError
      }
    }

    // 7. Create secure session cookie (httpOnly, cannot be modified by client)
    await createAgeVerificationSession(sessionId)

    return {
      success: true,
      message: 'Age verification successful',
    }
  } catch (error) {
    console.error('Age verification error:', error)

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Invalid verification data',
      }
    }

    // Log to Sentry with context
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, {
      tags: {
        action: 'age-verification',
      },
    })

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Server Action: Deny Age Verification
 *
 * Redirects user to Google when they indicate they are under 21.
 */
export async function denyAge() {
  redirect('https://www.google.com')
}
