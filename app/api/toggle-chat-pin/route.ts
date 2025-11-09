import { toggleChatPin } from "@/lib/local-storage"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { chatId } = await request.json()

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 })
    }

    await toggleChatPin(chatId)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("toggle-chat-pin unhandled error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
