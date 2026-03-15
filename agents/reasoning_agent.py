from rag.retriever import Retriever
from core.llm.groq_client import GroqLLM
from agents.citation_agent import CitationAgent
from core.logger import logger
from core.retry import retry


class ReasoningAgent:

    def __init__(self):

        self.retriever = Retriever()

        self.llm = GroqLLM()

        self.citation = CitationAgent()

    @retry(max_attempts=3)
    def answer(self, query):

        logger.info(f"Processing query: {query}")

        docs = self.retriever.search(query)

        context = "\n\n".join(
            [d["content"] for d in docs]
        )

        prompt = f"""
You are an AI market intelligence analyst producing a professional research report.

Use the following structure:

# Title

## Executive Summary
Concise overview of the findings.

## Key Insights
Bullet points summarizing the main discoveries.

## Detailed Analysis
Explain trends and developments.

## Data Highlights
If useful, include a table.

Example format:

| Topic | Observation |
|------|-------------|
| AI funding | Increase in LLM startups |

## Strategic Implications
What these insights mean for the AI ecosystem.

## Sources
List references clearly.

Context:
{context}

Question:
{query}

Return the answer strictly in clean markdown.
"""

        logger.info("Calling LLM")

        response = self.llm.generate(prompt)

        sources = self.citation.build_sources(docs)

        return {
            "answer": response,
            "sources": sources
        }