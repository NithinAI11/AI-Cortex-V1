// ===== File: frontend/src/components/SourceModal.tsx =====
import CloseIcon from '@mui/icons-material/Close';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MemoryIcon from '@mui/icons-material/Memory';

export default function SourceModal({ source, onClose }: any) {
  if (!source) return null;

  const isPdf = source.source === 'pdf';
  const pdfUrl = isPdf ? `http://127.0.0.1:8000/pdfs/${encodeURIComponent(source.title)}` : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="h-16 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 bg-gray-50 dark:bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPdf ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}`}>
              {isPdf ? <ArticleOutlinedIcon fontSize="small" /> : <MemoryIcon fontSize="small" />}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight line-clamp-1">{source.title || "Knowledge Node"}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono mt-0.5">
                {source.source || "Database"} • {isPdf ? "Full Document Viewer" : "Semantic Vector Extraction"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-[#0a0a0a]">
          {isPdf ? (
            <iframe src={pdfUrl!} className="w-full h-full border-0 bg-white" title="PDF Viewer" />
          ) : (
            <div className="h-full overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto mt-4">
                
                <div className="flex items-center gap-2 mb-4 text-indigo-500 dark:text-indigo-400 px-4">
                  <MemoryIcon fontSize="small" />
                  <span className="text-xs font-bold uppercase tracking-widest">Exact Retrieved Vector Chunk</span>
                </div>

                <div className="bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-white/5 rounded-2xl p-10 relative">
                  <div className="absolute top-4 left-6 text-6xl text-gray-200 dark:text-gray-800 font-serif leading-none select-none">"</div>
                  
                  <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-serif text-lg leading-loose relative z-10 pt-4 px-6">
                    {source.content}
                  </p>
                  
                  <div className="absolute bottom-0 right-6 text-6xl text-gray-200 dark:text-gray-800 font-serif leading-none rotate-180 select-none">"</div>
                </div>

                <div className="mt-8 flex justify-center">
                  <p className="text-[11px] text-gray-500 dark:text-gray-500 text-center max-w-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <strong className="text-gray-700 dark:text-gray-400">Why does this look cut off?</strong><br/>
                    In Enterprise RAG architectures, large documents are mathematically split into "chunks" (usually 400 tokens) to ensure precise semantic retrieval and prevent AI hallucination. This is the exact raw node the AI evaluated.
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}