import Gemini from "@/components/icons/gemini"
import Google from "@/components/icons/google"
import Grok from "@/components/icons/grok"
import OpenAI from "@/components/icons/openai"
import OpenRouter from "@/components/icons/openrouter"
import Xai from "@/components/icons/xai"

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const PROVIDERS: Provider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: OpenRouter,
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: OpenAI,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Gemini,
  },
  {
    id: "grok",
    name: "Grok",
    icon: Grok,
  },
  {
    id: "xai",
    name: "XAI",
    icon: Xai,
  },
  {
    id: "google",
    name: "Google",
    icon: Google,
  },
] as Provider[]
