'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * Client-side Providers
 *
 * Wraps the app with client-side providers like NextAuth SessionProvider.
 * Must be a client component to use React Context.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
