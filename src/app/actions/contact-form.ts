'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact-form'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'
import { checkRateLimit, contactFormRateLimit, getTimeUntilReset } from '@/lib/rate-limit'
import { hashIpAddress } from '@/lib/crypto'
import type { ApiResponse } from '@/types'

/**
 * Verify reCAPTCHA token with Google's API
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

/**
 * Server Action: Submit Contact Form
 *
 * Handles contact form submissions with:
 * - reCAPTCHA verification (bot protection)
 * - Zod validation
 * - Rate limiting (3 submissions per hour per IP)
 * - Database persistence
 * - Email notifications (admin + user confirmation)
 * - IP tracking and Sentry error logging
 *
 * @param data - Contact form data from user
 * @returns Success/error response
 */
export async function submitContactForm(data: ContactFormData): Promise<ApiResponse<void>> {
  try {
    // 1. Validate input data
    const validatedData = contactFormSchema.parse(data)

    // 2. Verify reCAPTCHA token
    const isCaptchaValid = await verifyRecaptcha(validatedData.captchaToken)
    if (!isCaptchaValid) {
      return {
        success: false,
        error: 'Captcha verification failed. Please try again.',
      }
    }

    // 3. Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // 4. Rate limiting check (3 submissions per hour per IP)
    const hashedIp = hashIpAddress(ipAddress)
    const rateLimitResult = await checkRateLimit(hashedIp, contactFormRateLimit)

    if (!rateLimitResult.success) {
      const resetTime = getTimeUntilReset(rateLimitResult.reset)
      return {
        success: false,
        error: `Too many submissions. Please try again in ${resetTime}.`,
      }
    }

    // 5. Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        ipAddress,
        userAgent,
      },
    })

    // 6. Send email notifications (run in parallel)
    await Promise.all([
      sendContactNotification({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        submittedAt: submission.submittedAt,
      }),
      sendContactConfirmation({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        submittedAt: submission.submittedAt,
      }),
    ])

    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
    }
  } catch (error) {
    console.error('Contact form submission error:', error)

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Please check your form data and try again.',
      }
    }

    // Log to Sentry with context
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, {
      tags: {
        action: 'contact-form-submission',
      },
      extra: {
        formData: {
          name: data.name,
          email: data.email,
          // Don't log message content for privacy
        },
      },
    })

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    }
  }
}
