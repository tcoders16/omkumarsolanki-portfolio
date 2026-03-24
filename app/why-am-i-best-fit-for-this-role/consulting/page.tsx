"use client";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   CONSULTING CHECKLIST — what top firms need
───────────────────────────────────────────── */
const consultingNav = [
  { req: 'Problem Structuring & MECE Thinking',  section: 'sec-problem',      proof: 'SOW → root cause → architecture decision every engagement', metric: '4 industries · 4 projects' },
  { req: 'Client Discovery & Requirements',       section: 'sec-discovery',    proof: 'Shadowed TTC ops, interviewed 4 attorneys, 2-3 days on-site',  metric: 'Before writing a line of code' },
  { req: 'Stakeholder Alignment & Communication', section: 'sec-stakeholder',  proof: 'Eval dashboards shared weekly · Clients sign off on metrics',   metric: 'No surprises. Ever.' },
  { req: 'Cross-Industry Experience',             section: 'sec-industries',   proof: 'Legal · EdTech · Civil Engineering · Public Transit',           metric: '4 verticals · 4 production systems' },
  { req: 'Data-Driven Business Case',             section: 'sec-roi',          proof: 'Every project: ROI measured, documented, presented to exec',     metric: '$1M conversation · Renewed contracts' },
  { req: 'AI / Technology Strategy',              section: 'sec-ai-strategy',  proof: 'Translated AI capability into P&L impact for 4 clients',         metric: 'Not just implementation — strategy' },
  { req: 'Agile Delivery & Project Ownership',    section: 'sec-delivery',     proof: 'Solo end-to-end: scoping → build → eval → production → support', metric: 'P0 resolved in 24 min' },
  { req: 'Executive Communication',               section: 'sec-exec',         proof: 'Boardroom-brief writing · demos that closed $1M conversation',   metric: 'Translated tech to business impact' },
];

const TICKER_ITEMS = [
  { label: "Context Retention",   val: "72% → 98%",    sub: "Resso.ai · AI platform" },
  { label: "Hallucination Rate",  val: "14% → 3.8%",   sub: "LLM quality engineering" },
  { label: "Data Egress",         val: "0 bytes",       sub: "Lawline · Air-gapped RAG" },
  { label: "Investment Unlocked", val: "$1M",           sub: "Rogers · President conversation" },
  { label: "Rider Base Served",   val: "1.7M / day",   sub: "TTC Lost and Found" },
  { label: "Concrete Mix R²",     val: "0.89",          sub: "Corol · UHPC structural ML" },
  { label: "Incident Resolution", val: "P0 in 24 min", sub: "Production support" },
  { label: "Industries",          val: "4 live",        sub: "Legal · EdTech · Eng · Transit" },
  { label: "Lab Cycles",          val: "Weeks → 1 day", sub: "Corol · UHPC strength prediction" },
  { label: "Contract Outcome",    val: "Renewed +",     sub: "Resso · Expanded scope" },
];

