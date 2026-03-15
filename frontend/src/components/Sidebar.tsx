// ===== File: frontend/src/components/Sidebar.tsx =====
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SettingsModal from './SettingsModal';
import axios from 'axios';

export default function Sidebar({ setLoadedSession }: any) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const[history, setHistory] = useState<any[]>([]);

  const fetchHistory = () => {
    axios.get("http://127.0.0.1:8000/history").then(res => setHistory(res.data));
  };

  useEffect(() => { fetchHistory(); },[]);

  const handleDelete = (e: any, id: str) => {
    e.stopPropagation();
    axios.delete(`http://127.0.0.1:8000/history/${id}`).then(fetchHistory);
  };

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    axios.post("http://127.0.0.1:8000/upload", formData).then(() => {
      alert("PDF Uploaded! The Smart Ingestion pipeline is updating the Knowledge Base in the background.");
    });
  };

  return (
    <div className="h-full w-[260px] p-4 flex flex-col justify-between bg-white dark:bg-gray-900/50">
      <div className="overflow-hidden flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2 shrink-0">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-lg">C</span>
          </div>
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500 dark:from-gray-100 dark:to-gray-400">
            AI Cortex
          </div>
        </div>

        <button onClick={() => window.location.reload()} className="flex shrink-0 items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white w-full py-2.5 rounded-xl mb-3 transition-all duration-200 shadow-lg shadow-indigo-500/20">
          <AddIcon fontSize="small" />
          <span className="text-sm font-medium">New Research</span>
        </button>

        <label className="flex shrink-0 items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 w-full py-2.5 rounded-xl mb-6 transition-all duration-200 cursor-pointer border border-transparent dark:border-white/10">
          <CloudUploadOutlinedIcon fontSize="small" />
          <span className="text-sm font-medium">Upload PDF Source</span>
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
        </label>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 shrink-0">
          Past Sessions
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto pb-4 pr-1">
          {history.length === 0 ? (
             <div className="text-xs text-gray-400 px-2">No history yet.</div>
          ) : history.map((session, i) => (
            <div 
              key={i} 
              onClick={() => setLoadedSession(session)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <ChatBubbleOutlineIcon fontSize="inherit" className="opacity-50 group-hover:opacity-100 shrink-0" />
                <span className="text-sm truncate">{session.query}</span>
              </div>
              <button 
                onClick={(e) => handleDelete(e, session.session_id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-white/5 shrink-0">
        <button onClick={() => setSettingsOpen(true)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-600 dark:text-gray-400 transition-colors">
          <SettingsOutlinedIcon fontSize="small" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}