import { Card } from '@/app/components/ui/card'
import { Percent, TrendingUp, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/db'

export async function CouponStats() {
  const [activeCoupons, totalRedemptions, totalSavingsData] = await Promise.all([
    prisma.coupon.count({
      where: { isActive: true },
    }),
    prisma.couponRedemption.count(),
    prisma.couponRedemption.aggregate({
      _sum: {
        discountAmount: true,
      },
    }),
  ])

  const totalSavings = totalSavingsData._sum.discountAmount || 0

  const stats = [
    {
      name: 'Active Coupons',
      value: activeCoupons,
      icon: Percent,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      name: 'Total Redemptions',
      value: totalRedemptions,
      icon: TrendingUp,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Customer Savings',
      value: `$${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