const CASE_STUDIES = [
  {
    id: "resso",
    client: "Resso.ai",
    sector: "EdTech · AI Interview Platform",
    role: "AI Systems Architect & Lead Engineer",
    industry: "Education Technology",
    color: "#0a9280",
    bg: "#e4faf5",
    border: "#0a928030",
    challenge: "Client needed AI interview agents that remember the full conversation — or students drop off mid-session. Retention was tanking.",
    discovery: "2 days of user session analysis. Mapped every dropout event. Identified that 100% of drop-offs followed an agent asking a question already answered. Root cause: stateless architecture.",
    hypothesis: "If we introduce a Redis sliding-window session layer with dynamic persona injection, context retention will exceed 90% and hallucination will halve.",
    delivered: [
      { t: "Stateful session architecture", d: "Redis sliding-window compresses turn history; every call receives full context." },
      { t: "Dynamic persona injection",     d: "5 distinct interview personas configurable per session at runtime." },
      { t: "Hallucination eval pipeline",   d: "500-document automated evaluation suite; daily regression against ground truth." },
      { t: "Stakeholder dashboard",         d: "Weekly eval report shared with client — retention %, error rate, P(hire) score." },
    ],
    outcomes: [
      { n: "72% → 98%",  l: "Context retention" },
      { n: "14% → 3.8%", l: "Hallucination rate" },
      { n: "1 → 5",      l: "Personas shipped" },
      { n: "Renewed +",  l: "Contract expanded" },
    ],
    exec_brief: "Students were dropping because the AI forgot them. We built memory. Retention jumped 26 points. Client renewed and expanded scope.",
  },
  {
    id: "lawline",
    client: "Lawline.tech",
    sector: "Legal AI · Rogers · $1M Investment Conversation",
    role: "AI Strategy Consultant & Systems Engineer",
    industry: "Legal Technology",
    color: "#c01a08",
    bg: "#fff5f5",
    border: "#c01a0830",
    challenge: "Attorney-client privilege means zero data can leave the firm's network. Every existing AI legal tool failed this constraint. The client had ruled out the entire market.",
    discovery: "3 days interviewing 4 attorneys. Mapped the exact privilege boundary: any cloud API call = breach. This is not a preference — it is a legal obligation. The constraint defined the architecture.",
    hypothesis: "If we run a quantized GGUF local LLM with an on-device HNSW vector store, we can match cloud AI quality with zero egress — and that unlocks a market no SaaS vendor can serve.",
    delivered: [
      { t: "Air-gapped RAG stack",        d: "GGUF local LLM + HNSW vector store. Zero bytes leave the building. Ever." },
      { t: "Canadian legal corpus",       d: "CanLII + firm precedents ingested; jurisdiction-aware retrieval." },
      { t: "Privilege-safe evaluation",   d: "Hallucination scored against local ground truth — no cloud eval tools." },
      { t: "Executive demo + deck",       d: "Translated technical architecture into a $1M business case for Rogers President." },
    ],
    outcomes: [
      { n: "0 bytes",   l: "Data egress" },
      { n: "3.8%",      l: "Hallucination rate" },
      { n: "$1M",       l: "Investment conversation" },
      { n: "Live SaaS", l: "Production deployed" },
    ],
    exec_brief: "Every AI tool on the market violated attorney-client privilege. We built the only one that didn't. That unlocked a $1M conversation with Rogers.",
  },
  {
    id: "corol",
    client: "Corol (UHPC Lab)",
    sector: "Civil Engineering · Structural Materials AI",
    role: "ML Strategy Consultant & Research Engineer",
    industry: "Construction / Engineering",
    color: "#b87000",
    bg: "#fffbeb",
    border: "#d9920030",
    challenge: "Structural engineers were spending weeks per concrete mix formulation — mix, pour, cure, test. With only 200 historical rows of data, they doubted ML was even possible.",
    discovery: "2 days in the lab with engineers. Mapped every variable they tracked: W/C ratio, silica fume %, fibre dosage, curing age. Identified that domain-informed feature engineering could outperform data volume.",
    hypothesis: "XGBoost with SHAP-guided feature importance on domain-engineered variables will hit R² > 0.85 on 200-row data — enough to screen hundreds of mixes computationally.",
    delivered: [
      { t: "Domain-first feature engineering",  d: "W/C ratio, silica fume, fibre dosage encoded with structural engineering semantics." },
      { t: "XGBoost strength predictor",         d: "R² = 0.89 on held-out set. Engineers validate on a single physical mix." },
      { t: "SHAP interpretability layer",        d: "Engineers see which input drives each prediction — trust-building for adoption." },
      { t: "Mix screening workflow",             d: "100s of formulations screened computationally in an afternoon vs. weeks of lab time." },
    ],
    outcomes: [
      { n: "R² = 0.89",      l: "Prediction accuracy" },
      { n: "Weeks → 1 day",  l: "Lab cycle time" },
      { n: "200 rows",       l: "Trained with" },
      { n: "100s mixes",     l: "Screened computationally" },
    ],
    exec_brief: "Engineers doubted ML was possible with 200 data points. We made it work. Mix evaluation went from weeks to an afternoon.",
  },
  {
    id: "ttc",
    client: "TTC — Lost and Found",
    sector: "Public Transit · Civic AI · Capstone 2026",
    role: "Full-Stack AI Consultant & Systems Engineer",
    industry: "Public Sector / Transportation",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#3b82f630",
    challenge: "1.7M daily riders lose items on the TTC. Staff manually match claims to recovered items — slow, inaccurate, and doesn't scale. A rider who lost a wallet 3 days ago gives up and never tries.",
    discovery: "Shadowed TTC Lost and Found ops for 2 days. Mapped the matching bottleneck: unstructured text, no semantic search, no confidence scoring. Staff escalated everything. Identified SMS as the preferred resolution channel.",
    hypothesis: "pgvector cosine similarity on item descriptions + confidence-gated routing will match items faster than staff review, with escalation only when confidence < threshold.",
    delivered: [
      { t: "Semantic item matching",          d: "pgvector cosine similarity over item descriptions. Fuzzy + semantic in one query." },
      { t: "Confidence-gated SMS routing",    d: "High-confidence matches → automated SMS. Low-confidence → staff queue with pre-ranked candidates." },
      { t: "FastAPI + PostgreSQL backbone",   d: "Production-grade REST API with audit log. Every decision traceable." },
      { t: "Staff escalation dashboard",      d: "Staff see ranked candidates with match score — not raw items. Decision time cut." },
    ],
    outcomes: [
      { n: "1.7M/day",  l: "Rider base served" },
      { n: "May 2026",  l: "Capstone pitch" },
      { n: "pgvector",  l: "Semantic matching" },
      { n: "0 manual",  l: "High-confidence cases" },
    ],
    exec_brief: "Staff were bottlenecking every match. We made the system decide — and escalate only when it wasn't sure. That's the consulting answer: automate the obvious, augment the ambiguous.",
  },
];

