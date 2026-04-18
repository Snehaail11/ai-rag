import { supabase } from "../../../lib/supabase"
import { generateEmbedding } from "../../../lib/embeddings"

export async function POST(req: Request) {
  const { text } = await req.json()

  const embedding = await generateEmbedding(text)

  await supabase.from("logs").insert({
    text,
    embedding,
  })

  return Response.json({ success: true })
}