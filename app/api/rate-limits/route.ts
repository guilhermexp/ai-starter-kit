import { NextResponse } from "next/server"

/**
 * Rate limits API (disabled - local-only mode has no rate limits)
 */
export async function GET() {
  return NextResponse.json({
    dailyLimit: Infinity,
    remaining: Infinity,
    resetAt: null,
  })
}
