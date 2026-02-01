'use server'

import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z, ZodError } from 'zod'
import type { ApiResponse } from '@/types'

/**
 * Password change validation schema
 */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

/**
 * Server Action: Change Admin Password
 *
 * Allows authenticated admins to change their password.
 * Requires current password verification for security.
 *
 * @param data - Password change form data
 * @returns Success/error response
 */
export async function changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
  try {
    // 1. Require authentication
    const user = await requireAuth()

    // 2. Validate input
    const validatedData = changePasswordSchema.parse(data)

    // 3. Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: user.id },
    })

    if (!admin) {
      return {
        success: false,
        error: 'Admin user not found',
      }
    }

    // 4. Verify current password
    const isValidPassword = await bcrypt.compare(validatedData.currentPassword, admin.passwordHash)

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Current password is incorrect',
      }
    }

    // 5. Check if new password is different from current
    const isSamePassword = await bcrypt.compare(validatedData.newPassword, admin.passwordHash)

    if (isSamePassword) {
      return {
        success: false,
        error: 'New password must be different from current password',
      }
    }

    // 6. Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10)

    // 7. Update password in database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newPasswordHash },
    })

    return {
      success: true,
      message: 'Password changed successfully',
    }
  } catch (error) {
    console.error('Password change error:', error)

    // Handle auth errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return {
        success: false,
        error: 'You must be logged in to change your password',
      }
    }

    // Handle validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid input data',
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
