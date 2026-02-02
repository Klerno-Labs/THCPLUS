import { prisma } from '@/lib/db'
import { Card } from '@/app/components/ui/card'
import { Mail, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { DashboardStats } from '@/app/components/admin/dashboard-stats'
import { AnalyticsChartsWrapper } from '@/app/components/admin/analytics-charts-wrapper'

// Force dynamic rendering (requires database at runtime)
export const dynamic = 'force-dynamic'

/**
 * Admin Dashboard Home Page
 *
 * Displays key metrics and recent activity:
 * - Total submissions count
 * - Today's submissions
 * - Pending/read status counts
 * - Recent submissions table
 */
export default async function AdminDashboardPage() {
  // Fetch statistics
  const [totalSubmissions, todaySubmissions, newSubmissions, recentSubmissions] = await Promise.all(
    [
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({
        where: {
          submittedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.contactSubmission.count({
        where: { status: 'new' },
      }),
      prisma.contactSubmission.findMany({
        take: 10,
        orderBy: { submittedAt: 'desc' },
      }),
    ]
  )

  const stats = [
    {
      name: 'Total Submissions',
      value: totalSubmissions,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: "Today's Submissions",
      value: todaySubmissions,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'New (Unread)',
      value: newSubmissions,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Read',
      value: totalSubmissions - newSubmissions,
      icon: CheckCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ]

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Enhanced Stats */}
      <DashboardStats />

      {/* Analytics Charts */}
      <AnalyticsChartsWrapper />

      {/* Contact Form Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Form Submissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.name} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Submissions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
          <Link
            href="/admin/submissions"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Message
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{submission.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{submission.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {submission.message}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          submission.status === 'new'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'read'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