const CONSULTING_SKILLS = [
  { cat: "Problem Structuring",   tags: ["MECE decomposition", "Root cause analysis", "Hypothesis-first", "SOW → architecture", "Constraint mapping"] },
  { cat: "Client Discovery",      tags: ["On-site shadowing", "Stakeholder interviews", "Requirements elicitation", "Privilege/compliance mapping", "User journey mapping"] },
  { cat: "AI / ML Strategy",      tags: ["Build vs. buy framing", "Model selection rationale", "Hallucination measurement", "Eval pipeline design", "Air-gapped architecture"] },
  { cat: "Delivery",              tags: ["Solo end-to-end", "Agile cadence", "Weekly client reviews", "P0 incident response", "Production support"] },
  { cat: "Communication",         tags: ["Executive briefs", "Demo-to-close decks", "SHAP explainability", "Stakeholder dashboards", "Technical → business translation"] },
  { cat: "Industries",            tags: ["Legal technology", "Education technology", "Civil / structural engineering", "Public transit / civic tech"] },
  { cat: "Stack Breadth",         tags: ["Python · FastAPI · Next.js", "PostgreSQL · Redis · pgvector", "PyTorch · XGBoost · SHAP", "GGUF · HNSW · LangGraph", "Azure · AWS · Docker"] },
];

