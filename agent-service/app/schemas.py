"""Request / response models shared across the API and the agent graph."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=2000)


class ConsultRequest(BaseModel):
    """Intake form the visiting company fills in."""

    company: str = Field(default="", max_length=120)
    what_they_do: str = Field(default="", max_length=600)
    problem: str = Field(max_length=1000)
    industry: str = Field(default="", max_length=120)
    contact_name: str = Field(default="", max_length=120)   # for appointment / email agents
    contact_email: str = Field(default="", max_length=160)
    history: list[ChatTurn] = Field(default_factory=list)
    session_id: str = Field(default="", max_length=64)  # keys episodic memory

    def as_brief(self) -> str:
        parts = []
        if self.company:
            parts.append(f"Company: {self.company}")
        if self.industry:
            parts.append(f"Industry: {self.industry}")
        if self.what_they_do:
            parts.append(f"What they do: {self.what_they_do}")
        parts.append(f"Problem / process to fix: {self.problem}")
        return "\n".join(parts)


class ChatRequest(BaseModel):
    """General question about Om (Profile-QA path)."""

    message: str = Field(max_length=1000)
    contact_name: str = Field(default="", max_length=120)   # for appointment / email agents
    contact_email: str = Field(default="", max_length=160)
    history: list[ChatTurn] = Field(default_factory=list)
    session_id: str = Field(default="", max_length=64)  # keys episodic memory


class MatchedCase(BaseModel):
    matched: bool
    problem: Optional[str] = None
    solution: Optional[str] = None
    reference: Optional[str] = None  # Om's proof (project + metric)
    result: Optional[str] = None     # outcome for the client
    score: float = 0.0


# The supervisor's dispatch key. Each value maps to one specialist node in the graph.
Intent = Literal[
    "small_talk",        # greetings / casual chat -> SmallTalk agent
    "general_question",  # questions about Om -> Profile-QA agent
    "business_problem",  # a process/problem to solve -> case_match -> consultant
    "book_appointment",  # wants to schedule a call -> Appointment agent
    "send_followup",     # asks Om to email a recap -> Email agent
]


class Classification(BaseModel):
    """Router agent's structured read of the intake — stored on the lead."""

    intent: Intent = "business_problem"
    domain: str = "general"          # e.g. hiring, legal, privacy, rnd, automation, strategy
    summary: str = ""                # one-line restatement of the ask
    urgency: Literal["low", "medium", "high"] = "medium"


class AppointmentResult(BaseModel):
    """Outcome of the Appointment agent."""

    booked: bool = False
    start: Optional[str] = None       # ISO 8601 local start time
    end: Optional[str] = None
    timezone: str = ""
    event_link: Optional[str] = None  # Google Calendar event URL, when created
    proposed_slots: list[str] = Field(default_factory=list)  # offered when not booked
    note: str = ""                    # human-readable status (e.g. why it fell back)


class EmailResult(BaseModel):
    """Outcome of the Email follow-up agent."""

    sent: bool = False
    to: str = ""
    subject: str = ""
    body: str = ""                    # the composed message (returned even when draft-only)
    note: str = ""                    # status / why it was draft-only


class TraceEvent(BaseModel):
    """Streamed to the UI so it can render the live agent reasoning trace."""

    agent: str          # e.g. "router", "case_match", "architect", "consultant"
    label: str          # human-readable line shown in the UI
    status: Literal["start", "done"] = "done"


class ConsultResponse(BaseModel):
    answer: str
    classification: Classification = Field(default_factory=Classification)
    matched_case: MatchedCase
    trace: list[TraceEvent] = Field(default_factory=list)
    show_booking: bool = False
    booking_url: str = ""
    appointment: Optional[AppointmentResult] = None  # set by the Appointment agent
    email: Optional[EmailResult] = None              # set by the Email agent
