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
        .cp { background:#050c0b; color:#e8f0ef; font-family:'Space Grotesk',system-ui,sans-serif; min-height:100vh; }
        .cp-w { max-width:1080px; margin:0 auto; padding:0 24px; }

        /* hero */
        .cp-hero { padding:120px 0 72px; border-bottom:1px solid #0d2b25; }
        .cp-eyebrow { font-size:11px; font-weight:600; letter-spacing:.22em; color:${T}; text-transform:uppercase; margin-bottom:18px; font-family:'JetBrains Mono',monospace; }
        .cp-h1 { font-size:clamp(30px,4.2vw,52px); font-weight:800; line-height:1.08; letter-spacing:-.02em; margin:0 0 22px; font-family:'Syne','Space Grotesk',sans-serif; }
        .cp-h1 em { font-style:normal; color:${T}; }
        .cp-hero-sub { font-size:16px; line-height:1.68; color:#8cb8b0; max-width:620px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-tags { display:flex; flex-wrap:wrap; gap:7px; margin-top:26px; }
        .cp-pill { font-size:10.5px; font-weight:500; padding:4px 11px; border-radius:2px; background:#0a1e1b; color:#4d9b90; border:1px solid #1a3a34; letter-spacing:.05em; }

        /* section */
        .cp-sec { padding:76px 0; border-bottom:1px solid #0d2b25; }
        .cp-sec-lbl { font-size:10.5px; font-weight:700; letter-spacing:.22em; color:#2e6b62; text-transform:uppercase; margin-bottom:28px; font-family:'JetBrains Mono',monospace; }

        /* method */
        .cp-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
        @media(max-width:680px){ .cp-steps { grid-template-columns:1fr 1fr; } }
        .cp-step { padding:26px 20px; background:#04100e; border:1px solid #0d2b25; }
        .cp-step:hover { border-color:#1a4a3e; }
        .cp-step-n { font-size:10px; font-weight:700; letter-spacing:.18em; color:#2e6b62; margin-bottom:10px; font-family:'JetBrains Mono',monospace; }
        .cp-step-t { font-size:13.5px; font-weight:700; color:#d4eceb; margin-bottom:8px; font-family:'Syne',sans-serif; }
        .cp-step-b { font-size:12px; line-height:1.65; color:#5a9088; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* accordion animations */
        @keyframes bounce-down {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(5px); }
        }
        @keyframes hint-fade {
          0%,100% { opacity:.7; }
          50%      { opacity:.25; }
        }
        @keyframes slide-in {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes border-pulse {
          0%,100% { border-left-color:rgba(57,217,180,.15); }
          50%      { border-left-color:rgba(57,217,180,.5); }
        }

        /* accordion */
        .cp-case { border:1px solid #0d2b25; margin-bottom:3px; position:relative; transition:border-color .2s; }
        .cp-case:not(.is-open):hover { border-color:#1a4a3e; }
        .cp-case.is-open { border-color:#1a4a3e; border-left:3px solid; animation:border-pulse 2.4s ease-in-out infinite; }

        .cp-case-hd { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; cursor:pointer; gap:12px; transition:background .15s; user-select:none; }
        .cp-case-hd:hover { background:#060f0e; }
        .cp-case-hd:hover .cp-expand-hint { opacity:1; }
        .cp-case-hd:hover .cp-chev { color:${T}; }

        .cp-case-lft { display:flex; align-items:center; gap:14px; flex:1; }
        .cp-ctag { font-size:10px; font-weight:700; letter-spacing:.14em; padding:3px 9px; border-radius:2px; white-space:nowrap; border:1px solid; font-family:'JetBrains Mono',monospace; }
        .cp-cname { font-size:14.5px; font-weight:700; color:#d4eceb; font-family:'Syne',sans-serif; }
        .cp-csec { font-size:11.5px; color:#3d7a71; margin-top:2px; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* expand hint label */
        .cp-expand-hint { font-size:9px; font-weight:700; letter-spacing:.18em; color:${T}; opacity:0; transition:opacity .2s; font-family:'JetBrains Mono',monospace; text-transform:uppercase; white-space:nowrap; }
        .cp-case:first-child .cp-expand-hint { opacity:.6; animation:hint-fade 2s ease-in-out infinite; }

        /* animated chevron */
        .cp-chev-wrap { display:flex; flex-direction:column; align-items:center; gap:2px; flex-shrink:0; }
        .cp-chev { font-size:18px; color:#3d7a71; transition:transform .25s cubic-bezier(.4,0,.2,1), color .15s; line-height:1; }
        .cp-chev.open { transform:rotate(180deg); color:${T}; }
        .cp-case:first-child:not(.is-open) .cp-chev { animation:bounce-down 1.6s ease-in-out infinite; }

        .cp-snap { display:flex; gap:20px; flex-shrink:0; }
        .cp-snap-item { text-align:right; }
        .cp-snap-val { font-size:13px; font-weight:800; }
        .cp-snap-lbl { font-size:10px; color:#3d7a71; }

        /* case body */
        .cp-cbody { border-top:1px solid #1a4a3e; padding:28px 22px; animation:slide-in .22s ease; }
        .cp-brief { border-left:3px solid; padding:13px 16px; margin-bottom:24px; font-size:13px; color:#b8d5d1; line-height:1.58; font-style:italic; background:#030a09; }
        .cp-brief-lbl { font-size:9.5px; font-weight:700; letter-spacing:.16em; display:block; margin-bottom:6px; }
        .cp-2col { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-bottom:20px; }
        @media(max-width:680px){ .cp-2col { grid-template-columns:1fr; } }
        .cp-infobox { background:#030a09; border:1px solid #0d2b25; padding:18px; }
        .cp-infobox-t { font-size:9.5px; font-weight:700; letter-spacing:.18em; color:#3d7a71; text-transform:uppercase; margin-bottom:10px; }
        .cp-infobox ul { margin:0; padding-left:14px; }
        .cp-infobox li { font-size:12px; line-height:1.65; color:#7ab5ad; margin-bottom:5px; }
        .cp-infobox li::marker { color:#1e5c54; }

        /* tabs */
        .cp-tabs { display:flex; gap:2px; margin-bottom:14px; }
        .cp-tab { font-size:10.5px; font-weight:700; letter-spacing:.1em; padding:7px 15px; border:1px solid #0d2b25; cursor:pointer; background:#030a09; color:#3d7a71; font-family:'JetBrains Mono',monospace; }
        .cp-tab.on { background:#0a1e1b; color:${T}; border-color:#1a3a34; }

        /* code */
        .cp-code2 { display:grid; grid-template-columns:1fr 1fr; gap:2px; }
        @media(max-width:680px){ .cp-code2 { grid-template-columns:1fr; } }
        .cp-code-wrap { position:relative; }
        .cp-badge { position:absolute; top:8px; right:10px; font-size:9px; font-weight:700; letter-spacing:.12em; padding:2px 7px; border-radius:2px; }
        .cp-badge.b4 { background:#3d1a1a; color:#f87171; }
        .cp-badge.af { background:#0a1e1b; color:${T}; }
        pre { margin:0; padding:16px; font-size:11px; line-height:1.72; background:#020808; border:1px solid #0d2b25; overflow-x:auto; font-family:'JetBrains Mono','Fira Code',monospace; color:#6bada6; white-space:pre; }

        /* metrics */
        .cp-mets { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
        @media(max-width:680px){ .cp-mets { grid-template-columns:1fr 1fr; } }
        .cp-met { background:#030a09; border:1px solid #0d2b25; padding:16px; text-align:center; }
        .cp-met-v { font-size:15px; font-weight:800; margin-bottom:4px; }
        .cp-met-l { font-size:10px; color:#3d7a71; }
        .cp-stack { margin-top:18px; font-size:10.5px; font-family:'JetBrains Mono',monospace; color:#3d7a71; }
        .cp-stack strong { color:#1e5c54; }

        /* skills */
        .cp-sk3 { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:36px; }
        @media(max-width:680px){ .cp-sk3 { grid-template-columns:1fr; } }
        .cp-skcard { background:#04100e; border:1px solid #0d2b25; border-top:2px solid; padding:24px 20px; }
        .cp-skcard-icon { font-size:20px; margin-bottom:12px; }
        .cp-skcard-g { font-size:13px; font-weight:700; margin-bottom:12px; font-family:'Syne',sans-serif; }
        .cp-skcard ul { list-style:none; padding:0; margin:0; }
        .cp-skcard li { font-size:12px; color:#5a9088; line-height:1.62; padding:5px 0; border-bottom:1px solid #0a1a18; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-skcard li:last-child { border-bottom:none; }
        .cp-skcard li::before { content:"-> "; color:#1e5c54; }

        /* why */
        .cp-why4 { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-top:36px; }
        @media(max-width:680px){ .cp-why4 { grid-template-columns:1fr; } }
        .cp-wcard { background:#04100e; border:1px solid #0d2b25; padding:24px 20px; }
        .cp-wcard-lbl { font-size:9.5px; font-weight:700; letter-spacing:.18em; color:#2e6b62; text-transform:uppercase; margin-bottom:8px; font-family:'JetBrains Mono',monospace; }
        .cp-wcard-t { font-size:14px; font-weight:700; color:#c8e8e4; margin-bottom:8px; font-family:'Syne',sans-serif; }
        .cp-wcard-b { font-size:12.5px; color:#5a9088; line-height:1.65; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* cta */
        .cp-cta { padding:76px 0 96px; text-align:center; }
        .cp-cta h2 { font-size:clamp(22px,3vw,36px); font-weight:800; letter-spacing:-.02em; margin-bottom:14px; font-family:'Syne',sans-serif; }
        .cp-cta p { font-size:14px; color:#5a9088; margin-bottom:32px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
        .cp-btn-p { font-size:13px; font-weight:700; padding:12px 26px; background:${T}; color:#030a09; border:none; cursor:pointer; letter-spacing:.04em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; }
        .cp-btn-p:hover { background:#2fc4a1; }
        .cp-btn-s { font-size:13px; font-weight:700; padding:12px 26px; background:transparent; color:${T}; border:1px solid #1a3a34; cursor:pointer; letter-spacing:.04em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; }
        .cp-btn-s:hover { background:#0a1e1b; }
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
            {CASES.map(c => {
              const isOpen = open === c.id;
              const tab = getTab(c.id);
              return (
                <div key={c.id} className={`cp-case${isOpen ? " is-open" : ""}`} style={isOpen ? { borderLeftColor: c.accent } : {}}>
                  <div className="cp-case-hd" onClick={() => setOpen(isOpen ? null : c.id)}>
                    <div className="cp-case-lft">
                      <span className="cp-ctag" style={{ color:c.accent, borderColor:c.accent+"35", background:c.accent+"12" }}>
                        {c.tag}
                      </span>
                      <div>
                        <p className="cp-cname">{c.client}</p>
                        <p className="cp-csec">{c.sector} · {c.country}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                      <div className="cp-snap">
                        {c.metrics.slice(0,2).map(m => (
                          <div key={m.lbl} className="cp-snap-item">
                            <div className="cp-snap-val" style={{ color:c.accent }}>{m.val}</div>
                            <div className="cp-snap-lbl">{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                      <span className="cp-expand-hint">{isOpen ? "collapse" : "expand"}</span>
                      <div className="cp-chev-wrap">
                        <span className={`cp-chev${isOpen ? " open" : ""}`}>⌄</span>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="cp-cbody">
                      <div className="cp-brief" style={{ borderColor:c.accent }}>
                        <span className="cp-brief-lbl" style={{ color:c.accent }}>CLIENT BRIEF</span>
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
                              <div className="cp-met-v" style={{ color:c.accent }}>{m.val}</div>
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
            <h2 style={{ fontSize:"clamp(20px,2.6vw,32px)", fontWeight:800, letterSpacing:"-.02em", margin:"0 0 8px", fontFamily:"'Syne',sans-serif" }}>
              Where business strategy meets engineering execution
            </h2>
            <p style={{ fontSize:13.5, color:"#5a9088", maxWidth:540, fontFamily:"'Space Grotesk',sans-serif", fontWeight:300 }}>
              Most consultants stop at the slide deck. Most engineers don&apos;t attend the client call.
              I do both — and that&apos;s where the value is created.
            </p>
            <div className="cp-sk3">
              {SKILLS.map(s => (
                <div key={s.group} className="cp-skcard" style={{ borderTopColor:s.color }}>
                  <div className="cp-skcard-icon" style={{ color:s.color }}>{s.icon}</div>
                  <p className="cp-skcard-g" style={{ color:s.color }}>{s.group}</p>
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
            <h2 style={{ fontSize:"clamp(20px,2.6vw,32px)", fontWeight:800, letterSpacing:"-.02em", margin:"0 0 8px", fontFamily:"'Syne',sans-serif" }}>
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
