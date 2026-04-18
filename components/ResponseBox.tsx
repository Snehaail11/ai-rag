interface Props {
  answer: string
}

export default function ResponseBox({ answer }: Props) {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-2">AI Response</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
    </div>
  )
}