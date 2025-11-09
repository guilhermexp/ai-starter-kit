import { decryptKey } from "./encryption"
import { getApiKey } from "./local-storage"
import { env } from "./openproviders/env"
import { Provider } from "./openproviders/types"

export type { Provider } from "./openproviders/types"
export type ProviderWithoutOllama = Provider

export async function getUserKey(
  userId: string,
  provider: Provider
): Promise<string | null> {
  try {
    const apiKey = await getApiKey(provider)
    if (!apiKey) return null

    return decryptKey(apiKey.encryptedKey, apiKey.iv)
  } catch (error) {
    console.error("Error retrieving user key:", error)
    return null
  }
}

export async function getEffectiveApiKey(
  userId: string | null,
  provider: ProviderWithoutOllama
): Promise<string | null> {
  if (userId) {
    const userKey = await getUserKey(userId, provider)
    if (userKey) return userKey
  }

  const envKeyMap: Record<ProviderWithoutOllama, string | undefined> = {
    openai: env.OPENAI_API_KEY,
    google: env.GOOGLE_GENERATIVE_AI_API_KEY,
    xai: env.XAI_API_KEY,
    openrouter: env.OPENROUTER_API_KEY,
  }

  return envKeyMap[provider] || null
}
