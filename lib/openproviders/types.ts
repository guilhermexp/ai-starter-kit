export type OpenAIModel =
  
  | "gpt-4.1"
  | "gpt-5.0-mini"
  | "gpt-4.1-mini"
  | "gpt-4.1-mini-2025-04-14"
  | "chatgpt-5o-latest"
  | "gpt-3.5-turbo"
  | "gpt-4-turbo"
  | "gpt-4.1-nano"
  | "gpt-4.5-preview"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1"
  | "o3-mini"
  | "o1-mini"
  | "o4-mini"

export type GeminiModel =
  | "gemini-2.0-flash-001"
  | "gemini-2.5-flash-lite-preview"
  | "gemini-2.5-flash-thinking"
  | "gemini-2.0-flash-exp"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-1.5-flash-002"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-pro-002"
  | "gemini-2.0-flash-lite-preview-02-05"
  | "gemini-2.5-pro-exp-03-25"
  | "gemma-3-27b-it"

export type XaiModel =
  | "grok-4-fast-reasoning"
  | "grok-4-fast-non-reasoning"
  | "grok-2"
  | "grok-2-vision"
  | "grok-3"
  | "grok-3-fast"
  | "grok-3-mini"
  | "grok-3-mini-fast"

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
