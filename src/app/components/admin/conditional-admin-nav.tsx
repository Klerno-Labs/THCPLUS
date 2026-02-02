'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from './admin-nav'

/**
 * Conditional Admin Navigation
 * Shows the admin navigation only when NOT on the login page
 */
export function ConditionalAdminNav() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Don't render navigation on login page
  if (isLoginPage) {
    return null
  }

  return <AdminNav />
}
