# ===== File: agents/planning_agent.py =====
import json
import re
from core.llm.groq_client import GroqLLM
from core.logger import logger

class PlanningAgent:
    """
    Analyzes the user query, creates a report outline, 
    and generates multiple optimized vector search queries.
    """

    def __init__(self):
        self.llm = GroqLLM()

    def plan(self, query: str) -> dict:
        logger.info(f"PlanningAgent generating research strategy for: {query}")

        prompt = f"""You are an elite AI Research Director.
A user has asked: "{query}"

Your job is to break this down into a deep research plan.
1. Create a structured outline for a comprehensive report (3-4 key sections).
2. Generate 3 to 5 highly specific search queries to retrieve diverse information from our vector database. 

For example, if the query is "Latest AI funding", queries should be "AI startup funding rounds", "LLM venture capital investments", etc.

Respond ONLY in valid JSON format, exactly like this:
{{
    "outline": "1. Executive Summary\\n2. Market Trends\\n3. Key Players\\n4. Conclusion",
    "search_queries": ["query 1", "query 2", "query 3"]
}}
"""
        response = self.llm.generate(prompt)
        
        # Safely extract JSON in case the model wraps it in markdown blocks
        try:
            match = re.search(r'\{.*\}', response, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                return data
            else:
                return json.loads(response)
        except Exception as e:
            logger.error(f"Failed to parse planning JSON: {e}. Fallback triggered.")
            return {
                "outline": "## 1. Overview\n## 2. Detailed Analysis\n## 3. Strategic Implications",
                "search_queries": [query]
            }