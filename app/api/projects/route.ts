import { NextResponse } from "next/server"

/**
 * Projects API (disabled - requires database)
 * Returns empty array for local-only mode
 */
export async function GET() {
  return NextResponse.json([])
}

export async function POST() {
  return NextResponse.json({ success: true, id: crypto.randomUUID() })
}
