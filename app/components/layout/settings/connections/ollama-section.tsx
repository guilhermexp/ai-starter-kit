"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { useState } from "react"

export function OllamaSection() {
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434")
  const [enableOllama, setEnableOllama] = useState(false) // Default disabled
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false) // Default collapsed

  // In client-side, we assume development mode (Ollama enabled) unless it's a production build
  const isLocked =
    typeof window !== "undefined" && window.location.hostname !== "localhost"

  const testConnection = async () => {
    if (!ollamaEndpoint) return

    setIsLoading(true)
    try {
      const response = await fetch(`${ollamaEndpoint}/api/tags`)
      if (response.ok) {
        toast({
          title: "Ollama connection successful",
          description: "You can now use Ollama to run models locally.",
        })
      } else {
        toast({
          title: "Ollama connection failed",
          description: "Please check your Ollama endpoint and try again.",
        })
      }
    } catch {
      toast({
        title: "Ollama connection failed",
        description: "Please check your Ollama endpoint and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-medium">Local Model Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure your local Ollama instance for running models locally.
          {isLocked && (
            <span className="mt-1 block text-orange-600 dark:text-orange-400">
              Ollama is disabled in production mode.
            </span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <span>Ollama</span>
              {isExpanded ? (
                <CaretUpIcon className="size-4" />
              ) : (
                <CaretDownIcon className="size-4" />
              )}
            </button>
            <Switch
              checked={enableOllama && !isLocked}
              onCheckedChange={setEnableOllama}
              disabled={isLocked}
            />
          </CardTitle>
        </CardHeader>
        {isExpanded && (
          <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ollama-endpoint">Endpoint</Label>
            <Input
              id="ollama-endpoint"
              type="url"
              placeholder="http://localhost:11434"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              disabled={!enableOllama || isLocked}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {isLocked
                ? "Endpoint is read-only in production mode."
                : "Default Ollama endpoint. Make sure Ollama is running locally."}
            </p>
          </div>

          {enableOllama && !isLocked && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={isLoading || !ollamaEndpoint}
              >
                {isLoading ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          )}

          {isLocked && (
            <div className="rounded-md bg-orange-50 p-3 dark:bg-orange-950/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Ollama is disabled in production deployments for performance and
                security.
              </p>
            </div>
          )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
