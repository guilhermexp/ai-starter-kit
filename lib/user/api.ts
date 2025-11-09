import { defaultPreferences } from "@/lib/user-preference-store/utils"
import type { UserProfile } from "./types"

export async function getSupabaseUser() {
  // Local-only mode - no Supabase
  return { supabase: null, user: null }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  // Local-only mode - return guest profile
  return {
    id: "guest",
    email: "guest@localhost",
    display_name: "Guest",
    profile_image: "",
    anonymous: true,
    preferences: defaultPreferences,
  } as UserProfile
}
