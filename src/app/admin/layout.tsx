import { AdminNav } from '@/app/components/admin/admin-nav'
import { Header } from '@/app/components/layout/header'
import { Footer } from '@/app/components/layout/footer'

/**
 * Admin Dashboard Layout
 *
 * Provides consistent layout with header, sidebar navigation, and footer for all admin pages.
 * Authentication is handled by individual pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 pt-20">
        {/* Sidebar Navigation */}
        <AdminNav />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
