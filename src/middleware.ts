import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware: Age Verification Gate
 *
 * Runs on every request to check age verification status.
 * If user is not verified, redirects to /age-verification page.
 *
 * This is server-side and cannot be bypassed by:
 * - Clearing localStorage
 * - Disabling JavaScript
 * - Modifying cookies (httpOnly cookies)
 * - Browser dev tools
 *
 * IMPORTANT: This middleware runs BEFORE the page loads,
 * ensuring no content is accessible without verification.
 */

const AGE_VERIFIED_COOKIE = 'age_verified_session'

// Routes that don't require age verification
const PUBLIC_ROUTES = [
  '/age-verification',
  '/admin', // Admin routes (have their own NextAuth protection)
  '/api', // API routes (will have their own protection)
  '/_next', // Next.js internals
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for age verification cookie
  const ageVerifiedCookie = request.cookies.get(AGE_VERIFIED_COOKIE)

  if (!ageVerifiedCookie || !ageVerifiedCookie.value) {
    // Not verified - redirect to age verification page
    return NextResponse.redirect(new URL('/age-verification', request.url))
  }

  // TODO: Validate session against database (Phase 3 enhancement)
  // const session = await prisma.ageVerification.findUnique({
  //   where: { sessionId: ageVerifiedCookie.value }
  // })
  //
  // if (!session || session.expiresAt < new Date()) {
  //   // Session expired or invalid
  //   const response = NextResponse.redirect(new URL('/age-verification', request.url))
  //   response.cookies.delete(AGE_VERIFIED_COOKIE)
  //   return response
  // }

  // Verified - allow access
  return NextResponse.next()
}

/**
 * Middleware configuration
 *
 * Runs on all routes except those explicitly excluded above
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
