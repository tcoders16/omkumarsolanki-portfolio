"""Vector RAG over the knowledge base using a persisted Chroma store.

Documents = portfolio.md sections + one doc per use_case + one doc per project.
Embeddings = OpenAI text-embedding-3-small. Built lazily on first use and
persisted to disk so restarts are fast.
"""
from __future__ import annotations

import hashlib
from functools import lru_cache
from pathlib import Path

from langchain_core.documents import Document
from langchain_chroma import Chroma

from app.config import get_settings
from app.llm import embeddings as kb_embeddings
from app.rag.ingest import load_kb

_COLLECTION = "om_knowledge"


def _kb_hash() -> str:
    """Fingerprint the knowledge source files so the index rebuilds when they change."""
    s = get_settings()
    h = hashlib.sha256()
    for p in (s.portfolio_md_path, s.meta_path):
        try:
            h.update(Path(p).read_bytes())
        except FileNotFoundError:
            continue
    return h.hexdigest()[:16]


def _hash_path() -> Path:
    return Path(get_settings().chroma_dir) / ".kb_hash"


def _build_documents() -> list[Document]:
    kb = load_kb()
    docs: list[Document] = []

    for i, s in enumerate(kb.sections):
        if not s.text:
            continue
        docs.append(
            Document(
                page_content=f"{s.path}\n\n{s.text}",
                metadata={"type": "section", "title": s.title, "id": f"sec-{i}"},
            )
        )

    for i, uc in enumerate(kb.use_cases):
        content = (
            f"PROBLEM: {uc.get('problem','')}\n"
            f"SOLUTION: {uc.get('solution','')}\n"
            f"OM'S PROOF: {uc.get('reference','')}\n"
            f"CLIENT OUTCOME: {uc.get('result','')}"
        )
        docs.append(
            Document(
                page_content=content,
                metadata={"type": "use_case", "index": i, "id": f"uc-{i}"},
            )
        )

    for i, p in enumerate(kb.projects):
        content = (
            f"PROJECT: {p.get('name','')}\n"
            f"TECH: {p.get('tech','')}\n"
            f"WHAT: {p.get('what','')}\n"
            f"PLAIN: {p.get('plain','')}\n"
            f"METRIC: {p.get('metric','')}"
        )
        docs.append(
            Document(
                page_content=content,
                metadata={"type": "project", "index": i, "id": f"proj-{i}"},
            )
        )

    return docs


@lru_cache
def get_store() -> Chroma:
    settings = get_settings()
    embeddings = kb_embeddings()

    def _open() -> Chroma:
        return Chroma(
            collection_name=_COLLECTION,
            embedding_function=embeddings,
            persist_directory=settings.chroma_dir,
        )

    store = _open()
    try:
        count = store._collection.count()
    except Exception:
        count = 0

    current = _kb_hash()
    hp = _hash_path()
    stored = hp.read_text(encoding="utf-8").strip() if hp.exists() else ""

    # Rebuild when empty (first boot) OR when the knowledge files have changed,
    # so new profile/framework content is always retrievable. Episodic memory
    # lives in a separate collection and is untouched.
    # Embedding failures must not crash the request — callers fall back to
    # vectorless retrieval.
    if count == 0 or stored != current:
        docs = _build_documents()
        if docs:
            try:
                if count:
                    try:
                        store.delete_collection()
                    except Exception:
                        pass
                    store = _open()  # fresh, empty collection
                store.add_documents(docs)
                hp.parent.mkdir(parents=True, exist_ok=True)
                hp.write_text(current, encoding="utf-8")
            except Exception as exc:
                print(f"[vector_store] index rebuild failed, using vectorless: {exc}")
    return store


def retrieve(query: str, k: int = 4, doc_type: str | None = None) -> list[Document]:
    flt = {"type": doc_type} if doc_type else None
    try:
        return get_store().similarity_search(query, k=k, filter=flt)
    except Exception as exc:  # embeddings/store unavailable -> let caller fall back
        print(f"[vector_store] retrieve failed: {exc}")
        return []


def retrieve_with_scores(query: str, k: int = 4, doc_type: str | None = None):
    """Return (Document, similarity 0..1) pairs. Chroma gives distance; convert."""
    flt = {"type": doc_type} if doc_type else None
    try:
        return get_store().similarity_search_with_relevance_scores(query, k=k, filter=flt)
    except Exception as exc:
        print(f"[vector_store] scored retrieve failed: {exc}")
        return []
