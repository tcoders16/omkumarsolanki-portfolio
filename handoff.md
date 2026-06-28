# Handoff

_Single living handoff. Refreshed on every sync (every 20 min, session) and after each task. Newest log entries on top._

---

## Current focus
**Agent orchestration + workflow** — BUILT (2026-06-27). Classifier → supervisor → specialist agents over a vector DB of Om's full profile. Extended the existing `agent-service/` rather than rebuilding.

### Architecture (shipped, all in agent-service/)
- **Vector DB** — Chroma. `om_knowledge` (profile sections + use-cases + projects, now incl. Growth Frameworks) + `om_episodic` (per-session memory). KB index now AUTO-REBUILDS on knowledge-file change (content hash in `.chroma/.kb_hash`).
- **Classifier/Supervisor** — `agents/router.py` now routes to 5 intents: small_talk · general_question · business_problem · book_appointment · send_followup. `graph.py` dispatches each to its node.
- **Specialist agents:**
  - `small_talk.py` — daily chat + warm hook ✅
  - `profile_qa.py` / `case_match`→`architect`/`consultant` — existing (memory + KB grounded) ✅
  - `appointment.py` + `integrations/google_calendar.py` — proposes free slots, books real events; falls back to Cal link ✅
  - `email_followup.py` + `integrations/resend_client.py` — composes + sends recap via Resend; draft-only without key ✅
- **Embeddings** now honour `OPENAI_BASE_URL` / Azure (new `llm.embeddings()`); retrieval degrades to vectorless if embeddings unavailable.

### Verified (local, gpt via proxy)
Router classifies all 5 intents correctly. Small-talk / appointment (slot offer) / email (draft) run end-to-end. Frameworks question retrieves new content via vectorless. Vector embeddings fail on the local proxy (no embedding model) → graceful fallback; works on Azure once an embedding deployment is set.

