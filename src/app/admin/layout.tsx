/**
 * Admin Dashboard Layout
 *
 * Simple passthrough layout for admin routes.
 * Authentication is handled by individual pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
