import { tool } from "ai"
import { z } from "zod"

export const imageSearchTool = tool({
  description:
    "Search for images on the web. Use this when the user asks for images, pictures, or visual content related to a topic.",
  parameters: z.object({
    query: z.string().describe("The image search query"),
    numResults: z
      .number()
      .optional()
      .default(6)
      .describe("Number of images to return (default: 6, max: 10)"),
  }),
  execute: async ({ query, numResults = 6 }) => {
    try {
      // Check if Exa API key is available
      const exaApiKey = process.env.EXA_API_KEY

      if (!exaApiKey) {
        return {
          error:
            "Image search is not configured. Please add EXA_API_KEY to your environment variables.",
          content: [],
        }
      }

      const { default: Exa } = await import("exa-js")
      const exa = new Exa(exaApiKey)

      const searchResults = await exa.searchAndContents(query, {
        numResults: Math.min(numResults, 10),
        category: "tweet" as const, // Tweets often have images
      })

      // Extract images from results
      const images = searchResults.results
        .filter((result) => result.image)
        .map((result) => ({
          title: result.title,
          imageUrl: result.image,
          sourceUrl: result.url,
        }))
        .slice(0, numResults)

      return {
        query,
        content: [
          {
            type: "images" as const,
            results: images,
          },
        ],
        totalResults: images.length,
      }
    } catch (error) {
      console.error("Image search error:", error)
      return {
        error: `Failed to search images: ${error instanceof Error ? error.message : "Unknown error"}`,
        content: [],
      }
    }
  },
})
