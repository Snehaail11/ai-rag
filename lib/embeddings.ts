/// <reference types="node" />

export async function generateEmbedding(text: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    }
  )

  const data = await response.json()

  return data
}