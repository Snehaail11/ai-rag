import { supabase } from "./supabase"

export async function retrieveSimilarLogs(queryEmbedding: number[]) {
  const { data } = await supabase.rpc("match_logs", {
    query_embedding: queryEmbedding,
    match_count: 5,
  })

  return data
}