import { Resend } from 'resend'
import { ContactNotificationEmail } from '../../emails/contact-notification'
import { ContactConfirmationEmail } from '../../emails/contact-confirmation'

/**
 * Resend Email Service
 *
 * Sends transactional emails using the Resend API.
 * Free tier: 100 emails/day, 3,000 emails/month
 *
 * @see https://resend.com/docs
 */

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@thcplus.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thcplus.com'

export interface ContactSubmissionData {
  id: string
  name: string
  email: string
  message: string
  submittedAt: Date
}

/**
 * Send contact form notification to admin
 *
 * @param submission - Contact form submission data
 * @returns Promise with email send result
 */
export async function sendContactNotification(submission: ContactSubmissionData) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${submission.name}`,
      react: ContactNotificationEmail(submission),
    })

    if (error) {
      console.error('Failed to send contact notification:', error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

/**
 * Send confirmation email to user who submitted contact form
 *
 * @param submission - Contact form submission data
 * @returns Promise with email send result
 */
export async function sendContactConfirmation(submission: ContactSubmissionData) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: submission.email,
      subject: 'Thank you for contacting THC Plus',
      react: ContactConfirmationEmail(submission),
    })

    if (error) {
      console.error('Failed to send contact confirmation:', error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}
