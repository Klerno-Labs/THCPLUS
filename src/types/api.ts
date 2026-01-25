/**
 * API Route Types
 *
 * Type definitions for API endpoints and route handlers.
 */

import { NextRequest } from 'next/server'

/**
 * API Route Handler Type
 */
export type RouteHandler<T = unknown> = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<Response>

/**
 * API Error Response
 */
export interface APIError {
  error: string
  code?: string
  details?: Record<string, unknown>
  timestamp: string
}

/**
 * API Success Response
 */
export interface APISuccess<T = unknown> {
  success: true
  data?: T
  message?: string
  timestamp: string
}

/**
 * Combined API Response
 */
export type APIResponse<T = unknown> = APISuccess<T> | APIError

/**
 * Submission Update Request
 */
export interface UpdateSubmissionStatusRequest {
  id: string
  status: 'new' | 'read' | 'replied'
}

/**
 * Submission Update Response
 */
export interface UpdateSubmissionStatusResponse {
  success: boolean
  submission?: {
    id: string
    status: string
    repliedAt?: Date | null
  }
  error?: string
}

/**
 * Compliance Export Request
 */
export interface ExportComplianceRequest {
  startDate?: string
  endDate?: string
  format?: 'csv' | 'json'
}

/**
 * Admin API Endpoints
 */
export enum AdminAPIEndpoint {
  UPDATE_SUBMISSION_STATUS = '/api/admin/submissions/update-status',
  EXPORT_COMPLIANCE = '/api/admin/compliance/export',
  GET_ANALYTICS = '/api/admin/analytics',
  UPDATE_SETTINGS = '/api/admin/settings',
}

/**
 * Rate Limit Headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string
  'X-RateLimit-Remaining': string
  'X-RateLimit-Reset': string
}

/**
 * Request with User Context
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
  }
}
