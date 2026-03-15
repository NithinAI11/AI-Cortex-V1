from typing import List


class SemanticChunker:

    """
    Production-friendly chunker.

    Configurable parameters:
    - chunk_size
    - overlap
    - min_chunk_length
    """

    def __init__(
        self,
        chunk_size: int = 500,
        overlap: int = 50,
        min_chunk_length: int = 50,
    ):
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.min_chunk_length = min_chunk_length

    def chunk(self, text: str) -> List[str]:

        chunks = []

        start = 0
        length = len(text)

        while start < length:

            end = start + self.chunk_size

            chunk = text[start:end]

            if len(chunk) >= self.min_chunk_length:
                chunks.append(chunk)

            start += self.chunk_size - self.overlap

        return chunks