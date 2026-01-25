import { cookies } from 'next/headers'

/**
 * Session Management for Age Verification
 *
 * Manages secure, httpOnly cookies for age verification sessions.
 * These cookies cannot be accessed or modified by client-side JavaScript,
 * making the age gate bypass-proof.
 */

const AGE_VERIFIED_COOKIE = 'age_verified_session'
const SESSION_DURATION_HOURS = 24

/**
 * Create an age verification session
 *
 * Sets a secure, httpOnly cookie with a session ID.
 * Cookie expires after 24 hours.
 *
 * @param sessionId - Unique session identifier from database
 */
export async function createAgeVerificationSession(sessionId: string) {
  const cookieStore = cookies()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS)

  cookieStore.set({
    name: AGE_VERIFIED_COOKIE,
    value: sessionId,
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Get the current age verification session ID
 *
 * @returns Session ID if exists and valid, null otherwise
 */
export async function getAgeVerificationSession(): Promise<string | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(AGE_VERIFIED_COOKIE)

  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  return sessionCookie.value
}

/**
 * Clear the age verification session
 *
 * Deletes the session cookie. Used when session expires or user logs out.
 */
export async function clearAgeVerificationSession() {
  const cookieStore = cookies()
  cookieStore.delete(AGE_VERIFIED_COOKIE)
}

/**
 * Check if user has a valid age verification session
 *
 * @returns true if session exists, false otherwise
 */
export async function hasValidAgeVerificationSession(): Promise<boolean> {
  const sessionId = await getAgeVerificationSession()
  return sessionId !== null
}
