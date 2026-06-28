"""Episodic / agentic memory — a vector-backed long-term memory the agent
recalls *before* answering and writes back to *after*, in real time.

Separate Chroma collection from the knowledge base. Keyed by session so the
agent remembers what a given visitor told it across turns (and across sessions
that reuse the same id). Every operation is defensive: memory must never break
a live request.

Note: persistence is to the container's local disk (settings.chroma_dir/episodic).
On an ephemeral host (e.g. Container Apps without a mounted volume) memory lives
for the instance's lifetime; mount a volume for durable cross-instance memory.
"""
from __future__ import annotations

import time
from functools import lru_cache

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings

from app.config import get_settings

_COLLECTION = "om_episodic"


@lru_cache
def _store() -> Chroma:
    s = get_settings()
    embeddings = OpenAIEmbeddings(model=s.embedding_model, api_key=s.openai_api_key)
    return Chroma(
        collection_name=_COLLECTION,
        embedding_function=embeddings,
        persist_directory=f"{s.chroma_dir}/episodic",
    )


def recall(session_id: str, query: str, k: int = 3) -> str:
    """Return formatted prior-episode snippets relevant to the query.

    Empty string when there's nothing to recall (new visitor, no session, or
    any failure) so callers can treat memory as purely additive.
    """
    if not session_id or not query.strip():
        return ""
    try:
        docs = _store().similarity_search(query, k=k, filter={"session_id": session_id})
    except Exception as exc:  # pragma: no cover - depends on store/network
        print(f"[episodic] recall failed: {exc}")
        return ""
    if not docs:
        return ""
    lines = [f"- {d.page_content.strip()}" for d in docs]
    return "MEMORY (what this visitor told us earlier — use it to stay consistent):\n" + "\n".join(lines)


def remember(session_id: str, user_text: str, assistant_text: str, *, domain: str = "") -> None:
    """Write this turn back to the vector store as an episode, embedded in real time."""
    if not session_id or not user_text.strip():
        return
    episode = (
        f"Visitor: {user_text.strip()[:800]}\n"
        f"Om's AI: {assistant_text.strip()[:600]}"
    )
    try:
        _store().add_documents([
            Document(
                page_content=episode,
                metadata={"session_id": session_id, "ts": time.time(), "domain": domain or "general"},
            )
        ])
    except Exception as exc:  # pragma: no cover - depends on store/network
        print(f"[episodic] remember failed: {exc}")
