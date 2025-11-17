import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp"

export async function loadMCPToolsFromLocal(
  command: string,
  env: Record<string, string> = {}
) {
  const mcpClient = await createMCPClient({
    transport: {
      type: "stdio",
      command,
      args: ["stdio"],
      env,
    },
  })

  const tools = await mcpClient.tools()
  return { tools, close: () => mcpClient.close() }
}
