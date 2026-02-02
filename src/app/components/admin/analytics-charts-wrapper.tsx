import { getVisitorTrends, getCouponPerformance } from '@/app/actions/analytics'
import { VisitorTrendsChart, CouponPerformanceChart } from './analytics-chart'

export async function AnalyticsChartsWrapper() {
  const [visitorData, couponData] = await Promise.all([
    getVisitorTrends(),
    getCouponPerformance(),
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <VisitorTrendsChart data={visitorData} />
      <CouponPerformanceChart data={couponData} />
    </div>
  )
}
