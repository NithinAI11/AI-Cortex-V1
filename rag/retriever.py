# ===== File: rag/retriever.py =====
import json
import re
from embeddings.embedder import Embedder
from vectorstore.qdrant_client import get_qdrant_client, COLLECTION_NAME
from rag.reranker import Reranker
from core.connections import redis_client
from core.logger import log

class Retriever:
    def __init__(self):
        self.embedder = Embedder()
        self.client = get_qdrant_client() # Uses the Docker client
        self.reranker = Reranker()
        
        # Source Reliability Weights (Phase 2)
        self.weights = {"arxiv": 1.5, "github": 1.2, "pdf": 1.0}

    def keyword_match(self, query, docs):
        """Simple keyword scoring"""
        keywords = re.findall(r"\w+", query.lower())
        scored =[]
        for d in docs:
            text = d.get("content", "").lower()
            score = sum(text.count(k) for k in keywords)
            scored.append((d, score))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [d[0] for d in scored]

    def semantic_search(self, query, top_k=10):
        """Vector similarity search in Docker Qdrant"""
        vector = self.embedder.embed(query)[0]
        results = self.client.query_points(
            collection_name=COLLECTION_NAME,
            query=vector,
            limit=top_k
        )
        return[p.payload for p in results.points]

    def search(self, query):
        """Hybrid search with Reranking and Phase 2 Reliability Scoring"""
        # Semantic candidates
        semantic_docs = self.semantic_search(query, 10)
        
        # Keyword scoring
        keyword_docs = self.keyword_match(query, semantic_docs)
        
        # Rerank final docs
        final_docs = self.reranker.rerank(query, keyword_docs)
        
        # Apply reliability scoring (Phase 2)
        scored_docs =[]
        for doc in final_docs:
            source = doc.get("source", "pdf").lower()
            weight = self.weights.get(source, 1.0)
            doc["reliability_score"] = weight
            scored_docs.append(doc)
            
        # Return sorted by highest reliability
        return sorted(scored_docs, key=lambda x: x["reliability_score"], reverse=True)

    def multi_search(self, queries: list, max_docs: int = 15) -> list:
        """
        Executes parallel retrieval and caches results in Redis.
        """
        cache_key = f"rag_cache:{hash(str(queries))}"
        
        # REDIS CACHING LAYER
        if redis_client:
            cached = redis_client.get(cache_key)
            if cached:
                log("Retriever: Returning results from Redis Cache")
                return json.loads(cached)

        log(f"Executing multi-query retrieval for {len(queries)} queries.")
        all_docs =[]
        seen_hashes = set()
        
        for q in queries:
            docs = self.search(q)[:5] # Get top 5 per sub-query
            for d in docs:
                text = d.get("content", "")
                doc_hash = hash(text)
                if doc_hash not in seen_hashes:
                    seen_hashes.add(doc_hash)
                    all_docs.append(d)
        
        # Limit to max docs
        results = all_docs[:max_docs]
        
        # Save to Redis cache for 1 hour
        if redis_client:
            redis_client.setex(cache_key, 3600, json.dumps(results)) 
            
        return results