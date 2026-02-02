import { Suspense } from 'react'
import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Plus } from 'lucide-react'
import { CouponList } from '@/app/components/admin/coupon-list'
import { CreateCouponDialog } from '@/app/components/admin/create-coupon-dialog'
import { CouponStats } from '@/app/components/admin/coupon-stats'
import Link from 'next/link'

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
    <div className="pt-8 px-6 pb-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">
            Create and manage promotional coupons for your store.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/coupons/test">
            <Button variant="outline">Test Coupons</Button>
          </Link>
          <CreateCouponDialog>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </CreateCouponDialog>
        </div>
      </div>

      {/* Quick Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <CouponStats />
      </Suspense>

      {/* Coupon List */}
      <Card className="p-6">
        <Suspense fallback={<div>Loading coupons...</div>}>
          <CouponList />
        </Suspense>
      </Card>
    </div>
  )
}
