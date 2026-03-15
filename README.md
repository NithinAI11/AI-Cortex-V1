<div align="center">

<br/>

```
  █████╗  ██╗        ██████╗  ██████╗  ██████╗  ████████╗ ███████╗ ██╗  ██╗
 ██╔══██╗ ██║       ██╔════╝ ██╔═══██╗ ██╔══██╗ ╚══██╔══╝ ██╔════╝ ╚██╗██╔╝
 ███████║ ██║       ██║      ██║   ██║ ██████╔╝    ██║    █████╗    ╚███╔╝
 ██╔══██║ ██║       ██║      ██║   ██║ ██╔══██╗    ██║    ██╔══╝    ██╔██╗
 ██║  ██║ ██║       ╚██████╗ ╚██████╔╝ ██║  ██║    ██║    ███████╗ ██╔╝ ██╗
 ╚═╝  ╚═╝ ╚═╝        ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝    ╚══════╝ ╚═╝  ╚═╝

          ░░░░░░░░░  AI - CORTEX  ░░░░░░░░░
```

### **Agentic RAG · Market Intelligence · v1.0**

*A production-grade, multi-agent AI research system that plans, retrieves, synthesizes, and fact-checks — in real time.*

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-Orchestration-FF6B35?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC244C?style=for-the-badge&logo=databricks&logoColor=white)](https://qdrant.tech)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

<br/>

> **Built in 7 focused hours over a weekend.** An honest demonstration of applying advanced AI systems principles end-to-end — from ingestion pipeline to a dynamic, real-time intelligence dashboard.

<br/>

</div>

---

## 📺 Demo

<div align="center">

[![AI Cortex Demo](https://img.youtube.com/vi/AG9QtcqAsw4/maxresdefault.jpg)](https://youtu.be/AG9QtcqAsw4)

*▶ Click to watch: AI Cortex in action — query planning, retrieval, synthesis, and real-time fact verification*

</div>

---

## ✦ What Makes This Different

Most RAG demos are glorified wrappers around a single vector search call. AI Cortex is not that.

| Capability | Naive RAG | **AI Cortex** |
|---|---|---|
| Query Processing | Single search | Planning agent decomposes into 3–5 targeted queries |
| Retrieval | One-pass cosine similarity | Multi-query parallel search → deduplication → **cross-encoder reranking** |
| Duplicate Ingestion | Re-ingests everything | **Deterministic MD5-hashed IDs** → idempotent upserts |
| Output Format | Plain text | Structured reports + **LLM-generated charts & knowledge graphs** |
| Source Transparency | Maybe a list of sources | **Inline citations** + clickable source inspection modal |
| Quality Assurance | None | **FactCheckerAgent** — automated hallucination detection |
| Observability | Black box | **Live agent execution trace** in the UI |
| Performance | Cold every time | **Redis caching** on retrieval queries |

---

## 🏗 System Architecture

The system is built around a **4-node LangGraph orchestration graph** where each node is a specialized agent. State flows forward, with each agent building on the previous one's output.

```
╔══════════════════════════════════════════════════════════════════════╗
║                     LangGraph Orchestration Core                      ║
║                                                                        ║
║   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐   ║
║   │  PLAN     │───▶│ RETRIEVE  │───▶│SYNTHESIZE │───▶│  VERIFY   │   ║
║   │           │    │           │    │           │    │           │   ║
║   │ Decompose │    │Multi-Query│    │Structure  │    │Hallucina- │   ║
║   │ query →   │    │Semantic   │    │report +   │    │tion check │   ║
║   │ outline + │    │Search +   │    │tables +   │    │JSON output│   ║
║   │ sub-query │    │Reranking  │    │charts +   │    │passed/    │   ║
║   │ vectors   │    │+ Scoring  │    │citations  │    │flagged    │   ║
║   └───────────┘    └─────┬─────┘    └───────────┘    └───────────┘   ║
║                          │                                             ║
╚══════════════════════════╪═════════════════════════════════════════════╝
                           │
              ┌────────────▼────────────┐
              │   Retrieval Data Layer   │
              │                          │
              │  ┌──────────────────┐    │
              │  │  Redis Cache     │    │  ← Check first (hash of queries)
              │  └────────┬─────────┘    │
              │           │ miss         │
              │  ┌────────▼─────────┐    │
              │  │  Qdrant Vector   │    │  ← Dense embedding search
              │  │  DB (cosine)     │    │     BAAI/bge-small-en (384d)
              │  └────────┬─────────┘    │
              │           │              │
              │  ┌────────▼─────────┐    │
              │  │  Cross-Encoder   │    │  ← Rerank candidates
              │  │  Reranker        │    │     ms-marco-MiniLM-L-6-v2
              │  └────────┬─────────┘    │
              │           │              │
              │  ┌────────▼─────────┐    │
              │  │  Source Scoring  │    │  ← arXiv(1.5x) > GitHub(1.2x) > PDF(1.0x)
              │  └──────────────────┘    │
              └──────────────────────────┘
```

### Data Ingestion Pipeline

```
arXiv API ──────┐
                │    ┌─────────────┐    ┌──────────────────┐    ┌─────────┐
GitHub API ─────┼───▶│  Normalize  │───▶│ SemanticChunker  │───▶│ Embedder│
                │    │  & Clean    │    │ 400 tok / 80 ovlp│    │ BGE-small│
PDF (pdfplumber)│    └─────────────┘    └──────────────────┘    └────┬────┘
  + table extrac│                                                      │
                                                            ┌──────────▼──────────┐
                                                            │  Qdrant Upsert      │
                                                            │  (Deterministic IDs) │
                                                            │  MD5(content) → UUID │
                                                            └─────────────────────┘
```

---

## ⚙️ Technology Stack

### Backend
| Layer | Technology | Why |
|---|---|---|
| **API Server** | FastAPI + Uvicorn | Async-native, essential for SSE streaming |
| **Orchestration** | LangGraph | Stateful, cyclic multi-agent graphs |
| **LLM Inference** | Groq (LPU) | Highest token/s streaming available |
| **Vector DB** | Qdrant | Fast, filterable, cosine similarity |
| **Embeddings** | `BAAI/bge-small-en` (384d) | Best-in-class local, no API cost |
| **Reranking** | `cross-encoder/ms-marco-MiniLM-L-6-v2` | More accurate than bi-encoder for relevance |
| **Cache** | Redis | Query result caching for performance |
| **Storage** | MongoDB | Chat history and session state |
| **PDF Parsing** | pdfplumber | Text + structured table extraction |
| **Containerization** | Docker Compose | One-command infra setup |

### Frontend
| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + TypeScript + Vite | Fast, type-safe, modern toolchain |
| **Styling** | TailwindCSS | Utility-first, dark/light theming |
| **Charts** | Recharts | Renders LLM-generated JSON chart specs |
| **Graph Viz** | react-force-graph-2d | Interactive physics-based knowledge graphs |
| **Markdown** | react-markdown + remark-gfm | Table support + citation interception |
| **Streaming** | Browser EventSource (SSE) | Persistent connection for real-time token render |

---

## ✨ Key Features In Depth

### 🔍 Multi-Stage Precision Retrieval
The `RetrievalAgent` runs parallel semantic searches for each sub-query from the planner, deduplicates results by content hash, passes candidates through a cross-encoder reranker for precision, then applies source-trust scoring. The final context handed to the LLM is the highest-signal subset possible.

### 📊 LLM-Generated Visualizations
The `SynthesisAgent` is prompted to embed structured data directly in its markdown output inside fenced code blocks (` ```chart ` and ` ```graph `). The React frontend intercepts these blocks via a custom `ReactMarkdown` component renderer and dynamically mounts `<DynamicChart>` (Recharts) or `<DynamicGraph>` (react-force-graph-2d) components in place.

### 🔗 Smart Citations & Source Inspection
Every factual claim in a report is cited via `[[1]](#source-1)` style links. The frontend overrides the `<a>` renderer to render these as interactive `<button>` elements that dispatch a custom browser event. The `SourcesPanel` catches this event and surfaces the exact retrieved text chunk — and if the source is a PDF, a full document preview via an `<iframe>` served from FastAPI.

### 🛡️ FactChecker Guardrail
After synthesis, a dedicated `FactCheckerAgent` LLM call compares the generated report against its source context, checking for blatant contradictions or fabricated statistics. It returns a strict `{"passed": bool, "reason": string}` JSON, rendered in the UI as a **Verified** or **Flagged** badge.

### 🔒 Deterministic Ingestion
Every document chunk is assigned an ID derived from `UUID(MD5(content))`. Qdrant's `upsert` semantics mean re-running the pipeline never creates duplicates — it just overwrites identical points. The pipeline is fully idempotent.

### 📡 Real-Time Agent Observability
The backend streams structured SSE events of distinct types — `token`, `log`, `node`, `verification`, `result`. The UI maintains a live **Agent Execution Trace** panel that highlights the active graph node and streams log messages as the agents run.

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Python 3.10+
- Node.js 18+
- A free [Groq API Key](https://console.groq.com)

### 1. Clone & Configure

```bash
git clone https://github.com/NithinAI11/AI-Cortex-V1.git
cd AI-Cortex-V1

# Create your environment file
echo "GROQ_API_KEY=your_api_key_here" > .env
```

### 2. Start Infrastructure

```bash
# Spin up Qdrant, MongoDB, and Redis
docker-compose up -d
```

### 3. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cd ..
```

### 5. Populate the Knowledge Base

```bash
# Fetch papers from arXiv + repos from GitHub into Qdrant
python -m main ingest
```

### 6. Launch

```bash
# Terminal 1 — Backend
uvicorn api.server:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser. 

---

## 📖 Using AI Cortex

### Asking Questions
Type any AI research or market intelligence question into the query bar. The system will:
1. **Plan** — decompose your query into targeted search vectors
2. **Retrieve** — fetch and rerank the most relevant context
3. **Synthesize** — generate a structured report with tables and visualizations
4. **Verify** — automatically fact-check against sources

### Uploading Custom Documents
Use the **"Upload PDF Source"** button in the sidebar to add your own PDFs. The ingestion pipeline runs in the background — you can continue querying while it processes.

### Inspecting Citations
Click any `[1]`, `[2]`, etc. citation number to open the **Source Inspector** panel showing the exact text chunk the AI referenced. For PDF sources, a full document preview is available.

### Agent Trace
Expand the **LangGraph Execution Trace** panel at the bottom of the screen to watch the agents work in real time, with per-step logs and node highlighting.

---

## 📄 Documentation

For a deeper dive into the system's architecture and user instructions, refer to the comprehensive guides below:

- **[➡️ View the Full Technical Guide](./docs/AI_Cortex_Technical_Guide.pdf)** — System architecture, agentic workflows, design principles, data pipeline internals, infrastructure, testing strategy, security considerations, and the v2.0 roadmap.

- **[➡️ View the Full User Guide](./docs/AI_Cortex_User_Guide.pdf)** — Complete walkthrough on setup, installation, running the system, and using every feature of the interface.

---

## 🗺 Roadmap — v2.0

| Feature | Description |
|---|---|
| **LangSmith Integration** | Quantitative RAG evaluation: Faithfulness, Context Recall, Answer Relevance scores |
| **Hybrid Search (BM25)** | Combine dense vector search with sparse keyword search via Reciprocal Rank Fusion |
| **GraphRAG (Neo4j)** | Entity extraction → Cypher queries for multi-hop relational reasoning |
| **Self-Corrective Loop** | `CritiqueAgent` reviews the synthesis and triggers a second-pass revision |
| **Multi-modal Ingestion** | OCR for scanned PDFs, GPT-4o descriptions of embedded charts and diagrams |
| **Auth & Access Control** | User accounts, private knowledge bases, role-based permissions |
| **Provider-Agnostic LLM** | Interface abstraction for fallback across Groq, OpenAI, Anthropic, and local models |
| **Async Task Queue** | Celery + Redis broker to replace threading for production-scale ingestion |

---

## 🏛 Project Structure

```
AI-Cortex-V1/
├── api/
│   └── server.py              # FastAPI app, /stream SSE endpoint, /upload
├── agents/
│   ├── planning_agent.py      # PlanningAgent — query decomposition
│   ├── retrieval_agent.py     # RetrievalAgent — hybrid multi-stage retrieval
│   ├── synthesis_agent.py     # SynthesisAgent — streaming report generation
│   └── factchecker_agent.py   # FactCheckerAgent — hallucination detection
├── data_pipeline/
│   ├── loaders/
│   │   ├── arxiv_loader.py    # arXiv API fetcher
│   │   ├── github_loader.py   # GitHub Search API fetcher
│   │   └── pdf_loader.py      # pdfplumber with table extraction
│   ├── processors/
│   │   ├── document_cleaner.py
│   │   └── chunker.py         # SemanticChunker (400 tok / 80 overlap)
│   └── ingest.py              # Embedder, Qdrant upsert, deterministic IDs
├── retrieval/
│   └── retriever.py           # multi_search, reranker, source scoring
├── graph/
│   └── orchestrator.py        # LangGraph state machine definition
├── tests/
│   └── test_retrieval.py      # Integration tests
├── frontend/
│   ├── src/
│   │   ├── components/        # ChatHistory, SourcesPanel, AgentTrace, etc.
│   │   └── ...
│   └── package.json
├── docs/
│   ├── AI_Cortex_Technical_Guide.pdf
│   └── AI_Cortex_User_Guide.pdf
├── docker-compose.yml
├── requirements.txt
├── main.py
└── .env                       # GROQ_API_KEY (not committed)
```

---

## ⚖️ Architectural Decisions

**LangGraph over LangChain LCEL** — LCEL handles linear chains well. LangGraph handles *graphs* — with cycles, branching, and persistent state across multiple specialized agents. The self-correction loop in v2.0 requires cycles; LCEL cannot model that.

**SSE over WebSockets** — The primary communication pattern is one-directional: server streams tokens and events to the client. SSE is a simpler, more lightweight protocol for this exact use case. WebSockets would add bidirectional complexity without benefit.

**Local Embeddings (BGE-small) over API Embeddings** — Zero API cost for the ingestion pipeline, no rate limits, no latency on embedding calls, and full control over the model. The 384-dimension BGE model performs comparably to much larger models on semantic retrieval tasks.

**Cross-Encoder Reranker as a Separate Stage** — Bi-encoder embeddings (used for initial search) are fast but approximate. A cross-encoder sees query + document together, which is fundamentally more accurate for relevance — but too slow to run on thousands of candidates. Running it as a reranking stage on a small shortlist gives the best of both worlds.

---

## 👤 Author

**Nithin** — AI Systems Engineer

> Built as a portfolio demonstration of production-oriented AI engineering principles: multi-agent orchestration, advanced RAG, real-time streaming, and thoughtful system design.

---

<div align="center">

*If this project was useful or interesting, a ⭐ on the repo is appreciated.*

</div>
