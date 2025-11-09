/**
 * Usage tracking (disabled - app uses local storage only)
 * All usage limits are removed in local-only mode
 */

// Stub functions for backward compatibility
export async function checkUsage(): Promise<any> {
  // Local-only mode - no usage tracking
  return { dailyLimit: Infinity, remaining: Infinity }
}

export async function incrementUsage(): Promise<void> {
  // Local-only mode - no usage tracking
}

export async function checkUsageByModel(): Promise<void> {
  // Local-only mode - no usage limits
}

export async function incrementUsageByModel(): Promise<void> {
  // Local-only mode - no usage tracking
}
