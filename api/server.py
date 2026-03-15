# ===== File: api/server.py =====
import queue
import threading
import json
import uuid
import os
import shutil
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from orchestration.graph import build_graph
from core.connections import chat_col
from data_pipeline.ingest import run_ingestion

app = FastAPI()
graph = build_graph()

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

os.makedirs("data/pdfs", exist_ok=True)
app.mount("/pdfs", StaticFiles(directory="data/pdfs"), name="pdfs")

@app.get("/history")
def get_history():
    if chat_col is None: return[]
    return list(chat_col.find({}, {"_id": 0}).sort("timestamp", -1).limit(15))

# NEW: Delete a session
@app.delete("/history/{session_id}")
def delete_session(session_id: str):
    if chat_col is not None:
        chat_col.delete_one({"session_id": session_id})
    return {"status": "deleted"}

# NEW: Upload PDF manually
@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    path = f"data/pdfs/{file.filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Run the smart ingestion in the background so the UI doesn't hang
    threading.Thread(target=run_ingestion).start()
    return {"status": "success", "filename": file.filename}

@app.get("/stream")
def stream_ask(q: str):
    q_out = queue.Queue()
    session_id = str(uuid.uuid4())

    def stream_cb(token): q_out.put({"type": "token", "content": token})
    def log_cb(msg): q_out.put({"type": "log", "message": msg})

    def run_graph():
        try:
            state = {"query": q, "stream_callback": stream_cb, "log_callback": log_cb}
            final_state = None
            for step in graph.stream(state):
                node_name = list(step.keys())[0]
                final_state = step[node_name]
                q_out.put({"type": "node", "name": node_name})
                if node_name == "verify":
                    ver = final_state.get("verification", {})
                    q_out.put({"type": "verification", "passed": ver.get("passed"), "reason": ver.get("reason")})
            
            # SAVING FULL SOURCES TO MONGO FOR HISTORY RELOADS
            if chat_col is not None and final_state:
                chat_col.insert_one({
                    "session_id": session_id,
                    "query": q,
                    "answer": final_state.get("answer", ""),
                    "sources": final_state.get("sources",[]), 
                    "timestamp": datetime.utcnow()
                })

            q_out.put({"type": "result", "sources": final_state.get("sources",[])})
            q_out.put({"type": "done"})
            q_out.put(None)
        except Exception as e:
            q_out.put({"type": "error", "message": str(e)})
            q_out.put(None)

    threading.Thread(target=run_graph).start()

    def event_generator():
        while True:
            item = q_out.get()
            if item is None: break
            yield f"data: {json.dumps(item)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")