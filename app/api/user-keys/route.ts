import { encryptKey } from "@/lib/encryption"
import {
  deleteApiKey,
  getApiKey,
  saveApiKey as saveApiKeyToStorage,
} from "@/lib/local-storage"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and API key are required" },
        { status: 400 }
      )
    }

    const { encrypted, iv } = encryptKey(apiKey)

    // Check if this is a new API key (not an update)
    const existingKey = await getApiKey(provider)
    const isNewKey = !existingKey

    // Save the API key
    await saveApiKeyToStorage({
      provider,
      encryptedKey: encrypted,
      iv,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      isNewKey,
      message: isNewKey ? "API key saved" : "API key updated",
    })
  } catch (error) {
    console.error("Error in POST /api/user-keys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { provider } = await request.json()

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      )
    }

    await deleteApiKey(provider)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/user-keys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
