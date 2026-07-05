"""Email follow-up agent — writes and sends a recap of what Om can do for the client.

Purpose: after a conversation, leave the visitor with a short, personal email so
they remember Om's value — what he'd build for them, the proof behind it, and the
next step. Grounded in the knowledge base (real projects, metrics, frameworks).

Sends via Resend when configured; otherwise returns the composed draft. Never
sends without a recipient email.

Skills: compose_followup, send_email.
"""
from __future__ import annotations

import re

from pydantic import BaseModel

from app.agents.state import AgentState
from app.config import get_settings
from app.integrations import resend_client
from app.llm import smart_llm
from app.rag.ingest import load_kb
from app.rag.vectorless import vectorless_context
from app.schemas import EmailResult, TraceEvent


class _Draft(BaseModel):
    subject: str
    body: str  # plain-text, with blank lines between paragraphs


_SYS = """You are Om Kumar Solanki's assistant, writing a short follow-up email on his behalf
to a prospective client you just spoke with. Goal: remind them what Om can do for THEIR business —
grounded ONLY in the provided context (real projects, metrics, frameworks).
Rules:
- 120-180 words, warm and confident, first person as Om ("I").
- Reference their specific situation if known; tie it to one concrete thing Om has done (with a real metric).
- Offer one clear next step (a 30-min strategy call).
- Never invent metrics or clients. Plain text, short paragraphs. No subject line inside the body.
- NEVER write any URL or link in the body. The correct booking link is appended automatically
  after your draft; any link you write will be wrong.
- Never use em dashes or en dashes anywhere. Use commas, periods, or a plain hyphen instead."""


def _to_html(body: str, booking_link: str) -> str:
    paras = [p.strip() for p in body.split("\n\n") if p.strip()]
    html = "".join(f"<p style='margin:0 0 14px'>{p}</p>" for p in paras)
    if booking_link:
        html += (
            f"<p style='margin:18px 0 0'><a href='{booking_link}' "
            f"style='color:#2563eb'>Book a 30-min strategy call →</a></p>"
        )
    return f"<div style='font-family:system-ui,sans-serif;font-size:15px;color:#111;line-height:1.55'>{html}</div>"


def email_followup_node(state: AgentState) -> AgentState:
    s = get_settings()
    kb = load_kb()
    booking_link = kb.booking.get("cal", "")

    message = state.get("brief", "")
    name = (state.get("contact_name") or "").strip()
    email = (state.get("contact_email") or "").strip()
    episodic = state.get("episodic", "") or ""

    context = vectorless_context(message or "what Om does and his strongest results", max_sections=3)
    if episodic:
        context = f"Earlier in this conversation:\n{episodic}\n\n---\n\n{context}"
    who = f"Recipient: {name or 'the client'}{(' <' + email + '>') if email else ''}"

    draft: _Draft = (
        smart_llm(temperature=0.4)
        .with_structured_output(_Draft)
        .invoke(
            [
                {"role": "system", "content": _SYS + f"\n\nCONTEXT:\n{context}"},
                {"role": "user", "content": f"{who}\nTheir last message: {message}\n\nWrite the follow-up."},
            ]
        )
    )

    def _sanitize(t: str) -> str:
        # Belt and braces over the prompt rules: strip any URL the model wrote
        # (the real booking link is appended deterministically) and long dashes.
        t = re.sub(r"https?://\S+", "", t)
        return t.replace("—", "-").replace("–", "-")

    signoff = f"\n\n{s.owner_name}\n{s.owner_email}"
    body = _sanitize(draft.body).rstrip() + signoff
    subject = _sanitize(draft.subject).strip()
    result = EmailResult(to=email, subject=subject, body=body)

    if email:
        outcome = resend_client.send_email(
            to=email,
            subject=subject,
            html=_to_html(body, booking_link),
            text=body + (f"\n\nBook a call: {booking_link}" if booking_link else ""),
        )
        result.sent = outcome.sent
        result.note = outcome.note
    else:
        result.note = "No recipient email yet — drafted but not sent."

    if result.sent:
        answer = f"Done — I've emailed a recap to {email}. {('Book a call anytime: ' + booking_link) if booking_link else ''}"
    elif email:
        answer = f"I drafted a follow-up for {email} but couldn't send it ({result.note}). Want me to try again?"
    else:
        answer = "I've drafted a follow-up recap. What email should I send it to?"

    return {
        "answer": str(answer),
        "email": result,
        "show_booking": False,
        "trace": [
            TraceEvent(
                agent="email",
                label=("Sent the follow-up recap." if result.sent else "Drafted the follow-up recap."),
            )
        ],
    }
