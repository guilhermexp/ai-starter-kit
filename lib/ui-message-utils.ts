import type { UIMessage } from "@ai-sdk/react"

/**
 * Helper functions to work with UIMessage structure in AI SDK 5.0
 * UIMessage uses a parts array instead of a simple content string
 */

/**
 * Extract text content from a UIMessage
 * @param message - The UIMessage to extract content from
 * @returns Combined text content from all text parts
 */
export function getMessageContent(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) {
    return ""
  }

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("")
}

/**
 * Extract file/attachment parts from a UIMessage
 * @param message - The UIMessage to extract files from
 * @returns Array of file parts
 */
export function getMessageFiles(message: UIMessage): Array<{
  type: string
  mediaType: string
  url: string
}> {
  if (!message.parts || message.parts.length === 0) {
    return []
  }

  return message.parts
    .filter((part) => part.type === "file" || part.type === "image")
    .map((part) => part as { type: string; mediaType: string; url: string })
}

/**
 * Check if a message has any text content
 * @param message - The UIMessage to check
 * @returns True if the message has text content
 */
export function hasTextContent(message: UIMessage): boolean {
  return getMessageContent(message).trim().length > 0
}

/**
 * Check if a message has any file attachments
 * @param message - The UIMessage to check
 * @returns True if the message has file attachments
 */
export function hasFiles(message: UIMessage): boolean {
  return getMessageFiles(message).length > 0
}

/**
 * Get tool invocation parts from a message
 * In AI SDK 5.0, tool parts use type like "tool-getWeather" or "dynamic-tool"
 */
export function getToolParts(message: UIMessage) {
  if (!message.parts || message.parts.length === 0) {
    return []
  }

  return message.parts.filter(
    (part) => part.type.startsWith("tool-") || part.type === "dynamic-tool"
  )
}

/**
 * Check if a part is a tool invocation part
 * Tool parts have types like "tool-getWeather" or "dynamic-tool"
 */
export function isToolPart(part: { type: string }): boolean {
  return part.type.startsWith("tool-") || part.type === "dynamic-tool"
}

/**
 * Helper type for tool parts with common properties
 */
export type ToolUIPart = {
  type: string
  toolCallId: string
  input?: unknown
  output?: unknown
  state: "input-streaming" | "input-available" | "output-available" | "output-error"
  toolName?: string
  errorText?: string
  providerExecuted?: boolean
}

/**
 * Type guard to check if a part is a tool part with the expected structure
 */
export function isToolUIPartWithState(part: unknown): part is ToolUIPart {
  return (
    typeof part === "object" &&
    part !== null &&
    "type" in part &&
    "toolCallId" in part &&
    "state" in part &&
    (typeof (part as { type: unknown }).type === "string" &&
      ((part as { type: string }).type.startsWith("tool-") ||
        (part as { type: string }).type === "dynamic-tool"))
  )
}

/**
 * Get reasoning parts from a message
 */
export function getReasoningParts(message: UIMessage) {
  if (!message.parts || message.parts.length === 0) {
    return []
  }

  return message.parts.filter((part) => part.type === "reasoning")
}

/**
 * Filter out messages with role "data" since UIMessage only supports "user", "assistant", "system"
 */
export function filterValidUIMessages(messages: unknown[]): UIMessage[] {
  return messages.filter((msg) => {
    if (typeof msg === "object" && msg !== null && "role" in msg) {
      const role = (msg as { role: string }).role
      return role === "user" || role === "assistant" || role === "system"
    }
    return false
  }) as UIMessage[]
}
