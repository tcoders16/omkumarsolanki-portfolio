# Om — AI Consulting Agent Service

A Python FastAPI microservice that powers the **consulting agent** on Om Kumar
Solanki's portfolio. A visiting company describes its problem; a **multi-agent
system** either cites a **proven prior case** or designs **how Om would solve it**
from adjacent experience — wrapped in **NeMo Guardrails**.

Implements the full agentic stack from the reference course:
**LangChain · LangGraph · RAG · Vectorless RAG · NeMo Guardrails · Evals.**

## Architecture

```
FastAPI (/consult /chat /agents /health)
   └─ NeMo Guardrails (input rails → generation → output rails)
        └─ LangGraph supervisor
             router → ┬ case_match → ┬ consultant            (proven case)
                      │              └ architect → consultant (tailored approach)
                      └ profile_qa                            (general question)
        └─ RAG (Chroma vectors) + Vectorless RAG (PageIndex over portfolio.md)
   knowledge/  ← portfolio.md + om-meta.json (synced from the site)
```

| Agent | Role | Skills |
|-------|------|--------|
| Router / Supervisor | classify intent + domain, route | `classify_intent`, `detect_domain` |
| Case-Match | find a proven matching case | `retrieve_cases`, `score_match` |
| Solution-Architect | design an approach when no case fits | `retrieve_skills`, `compose_approach` |
| Consultant | synthesize answer + ROI + CTA | `estimate_value`, `draft_cta` |
| Profile-QA | general questions about Om | `retrieve_profile` |

## Run locally

```bash
cd agent-service
cp .env.example .env            # set OPENAI_API_KEY (+ SERVICE_API_KEY)
./scripts/sync_knowledge.sh     # copy portfolio.md + om-meta.json from the site

# Option A — Docker
docker-compose up --build

# Option B — venv
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Check it:
```bash
curl localhost:8000/health
curl -X POST localhost:8000/consult -H 'content-type: application/json' \
  -H 'x-service-key: change-me' \
  -d '{"company":"Acme","what_they_do":"recruiting agency","problem":"hiring is slow and gut-feel","industry":"HR"}'
```

## Evals

```bash
python -m app.evals.run_evals
```
Reports `case_match_accuracy`, `groundedness`, and `guardrail_pass_rate`.

## Deploy (Railway / Render)

1. `./scripts/sync_knowledge.sh && git commit` so `knowledge/` ships with the image.
2. New service from this folder; Railway/Render auto-detects the `Dockerfile`.
3. Set env: `OPENAI_API_KEY`, `SERVICE_API_KEY`, `ALLOWED_ORIGINS=https://<your-site>`.
4. Copy the public URL into the site's `AGENT_SERVICE_URL` (Vercel env).

## Keeping knowledge in sync

`public/knowledge/portfolio.md` and `data/om-meta.json` on the site are the single
source of truth. After editing either, run `./scripts/sync_knowledge.sh` and
redeploy. Delete `.chroma/` (or the docker volume) to force the vector index to
rebuild from the new content.

## Config

`GUARDRAILS_ENABLED=true` uses real NeMo Guardrails (`app/guardrails/config/`). If
NeMo can't initialize, the service automatically falls back to lightweight Python
rails (jailbreak block + pricing scrub) so it stays available. `RAG_MODE` =
`vector` | `vectorless` | `hybrid` (default).
