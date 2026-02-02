import { auth } from '@/lib/auth'
import { Card } from '@/app/components/ui/card'
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react'
import { ChangePasswordForm } from '@/app/components/admin/change-password-form'

/**
 * Admin Settings Page
 *
 * Manage admin account settings:
 * - Account information
 * - Notification preferences
 * - Security settings
 * - System configuration
 */
export default async function AdminSettingsPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your admin account and preferences.</p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {session.user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {session.user.email}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-500">
              To update your account information, please contact a system administrator.
            </p>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email alerts for new submissions</p>
            </div>
            <div className="text-sm font-medium text-gray-600">Coming soon</div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-500">Weekly analytics and insights report</p>
            </div>
            <div className="text-sm font-medium text-gray-600">Coming soon</div>
          </div>
        </div>
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
