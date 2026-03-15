// ===== File: frontend/src/components/Layout.tsx =====
import { useState } from "react"
import Sidebar from "./Sidebar"
import SourcesPanel from "./SourcesPanel"
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

export default function Layout({ children, sources, setLoadedSession }: any) {
  const[leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300"
      style={{ display: 'grid', gridTemplateColumns: `${leftOpen ? '260px' : '0px'} 1fr ${rightOpen ? '320px' : '0px'}`, transition: 'grid-template-columns 300ms ease-in-out' }}>
      
      <div className="overflow-hidden border-r border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900/50">
        <Sidebar setLoadedSession={setLoadedSession} />
      </div>

      <div className="flex flex-col h-screen relative bg-gray-50 dark:bg-gray-950/50 min-w-[400px]">
        <header className="h-14 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setLeftOpen(!leftOpen)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500">
              <ViewSidebarOutlinedIcon fontSize="small" />
            </button>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <h1 className="font-medium text-sm tracking-wide text-gray-600 dark:text-gray-300">
              AI Cortex <span className="text-gray-400 dark:text-gray-600">/</span> Intelligence
            </h1>
          </div>
          <button onClick={() => setRightOpen(!rightOpen)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500">
            <ArticleOutlinedIcon fontSize="small" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </div>

      <div className="overflow-hidden border-l border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900/50">
        <SourcesPanel sources={sources} />
      </div>
    </div>
  )
}