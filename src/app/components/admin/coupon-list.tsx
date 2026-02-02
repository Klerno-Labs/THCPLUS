import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { QrCode, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { getCoupons } from '@/app/actions/coupon'
import { CopyCodeButton } from './copy-code-button'

export async function CouponList() {
  const coupons = await getCoupons()

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No coupons found. Create your first coupon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {coupons.map((coupon) => (
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
                    {format(new Date(coupon.startsAt), 'MMM d, yyyy')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'MMM d, yyyy') : 'Never'}
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
              <CopyCodeButton code={coupon.code} />

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
      ))}
    </div>
  )
}
