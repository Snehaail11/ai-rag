import { generateEmbedding } from "../../../lib/embeddings"
import { retrieveSimilarLogs } from "../../../lib/retrieval"
import { buildPrompt } from "../../../lib/prompts"
import { generateCompletion } from "../../../lib/llm"

export async function POST(req: Request) {
  const { question } = await req.json()

  const queryEmbedding = await generateEmbedding(question)

  const results = await retrieveSimilarLogs(queryEmbedding)

  const context = results?.map((r: any) => r.text).join("\n") || ""

  const prompt = buildPrompt(context, question)

  const answer = await generateCompletion(prompt)

  return Response.json({ answer })
}