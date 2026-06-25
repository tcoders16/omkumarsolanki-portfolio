"""Case-Match agent — find a proven prior case matching the client's problem.

Skills:
  - retrieve_cases : hybrid retrieval (vector + vectorless) over Om's use_cases
  - score_match    : decide matched/not and pull the structured case fields

Strategy: vector similarity gives a fast score; an LLM judge (over the compact
use_case list, no embeddings — the Vectorless path) confirms semantic matches the
embeddings might miss. If neither clears the threshold -> matched = False, which
routes the graph to the Solution-Architect instead.
"""
from __future__ import annotations

from pydantic import BaseModel, Field

from app.agents.state import AgentState
from app.config import get_settings
from app.llm import fast_llm
from app.rag.ingest import load_kb
from app.schemas import MatchedCase, TraceEvent


class _Judge(BaseModel):
    index: int = Field(description="Index of the best-matching use case, or -1 if none truly fits.")
    confidence: float = Field(description="0..1 confidence that this case genuinely matches.")


def _llm_judge(problem: str, use_cases: list[dict]) -> _Judge:
    listing = "\n".join(
        f"[{i}] PROBLEM: {uc.get('problem','')} | SOLUTION: {uc.get('solution','')}"
        for i, uc in enumerate(use_cases)
    )
    prompt = (
        "A company described a problem. Pick the ONE prior case that genuinely solves the same "
        "class of problem. If none is a real match, return index -1.\n\n"
        f"COMPANY PROBLEM:\n{problem}\n\nPRIOR CASES:\n{listing}"
    )
    return fast_llm(temperature=0.0).with_structured_output(_Judge).invoke(prompt)


def case_match_node(state: AgentState) -> AgentState:
    settings = get_settings()
    kb = load_kb()
    problem = state.get("brief", "")
    use_cases = kb.use_cases

    if not use_cases:
        return {
            "matched_case": MatchedCase(matched=False),
            "trace": [TraceEvent(agent="case_match", label="No case library available.")],
        }

    # 1) Vector pass — best use_case by similarity (degrades to vectorless if Chroma fails).
    best_idx, best_score = -1, 0.0
    try:
        from app.rag import vector_store

        pairs = vector_store.retrieve_with_scores(problem, k=3, doc_type="use_case")
        for doc, score in pairs:
            if score > best_score:
                best_score = score
                best_idx = int(doc.metadata.get("index", -1))
    except Exception:
        pass

    # 2) Vectorless judge — confirm / recover semantic matches.
    judge = _llm_judge(problem, use_cases)

    chosen_idx, score = -1, 0.0
    if best_idx >= 0 and best_score >= settings.case_match_threshold:
        chosen_idx, score = best_idx, best_score
    if judge.index >= 0 and judge.confidence >= 0.6:
        # Prefer the judge when it is confident (handles paraphrased problems).
        chosen_idx = judge.index
        score = max(score, judge.confidence)

    if chosen_idx < 0 or chosen_idx >= len(use_cases):
        return {
            "matched_case": MatchedCase(matched=False, score=round(best_score, 3)),
            "trace": [
                TraceEvent(
                    agent="case_match",
                    label="No proven prior case matches — handing off to Solution-Architect.",
                )
            ],
        }

    uc = use_cases[chosen_idx]
    matched = MatchedCase(
        matched=True,
        problem=uc.get("problem"),
        solution=uc.get("solution"),
        reference=uc.get("reference"),
        result=uc.get("result"),
        score=round(score, 3),
    )
    return {
        "matched_case": matched,
        "trace": [
            TraceEvent(
                agent="case_match",
                label=f"Matched a proven case: {uc.get('solution','')} (confidence {score:.2f}).",
            )
        ],
    }


def route_after_case_match(state: AgentState) -> str:
    mc = state.get("matched_case")
    return "consultant" if (mc and mc.matched) else "architect"
