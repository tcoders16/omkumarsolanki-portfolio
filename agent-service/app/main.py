"""FastAPI entrypoint for Om's AI consulting agent-service.

Endpoints:
  GET  /health    - liveness + knowledge/guardrails status
  GET  /agents    - the agent roster + skills (rendered in the UI)
  POST /consult   - intake -> multi-agent consulting answer (matched case or approach)
  POST /chat      - general question about Om (Profile-QA path)

The Next.js site is the only caller; it authenticates with the x-service-key header
and persists each /consult result as a lead.
"""
from __future__ import annotations

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.agents.state import AGENT_ROSTER
from app.config import get_settings
from app.guardrails.runner import get_engine
from app.rag.ingest import load_kb
from app.schemas import ChatRequest, ConsultRequest, ConsultResponse

settings = get_settings()
app = FastAPI(title="Om — AI Consulting Agent Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def _auth(x_service_key: str | None) -> None:
    if settings.service_api_key and x_service_key != settings.service_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.on_event("startup")
def _warm() -> None:
    # Load KB + build the graph/guardrails once so the first request is fast.
    load_kb()
    get_engine()


@app.get("/health")
def health() -> dict:
    kb = load_kb()
    engine = get_engine()
    return {
        "status": "ok",
        "knowledge": {
            "sections": len(kb.sections),
            "use_cases": len(kb.use_cases),
            "projects": len(kb.projects),
        },
        "guardrails": "nemo" if engine._nemo_ok else "heuristic",
        "rag_mode": settings.rag_mode,
    }


@app.get("/agents")
def agents() -> dict:
    return {"agents": AGENT_ROSTER}


@app.post("/consult", response_model=ConsultResponse)
async def consult(req: ConsultRequest, x_service_key: str | None = Header(default=None)) -> ConsultResponse:
    _auth(x_service_key)
    if not req.problem.strip():
        raise HTTPException(status_code=400, detail="A problem description is required.")
    history = [t.model_dump() for t in req.history]
    return await get_engine().process(req.as_brief(), is_chat=False, history=history)


@app.post("/chat", response_model=ConsultResponse)
async def chat(req: ChatRequest, x_service_key: str | None = Header(default=None)) -> ConsultResponse:
    _auth(x_service_key)
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="A message is required.")
    history = [t.model_dump() for t in req.history]
    return await get_engine().process(req.message, is_chat=True, history=history)
