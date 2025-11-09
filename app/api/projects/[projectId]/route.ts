import { NextResponse } from "next/server"

/**
 * Individual project API (disabled - requires database)
 */
export async function DELETE() {
  return NextResponse.json({ success: true })
}

export async function PUT() {
  return NextResponse.json({ success: true })
}

export async function GET() {
  return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
}
