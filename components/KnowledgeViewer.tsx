"use client"

import { useState, useEffect } from "react"

interface LogEntry {
  id: string
  text: string
  created_at: string
}

export default function KnowledgeViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/debug")
      const data = await res.json()
      setLogs(data.logs || [])
    } catch {
      console.error("Failed to fetch logs")
    } finally {
      setLoading(false)
    }
  }

  const clearAll = async () => {
    if (!confirm("Delete ALL documents from knowledge base?")) return
    
    setDeleting(true)
    try {
      const res = await fetch("/api/clear-logs", { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setLogs([])
        alert("Knowledge base cleared!")
      } else {
        alert("Failed to clear: " + data.error)
      }
    } catch {
      alert("Failed to clear knowledge base")
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (isOpen && logs.length === 0) {
      fetchLogs()
    }
  }, [isOpen, logs.length])

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
        >
          {isOpen ? "▼" : "▶"} View Knowledge Base ({logs.length} documents)
        </button>
        
        {logs.length > 0 && (
          <button
            onClick={clearAll}
            disabled={deleting}
            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            {deleting ? "Clearing..." : "🗑️ Clear All"}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto">
          {loading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-white/40 text-sm">No documents in knowledge base. Add some first!</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="text-xs text-white/60 bg-white/5 p-2 rounded">
                  <span className="text-white/30">[{new Date(log.created_at).toLocaleDateString()}]</span> {log.text.substring(0, 100)}...
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}