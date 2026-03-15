// ===== File: frontend/src/components/QueryBar.tsx =====
import { useState } from "react"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function QueryBar({ onAsk, disabled }: any) {
  const [query, setQuery] = useState("")

  const submit = () => {
    if (!query || disabled) return
    onAsk(query)
    setQuery("")
  }

  return (
    <div className="glass-panel p-2 rounded-2xl flex items-center gap-3 transition-all duration-300 glow-focus">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Ask AI Cortex..."
        /* FIXED: Text colors now dynamically swap between dark gray (light mode) and light gray (dark mode) */
        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 text-[15px]"
        disabled={disabled}
      />
      <button
        onClick={submit}
        disabled={disabled || !query.trim()}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          query.trim() && !disabled 
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <ArrowUpwardIcon fontSize="small" />
      </button>
    </div>
  )
}