import { supabase } from "../../../lib/supabase"

export async function GET() {
  const results: Record<string, unknown> = {}

  try {
    const { data: tables, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
    
    results.tables = tables?.map((t: { table_name: string }) => t.table_name) || []
    results.tableError = tableError?.message
  } catch {
    results.tableError = "Failed to fetch tables"
  }

  try {
    const { data: logsData, error: logsError } = await supabase
      .from("logs")
      .select("id, text")
      .limit(3)
    
    results.logs = logsData
    results.logsError = logsError?.message
  } catch {
    results.logsError = "Logs table not accessible"
  }

  try {
    const testEmbedding = Array(384).fill(0.01)
    const { error: rpcError } = await supabase.rpc("match_logs", {
      query_embedding: testEmbedding,
      match_count: 1,
    })
    
    results.rpcWorks = !rpcError
    results.rpcError = rpcError?.message
  } catch {
    results.rpcWorks = false
    results.rpcError = "RPC function not found or not accessible"
  }

  return Response.json(results)
}