export type OpenAIModel =
  
  | "gpt-4.1"
  | "gpt-5.0-mini"
  | "gpt-4.1-mini"
  | "gpt-4.1-mini-2025-04-14"
  | "chatgpt-5o-latest"

export type GeminiModel =
  | "gemini-2.0-flash-001"
  | "gemini-2.5-flash-lite-preview"
  | "gemini-2.5-flash-thinking"
  | "gemini-2.0-flash-exp"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"

export type XaiModel =
  | "grok-4-fast-reasoning"
  | "grok-4-fast-non-reasoning"

export type OpenRouterModel =
  | "openrouter:deepseek/deepseek-r1:free"
  | "openrouter:anthropic/claude-3.7-sonnet:thinking"
  | "openrouter:google/gemini-2.5-pro-preview"
  | "openrouter:openai/gpt-4.1"
  | "openrouter:openai/o4-mini"
  | "openrouter:x-ai/grok-3-mini-beta"
  | "openrouter:google/gemini-2.5-flash-preview-05-20"

export type Provider =
  | "openai"
  | "google"
  | "xai"
  | "openrouter"

export type SupportedModel =
  | OpenAIModel
  | GeminiModel
  | XaiModel
  | OpenRouterModel
