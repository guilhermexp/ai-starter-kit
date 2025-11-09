"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useQuery } from "@tanstack/react-query"
import { WrenchIcon, CheckCircleIcon, XCircleIcon, PlusIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { MCPServerDialog } from "./mcp-server-dialog"

type MCPServer = {
  name: string
  type: "stdio" | "sse"
  enabled: boolean
  command?: string
  args?: string[]
  url?: string
  env?: Record<string, string>
}

type MCPInfo = {
  servers: MCPServer[]
  enabledServers: MCPServer[]
  totalTools: number
  toolsByServer: Record<string, string[]>
  nativeTools: string[]
  source: "env" | "file" | "default"
  editable: boolean
}

export function MCPSection() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [selectedServer, setSelectedServer] = useState<MCPServer | undefined>()

  const { data, isLoading, refetch } = useQuery<MCPInfo>({
    queryKey: ["mcp-info"],
    queryFn: async () => {
      const res = await fetch("/api/mcp")
      if (!res.ok) throw new Error("Failed to fetch MCP info")
      return res.json()
    },
  })

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        status: "success",
      })
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      toast({
        title: "Failed to copy to clipboard",
        status: "error",
      })
    }
  }

  const handleAddServer = () => {
    setSelectedServer(undefined)
    setDialogMode("add")
    setDialogOpen(true)
  }

  const handleEditServer = (server: MCPServer) => {
    setSelectedServer(server)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleDeleteServer = async (serverName: string) => {
    if (!confirm(`Are you sure you want to delete "${serverName}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/mcp/servers?name=${encodeURIComponent(serverName)}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete server")
      }

      toast({
        title: "Server deleted",
        status: "success",
      })

      refetch()
    } catch (error) {
      console.error("Error deleting server:", error)
      toast({
        title: error instanceof Error ? error.message : "Failed to delete server",
        status: "error",
      })
    }
  }

  const handleToggleServer = async (server: MCPServer) => {
    try {
      const res = await fetch("/api/mcp/servers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...server, enabled: !server.enabled }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle server")
      }

      toast({
        title: server.enabled ? "Server disabled" : "Server enabled",
        status: "success",
      })

      refetch()
    } catch (error) {
      console.error("Error toggling server:", error)
      toast({
        title: error instanceof Error ? error.message : "Failed to toggle server",
        status: "error",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="text-muted-foreground">Loading MCP servers...</div>
      </div>
    )
  }

  const servers = data?.servers ?? []
  const enabledServers = data?.enabledServers ?? []
  const toolsByServer = data?.toolsByServer ?? {}
  const nativeTools = data?.nativeTools ?? []
  const editable = data?.editable ?? false
  const source = data?.source ?? "default"

  const hasEnabledServers = enabledServers.length > 0

  return (
    <>
      <MCPServerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        server={selectedServer}
        mode={dialogMode}
        onSuccess={() => refetch()}
      />

      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">MCP Servers</h3>
              <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                {enabledServers.length} active
              </span>
              {source === "env" && (
                <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full px-2 py-0.5 text-xs">
                  Managed via .env.local
                </span>
              )}
            </div>
            {editable && (
              <Button size="sm" onClick={handleAddServer}>
                <PlusIcon className="mr-1 size-4" />
                Add Server
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {editable
              ? "Add and manage MCP servers to extend chat capabilities."
              : source === "env"
                ? "MCP servers are configured via .env.local. Remove MCP_SERVERS to manage servers via UI."
                : "Model Context Protocol servers extend your chat with custom tools."}
          </p>
        </div>

      {/* Native Tools */}
      <div className="border-border rounded-lg border p-4">
        <div className="mb-3 flex items-center gap-2">
          <WrenchIcon className="text-primary size-5" />
          <h4 className="font-medium">Native Tools</h4>
          <span className="border-border rounded-full border px-2 py-0.5 text-xs">
            Always available
          </span>
        </div>
        <p className="text-muted-foreground mb-3 text-sm">
          Built-in tools powered by Exa (requires EXA_API_KEY)
        </p>
        <div className="flex flex-wrap gap-2">
          {nativeTools.map((tool) => (
            <span key={tool} className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* MCP Servers Status */}
      {!hasEnabledServers && (
        <div className="border-border rounded-lg border p-6 text-center">
          <div className="text-muted-foreground mb-4">
            <WrenchIcon className="mx-auto mb-2 size-12 opacity-50" />
            <p className="mb-2 font-medium">No MCP servers configured</p>
            <p className="text-sm">
              Add MCP servers to extend chat capabilities with filesystem
              access, GitHub integration, databases, and more.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const example = `MCP_SERVERS='[{"name":"github","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-github"],"env":{"GITHUB_PERSONAL_ACCESS_TOKEN":"your_token"}}]'`
              copyToClipboard(example)
            }}
          >
            Copy example configuration
          </Button>
        </div>
      )}

      {/* Enabled Servers */}
      {hasEnabledServers && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Active Servers</h4>
          {enabledServers.map((server) => {
            const tools = toolsByServer[server.name] ?? []
            const isLoaded = tools.length > 0

            return (
              <div
                key={server.name}
                className="border-border rounded-lg border p-4"
              >
                <div className="space-y-3">
                  {/* Server Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-medium">{server.name}</h4>
                        {isLoaded ? (
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <CheckCircleIcon className="size-3" />
                            Loaded
                          </span>
                        ) : (
                          <span className="bg-destructive/10 text-destructive flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <XCircleIcon className="size-3" />
                            Failed
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="border-border rounded-full border px-2 py-0.5 text-xs">
                          {server.type}
                        </span>
                        {server.type === "stdio" && server.command && (
                          <code className="bg-muted rounded px-1 py-0.5">
                            {server.command}
                          </code>
                        )}
                        {server.type === "sse" && server.url && (
                          <code className="bg-muted truncate rounded px-1 py-0.5">
                            {server.url}
                          </code>
                        )}
                      </div>
                    </div>
                    {editable && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditServer(server)}
                          className="size-8 p-0"
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteServer(server.name)}
                          className="text-destructive hover:text-destructive size-8 p-0"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Tools List */}
                  {isLoaded && tools.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <WrenchIcon className="size-3" />
                        <span>{tools.length} tools available</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tools.slice(0, 10).map((tool) => (
                          <span
                            key={tool}
                            className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 font-mono text-xs"
                          >
                            {tool}
                          </span>
                        ))}
                        {tools.length > 10 && (
                          <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                            +{tools.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Failed State */}
                  {!isLoaded && (
                    <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                      <p className="mb-1 font-medium">Failed to load server</p>
                      <p className="text-xs opacity-90">
                        Check that the server package is installed and
                        environment variables are set correctly. See console
                        for details.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Disabled Servers */}
      {servers.filter((s) => !s.enabled).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-sm">
            Disabled Servers ({servers.filter((s) => !s.enabled).length})
          </h4>
          <div className="space-y-2">
            {servers
              .filter((s) => !s.enabled)
              .map((server) => (
                <div
                  key={server.name}
                  className="border-border bg-muted/30 rounded-lg border p-3 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{server.name}</span>
                    <span className="border-border rounded-full border px-2 py-0.5 text-xs">
                      Disabled
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Documentation Link */}
      <div className="border-border bg-muted/50 rounded-lg border p-4">
        <p className="text-muted-foreground mb-2 text-sm">
          <strong>Need help?</strong> See{" "}
          <a
            href="https://github.com/ibelick/zola/blob/main/docs/MCP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            MCP documentation
          </a>{" "}
          for setup instructions and examples.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const githubExample = `MCP_SERVERS='[{"name":"github","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-github"],"env":{"GITHUB_PERSONAL_ACCESS_TOKEN":"ghp_token"}}]'`
              copyToClipboard(githubExample)
            }}
          >
            Copy GitHub example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const filesystemExample = `MCP_SERVERS='[{"name":"filesystem","type":"stdio","enabled":true,"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","/tmp"]}]'`
              copyToClipboard(filesystemExample)
            }}
          >
            Copy Filesystem example
          </Button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh servers
        </Button>
      </div>
    </div>
  </>
  )
}
