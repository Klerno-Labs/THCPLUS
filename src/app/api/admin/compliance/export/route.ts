import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// Force dynamic rendering for this route (uses headers/cookies)
export const dynamic = 'force-dynamic'

/**
 * API Route: Export Compliance Logs
 *
 * Exports all age verification logs as CSV for legal compliance.
 * Requires authentication.
 */
export async function GET() {
  try {
    // Require authentication
    await requireAuth()

    // Fetch all verification logs
    const verifications = await prisma.ageVerification.findMany({
      orderBy: { verifiedAt: 'desc' },
    })

    // Create CSV content
    const headers = [
      'Session ID',
      'IP Hash',
      'User Agent',
      'Verified At',
      'Expires At',
      'Created At',
    ]

    const rows = verifications.map((v) => [
      v.sessionId,
      v.ipAddress,
      v.userAgent.replace(/,/g, ';'), // Escape commas
      new Date(v.verifiedAt).toISOString(),
      new Date(v.expiresAt).toISOString(),
      new Date(v.createdAt).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="age-verification-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting compliance logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
