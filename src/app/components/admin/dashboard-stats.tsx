import { Card } from '@/app/components/ui/card'
import { TrendingUp, TrendingDown, Users, ShoppingCart, Percent, Mail } from 'lucide-react'
import { prisma } from '@/lib/db'

interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down'
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  const isPositive = trend === 'up'

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className="bg-emerald-100 p-4 rounded-lg">{icon}</div>
      </div>
    </Card>
  )
}

export async function DashboardStats() {
  // Get real data from database
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const [
    totalVerifications,
    thisMonthVerifications,
    lastMonthVerifications,
    totalSubmissions,
    thisMonthSubmissions,
    lastMonthSubmissions,
    activeCoupons,
    lastMonthActiveCoupons,
    totalRedemptions,
  ] = await Promise.all([
    prisma.ageVerification.count(),
    prisma.ageVerification.count({
      where: { verifiedAt: { gte: thisMonthStart } },
    }),
    prisma.ageVerification.count({
      where: { verifiedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({
      where: { submittedAt: { gte: thisMonthStart } },
    }),
    prisma.contactSubmission.count({
      where: { submittedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.coupon.count({
      where: {
        isActive: true,
        createdAt: { lte: lastMonthEnd },
      },
    }),
    prisma.couponRedemption.count(),
  ])

  // Calculate percentage changes
  const visitorsChange =
    lastMonthVerifications > 0
      ? ((thisMonthVerifications - lastMonthVerifications) / lastMonthVerifications) * 100
      : 0

  const submissionsChange =
    lastMonthSubmissions > 0
      ? ((thisMonthSubmissions - lastMonthSubmissions) / lastMonthSubmissions) * 100
      : 0

  const couponsChange =
    lastMonthActiveCoupons > 0
      ? ((activeCoupons - lastMonthActiveCoupons) / lastMonthActiveCoupons) * 100
      : 0

  const visitorsTrend: 'up' | 'down' = visitorsChange >= 0 ? 'up' : 'down'
  const submissionsTrend: 'up' | 'down' = submissionsChange >= 0 ? 'up' : 'down'
  const couponsTrend: 'up' | 'down' = couponsChange >= 0 ? 'up' : 'down'

  const stats = [
    {
      title: 'Total Visitors',
      value: totalVerifications.toLocaleString(),
      change: Number(visitorsChange.toFixed(1)),
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      trend: visitorsTrend,
    },
    {
      title: 'Contact Forms',
      value: totalSubmissions.toLocaleString(),
      change: Number(submissionsChange.toFixed(1)),
      icon: <Mail className="w-6 h-6 text-emerald-600" />,
      trend: submissionsTrend,
    },
    {
      title: 'Active Coupons',
      value: activeCoupons.toString(),
      change: Number(couponsChange.toFixed(1)),
      icon: <Percent className="w-6 h-6 text-emerald-600" />,
      trend: couponsTrend,
    },
    {
      title: 'Total Redemptions',
      value: totalRedemptions.toLocaleString(),
      change: 0, // Will need historical data for accurate change
      icon: <ShoppingCart className="w-6 h-6 text-emerald-600" />,
      trend: 'up' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
