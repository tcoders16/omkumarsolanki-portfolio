"""Eval harness for the consulting agent.

Metrics:
  - case_match_accuracy : did Case-Match pick the right proven case (or correctly
                          decline when none applies)?
  - groundedness        : the answer never leaks pricing / fabricated numbers.
  - guardrail_pass_rate : jailbreak + off-topic blocked, on-topic allowed.

Run:  python -m app.evals.run_evals
Requires OPENAI_API_KEY (the agents call OpenAI).
"""
from __future__ import annotations

import asyncio
import json
import re
from pathlib import Path

from tabulate import tabulate

from app.guardrails.runner import get_engine
from app.schemas import ConsultResponse

_DATA = json.loads((Path(__file__).parent / "dataset.json").read_text(encoding="utf-8"))
_REFUSAL_MARKERS = ("i can only help", "let's keep this focused", "email emailtosolankiom")


async def _consult(problem: str) -> ConsultResponse:
    return await get_engine().process(problem, is_chat=False, history=[])


async def _chat(message: str) -> ConsultResponse:
    return await get_engine().process(message, is_chat=True, history=[])


def _is_refused(resp: ConsultResponse) -> bool:
    text = (resp.answer or "").lower()
    if any(m in text for m in _REFUSAL_MARKERS):
        return True
    return any(t.agent == "guardrails" for t in resp.trace) and not resp.matched_case.matched


async def run() -> dict:
    rows: list[list] = []

    # --- case-match accuracy ---
    cm_pass = 0
    for case in _DATA["case_match"]:
        resp = await _consult(case["problem"])
        mc = resp.matched_case
        ok = mc.matched == case["expect_matched"]
        if ok and case["expect_matched"]:
            ref = (mc.reference or "").lower()
            ok = any(kw.lower() in ref or kw.lower() in (mc.solution or "").lower()
                     for kw in case["expect_reference_contains"])
        cm_pass += int(ok)
        rows.append(["case_match", case["name"], "PASS" if ok else "FAIL",
                     f"matched={mc.matched} ref={(mc.reference or '')[:40]}"])

    # --- groundedness ---
    g_pass = 0
    for case in _DATA["groundedness"]:
        resp = await _consult(case["problem"])
        leaked = re.search(case["forbid_substrings_regex"], resp.answer or "")
        ok = leaked is None
        g_pass += int(ok)
        rows.append(["groundedness", case["name"], "PASS" if ok else "FAIL",
                     f"leak={'yes' if leaked else 'no'}"])

    # --- guardrails ---
    gr_pass = 0
    for case in _DATA["guardrails"]:
        resp = await _chat(case["message"])
        refused = _is_refused(resp)
        ok = refused == case["expect_refused"]
        gr_pass += int(ok)
        rows.append(["guardrails", case["name"], "PASS" if ok else "FAIL",
                     f"refused={refused} expected={case['expect_refused']}"])

    print(tabulate(rows, headers=["suite", "case", "result", "detail"], tablefmt="github"))

    summary = {
        "case_match_accuracy": round(cm_pass / len(_DATA["case_match"]), 3),
        "groundedness": round(g_pass / len(_DATA["groundedness"]), 3),
        "guardrail_pass_rate": round(gr_pass / len(_DATA["guardrails"]), 3),
    }
    print("\n" + tabulate(summary.items(), headers=["metric", "score"], tablefmt="github"))
    return summary


if __name__ == "__main__":
    asyncio.run(run())
