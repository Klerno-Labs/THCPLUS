'use client'

import { useState } from 'react'
import { updateStoreInfo } from '@/app/actions/settings'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'

interface StoreInfoFormProps {
  initialData: {
    storeName?: string
    storePhone?: string
    storeEmail?: string
    storeAddress?: string
    storeHours?: string
    storeDescription?: string | null
  }
}

export function StoreInfoForm({ initialData }: StoreInfoFormProps) {
  const [loading, setLoading] = useState(false)

  // Parse store hours from JSON string
  const parseHours = (hoursJson: string | undefined) => {
    if (!hoursJson) return {}
    try {
      return JSON.parse(hoursJson)
    } catch {
      return {}
    }
  }

  const hours = parseHours(initialData.storeHours)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Build hours JSON
    const hoursObj = {
      monday: formData.get('monday') as string,
      tuesday: formData.get('tuesday') as string,
      wednesday: formData.get('wednesday') as string,
      thursday: formData.get('thursday') as string,
      friday: formData.get('friday') as string,
      saturday: formData.get('saturday') as string,
      sunday: formData.get('sunday') as string,
    }

    const data = {
      storeName: formData.get('storeName') as string,
      storePhone: formData.get('storePhone') as string,
      storeEmail: formData.get('storeEmail') as string,
      storeAddress: formData.get('storeAddress') as string,
      storeHours: JSON.stringify(hoursObj),
      storeDescription: formData.get('storeDescription') as string,
    }

    const result = await updateStoreInfo(data)

    if (result.success) {
      toast.success('Store information updated successfully')
    } else {
      toast.error(result.error || 'Failed to update store information')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Store Name */}
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            defaultValue={initialData.storeName}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Store Phone */}
        <div>
          <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="storePhone"
            name="storePhone"
            defaultValue={initialData.storePhone}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Store Email */}
        <div>
          <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="storeEmail"
            name="storeEmail"
            defaultValue={initialData.storeEmail}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Store Address */}
        <div>
          <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="storeAddress"
            name="storeAddress"
            defaultValue={initialData.storeAddress}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Store Description */}
      <div>
        <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Store Description
        </label>
        <textarea
          id="storeDescription"
          name="storeDescription"
          defaultValue={initialData.storeDescription || ''}
          rows={3}
          placeholder="Brief description of your store..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Store Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Store Hours</label>
        <div className="space-y-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
            (day) => {
              const dayKey = day.toLowerCase()
              return (
                <div key={day} className="grid grid-cols-3 gap-3 items-center">
                  <label className="text-sm text-gray-700">{day}</label>
                  <input
                    type="text"
                    name={dayKey}
                    defaultValue={hours[dayKey] || '9:00 AM - 9:00 PM'}
                    placeholder="9:00 AM - 9:00 PM"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              )
            }
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use format: &quot;9:00 AM - 9:00 PM&quot; or &quot;Closed&quot;
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
