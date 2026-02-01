'use client'

import { Card } from '@/app/components/ui/card'
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Percent } from 'lucide-react'

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

export function DashboardStats() {
  // TODO: Replace with real data from API
  const stats = [
    {
      title: 'Total Visitors',
      value: '2,847',
      change: 12.5,
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Contact Forms',
      value: '142',
      change: 8.2,
      icon: <ShoppingCart className="w-6 h-6 text-emerald-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Active Coupons',
      value: '8',
      change: 3.1,
      icon: <Percent className="w-6 h-6 text-emerald-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Avg. Engagement',
      value: '3.2 min',
      change: -2.4,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      trend: 'down' as const,
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
