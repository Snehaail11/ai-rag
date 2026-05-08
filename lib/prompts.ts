interface Message {
  role: "user" | "assistant"
  content: string
}

export function buildPrompt(context: string, question: string, history: Message[] = []) {
  const historySection = history.length > 0 
    ? `Previous Conversation:\n${history.map(m => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n")}\n\n`
    : ""

  const hasContext = context && context.trim().length > 0
  const contextInstruction = hasContext 
    ? `IMPORTANT: You MUST analyze ALL information in the knowledge base below. List EVERY relevant point that relates to the user's question.\n\nKnowledge Base:\n${context}\n\n`
    : ""

  return `
You are a helpful AI assistant with access to a knowledge base.

${historySection}
${contextInstruction}
User Question: ${question}

Instructions:
- Analyze ALL retrieved documents from the knowledge base
- List EVERY relevant factor from the knowledge base that relates to the question
- Combine all relevant information into a comprehensive answer
- Do NOT summarize or pick just one - mention ALL relevant points
- Format your answer with bullet points for clarity
- Only use general knowledge if the knowledge base has NO relevant information

Your response:
`}