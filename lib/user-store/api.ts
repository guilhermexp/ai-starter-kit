/**
 * User store API (disabled - app uses local storage only)
 */
import { toast } from "@/components/ui/toast"
import type { UserProfile } from "@/lib/user/types"

export async function fetchUserProfile(
  id: string
): Promise<UserProfile | null> {
  // Local-only mode - no user profiles
  return null
}

export async function updateUserProfile(
  id: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  // Local-only mode - no user profiles
  return false
}

export async function signOutUser(): Promise<boolean> {
  toast({
    title: "Sign out is not supported in this deployment",
    status: "info",
  })
  return false
}

export function subscribeToUserUpdates(
  userId: string,
  onUpdate: (newData: Partial<UserProfile>) => void
) {
  // Local-only mode - no real-time updates
  return () => {}
}
