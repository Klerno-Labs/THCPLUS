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

// Sample data - replace with real data from API
const visitorData = [
  { date: 'Jan 1', visitors: 120, submissions: 8 },
  { date: 'Jan 5', visitors: 150, submissions: 12 },
  { date: 'Jan 10', visitors: 180, submissions: 15 },
  { date: 'Jan 15', visitors: 220, submissions: 18 },
  { date: 'Jan 20', visitors: 250, submissions: 22 },
  { date: 'Jan 25', visitors: 200, submissions: 16 },
  { date: 'Jan 30', visitors: 280, submissions: 25 },
]

const couponData = [
  { name: 'WINTER20', redemptions: 45, savings: 892 },
  { name: 'NEWCUST', redemptions: 38, savings: 760 },
  { name: 'BUNDLE15', redemptions: 32, savings: 640 },
  { name: 'FLASH25', redemptions: 28, savings: 560 },
  { name: 'VIP30', redemptions: 22, savings: 440 },
]

export function VisitorTrendsChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Visitor Trends</h3>
        <p className="text-sm text-gray-500 mt-1">Daily visitors and form submissions</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={visitorData}>
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

export function CouponPerformanceChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Coupon Performance</h3>
        <p className="text-sm text-gray-500 mt-1">Top performing coupons this month</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={couponData}>
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
