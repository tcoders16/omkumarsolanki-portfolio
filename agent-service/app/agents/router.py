"""Router / Supervisor agent — classifies the intake and routes it.

Skills: classify_intent, detect_domain.
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.llm import fast_llm
from app.schemas import Classification, TraceEvent

_SYS = """You triage inbound requests for an AI consulting practice (Om Kumar Solanki).
Classify the message:
- intent: "business_problem" if the sender describes a company process/problem to solve,
  else "general_question" (asking about Om, his background, projects, stack, rates).
- domain: one short tag — one of hiring, legal, privacy, rnd, automation, data, strategy, general.
- summary: a single crisp sentence restating what they actually need.
- urgency: low | medium | high based on how acute the pain sounds.
Be decisive."""


def router_node(state: AgentState) -> AgentState:
    llm = fast_llm(temperature=0.0).with_structured_output(Classification)
    user = state.get("brief", "")
    if state.get("is_chat"):
        # General chat is always a question; still tag the domain for analytics.
        result: Classification = llm.invoke(
            [{"role": "system", "content": _SYS}, {"role": "user", "content": user}]
        )
        result.intent = "general_question"
    else:
        result = llm.invoke(
            [{"role": "system", "content": _SYS}, {"role": "user", "content": user}]
        )

    return {
        "classification": result,
        "trace": [
            TraceEvent(
                agent="router",
                label=f"Classified as {result.intent.replace('_', ' ')} · domain: {result.domain} · urgency: {result.urgency}",
            )
        ],
    }


def route_after_router(state: AgentState) -> str:
    cls = state.get("classification")
    if state.get("is_chat") or (cls and cls.intent == "general_question"):
        return "profile_qa"
    return "case_match"
