'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { createCoupon } from '@/app/actions/coupon'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only')
    .transform((val) => val.toUpperCase()),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().positive('Value must be positive'),
  minPurchase: z.coerce.number().nonnegative().optional().or(z.literal('')),
  maxUses: z.coerce.number().positive().int().optional().or(z.literal('')),
  maxUsesPerCustomer: z.coerce.number().positive().int().optional().or(z.literal('')),
  startsAt: z.string().min(1, 'Start date is required'),
  expiresAt: z.string().optional().or(z.literal('')),
})

type CreateCouponFormData = z.infer<typeof createCouponSchema>

interface CreateCouponDialogProps {
  children: React.ReactNode
}

export function CreateCouponDialog({ children }: CreateCouponDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      type: 'percentage',
      startsAt: new Date().toISOString().split('T')[0],
    },
  })

  const handleTypeChange = (type: 'percentage' | 'fixed') => {
    setCouponType(type)
    setValue('type', type)
  }

  const onSubmit = async (data: CreateCouponFormData) => {
    setIsSubmitting(true)

    try {
      const result = await createCoupon({
        code: data.code,
        description: data.description,
        type: data.type,
        value: Number(data.value),
        minPurchase: data.minPurchase ? Number(data.minPurchase) : undefined,
        maxUses: data.maxUses ? Number(data.maxUses) : undefined,
        maxUsesPerCustomer: data.maxUsesPerCustomer
          ? Number(data.maxUsesPerCustomer)
          : undefined,
        startsAt: data.startsAt,
        expiresAt: data.expiresAt || undefined,
      })

      if (result.success) {
        toast.success(result.message || 'Coupon created successfully!')
        reset()
        setIsOpen(false)
        router.refresh() // Refresh to show new coupon
      } else {
        toast.error(result.error || 'Failed to create coupon')
      }
    } catch (error) {
      console.error('Coupon creation error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <Input
                    type="text"
                    {...register('code')}
                    placeholder="e.g., SUMMER25"
                    className="font-mono uppercase"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Use uppercase letters and numbers. No spaces.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Input
                    type="text"
                    {...register('description')}
                    placeholder="e.g., 25% off summer collection"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <input type="hidden" {...register('type')} />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('percentage')}
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
                      onClick={() => handleTypeChange('fixed')}
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
                      step="0.01"
                      {...register('value')}
                      placeholder={couponType === 'percentage' ? '20' : '15'}
                      className={couponType === 'fixed' ? 'pl-7' : ''}
                    />
                    {couponType === 'percentage' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    )}
                  </div>
                  {errors.value && (
                    <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                  )}
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
                      <Input
                        type="number"
                        step="0.01"
                        {...register('minPurchase')}
                        placeholder="0"
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Leave blank for no minimum.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Total Uses
                    </label>
                    <Input type="number" {...register('maxUses')} placeholder="Unlimited" />
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
                    <Input type="date" {...register('startsAt')} />
                    {errors.startsAt && (
                      <p className="text-red-500 text-sm mt-1">{errors.startsAt.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <Input type="date" {...register('expiresAt')} />
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
                  <Input
                    type="number"
                    {...register('maxUsesPerCustomer')}
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Leave blank for unlimited per customer.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Coupon'
                    )}
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
