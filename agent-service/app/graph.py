"""LangGraph multi-agent orchestration.

Flow:
    START -> router (supervisor / classifier) -> one specialist:
        small_talk                              (greeting / casual)        -> END
        profile_qa                              (question about Om)        -> END
        case_match -> consultant                (a proven case matched)    -> END
                   -> architect -> consultant   (no match: design approach) -> END
        appointment                             (book a strategy call)     -> END
        email                                   (send a follow-up recap)   -> END

Every node appends TraceEvents so the UI can render the live reasoning trace.
"""
from __future__ import annotations

from functools import lru_cache

from langgraph.graph import END, START, StateGraph

from app.agents.appointment import appointment_node
from app.agents.architect import architect_node
from app.agents.case_match import case_match_node, route_after_case_match
from app.agents.consultant import consultant_node
from app.agents.email_followup import email_followup_node
from app.agents.profile_qa import profile_qa_node
from app.agents.router import route_after_router, router_node
from app.agents.small_talk import small_talk_node
from app.agents.state import AgentState


@lru_cache
def build_graph():
    g = StateGraph(AgentState)

    g.add_node("router", router_node)
    g.add_node("case_match", case_match_node)
    g.add_node("architect", architect_node)
    g.add_node("consultant", consultant_node)
    g.add_node("profile_qa", profile_qa_node)
    g.add_node("small_talk", small_talk_node)
    g.add_node("appointment", appointment_node)
    g.add_node("email", email_followup_node)

    g.add_edge(START, "router")
    g.add_conditional_edges(
        "router",
        route_after_router,
        {
            "small_talk": "small_talk",
            "profile_qa": "profile_qa",
            "case_match": "case_match",
            "appointment": "appointment",
            "email": "email",
        },
    )
    g.add_conditional_edges(
        "case_match", route_after_case_match, {"consultant": "consultant", "architect": "architect"}
    )
    g.add_edge("architect", "consultant")
    g.add_edge("consultant", END)
    g.add_edge("profile_qa", END)
    g.add_edge("small_talk", END)
    g.add_edge("appointment", END)
    g.add_edge("email", END)

    return g.compile()
