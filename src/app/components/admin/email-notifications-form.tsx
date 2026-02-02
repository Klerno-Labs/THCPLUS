'use client'

import { useState } from 'react'
import { updateEmailNotifications } from '@/app/actions/settings'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'

interface EmailNotificationsFormProps {
  initialData: {
    notifyOnNewSubmission?: boolean
    notifyOnCouponExpiry?: boolean
    notifyOnCouponUsageLimit?: boolean
    notificationEmail?: string
    notificationCcEmails?: string | null
    dailyDigestEnabled?: boolean
    weeklyReportEnabled?: boolean
    couponExpiryWarningDays?: number
  }
}

export function EmailNotificationsForm({ initialData }: EmailNotificationsFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      notifyOnNewSubmission: formData.get('notifyOnNewSubmission') === 'on',
      notifyOnCouponExpiry: formData.get('notifyOnCouponExpiry') === 'on',
      notifyOnCouponUsageLimit: formData.get('notifyOnCouponUsageLimit') === 'on',
      notificationEmail: formData.get('notificationEmail') as string,
      notificationCcEmails: formData.get('notificationCcEmails') as string,
      dailyDigestEnabled: formData.get('dailyDigestEnabled') === 'on',
      weeklyReportEnabled: formData.get('weeklyReportEnabled') === 'on',
      couponExpiryWarningDays: parseInt(formData.get('couponExpiryWarningDays') as string, 10),
    }

    const result = await updateEmailNotifications(data)

    if (result.success) {
      toast.success('Email notification settings updated successfully')
    } else {
      toast.error(result.error || 'Failed to update email notification settings')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Primary Notification Email */}
        <div>
          <label
            htmlFor="notificationEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Primary Notification Email
          </label>
          <input
            type="email"
            id="notificationEmail"
            name="notificationEmail"
            defaultValue={initialData.notificationEmail}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Main email address for receiving notifications
          </p>
        </div>

        {/* CC Emails */}
        <div>
          <label
            htmlFor="notificationCcEmails"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CC Email Addresses
          </label>
          <input
            type="text"
            id="notificationCcEmails"
            name="notificationCcEmails"
            defaultValue={initialData.notificationCcEmails || ''}
            placeholder="email1@example.com, email2@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Comma-separated list of additional email addresses
          </p>
        </div>

        {/* Notification Toggles */}
        <div className="space-y-3 pt-2">
          {/* New Contact Submission */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">New Contact Submissions</p>
              <p className="text-sm text-gray-500">
                Get notified when someone submits the contact form
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyOnNewSubmission"
                defaultChecked={initialData.notifyOnNewSubmission}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Coupon Expiry Warning */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Coupon Expiry Warnings</p>
              <p className="text-sm text-gray-500">Get notified when coupons are about to expire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyOnCouponExpiry"
                defaultChecked={initialData.notifyOnCouponExpiry}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Coupon Usage Limit */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Coupon Usage Limits</p>
              <p className="text-sm text-gray-500">
                Get notified when coupons reach their usage limit
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyOnCouponUsageLimit"
                defaultChecked={initialData.notifyOnCouponUsageLimit}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Daily Digest */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Daily Digest</p>
              <p className="text-sm text-gray-500">
                Receive a daily summary of all activity (coming soon)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="dailyDigestEnabled"
                defaultChecked={initialData.dailyDigestEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Weekly Report */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-500">
                Receive weekly analytics and insights (coming soon)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="weeklyReportEnabled"
                defaultChecked={initialData.weeklyReportEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Coupon Expiry Warning Days */}
        <div>
          <label
            htmlFor="couponExpiryWarningDays"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Coupon Expiry Warning (Days)
          </label>
          <input
            type="number"
            id="couponExpiryWarningDays"
            name="couponExpiryWarningDays"
            defaultValue={initialData.couponExpiryWarningDays}
            min="1"
            max="30"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Days before expiry to send warning notification (1-30 days)
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
