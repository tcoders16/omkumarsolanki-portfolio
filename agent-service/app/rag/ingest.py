"""Load Om's knowledge base once and expose it in shapes the retrievers need.

Sources (single source of truth, copied into the image at build):
  - knowledge/portfolio.md  -> the page-indexed prose knowledge base
  - knowledge/om-meta.json   -> structured identity / projects / use_cases / metrics

The same two files power the live portfolio site, so editing them there keeps
the agent in sync (see README "Keeping knowledge in sync").
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from functools import lru_cache

from app.config import get_settings


@dataclass
class Section:
    """A heading-delimited block of portfolio.md — the unit for Vectorless RAG."""

    title: str
    level: int
    text: str
    path: str  # breadcrumb e.g. "What Om does > Multi-agent systems"


@dataclass
class KnowledgeBase:
    markdown: str
    sections: list[Section]
    meta: dict
    use_cases: list[dict] = field(default_factory=list)
    projects: list[dict] = field(default_factory=list)
    metrics: dict = field(default_factory=dict)
    booking: dict = field(default_factory=dict)

    def toc(self) -> str:
        """Compact table of contents shown to the LLM in Vectorless retrieval."""
        lines = []
        for i, s in enumerate(self.sections):
            indent = "  " * (s.level - 1)
            lines.append(f"[{i}] {indent}{s.title}")
        return "\n".join(lines)


def _parse_sections(md: str) -> list[Section]:
    """Split markdown into sections by ATX headings, keeping a breadcrumb path."""
    lines = md.splitlines()
    sections: list[Section] = []
    stack: list[tuple[int, str]] = []  # (level, title) for breadcrumb
    cur_title, cur_level, buf = "Overview", 1, []

    def flush():
        if buf or cur_title:
            crumb = " > ".join(t for _, t in stack[:-1]) if len(stack) > 1 else ""
            path = f"{crumb} > {cur_title}" if crumb else cur_title
            sections.append(
                Section(title=cur_title, level=cur_level, text="\n".join(buf).strip(), path=path)
            )

    for line in lines:
        m = re.match(r"^(#{1,4})\s+(.*)$", line)
        if m:
            flush()
            cur_level = len(m.group(1))
            cur_title = m.group(2).strip()
            buf = []
            # maintain heading stack for breadcrumbs
            while stack and stack[-1][0] >= cur_level:
                stack.pop()
            stack.append((cur_level, cur_title))
        else:
            buf.append(line)
    flush()
    # drop empty sections
    return [s for s in sections if s.text or s.level <= 2]


@lru_cache
def load_kb() -> KnowledgeBase:
    settings = get_settings()
    md = ""
    try:
        md = settings.portfolio_md_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        md = ""

    meta: dict = {}
    try:
        meta = json.loads(settings.meta_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        meta = {}

    return KnowledgeBase(
        markdown=md,
        sections=_parse_sections(md),
        meta=meta,
        use_cases=meta.get("use_cases", []),
        projects=meta.get("projects", []),
        metrics=meta.get("metrics", {}),
        booking=meta.get("booking", {}),
    )
