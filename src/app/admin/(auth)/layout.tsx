/**
 * Auth Layout
 *
 * Simple passthrough layout for authentication pages (login).
 * No sidebar navigation on auth pages.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
