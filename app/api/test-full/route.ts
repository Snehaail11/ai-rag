import { generateEmbedding } from "../../../lib/embeddings"
import { supabase } from "../../../lib/supabase"
import { buildPrompt } from "../../../lib/prompts"
import { generateCompletion } from "../../../lib/llm"

export async function POST(req: Request) {
  try {
    const { text, question } = await req.json()

    // Step 1: Add to knowledge base
    const embedding = await generateEmbedding(text)
    const formattedEmbedding = `[${embedding.join(",")}]`

    const { data: insertData, error: insertError } = await supabase.from("logs").insert({
      text,
      embedding: formattedEmbedding,
    }).select()

    if (insertError) {
      return Response.json({ error: "Failed to insert", details: insertError }, { status: 500 })
    }

    // Step 2: Query it
    const queryEmbedding = await generateEmbedding(question)
    const { data: results } = await supabase.rpc("match_logs", {
      query_embedding: queryEmbedding,
      match_count: 5,
    })

    const sources = results?.map((r: { text: string }) => r.text) || []
    const context = sources.join("\n\n")

    const prompt = buildPrompt(context, question, [])
    const answer = await generateCompletion(prompt)

    return Response.json({
      success: true,
      inserted: insertData,
      sourcesFound: sources.length,
      context,
      answer
    })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}