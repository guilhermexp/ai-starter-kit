import { NextResponse } from "next/server"

/**
 * Developer Tools API (disabled - requires database)
 * Returns empty tools array for local-only mode
 */
export async function GET() {
  return NextResponse.json({
    tools: []
  })
}
