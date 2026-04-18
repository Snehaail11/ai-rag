import LogForm from "../components/LogForm"
import QueryForm from "../components/QueryForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            AI RAG System
          </h1>
          <p className="text-gray-600">
            Retrieval-Augmented Generation using Next.js + Supabase + HuggingFace
          </p>
        </div>

        <LogForm />
        <QueryForm />

      </div>
    </main>
  )
}