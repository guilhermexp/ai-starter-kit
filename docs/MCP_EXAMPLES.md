# MCP Server Configuration Examples

## 1. Filesystem Server

Access and manipulate files on your system.

### Configuration

```bash
# .env.local
MCP_SERVERS='[{
  "name": "filesystem",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"]
}]'
```

### Usage Examples

- "Create a file called notes.txt with my meeting notes"
- "Read the contents of package.json"
- "List all files in the current directory"
- "Search for files containing 'TODO'"

### Available Tools

- `filesystem_readFile` - Read file contents
- `filesystem_writeFile` - Create or update files
- `filesystem_listDirectory` - List directory contents
- `filesystem_searchFiles` - Search for files by name or content
- `filesystem_getFileInfo` - Get file metadata

---

## 2. GitHub Server

Interact with GitHub repositories, issues, and pull requests.

### Configuration

```bash
# Get token from https://github.com/settings/tokens
# Required scopes: repo, read:org

# .env.local
GITHUB_TOKEN=ghp_your_github_token

MCP_SERVERS='[{
  "name": "github",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_github_token"
  }
}]'
```

### Usage Examples

- "Search for TypeScript repositories with more than 5k stars"
- "Show me the README of vercel/next.js"
- "List recent issues in facebook/react"
- "Create an issue in my-org/my-repo titled 'Bug: Login not working'"
- "Search for open PRs in the Next.js repository"

### Available Tools

- `github_searchRepositories` - Search GitHub repos
- `github_getRepository` - Get repo details
- `github_getFileContents` - Read file from repo
- `github_listIssues` - List repository issues
- `github_createIssue` - Create new issue
- `github_listPullRequests` - List PRs

---

## 3. PostgreSQL Server

Query and interact with PostgreSQL databases.

### Configuration

```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

MCP_SERVERS='[{
  "name": "postgres",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
  }
}]'
```

### Usage Examples

- "Show me all tables in the database"
- "Query the users table for all admins"
- "Get the count of orders from last month"
- "Show the schema of the products table"

### Available Tools

- `postgres_query` - Execute SQL queries
- `postgres_listTables` - List all tables
- `postgres_describeTable` - Get table schema
- `postgres_listSchemas` - List database schemas

**Security Note**: Use read-only credentials when possible!

---

## 4. Brave Search Server

Web search capabilities using Brave Search API.

### Configuration

```bash
# Get API key from https://brave.com/search/api/

# .env.local
BRAVE_API_KEY=your_brave_api_key

MCP_SERVERS='[{
  "name": "brave",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "your_brave_api_key"
  }
}]'
```

### Usage Examples

- "Search for latest news about AI"
- "Find documentation for Next.js 15"
- "What's the weather in San Francisco?"

---

## 5. Puppeteer Server

Browser automation and web scraping.

### Configuration

```bash
# .env.local
MCP_SERVERS='[{
  "name": "puppeteer",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
}]'
```

### Usage Examples

- "Take a screenshot of https://example.com"
- "Navigate to GitHub and get the page title"
- "Click on the login button on example.com"
- "Fill in the form at example.com/contact"

### Available Tools

- `puppeteer_navigate` - Navigate to URL
- `puppeteer_screenshot` - Take screenshots
- `puppeteer_click` - Click elements
- `puppeteer_fill` - Fill form fields
- `puppeteer_extract` - Extract page content

---

## 6. Google Maps Server

Access Google Maps data and geocoding.

### Configuration

```bash
# Get API key from https://console.cloud.google.com/

# .env.local
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

MCP_SERVERS='[{
  "name": "maps",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-google-maps"],
  "env": {
    "GOOGLE_MAPS_API_KEY": "your_google_maps_api_key"
  }
}]'
```

### Usage Examples

- "Geocode the address '1600 Amphitheatre Parkway, Mountain View, CA'"
- "Find the coordinates of Times Square"
- "Get directions from New York to Boston"
- "Search for restaurants near me"

---

## 7. Slack Server

Send messages and interact with Slack.

### Configuration

```bash
# Get token from https://api.slack.com/apps

# .env.local
SLACK_BOT_TOKEN=xoxb-your-token

MCP_SERVERS='[{
  "name": "slack",
  "type": "stdio",
  "enabled": true,
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-your-token"
  }
}]'
```

### Usage Examples

- "Send a message to #general: Meeting starts in 5 minutes"
- "List all channels in the workspace"
- "Get recent messages from #engineering"

---

## Multiple Servers Configuration

You can enable multiple MCP servers at once:

```bash
# .env.local
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
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"
    }
  },
  {
    "name": "postgres",
    "type": "stdio",
    "enabled": true,
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "DATABASE_URL": "postgresql://user:password@localhost:5432/db"
    }
  }
]'
```

Now ask complex queries like:
- "Query the database for user emails and save them to a CSV file"
- "Read package.json and create a GitHub issue with outdated dependencies"

---

## Remote MCP Servers (SSE)

If you have an MCP server running remotely:

```bash
MCP_SERVERS='[{
  "name": "remote",
  "type": "sse",
  "enabled": true,
  "url": "https://your-mcp-server.com/sse"
}]'
```

---

## Troubleshooting

### "Server failed to load"

1. Check that the package exists: `npm info @modelcontextprotocol/server-github`
2. Verify environment variables are set correctly
3. Check server logs in terminal for detailed errors

### "Tool not found"

Tools are prefixed with server name. Use:
- `filesystem_readFile` not `readFile`
- `github_searchRepositories` not `searchRepositories`

### "Permission denied"

Check that:
- API tokens have required scopes
- File paths are accessible
- Database credentials are correct

---

## Creating Custom MCP Servers

See the official documentation:
- https://modelcontextprotocol.io/docs
- https://github.com/modelcontextprotocol/servers

Example custom server structure:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio"

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0",
})

server.tool("myTool", "Description", {
  parameter: { type: "string" }
}, async ({ parameter }) => {
  // Your tool logic
  return { content: [{ type: "text", text: "Result" }] }
})

const transport = new StdioServerTransport()
await server.connect(transport)
```
