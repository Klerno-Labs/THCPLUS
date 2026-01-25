/**
 * Shared TypeScript Types
 *
 * Centralized type definitions used across the application.
 */

/**
 * Generic API Response Pattern
 *
 * All server actions and API routes should return this format
 * for consistent error handling.
 */
export type ApiResponse<T = unknown> =
  | {
      success: true
      data?: T
      message?: string
    }
  | {
      success: false
      error: string
      code?: string
    }

/**
 * Database Models (simplified versions for client use)
 */
export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  submittedAt: Date
  status: 'new' | 'read' | 'replied'
  repliedAt?: Date | null
}

export interface AgeVerification {
  id: string
  sessionId: string
  ipAddress: string // Hashed
  userAgent: string
  verifiedAt: Date
  expiresAt: Date
}

export interface Admin {
  id: string
  email: string
  name: string
  role: string
  lastLoginAt?: Date | null
}

/**
 * Form Data Types
 */
export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface AgeVerificationData {
  verified: boolean
}

/**
 * Email Template Props
 */
export interface ContactNotificationEmailProps {
  name: string
  email: string
  message: string
  submittedAt: Date
}

export interface ContactConfirmationEmailProps {
  name: string
}

/**
 * Analytics & Stats
 */
export interface SubmissionStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  new: number
  read: number
  replied: number
}

export interface AgeVerificationStats {
  total: number
  today: number
  thisMonth: number
}

export interface AnalyticsData {
  submissions: SubmissionStats
  ageVerifications: AgeVerificationStats
  averageResponseTime: number // in hours
}

/**
 * Compliance & Audit
 */
export interface ComplianceLog {
  id: string
  sessionId: string
  ipAddress: string // Hashed
  userAgent: string
  verifiedAt: Date
  expiresAt: Date
}

/**
 * Rate Limiting
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  error?: string
}

/**
 * Environment Configuration
 */
export interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test'
  siteUrl: string
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
}

/**
 * Feature Flags
 */
export type FeatureFlag =
  | 'email_notifications'
  | 'sentry_monitoring'
  | 'rate_limiting'
  | 'analytics'
  | 'cms_integration'

/**
 * Session Data
 */
export interface SessionData {
  sessionId: string
  expiresAt: Date
  verified: boolean
}

/**
 * Admin Dashboard
 */
export interface DashboardStats {
  totalSubmissions: number
  todaySubmissions: number
  newSubmissions: number
  readSubmissions: number
  repliedSubmissions: number
  totalAgeVerifications: number
  todayAgeVerifications: number
}

export type SubmissionsTableData = ContactSubmission

/**
 * Pagination
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Search & Filter
 */
export interface SubmissionsFilter {
  status?: 'new' | 'read' | 'replied'
  search?: string
  startDate?: Date
  endDate?: Date
}

/**
 * CSV Export
 */
export interface CSVExportOptions {
  filename: string
  headers: string[]
  data: Record<string, string | number | Date>[]
}