export default function ConsultingFit() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [openCase, setOpenCase] = useState<string | null>("resso");
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    setTimeLeft(300);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setChecked(new Set());
          setTimerActive(false);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCheck = (idx: number) => {
    const next = new Set(checked);
    if (next.has(idx)) { next.delete(idx); } else { next.add(idx); if (!timerActive) startTimer(); }
    setChecked(next);
    const el = document.getElementById(consultingNav[idx].section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f7f7f5; color: #111; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.75; -webkit-font-smoothing: antialiased; }
        .shell { max-width: 880px; margin: 0 auto; padding: 52px 28px 120px; }

        /* BADGES */
        .badge-row { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; border: 1px solid; }
        .badge-consult { color: #1d4ed8; border-color: #3b82f640; background: #eff6ff; }
        .badge-co { color: #666; border-color: #d4d4ce; }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        /* HERO */
        .hero { margin-bottom: 56px; }
        .hero-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: #1d4ed8; margin-bottom: 14px; }
        .hero-h1 { font-family: 'Syne', sans-serif; font-size: clamp(30px, 5.5vw, 52px); font-weight: 800; color: #080808; line-height: 1.08; letter-spacing: -.025em; margin-bottom: 18px; }
        .hero-h1 em { color: #1d4ed8; font-style: normal; }
        .hero-h1 em.g { color: #0a9280; }
        .hero-p { font-size: 17px; color: #555; max-width: 600px; line-height: 1.75; }

        .divider { height: 1px; background: linear-gradient(90deg, #d0d0ca, transparent); margin: 52px 0; }
        .section { margin-bottom: 68px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #1d4ed8; margin-bottom: 8px; font-weight: 600; }
        .sh2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #0d0d0d; margin-bottom: 6px; }
        .sh3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .body-p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 12px; }
        .body-p:last-child { margin-bottom: 0; }
        .hl { color: #111; font-weight: 600; }
        .hl-blue { color: #1d4ed8; font-weight: 500; }
        .hl-teal { color: #0a9280; font-weight: 500; }

        /* TICKER */
        .ticker-wrap { position: sticky; top: 0; z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,.35); }
        .ticker-bar { background: #0d0d0d; border-bottom: 3px solid #1d4ed8; display: flex; align-items: stretch; overflow: hidden; height: 54px; }
        .ticker-label { flex-shrink: 0; background: #1d4ed8; color: #fff; padding: 0 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap; gap: 3px; min-width: 160px; }
        .ticker-label-row { display: flex; align-items: center; gap: 8px; }
        .ticker-label-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        .ticker-label-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #bfd4ff; }
        .ticker-label-dot { width: 10px; height: 10px; border-radius: 50%; background: #fff; animation: tickerblink .8s infinite; flex-shrink: 0; }
        @keyframes tickerblink { 0%,100% { opacity:1; } 50% { opacity:0.05; } }
        .ticker-divider { width: 3px; background: #2a2a2a; flex-shrink: 0; }
        .ticker-track { flex: 1; overflow: hidden; display: flex; align-items: center; }
        .ticker-inner { display: flex; align-items: center; animation: tickerscroll 52s linear infinite; white-space: nowrap; }
        .ticker-inner:hover { animation-play-state: paused; }
        @keyframes tickerscroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-item { display: inline-flex; align-items: center; gap: 12px; padding: 0 44px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; color: #c8c8c8; line-height: 1; }
        .ticker-item strong { color: #ffffff; font-weight: 700; }
        .t-blue { color: #60a5fa; font-weight: 700; }
        .ticker-sep { color: #1d4ed8; font-size: 18px; padding: 0 4px; line-height: 1; font-weight: 700; }

        /* FLOATING CHECKLIST */
        .tracker { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 999; width: 320px; }
        .tracker-toggle { margin-left: auto; display: flex; align-items: center; gap: 8px; background: #1d4ed8; color: #fff; border: none; border-radius: 8px 8px 0 0; padding: 10px 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; width: 100%; justify-content: space-between; box-shadow: 0 -4px 20px rgba(29,78,216,.25); }
        .tracker-body { background: #fff; border: 1.5px solid #e0e0da; border-top: none; border-radius: 0 0 12px 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,.08); }
        .tracker-header { background: #f4f8ff; border-bottom: 1px solid #dde8ff; padding: 12px 16px 10px; }
        .tracker-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #1d4ed8; }
        .tracker-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #888; margin-top: 2px; letter-spacing: .12em; text-transform: uppercase; }
        .tracker-timer { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #1d4ed8; text-align: center; padding: 8px 0; border-bottom: 1px solid #e8e8e2; }
        .tracker-list { list-style: none; padding: 6px 0; max-height: 340px; overflow-y: auto; }
        .tracker-item { display: flex; align-items: flex-start; gap: 10px; padding: 9px 16px; cursor: pointer; transition: background .12s; border-bottom: 1px solid #f2f2f0; }
        .tracker-item:last-child { border-bottom: none; }
        .tracker-item:hover { background: #f8f8f6; }
        .tracker-item.done { background: #f0fbf8; }
        .t-check { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid #d0d0cc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all .15s; }
        .tracker-item.done .t-check { background: #0a9280; border-color: #0a9280; color: #fff; }
        .t-req { font-size: 12px; color: #333; font-weight: 500; line-height: 1.4; }
        .t-metric { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #1d4ed8; margin-top: 2px; }
        @media (max-width: 900px) { .tracker { display: none; } }

        /* CASE STUDY CARDS */
        .case-card { border: 1.5px solid #e0e0da; border-radius: 16px; overflow: hidden; margin-bottom: 18px; background: #fff; }
        .case-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px; cursor: pointer; transition: background .15s; gap: 16px; }
        .case-header:hover { background: #fafaf8; }
        .case-left { display: flex; align-items: center; gap: 16px; }
        .case-icon { width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; flex-shrink: 0; }
        .case-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #0d0d0d; }
        .case-sub { font-size: 12px; color: #777; margin-top: 2px; }
        .case-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .case-chip { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; border: 1px solid; font-weight: 600; }
        .case-arrow { font-size: 14px; color: #bbb; transition: transform .2s; flex-shrink: 0; }
        .case-card.open .case-arrow { transform: rotate(180deg); }

        .case-body { padding: 0 24px 28px; border-top: 1px solid #ebebeb; animation: cfd .18s ease; }
        @keyframes cfd { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

        /* EXEC BRIEF — the consulting money shot */
        .exec-brief { background: #0d1117; border-radius: 12px; padding: 20px 24px; margin: 24px 0 20px; position: relative; overflow: hidden; }
        .exec-brief::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #1d4ed8, #0a9280); }
        .exec-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #60a5fa; margin-bottom: 8px; font-weight: 700; }
        .exec-text { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #f0f0ee; line-height: 1.5; }

        /* CASE SECTIONS */
        .case-section { margin-top: 20px; }
        .cs-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #1d4ed8; margin-bottom: 10px; font-weight: 700; }
        .cs-text { font-size: 14px; color: #555; line-height: 1.8; }
        .cs-text strong { color: #111; font-weight: 600; }

        .delivered-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        @media (max-width: 580px) { .delivered-grid { grid-template-columns: 1fr; } }
        .d-card { background: #fafaf8; border: 1px solid #e8e8e2; border-radius: 10px; padding: 15px 17px; }
        .d-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 4px; }
        .d-desc { font-size: 13px; color: #666; line-height: 1.65; }

        .outcomes-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .outcome-chip { background: #fff; border: 1.5px solid #e0e0da; border-radius: 10px; padding: 12px 16px; min-width: 110px; }
        .outcome-n { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; }
        .outcome-l { font-size: 11px; color: #777; margin-top: 2px; }

        /* SKILL BREADTH */
        .breadth-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
        .breadth-row { display: flex; align-items: flex-start; gap: 0; background: #fff; border: 1px solid #e0e0da; border-radius: 10px; overflow: hidden; }
        .breadth-cat { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; min-width: 150px; padding: 13px 16px; background: #fafaf8; border-right: 1px solid #e8e8e2; display: flex; align-items: center; color: #555; }
        .breadth-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; align-items: center; }
        .breadth-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555; background: #f4f4f1; border: 1px solid #e0e0da; border-radius: 5px; padding: 3px 9px; }
        .bt-blue { color: #1d4ed8; background: #eff6ff; border-color: #3b82f630; font-weight: 600; }
        .bt-teal { color: #0a7a6a; background: #e4faf5; border-color: #0a928030; font-weight: 600; }
        .bt-amber { color: #b87000; background: #fffbeb; border-color: #d9920030; font-weight: 600; }
        .bt-red { color: #dc2626; background: #fef2f2; border-color: #dc262630; font-weight: 600; }
        .bt-purple { color: #6d28d9; background: #f5f3ff; border-color: #8b5cf630; font-weight: 600; }

        /* DISCOVERY TIMELINE */
        .disc-timeline { padding-left: 28px; position: relative; margin-top: 16px; }
        .disc-timeline::before { content:''; position:absolute; left:7px; top:6px; bottom:6px; width:2px; background: linear-gradient(to bottom, #1d4ed8, #0a9280); }
        .disc-step { position: relative; margin-bottom: 22px; }
        .disc-step:last-child { margin-bottom: 0; }
        .disc-dot { position: absolute; left: -23px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #1d4ed8; border: 2px solid #fff; box-shadow: 0 0 0 2px #1d4ed840; }
        .disc-phase { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: #1d4ed8; font-weight: 700; margin-bottom: 4px; }
        .disc-content { font-size: 14px; color: #555; line-height: 1.75; }
        .disc-content strong { color: #111; font-weight: 600; }

        /* CTA */
        .cta-block { background: #0d1117; border-radius: 16px; padding: 44px 40px; text-align: center; position: relative; overflow: hidden; }
        .cta-block::before { content:''; position: absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg,#1d4ed8,#0a9280,#8b5cf6); }
        .cta-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #60a5fa; margin-bottom: 16px; }
        .cta-h { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #f4f4f2; margin-bottom: 12px; line-height: 1.2; }
        .cta-sub { font-size: 15px; color: #aaa; margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; transition: all .2s; }
        .cta-primary { background: #1d4ed8; color: #fff; }
        .cta-primary:hover { background: #2563eb; transform: translateY(-2px); }
        .cta-secondary { background: rgba(255,255,255,0.06); color: #d4d4d0; border: 1px solid rgba(255,255,255,0.12); }
        .cta-secondary:hover { background: rgba(255,255,255,0.1); }

        /* PROOF TABLE */
        .proof-table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0da; }
        .proof-table th { background: #f4f4f1; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: #666; padding: 11px 16px; text-align: left; border-bottom: 1px solid #e0e0da; font-weight: 700; }
        .proof-table td { padding: 13px 16px; font-size: 13px; color: #555; border-bottom: 1px solid #f0f0ea; vertical-align: top; }
        .proof-table tr:last-child td { border-bottom: none; }
        .proof-table tr:hover td { background: #fafaf8; }
        .proof-table td:first-child { font-weight: 600; color: #111; width: 28%; }
        .metric-pill { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
        .mp-blue { color: #1d4ed8; background: #eff6ff; }
        .mp-teal { color: #0a7a6a; background: #e4faf5; }
        .mp-amber { color: #b87000; background: #fffbeb; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        @media (max-width: 640px) { .delivered-grid { grid-template-columns: 1fr; } .cta-block { padding: 32px 22px; } }
      `}</style>

      {/* ── BREAKING NEWS TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <div className="ticker-label">
            <div className="ticker-label-row">
              <span className="ticker-label-dot" />
              <span className="ticker-label-title">LIVE</span>
            </div>
            <span className="ticker-label-sub">Consulting Record</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-track">
            <div className="ticker-inner">
              {tickerContent.map((item, i) => (
                <span key={i} className="ticker-item">
                  <span style={{ color: "#888", fontSize: 11 }}>{item.label}</span>
                  <strong className="t-blue">{item.val}</strong>
                  <span style={{ color: "#555", fontSize: 12 }}>{item.sub}</span>
                  <span className="ticker-sep">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING CHECKLIST ── */}
      <div className="tracker">
        <button className="tracker-toggle" onClick={() => setTrackerOpen(v => !v)}>
          <span>Requirements Checklist</span>
          <span>{trackerOpen ? "▲" : "▼"}</span>
        </button>
        {trackerOpen && (
          <div className="tracker-body">
            <div className="tracker-header">
              <div className="tracker-title">Consulting Firm — What You Need</div>
              <div className="tracker-sub">Tap each to jump + verify</div>
            </div>
            {timerActive && (
              <div className="tracker-timer">{fmtTime(timeLeft)}</div>
            )}
            <ul className="tracker-list">
              {consultingNav.map((item, i) => (
                <li
                  key={i}
                  className={`tracker-item${checked.has(i) ? " done" : ""}`}
                  onClick={() => toggleCheck(i)}
                >
                  <div className="t-check">
                    {checked.has(i) && <span style={{ fontSize: 11 }}>✓</span>}
                  </div>
                  <div>
                    <div className="t-req">{item.req}</div>
                    <div className="t-metric">{item.metric}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="shell">

        {/* ── BADGES ── */}
        <div className="badge-row">
          <span className="badge badge-consult"><span className="dot" />AI Consulting · Canada</span>
          <span className="badge badge-co">4 Industries · 4 Production Systems</span>
          <span className="badge badge-co">Omkumar Solanki · 2026</span>
        </div>

        {/* ── HERO ── */}
        <div className="hero">
          <div className="hero-eyebrow">Why I belong at your firm</div>
          <h1 className="hero-h1">
            I translate <em>business problems</em><br />
            into <em className="g">technology decisions</em><br />
            that change the P&amp;L.
          </h1>
          <p className="hero-p">
            Four engagements. Four industries. Legal, EdTech, Civil Engineering, Public Transit.
            Every one started with discovery — not code. Every one ended with a measurable outcome
            your CFO would recognize. This page shows you exactly how I work.
          </p>
        </div>

        <div className="divider" />

        {/* ── SECTION: PROBLEM STRUCTURING ── */}
        <div id="sec-problem" className="section">
          <div className="eyebrow">Problem Structuring</div>
          <h2 className="sh2">I diagnose before I prescribe.</h2>
          <p className="body-p">
            Every engagement follows the same discipline: <span className="hl">read the SOW, map the constraint, form a hypothesis, then validate on-site before touching a keyboard.</span> This is MECE thinking applied to technical consulting — mutually exclusive root causes, collectively exhaustive solution space.
          </p>

          <table className="proof-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Business Constraint</th>
                <th>Root Cause Identified</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Resso.ai</td>
                <td>Students dropping off mid-interview</td>
                <td>Stateless architecture — agent had no memory</td>
                <td><span className="metric-pill mp-teal">72% → 98% retention</span></td>
              </tr>
              <tr>
                <td>Lawline (Rogers)</td>
                <td>Every AI tool violated attorney-client privilege</td>
                <td>All vendors assumed cloud egress — structurally wrong</td>
                <td><span className="metric-pill mp-blue">$1M investment conversation</span></td>
              </tr>
              <tr>
                <td>Corol / UHPC</td>
                <td>Mix evaluation took weeks per formulation</td>
                <td>Brute-force lab testing; ML not explored due to small data</td>
                <td><span className="metric-pill mp-amber">Weeks → one afternoon</span></td>
              </tr>
              <tr>
                <td>TTC Lost &amp; Found</td>
                <td>Staff bottleneck on every item match</td>
                <td>No semantic search; staff reviewing all claims manually</td>
                <td><span className="metric-pill mp-blue">1.7M riders · automated</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="divider" />

        {/* ── SECTION: DISCOVERY ── */}
        <div id="sec-discovery" className="section">
          <div className="eyebrow">Discovery First</div>
          <h2 className="sh2">I spend time on-site before writing a line of code.</h2>
          <p className="body-p">
            Not requirements documents. <span className="hl">Actual time with the people who feel the problem.</span> This is where most technical implementations fail — they solve the stated requirement, not the real one.
          </p>

          <div className="disc-timeline">
            <div className="disc-step">
              <div className="disc-dot" />
              <div className="disc-phase">Resso.ai · 2 days</div>
              <div className="disc-content">
                Analysed <strong>session-level dropout events</strong>. Found that 100% of high-dropout sessions had a common pattern: agent re-asked a question the student already answered. This was not a UX issue — it was an architecture issue. No discovery → we'd have redesigned the UI.
              </div>
            </div>
            <div className="disc-step">
              <div className="disc-dot" style={{ background: "#c01a08" }} />
              <div className="disc-phase" style={{ color: "#c01a08" }}>Lawline / Rogers · 3 days</div>
              <div className="disc-content">
                Interviewed <strong>4 practising attorneys</strong>. Mapped the exact legal boundary: any API call to a cloud model = privilege breach under Canadian law. This single constraint ruled out 100% of existing AI legal tools. No discovery → we'd have built another cloud-dependent SaaS.
              </div>
            </div>
            <div className="disc-step">
              <div className="disc-dot" style={{ background: "#b87000" }} />
              <div className="disc-phase" style={{ color: "#b87000" }}>Corol · 2 days</div>
              <div className="disc-content">
                Spent time in the <strong>UHPC concrete lab</strong> with structural engineers. Learned every variable they tracked: W/C ratio, silica fume %, fibre dosage, curing age. Domain knowledge turned 200 data rows into a working ML model. No discovery → we'd have trained a generic model and failed.
              </div>
            </div>
            <div className="disc-step">
              <div className="disc-dot" style={{ background: "#1d4ed8" }} />
              <div className="disc-phase">TTC Operations · 2 days</div>
              <div className="disc-content">
                <strong>Shadowed TTC Lost &amp; Found staff</strong> during peak shift. Watched every item intake and matching decision. Identified that staff were manually scanning all claims — and that SMS was the resolution channel riders preferred. No discovery → we'd have built a web app nobody used.
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* ── SECTION: CASE STUDIES ── */}
        <div id="sec-industries" className="section">
          <div className="eyebrow">Cross-Industry Proof</div>
          <h2 className="sh2">Four industries. Four production systems.</h2>
          <p className="body-p" style={{ marginBottom: 28 }}>
            Each case study follows a consulting structure: <span className="hl">Challenge → Discovery → Hypothesis → Delivered → Executive Brief.</span> These are not student projects. Every system is live or in active pilot.
          </p>

          {CASE_STUDIES.map(cs => (
            <div key={cs.id} className={`case-card${openCase === cs.id ? " open" : ""}`}>
              <div className="case-header" onClick={() => setOpenCase(openCase === cs.id ? null : cs.id)}>
                <div className="case-left">
                  <div
                    className="case-icon"
                    style={{ background: cs.bg, color: cs.color }}
                  >
                    {cs.client[0]}
                  </div>
                  <div>
                    <div className="case-name">{cs.client}</div>
                    <div className="case-sub">{cs.sector}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="case-chip"
                    style={{ color: cs.color, borderColor: cs.border, background: cs.bg }}
                  >
                    {cs.industry}
                  </span>
                  <span className="case-arrow">▼</span>
                </div>
              </div>

              {openCase === cs.id && (
                <div className="case-body">
                  {/* Exec Brief */}
                  <div className="exec-brief">
                    <div className="exec-label">Executive Brief — one paragraph for the partner</div>
                    <div className="exec-text">{cs.exec_brief}</div>
                  </div>

                  {/* Challenge */}
                  <div className="case-section">
                    <div className="cs-label">The Challenge</div>
                    <div className="cs-text">{cs.challenge}</div>
                  </div>

                  {/* Discovery */}
                  <div className="case-section">
                    <div className="cs-label">Discovery Process</div>
                    <div className="cs-text">{cs.discovery}</div>
                  </div>

                  {/* Hypothesis */}
                  <div className="case-section">
                    <div className="cs-label">Hypothesis (Before Building)</div>
                    <div className="cs-text" style={{ fontStyle: "italic", color: "#444" }}>
                      &ldquo;{cs.hypothesis}&rdquo;
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="case-section">
                    <div className="cs-label">What Was Delivered</div>
                    <div className="delivered-grid">
                      {cs.delivered.map((d, i) => (
                        <div key={i} className="d-card">
                          <div className="d-title">{d.t}</div>
                          <div className="d-desc">{d.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="outcomes-row">
                    {cs.outcomes.map((o, i) => (
                      <div key={i} className="outcome-chip">
                        <div className="outcome-n" style={{ color: cs.color }}>{o.n}</div>
                        <div className="outcome-l">{o.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* ── SECTION: STAKEHOLDER ── */}
        <div id="sec-stakeholder" className="section">
          <div className="eyebrow">Stakeholder Alignment</div>
          <h2 className="sh2">Clients sign off on metrics. No surprises.</h2>
          <p className="body-p">
            Every engagement runs a weekly eval dashboard shared directly with the client. Metrics are agreed upfront — not chosen after the fact. <span className="hl">Clients know the success criteria before I write line one.</span>
          </p>
          <p className="body-p">
            At Resso.ai: <span className="hl-teal">context retention %, hallucination rate, session count, dropout rate</span> — all agreed week one. The client expanded scope mid-engagement because the numbers were visible and ahead of target.
          </p>
          <p className="body-p">
            At Lawline: the technical constraint (zero egress) was not a product preference — it was a compliance requirement. I mapped it to Canadian privilege law, documented it in the SOW, and presented the architecture decision to the Rogers President with a P&amp;L frame: <span className="hl-blue">&ldquo;Every other vendor is a liability. This system is the only viable option.&rdquo;</span>
          </p>
        </div>

        <div className="divider" />

        {/* ── SECTION: ROI ── */}
        <div id="sec-roi" className="section">
          <div className="eyebrow">Data-Driven Business Case</div>
          <h2 className="sh2">Every outcome is a number your CFO recognises.</h2>
          <p className="body-p">
            Consulting firms don&apos;t sell features. They sell outcomes. Here is every outcome I have delivered, in the language finance uses:
          </p>

          <table className="proof-table" style={{ marginTop: 24 }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Before</th>
                <th>After</th>
                <th>Business Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Student context retention</td>
                <td>72%</td>
                <td><span className="metric-pill mp-teal">98%</span></td>
                <td>Drop-off eliminated → contract renewed &amp; expanded</td>
              </tr>
              <tr>
                <td>LLM hallucination rate</td>
                <td>14%</td>
                <td><span className="metric-pill mp-teal">3.8%</span></td>
                <td>Legal liability reduced; attorneys trust the output</td>
              </tr>
              <tr>
                <td>Data egress (legal RAG)</td>
                <td>100% cloud</td>
                <td><span className="metric-pill mp-teal">0 bytes</span></td>
                <td>Privilege-safe; opened a $1M investment conversation</td>
              </tr>
              <tr>
                <td>Concrete mix eval cycle</td>
                <td>Weeks</td>
                <td><span className="metric-pill mp-amber">One afternoon</span></td>
                <td>100s of mixes screened computationally vs. one physically</td>
              </tr>
              <tr>
                <td>UHPC prediction accuracy</td>
                <td>Manual lookup</td>
                <td><span className="metric-pill mp-teal">R² = 0.89</span></td>
                <td>Engineers validate on a single physical mix, not dozens</td>
              </tr>
              <tr>
                <td>TTC item matching</td>
                <td>100% manual</td>
                <td><span className="metric-pill mp-blue">Automated (high conf.)</span></td>
                <td>Staff time freed; 1.7M riders served with faster resolution</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="divider" />

        {/* ── SECTION: AI STRATEGY ── */}
        <div id="sec-ai-strategy" className="section">
          <div className="eyebrow">AI / Technology Strategy</div>
          <h2 className="sh2">I frame AI capability as a business decision — not a feature.</h2>
          <p className="body-p">
            The question is never &ldquo;can we use AI?&rdquo;. It is <span className="hl">&ldquo;what is the constraint, what is the build-vs-buy decision, and what is the measurable outcome if we proceed?&rdquo;</span>
          </p>
          <p className="body-p">
            At Lawline: the answer was &ldquo;buy&rdquo; is impossible — every vendor fails the privilege test. The only viable path was a bespoke air-gapped stack. I built it. That architectural decision unlocked a conversation no competitor could have.
          </p>
          <p className="body-p">
            At Corol: the answer was &ldquo;yes, ML is viable at 200 rows — but only with domain-informed features.&rdquo; The constraint was not data volume. It was domain knowledge. I spent two days in the lab to acquire it.
          </p>
          <p className="body-p">
            This is what separates a technology strategist from a developer: <span className="hl-blue">understanding which constraints are technical and which are business decisions masquerading as technical ones.</span>
          </p>
        </div>

        <div className="divider" />

        {/* ── SECTION: DELIVERY ── */}
        <div id="sec-delivery" className="section">
          <div className="eyebrow">Agile Delivery & Project Ownership</div>
          <h2 className="sh2">Solo end-to-end. P0 resolved in 24 minutes.</h2>
          <p className="body-p">
            Every system listed here was scoped, built, evaluated, deployed, and supported by a single engineer. That is not a limitation — it is a capability signal. I own the entire delivery chain:
            <span className="hl"> SOW → discovery → architecture → build → eval → production → incident response.</span>
          </p>
          <p className="body-p">
            Production incident example: a Redis session expiry bug at Resso.ai caused agent amnesia for active sessions. Root cause isolated, patch deployed, and all affected sessions restored in <span className="hl">24 minutes</span> — with a post-mortem delivered to the client the same afternoon.
          </p>
        </div>

        <div className="divider" />

        {/* ── SECTION: EXEC COMMUNICATION ── */}
        <div id="sec-exec" className="section">
          <div className="eyebrow">Executive Communication</div>
          <h2 className="sh2">I write the brief that closes the room.</h2>
          <p className="body-p">
            Technical depth is useless if you cannot translate it for a VP in 90 seconds. Here are the three executive briefs from my engagements — the same sentences I delivered in the room:
          </p>

          {[
            { color: "#0a9280", client: "Resso.ai → CEO", text: "Students were dropping because the AI forgot them. We built memory. Retention jumped 26 points. Renew and expand." },
            { color: "#c01a08", client: "Lawline → Rogers President", text: "Every AI tool on the market violates attorney-client privilege. Ours doesn't. That's not a feature — it's the only viable product in this category." },
            { color: "#b87000", client: "Corol → Research Director", text: "You were spending weeks per mix. We screen hundreds computationally in an afternoon. Your lab time is now reserved for the top candidates, not the search." },
          ].map((b, i) => (
            <div key={i} className="exec-brief" style={{ marginBottom: 14 }}>
              <div className="exec-label" style={{ color: b.color }}>{b.client}</div>
              <div className="exec-text">{b.text}</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* ── SECTION: SKILL BREADTH ── */}
        <div className="section">
          <div className="eyebrow">Consulting Capability Map</div>
          <h2 className="sh2">What I bring to an engagement.</h2>
          <div className="breadth-grid">
            {CONSULTING_SKILLS.map((row, i) => (
              <div key={i} className="breadth-row">
                <div className="breadth-cat">{row.cat}</div>
                <div className="breadth-tags">
                  {row.tags.map((t, j) => {
                    const cls = j === 0 ? "breadth-tag bt-blue"
                      : j === 1 ? "breadth-tag bt-teal"
                      : j === 2 ? "breadth-tag bt-amber"
                      : "breadth-tag";
                    return <span key={j} className={cls}>{t}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="cta-block">
          <div className="cta-eyebrow">Ready to engage</div>
          <h2 className="cta-h">Let&apos;s talk about your client&apos;s problem.</h2>
          <p className="cta-sub">
            Four industries. Four live systems. Discovery-first every time.
            I am available for consulting roles, project engagements, and full-time positions across Canada.
          </p>
          <div className="cta-btns">
            <a href="mailto:om@resso.ai" className="cta-btn cta-primary">
              📬 om@resso.ai
            </a>
            <a href="https://www.linkedin.com/in/omkumarsolanki" target="_blank" rel="noreferrer" className="cta-btn cta-secondary">
              LinkedIn ↗
            </a>
            <a href="/" className="cta-btn cta-secondary">
              Full Portfolio ↗
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
