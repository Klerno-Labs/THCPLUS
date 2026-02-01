'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { QrCode, Copy, Edit, Trash2, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// TODO: Replace with real data from API
const mockCoupons = [
  {
    id: '1',
    code: 'WINTER20',
    description: '20% off all winter products',
    type: 'percentage',
    value: 20,
    minPurchase: 25,
    maxUses: 100,
    usesCount: 45,
    maxUsesPerCustomer: 1,
    startsAt: new Date('2024-01-01'),
    expiresAt: new Date('2024-02-28'),
    isActive: true,
  },
  {
    id: '2',
    code: 'NEWCUST',
    description: '$15 off for first-time customers',
    type: 'fixed',
    value: 15,
    minPurchase: 50,
    maxUses: 50,
    usesCount: 38,
    maxUsesPerCustomer: 1,
    startsAt: new Date('2024-01-01'),
    expiresAt: null,
    isActive: true,
  },
  {
    id: '3',
    code: 'BUNDLE15',
    description: '15% off when you buy 3+ items',
    type: 'percentage',
    value: 15,
    minPurchase: null,
    maxUses: null,
    usesCount: 32,
    maxUsesPerCustomer: null,
    startsAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-12-31'),
    isActive: true,
  },
]

export function CouponList() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Copied coupon code: ${code}`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-4">
      {mockCoupons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No coupons found. Create your first coupon!</p>
        </div>
      ) : (
        mockCoupons.map((coupon) => (
          <Card key={coupon.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              {/* Coupon Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{coupon.code}</h3>
                  {coupon.isActive ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {coupon.type === 'percentage' ? (
                    <Badge variant="outline">{coupon.value}% Off</Badge>
                  ) : (
                    <Badge variant="outline">${coupon.value} Off</Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{coupon.description}</p>

                {/* Coupon Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Redemptions</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {coupon.usesCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Min. Purchase</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {coupon.minPurchase ? `$${coupon.minPurchase}` : 'None'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Starts</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {format(coupon.startsAt, 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Expires</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {coupon.expiresAt ? format(coupon.expiresAt, 'MMM d, yyyy') : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {coupon.maxUses && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Usage</span>
                      <span>{Math.round((coupon.usesCount / coupon.maxUses) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((coupon.usesCount / coupon.maxUses) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCode(coupon.code)}
                  className="flex items-center gap-2"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>

                <Button variant="outline" size="sm">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>

                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>

                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
