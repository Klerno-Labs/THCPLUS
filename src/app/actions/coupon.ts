'use server'

import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import type { ApiResponse } from '@/types'
import { createSquareDiscount, isSquareConfigured, getSquareDiscountUsage } from '@/lib/square'

/**
 * Coupon validation schema
 */
const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  orderTotal: z.number().min(0, 'Order total must be a positive number'),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
})

/**
 * Coupon creation schema
 */
const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  minPurchase: z.number().nonnegative().optional(),
  maxUses: z.number().positive().int().optional(),
  maxUsesPerCustomer: z.number().positive().int().optional(),
  startsAt: z.string(),
  expiresAt: z.string().optional(),
})

export type ValidateCouponData = z.infer<typeof validateCouponSchema>
export type CreateCouponData = z.infer<typeof createCouponSchema>

/**
 * Validate a coupon code and calculate discount
 * Returns success: true with validation result in data
 */
export async function validateCoupon(data: ValidateCouponData): Promise<
  ApiResponse<{
    isValid: boolean
    discountAmount: number
    finalTotal: number
    coupon?: {
      code: string
      description: string
      type: string
      value: number
    }
  }>
> {
  try {
    const validatedData = validateCouponSchema.parse(data)

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code.toUpperCase() },
    })

    if (!coupon) {
      return {
        success: true,
        message: 'Invalid coupon code',
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check if active
    if (!coupon.isActive) {
      return {
        success: true,
        message: 'This coupon is no longer active',
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check if expired
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return {
        success: true,
        message: 'This coupon has expired',
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check if started
    if (coupon.startsAt > new Date()) {
      return {
        success: true,
        message: 'This coupon is not yet valid',
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check max uses
    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
      return {
        success: true,
        message: 'This coupon has reached its maximum usage limit',
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check minimum purchase
    if (coupon.minPurchase && validatedData.orderTotal < coupon.minPurchase) {
      return {
        success: true,
        message: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
        data: {
          isValid: false,
          discountAmount: 0,
          finalTotal: validatedData.orderTotal,
        },
      }
    }

    // Check per-customer usage
    if (coupon.maxUsesPerCustomer && validatedData.customerEmail) {
      const customerUses = await prisma.couponRedemption.count({
        where: {
          couponId: coupon.id,
          customerEmail: validatedData.customerEmail,
        },
      })

      if (customerUses >= coupon.maxUsesPerCustomer) {
        return {
          success: true,
          message: 'You have already used this coupon the maximum number of times',
          data: {
            isValid: false,
            discountAmount: 0,
            finalTotal: validatedData.orderTotal,
          },
        }
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = (validatedData.orderTotal * coupon.value) / 100
    } else {
      discountAmount = coupon.value
    }

    // Cap discount at order total
    discountAmount = Math.min(discountAmount, validatedData.orderTotal)

    const finalTotal = validatedData.orderTotal - discountAmount

    return {
      success: true,
      message: 'Coupon is valid!',
      data: {
        isValid: true,
        discountAmount,
        finalTotal,
        coupon: {
          code: coupon.code,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
        },
      },
    }
  } catch (error) {
    console.error('Coupon validation error:', error)
    return {
      success: false,
      error: 'An error occurred while validating the coupon',
    }
  }
}

/**
 * Redeem a coupon (for testing or actual use)
 */
export async function redeemCoupon(data: ValidateCouponData): Promise<ApiResponse<void>> {
  try {
    // Validate coupon first
    const validation = await validateCoupon(data)

    if (!validation.success) {
      return { success: false, error: 'Failed to validate coupon' }
    }

    if (!validation.data || !validation.data.isValid) {
      return { success: false, error: validation.message || 'Invalid coupon' }
    }

    const validatedData = validateCouponSchema.parse(data)

    // Find coupon again for redemption
    const coupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code.toUpperCase() },
    })

    if (!coupon) {
      return { success: false, error: 'Coupon not found' }
    }

    // Create redemption record and increment count
    await prisma.$transaction([
      prisma.couponRedemption.create({
        data: {
          couponId: coupon.id,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          discountAmount: validation.data.discountAmount,
          orderTotal: validatedData.orderTotal,
        },
      }),
      prisma.coupon.update({
        where: { id: coupon.id },
        data: { usesCount: { increment: 1 } },
      }),
    ])

    return {
      success: true,
      message: `Coupon redeemed! You saved $${validation.data.discountAmount.toFixed(2)}`,
    }
  } catch (error) {
    console.error('Coupon redemption error:', error)
    return {
      success: false,
      error: 'An error occurred while redeeming the coupon',
    }
  }
}

/**
 * Create a new coupon (admin only)
 */
export async function createCoupon(data: CreateCouponData): Promise<ApiResponse<void>> {
  try {
    await requireAuth()

    const validatedData = createCouponSchema.parse(data)

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: validatedData.code.toUpperCase() },
    })

    if (existing) {
      return {
        success: false,
        error: 'A coupon with this code already exists',
      }
    }

    // Try to create discount in Square if configured
    let squareDiscountId: string | undefined
    let squareVersion: number | undefined
    let squareSynced = false

    if (isSquareConfigured()) {
      try {
        const squareResult = await createSquareDiscount({
          code: validatedData.code.toUpperCase(),
          description: validatedData.description,
          type: validatedData.type,
          value: validatedData.value,
          minPurchase: validatedData.minPurchase,
          startsAt: new Date(validatedData.startsAt),
          expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
        })

        squareDiscountId = squareResult.discountId
        squareVersion = squareResult.version
        squareSynced = true
      } catch (error) {
        console.error('Failed to create Square discount:', error)
        // Continue creating the coupon even if Square sync fails
      }
    }

    await prisma.coupon.create({
      data: {
        code: validatedData.code.toUpperCase(),
        description: validatedData.description,
        type: validatedData.type,
        value: validatedData.value,
        minPurchase: validatedData.minPurchase,
        maxUses: validatedData.maxUses,
        maxUsesPerCustomer: validatedData.maxUsesPerCustomer,
        startsAt: new Date(validatedData.startsAt),
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
        createdBy: 'admin', // TODO: Get from session
        squareDiscountId,
        squareVersion,
        squareSynced,
        squareSyncedAt: squareSynced ? new Date() : undefined,
      },
    })

    return {
      success: true,
      message: squareSynced
        ? 'Coupon created and synced to Square successfully'
        : 'Coupon created successfully (Square sync unavailable)',
    }
  } catch (error) {
    console.error('Coupon creation error:', error)
    return {
      success: false,
      error: 'An error occurred while creating the coupon',
    }
  }
}

/**
 * Sync coupon usage from Square
 * Updates the usesCount from Square orders
 */
export async function syncCouponUsageFromSquare(
  couponId: string
): Promise<ApiResponse<{ usageCount: number }>> {
  try {
    await requireAuth()

    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    })

    if (!coupon) {
      return {
        success: false,
        error: 'Coupon not found',
      }
    }

    if (!coupon.squareDiscountId) {
      return {
        success: false,
        error: 'Coupon is not synced with Square',
      }
    }

    if (!isSquareConfigured()) {
      return {
        success: false,
        error: 'Square is not configured',
      }
    }

    try {
      const usageCount = await getSquareDiscountUsage(coupon.squareDiscountId)

      // Update the coupon's usage count
      await prisma.coupon.update({
        where: { id: couponId },
        data: {
          usesCount: usageCount,
          squareSyncedAt: new Date(),
        },
      })

      return {
        success: true,
        data: { usageCount },
        message: `Synced ${usageCount} redemptions from Square`,
      }
    } catch (error) {
      console.error('Error syncing from Square:', error)
      return {
        success: false,
        error: 'Failed to sync usage from Square',
      }
    }
  } catch (error) {
    console.error('Sync coupon usage error:', error)
    return {
      success: false,
      error: 'An error occurred while syncing coupon usage',
    }
  }
}

