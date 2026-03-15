// ===== File: frontend/src/components/AgentTrace.tsx =====
import TerminalIcon from '@mui/icons-material/Terminal';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function AgentTrace({ isOpen, setIsOpen, logs, activeNode }: any) {
  const nodes = ['plan', 'retrieve', 'synthesize'];

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 transition-all duration-300 z-40 flex flex-col ${isOpen ? 'h-64 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]' : 'h-10'}`}>
      
      {/* Header Bar */}
      <div 
        className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <TerminalIcon fontSize="small" />
          <span className="text-xs font-mono font-medium tracking-wide uppercase">LangGraph Execution Trace</span>
          {activeNode && !isOpen && <span className="text-[10px] ml-2 text-indigo-500 animate-pulse">● Running</span>}
        </div>
        <div className="text-gray-400">
          {isOpen ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="flex-1 flex flex-col px-6 pb-4 overflow-hidden gap-4">
          
          {/* Visual Node Stepper */}
          <div className="flex items-center gap-4 mt-2">
            {nodes.map((node, i) => {
              const isActive = activeNode === node;
              const isPast = nodes.indexOf(activeNode || '') > i || (!activeNode && logs.length > 0);
              
              return (
                <div key={node} className="flex items-center gap-3">
                  <div className={`px-3 py-1 text-xs font-mono rounded-md border ${
                    isActive ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
                    isPast ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400' :
                    'border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                  }`}>
                    {node}
                  </div>
                  {i < nodes.length - 1 && <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></div>}
                </div>
              )
            })}
          </div>

          {/* Log Console */}
          <div className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg p-3 font-mono text-[11px] overflow-y-auto flex flex-col gap-1">
            {logs.length === 0 ? (
              <span className="text-gray-400 dark:text-gray-600 italic">Waiting for execution...</span>
            ) : (
              logs.map((log: string, idx: number) => (
                <div key={idx} className="text-gray-600 dark:text-gray-300 flex gap-2">
                  <span className="text-indigo-400 shrink-0">{'>'}</span> 
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}