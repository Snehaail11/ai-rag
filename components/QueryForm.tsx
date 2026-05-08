"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  sources?: string[]
  contextFound?: boolean
}

export default function QueryForm() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return

    const userQuestion = question
    setQuestion("")
    setLoading(true)

    const newMessages: Message[] = [...messages, { role: "user", content: userQuestion }]
    setMessages(newMessages)

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: userQuestion,
          history: messages 
        }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessages([...newMessages, { 
          role: "assistant", 
          content: data.answer,
          sources: data.sources || [],
          contextFound: data.contextFound
        }])
      } else {
        setMessages([...newMessages, { 
          role: "assistant", 
          content: "Sorry, I encountered an error. Please try again."
        }])
      }
    } catch {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Failed to connect to the server."
      }])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      <div className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20 px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              <p className="text-white/50 text-sm">Ask anything from your knowledge base</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto scrollbar-thin">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm mb-2">Ready to answer your questions</p>
              <p className="text-white/20 text-xs">Add knowledge first, then ask questions</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user" 
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white" 
                  : "bg-white/10 text-white/90 border border-white/10"
              }`}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                
                {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-emerald-400">✓</span>
                      <p className="text-xs text-emerald-400">Retrieved {msg.sources.length} relevant document(s) from knowledge base</p>
                    </div>
                    <div className="space-y-1">
                      {msg.sources.map((src, j) => (
                        <div key={j} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60 truncate">
                          📄 {src}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.role === "assistant" && msg.contextFound === false && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-400">⚠</span>
                      <p className="text-xs text-amber-400">No relevant context found in knowledge base. Using general knowledge.</p>
                    </div>
                  </div>
                )}
                
                {msg.role === "assistant" && (
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => copyToClipboard(msg.content)}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-white/50 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 text-white placeholder:text-white/30 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}