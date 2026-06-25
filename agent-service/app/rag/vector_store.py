"""Vector RAG over the knowledge base using a persisted Chroma store.

Documents = portfolio.md sections + one doc per use_case + one doc per project.
Embeddings = OpenAI text-embedding-3-small. Built lazily on first use and
persisted to disk so restarts are fast.
"""
from __future__ import annotations

from functools import lru_cache

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from app.config import get_settings
from app.rag.ingest import load_kb

_COLLECTION = "om_knowledge"


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
    embeddings = OpenAIEmbeddings(
        model=settings.embedding_model, api_key=settings.openai_api_key
    )
    store = Chroma(
        collection_name=_COLLECTION,
        embedding_function=embeddings,
        persist_directory=settings.chroma_dir,
    )
    # Seed the collection on first boot.
    try:
        count = store._collection.count()
    except Exception:
        count = 0
    if count == 0:
        docs = _build_documents()
        if docs:
            store.add_documents(docs)
    return store


def retrieve(query: str, k: int = 4, doc_type: str | None = None) -> list[Document]:
    store = get_store()
    flt = {"type": doc_type} if doc_type else None
    return store.similarity_search(query, k=k, filter=flt)


def retrieve_with_scores(query: str, k: int = 4, doc_type: str | None = None):
    """Return (Document, similarity 0..1) pairs. Chroma gives distance; convert."""
    store = get_store()
    flt = {"type": doc_type} if doc_type else None
    pairs = store.similarity_search_with_relevance_scores(query, k=k, filter=flt)
    return pairs
