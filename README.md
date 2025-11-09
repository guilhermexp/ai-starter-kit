# Zola

[zola.chat](https://zola.chat)

**Zola** is the open-source chat interface for all your models.

![zola cover](./public/cover_zola.jpg)

## Features

- Multi-model support: OpenAI, Gemini, Grok (xAI), OpenRouter
- Bring your own API key (BYOK) support via OpenRouter
- **Built-in Tools**: Web search and image search powered by Exa
- **Full MCP Support**: Extend with custom tools via Model Context Protocol
- File uploads
- Clean, responsive UI with light/dark themes
- Built with Tailwind CSS, shadcn/ui, and prompt-kit
- Open-source and self-hostable
- Customizable: user system prompt, multiple layout options

## Quick Start

### Option 1: With OpenAI (Cloud)

```bash
git clone https://github.com/ibelick/zola.git
cd zola
npm install
echo "OPENAI_API_KEY=your-key" > .env.local
npm run dev
```

### Option 2: With Ollama (Local)

```bash
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2  # or any model you prefer

# Clone and run Zola
git clone https://github.com/ibelick/zola.git
cd zola
npm install
npm run dev
```

Zola will automatically detect your local Ollama models!

### Option 3: Docker with Ollama

```bash
git clone https://github.com/ibelick/zola.git
cd zola
docker-compose -f docker-compose.ollama.yml up
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ibelick/zola)

To unlock features like auth, file uploads, see [INSTALL.md](./INSTALL.md).

## Tools & MCP

Zola includes powerful built-in tools and supports the Model Context Protocol (MCP) for extending capabilities:

### Built-in Tools

- **Web Search** - Real-time web search powered by [Exa](https://exa.ai)
- **Image Search** - Find relevant images from the web

To enable built-in tools, add your Exa API key to `.env.local`:

```bash
EXA_API_KEY=your_exa_api_key
```

### MCP Integration

Extend Zola with custom tools using MCP servers. Popular use cases:

- **Filesystem** - Read/write files
- **GitHub** - Search repos, create issues, read code
- **Databases** - Query PostgreSQL, MySQL, etc.
- **Browser Automation** - Control browsers with Puppeteer
- **Custom APIs** - Integrate any service via MCP

See [docs/MCP.md](./docs/MCP.md) for complete setup instructions.

**Example**: Enable GitHub integration

```bash
# Get token from https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_token

# Configure MCP server
MCP_SERVERS='[{"name":"github","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-github"],"env":{"GITHUB_PERSONAL_ACCESS_TOKEN":"ghp_your_token"}}]'
```

Now ask: "Search for Next.js repositories with more than 10k stars"

## Built with

- [prompt-kit](https://prompt-kit.com/) — AI components
- [shadcn/ui](https://ui.shadcn.com) — core components
- [motion-primitives](https://motion-primitives.com) — animated components
- [vercel ai sdk](https://vercel.com/blog/introducing-the-vercel-ai-sdk) — model integration, AI features
- [supabase](https://supabase.com) — auth and storage

## Sponsors

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

## License

Apache License 2.0

## Notes

This is a beta release. The codebase is evolving and may change.
