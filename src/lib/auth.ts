/**
 * NextAuth.js Configuration
 *
 * Configures authentication for the admin dashboard using credentials-based login.
 * Verifies admin users against the database with bcrypt password hashing.
 *
 * @see https://authjs.dev/getting-started/installation
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

/**
 * Login credentials schema
 */
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

/**
 * NextAuth configuration
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)

          // Find admin user in database
          const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!admin) {
            return null // User not found
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, admin.passwordHash)

          if (!isValidPassword) {
            return null // Invalid password
          }

          // Update last login timestamp
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          })

          // Return user object (will be stored in session)
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token on sign in
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

/**
 * Get current authenticated user
 *
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

/**
 * Require authentication (throw if not authenticated)
 *
 * @throws Redirect to login page if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized - please login')
  }
  return user
}
