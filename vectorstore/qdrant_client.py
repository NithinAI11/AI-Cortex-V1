# ===== File: vectorstore/qdrant_client.py =====
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

COLLECTION_NAME = "ai_cortex_knowledge"

def get_qdrant_client():
    """
    Connects exclusively to the Docker Qdrant instance.
    """
    client = QdrantClient(host="localhost", port=6334)
    return client

def create_collection(client, vector_size: int):
    """
    Creates the collection if it does not already exist in Docker.
    """
    collections = client.get_collections().collections
    names = [c.name for c in collections]

    if COLLECTION_NAME not in names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE
            )
        )
        print("Collection created in Docker Qdrant")
    else:
        print("Collection already exists in Docker Qdrant")