import type { Provider, SupportedModel } from "./types"

// map each model ID to its provider
const MODEL_PROVIDER_MAP: Record<string, Provider> = {
  o1: "openai",
  "gpt-4.1": "openai",
  "gpt-4.1-2025-04-14": "openai",
  "gpt-5.0-mini": "openai",

  // Google
  "gemini-2.0-flash-001": "google",
  "gemini-2.5-pro-exp-03-25": "google",
  "gemini-2.0-flash-lite-preview-02-05": "google",
  "gemini-2.0-pro-exp-02-05": "google",
  "gemini-2.0-flash-thinking-exp-01-21": "google",
  "gemini-2.0-flash-exp": "google",

  // XAI
  "grok-4-fast-reasoning": "xai",
  "grok-4-fast-non-reasoning": "xai",
}

export function getProviderForModel(model: SupportedModel): Provider {
  if (model.startsWith("openrouter:")) {
    return "openrouter"
  }

  // Check the static mapping
  const provider = MODEL_PROVIDER_MAP[model]
  if (provider) return provider

  throw new Error(`Unknown provider for model: ${model}`)
}
