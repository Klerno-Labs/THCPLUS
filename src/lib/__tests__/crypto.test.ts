import { describe, it, expect } from 'vitest'
import { hashIpAddress, generateSessionId } from '../crypto'

describe('Crypto utilities', () => {
  describe('hashIpAddress', () => {
    it('should hash IP address using SHA-256', () => {
      const ipAddress = '192.168.1.1'
      const hashed = hashIpAddress(ipAddress)

      // SHA-256 produces 64 character hex string
      expect(hashed).toHaveLength(64)
      expect(hashed).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should produce consistent hashes for same IP', () => {
      const ipAddress = '192.168.1.1'
      const hash1 = hashIpAddress(ipAddress)
      const hash2 = hashIpAddress(ipAddress)

      expect(hash1).toBe(hash2)
    })

    it('should produce different hashes for different IPs', () => {
      const hash1 = hashIpAddress('192.168.1.1')
      const hash2 = hashIpAddress('192.168.1.2')

      expect(hash1).not.toBe(hash2)
    })

    it('should handle IPv6 addresses', () => {
      const ipv6 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      const hashed = hashIpAddress(ipv6)

      expect(hashed).toHaveLength(64)
      expect(hashed).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should handle empty string', () => {
      const hashed = hashIpAddress('')

      expect(hashed).toHaveLength(64)
      expect(hashed).toMatch(/^[a-f0-9]{64}$/)
    })
  })

  describe('generateSessionId', () => {
    it('should generate a valid session ID', () => {
      const sessionId = generateSessionId()

      expect(sessionId).toBeDefined()
      expect(typeof sessionId).toBe('string')
      expect(sessionId.length).toBeGreaterThan(0)
    })

    it('should generate unique session IDs', () => {
      const id1 = generateSessionId()
      const id2 = generateSessionId()

      expect(id1).not.toBe(id2)
    })

    it('should generate session IDs in UUID or hex format', () => {
      const sessionId = generateSessionId()

      // Should match either UUID format or 32-character hex string
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)
      const isHex = /^[0-9a-f]{32}$/i.test(sessionId)

      expect(isUUID || isHex).toBe(true)
    })

    it('should generate multiple unique IDs', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateSessionId())
      }

      // All 100 IDs should be unique
      expect(ids.size).toBe(100)
    })
  })
})
