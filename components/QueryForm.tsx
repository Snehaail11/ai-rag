"use client"

import { useState } from "react"
import ResponseBox from "./ResponseBox"

export default function QueryForm() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAnswer("")

    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })

    let data

try {
  data = await res.json()
} catch (err) {
  setAnswer("Invalid server response.")
  setLoading(false)
  return
}

setAnswer(data?.answer || "No response.")
setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ask Question</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && <ResponseBox answer={answer} />}
    </div>
  )
}