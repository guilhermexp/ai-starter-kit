/**
 * Local storage system - replaces database
 * Uses localStorage for simple data and IndexedDB for complex data
 */

import { get, set, del, keys, clear } from "idb-keyval"

const isClient = typeof window !== "undefined"
const isIndexedDBAvailable = isClient && typeof indexedDB !== "undefined"

// In-memory fallback for server-side or when IndexedDB is not available
const memoryStore: Map<string, any> = new Map()

// Safe wrappers for idb-keyval that fall back to memory storage
async function safeGet<T>(key: string): Promise<T | undefined> {
  if (isIndexedDBAvailable) {
    try {
      return await get<T>(key)
    } catch (error) {
      console.warn(`IndexedDB get failed for ${key}, using memory:`, error)
      return memoryStore.get(key)
    }
  }
  return memoryStore.get(key)
}

async function safeSet(key: string, value: any): Promise<void> {
  if (isIndexedDBAvailable) {
    try {
      await set(key, value)
      return
    } catch (error) {
      console.warn(`IndexedDB set failed for ${key}, using memory:`, error)
    }
  }
  memoryStore.set(key, value)
}

async function safeDel(key: string): Promise<void> {
  if (isIndexedDBAvailable) {
    try {
      await del(key)
      return
    } catch (error) {
      console.warn(`IndexedDB del failed for ${key}, using memory:`, error)
    }
  }
  memoryStore.delete(key)
}

async function safeClear(): Promise<void> {
  if (isIndexedDBAvailable) {
    try {
      await clear()
      return
    } catch (error) {
      console.warn(`IndexedDB clear failed, using memory:`, error)
    }
  }
  memoryStore.clear()
}

// Simple user ID management
export function getOrCreateUserId(): string {
  if (!isClient) {
    return `server_guest_${Date.now()}`
  }

  const existingId = localStorage.getItem("app_user_id")
  if (existingId) return existingId

  const newId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem("app_user_id", newId)
  return newId
}

export function getUserId(): string | null {
  if (!isClient) return null
  return localStorage.getItem("app_user_id")
}

// User preferences
export type UserPreferences = {
  layout: string
  show_tool_invocations: boolean
  show_conversation_previews: boolean
  multi_model_enabled: boolean
  hidden_models: string[]
  system_prompt?: string
}

const DEFAULT_PREFERENCES: UserPreferences = {
  layout: "fullscreen",
  show_tool_invocations: true,
  show_conversation_previews: true,
  multi_model_enabled: false,
  hidden_models: [],
}

export async function getUserPreferences(): Promise<UserPreferences> {
  try {
    const prefs = await safeGet<UserPreferences>("user_preferences")
    return prefs || DEFAULT_PREFERENCES
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export async function setUserPreferences(
  prefs: Partial<UserPreferences>
): Promise<void> {
  const current = await getUserPreferences()
  await safeSet("user_preferences", { ...current, ...prefs })
}

// Chat messages
export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
  experimental_attachments?: any[]
}

export type Chat = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pinned?: boolean
  model?: string
}

export async function getChats(): Promise<Chat[]> {
  try {
    const chats = await safeGet<Chat[]>("chats")
    return chats || []
  } catch {
    return []
  }
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const messages = await safeGet<Message[]>(`chat_messages_${chatId}`)
    return messages || []
  } catch {
    return []
  }
}

export async function saveChatMessage(
  chatId: string,
  message: Message
): Promise<void> {
  const messages = await getChatMessages(chatId)
  messages.push(message)
  await safeSet(`chat_messages_${chatId}`, messages)

  // Update chat's updatedAt
  const chats = await getChats()
  const chatIndex = chats.findIndex((c) => c.id === chatId)
  if (chatIndex !== -1) {
    chats[chatIndex].updatedAt = new Date().toISOString()
    await safeSet("chats", chats)
  }
}

export async function saveChat(chat: Chat): Promise<void> {
  const chats = await getChats()
  const existingIndex = chats.findIndex((c) => c.id === chat.id)

  if (existingIndex !== -1) {
    chats[existingIndex] = chat
  } else {
    chats.push(chat)
  }

  await safeSet("chats", chats)
}

export async function deleteChat(chatId: string): Promise<void> {
  // Delete messages
  await safeDel(`chat_messages_${chatId}`)

  // Delete chat
  const chats = await getChats()
  const filtered = chats.filter((c) => c.id !== chatId)
  await safeSet("chats", filtered)
}

export async function toggleChatPin(chatId: string): Promise<void> {
  const chats = await getChats()
  const chatIndex = chats.findIndex((c) => c.id === chatId)

  if (chatIndex !== -1) {
    chats[chatIndex].pinned = !chats[chatIndex].pinned
    await safeSet("chats", chats)
  }
}

export async function updateChatModel(
  chatId: string,
  model: string
): Promise<void> {
  const chats = await getChats()
  const chatIndex = chats.findIndex((c) => c.id === chatId)

  if (chatIndex !== -1) {
    chats[chatIndex].model = model
    chats[chatIndex].updatedAt = new Date().toISOString()
    await safeSet("chats", chats)
  }
}

// API Keys storage (encrypted)
export type ApiKey = {
  provider: string
  encryptedKey: string
  iv: string
  createdAt: string
}

export async function getApiKeys(): Promise<ApiKey[]> {
  try {
    const keys = await safeGet<ApiKey[]>("api_keys")
    return keys || []
  } catch {
    return []
  }
}

export async function saveApiKey(apiKey: ApiKey): Promise<void> {
  const keys = await getApiKeys()
  const existingIndex = keys.findIndex((k) => k.provider === apiKey.provider)

  if (existingIndex !== -1) {
    keys[existingIndex] = apiKey
  } else {
    keys.push(apiKey)
  }

  await safeSet("api_keys", keys)
}

export async function deleteApiKey(provider: string): Promise<void> {
  const keys = await getApiKeys()
  const filtered = keys.filter((k) => k.provider !== provider)
  await safeSet("api_keys", filtered)
}

export async function getApiKey(provider: string): Promise<ApiKey | null> {
  const keys = await getApiKeys()
  return keys.find((k) => k.provider === provider) || null
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await safeClear()
  if (isClient) {
    localStorage.clear()
  }
}
