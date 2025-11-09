import {
  getMCPServers,
  getMCPServersSource,
  saveUserServers,
  type MCPServerConfig,
} from "@/lib/mcp/config"
import { clearMCPToolsCache } from "@/lib/mcp/manager"
import { NextResponse } from "next/server"

/**
 * GET /api/mcp/servers
 * Get all MCP servers
 */
export async function GET() {
  try {
    const servers = getMCPServers()
    const source = getMCPServersSource()

    return NextResponse.json({
      servers,
      source,
      editable: source !== "env", // Can't edit if coming from env var
    })
  } catch (error) {
    console.error("Error fetching MCP servers:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch MCP servers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/mcp/servers
 * Add a new MCP server
 */
export async function POST(req: Request) {
  try {
    const source = getMCPServersSource()

    if (source === "env") {
      return NextResponse.json(
        {
          error:
            "Cannot add servers: MCP_SERVERS is configured via environment variable. Remove MCP_SERVERS from .env.local to manage servers via UI.",
        },
        { status: 403 }
      )
    }

    const newServer: MCPServerConfig = await req.json()

    // Validate server config
    if (!newServer.name || !newServer.type) {
      return NextResponse.json(
        { error: "Invalid server configuration: name and type are required" },
        { status: 400 }
      )
    }

    const servers = getMCPServers()

    // Check for duplicate names
    if (servers.some((s) => s.name === newServer.name)) {
      return NextResponse.json(
        { error: `Server with name "${newServer.name}" already exists` },
        { status: 409 }
      )
    }

    // Add new server
    const updatedServers = [...servers, newServer]
    saveUserServers(updatedServers)

    // Clear cache to reload tools
    clearMCPToolsCache()

    return NextResponse.json({
      success: true,
      server: newServer,
    })
  } catch (error) {
    console.error("Error adding MCP server:", error)
    return NextResponse.json(
      {
        error: "Failed to add MCP server",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/mcp/servers
 * Update an existing MCP server
 */
export async function PUT(req: Request) {
  try {
    const source = getMCPServersSource()

    if (source === "env") {
      return NextResponse.json(
        {
          error:
            "Cannot update servers: MCP_SERVERS is configured via environment variable",
        },
        { status: 403 }
      )
    }

    const updatedServer: MCPServerConfig = await req.json()

    if (!updatedServer.name) {
      return NextResponse.json(
        { error: "Server name is required" },
        { status: 400 }
      )
    }

    const servers = getMCPServers()
    const index = servers.findIndex((s) => s.name === updatedServer.name)

    if (index === -1) {
      return NextResponse.json(
        { error: `Server "${updatedServer.name}" not found` },
        { status: 404 }
      )
    }

    // Update server
    const updatedServers = [...servers]
    updatedServers[index] = updatedServer
    saveUserServers(updatedServers)

    // Clear cache to reload tools
    clearMCPToolsCache()

    return NextResponse.json({
      success: true,
      server: updatedServer,
    })
  } catch (error) {
    console.error("Error updating MCP server:", error)
    return NextResponse.json(
      {
        error: "Failed to update MCP server",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/mcp/servers?name=serverName
 * Delete an MCP server
 */
export async function DELETE(req: Request) {
  try {
    const source = getMCPServersSource()

    if (source === "env") {
      return NextResponse.json(
        {
          error:
            "Cannot delete servers: MCP_SERVERS is configured via environment variable",
        },
        { status: 403 }
      )
    }

    const url = new URL(req.url)
    const name = url.searchParams.get("name")

    if (!name) {
      return NextResponse.json(
        { error: "Server name is required" },
        { status: 400 }
      )
    }

    const servers = getMCPServers()
    const filtered = servers.filter((s) => s.name !== name)

    if (filtered.length === servers.length) {
      return NextResponse.json(
        { error: `Server "${name}" not found` },
        { status: 404 }
      )
    }

    saveUserServers(filtered)

    // Clear cache to reload tools
    clearMCPToolsCache()

    return NextResponse.json({
      success: true,
      deletedServer: name,
    })
  } catch (error) {
    console.error("Error deleting MCP server:", error)
    return NextResponse.json(
      {
        error: "Failed to delete MCP server",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
