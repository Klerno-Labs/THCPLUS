'use client'

import { useState } from 'react'
import { updateSquareSettings } from '@/app/actions/settings'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'

interface SquareSettingsFormProps {
  initialData: {
    squareAccessToken?: string | null
    squareLocationId?: string | null
    squareEnvironment?: string | null
    squareWebhookSignatureKey?: string | null
    squareAutoSync?: boolean
    squareSyncEnabled?: boolean
  }
}

export function SquareSettingsForm({ initialData }: SquareSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [showTokens, setShowTokens] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      squareAccessToken: formData.get('squareAccessToken') as string,
      squareLocationId: formData.get('squareLocationId') as string,
      squareEnvironment: formData.get('squareEnvironment') as string,
      squareWebhookSignatureKey: formData.get('squareWebhookSignatureKey') as string,
      squareAutoSync: formData.get('squareAutoSync') === 'on',
      squareSyncEnabled: formData.get('squareSyncEnabled') === 'on',
    }

    const result = await updateSquareSettings(data)

    if (result.success) {
      toast.success('Square settings updated successfully')
    } else {
      toast.error(result.error || 'Failed to update settings')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Enable Square Integration */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Enable Square Integration</p>
            <p className="text-sm text-gray-500">
              Sync coupons to Square POS and track redemptions
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="squareSyncEnabled"
              defaultChecked={initialData.squareSyncEnabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {/* Auto-Sync Coupons */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Auto-Sync Coupons</p>
            <p className="text-sm text-gray-500">
              Automatically sync new coupons to Square when created
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="squareAutoSync"
              defaultChecked={initialData.squareAutoSync}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {/* Environment */}
        <div>
          <label
            htmlFor="squareEnvironment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Environment
          </label>
          <select
            id="squareEnvironment"
            name="squareEnvironment"
            defaultValue={initialData.squareEnvironment || 'sandbox'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="sandbox">Sandbox (Testing)</option>
            <option value="production">Production (Live)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Use Sandbox for testing, Production for live transactions
          </p>
        </div>

        {/* Access Token */}
        <div>
          <label
            htmlFor="squareAccessToken"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Access Token
          </label>
          <div className="relative">
            <input
              type={showTokens ? 'text' : 'password'}
              id="squareAccessToken"
              name="squareAccessToken"
              defaultValue={initialData.squareAccessToken || ''}
              placeholder="EAAAxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowTokens(!showTokens)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary-600 hover:text-primary-700"
            >
              {showTokens ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Get from{' '}
            <a
              href="https://developer.squareup.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              Square Developer Dashboard
            </a>
          </p>
        </div>

        {/* Location ID */}
        <div>
          <label
            htmlFor="squareLocationId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location ID
          </label>
          <input
            type="text"
            id="squareLocationId"
            name="squareLocationId"
            defaultValue={initialData.squareLocationId || ''}
            placeholder="LXXXXXXXXXXXXX"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Your Square location ID for the store</p>
        </div>

        {/* Webhook Signature Key */}
        <div>
          <label
            htmlFor="squareWebhookSignatureKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Webhook Signature Key
          </label>
          <input
            type={showTokens ? 'text' : 'password'}
            id="squareWebhookSignatureKey"
            name="squareWebhookSignatureKey"
            defaultValue={initialData.squareWebhookSignatureKey || ''}
            placeholder="Optional: For webhook verification"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional: Used to verify webhook events from Square
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
