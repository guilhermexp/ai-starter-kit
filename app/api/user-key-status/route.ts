import { getApiKeys } from "@/lib/local-storage"
import { PROVIDERS } from "@/lib/providers"
import { NextResponse } from "next/server"

const SUPPORTED_PROVIDERS = PROVIDERS.map((p) => p.id)

export async function GET() {
  try {
    const apiKeys = await getApiKeys()
    const userProviders = apiKeys.map((k) => k.provider)

    // Create status object for all supported providers
    const providerStatus = SUPPORTED_PROVIDERS.reduce(
      (acc, provider) => {
        acc[provider] = userProviders.includes(provider)
        return acc
      },
      {} as Record<string, boolean>
    )

    return NextResponse.json(providerStatus)
  } catch (err) {
    console.error("Key status error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
