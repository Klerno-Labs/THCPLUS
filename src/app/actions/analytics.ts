'use server'

import { prisma } from '@/lib/db'

export interface VisitorTrendData {
  date: string
  visitors: number
  submissions: number
}

export interface CouponPerformanceData {
  name: string
  redemptions: number
  savings: number
}

export async function getVisitorTrends(): Promise<VisitorTrendData[]> {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get daily visitor counts (age verifications)
    const verifications = await prisma.ageVerification.groupBy({
      by: ['verifiedAt'],
      where: {
        verifiedAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    // Get daily submission counts
    const submissions = await prisma.contactSubmission.groupBy({
      by: ['submittedAt'],
      where: {
        submittedAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    // Create a map of dates to counts
    const dateMap = new Map<string, { visitors: number; submissions: number }>()

    // Process verifications
    verifications.forEach((v) => {
      const dateKey = v.verifiedAt.toISOString().split('T')[0]
      const existing = dateMap.get(dateKey) || { visitors: 0, submissions: 0 }
      dateMap.set(dateKey, { ...existing, visitors: existing.visitors + v._count })
    })

    // Process submissions
    submissions.forEach((s) => {
      const dateKey = s.submittedAt.toISOString().split('T')[0]
      const existing = dateMap.get(dateKey) || { visitors: 0, submissions: 0 }
      dateMap.set(dateKey, { ...existing, submissions: existing.submissions + s._count })
    })

    // Convert to array and sort by date
    const result = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: data.visitors,
        submissions: data.submissions,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })

    // If no data, return empty array
    if (result.length === 0) {
      return []
    }

    return result
  } catch (error) {
    console.error('Failed to fetch visitor trends:', error)
    return []
  }
}

export async function getCouponPerformance(): Promise<CouponPerformanceData[]> {
  try {
    const thisMonthStart = new Date()
    thisMonthStart.setDate(1)
    thisMonthStart.setHours(0, 0, 0, 0)

    // Get coupon performance with redemptions and total savings
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        redemptions: {
          some: {
            redeemedAt: {
              gte: thisMonthStart,
            },
          },
        },
      },
      include: {
        redemptions: {
          where: {
            redeemedAt: {
              gte: thisMonthStart,
            },
          },
          select: {
            discountAmount: true,
          },
        },
      },
      orderBy: {
        redemptions: {
          _count: 'desc',
        },
      },
      take: 5, // Top 5 performing coupons
    })

    const result = coupons.map((coupon) => ({
      name: coupon.code,
      redemptions: coupon.redemptions.length,
      savings: Math.round(
        coupon.redemptions.reduce((sum, r) => sum + r.discountAmount, 0)
      ),
    }))

    return result
  } catch (error) {
    console.error('Failed to fetch coupon performance:', error)
    return []
  }
}
