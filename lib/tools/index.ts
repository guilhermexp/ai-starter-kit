import type { ToolSet } from "ai"
import { getMCPTools } from "../mcp"
import { imageSearchTool } from "./image-search"
import { webSearchTool } from "./web-search"

// Native tools (always available)
export const nativeTools: ToolSet = {
  webSearch: webSearchTool,
  imageSearch: imageSearchTool,
}

/**
 * Get all available tools (native + MCP)
 * This function loads MCP tools and merges them with native tools
 */
export async function getAllTools(): Promise<ToolSet> {
  try {
    const mcpTools = await getMCPTools()
    return {
      ...nativeTools,
      ...mcpTools,
    }
  } catch (error) {
    console.error("Failed to load MCP tools:", error)
    // Fallback to native tools only if MCP fails
    return nativeTools
  }
}

// Legacy export for backward compatibility
export const tools = nativeTools

export { imageSearchTool, webSearchTool }
