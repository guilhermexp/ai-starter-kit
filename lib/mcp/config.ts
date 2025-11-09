import fs from "fs"
import path from "path"

export type MCPServerConfig = {
  name: string
  type: "stdio" | "sse"
  enabled: boolean
} & (
  | {
      type: "stdio"
      command: string
      args?: string[]
      env?: Record<string, string>
    }
  | {
      type: "sse"
      url: string
    }
)

// Default MCP servers configuration
export const DEFAULT_MCP_SERVERS: MCPServerConfig[] = [
  // Example: Filesystem server (requires @modelcontextprotocol/server-filesystem)
  // {
  //   name: "filesystem",
  //   type: "stdio",
  //   enabled: false,
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
  // },

  // Example: GitHub server (requires @modelcontextprotocol/server-github)
  // {
  //   name: "github",
  //   type: "stdio",
  //   enabled: false,
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-github"],
  //   env: {
  //     GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || "",
  //   },
  // },
]

const USER_SERVERS_PATH = path.join(process.cwd(), "lib/mcp/user-servers.json")

/**
 * Load user-defined MCP servers from JSON file
 */
function loadUserServers(): MCPServerConfig[] {
  try {
    if (fs.existsSync(USER_SERVERS_PATH)) {
      const data = fs.readFileSync(USER_SERVERS_PATH, "utf-8")
      const servers = JSON.parse(data)
      return Array.isArray(servers) ? servers : []
    }
  } catch (error) {
    console.error("Failed to load user MCP servers:", error)
  }
  return []
}

/**
 * Save user-defined MCP servers to JSON file
 */
export function saveUserServers(servers: MCPServerConfig[]): void {
  try {
    fs.writeFileSync(USER_SERVERS_PATH, JSON.stringify(servers, null, 2))
  } catch (error) {
    console.error("Failed to save user MCP servers:", error)
    throw error
  }
}

/**
 * Get MCP servers from multiple sources (priority order):
 * 1. Environment variable MCP_SERVERS
 * 2. User-defined servers in user-servers.json
 * 3. Default servers
 */
export function getMCPServers(): MCPServerConfig[] {
  // Priority 1: Environment variable
  if (process.env.MCP_SERVERS) {
    try {
      const servers = JSON.parse(process.env.MCP_SERVERS)
      if (Array.isArray(servers)) {
        return servers
      }
    } catch (error) {
      console.error("Failed to parse MCP_SERVERS:", error)
    }
  }

  // Priority 2: User-defined servers
  const userServers = loadUserServers()
  if (userServers.length > 0) {
    return userServers
  }

  // Priority 3: Defaults
  return DEFAULT_MCP_SERVERS
}

/**
 * Get the source of MCP servers configuration
 */
export function getMCPServersSource(): "env" | "file" | "default" {
  if (process.env.MCP_SERVERS) {
    return "env"
  }
  const userServers = loadUserServers()
  if (userServers.length > 0) {
    return "file"
  }
  return "default"
}
