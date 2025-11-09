import {
  getUserPreferences,
  setUserPreferences,
} from "@/lib/local-storage"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const preferences = await getUserPreferences()
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error in user-preferences GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      layout,
      prompt_suggestions,
      show_tool_invocations,
      show_conversation_previews,
      multi_model_enabled,
      hidden_models,
    } = body

    // Validate the data types
    if (layout && typeof layout !== "string") {
      return NextResponse.json(
        { error: "layout must be a string" },
        { status: 400 }
      )
    }

    if (hidden_models && !Array.isArray(hidden_models)) {
      return NextResponse.json(
        { error: "hidden_models must be an array" },
        { status: 400 }
      )
    }

    // Prepare update object with only provided fields
    const updateData: any = {}
    if (layout !== undefined) updateData.layout = layout
    if (prompt_suggestions !== undefined)
      updateData.prompt_suggestions = prompt_suggestions
    if (show_tool_invocations !== undefined)
      updateData.show_tool_invocations = show_tool_invocations
    if (show_conversation_previews !== undefined)
      updateData.show_conversation_previews = show_conversation_previews
    if (multi_model_enabled !== undefined)
      updateData.multi_model_enabled = multi_model_enabled
    if (hidden_models !== undefined) updateData.hidden_models = hidden_models

    // Save to local storage
    await setUserPreferences(updateData)
    const preferences = await getUserPreferences()

    return NextResponse.json({
      success: true,
      ...preferences,
    })
  } catch (error) {
    console.error("Error in user-preferences PUT API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
