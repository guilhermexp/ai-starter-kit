import {
  getAllModels,
  getModelsForUserProviders,
  getModelsWithAccessFlags,
} from "@/lib/models"
import { getApiKeys } from "@/lib/local-storage"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get user's API keys from local storage
    const apiKeys = await getApiKeys()
    const userProviders = apiKeys.map((k) => k.provider)

    if (userProviders.length === 0) {
      const models = await getModelsWithAccessFlags()
      return new Response(JSON.stringify({ models }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const models = await getModelsForUserProviders(userProviders)

    return new Response(JSON.stringify({ models }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST() {
  try {
    const models = await getAllModels()

    return NextResponse.json({
      message: "Models fetched",
      models,
      timestamp: new Date().toISOString(),
      count: models.length,
    })
  } catch (error) {
    console.error("Failed to fetch models:", error)
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    )
  }
}
