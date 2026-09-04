import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

/**
 * GET /api/health
 *
 * Used by the blue-green deployment script to verify this container slot is
 * ready before nginx traffic is switched to it.
 *
 * Always returns 200 — the app being up is sufficient for a deploy to proceed.
 * DB connectivity is checked as an optional diagnostic field in the response body.
 *
 * Returns:
 *   200  { status: "ok", db: "connected" }    — app up, DB reachable
 *   200  { status: "ok", db: "unavailable" }  — app up, DB unreachable (non-blocking)
 */
export async function GET() {
  let db = 'unavailable'

  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL)
      await sql`SELECT 1`
      db = 'connected'
    } catch (err) {
      // DB is down but we still report the app as healthy
      console.warn('[health] DB check failed (non-fatal):', err)
    }
  }

  return NextResponse.json(
    { status: 'ok', db },
    {
      status: 200,
      headers: {
        // Never cache — deploy script must always get a live response
        'Cache-Control': 'no-store',
      },
    },
  )
}
