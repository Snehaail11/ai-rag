"use client"

import { useState } from "react"
import KnowledgeViewer from "./KnowledgeViewer"

export default function LogForm() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [showTips, setShowTips] = useState(true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    
    setLoading(true)
    setStatus("idle")
    setShowTips(false)

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        setStatus("success")
        setText("")
        setTimeout(() => {
          setStatus("idle")
          setShowTips(true)
        }, 3000)
      } else {
        setStatus("error")
        console.error("Index error:", data.error)
      }
    } catch (err) {
      setStatus("error")
      console.error("Index exception:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add Knowledge</h2>
              <p className="text-white/50 text-sm">Upload documents to your knowledge base</p>
            </div>
          </div>
          <div className="text-xs text-white/30 px-2 py-1 rounded bg-white/5">
            Embedding Store
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {showTips && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <p className="text-indigo-300 text-sm font-medium mb-2">💡 Tips for best results:</p>
            <ul className="text-white/50 text-sm space-y-1">
              <li>• Add ALL related info in ONE entry for best answers</li>
              <li>• Example: I have a meeting at 3pm, deadline tomorrow, working late</li>
              <li>• The AI will consider everything together</li>
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add all related info together (e.g., My name is John, I work at Google, I live in NYC)"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 text-white placeholder:text-white/30 transition-all"
            required
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/40">
              {text.length > 0 && `${text.length} characters`}
            </div>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-500/25"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {loading ? "Indexing..." : "Add to Index"}
            </button>
          </div>
          
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Successfully indexed! Ready for queries.</span>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Failed to index. Check your configuration.</span>
            </div>
          )}

          <KnowledgeViewer />
        </form>
      </div>
    </div>
  )
}
