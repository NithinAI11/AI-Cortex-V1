import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function AnswerPanel({ answer }: any) {

  if (!answer) return null

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-8">

      <div className="prose prose-slate max-w-none">

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {answer}
        </ReactMarkdown>

      </div>

    </div>
  )
}