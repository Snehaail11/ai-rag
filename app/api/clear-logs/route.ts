import { supabase } from "../../../lib/supabase"

export async function DELETE() {
  try {
    // Get all IDs and delete them
    const { data: logs, error: fetchError } = await supabase.from("logs").select("id")
    
    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }
    
    if (!logs || logs.length === 0) {
      return Response.json({ success: true, message: "Already empty" })
    }

    const ids = logs.map((l: { id: string }) => l.id)
    const { error: deleteError } = await supabase.from("logs").delete().in("id", ids)
    
    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 })
    }

    return Response.json({ success: true, deleted: ids.length })
  } catch {
    return Response.json({ error: "Failed to clear logs" }, { status: 500 })
  }
}