from sentence_transformers import SentenceTransformer


class Embedder:

    """
    Embedding abstraction layer.

    Allows future swap:
    - OpenAI
    - Instructor
    - BGE
    """

    def __init__(self, model_name="BAAI/bge-small-en"):

        print("Loading embedding model:", model_name)

        self.model = SentenceTransformer(model_name)

        self.dim = self.model.get_sentence_embedding_dimension()

    def embed(self, texts):

        if isinstance(texts, str):
            texts = [texts]

        return self.model.encode(
            texts,
            normalize_embeddings=True,
            batch_size=32
        )