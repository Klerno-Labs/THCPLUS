import { z } from 'zod'

/**
 * Age verification schema
 *
 * Validates age verification acceptance from the user.
 * Ensures user explicitly accepts that they are 21 or older.
 */
export const ageVerificationSchema = z.object({
  accepted: z.boolean().refine((val) => val === true, {
    message: 'You must be 21 or older to access this website',
  }),
  termsAccepted: z.boolean().optional(),
})

/**
 * Inferred TypeScript type from the validation schema
 */
export type AgeVerificationData = z.infer<typeof ageVerificationSchema>

/**
 * Age verification session data stored in database
 */
export const ageVerificationSessionSchema = z.object({
  sessionId: z.string().min(1),
  ipAddress: z.string().min(1),
  userAgent: z.string(),
  verifiedAt: z.date(),
  expiresAt: z.date(),
})

export type AgeVerificationSession = z.infer<typeof ageVerificationSessionSchema>
