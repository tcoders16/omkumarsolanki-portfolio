"""Opportunity-Finder agent — a free, client-helpful takeaway.

A visiting company describes what they do; this agent returns the three
highest-leverage AI / automation opportunities for THAT specific business,
each grounded in how Om would actually build it. Powers POST /opportunities.
"""
from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field

from app.config import get_settings
from app.llm import smart_llm
from app.rag.vectorless import vectorless_context


class Opportunity(BaseModel):
    title: str = Field(description="Short name of the automation opportunity (3-6 words).")
    what: str = Field(description="1-2 sentences: what to automate and why it matters for THIS business.")
    impact: str = Field(description="Rough business impact, e.g. 'save ~10 hrs/week' or 'cut response time ~80%'. Ranges are fine.")
    effort: str = Field(description="One of exactly: 'Quick win', 'Medium', or 'Large'.")
    how_om_builds: str = Field(description="One sentence on how Om would build it, naming concrete tech/approach (agents, RAG, eval, on-prem, MLOps).")


class Opportunities(BaseModel):
    summary: str = Field(description="One-line framing of the single biggest leverage point for this business.")
    opportunities: List[Opportunity] = Field(description="Exactly three opportunities, ordered by leverage (impact vs effort).")


_SYS = """You are an AI opportunity strategist working on behalf of Om Kumar Solanki, a senior AI/ML & agent engineer who takes AI from demo to production.

A visiting company tells you what they do (and optionally a goal). Identify the THREE highest-leverage, realistic AI/automation opportunities for THIS specific business.

Rules:
- Be concrete and specific to their business. Never give generic advice like "add a chatbot".
- For each: what to automate, a rough honest impact (ranges fine), effort ('Quick win' | 'Medium' | 'Large'), and how Om would build it using real techniques (multi-agent orchestration, RAG, evaluation harnesses, on-prem/air-gapped, MLOps, cost control).
- Ground "how Om builds it" in his actual capabilities from the provided context.
- Never invent client names or fabricate metrics.
- Order by leverage: best impact-for-effort first."""


def find_opportunities(business: str, goal: str = "") -> Opportunities:
    settings = get_settings()
    ctx = ""
    if settings.rag_mode in ("vectorless", "hybrid"):
        ctx = vectorless_context(f"{business} {goal}".strip(), max_sections=3)

    user = f"BUSINESS: {business}\n"
    if goal:
        user += f"GOAL: {goal}\n"
    user += "\nReturn exactly three opportunities, ordered by leverage."

    messages = [
        {"role": "system", "content": _SYS + f"\n\nOM'S CAPABILITIES / WORK (context):\n{ctx}"},
        {"role": "user", "content": user},
    ]
    return smart_llm(temperature=0.4).with_structured_output(Opportunities).invoke(messages)
