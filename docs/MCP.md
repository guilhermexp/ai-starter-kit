# MCP (Model Context Protocol) Integration

This app supports the Model Context Protocol, allowing you to extend the chat capabilities with custom tools from MCP servers.

## What is MCP?

MCP (Model Context Protocol) is a standard protocol for connecting AI models to external data sources and tools. It allows you to add capabilities like:

- **Filesystem access** - Read/write files
- **GitHub integration** - Search repos, create issues, read code
- **Database access** - Query PostgreSQL, MySQL, etc.
- **Browser automation** - Control browsers with Puppeteer
- **Web search** - Brave Search, Google, etc.
- **And much more...**

## How It Works

1. **MCP Servers** provide tools that the AI can use
2. **The app** loads these tools and makes them available to the chat
3. **The AI model** decides when to use these tools based on user queries
4. **Results** are displayed in the chat with specialized UI components

## Configuration

### Option 1: Environment Variable

Configure MCP servers via the `MCP_SERVERS` environment variable in `.env.local`:

```bash
MCP_SERVERS='[
  {
    "name": "filesystem",
    "type": "stdio",
    "enabled": true,
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
  },
  {
    "name": "github",
    "type": "stdio",
    "enabled": true,
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token"
    }
  }
]'
```

### Option 2: Code Configuration

Edit `lib/mcp/config.ts` to configure servers directly:

```typescript
export const DEFAULT_MCP_SERVERS: MCPServerConfig[] = [
  {
    name: "filesystem",
    type: "stdio",
    enabled: true,
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
  },
]
```

## Available MCP Servers

### Official Servers

Install via npm/npx (no installation required with npx):

- **@modelcontextprotocol/server-filesystem** - File system operations
- **@modelcontextprotocol/server-github** - GitHub API access
- **@modelcontextprotocol/server-postgres** - PostgreSQL database
- **@modelcontextprotocol/server-brave-search** - Web search
- **@modelcontextprotocol/server-puppeteer** - Browser automation
- **@modelcontextprotocol/server-google-maps** - Google Maps API
- **@modelcontextprotocol/server-slack** - Slack integration
- **@modelcontextprotocol/server-everything** - All-in-one server

### Community Servers

Browse community servers at: https://github.com/modelcontextprotocol/servers

## Server Types

### stdio (Local)

Runs MCP servers as local processes:

```json
{
  "name": "myserver",
  "type": "stdio",
  "enabled": true,
  "command": "node",
  "args": ["path/to/server.js"],
  "env": {
    "API_KEY": "secret"
  }
}
```

### SSE (Remote)

Connects to remote MCP servers via Server-Sent Events:

```json
{
  "name": "remote",
  "type": "sse",
  "enabled": true,
  "url": "https://example.com/mcp"
}
```

## Example: Filesystem Server

1. Add to `.env.local`:

```bash
MCP_SERVERS='[{"name":"filesystem","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","/tmp"]}]'
```

2. Ask in chat:

```
"Create a file called hello.txt with the content 'Hello World'"
```

3. The AI will use the `filesystem_writeFile` tool to create the file.

## Example: GitHub Server

1. Get a GitHub Personal Access Token from https://github.com/settings/tokens

2. Add to `.env.local`:

```bash
GITHUB_TOKEN=ghp_your_token_here
MCP_SERVERS='[{"name":"github","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-github"],"env":{"GITHUB_PERSONAL_ACCESS_TOKEN":"ghp_your_token_here"}}]'
```

3. Ask in chat:

```
"Search for Next.js repositories with more than 10k stars"
"Show me the README of vercel/next.js"
"Create an issue in my-org/my-repo"
```

## Tool Naming

MCP tools are automatically prefixed with the server name to avoid conflicts:

- `filesystem_readFile`
- `filesystem_writeFile`
- `github_searchRepositories`
- `github_getFileContents`

## Troubleshooting

### Tools not loading

Check the server logs in the terminal:

```
Loading MCP server: filesystem
✓ Loaded MCP server: filesystem (3 tools)
```

If you see errors, ensure:
- The server package is installed or accessible via npx
- Required environment variables are set
- The command and args are correct

### Server timing out

Some MCP servers take time to initialize. Increase `maxSteps` in `app/api/chat/route.ts` if needed.

### Tools not appearing in UI

The UI automatically renders tool invocations. If you don't see them:
- Check that `showToolInvocations` is enabled in user preferences
- Verify the tool returned a valid result
- Check browser console for errors

## Security Considerations

- **Filesystem server**: Limit access to specific directories
- **GitHub server**: Use tokens with minimal required permissions
- **Database servers**: Use read-only credentials when possible
- **Remote servers**: Only connect to trusted SSE endpoints

## Performance

MCP tools are cached globally to avoid reloading on every request. To reload:

```typescript
import { clearMCPToolsCache } from "@/lib/mcp"

clearMCPToolsCache()
```

## Creating Custom MCP Servers

See the official MCP documentation: https://modelcontextprotocol.io/docs

## Disabling MCP

To disable MCP completely:

1. Remove `MCP_SERVERS` from `.env.local`
2. Or set all servers to `"enabled": false`

Native tools (webSearch, imageSearch) will still work.
