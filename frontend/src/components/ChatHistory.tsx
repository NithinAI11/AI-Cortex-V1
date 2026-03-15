// ===== File: frontend/src/components/ChatHistory.tsx =====
import { useState } from "react";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import "../styles/report.css"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { DynamicChart, DynamicGraph } from './Visualizations'; // NEW: Import our visualizers

export default function ChatHistory({ messages }: any) {
  const[copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `AI_Cortex_Report.md`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {messages.map((m: any, i: number) => (
        <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
          
          <div className="flex-shrink-0 mt-1">
            {m.role === "user" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <PersonOutlineIcon fontSize="small" className="text-gray-500" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <AutoAwesomeIcon fontSize="small" className="text-white" />
              </div>
            )}
          </div>

          <div className={`max-w-[90%] w-full`}>
            {m.role === "user" ? (
              <div className="bg-indigo-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-5 py-3 rounded-2xl rounded-tr-sm w-fit ml-auto">
                <div className="text-[15px] leading-relaxed">{m.content}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                <div className="report w-full bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-white/5 p-8 rounded-2xl shadow-xl overflow-x-auto relative">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 1. SMART CITATIONS
                      a: ({ href, children }) => {
                        if (href?.startsWith('#source-')) {
                          const sourceIdx = parseInt(href.replace('#source-', '')) - 1;
                          const sourceData = m.sources ? m.sources[sourceIdx] : null;
                          const displayNum = children?.toString().replace(/\[|\]/g, '') || (sourceIdx + 1);
                          return (
                            <button 
                              onClick={() => sourceData && window.dispatchEvent(new CustomEvent('open-source', {detail: sourceData}))}
                              title={sourceData?.title || "View Source"}
                              className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 mx-0.5 relative -top-[2px] hover:bg-indigo-200 dark:hover:bg-indigo-500/40 transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm align-baseline"
                            >
                              {displayNum}
                            </button>
                          )
                        }
                        return <a href={href} target="_blank" className="text-indigo-500 hover:underline">{children}</a>
                      },
                      // 2. INTERCEPT CODE BLOCKS FOR CHARTS AND GRAPHS
                      code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''
                        
                        // Grab any extra tags the LLM put after the backticks (e.g. "json chart" -> meta = "chart")
                        const meta = node?.meta || '' 
                        
                        const codeString = String(children).replace(/\n$/, '')
                        
                        // Bulletproof check: is it tagged as chart/graph directly, OR in the meta tags?
                        const isChart = language === 'chart' || meta.includes('chart');
                        const isGraph = language === 'graph' || meta.includes('graph');
                        
                        if (!inline && isChart) {
                          return <DynamicChart code={codeString} />
                        }
                        if (!inline && isGraph) {
                          return <DynamicGraph code={codeString} />
                        }
                        
                        return !inline ? (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl overflow-x-auto text-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 my-4 shadow-inner">
                            <code className={className} {...props}>{children}</code>
                          </pre>
                        ) : (
                          <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                
                {/* Toolbar */}
                <div className="flex items-center justify-between px-2">
                  {m.verification && (
                    <div className="relative group flex items-center">
                      <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-default transition-all duration-300 ${m.verification.passed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400"}`}>
                        {m.verification.passed ? <VerifiedUserIcon fontSize="inherit"/> : <WarningAmberIcon fontSize="inherit"/>}
                        <span className="font-semibold tracking-wide">{m.verification.passed ? "Verified" : "Flagged"}</span>
                      </div>
                      <div className="absolute bottom-full left-0 mb-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-xl shadow-2xl border border-gray-700 dark:border-gray-800">
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                            {m.verification.passed ? <VerifiedUserIcon fontSize="small" className="text-green-400"/> : <WarningAmberIcon fontSize="small" className="text-red-400"/>}
                            <span className="font-bold text-sm">Guardrail Analysis</span>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-300">{m.verification.reason}</p>
                        </div>
                        <div className="absolute top-full left-6 w-3 h-3 bg-gray-900 dark:bg-black border-b border-r border-gray-700 dark:border-gray-800 transform rotate-45 -mt-1.5"></div>
                      </div>
                    </div>
                  )}

                  {m.content && m.content.length > 50 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={() => handleCopy(m.content, i)} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                        {copiedIndex === i ? <CheckIcon fontSize="small" className="text-green-500"/> : <ContentCopyIcon fontSize="small"/>} {copiedIndex === i ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => handleDownload(m.content)} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                        <DownloadIcon fontSize="small" /> Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}