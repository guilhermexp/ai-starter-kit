import type {
  ChatApiParams,
  LogUserMessageParams,
  StoreAssistantMessageParams,
} from "@/app/types/api.types"
import { FREE_MODELS_IDS, NON_AUTH_ALLOWED_MODELS } from "@/lib/config"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { getUserKey } from "@/lib/user-keys"

/**
 * Validate and track usage (local-only mode - simplified)
 */
export async function validateAndTrackUsage({
  userId,
  model,
  isAuthenticated,
}: ChatApiParams): Promise<void> {
  // Check if user is authenticated
  if (!isAuthenticated) {
    // For unauthenticated users, only allow specific models
    if (!NON_AUTH_ALLOWED_MODELS.includes(model)) {
      throw new Error(
        "This model requires authentication. Please sign in to access more models."
      )
    }
  } else {
    // For authenticated users, check API key requirements
    const provider = getProviderForModel(model as any)

    const userApiKey = await getUserKey(userId, provider)

    // If no API key and model is not in free list, deny access
    if (!userApiKey && !FREE_MODELS_IDS.includes(model)) {
      throw new Error(
        `This model requires an API key for ${provider}. Please add your API key in settings or use a free model.`
      )
    }
  }

  // Local-only mode - no usage limits
}

/**
 * Log user message (local-only mode - using IndexedDB)
 */
export async function logUserMessage(
  params: LogUserMessageParams
): Promise<void> {
  // Local-only mode - messages are stored via IndexedDB in the chat store
  // No database logging needed
}

/**
 * Store assistant message (local-only mode - using IndexedDB)
 */
export async function storeAssistantMessage(
  params: StoreAssistantMessageParams
): Promise<void> {
  // Local-only mode - messages are stored via IndexedDB in the chat store
  // No database logging needed
}
