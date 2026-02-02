'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Get or create settings
 * Returns the existing settings or creates default settings if none exist
 */
export async function getSettings() {
  try {
    let settings = await prisma.settings.findFirst()

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      })
    }

    return { success: true, data: settings }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {
      success: false,
      error: 'Failed to fetch settings',
    }
  }
}

/**
 * Update Square Integration Settings
 */
export async function updateSquareSettings(data: {
  squareAccessToken?: string
  squareLocationId?: string
  squareEnvironment?: string
  squareWebhookSignatureKey?: string
  squareAutoSync?: boolean
  squareSyncEnabled?: boolean
}) {
  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    // Update settings
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        squareAccessToken: data.squareAccessToken,
        squareLocationId: data.squareLocationId,
        squareEnvironment: data.squareEnvironment,
        squareWebhookSignatureKey: data.squareWebhookSignatureKey,
        squareAutoSync: data.squareAutoSync,
        squareSyncEnabled: data.squareSyncEnabled,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating Square settings:', error)
    return {
      success: false,
      error: 'Failed to update Square settings',
    }
  }
}

/**
 * Update Store Information
 */
export async function updateStoreInfo(data: {
  storeName?: string
  storePhone?: string
  storeEmail?: string
  storeAddress?: string
  storeHours?: string
  storeDescription?: string
}) {
  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    // Update settings
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        storeName: data.storeName,
        storePhone: data.storePhone,
        storeEmail: data.storeEmail,
        storeAddress: data.storeAddress,
        storeHours: data.storeHours,
        storeDescription: data.storeDescription,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating store info:', error)
    return {
      success: false,
      error: 'Failed to update store information',
    }
  }
}

/**
 * Update Email Notification Rules
 */
export async function updateEmailNotifications(data: {
  notifyOnNewSubmission?: boolean
  notifyOnCouponExpiry?: boolean
  notifyOnCouponUsageLimit?: boolean
  notificationEmail?: string
  notificationCcEmails?: string
  dailyDigestEnabled?: boolean
  weeklyReportEnabled?: boolean
  couponExpiryWarningDays?: number
}) {
  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    // Update settings
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        notifyOnNewSubmission: data.notifyOnNewSubmission,
        notifyOnCouponExpiry: data.notifyOnCouponExpiry,
        notifyOnCouponUsageLimit: data.notifyOnCouponUsageLimit,
        notificationEmail: data.notificationEmail,
        notificationCcEmails: data.notificationCcEmails,
        dailyDigestEnabled: data.dailyDigestEnabled,
        weeklyReportEnabled: data.weeklyReportEnabled,
        couponExpiryWarningDays: data.couponExpiryWarningDays,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating email notifications:', error)
    return {
      success: false,
      error: 'Failed to update email notification settings',
    }
  }
}

/**
 * Update Social Media Links
 */
export async function updateSocialMedia(data: {
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
}) {
  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    // Update settings
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        twitterUrl: data.twitterUrl,
        linkedinUrl: data.linkedinUrl,
        youtubeUrl: data.youtubeUrl,
        tiktokUrl: data.tiktokUrl,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating social media links:', error)
    return {
      success: false,
      error: 'Failed to update social media links',
    }
  }
}

/**
 * Update SEO Settings
 */
export async function updateSEOSettings(data: {
  seoMetaDescription?: string
  seoKeywords?: string
  seoTitle?: string
  ogImage?: string
  twitterHandle?: string
}) {
  try {
    // Get or create settings
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    // Update settings
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        seoMetaDescription: data.seoMetaDescription,
        seoKeywords: data.seoKeywords,
        seoTitle: data.seoTitle,
        ogImage: data.ogImage,
        twitterHandle: data.twitterHandle,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating SEO settings:', error)
    return {
      success: false,
      error: 'Failed to update SEO settings',
    }
  }
}
