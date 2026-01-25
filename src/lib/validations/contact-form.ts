import { z } from 'zod'

/**
 * Contact form validation schema
 *
 * Validates user input for the contact form submission.
 * All fields are required with specific constraints:
 * - Name: 2-100 characters
 * - Email: Valid email format
 * - Message: 10-1000 characters
 * - Captcha: reCAPTCHA token (required for bot protection)
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  captchaToken: z
    .string()
    .min(1, 'Please complete the captcha verification'),
})

/**
 * Inferred TypeScript type from the validation schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>
