import { Suspense } from 'react'
import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Plus, Percent, TrendingUp } from 'lucide-react'
import { CouponList } from '@/app/components/admin/coupon-list'
import { CreateCouponDialog } from '@/app/components/admin/create-coupon-dialog'

/**
 * Admin Coupons Page
 *
 * Manage promotional coupons for in-store use:
 * - Create new coupons with QR codes
 * - Track redemptions and performance
 * - Set expiration dates and usage limits
 * - View analytics on coupon effectiveness
 */
export default async function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">
            Create and manage promotional coupons for your store.
          </p>
        </div>
        <CreateCouponDialog>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </CreateCouponDialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Coupons</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Percent className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">165</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Savings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$3,292</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Coupon List */}
      <Card className="p-6">
        <Suspense fallback={<div>Loading coupons...</div>}>
          <CouponList />
        </Suspense>
      </Card>
    </div>
  )
}
