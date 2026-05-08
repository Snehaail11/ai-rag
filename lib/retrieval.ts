import { supabase } from "./supabase"

export async function retrieveSimilarLogs(queryEmbedding: number[]) {
  try {
    const { data, error } = await supabase.rpc("match_logs", {
      query_embedding: queryEmbedding,
      match_count: 10,
    })

    if (error) {
      console.error("Retrieval error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Retrieval exception:", error)
    return []
  }
}