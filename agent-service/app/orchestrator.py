"""Runs the LangGraph multi-agent graph and packages a structured result.

This is the generation core. NeMo Guardrails (guardrails/runner.py) wraps this
with input/output rails; if guardrails are disabled it is called directly.
"""
from __future__ import annotations

from app.config import get_settings
from app.graph import build_graph
from app.rag import episodic
from app.rag.ingest import load_kb
from app.schemas import (
    AppointmentResult,
    Classification,
    ConsultResponse,
    EmailResult,
    MatchedCase,
    TraceEvent,
)


def _booking_url() -> str:
    return load_kb().booking.get("cal", "")


def run_graph(
    brief: str,
    *,
    is_chat: bool = False,
    history: list[dict] | None = None,
    session_id: str = "",
    contact_name: str = "",
    contact_email: str = "",
) -> ConsultResponse:
    graph = build_graph()

    # Episodic memory: recall what this visitor told us earlier (vector search).
    episodic_ctx = episodic.recall(session_id, brief) if session_id else ""

    state = graph.invoke(
        {
            "brief": brief,
            "history": history or [],
            "is_chat": is_chat,
            "session_id": session_id,
            "contact_name": contact_name,
            "contact_email": contact_email,
            "episodic": episodic_ctx,
            "trace": [],
        }
    )

    classification: Classification = state.get("classification") or Classification()
    matched: MatchedCase = state.get("matched_case") or MatchedCase(matched=False)
    trace: list[TraceEvent] = state.get("trace") or []
    show_booking: bool = bool(state.get("show_booking"))
    answer: str = state.get("answer") or ""
    appointment: AppointmentResult | None = state.get("appointment")
    email: EmailResult | None = state.get("email")

    # Episodic memory: write this turn back to the vector store, in real time.
    if session_id and answer:
        episodic.remember(session_id, brief, answer, domain=classification.domain)
        trace = trace + [TraceEvent(agent="memory", label="Wrote this turn to episodic memory.")]

    return ConsultResponse(
        answer=answer,
        classification=classification,
        matched_case=matched,
        trace=trace,
        show_booking=show_booking,
        booking_url=_booking_url() if show_booking else "",
        appointment=appointment,
        email=email,
    )
