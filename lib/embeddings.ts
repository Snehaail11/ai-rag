/// <reference types="node" />

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const hfKey = process.env.HF_API_KEY
    
    if (!hfKey) {
      throw new Error("HF_API_KEY not found in environment variables")
    }
    
    console.log("Using HF key:", hfKey.substring(0, 10) + "...")
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("HF API error response:", errorText)
      throw new Error(`HF API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    let embedding: number[]
    if (Array.isArray(data)) {
      embedding = data[0]
    } else if (data.embeddings) {
      embedding = data.embeddings
    } else if (Array.isArray(data)) {
      embedding = data
    } else {
      console.error("Unexpected response format:", data)
      throw new Error("Invalid embedding response format")
    }
    
    console.log(`Generated embedding of dimension ${embedding.length}`)
    return embedding
  } catch (err) {
    console.error("Embedding generation error:", err)
    console.log("Using mock embedding as fallback")
    return new Array(384).fill(0).map(() => Math.random())
  }
}