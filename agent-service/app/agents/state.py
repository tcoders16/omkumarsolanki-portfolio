"""Shared state passed between LangGraph nodes."""
from __future__ import annotations

from typing import Annotated, TypedDict

from app.schemas import Classification, MatchedCase, TraceEvent


def _append(left: list, right: list) -> list:
    return (left or []) + (right or [])


class AgentState(TypedDict, total=False):
    # inputs
    brief: str                 # consult brief, or the user's chat message
    history: list[dict]        # prior conversation turns
    is_chat: bool              # True -> general Q&A path, False -> consulting intake

    # working memory
    classification: Classification
    matched_case: MatchedCase
    context: str               # retrieved knowledge for grounding

    # outputs
    answer: str
    show_booking: bool
    trace: Annotated[list[TraceEvent], _append]


# Each agent and the skills (tools) it owns — surfaced verbatim in the UI roster.
AGENT_ROSTER = [
    {
        "id": "router",
        "name": "Router / Supervisor",
        "role": "Classifies the request and routes it to the right specialist.",
        "skills": ["classify_intent", "detect_domain"],
    },
    {
        "id": "case_match",
        "name": "Case-Match Agent",
        "role": "Searches Om's prior client work for a proven, matching case.",
        "skills": ["retrieve_cases", "score_match"],
    },
    {
        "id": "architect",
        "name": "Solution-Architect Agent",
        "role": "When no direct case exists, designs how Om would solve it from adjacent experience.",
        "skills": ["retrieve_skills", "compose_approach"],
    },
    {
        "id": "consultant",
        "name": "Consultant Agent",
        "role": "Synthesises the professional answer, ties it to ROI, and proposes the next step.",
        "skills": ["estimate_value", "draft_cta"],
    },
    {
        "id": "profile_qa",
        "name": "Profile-QA Agent",
        "role": "Answers general questions about Om's background, projects and stack.",
        "skills": ["retrieve_profile"],
    },
]
