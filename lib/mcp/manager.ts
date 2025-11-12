import type { ToolSet } from "ai"
import { getMCPServers, type MCPServerConfig } from "./config"
import { loadMCPToolsFromLocal } from "./load-mcp-from-local"
import { loadMCPToolsFromURL } from "./load-mcp-from-url"

type MCPClient = {
  name: string
  tools: ToolSet
  close: () => void
}

type LoadMCPToolsResult = {
  tools: ToolSet
  cleanup: () => void
  errors: Record<string, string> // server name -> error message
}

/**
 * Load all enabled MCP servers and return their tools
 * Returns a merged ToolSet, cleanup function, and any errors
 */
export async function loadMCPTools(): Promise<LoadMCPToolsResult> {
  const servers = getMCPServers()
  const enabledServers = servers.filter((s) => s.enabled)

  if (enabledServers.length === 0) {
    return {
      tools: {},
      cleanup: () => {},
      errors: {},
    }
  }

  const clients: MCPClient[] = []
  const mergedTools: ToolSet = {}
  const errors: Record<string, string> = {}

  // Load each server
  for (const server of enabledServers) {
    try {
      console.log(`Loading MCP server: ${server.name}`)

      let client: { tools: ToolSet; close: () => void }

      if (server.type === "stdio") {
        if (!server.command) {
          throw new Error("Command is required for stdio servers")
        }
        client = await loadMCPToolsFromLocal(
          server.command,
          server.env || {}
        )
      } else {
        if (!server.url) {
          throw new Error("URL is required for SSE servers")
        }
        client = await loadMCPToolsFromURL(server.url)
      }

      // Prefix tools with server name to avoid conflicts
      const prefixedTools: ToolSet = {}
      for (const [toolName, toolDefinition] of Object.entries(client.tools)) {
        const prefixedName = `${server.name}_${toolName}`
        prefixedTools[prefixedName] = toolDefinition
      }

      Object.assign(mergedTools, prefixedTools)

      clients.push({
        name: server.name,
        tools: prefixedTools,
        close: client.close,
      })

      console.log(
        `✓ Loaded MCP server: ${server.name} (${Object.keys(prefixedTools).length} tools)`
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`Failed to load MCP server ${server.name}:`, error)
      errors[server.name] = errorMessage
    }
  }

  // Cleanup function to close all clients
  const cleanup = () => {
    clients.forEach((client) => {
      try {
        client.close()
      } catch (error) {
        console.error(`Failed to close MCP client ${client.name}:`, error)
      }
    })
  }

  return {
    tools: mergedTools,
    cleanup,
    errors,
  }
}

/**
 * Cache for MCP tools to avoid reloading on every request
 * Tools are loaded once and reused across requests
 */
let mcpToolsCache: LoadMCPToolsResult | null = null

/**
 * Get MCP tools (cached)
 * Warning: This caches the tools globally. If you need to reload,
 * call clearMCPToolsCache() first.
 */
export async function getMCPTools(): Promise<ToolSet> {
  if (!mcpToolsCache) {
    mcpToolsCache = await loadMCPTools()
  }
  return mcpToolsCache.tools
}

/**
 * Get MCP tools with error information
 */
export async function getMCPToolsWithErrors(): Promise<{
  tools: ToolSet
  errors: Record<string, string>
}> {
  if (!mcpToolsCache) {
    mcpToolsCache = await loadMCPTools()
  }
  return {
    tools: mcpToolsCache.tools,
    errors: mcpToolsCache.errors,
  }
}

/**
 * Clear the MCP tools cache and close all clients
 */
export function clearMCPToolsCache() {
  if (mcpToolsCache) {
    mcpToolsCache.cleanup()
    mcpToolsCache = null
  }
}

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    clearMCPToolsCache()
    process.exit(0)
  })
  process.on("SIGTERM", () => {
    clearMCPToolsCache()
    process.exit(0)
  })
}
