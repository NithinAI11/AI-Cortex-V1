# ===== File: data_pipeline/ingest.py =====
from embeddings.embedder import Embedder
from vectorstore.qdrant_client import get_qdrant_client, create_collection, COLLECTION_NAME
from data_pipeline.loaders.arxiv_loader import fetch_ai_papers
from data_pipeline.loaders.github_loader import fetch_ai_repos
from data_pipeline.loaders.pdf_loader import load_pdfs
from data_pipeline.processors.document_cleaner import clean_text
from data_pipeline.processors.chunker import SemanticChunker
from data_pipeline.processors.metadata_builder import build_metadata
from qdrant_client.models import PointStruct
from core.logger import log
import uuid
import hashlib # NEW: For Smart Incremental Updates

def get_deterministic_id(text: str) -> str:
    """Creates a consistent UUID based on the text content to prevent duplicates."""
    hash_hex = hashlib.md5(text.encode('utf-8')).hexdigest()
    return str(uuid.UUID(hash_hex[:32]))

def run_ingestion():
    log("Starting Smart Ingestion pipeline")
    embedder = Embedder()
    chunker = SemanticChunker(chunk_size=400, overlap=80)
    client = get_qdrant_client()
    create_collection(client, embedder.dim)

    documents =[]
    log("Fetching arXiv papers")
    documents.extend(fetch_ai_papers())
    log("Fetching GitHub repos")
    documents.extend(fetch_ai_repos())
    log("Loading local PDFs")
    documents.extend(load_pdfs("data/pdfs"))

    log(f"Collected {len(documents)} base documents")

    chunks =[]
    payloads =[]

    for doc in documents:
        text = clean_text((doc.get("title", "") + " " + doc.get("content", "")))
        doc_chunks = chunker.chunk(text)
        metadata = build_metadata(doc)

        for c in doc_chunks:
            chunks.append(c)
            payloads.append(metadata | {"content": c})

    log(f"Generated {len(chunks)} chunks")
    vectors = embedder.embed(chunks)
    points =[]

    # SMART UPSERT: Only new or changed chunks will be indexed!
    for i, vec in enumerate(vectors):
        chunk_text = payloads[i]["content"]
        points.append(
            PointStruct(
                id=get_deterministic_id(chunk_text),
                vector=vec.tolist(),
                payload=payloads[i]
            )
        )

    client.upsert(collection_name=COLLECTION_NAME, points=points)
    log("Vector store updated with unique nodes successfully")