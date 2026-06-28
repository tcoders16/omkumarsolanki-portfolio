"""Shared state passed between LangGraph nodes."""
from __future__ import annotations

from typing import Annotated, TypedDict

from app.schemas import AppointmentResult, Classification, EmailResult, MatchedCase, TraceEvent


def _append(left: list, right: list) -> list:
    return (left or []) + (right or [])


class AgentState(TypedDict, total=False):
    # inputs
    brief: str                 # consult brief, or the user's chat message
    history: list[dict]        # prior conversation turns
    is_chat: bool              # True -> general Q&A path, False -> consulting intake
    session_id: str            # visitor session — keys episodic memory
    contact_name: str          # visitor's name, when known (appointment / email agents)
    contact_email: str         # visitor's email, when known

    # working memory
    classification: Classification
    matched_case: MatchedCase
    context: str               # retrieved knowledge for grounding
    episodic: str              # recalled long-term memory for this visitor

    # outputs
    answer: str
    show_booking: bool
    appointment: AppointmentResult   # set by the Appointment agent
    email: EmailResult               # set by the Email agent
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
    {
        "id": "small_talk",
        "name": "Small-Talk Agent",
        "role": "Handles greetings and casual chat, then steers toward how Om can help.",
        "skills": ["chitchat", "warm_handoff"],
    },
    {
        "id": "appointment",
        "name": "Appointment Agent",
        "role": "Books a strategy call on Om's calendar (Google Calendar), or offers open slots.",
        "skills": ["check_availability", "create_event"],
    },
    {
        "id": "email",
        "name": "Email Follow-up Agent",
        "role": "Writes and sends a recap of what Om can do for the client so they don't forget.",
        "skills": ["compose_followup", "send_email"],
    },
]
