"""Appointment agent — books a strategy call on Om's Google Calendar.

Flow:
  1. Pull open working-hours slots (free/busy checked against Om's calendar).
  2. Let a fast LLM read the visitor's message and decide: just OFFER slots, or
     BOOK a specific one they've accepted.
  3. Book only when we have the visitor's email AND a clearly chosen slot.
Otherwise it offers slots + the booking link. Degrades to link-only when Google
Calendar isn't configured.

Skills: check_availability, create_event.
"""
from __future__ import annotations

import re
from typing import Literal, Optional

from pydantic import BaseModel

from app.agents.state import AgentState
from app.config import get_settings
from app.integrations import google_calendar as gcal
from app.llm import fast_llm
from app.rag.ingest import load_kb
from app.schemas import AppointmentResult, TraceEvent


class _Decision(BaseModel):
    action: Literal["offer", "book"] = "offer"
    slot_index: Optional[int] = None  # index into the offered slots, when action == "book"
    reply: str = ""                   # friendly message to show the visitor


def _fmt(slot: gcal.Slot) -> str:
    # e.g. "Tue, Jul 1 · 2:00 PM"
    return slot.start.strftime("%a, %b %-d · %-I:%M %p")


def _booking_link() -> str:
    return load_kb().booking.get("cal", "")


_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def _find_email(message: str, history: list[dict] | None) -> str:
    """Pull an email the visitor typed in this turn or earlier — enables pure
    natural-language booking without a separate form field."""
    hay = [message] + [h.get("content", "") for h in (history or []) if h.get("role") == "user"]
    for text in hay:
        m = _EMAIL_RE.search(text or "")
        if m:
            return m.group(0)
    return ""


def appointment_node(state: AgentState) -> AgentState:
    s = get_settings()
    message = state.get("brief", "")
    email = (state.get("contact_email") or "").strip() or _find_email(message, state.get("history"))
    name = (state.get("contact_name") or "").strip()

    slots = gcal.propose_slots(limit=3)
    offered = [_fmt(x) for x in slots]
    link = _booking_link()

    # Ask the LLM whether the visitor accepted a specific slot.
    sys = (
        "You schedule a 30-minute strategy call with Om. You are given open slots. "
        "If the visitor clearly accepts/asks for one of them (or gives a concrete time matching one), "
        "set action='book' and slot_index to that slot. Otherwise action='offer'. "
        "Write a short, warm reply (2-3 sentences). If booking, confirm the time. "
        "If only offering, list the options naturally and invite them to pick one."
    )
    slot_lines = "\n".join(f"[{i}] {label}" for i, label in enumerate(offered)) or "(none available)"
    ctx = f"Open slots ({s.owner_timezone}):\n{slot_lines}\nVisitor email on file: {email or 'unknown'}"
    decision: _Decision = (
        fast_llm(temperature=0.2)
        .with_structured_output(_Decision)
        .invoke(
            [
                {"role": "system", "content": sys},
                {"role": "user", "content": f"{ctx}\n\nVisitor said: {message}"},
            ]
        )
    )

    result = AppointmentResult(timezone=s.owner_timezone, proposed_slots=offered)

    can_book = (
        decision.action == "book"
        and decision.slot_index is not None
        and 0 <= decision.slot_index < len(slots)
        and email
        and gcal.is_configured()
    )
    if can_book:
        chosen = slots[decision.slot_index]
        outcome = gcal.create_event(
            start=chosen.start,
            end=chosen.end,
            attendee_email=email,
            summary=f"AI strategy call — Om × {name or 'guest'}",
            description="30-minute strategy call booked via Om's portfolio assistant.",
        )
        if outcome.booked:
            result.booked = True
            result.start = chosen.start.isoformat()
            result.end = chosen.end.isoformat()
            result.event_link = outcome.event_link
            result.note = "Booked on Google Calendar; invite sent."
            answer = decision.reply or f"You're booked for {_fmt(chosen)} ({s.owner_timezone}). Invite on its way!"
        else:
            result.note = outcome.note
            answer = (
                f"I couldn't finalize the booking automatically ({outcome.note}). "
                + (f"You can grab a time directly here: {link}" if link else "")
            )
    else:
        # Offering mode (or missing email / unconfigured calendar).
        reasons = []
        if decision.action == "book" and not email:
            reasons.append("I just need your email to send the calendar invite.")
        if decision.action == "book" and not gcal.is_configured():
            reasons.append("live booking isn't wired up yet")
        result.note = "Offered slots." + (" " + " ".join(reasons) if reasons else "")
        answer = decision.reply or (
            f"Happy to set up a quick call. Here are a few openings ({s.owner_timezone}): "
            + "; ".join(offered)
            + ". Which works?"
        )
        if reasons and "email" in result.note:
            answer += " What's the best email for the invite?"
        elif link and not gcal.is_configured():
            answer += f" Or book instantly here: {link}"

    return {
        "answer": str(answer),
        "appointment": result,
        "show_booking": bool(link) and not result.booked,
        "trace": [
            TraceEvent(
                agent="appointment",
                label=("Booked a strategy call." if result.booked else "Offered open call slots."),
            )
        ],
    }
