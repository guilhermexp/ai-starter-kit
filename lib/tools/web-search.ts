import { tool } from "ai"
import { z } from "zod"

export const webSearchTool = tool({
  description:
    "Search the web for current information, news, articles, and real-time data. Use this when you need up-to-date information or facts that may not be in your training data.",
  parameters: z.object({
    query: z.string().describe("The search query"),
    numResults: z
      .number()
      .optional()
      .default(5)
      .describe("Number of results to return (default: 5, max: 10)"),
  }),
  execute: async ({ query, numResults = 5 }) => {
    try {
      // Check if Exa API key is available
      const exaApiKey = process.env.EXA_API_KEY

      if (!exaApiKey) {
        return {
          error:
            "Web search is not configured. Please add EXA_API_KEY to your environment variables.",
          results: [],
        }
      }

      const { default: Exa } = await import("exa-js")
      const exa = new Exa(exaApiKey)

      const searchResults = await exa.searchAndContents(query, {
        numResults: Math.min(numResults, 10),
        text: { maxCharacters: 1000 },
      })

      const results = searchResults.results.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.text || "",
        publishedDate: result.publishedDate,
        score: result.score,
      }))

      return {
        query,
        results,
        totalResults: results.length,
      }
    } catch (error) {
      console.error("Web search error:", error)
      return {
        error: `Failed to search the web: ${error instanceof Error ? error.message : "Unknown error"}`,
        results: [],
      }
    }
  },
})
