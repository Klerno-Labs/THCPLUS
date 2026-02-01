'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { X, Sparkles } from 'lucide-react'

interface CreateCouponDialogProps {
  children: React.ReactNode
}

export function CreateCouponDialog({ children }: CreateCouponDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage')

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Create New Coupon</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <Input type="text" placeholder="e.g., SUMMER25" className="font-mono uppercase" />
                  <p className="text-xs text-gray-500 mt-1">
                    Use uppercase letters and numbers. No spaces.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Input type="text" placeholder="e.g., 25% off summer collection" />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCouponType('percentage')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        couponType === 'percentage'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">Percentage</div>
                      <div className="text-sm text-gray-500">e.g., 20% off</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCouponType('fixed')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        couponType === 'fixed'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">Fixed Amount</div>
                      <div className="text-sm text-gray-500">e.g., $15 off</div>
                    </button>
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <div className="relative">
                    {couponType === 'fixed' && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                    )}
                    <Input
                      type="number"
                      placeholder={couponType === 'percentage' ? '20' : '15'}
                      className={couponType === 'fixed' ? 'pl-7' : ''}
                    />
                    {couponType === 'percentage' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    )}
                  </div>
                </div>

                {/* Min Purchase & Usage Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Purchase
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input type="number" placeholder="0" className="pl-7" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Leave blank for no minimum.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Total Uses
                    </label>
                    <Input type="number" placeholder="Unlimited" />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Leave blank for unlimited.
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input type="date" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <Input type="date" />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Leave blank for no expiration.
                    </p>
                  </div>
                </div>

                {/* Max Uses Per Customer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Uses Per Customer
                  </label>
                  <Input type="number" placeholder="1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Leave blank for unlimited per customer.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Create Coupon
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
