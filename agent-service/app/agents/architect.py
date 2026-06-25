"""Solution-Architect agent — runs ONLY when no prior case matched.

Skills: retrieve_skills, compose_approach.

Designs how Om would solve the company's problem from adjacent experience —
grounded in his real stack and projects, but explicitly framed as a *proposed
approach* (not a claimed past result), so no metrics are fabricated.
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.config import get_settings
from app.llm import smart_llm
from app.rag.ingest import load_kb
from app.rag.vectorless import vectorless_context
from app.schemas import TraceEvent

_SYS = """You are Om Kumar Solanki's solution-architect agent.
A company has a problem with NO direct prior case in Om's portfolio. Using ONLY the
context about Om's real skills, stack, and adjacent projects, outline how Om would
approach THIS problem.

Rules:
- Frame it as a proposed approach ("Here's how I'd tackle this"), never as a past result.
- Draw explicit parallels to Om's adjacent work and transferable techniques.
- Do NOT invent metrics, client names, or outcomes. Only reference numbers that appear
  verbatim in the context, and only as evidence of capability — not as a promise.
- Give a concrete 3-4 step path (diagnose -> build -> harden -> transfer where relevant).
- 4-6 sentences. Confident, specific, senior-engineer tone."""


def architect_node(state: AgentState) -> AgentState:
    settings = get_settings()
    kb = load_kb()
    problem = state.get("brief", "")

    # retrieve_skills: pull adjacent capability context (vectorless tree + vector projects)
    parts = []
    if settings.rag_mode in ("vectorless", "hybrid"):
        parts.append(vectorless_context(problem, max_sections=3))
    if settings.rag_mode in ("vector", "hybrid"):
        try:
            from app.rag import vector_store

            docs = vector_store.retrieve(problem, k=3, doc_type="project")
            parts.append("\n\n".join(d.page_content for d in docs))
        except Exception:
            pass
    skills = kb.meta.get("skills", {})
    parts.append("OM'S SKILLS: " + ", ".join(
        v for vals in skills.values() for v in (vals if isinstance(vals, list) else [vals])
    ))
    context = "\n\n---\n\n".join(p for p in parts if p)

    msg = f"COMPANY PROBLEM:\n{problem}\n\nCONTEXT ABOUT OM:\n{context}"
    approach = smart_llm(temperature=0.4).invoke(
        [{"role": "system", "content": _SYS}, {"role": "user", "content": msg}]
    ).content

    return {
        "context": str(approach),
        "trace": [
            TraceEvent(
                agent="architect",
                label="Designed a tailored approach from Om's adjacent experience.",
            )
        ],
    }
