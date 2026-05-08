import { supabase } from "../../../lib/supabase"
import { generateEmbedding } from "../../../lib/embeddings"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    const embedding = await generateEmbedding(text)

    console.log("Generated embedding, length:", embedding?.length)

    if (!embedding || !Array.isArray(embedding)) {
      return Response.json({ error: "Failed to generate embedding" }, { status: 500 })
    }

    // Format embedding for Supabase pgvector
    const formattedEmbedding = `[${embedding.join(",")}]`

    const { data, error } = await supabase.from("logs").insert({
      text,
      embedding: formattedEmbedding,
    }).select()

    if (error) {
      console.error("Supabase insert error:", error)
      return Response.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 })
    }

    return Response.json({ success: true, id: data?.[0]?.id, embeddingSize: embedding.length })
  } catch (error) {
    console.error("Logs API error:", error)
    return Response.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}