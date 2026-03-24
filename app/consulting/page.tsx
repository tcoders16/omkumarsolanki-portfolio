"use client";
import { useState } from "react";
import Nav from "@/components/Nav";

/* ─── palette ─── */
const T  = "#39d9b4";
const AM = "#f59e0b";
const VI = "#8b5cf6";

/* ═══════════════════════════════════════════════════════════════
   CASE STUDIES
═══════════════════════════════════════════════════════════════ */
const CASES = [
  {
    id: "resso",
    client: "Resso.ai",
    sector: "EdTech · AI Interview Platform",
    country: "Canada (Remote)",
    accent: T,
    tag: "Session Intelligence",
    brief: "Students are dropping out of AI mock interviews mid-session. Fix retention.",
    diagnosis: [
      "Every LLM call was cold — zero conversation history passed between turns.",
      "Agent re-asked the student's name on turn 7. Re-asked career goals on turn 12.",
      "Root cause: stateless architecture, not prompt quality. No session layer existed.",
      "The platform was architecturally incapable of remembering anything. This was structural.",
    ],
    solution: [
      "Redis sliding-window session memory with token-budget compression (last 3,000 tokens + summarised older turns).",
      "Event-driven context injection: persona config + live history assembled fresh per request.",
      "500-document automated eval pipeline tracking retention %, hallucination rate, P(hire) score — agreed with stakeholders before build.",
      "Deployed across 4 Azure environments with GitHub Actions CI/CD.",
    ],
    before: `# BEFORE — cold call every turn (client's original code)
def get_ai_response(user_message: str) -> str:
    return openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_message},  # zero history
        ]
    ).choices[0].message.content
# Result: agent asks "what's your name?" on turn 7
# Retention: 72%  |  Dropout: HIGH  |  NPS: -12`,
    after: `# AFTER — stateful sliding window (shipped)
def get_ai_response(session_id: str, user_message: str) -> str:
    history    = redis.lrange(f"s:{session_id}", 0, -1)
    compressed = compress_to_budget(history, max_tokens=3_000)
    messages   = [
        {"role": "system", "content": load_persona(session_id)},
        *compressed,                          # full compressed history
        {"role": "user",   "content": user_message},
    ]
    resp = openai.chat.completions.create(model="gpt-4o", messages=messages)
    redis.rpush(f"s:{session_id}", serialise(resp))
    return resp.choices[0].message.content
# Retention: 72% -> 98%  |  Dropout: eliminated  |  Contract renewed`,
    metrics: [
      { val: "72% → 98%", lbl: "Session retention" },
      { val: "200+", lbl: "Live sessions, month 1" },
      { val: "14×", lbl: "Faster context recovery" },
      { val: "Renewed", lbl: "Contract + scope expanded" },
    ],
    stack: "Azure OpenAI · GPT-4o · Redis · PostgreSQL · Prisma · Next.js 15 · WebSockets · GitHub Actions",
  },

  {
    id: "harikrushna",
    client: "HariKrushna Software Developers",
    sector: "Regulated Industry · Enterprise AI",
    country: "Ontario, Canada",
    accent: AM,
    tag: "Vendor Risk & Data Sovereignty",
    brief: "Help our clients adopt AI. They want OpenAI / Gemini but IT keeps blocking it.",
    diagnosis: [
      "Discovery interviews with 7 regulated-industry clients (finance, legal, healthcare-adjacent).",
      "Root cause: every SaaS LLM sends prompts to a foreign cloud. Their data policies prohibit this.",
      "Entire vendor market — OpenAI, Azure, Google, AWS — was structurally ineligible for all 7.",
      "Previous consultants kept recommending cloud LLMs; deals died at compliance every time.",
    ],
    solution: [
      "Designed on-premise GGUF model stacks running on client hardware — zero data leaves the building.",
      "HNSW vector search for fast document retrieval; sub-1 s latency on 16 GB consumer hardware.",
      "LoRA/QLoRA fine-tuning on client-specific corpora reduced hallucination 14% → 3.8%.",
      "Production MCP integration servers routing agents to Slack, CRM, internal REST/gRPC APIs — integration time cut 4 weeks → 3 days.",
    ],
    before: `# BEFORE — every engagement died at procurement
Consultant recommends: GPT-4 via Azure OpenAI API
Compliance team: "Data leaves Canada. Rejected."
Time wasted: 6-10 weeks per client
Result: 0 of 7 clients deployed anything

# The actual constraint (never mapped):
for client in regulated_clients:
    if client.data_policy == "PIPEDA_STRICT":
        assert vendor.data_residency == "on_prem"
        # AssertionError — every single time`,
    after: `# AFTER — air-gapped stack, no cloud dependency
from llama_cpp import Llama
import hnswlib

class OnPremRAG:
    def __init__(self, model_path: str, index_path: str):
        self.llm   = Llama(model_path, n_gpu_layers=35, n_ctx=8192)
        self.index = hnswlib.Index(space="cosine", dim=768)
        self.index.load_index(index_path)   # runs on client hardware

    def query(self, question: str) -> str:
        ids, _ = self.index.knn_query(embed(question), k=5)
        context = "\n".join(self.docs[i] for i in ids[0])
        return self.llm(f"Context:\n{context}\n\nQ: {question}")
# Latency: sub-1 s  |  Hallucination: 14% -> 3.8%  |  7/7 deployed`,
    metrics: [
      { val: "7 / 7", lbl: "Clients deployed (vs 0 before)" },
      { val: "14% → 3.8%", lbl: "Hallucination rate" },
      { val: "4 wks → 3 days", lbl: "AI integration time" },
      { val: "Sub-1 s", lbl: "Query latency, on-prem" },
    ],
    stack: "Python · Go · llama.cpp · GGUF · HNSW · LoRA/QLoRA · FastAPI · Docker · MCP · AWS",
  },

  {
    id: "corol",
    client: "Corol.org × NunaFab",
    sector: "Civil Engineering Research · UHPC",
    country: "Ontario, Canada",
    accent: VI,
    tag: "Physical Process Replaced by ML",
    brief: "We need compressive strength results for ultra-high-performance concrete. Currently takes 28 days of curing.",
    diagnosis: [
      "Every design iteration required 28 days of physical curing before one data point was available.",
      "Research velocity was gated by chemistry, not insight — teams waited while grants burned.",
      "Mix ratios could not be optimised without waiting a full month per candidate.",
      "Root cause: no predictive model existed. The lab was the only oracle.",
    ],
    solution: [
      "Collected 2,200 historical mix samples with 25 features (cement ratio, silica fume, fibre type, w/c ratio, curing conditions).",
      "Trained 150-estimator Random Forest predicting strength at 3/7/28/90-day horizons simultaneously (R² = 0.73).",
      "SciPy SLSQP optimiser finds the optimal mix for a target strength in seconds.",
      "JWT-secured FastAPI + Next.js dashboard on Vercel — 12 research engineers use it daily.",
    ],
    before: `# BEFORE — 28-day physical wait per iteration
for mix_ratio in design_space:       # thousands of candidates
    pour_specimen(mix_ratio)
    cure_for_days(28)                # hard physical constraint
    strength = measure_compressive() # only data point available
    if strength >= target:
        record_winning_mix(mix_ratio)
# Optimisation time: months
# Research velocity: 1 data point per 28 days`,
    after: `# AFTER — instant prediction + optimisation
model = RandomForestRegressor(n_estimators=150)
model.fit(X_train, y_train)   # R^2 = 0.73

def optimise_mix(target_strength: float, horizon: int = 28):
    def cost(x):
        return abs(model.predict([x])[0] - target_strength)
    result = minimize(cost, x0=baseline_mix, method="SLSQP",
                      bounds=MATERIAL_BOUNDS)
    return result.x                  # optimal mix, instant
# Time to result: 28 days -> < 1 second
# Velocity: unlimited iterations per day`,
    metrics: [
      { val: "28d → <1s", lbl: "Time to prediction" },
      { val: "R² = 0.73", lbl: "Model accuracy" },
      { val: "2,200", lbl: "Training samples" },
      { val: "12", lbl: "Daily active researchers" },
    ],
    stack: "Python · scikit-learn · SciPy SLSQP · FastAPI · Next.js · Vercel · JWT · PostgreSQL",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════════════ */
const SKILLS = [
  {
    group: "Business Analysis",
    icon: "◈",
    color: T,
    items: [
      "Stakeholder discovery & requirements scoping",
      "Root cause diagnosis (5-Why, constraint mapping)",
      "Success metric definition before any build starts",
      "Executive reporting & dashboard design",
    ],
  },
  {
    group: "AI / ML Engineering",
    icon: "⬡",
    color: AM,
    items: [
      "LLM systems (GPT-4o, Claude, GGUF, fine-tuning)",
      "RAG architectures (HNSW, vector DB, hybrid search)",
      "Agentic pipelines & MCP integration servers",
      "Evaluation frameworks (hallucination, retention, latency)",
    ],
  },
  {
    group: "Systems & Delivery",
    icon: "◎",
    color: VI,
    items: [
      "Full-stack (Next.js, FastAPI, Go) + cloud (Azure, AWS)",
      "Data infra (PostgreSQL, Redis, Prisma, Kafka)",
      "CI/CD, Docker, Kubernetes, multi-env deployment",
      "Regulated industries: PIPEDA, data residency, on-prem",
    ],
  },
];

const WHY = [
  {
    label: "Rare Overlap",
    title: "Business analyst who can ship production code",
    body: "I've sat in the discovery interview and written the API that fixed the problem the same week. No handoff loss. No translation gap between strategy and engineering.",
  },
  {
    label: "AI-Native",
    title: "I don't bolt AI onto existing processes",
    body: "I start from the business constraint and work backwards to decide if AI solves it — and which architecture. Three clients found that the market consensus was completely wrong for their actual constraint.",
  },
  {
    label: "Regulated Industry",
    title: "PIPEDA, data sovereignty, on-premise deployments",
    body: "7 regulated-industry clients where the standard cloud-LLM playbook was ineligible. I know how to scope AI projects that pass procurement in finance, legal, and healthcare-adjacent environments.",
  },
  {
    label: "Delivery Track Record",
    title: "Shipped production systems as a solo engagement",
    body: "Not demos. Sub-800ms real-time conversation engine. On-premise RAG with production traffic. ML model used daily by 12 researchers. All of these are live right now.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ConsultingPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Record<string, "before-after" | "metrics">>({});

  function getTab(id: string): "before-after" | "metrics" {
    return tabs[id] ?? "before-after";
  }
  function setTab(id: string, v: "before-after" | "metrics") {
    setTabs(prev => ({ ...prev, [id]: v }));
  }

  return (
    <>
      <Nav />
      <style>{`
        /* ── design tokens — mirror globals.css exactly ── */
        .cp { background:#000; color:#f0f0f0; font-family:'Space Grotesk',system-ui,sans-serif; min-height:100vh; }
        .cp-w { max-width:1080px; margin:0 auto; padding:0 24px; }

        /* ── hero ── */
        .cp-hero { padding:120px 0 72px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .cp-eyebrow { font-size:11px; font-weight:600; letter-spacing:.22em; color:${T}; text-transform:uppercase; margin-bottom:18px; font-family:'JetBrains Mono',monospace; }
        .cp-h1 { font-size:clamp(30px,4.2vw,52px); font-weight:800; line-height:1.08; letter-spacing:-.04em; margin:0 0 22px; font-family:'Syne',sans-serif; color:#f0f0f0; }
        .cp-h1 em { font-style:normal; color:${T}; }
        .cp-hero-sub { font-size:16px; line-height:1.7; color:#c8c4bc; max-width:620px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:28px; }
        .cp-pill { font-size:10px; font-weight:500; padding:4px 11px; background:transparent; color:#5a5a5a; border:1px solid rgba(255,255,255,0.08); letter-spacing:.05em; font-family:'JetBrains Mono',monospace; }

        /* ── sections ── */
        .cp-sec { padding:80px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .cp-sec-lbl { font-size:10px; font-weight:600; letter-spacing:.22em; color:rgba(57,217,180,.5); text-transform:uppercase; margin-bottom:32px; font-family:'JetBrains Mono',monospace; }

        /* ── method steps ── */
        .cp-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.06); }
        @media(max-width:680px){ .cp-steps { grid-template-columns:1fr 1fr; } }
        .cp-step { padding:28px 22px; background:#000; transition:background .15s; }
        .cp-step:hover { background:#0f0f0f; }
        .cp-step-n { font-size:10px; font-weight:600; letter-spacing:.18em; color:rgba(57,217,180,.4); margin-bottom:12px; font-family:'JetBrains Mono',monospace; }
        .cp-step-t { font-size:14px; font-weight:700; color:#f0f0f0; margin-bottom:8px; font-family:'Syne',sans-serif; letter-spacing:-.01em; }
        .cp-step-b { font-size:12.5px; line-height:1.65; color:#5a5a5a; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* ── accordion keyframes ── */
        @keyframes shimmer {
          0%   { left:-80%; }
          100% { left:180%; }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── accordion rows ── */
        .cp-cases-hint {
          font-size:10px; font-family:'JetBrains Mono',monospace; color:#2e2e2e;
          letter-spacing:.14em; margin-bottom:16px; display:flex; align-items:center; gap:10px;
        }
        .cp-cases-hint::before { content:''; display:inline-block; width:20px; height:1px; background:rgba(255,255,255,0.1); }

        .cp-case { border:1px solid rgba(255,255,255,0.06); margin-bottom:1px; position:relative; overflow:hidden; transition:border-color .2s; }
        .cp-case::after {
          content:''; position:absolute; top:0; left:-80%; width:35%;
          height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent);
          pointer-events:none;
        }
        .cp-case:nth-child(1)::after { animation:shimmer 1s ease .15s forwards; }
        .cp-case:nth-child(2)::after { animation:shimmer 1s ease .35s forwards; }
        .cp-case:nth-child(3)::after { animation:shimmer 1s ease .55s forwards; }
        .cp-case:hover    { border-color:rgba(255,255,255,0.12); }
        .cp-case.is-open  { border-color:rgba(255,255,255,0.12); border-left:2px solid; }

        .cp-case-hd { display:flex; align-items:center; justify-content:space-between; padding:26px 28px; cursor:pointer; gap:16px; transition:background .15s; user-select:none; }
        .cp-case-hd:hover { background:#080808; }

        .cp-case-lft { display:flex; align-items:center; gap:16px; flex:1; min-width:0; }
        .cp-ctag { font-size:9.5px; font-weight:600; letter-spacing:.16em; padding:3px 10px; white-space:nowrap; border:1px solid rgba(255,255,255,0.1); color:#5a5a5a; background:transparent; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
        .cp-cname { font-size:15px; font-weight:700; color:#f0f0f0; font-family:'Syne',sans-serif; letter-spacing:-.01em; }
        .cp-csec  { font-size:11.5px; color:#5a5a5a; margin-top:3px; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* ── pill CTA — always visible ── */
        .cp-cta-pill { display:inline-flex; align-items:center; gap:7px; flex-shrink:0; font-size:11px; font-weight:600; letter-spacing:.1em; font-family:'JetBrains Mono',monospace; white-space:nowrap; padding:8px 16px; border:1px solid rgba(255,255,255,0.1); color:#c8c4bc; background:transparent; cursor:pointer; transition:border-color .15s, color .15s, background .15s; }
        .cp-cta-pill:hover { border-color:${T}; color:${T}; background:rgba(57,217,180,.04); }
        .cp-cta-pill.open  { border-color:${T}; color:${T}; background:rgba(57,217,180,.04); }
        .cp-cta-pill svg   { transition:transform .28s cubic-bezier(.4,0,.2,1); }
        .cp-cta-pill.open svg { transform:rotate(180deg); }

        .cp-snap { display:flex; gap:28px; flex-shrink:0; }
        .cp-snap-item { text-align:right; }
        .cp-snap-val  { font-size:13px; font-weight:800; font-family:'Syne',sans-serif; }
        .cp-snap-lbl  { font-size:10px; color:#5a5a5a; font-family:'Space Grotesk',sans-serif; margin-top:2px; }

        /* ── case body ── */
        .cp-cbody { border-top:1px solid rgba(255,255,255,0.06); padding:32px 28px; animation:fade-up .25s cubic-bezier(.4,0,.2,1); }
        .cp-brief { border-left:2px solid rgba(255,255,255,0.1); padding:14px 18px; margin-bottom:24px; font-size:13px; color:#c8c4bc; line-height:1.6; font-style:italic; background:#080808; }
        .cp-brief-lbl { font-size:9px; font-weight:700; letter-spacing:.18em; display:block; margin-bottom:8px; font-family:'JetBrains Mono',monospace; }
        .cp-2col { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); margin-bottom:20px; }
        @media(max-width:680px){ .cp-2col { grid-template-columns:1fr; } }
        .cp-infobox { background:#000; padding:20px; }
        .cp-infobox-t { font-size:9px; font-weight:700; letter-spacing:.2em; color:#5a5a5a; text-transform:uppercase; margin-bottom:12px; font-family:'JetBrains Mono',monospace; }
        .cp-infobox ul { margin:0; padding-left:14px; }
        .cp-infobox li { font-size:12.5px; line-height:1.65; color:#c8c4bc; margin-bottom:6px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-infobox li::marker { color:rgba(255,255,255,0.15); }

        /* ── tabs ── */
        .cp-tabs { display:flex; gap:1px; margin-bottom:14px; background:rgba(255,255,255,0.06); }
        .cp-tab { font-size:10px; font-weight:600; letter-spacing:.1em; padding:8px 16px; cursor:pointer; background:#000; color:#5a5a5a; border:none; transition:color .15s, background .15s; font-family:'JetBrains Mono',monospace; }
        .cp-tab:hover { color:#c8c4bc; background:#0f0f0f; }
        .cp-tab.on { background:#0f0f0f; color:${T}; }

        /* ── code blocks ── */
        .cp-code2 { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); }
        @media(max-width:680px){ .cp-code2 { grid-template-columns:1fr; } }
        .cp-code-wrap { position:relative; }
        .cp-badge { position:absolute; top:10px; right:12px; font-size:9px; font-weight:700; letter-spacing:.12em; padding:2px 8px; font-family:'JetBrains Mono',monospace; }
        .cp-badge.b4 { background:rgba(255,255,255,0.04); color:#5a5a5a; }
        .cp-badge.af { background:rgba(57,217,180,.08); color:${T}; }
        pre { margin:0; padding:20px; font-size:11px; line-height:1.75; background:#080808; overflow-x:auto; font-family:'JetBrains Mono','Fira Code',monospace; color:#5a5a5a; white-space:pre; border:none; }
        pre .hi { color:${T}; }

        /* ── metrics ── */
        .cp-mets { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.06); }
        @media(max-width:680px){ .cp-mets { grid-template-columns:1fr 1fr; } }
        .cp-met { background:#000; padding:20px; text-align:center; }
        .cp-met-v { font-size:16px; font-weight:800; margin-bottom:5px; font-family:'Syne',sans-serif; }
        .cp-met-l { font-size:10px; color:#5a5a5a; font-family:'Space Grotesk',sans-serif; }
        .cp-stack { margin-top:20px; font-size:10.5px; font-family:'JetBrains Mono',monospace; color:#2e2e2e; padding-top:16px; border-top:1px solid rgba(255,255,255,0.04); }
        .cp-stack strong { color:#5a5a5a; }

        /* ── skills ── */
        .cp-sk3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.06); margin-top:40px; }
        @media(max-width:680px){ .cp-sk3 { grid-template-columns:1fr; } }
        .cp-skcard { background:#000; padding:28px 24px; border-top:1px solid; }
        .cp-skcard-icon { font-size:18px; margin-bottom:14px; opacity:.6; }
        .cp-skcard-g { font-size:13px; font-weight:700; margin-bottom:14px; font-family:'Syne',sans-serif; color:#f0f0f0; letter-spacing:-.01em; }
        .cp-skcard ul { list-style:none; padding:0; margin:0; }
        .cp-skcard li { font-size:12.5px; color:#5a5a5a; line-height:1.62; padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-skcard li:last-child { border-bottom:none; }
        .cp-skcard li::before { content:"– "; color:rgba(255,255,255,0.15); }

        /* ── why cards ── */
        .cp-why4 { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); margin-top:40px; }
        @media(max-width:680px){ .cp-why4 { grid-template-columns:1fr; } }
        .cp-wcard { background:#000; padding:28px 24px; }
        .cp-wcard-lbl { font-size:9px; font-weight:700; letter-spacing:.2em; color:rgba(57,217,180,.45); text-transform:uppercase; margin-bottom:10px; font-family:'JetBrains Mono',monospace; }
        .cp-wcard-t { font-size:14px; font-weight:700; color:#f0f0f0; margin-bottom:10px; font-family:'Syne',sans-serif; letter-spacing:-.01em; }
        .cp-wcard-b { font-size:12.5px; color:#5a5a5a; line-height:1.68; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* ── CTA ── */
        .cp-cta { padding:80px 0 100px; text-align:center; }
        .cp-cta h2 { font-size:clamp(22px,3vw,36px); font-weight:800; letter-spacing:-.03em; margin-bottom:14px; font-family:'Syne',sans-serif; color:#f0f0f0; }
        .cp-cta p  { font-size:14px; color:#5a5a5a; margin-bottom:36px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
        .cp-btn-p { font-size:12px; font-weight:700; padding:13px 28px; background:${T}; color:#000; border:none; cursor:pointer; letter-spacing:.06em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; transition:opacity .15s; }
        .cp-btn-p:hover { opacity:.88; }
        .cp-btn-s { font-size:12px; font-weight:700; padding:13px 28px; background:transparent; color:#f0f0f0; border:1px solid rgba(255,255,255,0.12); cursor:pointer; letter-spacing:.06em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; transition:border-color .15s, color .15s; }
        .cp-btn-s:hover { border-color:rgba(255,255,255,0.3); color:#fff; }
      `}</style>

      <div className="cp">

        {/* HERO */}
        <section className="cp-hero">
          <div className="cp-w">
            <p className="cp-eyebrow">AI Consulting · Canada</p>
            <h1 className="cp-h1">
              I solve the business problem first.<br />
              <em>Code is the last thing I write.</em>
            </h1>
            <p className="cp-hero-sub">
              Most engineers build what they&apos;re asked. I find out why the business is actually broken —
              then architect the system that fixes the root cause.
              Three real clients. Three measurable outcomes. Zero slides without receipts.
            </p>
            <div className="cp-tags">
              {["Root Cause Diagnosis","AI/ML Architecture","LLM Systems","Regulated Industries",
                "Stakeholder Communication","Data Sovereignty","Agentic Pipelines","PIPEDA Compliance"
              ].map(t => <span key={t} className="cp-pill">{t}</span>)}
            </div>
          </div>
        </section>

        {/* THE FRAMEWORK */}
        <section className="cp-sec">
          <div className="cp-w">
            <p className="cp-sec-lbl">The Framework</p>
            <div className="cp-steps">
              {[
                { n:"01", t:"Diagnose Before Building",  b:"Discovery interviews with stakeholders. Map the real constraint. Find what's actually blocking the business — not what they think is blocking it." },
                { n:"02", t:"Root Cause, Not Symptom",   b:"Apply 5-Why and constraint mapping. Define the structural failure. Agree success metrics before any code is written." },
                { n:"03", t:"Architect the Fix",         b:"Design the simplest system that addresses the root cause. Select models, infra, and data architecture against the real constraint, not convention." },
                { n:"04", t:"Measure & Report",          b:"Automated eval pipelines report agreed metrics weekly. Executive dashboards in plain language. Outcome validated against pre-agreed criteria." },
              ].map(s => (
                <div key={s.n} className="cp-step">
                  <p className="cp-step-n">{s.n}</p>
                  <p className="cp-step-t">{s.t}</p>
                  <p className="cp-step-b">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDIES */}
        <section className="cp-sec">
          <div className="cp-w">
            <p className="cp-sec-lbl">Real Engagements</p>
            <p className="cp-cases-hint">3 case studies — click any row to explore the full diagnosis &amp; solution</p>
            {CASES.map(c => {
              const isOpen = open === c.id;
              const tab = getTab(c.id);
              return (
                <div key={c.id} className={`cp-case${isOpen ? " is-open" : ""}`} style={isOpen ? { borderLeftColor: "rgba(57,217,180,.5)" } : undefined}>
                  <div className="cp-case-hd" onClick={() => setOpen(isOpen ? null : c.id)}>
                    <div className="cp-case-lft">
                      <span className="cp-ctag" style={{ color:c.accent, borderColor:c.accent+"40", background:c.accent+"10" }}>
                        {c.tag}
                      </span>
                      <div>
                        <p className="cp-cname">{c.client}</p>
                        <p className="cp-csec">{c.sector} · {c.country}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:28 }}>
                      <div className="cp-snap">
                        {c.metrics.slice(0,2).map(m => (
                          <div key={m.lbl} className="cp-snap-item">
                            <div className="cp-snap-val" style={{ color:"#f0f0f0" }}>{m.val}</div>
                            <div className="cp-snap-lbl">{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                      <button className={`cp-cta-pill${isOpen ? " open" : ""}`}>
                        {isOpen ? "Close" : "View case"}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4.5L6 8l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="cp-cbody">
                      <div className="cp-brief" style={{ borderColor:"rgba(255,255,255,0.12)" }}>
                        <span className="cp-brief-lbl" style={{ color:"rgba(57,217,180,.5)" }}>CLIENT BRIEF</span>
                        &ldquo;{c.brief}&rdquo;
                      </div>

                      <div className="cp-2col">
                        <div className="cp-infobox">
                          <p className="cp-infobox-t">Diagnosis — what was actually wrong</p>
                          <ul>{c.diagnosis.map((d,i) => <li key={i}>{d}</li>)}</ul>
                        </div>
                        <div className="cp-infobox">
                          <p className="cp-infobox-t">Solution — what I built</p>
                          <ul>{c.solution.map((s,i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                      </div>

                      <div className="cp-tabs">
                        <button className={`cp-tab${tab==="before-after"?" on":""}`} onClick={() => setTab(c.id,"before-after")}>BEFORE / AFTER CODE</button>
                        <button className={`cp-tab${tab==="metrics"?" on":""}`}      onClick={() => setTab(c.id,"metrics")}>OUTCOME METRICS</button>
                      </div>

                      {tab === "before-after" && (
                        <div className="cp-code2">
                          <div className="cp-code-wrap">
                            <span className="cp-badge b4">BEFORE</span>
                            <pre>{c.before}</pre>
                          </div>
                          <div className="cp-code-wrap">
                            <span className="cp-badge af">AFTER</span>
                            <pre>{c.after}</pre>
                          </div>
                        </div>
                      )}

                      {tab === "metrics" && (
                        <div className="cp-mets">
                          {c.metrics.map(m => (
                            <div key={m.lbl} className="cp-met">
                              <div className="cp-met-v" style={{ color:"#f0f0f0" }}>{m.val}</div>
                              <div className="cp-met-l">{m.lbl}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="cp-stack"><strong>Stack: </strong>{c.stack}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SKILLS MATRIX */}
        <section className="cp-sec">
          <div className="cp-w">
            <p className="cp-sec-lbl">Overlapping Capabilities</p>
            <h2 style={{ fontSize:"clamp(20px,2.6vw,32px)", fontWeight:800, letterSpacing:"-.03em", margin:"0 0 8px", fontFamily:"'Syne',sans-serif", color:"#f0f0f0" }}>
              Where business strategy meets engineering execution
            </h2>
            <p style={{ fontSize:13.5, color:"#5a5a5a", maxWidth:540, fontFamily:"'Space Grotesk',sans-serif", fontWeight:300 }}>
              Most consultants stop at the slide deck. Most engineers don&apos;t attend the client call.
              I do both — and that&apos;s where the value is created.
            </p>
            <div className="cp-sk3">
              {SKILLS.map(s => (
                <div key={s.group} className="cp-skcard" style={{ borderTopColor:"rgba(255,255,255,0.1)" }}>
                  <div className="cp-skcard-icon" style={{ color:s.color }}>{s.icon}</div>
                  <p className="cp-skcard-g">{s.group}</p>
                  <ul>{s.items.map(it => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY A FIRM HIRES ME */}
        <section className="cp-sec">
          <div className="cp-w">
            <p className="cp-sec-lbl">Value to a Consulting Firm</p>
            <h2 style={{ fontSize:"clamp(20px,2.6vw,32px)", fontWeight:800, letterSpacing:"-.03em", margin:"0 0 8px", fontFamily:"'Syne',sans-serif", color:"#f0f0f0" }}>
              What I bring to Deloitte, McKinsey, Accenture
            </h2>
            <div className="cp-why4">
              {WHY.map(w => (
                <div key={w.title} className="cp-wcard">
                  <p className="cp-wcard-lbl">{w.label}</p>
                  <p className="cp-wcard-t">{w.title}</p>
                  <p className="cp-wcard-b">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cp-cta">
          <div className="cp-w">
            <h2>Ready to review the consulting resume?</h2>
            <p>One page, tailored for strategy &amp; technology consulting firms in Canada.</p>
            <div className="cp-btns">
              <a href="/resume" className="cp-btn-p">&#8595; View &amp; Download Resume</a>
              <a href="/#contact" className="cp-btn-s">&#8594; Contact Omkumar</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
