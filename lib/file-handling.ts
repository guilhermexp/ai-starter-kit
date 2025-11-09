import { toast } from "@/components/ui/toast"
import * as fileType from "file-type"
import { DAILY_FILE_UPLOAD_LIMIT } from "./config"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export type Attachment = {
  name: string
  contentType: string
  url: string
}

export async function validateFile(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File type not allowed",
    }
  }

  return { valid: true }
}

/**
 * Handle file attachments (local-only mode - uses base64 data URLs)
 */
export async function handleFileAttachments(
  files: File[],
  userId: string
): Promise<Attachment[]> {
  const attachments: Attachment[] = []

  for (const file of files) {
    try {
      const validation = await validateFile(file)
      if (!validation.valid) {
        toast({
          title: `File validation failed: ${file.name}`,
          description: validation.error,
          status: "error",
        })
        continue
      }

      // Convert file to base64 data URL for local storage
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      attachments.push({
        name: file.name,
        contentType: file.type,
        url: dataUrl, // Use data URL instead of remote storage
      })
    } catch (err) {
      console.error(`Failed to process file ${file.name}:`, err)
      toast({
        title: `Failed to upload ${file.name}`,
        description: "An error occurred while processing the file",
        status: "error",
      })
    }
  }

  return attachments
}

/**
 * Check daily file upload count (disabled in local-only mode)
 */
export async function checkDailyFileUploadCount(
  userId: string
): Promise<number> {
  // Local-only mode - no limits
  return 0
}

/**
 * Alias for backward compatibility
 */
export const checkFileUploadLimit = checkDailyFileUploadCount

/**
 * Process files (local-only mode - uses base64 data URLs)
 */
export const processFiles = handleFileAttachments
