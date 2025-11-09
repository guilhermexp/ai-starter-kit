import type { ToolSet } from "ai"
import { getMCPServers, type MCPServerConfig } from "./config"
import { loadMCPToolsFromLocal } from "./load-mcp-from-local"
import { loadMCPToolsFromURL } from "./load-mcp-from-url"

type MCPClient = {
  name: string
  tools: ToolSet
  close: () => void
}

/**
 * Load all enabled MCP servers and return their tools
 * Returns a merged ToolSet and cleanup function
 */
export async function loadMCPTools(): Promise<{
  tools: ToolSet
  cleanup: () => void
}> {
  const servers = getMCPServers()
  const enabledServers = servers.filter((s) => s.enabled)

  if (enabledServers.length === 0) {
    return {
      tools: {},
      cleanup: () => {},
    }
  }

  const clients: MCPClient[] = []
  const mergedTools: ToolSet = {}

  // Load each server
  for (const server of enabledServers) {
    try {
      console.log(`Loading MCP server: ${server.name}`)

      let client: { tools: ToolSet; close: () => void }

      if (server.type === "stdio") {
        client = await loadMCPToolsFromLocal(
          server.command,
          server.env || {}
        )
      } else {
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
      console.error(`Failed to load MCP server ${server.name}:`, error)
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
  }
}

/**
 * Cache for MCP tools to avoid reloading on every request
 * Tools are loaded once and reused across requests
 */
let mcpToolsCache: {
  tools: ToolSet
  cleanup: () => void
} | null = null

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
