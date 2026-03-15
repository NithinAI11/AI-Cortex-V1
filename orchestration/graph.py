# ===== File: orchestration/graph.py =====
from typing import TypedDict, List, Any
from langgraph.graph import StateGraph

from agents.planning_agent import PlanningAgent
from agents.synthesis_agent import SynthesisAgent
from agents.fact_checker_agent import FactCheckerAgent
from rag.retriever import Retriever

class GraphState(TypedDict, total=False):
    query: str
    outline: str
    search_queries: List[str]
    docs: List[dict]
    answer: str
    sources: List[str]
    verification: dict
    stream_callback: Any
    log_callback: Any

def build_graph():
    planner = PlanningAgent()
    retriever = Retriever()
    synthesizer = SynthesisAgent()
    fact_checker = FactCheckerAgent()

    def plan_node(state: GraphState):
        if state.get("log_callback"): state["log_callback"]("Planner: Analyzing intent...")
        plan_data = planner.plan(state["query"])
        state["outline"] = plan_data.get("outline", "")
        state["search_queries"] = plan_data.get("search_queries",[state["query"]])
        return state

    def retrieve_node(state: GraphState):
        if state.get("log_callback"): state["log_callback"]("Retriever: Querying Qdrant & Redis Cache...")
        state["docs"] = retriever.multi_search(state["search_queries"])
        return state

    def synthesize_node(state: GraphState):
        if state.get("log_callback"): state["log_callback"]("Synthesizer: Generating streaming response...")
        result = synthesizer.synthesize(state["query"], state["outline"], state["docs"], state.get("stream_callback"))
        state["answer"] = result.get("answer", "")
        state["sources"] = result.get("sources",[])
        return state

    def verify_node(state: GraphState):
        if state.get("log_callback"): state["log_callback"]("Guardrail: Verifying factual accuracy...")
        state["verification"] = fact_checker.verify(state["answer"], state["docs"])
        return state

    graph = StateGraph(GraphState)
    graph.add_node("plan", plan_node)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("synthesize", synthesize_node)
    graph.add_node("verify", verify_node)

    graph.set_entry_point("plan")
    graph.add_edge("plan", "retrieve")
    graph.add_edge("retrieve", "synthesize")
    graph.add_edge("synthesize", "verify")
    graph.set_finish_point("verify")

    return graph.compile()