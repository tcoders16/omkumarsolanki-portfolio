"""Router / Supervisor agent — classifies the intake and routes it.

Skills: classify_intent, detect_domain.
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.llm import fast_llm
from app.schemas import Classification, TraceEvent

_SYS = """You are the SUPERVISOR for Om Kumar Solanki's AI consulting practice. Read the
visitor's message and route it to exactly one specialist by choosing intent:
- "small_talk": greetings, thanks, casual chit-chat, or vague messages with no real ask.
- "general_question": asking ABOUT Om — his background, projects, stack, process, rates.
- "business_problem": the sender describes a company process/problem they want solved.
- "book_appointment": they want to schedule/book a call or meeting, or accept a proposed time.
- "send_followup": they ask Om to email them, send a recap/summary, or follow up by email.
Also set:
- domain: one short tag — one of hiring, legal, privacy, rnd, automation, data, strategy, general.
- summary: a single crisp sentence restating what they actually need.
- urgency: low | medium | high based on how acute the pain sounds.
Be decisive. Prefer the action intents (book_appointment / send_followup) when the visitor
explicitly asks for that action, even mid-conversation."""

# Consult intake (is_chat=False) is a structured business brief; if the classifier is
# unsure there, default to the consulting path rather than chit-chat.
_INTAKE_FALLBACK = {"small_talk", "general_question"}

_INTENT_TO_NODE = {
    "small_talk": "small_talk",
    "general_question": "profile_qa",
    "business_problem": "case_match",
    "book_appointment": "appointment",
    "send_followup": "email",
}


def router_node(state: AgentState) -> AgentState:
    llm = fast_llm(temperature=0.0).with_structured_output(Classification)
    user = state.get("brief", "")
    result: Classification = llm.invoke(
        [{"role": "system", "content": _SYS}, {"role": "user", "content": user}]
    )

    # The consult intake form is, by construction, a business problem — only let the
    # classifier override it toward an action intent (booking / follow-up).
    if not state.get("is_chat") and result.intent in _INTAKE_FALLBACK:
        result.intent = "business_problem"

    return {
        "classification": result,
        "trace": [
            TraceEvent(
                agent="router",
                label=f"Routed to {result.intent.replace('_', ' ')} · domain: {result.domain} · urgency: {result.urgency}",
            )
        ],
    }


def route_after_router(state: AgentState) -> str:
    cls = state.get("classification")
    intent = cls.intent if cls else "business_problem"
    return _INTENT_TO_NODE.get(intent, "case_match")
