import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp"

export async function loadMCPToolsFromURL(url: string) {
  if (!url || typeof url !== "string") {
    throw new Error("URL is required and must be a string")
  }

  try {
    const mcpClient = await createMCPClient({
      transport: {
        type: "sse",
        url,
      },
    })

    const tools = await mcpClient.tools()
    return { tools, close: () => mcpClient.close() }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Provide more helpful error messages
    if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
      throw new Error(`Failed to connect to MCP server at ${url}. Check that the server is running and accessible.`)
    }
    if (errorMessage.includes("CORS") || errorMessage.includes("cors")) {
      throw new Error(`CORS error connecting to ${url}. The server may not allow requests from this origin.`)
    }
    
    throw new Error(`Failed to load MCP server: ${errorMessage}`)
  }
}
