"""Vectorless RAG — structure-aware retrieval with NO embeddings.

portfolio.md is already page-indexed (clean heading hierarchy), so instead of
embedding chunks we hand the LLM the table of contents and let it *navigate* to
the relevant sections (the "PageIndex" approach from the course). This is more
faithful for structured reasoning like case-matching, where section boundaries
carry meaning that chunking destroys.
"""
from __future__ import annotations

import json
import re

from app.llm import fast_llm
from app.rag.ingest import Section, load_kb

_SELECT_PROMPT = """You are a retrieval router over a knowledge base table of contents.
Given a user need and the TOC, return ONLY the indices of the sections whose content
is most relevant. Prefer 1-4 sections. Respond with a JSON array of integers, nothing else.

USER NEED:
{query}

TABLE OF CONTENTS:
{toc}

JSON array of section indices:"""


def _extract_indices(raw: str, n: int) -> list[int]:
    m = re.search(r"\[.*?\]", raw, re.DOTALL)
    if not m:
        return []
    try:
        idxs = json.loads(m.group(0))
    except json.JSONDecodeError:
        return []
    return [i for i in idxs if isinstance(i, int) and 0 <= i < n]


def vectorless_retrieve(query: str, max_sections: int = 4) -> list[Section]:
    """Pick relevant sections by navigating the TOC with the LLM (no vectors)."""
    kb = load_kb()
    if not kb.sections:
        return []
    prompt = _SELECT_PROMPT.format(query=query, toc=kb.toc())
    raw = fast_llm(temperature=0.0).invoke(prompt).content
    idxs = _extract_indices(str(raw), len(kb.sections))[:max_sections]
    if not idxs:
        # graceful fallback: keyword overlap scoring
        q_terms = {t for t in re.findall(r"\w+", query.lower()) if len(t) > 3}
        scored = sorted(
            range(len(kb.sections)),
            key=lambda i: len(q_terms & set(re.findall(r"\w+", kb.sections[i].text.lower()))),
            reverse=True,
        )
        idxs = scored[:max_sections]
    return [kb.sections[i] for i in idxs]


def vectorless_context(query: str, max_sections: int = 4) -> str:
    secs = vectorless_retrieve(query, max_sections)
    return "\n\n---\n\n".join(f"## {s.path}\n{s.text}" for s in secs)
