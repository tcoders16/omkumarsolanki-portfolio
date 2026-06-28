"""Consultant agent — composes the final, client-facing consulting answer.

Skills: estimate_value, draft_cta.

Inputs differ by path:
  - matched case present  -> cite Om's proven case (proof + metric + client outcome)
  - architect context     -> present the tailored proposed approach
Either way it ends in a professional, industrial tone and proposes the next step
(a free strategy call), setting show_booking.
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.llm import smart_llm
from app.rag.ingest import load_kb
from app.schemas import TraceEvent

_SYS = """You are the senior consultant voice of Om Kumar Solanki's AI practice.
Write a crisp, professional reply to a company that described a problem.

If a MATCHED CASE is provided:
- Lead by connecting their problem to that proven case.
- Cite the concrete proof and metric exactly as given (do not alter numbers).
- State the outcome they can expect, mirroring the client-outcome line.

If a PROPOSED APPROACH is provided instead (no prior case):
- Present it as how Om would solve their specific problem.
- Be honest that it's a tailored plan based on adjacent experience, not a past result.

Always:
- 4-6 sentences, consulting register — direct, senior, no fluff, no emojis.
- Translate into business value (time saved, risk reduced, cost avoided) without inventing numbers.
- NEVER reveal pricing — say it's scoped on the call.
- End by proposing the free 30-min AI strategy call, and append the token [READY_TO_BOOK]
  as the very last characters when the next step is clearly a call."""


def consultant_node(state: AgentState) -> AgentState:
    kb = load_kb()
    mc = state.get("matched_case")
    problem = state.get("brief", "")

    if mc and mc.matched:
        evidence = (
            f"MATCHED CASE\n"
            f"- Problem class: {mc.problem}\n"
            f"- Solution: {mc.solution}\n"
            f"- Om's proof: {mc.reference}\n"
            f"- Client outcome: {mc.result}"
        )
        skill = "estimate_value (matched case)"
    else:
        evidence = f"PROPOSED APPROACH (no prior case)\n{state.get('context','')}"
        skill = "draft_cta (tailored approach)"

    metrics = kb.metrics
    metrics_line = "; ".join(f"{k.replace('_',' ')}: {v}" for k, v in metrics.items())
    memory = state.get("episodic", "")
    msg = (
        f"COMPANY PROBLEM:\n{problem}\n\n"
        + (f"{memory}\n\n" if memory else "")
        + f"{evidence}\n\n"
        f"OM'S VERIFIED METRICS (only ones you may cite): {metrics_line}"
    )

    answer = smart_llm(temperature=0.4).invoke(
        [{"role": "system", "content": _SYS}, {"role": "user", "content": msg}]
    ).content
    text = str(answer)

    show_booking = False
    if "[READY_TO_BOOK]" in text:
        show_booking = True
        text = text.replace("[READY_TO_BOOK]", "").strip()

    return {
        "answer": text,
        "show_booking": show_booking,
        "trace": [TraceEvent(agent="consultant", label=f"Composed the consulting response · {skill}.")],
    }
