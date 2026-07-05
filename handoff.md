# Handoff

_Single living handoff. Refreshed on every sync (every 20 min, session) and after each task. Newest log entries on top._

---

## Current focus
**FULL SITE REDESIGN → Polymath monochrome system** — BUILT 2026-07-04, all builds green, COMMITTED + PUSHED 2026-07-04 (see log). Typography follow-up committed 2026-07-05.

### Typography pass 2026-07-05 (third pass)
- **Fraunces display serif REPLACED with the Apple system SF stack** (`-apple-system, BlinkMacSystemFont, 'SF Pro Display'/'SF Pro Text', 'Helvetica Neue', 'Inter'`) on all personal surfaces: home doorway, /book, /engineering (EngineeringMono, EngAgentChat, EngContactForm) and the global Agent widget. Display headings now 600 weight with tighter tracking (−0.028/−0.032em); brand lockups 17px/600. Fraunces removed from all per-page font links and the global layout link (Inter/Geist Mono + legacy fonts kept). Polymath /consulting untouched. Build green (20 pages), committed + pushed this session.

### Brand layer added 2026-07-04 (same day, second pass)
- **`components/OmMark.tsx`** — personal logo: hairline ring (the O) + center dot + spoke to a node beyond the ring ("orchestrator dispatching an agent"). Circular counterpart to PolymathMark. `sw` and `dot` are SCREEN-px (converted to viewBox units) so it stays crisp at any size. Mounted: home doorway header, /engineering nav, /book bar, Agent widget avatar + fab, `app/icon.svg` favicon (Carbon rounded square version).
- **Typography upgraded to Fraunces** (display serif, opsz auto, wght 480–500, track −0.015em) for display headings + brand wordmark on the PERSONAL surfaces only: home doorway, /engineering (em-h1/em-h2/em-contact-h2/em-brand), /book. Polymath /consulting untouched (pixel-faithful to design handoff). Inter body + Geist Mono eyebrows unchanged. Fraunces added to per-page font links + global layout link.
- Brand design-system bundle (mark, wordmark lockup, type specimen, five tones) built for claude.ai/design via DesignSync MCP — BLOCKED on user running `/design-login`; files in session scratchpad `om-brand/`, regenerate from OmMark.tsx if lost.
- `.github/workflows/deploy.yml` FIXED: Azure frontend job removed (prod frontend = Vercel); agent-service job now only triggers on `agent-service/**` paths or manual dispatch (AZURE_CREDENTIALS secret still not created, so it won't red-X normal pushes).

### What happened this session (2026-07-04)
1. **/consulting replaced with Polymath Consultancy Group** — pixel-faithful rebuild from `design_handoff_polymath_website/` (design handoff bundle at repo root; README inside is the spec). New: `components/PolymathConsulting.tsx` (full one-pager), `PolymathMark.tsx` (aperture logo, themable ink, stroke ~1.5px at any size), `PolymathAgent.tsx` (the /api/consult diagnosis chatbot KEPT, reskinned monochrome, sits in "Live diagnosis" section). Deleted: ConsultingLight, ConsultAgentFlow, CheckoutAgent, ConsultAgent, ConsultingChat, ConsultingClient.
2. **Old engineering site + home replaced** (user: "hate the site, love the content") — content preserved VERBATIM, UI rebuilt in the same monochrome system, repositioned **agents/orchestration first, "applied AI" not "ML"** (small explainable ML stays, framed as such):
   - `components/EngineeringMono.tsx` — whole /engineering page (nav, hero, multi-agent orchestration section, work/projects, process, about w/ photo, contact). All old copy lives in data arrays at the top of this file.
   - `components/EngAgentChat.tsx` — engineering chatbot (router→case_match→architect→consultant over /api/consult) kept, reskinned.
   - `components/EngContactForm.tsx` — /api/contact form kept, reskinned.
   - `app/page.tsx` — doorway rebuilt monochrome (eng=Carbon / Polymath=Porcelain).
   - `app/book/page.tsx` — same gcal-book logic, restyled monochrome, old Nav removed.
   - `app/layout.tsx` — metadata repositioned to "Applied AI Engineer · Agents & Orchestration".
   - Deleted 17 orphaned old-theme components (Hero, Work, About, CapabilityStack, Process, Contact, Nav, EngineeringAgent, Terminal, MathShowcase, ThreeBackground, ScrollPop, TechStack, Rates, Agentic, OpportunityFinder, BusinessChat). **Story.tsx intentionally KEPT** (user wants it preserved; unmounted).

### Design system (both sites share it — do not drift)
Five tones ONLY: Carbon #0A0A0C · Graphite #26262E · Steel #6E6E78 · Fog #E9E9E5 · Porcelain #FAFAF8. Inter (400/500, opsz) + Geist Mono eyebrows (uppercase, 0.14–0.22em tracking). 1px hairline card grids (gap:1px, bg=hairline color), NO card radius, NO shadows, NO accent colors/gradients. Buttons only: radius 7–8px. Sections: 1100px max, 120px pad, h2 42px/500/-0.025em. Fonts loaded per-page via Google Fonts <link> inside components.

### Verified
`npm run build` green (20 pages). /consulting, /engineering, / visually verified in Chrome (localhost:3000 dev server). Design tokens checked via DOM (exact rgb values, hairlines, fonts loaded). FAQ accordion + chat components render. NOTE: /api/consult returns "unavailable" locally (Python agent-service not running locally — prod is Azure, unaffected); chat error-fallback states verified instead.

### NEXT PLAN (for the next agent)
1. ~~Commit + push~~ ✅ DONE — redesign in `d653584`, SF typography pass in `2570f73`, animations + nav switch in `0c320e3`; all pushed, Vercel auto-deployed.
2. ~~Verify prod after deploy~~ ✅ DONE 2026-07-05: www.omkumarsolanki.com 200 (apex 307→www); /api/gcal-book `connected:true`; /api/consult 200 with real grounded answer from Azure agent-service (payload needs `problem` field — `message` alone 400s, both chat UIs send `problem`); switch buttons + omk-anim + BrandName spans confirmed in live prod HTML.
3. Polymath page has intentional `[XX]` placeholder metrics + `[Client / industry name]` case studies (per design handoff) — fill with real data when engagements complete. Constants at top of PolymathConsulting.tsx: BOOK_HREF=/book, CONTACT_EMAIL=emailtosolankiom@gmail.com, HEADLINE (4 approved alternates in comment).
4. ~~Reskin global Agent.tsx~~ ✅ DONE — `components/Agent.tsx` (the floating "Ask Om's AI" bubble, mounted globally in layout.tsx, on every page) reskinned to monochrome: Carbon header + Porcelain "O" avatar, Geist Mono uppercase labels, Fog hairline chips, Carbon send/book buttons. Only CSS + font consts changed; all chat/harness/booking logic untouched. `app/layout.tsx` font link now also loads Geist Mono + Inter opsz globally (so the widget renders right on every page, incl. old /resume /leads /admin).
5. `/resume`, `/leads`, `/admin` pages untouched (old teal/Space-Grotesk styling) — restyle later if wanted. (The floating Agent bubble on them is now monochrome, so there's a slight theme mismatch on those 3 legacy pages until they're redone.)
6. Old "Previous focus" below (agent-service orchestration) still accurate & deployed.

---

## Previous focus
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
- Branch: `main` · pushed `d5b9c2c`; uncommitted: `.gitignore` (vercel link), `handoff.md`, `.github/` (deploy.yml — not committed)
- **DEPLOYED**: agent-service → Azure Container Apps (`om-agent-service`, healthy, 51 KB sections, gpt-5.1). FRONTEND → **Vercel** (`omkumarsolanki-portfolio` → omkumarsolanki.com), auto-deploys on git push. Azure frontend (`om-portfolio-web`) FAILED (next build OOM) + redundant — abandoned.
- Vercel prod env vars SET + verified live: AGENT_SERVICE_URL/KEY (real Azure service-key), GOOGLE_OAUTH_{CLIENT_ID,SECRET,REDIRECT_URI,REFRESH_TOKEN}, GOOGLE_CALENDAR_ID, CONTACT_EMAIL. **Prod fully working** (chat 200, consult 200, /book connected).
- Google refresh token WAS minted (consent completed; real `1//…` token) — now in .env.local + Vercel prod

## In flight — NOTE: all SHIPPED (committed `d5b9c2c` + deployed). Below is the feature inventory, no longer "uncommitted".
- Archive reorg: 7 job-hunt pages → `archive/`
- Analytics/tracking: `app/api/analytics`, `app/api/track`, `lib/analytics-store.ts`, `app/admin`
- Opportunities feature + agent
- Agent/chat UI: `components/Agent.tsx` (CSS fixes + natural-language booking: no form hijack, renders booked event link), `ConsultingChat.tsx`, etc.
- NL booking: `app/api/consult/route.ts` (M) forwards `contact_name`/`contact_email`; backend `appointment.py` extracts email from message
- Stakes positioning on /consulting (light): framework + engagements sections added to `ConsultingLight.tsx`; `Process.tsx` reverted to original 5-step; dark `Engagements.tsx` deleted; `portfolio.md` keeps framework/engagements. Orphaned `Rates.tsx` still unmounted.
- Checkout = AI intake + booking: `components/CheckoutAgent.tsx` (light modal) on each consulting tier → captures requirements (lead via /api/consult), name+email, date→slot picker → books via `/api/bookings` (Gmail SMTP emails). `lib/bookings-store.ts` (M) attaches ICS invite → auto-adds to Google Calendar. Needs SMTP_USER/SMTP_PASS to send.
- `/book` → Google Calendar OAuth booking (Om chose API over embed/Cal.com): `lib/google-calendar.ts` (OAuth client, freebusy, createBooking, DST via America/Toronto), `api/gcal-book` (GET connected / POST create event+invite), `api/google/{connect,callback}` (callback writes refresh token to .env.local). `/book` rewritten to dark slot-picker. Scope=full calendar. googleapis added. DONE: refresh token minted + set in Vercel → /book LIVE in prod (connected:true). NOTE: still 2 booking paths (checkout→/api/bookings+SMTP/ICS vs /book→gcal OAuth) — consolidate later.
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
- [x] Google Calendar OAuth done — refresh token minted + in Vercel → /book live in prod
- [x] Commit + push all work (d5b9c2c) · [x] deploy agent-service to Azure
- [x] Frontend prod = Vercel (not Azure); env vars added; redeploy triggered
- [x] Prod fully verified: /book connected, AI chat 200, consult 200, agent-service healthy — DEPLOYMENT COMPLETE
- [x] `.github/workflows/deploy.yml` fixed (committed `d653584`): Azure frontend job removed, agent-service job path-scoped to `agent-service/**` — still needs `AZURE_CREDENTIALS` secret before the job can run (manual `az containerapp up` until then)
- [ ] Add prod redirect URI to Google client only if re-auth needed (token already works)

---

## Log
- **2026-07-05 (prod verify)** — ✅ Prod verified after `0c320e3` deploy: home/eng/consulting 200 with animations + switch buttons live; /api/gcal-book connected:true; /api/consult 200 (real Azure agent-service answer, MCP Enterprise Bridge cited). Handoff NEXT PLAN items 1–2 closed. Remaining open: env secrets (SMTP/RESEND/GOOGLE_CREDENTIALS_JSON/embedding deployment/CHROMA_DIR volume — need user), `[XX]` Polymath placeholder metrics (need real engagement data), optional /resume /leads /admin restyle.
- **2026-07-05 (later)** — Brand animation + nav switch: (1) `OmMark` gained an `animate` prop — dispatch entrance (ring draws from 12 o'clock, core dot pops, spoke draws outward, node pops, then a faint 3.6s pulse halo on the node), pure CSS in-SVG, reduced-motion safe; enabled at all 5 mounts (doorway, /book bar, /engineering nav, Agent avatar + fab). (2) New `components/BrandName.tsx` — "Omkumar Solanki" wordmark animates per-letter (staggered blur-fade-up, 45ms stagger, tracking settles 0.06em → −0.015em over 1.8s); mounted in the 3 brand lockups. (3) New `components/SwitchLink.tsx` — the ONE shared nav switch button (hairline outline, 7px radius, arrow nudges on hover): "Consulting →" on /engineering nav, "Engineering →" on /consulting nav; old plain Consulting nav link + footer "Polymath Consultancy →" removed (user: no duplicates); stays visible on mobile where plain links collapse. Build green, all pages 200, committed + pushed.
- **2026-07-05** — Typography pass committed + pushed: Fraunces → Apple system SF stack across home, /book, /engineering (page + chat + contact form) and global Agent widget; headings 600wt, tighter tracking; Fraunces dropped from all font links. Build green (20 pages). deploy.yml confirmed already fixed in `d653584` (checkbox below stale). Prod verify pending Vercel auto-deploy.
- **2026-07-04 (later)** — Brand pass: new OmMark personal logo (ring+spoke+node) across nav/doorway/book/widget/favicon; Fraunces display serif on personal pages (home, /engineering, /book) — classy editorial look, monochrome tones untouched; deploy.yml Azure frontend job removed + agent-service job path-scoped; ALL WORK COMMITTED + PUSHED → Vercel auto-deploy. DesignSync (claude.ai/design) publish of the brand bundle pending user `/design-login`.
- **2026-07-04** — Global floating chat widget `Agent.tsx` reskinned to the monochrome system (Carbon header/Porcelain avatar/Geist Mono labels/Fog hairlines/Carbon buttons) — logic untouched, only STYLE + font consts. `layout.tsx` font link now loads Geist Mono + Inter opsz globally. Build green, verified open in Chrome on /consulting. Now the whole primary surface (home, engineering, consulting, book, + global widget) is one consistent system.
- **2026-07-04** — FULL REDESIGN: /consulting → Polymath Consultancy Group (pixel-faithful from design_handoff_polymath_website/, chatbot kept + reskinned as PolymathAgent). /engineering + / + /book rebuilt in same monochrome five-tone system — content verbatim, repositioned agents-first/applied-AI (ML framed as "small, explainable where it earned its place"). 23 old components deleted (Story.tsx kept per user), 6 new components. Builds green, visually verified. UNCOMMITTED — next agent: commit/push → Vercel, then verify prod. See "Current focus" for full plan.
- **2026-06-29** — ✅ FULL PROD VERIFIED on omkumarsolanki.com: AI chat 200 (real response), /api/consult 200 (cites Lawline case), /api/gcal-book connected:true (booking live), home 200, agent-service Azure health ok. Chat 401 root cause was AGENT_SERVICE_KEY = dev placeholder; set Vercel to real Azure service-key (48ch) + redeploy → 200. Deployment COMPLETE.
- **2026-06-29** — Prod verify: `/api/gcal-book` → connected:true (✅ /book booking LIVE on prod). AI chat returned 401 — `AGENT_SERVICE_KEY` in Vercel was the dev placeholder (`local-…`) not the real Azure `service-key` (`d3f5fc…`); fixed Vercel + .env.local to the Azure value, redeploying. Azure `SERVICE_API_KEY` env shows value:"" but binds via secretRef `service-key` (correct).
- **2026-06-28** — Wired prod env on Vercel (frontend is Vercel, NOT Azure — clarified): linked project, added AGENT_SERVICE_URL/KEY + all GOOGLE_OAUTH_* (incl. real minted refresh token) + CONTACT_EMAIL to prod; triggered `vercel --prod` redeploy (in flight) → prod AI chat + /book OAuth should work after. Azure frontend `om-portfolio-web` build OOM-failed + redundant, abandoned. Created `.github/workflows/deploy.yml` (Azure CI/CD; frontend job moot since Vercel). NEXT: verify prod /api/gcal-book connected:true + chat after redeploy.
- **2026-06-28** — DEPLOY: committed all session work + pushed to GitHub main (`d5b9c2c`, 80 files; no secrets — .env.local/agent-service/.env gitignored). Redeployed agent-service to Azure Container Apps — revision 0000003 Healthy, /health ok over HTTPS. Started frontend deploy (new Container App `om-portfolio-web` via root Dockerfile, Next.js standalone). NEXT: set frontend env vars from .env.local; OAuth /book needs prod redirect URI + re-auth (localhost-bound now).
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
- 2026-07-04 19:47 · main @d653584 · 0 uncommitted · Δ-67 ctx-lines
- 2026-07-04 12:42 · main @d5b9c2c · 39 uncommitted · Δ+67 ctx-lines
- 2026-07-04 11:23 · main @d5b9c2c · 38 uncommitted · Δ+184 ctx-lines
- 2026-07-04 11:09 · main @d5b9c2c · 14 uncommitted · Δ-124 ctx-lines
- 2026-07-02 18:46 · main @d5b9c2c · 3 uncommitted · Δ-1956 ctx-lines
- 2026-06-30 14:03 · main @d5b9c2c · 3 uncommitted · Δ+9 ctx-lines
- 2026-06-30 12:25 · main @d5b9c2c · 3 uncommitted · Δ+10 ctx-lines
- 2026-06-29 21:54 · main @d5b9c2c · 3 uncommitted · Δ+16 ctx-lines
