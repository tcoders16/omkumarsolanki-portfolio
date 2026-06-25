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
    history: list[ChatTurn] = Field(default_factory=list)

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
    history: list[ChatTurn] = Field(default_factory=list)


class MatchedCase(BaseModel):
    matched: bool
    problem: Optional[str] = None
    solution: Optional[str] = None
    reference: Optional[str] = None  # Om's proof (project + metric)
    result: Optional[str] = None     # outcome for the client
    score: float = 0.0


class Classification(BaseModel):
    """Router agent's structured read of the intake — stored on the lead."""

    intent: Literal["business_problem", "general_question"] = "business_problem"
    domain: str = "general"          # e.g. hiring, legal, privacy, rnd, automation, strategy
    summary: str = ""                # one-line restatement of the ask
    urgency: Literal["low", "medium", "high"] = "medium"


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
