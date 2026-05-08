import { generateEmbedding } from "../../../lib/embeddings"

export async function GET() {
  try {
    const testText = "Hello, this is a test."
    const embedding = await generateEmbedding(testText)
    
    return Response.json({ 
      success: true, 
      text: testText,
      embeddingLength: embedding?.length || 0,
      embeddingSample: embedding?.slice(0, 5) || []
    })
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: String(error),
      message: "Failed to generate embedding"
    }, { status: 500 })
  }
}