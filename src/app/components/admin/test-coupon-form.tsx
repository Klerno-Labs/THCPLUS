'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { validateCoupon, redeemCoupon } from '@/app/actions/coupon'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface TestCouponFormData {
  code: string
  orderTotal: number
  customerEmail?: string
  customerPhone?: string
}

const testCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  orderTotal: z.coerce.number().min(0.01, 'Order total must be greater than 0'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  customerPhone: z.string().optional(),
})

type ValidationResult = {
  isValid: boolean
  discountAmount: number
  finalTotal: number
  message?: string
  coupon?: {
    code: string
    description: string
    type: string
    value: number
  }
}

export function TestCouponForm() {
  const [isValidating, setIsValidating] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TestCouponFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(testCouponSchema) as any,
  })

  const orderTotal = watch('orderTotal')

  const onValidate = async (data: TestCouponFormData) => {
    setIsValidating(true)
    setError(null)
    setResult(null)

    try {
      const response = await validateCoupon({
        code: data.code,
        orderTotal: Number(data.orderTotal),
        customerEmail: data.customerEmail || undefined,
        customerPhone: data.customerPhone || undefined,
      })

      if (response.success && response.data) {
        setResult({
          ...response.data,
          message: response.message,
        })
      } else {
        setError('Validation failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsValidating(false)
    }
  }

  const onRedeem = async (data: TestCouponFormData) => {
    setIsRedeeming(true)
    setError(null)
    setResult(null)

    try {
      const response = await redeemCoupon({
        code: data.code,
        orderTotal: Number(data.orderTotal),
        customerEmail: data.customerEmail || undefined,
        customerPhone: data.customerPhone || undefined,
      })

      if (response.success) {
        setResult({
          isValid: true,
          discountAmount: 0,
          finalTotal: Number(data.orderTotal),
          message: response.message,
        })
      } else {
        setError(response.error || 'Redemption failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
          <Input
            type="text"
            {...register('code')}
            placeholder="Enter coupon code (e.g., WINTER20)"
            className="font-mono uppercase"
          />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
        </div>

        {/* Order Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Total *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              step="0.01"
              {...register('orderTotal')}
              placeholder="0.00"
              className="pl-7"
            />
          </div>
          {errors.orderTotal && (
            <p className="text-red-500 text-sm mt-1">{errors.orderTotal.message}</p>
          )}
        </div>

        {/* Customer Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Email (Optional)
          </label>
          <Input type="email" {...register('customerEmail')} placeholder="customer@example.com" />
          {errors.customerEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Used to check per-customer usage limits</p>
        </div>

        {/* Customer Phone (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Phone (Optional)
          </label>
          <Input type="tel" {...register('customerPhone')} placeholder="(555) 123-4567" />
          <p className="text-xs text-gray-500 mt-1">For tracking purposes</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleSubmit(onValidate)}
            disabled={isValidating || isRedeeming}
            variant="outline"
            className="flex-1"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate Only'
            )}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit(onRedeem)}
            disabled={isValidating || isRedeeming}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {isRedeeming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redeeming...
              </>
            ) : (
              'Redeem Coupon'
            )}
          </Button>
        </div>
      </form>

      {/* Results */}
      {(result || error) && (
        <Card
          className={`p-6 ${
            error
              ? 'bg-red-50 border-red-200'
              : result?.isValid
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {error ? (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            ) : result?.isValid ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <h3
                className={`font-bold mb-2 ${
                  error ? 'text-red-900' : result?.isValid ? 'text-emerald-900' : 'text-yellow-900'
                }`}
              >
                {error ? 'Validation Failed' : result?.isValid ? 'Valid Coupon!' : 'Invalid'}
              </h3>

              {error && <p className="text-sm text-red-800">{error}</p>}

              {result && !error && (
                <div className="space-y-3">
                  {result.message && (
                    <p
                      className={`text-sm ${result.isValid ? 'text-emerald-800' : 'text-yellow-800'}`}
                    >
                      {result.message}
                    </p>
                  )}

                  {result.isValid && result.coupon && (
                    <>
                      <div className="border-t border-emerald-200 pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Description:</span>
                          <span className="font-medium text-emerald-900">
                            {result.coupon.description}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Discount:</span>
                          <span className="font-medium text-emerald-900">
                            {result.coupon.type === 'percentage'
                              ? `${result.coupon.value}% off`
                              : `$${result.coupon.value.toFixed(2)} off`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-emerald-200 pt-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-emerald-700 mb-1">Order Total</p>
                            <p className="text-lg font-bold text-emerald-900">
                              ${orderTotal ? Number(orderTotal).toFixed(2) : '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-700 mb-1">You Save</p>
                            <p className="text-lg font-bold text-emerald-600">
                              -${result.discountAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-700 mb-1">Final Total</p>
                            <p className="text-2xl font-bold text-emerald-900">
                              ${result.finalTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
