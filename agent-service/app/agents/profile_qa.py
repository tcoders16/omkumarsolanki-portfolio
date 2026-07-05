"""Profile-QA agent — answers general questions about Om (the /chat path).

Skill: retrieve_profile (hybrid RAG over the knowledge base).
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.config import get_settings
from app.llm import fast_llm
from app.rag.ingest import load_kb
from app.rag.vectorless import vectorless_context
from app.schemas import TraceEvent

_SYS = """You are the AI assistant embedded in Om Kumar Solanki's portfolio.
Answer the visitor's question about Om — background, projects, tech stack, process, services —
using ONLY the provided context. Be specific and cite real projects and numbers when relevant.
2-4 sentences. Never fabricate metrics. If it's clearly a business problem, briefly connect it to
Om's relevant work and suggest a strategy call. If you don't know, point to hello@omkumarsolanki.com."""


def profile_qa_node(state: AgentState) -> AgentState:
    settings = get_settings()
    question = state.get("brief", "")

    parts = []
    if settings.rag_mode in ("vectorless", "hybrid"):
        parts.append(vectorless_context(question, max_sections=3))
    if settings.rag_mode in ("vector", "hybrid"):
        try:
            from app.rag import vector_store

            docs = vector_store.retrieve(question, k=4)
            parts.append("\n\n".join(d.page_content for d in docs))
        except Exception:
            pass
    context = "\n\n---\n\n".join(p for p in parts if p)

    memory = state.get("episodic", "")
    if memory:
        context = f"{memory}\n\n---\n\n{context}"

    history = state.get("history", []) or []
    messages = [{"role": "system", "content": _SYS + f"\n\nCONTEXT:\n{context}"}]
    messages.extend(history[-6:])
    messages.append({"role": "user", "content": question})

    answer = fast_llm(temperature=0.3).invoke(messages).content
    return {
        "answer": str(answer),
        "show_booking": False,
        "trace": [TraceEvent(agent="profile_qa", label="Answered from Om's knowledge base.")],
    }
