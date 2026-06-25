"""LangGraph multi-agent orchestration.

Flow:
    START -> router -> { profile_qa            (general question)
                       | case_match }          (business problem)
    case_match -> consultant                   (a proven case matched)
                 -> architect -> consultant    (no match: design an approach)
    profile_qa / consultant -> END

Every node appends TraceEvents so the UI can render the live reasoning trace.
"""
from __future__ import annotations

from functools import lru_cache

from langgraph.graph import END, START, StateGraph

from app.agents.architect import architect_node
from app.agents.case_match import case_match_node, route_after_case_match
from app.agents.consultant import consultant_node
from app.agents.profile_qa import profile_qa_node
from app.agents.router import route_after_router, router_node
from app.agents.state import AgentState


@lru_cache
def build_graph():
    g = StateGraph(AgentState)

    g.add_node("router", router_node)
    g.add_node("case_match", case_match_node)
    g.add_node("architect", architect_node)
    g.add_node("consultant", consultant_node)
    g.add_node("profile_qa", profile_qa_node)

    g.add_edge(START, "router")
    g.add_conditional_edges(
        "router", route_after_router, {"case_match": "case_match", "profile_qa": "profile_qa"}
    )
    g.add_conditional_edges(
        "case_match", route_after_case_match, {"consultant": "consultant", "architect": "architect"}
    )
    g.add_edge("architect", "consultant")
    g.add_edge("consultant", END)
    g.add_edge("profile_qa", END)

    return g.compile()
