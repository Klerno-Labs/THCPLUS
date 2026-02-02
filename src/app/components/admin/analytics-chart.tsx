'use client'

import { Card } from '@/app/components/ui/card'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface VisitorTrendData {
  date: string
  visitors: number
  submissions: number
}

interface CouponPerformanceData {
  name: string
  redemptions: number
  savings: number
}

interface VisitorTrendsChartProps {
  data: VisitorTrendData[]
}

interface CouponPerformanceChartProps {
  data: CouponPerformanceData[]
}

export function VisitorTrendsChart({ data }: VisitorTrendsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Visitor Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Daily visitors and form submissions</p>
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No visitor data available yet
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Visitor Trends</h3>
        <p className="text-sm text-gray-500 mt-1">Daily visitors and form submissions</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorVisitors)"
            name="Visitors"
          />
          <Area
            type="monotone"
            dataKey="submissions"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorSubmissions)"
            name="Submissions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function CouponPerformanceChart({ data }: CouponPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Coupon Performance</h3>
          <p className="text-sm text-gray-500 mt-1">Top performing coupons this month</p>
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No coupon redemptions this month
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Coupon Performance</h3>
        <p className="text-sm text-gray-500 mt-1">Top performing coupons this month</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="redemptions" fill="#10b981" name="Redemptions" radius={[8, 8, 0, 0]} />
          <Bar dataKey="savings" fill="#3b82f6" name="Customer Savings ($)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
