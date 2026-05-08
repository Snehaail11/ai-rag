import { generateEmbedding } from "../../../lib/embeddings"
import { retrieveSimilarLogs } from "../../../lib/retrieval"
import { buildPrompt } from "../../../lib/prompts"
import { generateCompletion } from "../../../lib/llm"

export async function POST(req: Request) {
  try {
    const { question, history = [] } = await req.json()

    if (!question) {
      return Response.json({ error: "Question is required" }, { status: 400 })
    }

    const queryEmbedding = await generateEmbedding(question)
    
    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      return Response.json({ error: "Failed to generate query embedding" }, { status: 500 })
    }

    const results = await retrieveSimilarLogs(queryEmbedding)

    const sources = results?.map((r: { text: string }) => r.text) || []
    const context = sources.join("\n\n") || ""

    console.log("Retrieved sources:", sources.length)
    console.log("Context:", context.substring(0, 200))

    const prompt = buildPrompt(context, question, history)

    const answer = await generateCompletion(prompt)

    return Response.json({ 
      answer,
      sources: sources.slice(0, 3),
      contextFound: sources.length > 0
    })
  } catch (error) {
    console.error("Query API Error:", error)
    return Response.json({ 
      answer: "I encountered an error while processing your request. Please make sure the backend services are properly configured.",
      error: "Server error"
    }, { status: 500 })
  }
}