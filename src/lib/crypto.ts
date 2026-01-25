import { createHash } from 'crypto'

/**
 * Cryptographic utilities for privacy and security
 *
 * Used for hashing IP addresses and other sensitive data
 * before storing in the database for compliance and privacy.
 */

/**
 * Hash an IP address using SHA-256
 *
 * @param ipAddress - IP address to hash
 * @returns Hashed IP address (64 character hex string)
 *
 * @example
 * const hashedIp = hashIpAddress('192.168.1.1')
 * // Returns: "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
 */
export function hashIpAddress(ipAddress: string): string {
  return createHash('sha256').update(ipAddress).digest('hex')
}

/**
 * Generate a secure session ID
 *
 * @returns Cryptographically secure random string (32 characters)
 */
export function generateSessionId(): string {
  // Use Web Crypto API for cryptographically secure random values
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for Node.js environment
  const { randomBytes } = require('crypto')
  return randomBytes(16).toString('hex')
}
