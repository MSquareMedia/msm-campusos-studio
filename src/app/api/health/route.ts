import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

/**
 * GET /api/health
 *
 * Used by the blue-green deployment script to verify this container slot is
 * ready before nginx traffic is switched to it.
 *
 * Returns:
 *   200  { status: "ok",    db: "connected" }   — slot is healthy, safe to switch
 *   503  { status: "error", db: "unreachable" }  — deploy script aborts, old slot stays live
 */
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`SELECT 1`

    return NextResponse.json(
      { status: 'ok', db: 'connected' },
      {
        status: 200,
        headers: {
          // Never cache — deploy script must always get a live response
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (err) {
    console.error('[health] DB check failed:', err)

    return NextResponse.json(
      { status: 'error', db: 'unreachable' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  }
}
