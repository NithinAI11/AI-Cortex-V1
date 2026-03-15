// ===== File: frontend/src/pages/Workspace.tsx =====
import { useState, useRef, useEffect } from "react"
import ChatHistory from "../components/ChatHistory"
import QueryBar from "../components/QueryBar"
import AgentTrace from "../components/AgentTrace"
import { streamAskAI } from "../services/api"

export default function Workspace({ setSources, loadedSession, setLoadedSession }: any) {
  const[messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [traceOpen, setTraceOpen] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // NEW: React to history clicks!
  useEffect(() => {
    if (loadedSession) {
      setMessages([
        { role: "user", content: loadedSession.query },
        { 
          role: "assistant", 
          content: loadedSession.answer, 
          verification: { passed: true, reason: "Historical Session Reloaded." },
          sources: loadedSession.sources
        }
      ]);
      setSources(loadedSession.sources ||[]);
      setTraceOpen(false); // Hide trace for past sessions
    }
  },[loadedSession, setSources]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, traceOpen])

  const handleAsk = (query: string) => {
    setLoadedSession(null); // Clear loaded session state
    setMessages(prev => [...prev, { role: "user", content: query }])
    setMessages(prev =>[...prev, { role: "assistant", content: "", verification: null }])
    
    setLoading(true); setLogs([]); setActiveNode("plan"); setTraceOpen(true);
    let currentResponse = "";

    streamAskAI(query, (event) => {
      if (event.type === 'log') setLogs(prev =>[...prev, event.message]);
      else if (event.type === 'node') {
        if (event.name === 'plan') setActiveNode('retrieve');
        if (event.name === 'retrieve') setActiveNode('synthesize');
        if (event.name === 'synthesize') setActiveNode('verify'); 
        if (event.name === 'verify') setActiveNode(null); 
      } else if (event.type === 'token') {
        currentResponse += event.content;
        setMessages(prev => {
          const newMsg = [...prev]; newMsg[newMsg.length - 1].content = currentResponse; return newMsg;
        });
      } else if (event.type === 'result') {
        setSources(event.sources);
        setMessages(prev => {
          const newMsg = [...prev]; newMsg[newMsg.length - 1].sources = event.sources; return newMsg;
        });
      } else if (event.type === 'verification') {
        setMessages(prev => {
          const newMsg = [...prev]; newMsg[newMsg.length - 1].verification = { passed: event.passed, reason: event.reason }; return newMsg;
        });
      } else if (event.type === 'done' || event.type === 'error') {
        setLoading(false); setActiveNode(null); setTimeout(() => setTraceOpen(false), 2000);
      }
    });
  }

  return (
    <div className="relative h-full w-full bg-transparent overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto px-6 pt-6 pb-40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-4 rounded-2xl border border-indigo-500/20">
              <span className="text-4xl">🧠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Deep Research Workspace</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">AI Cortex uses autonomous workflows to dynamically synthesize and verify live data.</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <ChatHistory messages={messages} />
            <div ref={scrollRef} className="h-32"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center z-40 px-4 transition-transform duration-300 pointer-events-none" style={{ transform: `translateY(${traceOpen ? '-240px' : '0px'})` }}>
        <div className="w-full max-w-3xl pointer-events-auto">
          <QueryBar onAsk={handleAsk} disabled={loading} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50">
        <AgentTrace isOpen={traceOpen} setIsOpen={setTraceOpen} logs={logs} activeNode={activeNode} />
      </div>
    </div>
  )
}