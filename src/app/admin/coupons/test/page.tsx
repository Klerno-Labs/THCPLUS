import { Card } from '@/app/components/ui/card'
import { TestCouponForm } from '@/app/components/admin/test-coupon-form'
import { ArrowLeft, TestTube2 } from 'lucide-react'
import Link from 'next/link'

/**
 * Coupon Testing Page
 *
 * Test coupon validation and redemption before going live.
 * Simulates the in-store checkout process.
 */
export default function CouponTestPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/coupons"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Coupons
      </Link>

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <TestTube2 className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Test Coupons</h1>
        </div>
        <p className="text-gray-600">
          Simulate the checkout process to test coupon validation and redemption.
        </p>
      </div>

      {/* Testing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Testing Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <TestCouponForm />
          </Card>
        </div>

        {/* Help & Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">How to Test</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <span>Enter a coupon code you want to test</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <span>Enter a sample order total</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <span>Click &quot;Validate&quot; to test without redeeming</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <span>Click &quot;Redeem&quot; to test full redemption flow</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Validation Checks</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Coupon code exists
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Currently active
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Not expired
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Valid date range
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Usage limits not exceeded
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Minimum purchase met
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">💡 Testing Tip</h3>
            <p className="text-sm text-blue-800">
              Use &quot;Validate&quot; to test repeatedly without affecting redemption counts. Use
              &quot;Redeem&quot; when you want to test the full flow including database updates.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
