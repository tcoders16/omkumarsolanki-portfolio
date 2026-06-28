"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import ConsultingChat from "@/components/ConsultingChat";
import ScrollPop from "@/components/ScrollPop";
import OpportunityFinder from "@/components/OpportunityFinder";

/* ─── palette (mirror globals.css) ─── */
const T = "#39d9b4"; // electric teal — accent
const AM = "#f59e0b"; // amber
const VI = "#8b5cf6"; // violet

/* ═══════════════════════════════════════════════════════════════
   SERVICES — land-and-expand
═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: "audit",
    accent: T,
    kicker: "Start here",
    title: "AI Reliability Audit",
    sub: "Discovery",
    format: "1–2 week fixed engagement",
    price: "from $5,000",
    body: "I instrument your live agent, score how and where it fails, and hand you a remediation roadmap your team can act on immediately.",
    deliverables: [
      "Instrumented traces across real production traffic",
      "A scored failure-mode map (what breaks, how often, why)",
      "An evaluation harness stood up against your use case",
      "Token / cost + risk breakdown",
      "Prioritized remediation roadmap + exec readout",
    ],
    cta: "Start with an Audit",
  },
  {
    id: "harden",
    accent: AM,
    kicker: "Build",
    title: "Production Hardening",
    sub: "Implementation",
    format: "4–10 week fixed-scope project",
    price: "fixed scope, quoted from Audit (typ. $25k–90k)",
    body: "I take the audit findings and ship the fixes — durable orchestration, an eval pipeline, guardrails, and cost controls — with a runbook and a clean handoff.",
    deliverables: [
      "Durable orchestration + state / recovery",
      "Evaluation pipeline (online + offline)",
      "Observability dashboards for agent behavior",
      "Guardrails + cost controls",
      "Governance hooks, runbook, and handoff",
    ],
    cta: "Harden my agent",
  },
  {
    id: "fractional",
    accent: VI,
    kicker: "Ongoing",
    title: "Fractional AI Lead",
    sub: "Retainer",
    format: "Ongoing monthly",
    price: "$6k–20k / mo",
    body: "Senior AI direction for teams without an in-house AI lead — I keep evaluation, drift, and cost under continuous watch and steer what you build next.",
    deliverables: [
      "Continuous evaluation + monitoring",
      "Drift & cost reviews",
      "New use-case strategy",
      "Senior AI direction & architecture review",
    ],
    cta: "Talk about a retainer",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════
   CAPABILITIES — concrete deliverables, not adjectives
═══════════════════════════════════════════════════════════════ */
const CAPABILITIES = [
  {
    group: "Evaluation",
    color: T,
    items: [
      "Offline + online eval harnesses",
      "Ground-truth + LLM-judge + custom evaluators",
      "Regression gates wired into CI",
      "Quality dashboards stakeholders can read",
    ],
  },
  {
    group: "Reliability & orchestration",
    color: AM,
    items: [
      "Durable, recoverable agent runtimes",
      "State & memory design",
      "Retry / fallback logic",
      "Safe tool-use + human-in-the-loop escalation",
    ],
  },
  {
    group: "RAG quality",
    color: VI,
    items: [
      "Retrieval pipelines + grounding",
      "Hallucination reduction",
      "Chunking & embedding strategy",
      "Retrieval evaluation",
    ],
  },
  {
    group: "Cost control",
    color: T,
    items: [
      "Token budgets per workflow",
      "Model routing / cascade",
      "Caching + latency tuning",
      "Spend observability",
    ],
  },
  {
    group: "Observability",
    color: AM,
    items: [
      "Tracing across agent steps",
      "Structured logging",
      "Behavioral metrics",
      "Alerting on drift & regressions",
    ],
  },
  {
    group: "Architecture & governance",
    color: VI,
    items: [
      "Production agent design on AWS (Bedrock AgentCore / equiv.)",
      "Vector stores, queues, IaC",
      "Audit trails + guardrails",
      "Security posture for regulated buyers",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   PROCESS — 5 steps
═══════════════════════════════════════════════════════════════ */
const PROCESS = [
  { n: "01", t: "Diagnose", b: "Paid audit. Instrument the agent, reproduce the failures, score them. No guessing — measured." },
  { n: "02", t: "Design", b: "A prioritized roadmap: what to fix first, what it costs, what it buys you." },
  { n: "03", t: "Implement", b: "A fixed-scope hardening sprint. Durable orchestration, eval pipeline, guardrails, cost controls." },
  { n: "04", t: "Measure", b: "The eval proves the improvement. Failure rate, cost, and latency — before vs after, on real traffic." },
  { n: "05", t: "Handoff or Retain", b: "Runbook + clean handoff to your team, or I stay on as a fractional AI lead." },
];

/* ═══════════════════════════════════════════════════════════════
   CASE STUDIES — real engagements
═══════════════════════════════════════════════════════════════ */
const CASES = [
  {
    id: "legaltech",
    vertical: "Legal-tech",
    name: "Lawline.tech — privilege-compliant legal AI",
    accent: T,
    context: "A Canadian legal-research SaaS serving attorneys who cannot send a single byte to a cloud LLM, because of attorney–client privilege.",
    problem: "Cloud AI was off the table, and an ungrounded local model risked hallucinating case law — unacceptable for legal work where a wrong citation is a liability.",
    did: "Built a fully air-gapped RAG stack: HNSW vector store over Canadian legal corpora, a BGE cross-encoder reranker, and a GGUF-quantized local LLM. Added confidence-gated output so low-confidence answers route to a human instead of reaching an attorney.",
    result: "Sub-4% hallucination rate on legal eval sets, 0 bytes of data egress, 12,000+ files processed — now in enterprise licensing discussions as the only privilege-compliant option.",
  },
  {
    id: "onprem",
    vertical: "Private / on-prem RAG",
    name: "Vadtal — fully offline RAG on client hardware",
    accent: AM,
    context: "An organization managing 50,000+ donor records needed AI search but could not send any data to the cloud for privacy reasons.",
    problem: "They needed semantic search and Q&A over private records with zero external calls, running on modest on-premise hardware — not a cloud API.",
    did: "Designed a complete on-premise RAG stack: a GGUF-quantized LLM running in a 16 GB RAM footprint, a custom HNSW vector store with semantic chunking and metadata filtering, cosine-similarity retrieval, and a FastAPI inference server. Everything runs locally.",
    result: "Sub-1-second end-to-end query latency, 100% private, fully offline — a production RAG system on hardware the client already owned.",
  },
  {
    id: "realtime",
    vertical: "Real-time voice AI",
    name: "Resso.ai — live interview intelligence",
    accent: VI,
    context: "A hiring-tech platform needed to score live interviews as they happen, not after — streaming audio inference during the conversation.",
    problem: "Inference latency was ~8s — far too slow to surface a signal mid-interview — and the pipeline had to separate two speakers and stay reliable on a live stream.",
    did: "Built the production ML platform end to end: WebRTC audio capture, a speaker-diarization pipeline separating candidate and interviewer, NLP feature extraction across prosody/semantics/pace, and live hire-probability scoring — with the model served as quantized ONNX over a streaming socket.",
    result: "Cut inference latency from 8s to under 2s, scoring conversations live during the interview at ~0.94 AUC on the hire-probability model.",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════════ */
const FAQ = [
  {
    q: "Do you only advise, or do you build?",
    a: "Both — but the value is in the building. I run the discovery audit and then write the orchestration, eval pipeline, and guardrails myself. No handoff gap between the recommendation and the code.",
  },
  {
    q: "We already have strong engineers — why you?",
    a: "Because eval and reliability is a specialty your team probably hasn't built yet — it's now 60–80% of the work on serious AI teams, and most have no harness at all. I bring that depth, plus extra senior capacity and speed. I make your engineers faster, I don't replace them.",
  },
  {
    q: "How fast can we start?",
    a: "An audit can begin within a week. It's fixed-scope and time-boxed, so you get a scored failure map and a roadmap inside 1–2 weeks — not an open-ended engagement.",
  },
  {
    q: "Which frameworks do you work with?",
    a: "Framework-agnostic. LangGraph, CrewAI, Strands, MCP, and the OpenAI / Anthropic SDKs directly. I fit your stack rather than forcing a rewrite.",
  },
  {
    q: "Do you sign NDAs and work with regulated data?",
    a: "Yes. I've shipped on-premise and data-residency-constrained systems for regulated buyers (finance, legal, healthcare-adjacent). NDA-first is fine, and so is air-gapped.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   DIAGNOSTIC — pick your symptoms → root cause → the right next step
═══════════════════════════════════════════════════════════════ */
const SYMPTOMS = [
  { id: "hallucinate", label: "It makes things up / hallucinates", cause: "No grounding and no eval to catch wrong answers before they reach users.", fix: "audit" },
  { id: "cost", label: "Token costs are out of control", cause: "No budgets, model routing, or caching — spend scales straight up with traffic.", fix: "harden" },
  { id: "state", label: "It forgets or loses state in production", cause: "Stateless infra drops context on restart or mid-workflow.", fix: "harden" },
  { id: "demo-prod", label: "Works in the demo, breaks at scale", cause: "No reliability layer — the happy path was never hardened.", fix: "audit" },
  { id: "regression", label: "No way to tell if a change made it worse", cause: "No evaluation harness, so regressions ship silently.", fix: "audit" },
  { id: "blind", label: "We can't see why it fails", cause: "No tracing or observability on agent behavior.", fix: "harden" },
  { id: "drift", label: "Quality is slowly getting worse", cause: "Drift with nothing monitoring the metrics.", fix: "fractional" },
  { id: "no-lead", label: "We have no senior AI lead", cause: "No one owns evaluation, architecture, or AI direction.", fix: "fractional" },
] as const;

const SERVICE_BY_ID: Record<string, { title: string; sub: string; cta: string }> = {
  audit: { title: "AI Reliability Audit", sub: "1–2 week fixed engagement", cta: "Book a Reliability Audit" },
  harden: { title: "Production Hardening", sub: "4–10 week fixed-scope project", cta: "Book a hardening call" },
  fractional: { title: "Fractional AI Lead", sub: "Ongoing monthly retainer", cta: "Book a retainer call" },
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ConsultingClient() {
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [diagnosed, setDiagnosed] = useState(false);

  function toggleSymptom(id: string) {
    setDiagnosed(false);
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]));
  }

  const chosen = SYMPTOMS.filter(s => picked.includes(s.id));
  // Recommend the most-pointed-to service; the Audit is the front door on a tie.
  const tally = chosen.reduce<Record<string, number>>((acc, s) => {
    acc[s.fix] = (acc[s.fix] || 0) + 1;
    return acc;
  }, {});
  const recId = ["audit", "harden", "fractional"]
    .sort((a, b) => (tally[b] || 0) - (tally[a] || 0))[0];
  const rec = SERVICE_BY_ID[recId];
  const bookNote =
    `From the site diagnostic. My agent: ${chosen.map(s => s.label.toLowerCase()).join("; ")}. ` +
    `Recommended starting point: ${rec?.title}.`;
  const bookHref = `/book?note=${encodeURIComponent(bookNote)}`;

  return (
    <>
      <Nav />
      <style>{`
        /* ── tokens — mirror globals.css ── */
        .cp { background:#000; color:#f0f0f0; font-family:'Space Grotesk',system-ui,sans-serif; min-height:100vh; }
        .cp-w { max-width:1080px; margin:0 auto; padding:0 24px; }
        .cp-repl { color:${AM}; border:1px dashed rgba(245,158,11,.4); padding:1px 6px; border-radius:3px; font-family:'JetBrains Mono',monospace; font-size:.92em; }

        /* ── hero ── */
        .cp-hero { padding:124px 0 76px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .cp-eyebrow { font-size:11px; font-weight:600; letter-spacing:.22em; color:${T}; text-transform:uppercase; margin-bottom:18px; font-family:'JetBrains Mono',monospace; }
        .cp-h1 { font-size:clamp(32px,5vw,58px); font-weight:800; line-height:1.05; letter-spacing:-.04em; margin:0 0 22px; font-family:'Syne',sans-serif; color:#f0f0f0; max-width:880px; }
        .cp-h1 em { font-style:normal; color:${T}; }
        .cp-hero-sub { font-size:16px; line-height:1.75; color:#c8c4bc; max-width:660px; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-cta-row { display:flex; flex-wrap:wrap; gap:12px; margin-top:34px; }
        .cp-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:32px; }
        .cp-pill { font-size:10px; font-weight:500; padding:4px 11px; background:transparent; color:#5a5a5a; border:1px solid rgba(255,255,255,0.08); letter-spacing:.05em; font-family:'JetBrains Mono',monospace; }

        /* ── buttons ── */
        .cp-btn-p { font-size:12px; font-weight:700; padding:13px 26px; background:${T}; color:#000; border:none; cursor:pointer; letter-spacing:.04em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; transition:transform .2s, box-shadow .2s; border-radius:2px; }
        .cp-btn-p:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(57,217,180,.18); }
        .cp-btn-s { font-size:12px; font-weight:700; padding:13px 26px; background:transparent; color:#f0f0f0; border:1px solid rgba(255,255,255,0.14); cursor:pointer; letter-spacing:.04em; text-decoration:none; display:inline-flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; transition:border-color .15s, color .15s; border-radius:2px; }
        .cp-btn-s:hover { border-color:rgba(255,255,255,0.34); color:#fff; }

        /* ── sections ── */
        .cp-sec { padding:84px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .cp-sec-lbl { font-size:10px; font-weight:600; letter-spacing:.22em; color:rgba(57,217,180,.5); text-transform:uppercase; margin-bottom:18px; font-family:'JetBrains Mono',monospace; }
        .cp-sec-h2 { font-size:clamp(22px,3vw,34px); font-weight:800; letter-spacing:-.03em; margin:0 0 14px; font-family:'Syne',sans-serif; color:#f0f0f0; }
        .cp-sec-lead { font-size:14.5px; color:#9a968e; max-width:600px; line-height:1.7; font-family:'Space Grotesk',sans-serif; font-weight:300; }

        /* ── problem ── */
        .cp-prob-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(255,255,255,0.06); margin-top:36px; }
        @media(max-width:680px){ .cp-prob-grid { grid-template-columns:1fr; } }
        .cp-prob { background:#000; padding:26px 24px; }
        .cp-prob-t { font-size:14px; font-weight:700; color:#f0f0f0; margin-bottom:9px; font-family:'Syne',sans-serif; letter-spacing:-.01em; }
        .cp-prob-b { font-size:13px; line-height:1.7; color:#9a968e; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-stat { margin-top:36px; border-left:2px solid rgba(57,217,180,.4); padding:18px 22px; background:#080808; }
        .cp-stat-b { font-size:14px; line-height:1.7; color:#c8c4bc; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-stat-src { display:block; margin-top:10px; font-size:10px; letter-spacing:.12em; color:#5a5a5a; font-family:'JetBrains Mono',monospace; text-transform:uppercase; }

        /* ── services ── */
        .cp-svc3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.06); margin-top:36px; }
        @media(max-width:880px){ .cp-svc3 { grid-template-columns:1fr; } }
        .cp-svc { background:#0a0a0a; padding:30px 26px; display:flex; flex-direction:column; position:relative; overflow:hidden; }
        .cp-svc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--svc-accent); opacity:.55; }
        .cp-svc-kick { font-size:9px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; margin-bottom:16px; }
        .cp-svc-t { font-size:19px; font-weight:800; font-family:'Syne',sans-serif; letter-spacing:-.02em; color:#f0f0f0; }
        .cp-svc-sub { font-size:11px; color:#707070; font-family:'JetBrains Mono',monospace; letter-spacing:.08em; margin-top:3px; text-transform:uppercase; }
        .cp-svc-fmt { font-size:12px; color:#9a968e; font-family:'Space Grotesk',sans-serif; margin-top:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .cp-svc-body { font-size:13px; line-height:1.65; color:#9a968e; font-family:'Space Grotesk',sans-serif; font-weight:300; margin:16px 0 18px; }
        .cp-svc-dl { list-style:none; padding:0; margin:0 0 22px; }
        .cp-svc-dl li { font-size:12.5px; color:#c8c4bc; line-height:1.5; padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-family:'Space Grotesk',sans-serif; font-weight:300; display:flex; gap:10px; align-items:flex-start; }
        .cp-svc-dl li:last-child { border-bottom:none; }
        .cp-svc-dl li::before { content:"→"; color:var(--svc-accent); flex-shrink:0; font-size:11px; line-height:1.4; }
        .cp-svc-price { font-size:12.5px; color:#f0f0f0; font-family:'JetBrains Mono',monospace; margin-bottom:18px; line-height:1.5; }
        .cp-svc-foot { margin-top:auto; }
        .cp-svc-cta { display:inline-flex; align-items:center; gap:7px; font-size:11.5px; font-weight:700; letter-spacing:.04em; font-family:'Space Grotesk',sans-serif; padding:11px 18px; border:1px solid var(--svc-accent); color:var(--svc-accent); background:transparent; cursor:pointer; text-decoration:none; border-radius:2px; transition:background .15s; width:100%; justify-content:center; }
        .cp-svc-cta:hover { background:rgba(255,255,255,0.03); }

        /* ── capabilities ── */
        .cp-cap3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.06); margin-top:36px; }
        @media(max-width:880px){ .cp-cap3 { grid-template-columns:1fr 1fr; } }
        @media(max-width:560px){ .cp-cap3 { grid-template-columns:1fr; } }
        .cp-cap { background:#0a0a0a; padding:26px 24px; }
        .cp-cap-g { font-size:14px; font-weight:700; font-family:'Syne',sans-serif; letter-spacing:-.01em; color:#f0f0f0; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .cp-cap ul { list-style:none; padding:0; margin:0; }
        .cp-cap li { font-size:12.5px; color:#9a968e; line-height:1.5; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-family:'Space Grotesk',sans-serif; font-weight:300; display:flex; gap:9px; align-items:flex-start; }
        .cp-cap li:last-child { border-bottom:none; padding-bottom:0; }
        .cp-cap li::before { content:""; display:inline-block; width:3px; height:3px; border-radius:50%; background:var(--cap-accent); flex-shrink:0; margin-top:7px; }
        .cp-cap-note { margin-top:28px; font-size:11.5px; color:#707070; font-family:'JetBrains Mono',monospace; letter-spacing:.04em; line-height:1.7; }
        .cp-cap-note strong { color:#c8c4bc; font-weight:600; }

        /* ── process ── */
        .cp-steps { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:rgba(255,255,255,0.06); margin-top:36px; }
        @media(max-width:880px){ .cp-steps { grid-template-columns:1fr 1fr; } }
        @media(max-width:480px){ .cp-steps { grid-template-columns:1fr; } }
        .cp-step { padding:26px 20px; background:#000; transition:background .15s; }
        .cp-step:hover { background:#0f0f0f; }
        .cp-step-n { font-size:10px; font-weight:600; letter-spacing:.18em; color:rgba(57,217,180,.45); margin-bottom:12px; font-family:'JetBrains Mono',monospace; }
        .cp-step-t { font-size:14px; font-weight:700; color:#f0f0f0; margin-bottom:8px; font-family:'Syne',sans-serif; letter-spacing:-.01em; }
        .cp-step-b { font-size:12.5px; line-height:1.6; color:#888; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-proc-note { margin-top:26px; font-size:13px; color:#9a968e; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-proc-note em { font-style:normal; color:${T}; }

        /* ── case studies ── */
        @keyframes fade-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .cp-illus { font-size:11px; color:${AM}; font-family:'JetBrains Mono',monospace; letter-spacing:.06em; margin-top:6px; margin-bottom:24px; }
        .cp-case { border:1px solid rgba(255,255,255,0.08); margin-bottom:1px; overflow:hidden; transition:border-color .2s, background .15s; }
        .cp-case:hover { border-color:rgba(255,255,255,0.16); background:#080808; }
        .cp-case.is-open { border-color:rgba(255,255,255,0.14); background:#080808; border-left:2px solid var(--case-accent); }
        .cp-case-hd { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; cursor:pointer; gap:16px; user-select:none; }
        .cp-case-lft { display:flex; flex-direction:column; gap:3px; min-width:0; }
        .cp-ctag { font-size:9px; font-weight:700; letter-spacing:.18em; color:var(--case-accent); font-family:'JetBrains Mono',monospace; text-transform:uppercase; }
        .cp-cname { font-size:15px; font-weight:700; color:#f0f0f0; font-family:'Syne',sans-serif; letter-spacing:-.01em; line-height:1.2; }
        .cp-cta-pill { display:inline-flex; align-items:center; gap:8px; flex-shrink:0; font-size:11px; font-weight:600; letter-spacing:.04em; font-family:'Space Grotesk',sans-serif; white-space:nowrap; padding:9px 18px; border:1px solid rgba(255,255,255,.16); color:#c8c4bc; background:transparent; cursor:pointer; border-radius:2px; transition:border-color .15s; }
        .cp-cta-pill svg { transition:transform .28s cubic-bezier(.4,0,.2,1); }
        .cp-cta-pill.open svg { transform:rotate(180deg); }
        .cp-cbody { border-top:1px solid rgba(255,255,255,0.06); padding:28px 26px; animation:fade-up .25s cubic-bezier(.4,0,.2,1); display:grid; gap:16px; }
        .cp-cfield-l { font-size:9px; font-weight:700; letter-spacing:.2em; color:#707070; text-transform:uppercase; margin-bottom:7px; font-family:'JetBrains Mono',monospace; }
        .cp-cfield-v { font-size:13px; line-height:1.65; color:#c8c4bc; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-repl-line { color:${AM}; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.6; }

        /* ── about ── */
        .cp-about { font-size:15px; line-height:1.85; color:#c8c4bc; max-width:680px; font-family:'Space Grotesk',sans-serif; font-weight:300; margin-top:14px; }
        .cp-about strong { color:#f0f0f0; font-weight:600; }

        /* ── faq ── */
        .cp-faq { margin-top:30px; border-top:1px solid rgba(255,255,255,0.07); }
        .cp-faq-row { border-bottom:1px solid rgba(255,255,255,0.07); }
        .cp-faq-q { width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:20px 4px; display:flex; justify-content:space-between; align-items:center; gap:18px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#f0f0f0; letter-spacing:-.01em; }
        .cp-faq-q:hover { color:${T}; }
        .cp-faq-ic { flex-shrink:0; color:${T}; transition:transform .25s; font-family:'JetBrains Mono',monospace; font-size:18px; line-height:1; }
        .cp-faq-ic.open { transform:rotate(45deg); }
        .cp-faq-a { font-size:13.5px; line-height:1.75; color:#9a968e; font-family:'Space Grotesk',sans-serif; font-weight:300; padding:0 4px 22px; max-width:720px; animation:fade-up .25s ease; }

        /* ── final cta ── */
        .cp-final { padding:90px 0 110px; text-align:center; }
        .cp-final h2 { font-size:clamp(24px,3.4vw,40px); font-weight:800; letter-spacing:-.03em; margin-bottom:16px; font-family:'Syne',sans-serif; color:#f0f0f0; max-width:760px; margin-left:auto; margin-right:auto; line-height:1.12; }
        .cp-final p { font-size:14.5px; color:#9a968e; margin-bottom:34px; font-family:'Space Grotesk',sans-serif; font-weight:300; max-width:560px; margin-left:auto; margin-right:auto; line-height:1.7; }
        .cp-final-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

        /* ── diagnostic ── */
        .cp-dx-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:34px; }
        @media(max-width:680px){ .cp-dx-grid { grid-template-columns:1fr; } }
        .cp-dx-chip { display:flex; align-items:center; gap:12px; text-align:left; padding:16px 18px; background:#0a0a0a; border:1px solid rgba(255,255,255,0.09); border-radius:4px; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:13.5px; font-weight:400; color:#c8c4bc; transition:border-color .15s, background .15s, color .15s; }
        .cp-dx-chip:hover { border-color:rgba(57,217,180,.4); color:#f0f0f0; }
        .cp-dx-chip.on { border-color:${T}; background:rgba(57,217,180,.07); color:#f0f0f0; }
        .cp-dx-box { flex-shrink:0; width:20px; height:20px; border-radius:4px; border:1px solid rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; font-size:12px; color:#000; background:transparent; transition:all .15s; }
        .cp-dx-chip.on .cp-dx-box { background:${T}; border-color:${T}; }
        .cp-dx-go { margin-top:24px; }
        .cp-dx-go:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }

        .cp-dx-result { margin-top:28px; border:1px solid rgba(57,217,180,.25); border-radius:6px; background:#080808; padding:28px 26px; animation:fade-up .3s ease; }
        .cp-dx-result-lbl { font-size:10px; font-weight:600; letter-spacing:.22em; color:${T}; text-transform:uppercase; font-family:'JetBrains Mono',monospace; margin-bottom:18px; }
        .cp-dx-causes { list-style:none; padding:0; margin:0 0 24px; display:grid; gap:14px; }
        .cp-dx-causes li { display:flex; flex-direction:column; gap:3px; padding-left:16px; border-left:2px solid rgba(57,217,180,.3); }
        .cp-dx-causes strong { font-size:13.5px; color:#f0f0f0; font-weight:700; font-family:'Space Grotesk',sans-serif; }
        .cp-dx-causes span { font-size:13px; color:#9a968e; line-height:1.6; font-family:'Space Grotesk',sans-serif; font-weight:300; }
        .cp-dx-rec { display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; padding-top:22px; border-top:1px solid rgba(255,255,255,0.07); }
        .cp-dx-rec-k { font-size:9px; font-weight:700; letter-spacing:.2em; color:#707070; text-transform:uppercase; font-family:'JetBrains Mono',monospace; margin-bottom:6px; }
        .cp-dx-rec-t { font-size:18px; font-weight:800; color:#f0f0f0; font-family:'Syne',sans-serif; letter-spacing:-.02em; }
        .cp-dx-rec-s { font-size:12px; color:#9a968e; font-family:'Space Grotesk',sans-serif; margin-top:2px; }

        /* ── a11y focus ── */
        .cp a:focus-visible, .cp button:focus-visible { outline:2px solid ${T}; outline-offset:3px; }
      `}</style>

      <div className="cp">

        {/* ───────── HERO ───────── */}
        <section className="cp-hero" id="top">
          <div className="cp-w">
            <p className="cp-eyebrow">AI &amp; Agent Reliability Consulting</p>
            <h1 className="cp-h1">
              I make AI agents <em>production-reliable.</em>
            </h1>
            <p className="cp-hero-sub">
              Most AI agents work in the demo and break in production — drifting, hallucinating,
              or burning budget, with no evaluation layer to catch it. I&apos;m a senior AI &amp; agent
              engineer who takes agents from demo to dependable: evaluation, orchestration,
              guardrails, and cost control. Built end to end.
            </p>
            <div className="cp-cta-row">
              <a href="#consult-chat" className="cp-btn-p">Talk to my AI consultant →</a>
              <a href="/book" className="cp-btn-s">Book a call</a>
            </div>
            <div className="cp-tags">
              {["Agents", "RAG", "LLM Evaluation", "MLOps on AWS"].map(t => (
                <span key={t} className="cp-pill">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── AI CONSULTANT CHAT (centerpiece — scroll-pops to fullscreen) ───────── */}
        <section className="cp-sec" id="chat" style={{ paddingTop: 56, paddingBottom: 0 }}>
          <div className="cp-w">
            <p className="cp-sec-lbl">Talk to me first</p>
            <h2 className="cp-sec-h2">Describe your problem — see how I&apos;d help</h2>
            <p className="cp-sec-lead" style={{ marginBottom: 4 }}>
              This isn&apos;t a generic chatbot. It&apos;s a multi-agent system grounded in my actual work:
              it diagnoses your issue, matches it to something I&apos;ve already shipped when it can, and
              shows the approach I&apos;d take — then points you to the right next step.
              <br /><span style={{ color: "#5a5a5a", fontSize: 12 }}>↓ scroll — it expands to full screen, then settles back</span>
            </p>
          </div>
          <ScrollPop margin={28} track={200}>
            <ConsultingChat />
          </ScrollPop>
        </section>

        {/* ───────── AI OPPORTUNITY FINDER (free takeaway agent) ───────── */}
        <section className="cp-sec" id="opportunities">
          <div className="cp-w">
            <p className="cp-sec-lbl">Free 60-second takeaway</p>
            <h2 className="cp-sec-h2">Where AI would actually pay off for you</h2>
            <p className="cp-sec-lead">
              Tell me what your business does. A second agent finds the three highest-leverage AI
              opportunities for <em>your</em> specific operation — with rough impact, effort, and exactly
              how I&apos;d build each. Yours to keep, whether or not we work together.
            </p>
            <OpportunityFinder />
          </div>
        </section>

        {/* ───────── DIAGNOSTIC ───────── */}
        <section className="cp-sec" id="diagnose">
          <div className="cp-w">
            <p className="cp-sec-lbl">2-Minute Diagnostic</p>
            <h2 className="cp-sec-h2">What&apos;s wrong with your agent?</h2>
            <p className="cp-sec-lead">
              Tick what you&apos;re seeing. I&apos;ll show you the likely root cause and the right next step —
              then you can book a call with that context already attached.
            </p>

            <div className="cp-dx-grid">
              {SYMPTOMS.map(s => {
                const on = picked.includes(s.id);
                return (
                  <button
                    key={s.id}
                    className={`cp-dx-chip${on ? " on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggleSymptom(s.id)}
                  >
                    <span className="cp-dx-box">{on ? "✓" : ""}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {!diagnosed && (
              <button
                className="cp-btn-p cp-dx-go"
                disabled={picked.length === 0}
                onClick={() => setDiagnosed(true)}
              >
                {picked.length === 0 ? "Pick at least one above" : `Get my diagnosis (${picked.length}) →`}
              </button>
            )}

            {diagnosed && chosen.length > 0 && (
              <div className="cp-dx-result">
                <p className="cp-dx-result-lbl">Here&apos;s what&apos;s likely going on</p>
                <ul className="cp-dx-causes">
                  {chosen.map(s => (
                    <li key={s.id}>
                      <strong>{s.label}</strong>
                      <span>{s.cause}</span>
                    </li>
                  ))}
                </ul>
                <div className="cp-dx-rec">
                  <div>
                    <p className="cp-dx-rec-k">Recommended starting point</p>
                    <p className="cp-dx-rec-t">{rec?.title}</p>
                    <p className="cp-dx-rec-s">{rec?.sub}</p>
                  </div>
                  <a href={bookHref} className="cp-btn-p">{rec?.cta} →</a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ───────── PROBLEM ───────── */}
        <section className="cp-sec" id="problem">
          <div className="cp-w">
            <p className="cp-sec-lbl">The Production Gap</p>
            <h2 className="cp-sec-h2">Why agents fail after the demo</h2>
            <p className="cp-sec-lead">
              A demo proves an agent <em>can</em> do the task once. Production asks it to do the task
              ten thousand times, recover from failure, and stay cheap — and that&apos;s a different
              engineering problem entirely.
            </p>
            <div className="cp-prob-grid">
              {[
                { t: "State is lost on restart", b: "Stateless infra means a redeploy or a crash wipes conversation and task state mid-workflow. The agent forgets where it was." },
                { t: "No evaluation layer", b: "With no eval harness, regressions ship silently. A prompt tweak that quietly breaks 8% of cases goes straight to users." },
                { t: "Runaway token cost", b: "No budgets, no routing, no caching. Cost scales linearly with traffic and nobody notices until the bill arrives." },
                { t: "Orchestration can't recover", b: "A single mid-workflow failure — a timed-out tool, a malformed response — takes down the whole run with no retry or fallback path." },
                { t: "No observability", b: "When an agent misbehaves, there are no traces to explain why. You can't fix what you can't see." },
                { t: "Drift goes uncaught", b: "Model updates and shifting inputs degrade quality over time. Without monitoring, the agent gets worse and no alarm fires." },
              ].map(p => (
                <div key={p.t} className="cp-prob">
                  <p className="cp-prob-t">{p.t}</p>
                  <p className="cp-prob-b">{p.b}</p>
                </div>
              ))}
            </div>
            <div className="cp-stat">
              <p className="cp-stat-b">
                Industry data: ~86% of agent pilots never reach production scale, and evaluation now
                consumes 60–80% of dev time on serious AI teams — yet most teams have built neither
                an eval layer nor a reliability layer.
              </p>
              <span className="cp-stat-src">General industry data — not a personal claim</span>
            </div>
          </div>
        </section>

        {/* ───────── SERVICES ───────── */}
        <section className="cp-sec" id="services">
          <div className="cp-w">
            <p className="cp-sec-lbl">Engagements</p>
            <h2 className="cp-sec-h2">How I help — three ways to engage</h2>
            <p className="cp-sec-lead">
              Land with a fixed audit, expand into hardening, stay on retainer if it&apos;s working.
              Each step is scoped and priced up front.
            </p>
            <div className="cp-svc3">
              {SERVICES.map(s => (
                <div key={s.id} className="cp-svc" style={{ ["--svc-accent" as string]: s.accent }}>
                  <p className="cp-svc-kick" style={{ color: s.accent }}>{s.kicker}</p>
                  <div>
                    <span className="cp-svc-t">{s.title}</span>
                    <p className="cp-svc-sub">{s.sub}</p>
                  </div>
                  <p className="cp-svc-fmt">{s.format}</p>
                  <p className="cp-svc-body">{s.body}</p>
                  <ul className="cp-svc-dl">
                    {s.deliverables.map(d => <li key={d}>{d}</li>)}
                  </ul>
                  <div className="cp-svc-foot">
                    {/* OWNER: price strings contain $REPLACE_* placeholders — fill with real numbers before publishing. */}
                    <p className="cp-svc-price">
                      {s.price.split(/(\$REPLACE_[A-Z_]+)/).map((part, i) =>
                        part.startsWith("$REPLACE_")
                          ? <span key={i} className="cp-repl">{part}</span>
                          : <span key={i}>{part}</span>
                      )}
                    </p>
                    <a href="/book" className="cp-svc-cta">{s.cta} →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CAPABILITIES ───────── */}
        <section className="cp-sec" id="capabilities">
          <div className="cp-w">
            <p className="cp-sec-lbl">Deliverables</p>
            <h2 className="cp-sec-h2">What I actually do for you</h2>
            <p className="cp-sec-lead">
              Not adjectives — a checklist. These are the concrete artifacts that ship in an
              engagement.
            </p>
            <div className="cp-cap3">
              {CAPABILITIES.map(c => (
                <div key={c.group} className="cp-cap" style={{ ["--cap-accent" as string]: c.color }}>
                  <p className="cp-cap-g">{c.group}</p>
                  <ul>{c.items.map(it => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="cp-cap-note">
              <strong>Framework-agnostic:</strong> LangGraph · CrewAI · Strands · MCP · OpenAI / Anthropic SDKs.
              I fit your stack — no forced rewrite.
            </p>
          </div>
        </section>

        {/* ───────── PROCESS ───────── */}
        <section className="cp-sec" id="process">
          <div className="cp-w">
            <p className="cp-sec-lbl">How I Work</p>
            <h2 className="cp-sec-h2">Diagnose → design → implement → measure</h2>
            <div className="cp-steps">
              {PROCESS.map(s => (
                <div key={s.n} className="cp-step">
                  <p className="cp-step-n">{s.n}</p>
                  <p className="cp-step-t">{s.t}</p>
                  <p className="cp-step-b">{s.b}</p>
                </div>
              ))}
            </div>
            <p className="cp-proc-note">
              <em>Fixed scope. No open-ended billing.</em> Every claim is backed by measured eval
              results — before vs after, on your real traffic.
            </p>
          </div>
        </section>

        {/* ───────── CASE STUDIES ───────── */}
        <section className="cp-sec" id="case-studies">
          <div className="cp-w">
            <p className="cp-sec-lbl">Selected Work</p>
            <h2 className="cp-sec-h2">Reliability work I&apos;ve shipped</h2>
            <p className="cp-sec-lead" style={{ marginBottom: 8 }}>
              Three production systems where the hard part was making AI dependable — air-gapped,
              grounded, and fast enough to trust. Tap to expand.
            </p>
            {CASES.map(c => {
              const isOpen = openCase === c.id;
              return (
                <div
                  key={c.id}
                  className={`cp-case${isOpen ? " is-open" : ""}`}
                  style={{ ["--case-accent" as string]: c.accent }}
                >
                  <div
                    className="cp-case-hd"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => setOpenCase(isOpen ? null : c.id)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenCase(isOpen ? null : c.id); } }}
                  >
                    <div className="cp-case-lft">
                      <span className="cp-ctag">{c.vertical}</span>
                      <p className="cp-cname">{c.name}</p>
                    </div>
                    <button className={`cp-cta-pill${isOpen ? " open" : ""}`} aria-hidden="true" tabIndex={-1}>
                      {isOpen ? "Close" : "View"}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4.5L6 8l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="cp-cbody">
                      {([
                        ["Context", c.context],
                        ["Problem", c.problem],
                        ["What I did", c.did],
                        ["Result", c.result],
                      ] as const).map(([label, value]) => (
                        <div key={label}>
                          <p className="cp-cfield-l">{label}</p>
                          <p className="cp-cfield-v">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ───────── ABOUT ───────── */}
        <section className="cp-sec" id="about">
          <div className="cp-w">
            <p className="cp-sec-lbl">Who I Am</p>
            <h2 className="cp-sec-h2">Om Kumar Solanki</h2>
            <p className="cp-about">
              Senior AI / ML &amp; agent engineer, full-stack, shipping end to end across{" "}
              <strong>agents, RAG, fine-tuning, and MLOps on AWS</strong>. I specialize in the one
              place most teams get stuck: the <strong>demo → production reliability gap</strong>. I&apos;ve
              built stateful conversation engines under sub-second latency, on-premise RAG running on
              client hardware for regulated buyers, and evaluation pipelines that catch regressions
              before they ship. Direct, hands-on, senior — I write the code that fixes the problem,
              not a slideware consultancy.
            </p>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className="cp-sec" id="faq">
          <div className="cp-w">
            <p className="cp-sec-lbl">FAQ</p>
            <h2 className="cp-sec-h2">Straight answers</h2>
            <div className="cp-faq">
              {FAQ.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="cp-faq-row">
                    <button
                      className="cp-faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      {f.q}
                      <span className={`cp-faq-ic${isOpen ? " open" : ""}`}>+</span>
                    </button>
                    {isOpen && <p className="cp-faq-a">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────── FINAL CTA ───────── */}
        <section className="cp-final" id="contact">
          <div className="cp-w">
            <h2>Have an agent that works in the demo but not in production?</h2>
            <p>Start with a fixed Reliability Audit — scored failure map and a remediation roadmap in 1–2 weeks.</p>
            <div className="cp-final-btns">
              {/* OWNER: /book is your existing booking flow. Swap for a Calendly/Cal.com link if you prefer. */}
              <a href="/book" className="cp-btn-p">Book a Reliability Audit →</a>
              <a href="mailto:om@resso.ai?subject=AI%20Reliability%20Audit" className="cp-btn-s">Email me directly</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
