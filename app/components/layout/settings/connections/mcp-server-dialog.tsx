"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { useState } from "react"

type MCPServerConfig = {
  name: string
  type: "stdio" | "sse"
  enabled: boolean
  command?: string
  args?: string[]
  url?: string
  env?: Record<string, string>
}

type MCPServerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  server?: MCPServerConfig
  mode: "add" | "edit"
  onSuccess: () => void
}

export function MCPServerDialog({
  open,
  onOpenChange,
  server,
  mode,
  onSuccess,
}: MCPServerDialogProps) {
  const [formData, setFormData] = useState<MCPServerConfig>(() => ({
    name: server?.name || "",
    type: server?.type || "stdio",
    enabled: server?.enabled ?? true,
    command: server?.command || "npx",
    args: server?.args || [],
    url: server?.url || "",
    env: server?.env || {},
  }))

  const [argsInput, setArgsInput] = useState(
    server?.args?.join(" ") || "-y @modelcontextprotocol/server-"
  )
  const [envInput, setEnvInput] = useState(() => {
    if (server?.env) {
      return Object.entries(server.env)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    }
    return ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse args
      const args = argsInput.trim()
        ? argsInput.split(/\s+/).filter(Boolean)
        : []

      // Parse env
      const env: Record<string, string> = {}
      if (envInput.trim()) {
        envInput.split("\n").forEach((line) => {
          const [key, ...valueParts] = line.split("=")
          if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join("=").trim()
          }
        })
      }

      const payload: MCPServerConfig = {
        name: formData.name,
        type: formData.type,
        enabled: formData.enabled,
        ...(formData.type === "stdio"
          ? { command: formData.command, args, env }
          : { url: formData.url }),
      }

      const url =
        mode === "add" ? "/api/mcp/servers" : "/api/mcp/servers"
      const method = mode === "add" ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save server")
      }

      toast({
        title: mode === "add" ? "Server added" : "Server updated",
        status: "success",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving server:", error)
      toast({
        title: error instanceof Error ? error.message : "Failed to save server",
        status: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add MCP Server" : "Edit MCP Server"}
          </DialogTitle>
          <DialogDescription>
            Configure a Model Context Protocol server to extend chat
            capabilities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Server Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="github"
              required
              disabled={mode === "edit"}
            />
            <p className="text-muted-foreground text-xs">
              Unique identifier for this server (e.g., "github", "filesystem")
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "stdio" | "sse") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stdio">stdio (Local)</SelectItem>
                <SelectItem value="sse">SSE (Remote)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enabled Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">Enabled</Label>
              <p className="text-muted-foreground text-xs">
                Enable this server to load its tools
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
          </div>

          {/* stdio fields */}
          {formData.type === "stdio" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="command">
                  Command <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="command"
                  value={formData.command}
                  onChange={(e) =>
                    setFormData({ ...formData, command: e.target.value })
                  }
                  placeholder="npx"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="args">Arguments</Label>
                <Input
                  id="args"
                  value={argsInput}
                  onChange={(e) => setArgsInput(e.target.value)}
                  placeholder="-y @modelcontextprotocol/server-github"
                />
                <p className="text-muted-foreground text-xs">
                  Space-separated arguments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="env">Environment Variables</Label>
                <textarea
                  id="env"
                  value={envInput}
                  onChange={(e) => setEnvInput(e.target.value)}
                  placeholder="GITHUB_PERSONAL_ACCESS_TOKEN=ghp_..."
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
                <p className="text-muted-foreground text-xs">
                  One per line: KEY=value
                </p>
              </div>
            </>
          )}

          {/* SSE field */}
          {formData.type === "sse" && (
            <div className="space-y-2">
              <Label htmlFor="url">
                URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://example.com/mcp"
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                  ? "Add Server"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
