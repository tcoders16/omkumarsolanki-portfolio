"""Runs the LangGraph multi-agent graph and packages a structured result.

This is the generation core. NeMo Guardrails (guardrails/runner.py) wraps this
with input/output rails; if guardrails are disabled it is called directly.
"""
from __future__ import annotations

from app.config import get_settings
from app.graph import build_graph
from app.rag.ingest import load_kb
from app.schemas import (
    Classification,
    ConsultResponse,
    MatchedCase,
    TraceEvent,
)


def _booking_url() -> str:
    return load_kb().booking.get("cal", "")


def run_graph(brief: str, *, is_chat: bool = False, history: list[dict] | None = None) -> ConsultResponse:
    graph = build_graph()
    state = graph.invoke(
        {
            "brief": brief,
            "history": history or [],
            "is_chat": is_chat,
            "trace": [],
        }
    )

    classification: Classification = state.get("classification") or Classification()
    matched: MatchedCase = state.get("matched_case") or MatchedCase(matched=False)
    trace: list[TraceEvent] = state.get("trace") or []
    show_booking: bool = bool(state.get("show_booking"))
    answer: str = state.get("answer") or ""

    return ConsultResponse(
        answer=answer,
        classification=classification,
        matched_case=matched,
        trace=trace,
        show_booking=show_booking,
        booking_url=_booking_url() if show_booking else "",
    )
