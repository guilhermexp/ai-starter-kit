import { saveChat, type Chat } from "@/lib/local-storage"

type CreateChatInput = {
  userId: string
  title?: string
  model: string
  isAuthenticated: boolean
  projectId?: string
}

export async function createChatInDb({
  userId,
  title,
  model,
  isAuthenticated,
  projectId,
}: CreateChatInput) {
  const chat: Chat = {
    id: crypto.randomUUID(),
    title: title || "New Chat",
    model,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await saveChat(chat)

  return {
    id: chat.id,
    user_id: userId,
    title: chat.title,
    model: chat.model,
    created_at: chat.createdAt,
    updated_at: chat.updatedAt,
  }
}
