# ===== File: agents/synthesis_agent.py =====
from core.llm.groq_client import GroqLLM
from agents.citation_agent import CitationAgent
from core.logger import logger
from core.retry import retry

class SynthesisAgent:
    def __init__(self):
        self.llm = GroqLLM()
        self.citation = CitationAgent()

    @retry(max_attempts=3)
    def synthesize(self, query: str, outline: str, docs: list, stream_callback=None) -> dict:
        logger.info("SynthesisAgent writing final report with Visualizations")
        
        context = "\n\n".join([
            f"--- Source ID: {i+1} | Title: {d.get('title', 'Unknown')} ---\n{d.get('content', '')}" 
            for i, d in enumerate(docs)
        ])
        
        # CHANGED: Removed the "json" word from the markdown blocks.
        chart_example = '''```chart
{
  "type": "bar",
  "title": "Market Data Overview",
  "data":[
    {"name": "Segment A", "value": 40},
    {"name": "Segment B", "value": 60}
  ]
}
```'''

        graph_example = '''```graph
{
  "nodes":[{"id": "OpenAI"}, {"id": "GPT-4"}],
  "links":[{"source": "OpenAI", "target": "GPT-4", "label": "developed"}]
}
```'''

        prompt = f"""You are an elite AI Market Intelligence Analyst.
Write a highly dynamic, visual, and professional research report based ONLY on the provided context.

Original User Query: {query}

Required Report Outline:
{outline}

Context Retrieved:
{context}

CRITICAL RULES FOR YOUR RESPONSE:
1. SMART CITATIONS: Every time you state a fact, metric, or claim, you MUST add an inline citation mapping to the Source ID. 
   Use this EXACT markdown link format: [[1]](#source-1) for Source ID 1.

2. DATA TABLES: Include at least one Markdown table to organize key metrics.

3. INTERACTIVE CHARTS: If the context contains quantitative data, embed a chart using this EXACT markdown code block format (DO NOT write ```json, write ```chart):
{chart_example}
(Supported types: "bar", "line", "pie". Max 6 data points).

4. KNOWLEDGE GRAPHS: If the context mentions relationships between entities, embed a graph using this EXACT format (write ```graph):
{graph_example}

5. NO REFERENCES SECTION: Do not include a "References" or "Sources" list at the end of the report. The UI handles this automatically.

Now, generate the complete report following the outline strictly.
"""
        
        logger.info("Calling LLM for Final Synthesis")
        response = self.llm.generate(prompt, stream=bool(stream_callback), callback=stream_callback)
        
        return {
            "answer": response,
            "sources": docs
        }