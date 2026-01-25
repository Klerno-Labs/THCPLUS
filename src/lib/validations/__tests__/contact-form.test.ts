import { describe, it, expect } from 'vitest'
import { contactFormSchema } from '../contact-form'
import type { ContactFormData } from '../contact-form'

describe('contactFormSchema', () => {
  describe('valid inputs', () => {
    it('should accept valid contact form data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message with sufficient length.',
      }

      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should trim whitespace from all fields', () => {
      const data = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  Valid message with spaces  ',
      }

      const result = contactFormSchema.parse(data)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
      expect(result.message).toBe('Valid message with spaces')
    })

    it('should convert email to lowercase', () => {
      const data = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        message: 'Valid message here',
      }

      const result = contactFormSchema.parse(data)
      expect(result.email).toBe('john@example.com')
    })

    it('should accept name at minimum length (2 characters)', () => {
      const data = {
        name: 'Jo',
        email: 'jo@example.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept message at minimum length (10 characters)', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Ten chars.',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('should reject name that is too short', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('should reject name that is too long', () => {
      const data = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 100 characters')
      }
    })

    it('should reject invalid email format', () => {
      const data = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email')
      }
    })

    it('should reject email without @', () => {
      const data = {
        name: 'John Doe',
        email: 'johnexample.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject message that is too short', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters')
      }
    })

    it('should reject message that is too long', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'A'.repeat(1001),
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 1000 characters')
      }
    })

    it('should reject missing fields', () => {
      const data = {
        name: 'John Doe',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('should reject empty strings', () => {
      const data = {
        name: '',
        email: '',
        message: '',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(3)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in name', () => {
      const data = {
        name: "O'Brien-Smith Jr.",
        email: 'obrien@example.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle international email addresses', () => {
      const data = {
        name: 'José García',
        email: 'jose.garcia@example.com',
        message: 'Valid message here',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle newlines in message', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Line 1\nLine 2\nLine 3 with enough characters',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
