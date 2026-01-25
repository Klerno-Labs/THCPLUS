/**
 * NextAuth.js API Route Handler
 *
 * Handles all authentication-related API requests.
 * Auto-configured by NextAuth.js based on auth configuration.
 *
 * @see https://authjs.dev/getting-started/installation
 */

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
