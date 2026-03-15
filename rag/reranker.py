from sentence_transformers import CrossEncoder


class Reranker:

    """
    Cross-encoder reranker.
    Scores query-document pairs and returns best documents.
    """

    def __init__(self):

        self.model = CrossEncoder(
            "cross-encoder/ms-marco-MiniLM-L-6-v2"
        )

    def rerank(self, query, docs, top_k=5):

        pairs = [[query, d["content"]] for d in docs]

        scores = self.model.predict(pairs)

        ranked = list(zip(docs, scores))

        ranked.sort(key=lambda x: x[1], reverse=True)

        ranked_docs = [d[0] for d in ranked[:top_k]]

        return ranked_docs