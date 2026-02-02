import { prisma } from '@/lib/db'
import { Card } from '@/app/components/ui/card'
import { Shield, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering (requires database at runtime)
export const dynamic = 'force-dynamic'

/**
 * Admin Compliance Page
 *
 * Displays age verification logs for legal compliance:
 * - All verification attempts with timestamps
 * - IP addresses (hashed for privacy)
 * - User agent information
 * - Export capabilities for legal records
 */
export default async function AdminCompliancePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const pageSize = 50

  // Fetch age verification logs
  const [verifications, totalCount] = await Promise.all([
    prisma.ageVerification.findMany({
      orderBy: { verifiedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.ageVerification.count(),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  // Calculate statistics
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const stats = {
    total: totalCount,
    last30Days: await prisma.ageVerification.count({
      where: { verifiedAt: { gte: last30Days } },
    }),
    last7Days: await prisma.ageVerification.count({
      where: { verifiedAt: { gte: last7Days } },
    }),
    today: await prisma.ageVerification.count({
      where: { verifiedAt: { gte: new Date(now.setHours(0, 0, 0, 0)) } },
    }),
  }

  return (
    <div className="pt-8 px-6 pb-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance Logs</h1>
        <p className="text-gray-600 mt-1">Age verification records for legal compliance.</p>
      </div>

      {/* Compliance Notice */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Legal Compliance Information</h3>
            <p className="text-sm text-blue-800 mb-2">
              These logs serve as legal proof of age verification for all website visitors. Records
              are retained for 2 years as required by law.
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ All IP addresses are hashed (SHA-256) for privacy protection</li>
              <li>✓ Sessions expire after 24 hours</li>
              <li>✓ Logs include timestamp, user agent, and session ID</li>
              <li>✓ Export capability for legal audits</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Verifications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.today}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.last7Days}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.last30Days}</p>
        </Card>
      </div>

      {/* Verification Logs Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Verification Logs</h2>
          <a
            href="/api/admin/compliance/export"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export All Logs
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Session ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  IP Hash (Privacy Protected)
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  User Agent
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Verified At
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Expires At
                </th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verification) => (
                <tr key={verification.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">
                    {verification.sessionId.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">
                    {verification.ipAddress.slice(0, 16)}...
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                    {verification.userAgent}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(verification.verifiedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(verification.expiresAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {page > 1 && (
              <Link
                href={`/admin/compliance?page=${page - 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            )}

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            {page < totalPages && (
              <Link
                href={`/admin/compliance?page=${page + 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
