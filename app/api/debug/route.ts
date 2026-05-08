import { supabase } from "../../../lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("logs")
      .select("id, text, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ 
      count: data?.length || 0, 
      logs: data 
    })
  } catch {
    return Response.json({ error: "Debug endpoint error" }, { status: 500 })
  }
}