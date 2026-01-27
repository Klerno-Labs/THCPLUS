import { prisma } from '@/lib/db'
import { Card } from '@/app/components/ui/card'
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'

// Force dynamic rendering (requires database at runtime)
export const dynamic = 'force-dynamic'

/**
 * Admin Analytics Page
 *
 * Displays analytics and insights:
 * - Submissions over time (daily, weekly, monthly)
 * - Age verification stats
 * - Response times
 * - Popular inquiry topics
 */
export default async function AdminAnalyticsPage() {
  // Get date ranges
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const today = new Date(now.setHours(0, 0, 0, 0))

  // Fetch submission statistics
  const [
    totalSubmissions,
    submissionsToday,
    submissionsLast7Days,
    submissionsLast30Days,
    averageResponseTime,
    totalAgeVerifications,
    ageVerificationsLast30Days,
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({
      where: { submittedAt: { gte: today } },
    }),
    prisma.contactSubmission.count({
      where: { submittedAt: { gte: last7Days } },
    }),
    prisma.contactSubmission.count({
      where: { submittedAt: { gte: last30Days } },
    }),
    // Calculate average response time (replied - submitted)
    prisma.contactSubmission.findMany({
      where: {
        status: 'replied',
        repliedAt: { not: null },
      },
      select: {
        submittedAt: true,
        repliedAt: true,
      },
    }),
    prisma.ageVerification.count(),
    prisma.ageVerification.count({
      where: { verifiedAt: { gte: last30Days } },
    }),
  ])

  // Calculate average response time in hours
  const responseTimes = averageResponseTime
    .filter((s) => s.repliedAt)
    .map((s) => {
      const submitted = new Date(s.submittedAt).getTime()
      const replied = new Date(s.repliedAt!).getTime()
      return (replied - submitted) / (1000 * 60 * 60) // Convert to hours
    })

  const avgResponseTime =
    responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0

  // Get submissions by day for the last 30 days
  const submissionsByDay = await prisma.$queryRaw<{ date: Date; count: number }[]>`
    SELECT
      DATE(submitted_at) as date,
      COUNT(*)::int as count
    FROM contact_submissions
    WHERE submitted_at >= ${last30Days}
    GROUP BY DATE(submitted_at)
    ORDER BY date DESC
  `

  const stats = [
    {
      name: 'Total Submissions',
      value: totalSubmissions,
      change: `+${submissionsLast30Days} this month`,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'This Week',
      value: submissionsLast7Days,
      change: `${submissionsToday} today`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Avg Response Time',
      value: avgResponseTime > 0 ? `${Math.round(avgResponseTime)}h` : 'N/A',
      change: responseTimes.length > 0 ? `${responseTimes.length} replied` : 'No replies yet',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Age Verifications',
      value: totalAgeVerifications,
      change: `+${ageVerificationsLast30Days} this month`,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track submissions, response times, and visitor engagement.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Submissions Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Submissions - Last 30 Days</h2>
        {submissionsByDay.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No data available</div>
        ) : (
          <div className="space-y-2">
            {submissionsByDay.slice(0, 14).map((day) => (
              <div key={day.date.toString()} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="h-8 bg-primary-500 rounded"
                    style={{
                      width: `${(day.count / Math.max(...submissionsByDay.map((d) => d.count))) * 100}%`,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Status Breakdown</h3>
          <div className="space-y-3">
            {[
              {
                label: 'New (Unread)',
                count: await prisma.contactSubmission.count({ where: { status: 'new' } }),
                color: 'bg-yellow-500',
              },
              {
                label: 'Read',
                count: await prisma.contactSubmission.count({ where: { status: 'read' } }),
                color: 'bg-gray-500',
              },
              {
                label: 'Replied',
                count: await prisma.contactSubmission.count({ where: { status: 'replied' } }),
                color: 'bg-green-500',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Submissions today</span>
              <span className="font-semibold text-gray-900">{submissionsToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Submissions this week</span>
              <span className="font-semibold text-gray-900">{submissionsLast7Days}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Age verifications today</span>
              <span className="font-semibold text-gray-900">
                {await prisma.ageVerification.count({ where: { verifiedAt: { gte: today } } })}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
