export function buildPrompt(context: string, question: string) {
  return `
You are an AI assistant.
Answer ONLY using the provided logs.
If information is insufficient, say that clearly.

Logs:
${context}

Question:
${question}
`
}