import { auth } from '@/lib/auth'
import { Card } from '@/app/components/ui/card'
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Store,
  CreditCard,
  Share2,
  Users,
} from 'lucide-react'
import { ChangePasswordForm } from '@/app/components/admin/change-password-form'
import { SquareSettingsForm } from '@/app/components/admin/square-settings-form'
import { StoreInfoForm } from '@/app/components/admin/store-info-form'
import { EmailNotificationsForm } from '@/app/components/admin/email-notifications-form'
import { SocialMediaSEOForm } from '@/app/components/admin/social-media-seo-form'
import { UserManagement } from '@/app/components/admin/user-management'
import { getSettings } from '@/app/actions/settings'
import { prisma } from '@/lib/db'

/**
 * Admin Settings Page
 *
 * Manage admin account settings:
 * - Square Integration
 * - Store Information
 * - Email Notifications
 * - Social Media & SEO
 * - Account information
 * - Security settings
 * - User Management
 * - System configuration
 */
export default async function AdminSettingsPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  // Fetch current settings
  const settingsResult = await getSettings()
  const settings = settingsResult.success ? settingsResult.data : null

  // Fetch current user's full info (including role)
  const currentUser = await prisma.admin.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  if (!currentUser) {
    return null
  }

  // Fetch all admins for user management
  const admins = (await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })) as Array<{
    id: string
    email: string
    name: string
    role: 'admin' | 'super_admin'
    isActive: boolean
    createdAt: Date
    lastLoginAt: Date | null
  }>

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your store settings, integrations, and preferences.
        </p>
      </div>

      {/* Square Integration Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Square Integration</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Connect your Square POS to automatically sync coupons and track redemptions.
        </p>
        <SquareSettingsForm
          initialData={
            settings || {
              squareAccessToken: null,
              squareLocationId: null,
              squareEnvironment: null,
              squareWebhookSignatureKey: null,
              squareAutoSync: false,
              squareSyncEnabled: false,
            }
          }
        />
      </Card>

      {/* Store Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Update your store&apos;s basic information, hours, and contact details.
        </p>
        <StoreInfoForm
          initialData={
            settings || {
              storeName: '3rd Coast Smoke Company',
              storePhone: '(555) 123-4567',
              storeEmail: 'info@3rdcoastsmokecompany.com',
              storeAddress: '123 Main St, Houston, TX 77001',
              storeHours:
                '{"monday":"9:00 AM - 9:00 PM","tuesday":"9:00 AM - 9:00 PM","wednesday":"9:00 AM - 9:00 PM","thursday":"9:00 AM - 9:00 PM","friday":"9:00 AM - 10:00 PM","saturday":"10:00 AM - 10:00 PM","sunday":"10:00 AM - 8:00 PM"}',
              storeDescription: null,
            }
          }
        />
      </Card>

      {/* Email Notification Rules */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Configure when and where to receive email notifications.
        </p>
        <EmailNotificationsForm
          initialData={
            settings || {
              notifyOnNewSubmission: true,
              notifyOnCouponExpiry: true,
              notifyOnCouponUsageLimit: true,
              notificationEmail: 'admin@3rdcoastsmokecompany.com',
              notificationCcEmails: null,
              dailyDigestEnabled: false,
              weeklyReportEnabled: false,
              couponExpiryWarningDays: 7,
            }
          }
        />
      </Card>

      {/* Social Media & SEO */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Social Media & SEO</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Manage your social media links and search engine optimization settings.
        </p>
        <SocialMediaSEOForm
          initialData={
            settings || {
              facebookUrl: null,
              instagramUrl: 'https://www.instagram.com/thcplusnwhouston/',
              twitterUrl: null,
              linkedinUrl: null,
              youtubeUrl: null,
              tiktokUrl: null,
              seoMetaDescription: null,
              seoKeywords: null,
              seoTitle: null,
              ogImage: null,
              twitterHandle: null,
            }
          }
        />
      </Card>

      {/* User Management */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        </div>

        <UserManagement
          initialUsers={admins}
          currentUserEmail={currentUser.email}
          currentUserRole={currentUser.role as 'admin' | 'super_admin'}
        />
      </Card>

      {/* Security Settings - Change Password */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Security</h2>
        </div>

        <div className="space-y-6">
          {/* Password Change Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Change Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Update your password to keep your account secure
            </p>
            <ChangePasswordForm />
          </div>

          {/* Future Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <div className="text-sm font-medium text-gray-600">Coming soon</div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">System Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Application Version</p>
            <p className="text-gray-900">THC Plus Admin v0.1.0</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Environment</p>
            <p className="text-gray-900">{process.env.NODE_ENV}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Database</p>
            <p className="text-gray-900">PostgreSQL (Vercel)</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Authentication</p>
            <p className="text-gray-900">NextAuth.js v5</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
