// ===== File: frontend/src/components/SourcesPanel.tsx =====
import { useState, useEffect } from 'react';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SourceModal from './SourceModal';

export default function SourcesPanel({ sources }: any) {
  const[activeSource, setActiveSource] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Listen for Smart Citation clicks from the ChatHistory
  useEffect(() => {
    const handleOpenSource = (e: any) => {
      setActiveSource(e.detail);
      setModalOpen(true);
    };
    window.addEventListener('open-source', handleOpenSource);
    return () => window.removeEventListener('open-source', handleOpenSource);
  },[]);

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900/50 h-full flex flex-col overflow-hidden relative border-l border-gray-200 dark:border-white/5">
        <div className="h-14 px-6 flex items-center border-b border-gray-200 dark:border-white/5 shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          {activeSource ? (
            <button onClick={() => setActiveSource(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
              <ArrowBackIcon fontSize="small" /> Back to list
            </button>
          ) : (
            <h2 className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ArticleOutlinedIcon fontSize="small" className="text-indigo-500 dark:text-indigo-400" />
              Retrieved Context
            </h2>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!sources || sources.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-10">No sources retrieved.</div>
          ) : activeSource ? (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                    {activeSource.source || 'Document'}
                  </span>
                  <button onClick={() => setModalOpen(true)} className="text-gray-400 hover:text-indigo-500 transition-colors p-1 bg-gray-100 dark:bg-white/5 rounded">
                    <OpenInFullIcon fontSize="inherit" />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">{activeSource.title}</h3>
                <div className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed overflow-y-auto flex-1 pr-2 pb-4 font-serif">
                  {activeSource.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((s: any, i: number) => (
                <div key={i} onClick={() => setActiveSource(s)} className="group bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-white/5 rounded-xl p-4 cursor-pointer shadow-sm hover:border-indigo-500/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300">{i}</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.source || 'Doc'}</span>
                  </div>
                  <div className="font-medium text-[13px] text-gray-800 dark:text-gray-200 leading-snug line-clamp-3 group-hover:text-indigo-500">{s.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {modalOpen && <SourceModal source={activeSource} onClose={() => setModalOpen(false)} />}
    </>
  )
}