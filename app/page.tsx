import LogForm from "../components/LogForm"
import QueryForm from "../components/QueryForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            AI-Powered Retrieval System
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Knowledge Assistant
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload documents, ask questions, and get AI-powered answers with source citations
          </p>
        </div>

        <div className="space-y-6">
          <LogForm />
          <QueryForm />
        </div>

        <footer className="text-center text-gray-600 text-sm mt-16">
          Powered by Next.js • Supabase • HuggingFace
        </footer>
      </div>
    </main>
  )
}