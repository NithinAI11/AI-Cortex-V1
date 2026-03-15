// ===== File: frontend/src/services/api.ts =====
import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

export async function askAI(query: string) {
  const res = await API.get("/ask", { params: { q: query } })
  return res.data
}

export function streamAskAI(query: string, onEvent: (data: any) => void) {
  const url = `http://127.0.0.1:8000/stream?q=${encodeURIComponent(query)}`;
  const evtSource = new EventSource(url);

  evtSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    onEvent(data);
    if (data.type === 'done' || data.type === 'error') {
      evtSource.close();
    }
  };

  evtSource.onerror = () => {
    evtSource.close();
    onEvent({ type: 'error', message: 'Connection to AI Cortex failed.' });
  };
}