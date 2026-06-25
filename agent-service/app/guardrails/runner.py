"""NeMo Guardrails layer wrapping the multi-agent generation.

Primary path (GUARDRAILS_ENABLED=true): NeMo Guardrails `LLMRails` runs the
input rails (jailbreak / topic control), then our LangGraph — registered as the
`generate_answer` action — produces the answer, then the output rails check it.
Structured data (classification, matched case, trace) is passed in/out of the
action via per-request dicts keyed by a request id sent in the context message.

Fallback path (guardrails disabled, or NeMo init/runtime fails): we run the graph
directly and apply lightweight Python rails (jailbreak block + pricing scrub) so
the service stays available and testable offline.
"""
from __future__ import annotations

import re
import uuid

from app.config import get_settings
from app.orchestrator import run_graph
from app.schemas import Classification, ConsultResponse, MatchedCase, TraceEvent

# Per-request hand-off between this module and the NeMo custom action.
_REQUESTS: dict[str, dict] = {}
_RESULTS: dict[str, ConsultResponse] = {}

_JAILBREAK = re.compile(
    r"(ignore (all|previous|prior) (instructions|prompts)|"
    r"system prompt|you are now|disregard (the|your) (rules|instructions)|"
    r"\bDAN\b|jailbreak|act as if)",
    re.IGNORECASE,
)
_PRICING = re.compile(r"\$\s?\d[\d,]*(?:\.\d+)?\s?(?:/\s?(?:hr|hour|day|mo|month))?|\b\d+\s?k\b", re.IGNORECASE)

_OFF_TOPIC_REFUSAL = (
    "I can only help with questions about Om's work and how he'd solve an AI or "
    "automation problem for your business. For anything else, email emailtosolankiom@gmail.com."
)


def _refusal_response(message: str | None = None) -> ConsultResponse:
    return ConsultResponse(
        answer=message or _OFF_TOPIC_REFUSAL,
        classification=Classification(intent="general_question", domain="general", summary="blocked by input rail"),
        matched_case=MatchedCase(matched=False),
        trace=[TraceEvent(agent="guardrails", label="Input rail blocked an off-topic or unsafe request.")],
        show_booking=False,
    )


async def _generate_answer_action(request_id: str = "", **_) -> str:
    """Registered with NeMo as `generate_answer`. Runs the multi-agent graph."""
    req = _REQUESTS.get(request_id, {})
    result = run_graph(
        req.get("brief", ""), is_chat=req.get("is_chat", False), history=req.get("history")
    )
    _RESULTS[request_id] = result
    return result.answer


class GuardrailsEngine:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._rails = None
        self._nemo_ok = False
        if self.settings.guardrails_enabled:
            self._init_nemo()

    def _init_nemo(self) -> None:
        try:
            from nemoguardrails import LLMRails, RailsConfig

            config = RailsConfig.from_path(self.settings.guardrails_config_dir)
            self._rails = LLMRails(config)
            self._rails.register_action(_generate_answer_action, name="generate_answer")
            self._nemo_ok = True
        except Exception as exc:  # pragma: no cover - depends on env/network
            print(f"[guardrails] NeMo unavailable, using heuristic fallback: {exc}")
            self._nemo_ok = False

    # --- public API -------------------------------------------------------
    async def process(self, brief: str, *, is_chat: bool = False, history: list[dict] | None = None) -> ConsultResponse:
        if self._nemo_ok:
            return await self._process_nemo(brief, is_chat, history)
        return self._process_fallback(brief, is_chat, history)

    # --- NeMo path --------------------------------------------------------
    async def _process_nemo(self, brief: str, is_chat: bool, history: list[dict] | None) -> ConsultResponse:
        rid = uuid.uuid4().hex
        _REQUESTS[rid] = {"brief": brief, "is_chat": is_chat, "history": history or []}
        try:
            messages = [
                {"role": "context", "content": {"request_id": rid}},
                {"role": "user", "content": brief},
            ]
            resp = await self._rails.generate_async(messages=messages)
            text = resp.get("content") if isinstance(resp, dict) else str(resp)
            result = _RESULTS.get(rid)
            if result is None:
                # Input rail fired before our action ran -> refusal text from rails.
                return _refusal_response(text)
            if text and text.strip() and text.strip() != (result.answer or "").strip():
                # Output rail replaced the answer with a safe message.
                result = result.model_copy(update={"answer": text.strip(), "show_booking": False})
                result.trace.append(
                    TraceEvent(agent="guardrails", label="Output rail adjusted the response.")
                )
            return result
        except Exception as exc:  # pragma: no cover
            print(f"[guardrails] NeMo runtime error, falling back: {exc}")
            return self._process_fallback(brief, is_chat, history)
        finally:
            _REQUESTS.pop(rid, None)
            _RESULTS.pop(rid, None)

    # --- Heuristic fallback ----------------------------------------------
    def _process_fallback(self, brief: str, is_chat: bool, history: list[dict] | None) -> ConsultResponse:
        if _JAILBREAK.search(brief or ""):
            return _refusal_response()
        result = run_graph(brief, is_chat=is_chat, history=history)
        # Output rail: never leak pricing numbers.
        if _PRICING.search(result.answer or ""):
            scrubbed = _PRICING.sub("(scoped on the call)", result.answer)
            result = result.model_copy(update={"answer": scrubbed})
            result.trace.append(
                TraceEvent(agent="guardrails", label="Output rail scrubbed a pricing reference.")
            )
        return result


_engine: GuardrailsEngine | None = None


def get_engine() -> GuardrailsEngine:
    global _engine
    if _engine is None:
        _engine = GuardrailsEngine()
    return _engine
