import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// Force dynamic rendering for this route (uses headers/cookies)
export const dynamic = 'force-dynamic'

/**
 * API Route: Update Submission Status
 *
 * Updates the status of a contact form submission (new, read, replied).
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    const body = await request.json()
    const { id, status } = body

    // Validate input
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update submission
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status,
        ...(status === 'replied' && { repliedAt: new Date() }),
      },
    })

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error('Error updating submission status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
