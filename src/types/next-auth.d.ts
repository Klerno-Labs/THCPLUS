/**
 * NextAuth.js Type Definitions
 *
 * Extends default NextAuth types to include custom user properties.
 * Adds user ID to session and JWT token.
 */

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
