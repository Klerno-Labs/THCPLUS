/**
 * Auth Layout
 *
 * Minimal layout for authentication pages (age verification, etc.)
 * Does not include header/footer, allowing full-screen experience
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