/**
 * Sync all Square-linked coupons
 * Updates usage counts for all coupons that have Square IDs
 */
export async function syncAllCouponsFromSquare(): Promise<ApiResponse<{ syncedCount: number }>> {
  try {
    await requireAuth()

    if (!isSquareConfigured()) {
      return {
        success: false,
        error: 'Square is not configured',
      }
    }

    // Get all coupons with Square IDs
    const coupons = await prisma.coupon.findMany({
      where: {
        squareDiscountId: { not: null },
      },
    })

    let syncedCount = 0

    for (const coupon of coupons) {
      if (!coupon.squareDiscountId) continue

      try {
        const usageCount = await getSquareDiscountUsage(coupon.squareDiscountId)

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: {
            usesCount: usageCount,
            squareSyncedAt: new Date(),
          },
        })

        syncedCount++
      } catch (error) {
        console.error(`Error syncing coupon ${coupon.code}:`, error)
        // Continue with other coupons
      }
    }

    return {
      success: true,
      data: { syncedCount },
      message: `Synced ${syncedCount} coupons from Square`,
    }
  } catch (error) {
    console.error('Sync all coupons error:', error)
    return {
      success: false,
      error: 'An error occurred while syncing coupons',
    }
  }
}

/**
 * Get all coupons with redemption counts
 */
export async function getCoupons() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return coupons
}
