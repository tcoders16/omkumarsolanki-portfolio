"""Small-Talk agent — handles greetings and casual chat.

Keeps it light and human, then gently steers toward what Om can do for the
visitor. Deliberately cheap (fast_llm) and ungrounded — no RAG needed for "hi".

Skills: chitchat, warm_handoff.
"""
from __future__ import annotations

from app.agents.state import AgentState
from app.config import get_settings
from app.llm import fast_llm
from app.schemas import TraceEvent

_SYS = """You are the friendly assistant on Om Kumar Solanki's portfolio — Om is an
AI/ML engineer and consultant who helps companies grow revenue and cut cost with AI
and classic ML. The visitor is just making small talk (a greeting, thanks, or chit-chat).
Reply warmly in 1-2 sentences, sound human, and then offer one light, natural hook toward
how Om could help (e.g. ask what they're working on, or what their business does).
Do not pitch hard. Never invent facts about the visitor."""


def small_talk_node(state: AgentState) -> AgentState:
    settings = get_settings()
    message = state.get("brief", "")
    name = (state.get("contact_name") or "").strip()
    greeting_ctx = f"The visitor's name is {name}." if name else ""

    history = state.get("history", []) or []
    messages = [{"role": "system", "content": _SYS + ("\n\n" + greeting_ctx if greeting_ctx else "")}]
    messages.extend(history[-4:])
    messages.append({"role": "user", "content": message})

    answer = fast_llm(temperature=0.5).invoke(messages).content
    return {
        "answer": str(answer),
        "show_booking": False,
        "trace": [TraceEvent(agent="small_talk", label="Handled casual chat and offered a hook.")],
    }
