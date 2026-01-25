'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Search, Download, Eye, Trash2, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { toast } from 'sonner'

type Submission = {
  id: string
  name: string
  email: string
  message: string
  submittedAt: Date
  status: string
  ipAddress: string
  userAgent: string
}

interface SubmissionsTableProps {
  submissions: Submission[]
  currentPage: number
  totalPages: number
  status: string
  search: string
}

export function SubmissionsTable({
  submissions,
  currentPage,
  totalPages,
  status,
  search: initialSearch,
}: SubmissionsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (search) params.set('search', search)
    router.push(`/admin/submissions?${params.toString()}`)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/submissions/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast.success('Status updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Message', 'Submitted At', 'Status']
    const rows = submissions.map((s) => [
      s.name,
      s.email,
      s.message.replace(/,/g, ';').replace(/\n/g, ' '),
      new Date(s.submittedAt).toLocaleString(),
      s.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()

    toast.success('CSV exported successfully')
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No submissions found</p>
        {(search || status !== 'all') && (
          <Button
            variant="outline"
            onClick={() => router.push('/admin/submissions')}
            className="mt-4"
          >
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Message</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{submission.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {submission.email}
                  </a>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-md">
                  <div className="truncate">{submission.message}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
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
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {submission.status === 'new' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(submission.id, 'read')}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {currentPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams()
                params.set('page', (currentPage - 1).toString())
                if (status !== 'all') params.set('status', status)
                if (search) params.set('search', search)
                router.push(`/admin/submissions?${params.toString()}`)
              }}
            >
              Previous
            </Button>
          )}

          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams()
                params.set('page', (currentPage + 1).toString())
                if (status !== 'all') params.set('status', status)
                if (search) params.set('search', search)
                router.push(`/admin/submissions?${params.toString()}`)
              }}
            >
              Next
            </Button>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submission Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <p className="text-gray-900">{selectedSubmission.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <p className="text-gray-900">
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Submitted</label>
                  <p className="text-gray-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedSubmission.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedSubmission.status === 'read'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
                {selectedSubmission.status !== 'replied' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(
                        selectedSubmission.id,
                        selectedSubmission.status === 'new' ? 'read' : 'replied'
                      )
                      setSelectedSubmission(null)
                    }}
                  >
                    Mark as {selectedSubmission.status === 'new' ? 'Read' : 'Replied'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
