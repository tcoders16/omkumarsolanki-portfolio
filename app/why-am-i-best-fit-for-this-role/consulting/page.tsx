"use client";
import { useState, useEffect, useRef } from "react";

/* ── Floating checklist ── */
const checklist = [
  { req: "Problem Structuring & MECE Thinking",  metric: "4 industries · hypothesis-first" },
  { req: "Client Discovery & Requirements",       metric: "On-site before any code" },
  { req: "Stakeholder Alignment",                 metric: "Weekly eval dashboards · sign-offs" },
  { req: "Cross-Industry Experience",             metric: "Legal · EdTech · Eng · Transit" },
  { req: "Data-Driven Business Case",             metric: "$1M conversation · renewed contracts" },
  { req: "AI / Technology Strategy",              metric: "P&L framing, not feature lists" },
  { req: "End-to-End Delivery",                   metric: "Solo: scoping → prod → P0 support" },
  { req: "Executive Communication",               metric: "Briefs that close the room" },
];

const TICKER = [
  { label: "Context Retention",   val: "72% → 98%",     sub: "Resso.ai" },
  { label: "Hallucination",       val: "14% → 3.8%",    sub: "LLM quality" },
  { label: "Data Egress",         val: "0 bytes",        sub: "Lawline · Air-gapped" },
  { label: "Investment Unlocked", val: "$1M",            sub: "Rogers President" },
  { label: "Rider Base",          val: "1.7M / day",    sub: "TTC Lost and Found" },
  { label: "Prediction R²",       val: "0.89",           sub: "Corol · UHPC ML" },
  { label: "P0 Incident",         val: "24 min",         sub: "Resolved in prod" },
  { label: "Lab Cycle",           val: "Weeks → 1 day", sub: "UHPC screening" },
  { label: "Clients Consulted",   val: "10+",            sub: "Startups & scale-ups" },
  { label: "MCP Deployments",     val: "5",              sub: "4 wks → 3 days" },
];

/* Thin teal rule matching the PDF resume exactly */
function Rule() {
  return (
    <div style={{
      height: 1,
      background: "#0a7a6a",
      margin: "4px 0 18px",
      opacity: 0.7,
    }} />
  );
}

/* Section heading — "E X P E R I E N C E" style */
function SectionHead({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "#0a7a6a",
        marginBottom: 4,
      }}>
        {children.split("").join(" ")}
      </div>
      <Rule />
    </div>
  );
}