### To go live (set env vars — see agent-service/.env.example)
- `RESEND_API_KEY` + `RESEND_FROM` (verified domain) → email actually sends
- `GOOGLE_CREDENTIALS_JSON` (service-account JSON; share Om's calendar with it) + `GOOGLE_CALENDAR_ID` → real bookings
- `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` → vector RAG on Azure
- `CHROMA_DIR=/data/.chroma` + mount a persistent volume on Azure Container Apps → profile index + episodic memory survive restarts
- `pip install` new deps: `google-api-python-client`, `google-auth`

## Repo health
- Branch: `main` · last commit `ac686cf` (nothing committed yet this session)
- Source typecheck: clean (only stale `.next` artifacts)
- 77 uncommitted paths (+Google OAuth booking: lib/google-calendar.ts, api/gcal-book, api/google, googleapis dep, /book rewrite); source typecheck clean
- agent-service Python: imports clean, graph builds (8 specialist nodes), routing verified

## In flight (uncommitted)
- Archive reorg (staged): 7 job-hunt pages → `archive/`
- Analytics/tracking: `app/api/analytics`, `app/api/track`, `lib/analytics-store.ts`, `app/admin`
- Opportunities feature + agent
- Agent/chat UI: `components/Agent.tsx` (CSS fixes + natural-language booking: no form hijack, renders booked event link), `ConsultingChat.tsx`, etc.
- NL booking: `app/api/consult/route.ts` (M) forwards `contact_name`/`contact_email`; backend `appointment.py` extracts email from message
- Stakes positioning on /consulting (light): framework + engagements sections added to `ConsultingLight.tsx`; `Process.tsx` reverted to original 5-step; dark `Engagements.tsx` deleted; `portfolio.md` keeps framework/engagements. Orphaned `Rates.tsx` still unmounted.
- Checkout = AI intake + booking: `components/CheckoutAgent.tsx` (light modal) on each consulting tier → captures requirements (lead via /api/consult), name+email, date→slot picker → books via `/api/bookings` (Gmail SMTP emails). `lib/bookings-store.ts` (M) attaches ICS invite → auto-adds to Google Calendar. Needs SMTP_USER/SMTP_PASS to send.
- `/book` → Google Calendar OAuth booking (Om chose API over embed/Cal.com): `lib/google-calendar.ts` (OAuth client, freebusy, createBooking, DST via America/Toronto), `api/gcal-book` (GET connected / POST create event+invite), `api/google/{connect,callback}` (callback writes refresh token to .env.local). `/book` rewritten to dark slot-picker. Scope=full calendar. googleapis added. BLOCKED: Om must authorize once at /api/google/connect → then restart dev server. NOTE: still 2 booking paths (checkout→/api/bookings+SMTP/ICS vs /book→gcal OAuth) — consolidate later.
- Agent-service orchestration (untracked): `agents/{small_talk,appointment,email_followup}.py`, `integrations/`; (modified): `router,graph,state,schemas,config,llm,orchestrator,main,guardrails/runner,rag/vector_store`, `knowledge/portfolio.md`, `requirements.txt`, `.env.example`

## Watch-outs
- Partially-staged (`MM`): `app/page.tsx`, `book`, `consulting`, `Nav.tsx`, `Work.tsx` — re-`add` before commit.
- Scratch root files not gitignored: `*.html`, `system-design-practice.jsx`, root `Dockerfile`.
- Google OAuth client secret was pasted in chat → ROTATE it (Google console → Clients → Reset secret) before prod. Creds live in `.env.local` (gitignored).
- Backend is Azure (Container Apps, gpt-5.1, `om-agent-rg`) — Azure OpenAI, not plain OpenAI.

## Next steps
- [x] Map `agent-service/` orchestration · build classifier→supervisor→specialist flow (done)
- [ ] Set prod env: `SMTP_USER`/`SMTP_PASS` (Gmail app pw → checkout email + ICS calendar), `RESEND_API_KEY`/`RESEND_FROM`, `GOOGLE_CREDENTIALS_JSON`/`GOOGLE_CALENDAR_ID`, `AZURE_OPENAI_EMBEDDING_DEPLOYMENT`, `CHROMA_DIR=/data/.chroma` + volume
- [x] Wire `contact_name`/`contact_email` from frontend → done (NL chat + /consulting checkout pass email to appointment agent)
- [ ] Om authorize Google Calendar once at /api/google/connect → mints refresh token → restart dev server → /book live
- [ ] Group uncommitted work into clean commits
- [ ] `next build` + agent-service deploy (incl. new google-api-python-client/google-auth deps)

---

## Log
- **2026-06-27** — Google Calendar OAuth booking built: `lib/google-calendar.ts` + `/api/gcal-book` (create event + invite, freebusy double-book check) + `/api/google/{connect,callback}` (one-click auth → refresh token written to .env.local). `/book` rewritten as dark slot-picker; googleapis installed; `.env.example` completed; client id/secret in .env.local. WAITING on Om to authorize at /api/google/connect (refresh token still empty) then server restart.
- **2026-06-27** — `/book` rewritten to native Google Calendar: removed custom slot grid + Cal.com; now embeds `NEXT_PUBLIC_BOOKING_URL` (Google Appointment Schedule link, `?gv=true`). Unlinked → red "Google Calendar API — not connected" diagnostic. BLOCKED on Om providing the appointment-schedule link (no API to generate it) OR choosing the OAuth API path. Decision saved to memory.
- **2026-06-27** — Checkout now books via the Gmail pipeline: CheckoutAgent rewired from agent-service Google-Cal path → `/api/bookings` (persists + Gmail SMTP emails), smooth in-modal date→slot picker, requirements passed as booking note. `lib/bookings-store.ts` notifyEmail now attaches an ICS invite (METHOD:REQUEST, ET→UTC-5) → booking auto-adds to Google Calendar for Om + client. Typechecks clean, ICS math verified. Needs SMTP_USER/SMTP_PASS (Gmail app password) to actually send.
- **2026-06-27** — Checkout-as-booking on /consulting: moved framework + engagements to ConsultingLight (light theme), reverted /engineering Process to 5-step, deleted dark Engagements.tsx. New CheckoutAgent.tsx modal per tier — AI captures requirements (lead persisted) + email → books call via appointment agent. Typechecks clean, verified serving. (Real calendar booking still needs GOOGLE_CREDENTIALS_JSON.)
- **2026-06-27** — Positioning aligned to stakes-based model (QuantumBlack-inspired): Process.tsx → 6-phase "Baseline→Value" execution framework; new Engagements.tsx (Diagnostic fee / Build-partner fee+share / Venture equity) mounted on /engineering after Process; portfolio.md synced (Execution Framework + Engagements + FAQ, removed all hourly/$). NOTE: orphaned Rates.tsx still has old Discovery/Build/Scale tiers but is unmounted.
- **2026-06-27** — Natural-language booking wired through the chat: removed BOOK_RE form-hijack; `appointment.py` extracts email from message/history; consult proxy forwards contact_name/email; Agent.tsx renders booked event link. NL booking verified end-to-end (real event needs GOOGLE_CREDENTIALS_JSON; else falls back to Cal link).
- **2026-06-27** — Agent.tsx UI fixes: appointment form fields no longer shrink/clip (flex-shrink:0 + textarea min-height); added missing chat input-row CSS (was raw browser textarea — blue ring/overflow → styled field + accent send button).
- **2026-06-27** — Built agent orchestration: added small_talk/appointment/email agents, 5-intent supervisor, Google Calendar + Resend integrations (graceful fallbacks), Growth Frameworks KB section, embeddings provider-aware + auto-rebuilding KB index. All compiles; routing + agents verified end-to-end.
- **2026-06-27** — Switched handoff from folder to single `handoff.md`. Cron repointed to this file (every 20 min).
- **2026-06-27** — Pivoted focus to agent orchestration + vector-DB profile retrieval. Started mapping existing `agent-service/`.
- **2026-06-27** — Set up handoff + 20-min session sync (job `98294620`). Baseline: source clean, ~57 uncommitted paths.

## Activity (auto)
- 2026-06-27 21:08 · main @ac686cf · 77 uncommitted · Δ+60 ctx-lines
- 2026-06-27 21:03 · main @ac686cf · 77 uncommitted · Δ+33 ctx-lines
- 2026-06-27 20:38 · main @ac686cf · 77 uncommitted · Δ+181 ctx-lines
- 2026-06-27 20:31 · main @ac686cf · 77 uncommitted · Δ+17 ctx-lines
- 2026-06-27 20:09 · main @ac686cf · 77 uncommitted · Δ+53 ctx-lines
- 2026-06-27 20:03 · main @ac686cf · 77 uncommitted · Δ+58 ctx-lines
- 2026-06-27 19:55 · main @ac686cf · 75 uncommitted · Δ+73 ctx-lines
- 2026-06-27 19:47 · main @ac686cf · 71 uncommitted · Δ+48 ctx-lines
