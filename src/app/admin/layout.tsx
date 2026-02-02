import { AdminNav } from '@/app/components/admin/admin-nav'

/**
 * Admin Dashboard Layout
 *
 * Provides consistent layout with sidebar navigation for all admin pages.
 * Authentication is handled by individual pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <AdminNav />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
