/**
 * Square API Integration
 *
 * Handles Square discount/coupon management and redemption tracking.
 * Requires SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in environment.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client: SquareClient } = require('square')

// Initialize Square client
const getSquareClient = () => {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'

  if (!accessToken) {
    throw new Error('SQUARE_ACCESS_TOKEN is not configured')
  }

  return new SquareClient({
    accessToken,
    environment,
  })
}

export interface CreateSquareDiscountParams {
  code: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  startsAt: Date
  expiresAt?: Date
}

export interface SquareDiscountResult {
  discountId: string
  version: number
}

/**
 * Create a discount in Square
 * Converts our coupon to Square's discount format
 */
export async function createSquareDiscount(
  params: CreateSquareDiscountParams
): Promise<SquareDiscountResult> {
  const client = getSquareClient()
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!locationId) {
    throw new Error('SQUARE_LOCATION_ID is not configured')
  }

  try {
    // Square uses cents for money, so convert dollars to cents
    const discountData = {
      idempotencyKey: `coupon-${params.code}-${Date.now()}`,
      discount: {
        name: params.code,
        discountType: params.type === 'percentage' ? 'FIXED_PERCENTAGE' : 'FIXED_AMOUNT',
        ...(params.type === 'percentage'
          ? { percentage: params.value.toString() }
          : {
              amountMoney: {
                amount: BigInt(Math.round(params.value * 100)), // Convert to cents
                currency: 'USD',
              },
            }),
        pinRequired: false,
        labelColor: '9da2a6',
        ...(params.minPurchase && {
          minimumAmountMoney: {
            amount: BigInt(Math.round(params.minPurchase * 100)),
            currency: 'USD',
          },
        }),
      },
    }

    const { result } = await client.catalogApi.upsertCatalogObject(discountData)

    if (!result.catalogObject || !result.catalogObject.id) {
      throw new Error('Failed to create Square discount')
    }

    return {
      discountId: result.catalogObject.id,
      version: Number(result.catalogObject.version) || 1,
    }
  } catch (error) {
    console.error('Error creating Square discount:', error)
    throw new Error(
      `Failed to create Square discount: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Update an existing Square discount
 */
export async function updateSquareDiscount(
  discountId: string,
  version: number,
  params: Partial<CreateSquareDiscountParams>
): Promise<SquareDiscountResult> {
  const client = getSquareClient()

  try {
    const updates = {
      idempotencyKey: `update-${discountId}-${Date.now()}`,
      object: {
        type: 'DISCOUNT',
        id: discountId,
        version: BigInt(version),
        discountData: {
          ...(params.code && { name: params.code }),
          ...(params.type && {
            discountType: params.type === 'percentage' ? 'FIXED_PERCENTAGE' : 'FIXED_AMOUNT',
          }),
          ...(params.value !== undefined &&
            params.type === 'percentage' && { percentage: params.value.toString() }),
          ...(params.value !== undefined &&
            params.type === 'fixed' && {
              amountMoney: {
                amount: BigInt(Math.round(params.value * 100)),
                currency: 'USD',
              },
            }),
        },
      },
    }

    const { result } = await client.catalogApi.upsertCatalogObject(updates)

    if (!result.catalogObject || !result.catalogObject.id) {
      throw new Error('Failed to update Square discount')
    }

    return {
      discountId: result.catalogObject.id,
      version: Number(result.catalogObject.version) || version + 1,
    }
  } catch (error) {
    console.error('Error updating Square discount:', error)
    throw new Error(
      `Failed to update Square discount: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a Square discount
 */
export async function deleteSquareDiscount(discountId: string): Promise<void> {
  const client = getSquareClient()

  try {
    await client.catalogApi.deleteCatalogObject(discountId)
  } catch (error) {
    console.error('Error deleting Square discount:', error)
    throw new Error(
      `Failed to delete Square discount: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get discount usage from Square orders
 * Returns the number of times a discount has been applied
 */
export async function getSquareDiscountUsage(discountId: string): Promise<number> {
  const client = getSquareClient()
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!locationId) {
    throw new Error('SQUARE_LOCATION_ID is not configured')
  }

  try {
    // Search for orders that used this discount
    const { result } = await client.ordersApi.searchOrders({
      locationIds: [locationId],
      query: {
        filter: {
          dateTimeFilter: {
            createdAt: {
              // Look back 1 year
              startAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        },
      },
      limit: 500, // Max allowed by Square
    })

    if (!result.orders) {
      return 0
    }

    // Count orders that have this discount applied
    const usageCount = result.orders.filter(
      (order: { discounts?: Array<{ catalogObjectId?: string }> }) => {
        return order.discounts?.some(
          (discount: { catalogObjectId?: string }) => discount.catalogObjectId === discountId
        )
      }
    ).length

    return usageCount
  } catch (error) {
    console.error('Error getting Square discount usage:', error)
    // Return 0 instead of throwing to avoid breaking the UI
    return 0
  }
}

/**
 * Check if Square API is configured
 */
export function isSquareConfigured(): boolean {
  return !!(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID)
}
