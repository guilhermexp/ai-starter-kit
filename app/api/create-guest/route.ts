/**
 * Create guest endpoint (simplified for local-only mode)
 * Guests are automatically created via local storage
 */
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
      })
    }

    // Local-only mode - guests are automatically created via getOrCreateUserId()
    return new Response(
      JSON.stringify({ user: { id: userId, anonymous: true } }),
      {
        status: 200,
      }
    )
  } catch (err: unknown) {
    console.error("Error in create-guest endpoint:", err)

    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
