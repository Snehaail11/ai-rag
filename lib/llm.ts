/// <reference types="node" />

export async function generateCompletion(prompt: string) {
  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 200,
        }),
      }
    )

    const data = await response.json()
    console.log("HF RESPONSE:", data)

    return data.choices?.[0]?.message?.content || "No response."
  } catch (error) {
    console.error("LLM ERROR:", error)
    return "Something went wrong while generating response."
  }
}