export default function ConsultingResume() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [listOpen, setListOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setTimerActive(false); setChecked(new Set()); return 300; }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : (next.add(i), !timerActive && startTimer());
    setChecked(next);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const ticker = [...TICKER, ...TICKER];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#f0ede8; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; color:#111; }

        /* ── TICKER ── */
        .ticker-wrap { position:sticky; top:0; z-index:300; }
        .ticker-bar  { background:#111; border-bottom:2px solid #0a7a6a; display:flex; height:46px; overflow:hidden; }
        .tick-label  { flex-shrink:0; background:#0a7a6a; color:#fff; padding:0 20px; display:flex; align-items:center; gap:8px; min-width:140px; }
        .tick-dot    { width:8px; height:8px; border-radius:50%; background:#fff; animation:tblink .8s infinite; }
        @keyframes tblink { 0%,100%{opacity:1}50%{opacity:.05} }
        .tick-title  { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; }
        .tick-track  { flex:1; overflow:hidden; display:flex; align-items:center; }
        .tick-inner  { display:flex; white-space:nowrap; animation:tscroll 52s linear infinite; }
        .tick-inner:hover { animation-play-state:paused; }
        @keyframes tscroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .tick-item   { display:inline-flex; align-items:center; gap:10px; padding:0 32px; font-size:12px; color:#888; }
        .tick-item strong { color:#e8e8e8; font-weight:700; }
        .tick-sep    { color:#0a7a6a; font-weight:700; font-size:14px; }

        /* ── FLOATING CHECKLIST ── */
        .float-wrap { position:fixed; right:18px; top:50%; transform:translateY(-50%); z-index:400; width:280px; }
        .float-btn  { width:100%; background:#0a7a6a; color:#fff; border:none; padding:10px 14px; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; cursor:pointer; border-radius:6px 6px 0 0; display:flex; justify-content:space-between; align-items:center; }
        .float-body { background:#fff; border:1.5px solid #d0e8e4; border-top:none; border-radius:0 0 8px 8px; overflow:hidden; }
        .float-head { background:#f0faf8; padding:10px 13px; border-bottom:1px solid #d0e8e4; }
        .float-htitle { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; color:#0a7a6a; letter-spacing:.14em; text-transform:uppercase; }
        .float-hsub   { font-size:10px; color:#999; margin-top:2px; }
        .float-timer  { font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700; color:#0a7a6a; text-align:center; padding:7px 0; border-bottom:1px solid #eee; }
        .float-list   { list-style:none; max-height:320px; overflow-y:auto; }
        .float-item   { display:flex; align-items:flex-start; gap:8px; padding:8px 13px; cursor:pointer; border-bottom:1px solid #f5f5f3; transition:background .1s; }
        .float-item:last-child { border-bottom:none; }
        .float-item:hover { background:#f8fdfb; }
        .float-item.done  { background:#f0faf8; }
        .f-box { width:15px; height:15px; border-radius:3px; border:1.5px solid #ccc; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; transition:all .15s; font-size:9px; }
        .float-item.done .f-box { background:#0a7a6a; border-color:#0a7a6a; color:#fff; }
        .f-req { font-size:11px; color:#333; font-weight:500; line-height:1.4; }
        .f-met { font-family:'JetBrains Mono',monospace; font-size:9px; color:#0a7a6a; margin-top:1px; }
        @media(max-width:900px){ .float-wrap{ display:none; } }

        /* ── PAGE SHELL ── */
        .page { max-width:780px; margin:0 auto; padding:36px 24px 100px; }

        /* ── PRINT BUTTON ── */
        .print-bar { display:flex; justify-content:flex-end; margin-bottom:16px; }
        .print-btn { display:flex; align-items:center; gap:7px; background:#fff; border:1px solid #d8d8d2; border-radius:5px; padding:7px 14px; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; color:#555; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; transition:all .15s; }
        .print-btn:hover { border-color:#0a7a6a; color:#0a7a6a; }

        /* ── RESUME PAPER ── */
        .resume { background:#fff; border-radius:4px; box-shadow:0 2px 32px rgba(0,0,0,.1); padding:52px 56px 64px; }
        @media(max-width:640px){ .resume{ padding:32px 24px 48px; } }

        /* ── NAME BLOCK ── */
        .r-name { font-family:'Syne',sans-serif; font-size:42px; font-weight:800; color:#0d0d0d; letter-spacing:-.02em; line-height:1; margin-bottom:8px; }
        .r-subtitle { font-family:'Inter',sans-serif; font-size:11px; font-weight:500; letter-spacing:.22em; text-transform:uppercase; color:#222; margin-bottom:14px; }
        .r-contact { font-size:13px; color:#777; display:flex; flex-wrap:wrap; gap:4px 0; align-items:center; margin-bottom:0; }
        .r-contact a { color:#0a7a6a; text-decoration:none; }
        .r-contact a:hover { text-decoration:underline; }
        .r-sep { color:#d0d0cc; margin:0 8px; }

        /* ── EXPERIENCE ENTRY ── */
        .exp { margin-bottom:26px; }
        .exp:last-child { margin-bottom:0; }
        .exp-top  { display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:2px; }
        .exp-org  { font-family:'Inter',sans-serif; font-size:15px; font-weight:700; color:#0d0d0d; }
        .exp-loc  { font-size:12px; color:#999; white-space:nowrap; flex-shrink:0; }
        .exp-mid  { display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:10px; }
        .exp-role { font-size:13px; font-weight:600; color:#0a7a6a; }
        .exp-date { font-family:'JetBrains Mono',monospace; font-size:11px; color:#aaa; white-space:nowrap; flex-shrink:0; }
        .exp-list { list-style:none; padding:0; }
        .exp-list li { font-size:13.5px; color:#333; line-height:1.72; padding-left:14px; position:relative; margin-bottom:6px; }
        .exp-list li:last-child { margin-bottom:0; }
        .exp-list li::before { content:"▸"; position:absolute; left:0; color:#0a7a6a; font-size:10px; top:3px; }
        .exp-list li strong { color:#111; font-weight:600; }
        .exp-stack { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#999; margin-top:10px; line-height:1.6; }

        /* ── PRODUCTS LIST ── */
        .prod-list { list-style:none; padding:0; }
        .prod-list li { font-size:13.5px; color:#444; line-height:1.7; margin-bottom:6px; padding-left:14px; position:relative; }
        .prod-list li:last-child { margin-bottom:0; }
        .prod-list li::before { content:"▸"; position:absolute; left:0; color:#0a7a6a; font-size:10px; top:3px; }
        .prod-name { font-weight:700; color:#0d0d0d; }

        /* ── EDU/CERTS ── */
        .edu-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        @media(max-width:540px){ .edu-grid{ grid-template-columns:1fr; } }
        .edu-org  { font-size:14px; font-weight:700; color:#0d0d0d; margin-bottom:3px; }
        .edu-deg  { font-size:13px; color:#555; line-height:1.5; margin-bottom:4px; }
        .edu-note { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#999; }

        /* ── SKILLS ── */
        .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 32px; }
        @media(max-width:540px){ .skills-grid{ grid-template-columns:1fr; } }
        .sk-row { display:flex; gap:6px; align-items:baseline; }
        .sk-cat  { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600; color:#0a7a6a; white-space:nowrap; min-width:110px; }
        .sk-val  { font-size:12.5px; color:#555; }

        /* ── SECTION GAP ── */
        .sec { margin-bottom:32px; }
        .sec:last-child { margin-bottom:0; }

        @media print {
          .ticker-wrap, .float-wrap, .print-bar { display:none !important; }
          .page { padding:0; max-width:100%; }
          body { background:#fff; }
          .resume { box-shadow:none; border-radius:0; padding:44px 52px; }
        }
      `}</style>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <div className="tick-label">
            <div className="tick-dot" />
            <span className="tick-title">Live Record</span>
          </div>
          <div className="tick-track">
            <div className="tick-inner">
              {ticker.map((t, i) => (
                <span key={i} className="tick-item">
                  <span>{t.label}</span>
                  <strong>{t.val}</strong>
                  <span style={{ fontSize: 11, color: "#555" }}>{t.sub}</span>
                  <span className="tick-sep">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING CHECKLIST ── */}
      <div className="float-wrap">
        <button className="float-btn" onClick={() => setListOpen(v => !v)}>
          <span>Consulting Checklist</span>
          <span>{listOpen ? "▲" : "▼"}</span>
        </button>
        {listOpen && (
          <div className="float-body">
            <div className="float-head">
              <div className="float-htitle">What Top Firms Need</div>
              <div className="float-hsub">Tap each to verify</div>
            </div>
            {timerActive && <div className="float-timer">{fmt(timeLeft)}</div>}
            <ul className="float-list">
              {checklist.map((item, i) => (
                <li key={i} className={`float-item${checked.has(i) ? " done" : ""}`} onClick={() => toggleCheck(i)}>
                  <div className="f-box">{checked.has(i) && "✓"}</div>
                  <div>
                    <div className="f-req">{item.req}</div>
                    <div className="f-met">{item.metric}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── PAGE ── */}
      <div className="page">
        <div className="print-bar">
          <button className="print-btn" onClick={() => window.print()}>
            🖨 &nbsp;Print / Save PDF
          </button>
        </div>

        <div className="resume">

          {/* ── NAME BLOCK ── */}
          <div style={{ marginBottom: 28 }}>
            <div className="r-name">Omkumar Solanki</div>
            <div className="r-subtitle">
              AI Consultant &nbsp;·&nbsp; Technology Strategy &nbsp;·&nbsp; Systems Engineering &nbsp;·&nbsp; Canada
            </div>
            <div className="r-contact">
              <a href="mailto:om@resso.ai">om@resso.ai</a>
              <span className="r-sep">|</span>
              <a href="https://www.linkedin.com/in/omkumarsolanki" target="_blank" rel="noreferrer">LinkedIn</a>
              <span className="r-sep">|</span>
              <a href="https://www.omkumarsolanki.com" target="_blank" rel="noreferrer">omkumarsolanki.com</a>
              <span className="r-sep">|</span>
              <a href="https://lawline.tech" target="_blank" rel="noreferrer">lawline.tech</a>
              <span className="r-sep">|</span>
              <span>Toronto / Oakville, ON</span>
            </div>
          </div>

          {/* ── EXPERIENCE ── */}
          <div className="sec">
            <SectionHead>Experience</SectionHead>

            {/* HariKrushna */}
            <div className="exp">
              <div className="exp-top">
                <span className="exp-org">HariKrushna Software Developers</span>
                <span className="exp-loc">Ontario, Canada</span>
              </div>
              <div className="exp-mid">
                <span className="exp-role">Senior AI Consultant</span>
                <span className="exp-date">Jun 2024 – Present</span>
              </div>
              <ul className="exp-list">
                <li>
                  Clients in regulated industries (legal, healthcare, finance) could not send proprietary data to cloud LLMs. Architected <strong>on-premise RAG stacks</strong> (GGUF-quantized models, HNSW vector stores, semantic chunking) in Python and Go; 7 clients deployed with sub-1s query latency on 16 GB hardware and <strong>full data sovereignty</strong>.
                </li>
                <li>
                  Enterprise teams managed AI integrations through fragmented custom code. Created <strong>production MCP servers</strong> connecting agents to Slack, CRM, databases, and REST/gRPC APIs via a universal protocol; reduced integration time from <strong>4 weeks to 3 days</strong> across 5 deployments.
                </li>
                <li>
                  Off-the-shelf LLMs hallucinated on client-specific terminology at a 14% rate. Ran <strong>LoRA/QLoRA fine-tuning pipelines</strong> with schema validation and held-out test monitoring; drove hallucination down to <strong>3.8%</strong> on a 500-document evaluation set.
                </li>
                <li>
                  Led <strong>technical discovery and architecture workshops</strong> with founders and product teams at 10+ startups; scoped AI roadmaps, selected model architectures, and mentored 3 junior ML engineers across concurrent engagements.
                </li>
              </ul>
              <div className="exp-stack">
                Python · Go · FastAPI · Claude API · GGUF · HNSW · Docker · Kubernetes · AWS
              </div>
            </div>

            {/* Resso.ai */}
            <div className="exp">
              <div className="exp-top">
                <span className="exp-org">Resso.ai</span>
                <span className="exp-loc">Remote, Canada</span>
              </div>
              <div className="exp-mid">
                <span className="exp-role">AI Engineer / Full-Stack Engineer</span>
                <span className="exp-date">2025 – Present</span>
              </div>
              <ul className="exp-list">
                <li>
                  Existing interview platforms lacked real-time AI with persistent context. Engineered a <strong>sub-800ms conversation engine</strong> (Azure OpenAI Realtime API, GPT-4o, Avatar TTS, two-phase VAD) powering live AI avatar interviews, coaching, and training simulations; 200+ sessions served in the first month.
                </li>
                <li>
                  Conversations lost context after 10 minutes. Implemented a <strong>vector database session memory</strong> with event-driven triggers (silence timeout, barge-in, topic-switch) that inject prior context into the agent prompt; retention rose from <strong>72% to 98%</strong> across 500+ sessions.
                </li>
                <li>
                  Partnered with product and design to ship a <strong>multi-tenant platform</strong> (PostgreSQL, Prisma, PgBouncer, Redis) with RBAC, 30+ AI personas, and session lifecycle tracking; deployed across 4 Azure environments with GitHub Actions CI/CD and i18n in 5 locales.
                </li>
              </ul>
              <div className="exp-stack">
                Azure OpenAI · GPT-4o · Avatar TTS · Vector DB · Next.js 15 · Prisma · PostgreSQL · Redis · WebSockets
              </div>
            </div>

            {/* Corol */}
            <div className="exp">
              <div className="exp-top">
                <span className="exp-org">Corol.org</span>
                <span className="exp-loc">Ontario, Canada</span>
              </div>
              <div className="exp-mid">
                <span className="exp-role">Machine Learning Engineer</span>
                <span className="exp-date">2023 – 2024</span>
              </div>
              <ul className="exp-list">
                <li>
                  Lab testing of UHPC concrete mixes required weeks of curing cycles before engineers could evaluate a formulation. Trained an <strong>XGBoost ensemble (R² = 0.89)</strong> on domain-engineered features (W/C ratio, silica fume, fibre dosage, curing age) to predict compressive strength; replaced weeks of lab waiting with <strong>instant predictions</strong>.
                </li>
                <li>
                  Exposed the model via a <strong>JWT-secured REST API</strong> (FastAPI) with SHAP interpretability layer and a React dashboard (Next.js) with real-time prediction cards; engineers see which input drives each prediction — enabling adoption without a black-box objection.
                </li>
                <li>
                  Reduced mix evaluation cycle from weeks to a single afternoon; <strong>100s of formulations</strong> now screened computationally before a single physical pour — validated by 12 research engineers daily.
                </li>
              </ul>
              <div className="exp-stack">
                Python · FastAPI · XGBoost · SHAP · scikit-learn · Next.js · Recharts · Vercel
              </div>
            </div>

            {/* Freelance */}
            <div className="exp">
              <div className="exp-top">
                <span className="exp-org">Freelance AI Consulting</span>
                <span className="exp-loc">Remote</span>
              </div>
              <div className="exp-mid">
                <span className="exp-role">AI/ML Developer & Cloud Engineer</span>
                <span className="exp-date">2021 – 2023</span>
              </div>
              <ul className="exp-list">
                <li>
                  Law firms spent 6–8 hours reviewing 800-page case files. Built and launched <strong>Lawline.tech</strong>: 16 AI agents in a 5-stage pipeline producing source-linked chronologies in 42 seconds; 12,000+ files processed, 94% time saved across 6 practice areas. <strong>Air-gapped on-premises</strong> — zero data egress, full attorney-client privilege.
                </li>
                <li>
                  An e-commerce client had a 2.1% conversion rate with no personalization. Trained <strong>XGBoost models</strong> on 200K+ transactions with Optuna HPO; conversion rose to 2.8%, adding an estimated <strong>$180K annual revenue</strong>.
                </li>
                <li>
                  Clinical staff at a healthcare startup spent 120+ hours monthly on manual record processing. Shipped an <strong>event-driven pipeline</strong> (Kafka, Lambda) for ingestion and alerting across 3 hospital systems; freed 120 hours monthly for patient care.
                </li>
              </ul>
              <div className="exp-stack">
                Python · PyTorch · XGBoost · FastAPI · AWS · Kafka · Docker · PostgreSQL · gRPC
              </div>
            </div>

          </div>

          {/* ── LIVE PRODUCTS ── */}
          <div className="sec">
            <SectionHead>Live Products</SectionHead>
            <ul className="prod-list">
              <li>
                <span className="prod-name">Resso.ai</span> — Real-time AI conversation platform: avatar interviews, coaching, training simulations (Azure OpenAI, Vector DB, multi-tenant, 30+ personas)
              </li>
              <li>
                <span className="prod-name">Lawline.tech</span> — AI legal intelligence with 16 agentic agents, air-gapped on-premises, 6 practice areas, 0 bytes data egress
              </li>
              <li>
                <span className="prod-name">TTC Lost and Found</span> — Civic AI matching system: pgvector cosine similarity, confidence-gated SMS routing, 1.7M daily riders (Capstone · Pitching May 2026)
              </li>
              <li>
                <span className="prod-name">Enterprise MCP Server</span> — Universal AI agent integration layer (Slack, CRM, databases, REST/gRPC); integration time 4 weeks → 3 days
              </li>
              <li>
                <span className="prod-name">UHPC-ML</span> — Concrete strength prediction dashboard (R² = 0.89, SHAP interpretability, Vercel serverless, 12 engineers daily)
              </li>
            </ul>
          </div>

          {/* ── SKILLS ── */}
          <div className="sec">
            <SectionHead>Core Skills</SectionHead>
            <div className="skills-grid">
              <div className="sk-row"><span className="sk-cat">Consulting</span><span className="sk-val">Discovery · MECE · Stakeholder alignment · Executive briefs · SOW analysis</span></div>
              <div className="sk-row"><span className="sk-cat">AI / ML</span><span className="sk-val">PyTorch · XGBoost · SHAP · LangGraph · RAG · GGUF · HNSW · LoRA/QLoRA</span></div>
              <div className="sk-row"><span className="sk-cat">LLM Infra</span><span className="sk-val">Azure OpenAI · Claude API · GPT-4o · MCP servers · Fine-tuning · Eval pipelines</span></div>
              <div className="sk-row"><span className="sk-cat">Engineering</span><span className="sk-val">Python · Go · FastAPI · Next.js · TypeScript · PostgreSQL · Redis · pgvector</span></div>
              <div className="sk-row"><span className="sk-cat">Cloud</span><span className="sk-val">AWS (certified) · Azure · AKS · Docker · Kubernetes · GitHub Actions CI/CD</span></div>
              <div className="sk-row"><span className="sk-cat">Observability</span><span className="sk-val">OpenTelemetry · Prometheus · Grafana · Structured logging · P0 response</span></div>
              <div className="sk-row"><span className="sk-cat">Industries</span><span className="sk-val">Legal · EdTech · Civil Engineering · Public Transit · Healthcare · Fintech</span></div>
              <div className="sk-row"><span className="sk-cat">Communication</span><span className="sk-val">Board-level briefs · Demo-to-close decks · Weekly client eval reports</span></div>
            </div>
          </div>

          {/* ── EDUCATION ── */}
          <div className="sec">
            <SectionHead>Education and Certifications</SectionHead>
            <div className="edu-grid">
              <div>
                <div className="edu-org">Sheridan College</div>
                <div className="edu-deg">Bachelor of Applied Science (Honours), Artificial Intelligence</div>
                <div className="edu-note">AI Minds Club, Board Member · Sheridan EDGE Programme</div>
              </div>
              <div>
                <div className="edu-org">AWS Academy</div>
                <div className="edu-deg">Cloud Developing Graduate Certificate</div>
                <div className="edu-note">EC2 · S3 · Lambda · SageMaker · IAM · CloudWatch</div>
              </div>
            </div>
          </div>

        </div>{/* end resume */}
      </div>
    </>
  );
}
