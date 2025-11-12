import { getMCPServers, getMCPServersSource, getMCPToolsWithErrors } from "@/lib/mcp"
import { NextResponse } from "next/server"

/**
 * GET /api/mcp
 * Returns information about MCP servers and available tools
 */
export async function GET() {
  try {
    // Get configured servers
    const servers = getMCPServers()
    const source = getMCPServersSource()

    // Get loaded tools with error information
    let tools: Record<string, any> = {}
    let toolCount = 0
    let serverErrors: Record<string, string> = {}

    try {
      const result = await getMCPToolsWithErrors()
      tools = result.tools
      toolCount = Object.keys(tools).length
      serverErrors = result.errors
    } catch (error) {
      console.error("Error loading MCP tools:", error)
    }

    // Get tool names grouped by server
    const toolsByServer: Record<string, string[]> = {}

    for (const toolName of Object.keys(tools)) {
      // Tool names are prefixed with server name: "github_searchRepositories"
      const serverName = toolName.split("_")[0]
      if (!toolsByServer[serverName]) {
        toolsByServer[serverName] = []
      }
      toolsByServer[serverName].push(toolName)
    }

    return NextResponse.json({
      servers,
      enabledServers: servers.filter((s) => s.enabled),
      totalTools: toolCount,
      toolsByServer,
      serverErrors, // Include error information for failed servers
      nativeTools: ["webSearch", "imageSearch"],
      source,
      editable: source !== "env", // Can't edit if coming from env var
    })
  } catch (error) {
    console.error("Error fetching MCP info:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch MCP information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
