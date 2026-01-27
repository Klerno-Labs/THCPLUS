import { prisma } from '@/lib/db'
import { Card } from '@/app/components/ui/card'
import { SubmissionsTable } from '@/app/components/admin/submissions-table'

// Force dynamic rendering (requires database at runtime)
export const dynamic = 'force-dynamic'

/**
 * Admin Submissions Management Page
 *
 * Displays all contact form submissions with:
 * - Search and filter capabilities
 * - Status management (new, read, replied)
 * - Pagination
 * - Export to CSV
 */
export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const status = searchParams.status || 'all'
  const search = searchParams.search || ''
  const pageSize = 20

  // Build where clause for filtering
  const where: Record<string, unknown> = {}
  if (status !== 'all') {
    where.status = status
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Fetch submissions with pagination
  const [submissions, totalCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactSubmission.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  // Calculate status counts for filter buttons
  const [newCount, readCount, repliedCount] = await Promise.all([
    prisma.contactSubmission.count({ where: { status: 'new' } }),
    prisma.contactSubmission.count({ where: { status: 'read' } }),
    prisma.contactSubmission.count({ where: { status: 'replied' } }),
  ])

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-1">
          Manage and respond to customer inquiries from the contact form.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <a
          href="/admin/submissions?status=all"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            status === 'all'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          All ({totalCount})
        </a>
        <a
          href="/admin/submissions?status=new"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            status === 'new'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          New ({newCount})
        </a>
        <a
          href="/admin/submissions?status=read"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            status === 'read'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          Read ({readCount})
        </a>
        <a
          href="/admin/submissions?status=replied"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            status === 'replied'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          Replied ({repliedCount})
        </a>
      </div>

      {/* Submissions Table */}
      <Card className="p-6">
        <SubmissionsTable
          submissions={submissions}
          currentPage={page}
          totalPages={totalPages}
          status={status}
          search={search}
        />
      </Card>
    </div>
  )
}
