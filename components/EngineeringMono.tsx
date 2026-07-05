"use client";

/**
 * Engineering portfolio — monochrome professional edition.
 * Same content as the previous site, re-ordered agents-first: applied AI,
 * agent orchestration, and production systems lead; ML appears where it
 * earned its place (small, explainable models on real problems).
 *
 * Design system (shared with /consulting):
 * - Five tones only: Carbon #0A0A0C, Graphite #26262E, Steel #6E6E78,
 *   Fog #E9E9E5, Porcelain #FAFAF8. No accents, gradients, or shadows.
 * - Inter (400/500) + Geist Mono for eyebrows/annotations.
 * - 1px hairline card grids, no radius on cards, 7–8px radius on buttons only.
 */
import { useEffect, useState } from "react";
import EngAgentChat from "@/components/EngAgentChat";
import EngContactForm from "@/components/EngContactForm";
import OmMark from "@/components/OmMark";
import BrandName from "@/components/BrandName";
import SwitchLink from "@/components/SwitchLink";

const EMAIL = "hello@omkumarsolanki.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/";
const GITHUB_URL = "https://github.com/omkumarsolanki";

/* ── Hero ── */
const ROLE_TAGS = ["Applied AI Engineer", "AI Agents & Orchestration", "Founding Engineer", "Full-Stack · Cloud · MLOps"];
const METRICS = [
  { value: "3+", label: "Years production AI" },
  { value: "3", label: "Companies built" },
  { value: "<2s", label: "Inference latency" },
  { value: "0%", label: "External calls (private RAG)" },
  { value: "0.97", label: "AUC hire-scoring" },
];

/* ── Multi-agent orchestration (verbatim content) ── */
const PIPELINE_STEPS = [
  { id: "input", label: "User Task", sub: '"analyse this contract"', col: 0 },
  { id: "orch", label: "Orchestrator", sub: "plans · routes · retries", col: 1 },
  { id: "mem", label: "Memory Agent", sub: "reads session + vector store", col: 2 },
  { id: "ml", label: "ML Agent", sub: "risk scoring · classification", col: 2 },
  { id: "api", label: "Tool Agent", sub: "fetches docs · calls APIs", col: 2 },
  { id: "valid", label: "Validator", sub: "checks coherence · confidence", col: 3 },
  { id: "output", label: "Structured Output", sub: "JSON · report · action", col: 4 },
];

const WHY = [
  {
    problem: "Single LLM forgets",
    solution: "Memory Agent keeps session context short-term and retrieves long-term facts from a vector store. Agents never lose the thread.",
  },
  {
    problem: "One model can't specialise",
    solution: "Each agent is tuned for its job. An ML agent runs a fine-tuned risk model, a tool agent handles API calls. No jack-of-all-trades hallucinations.",
  },
  {
    problem: "Long tasks time out or drift",
    solution: "The orchestrator breaks work into atomic sub-tasks, runs them in parallel where possible, and retries failed nodes without re-running the whole chain.",
  },
  {
    problem: "No fault tolerance",
    solution: "A validator agent checks every agent's output before it passes downstream. Bad outputs are caught and rerouted, not silently swallowed.",
  },
];

const HOW = [
  { num: "01", title: "Define agent contracts", body: "Each agent gets a strict input/output schema. The orchestrator enforces types so no agent can accept or emit arbitrary blobs." },
  { num: "02", title: "Build the orchestrator", body: "LangGraph or a custom state machine. It holds the DAG of agent dependencies, handles branching logic, and owns retry and fallback policy." },
  { num: "03", title: "Wire the memory layer", body: "Session memory lives in Redis (fast, ephemeral). Permanent memory indexes into pgvector or Pinecone. Agents query both on every turn." },
  { num: "04", title: "Instrument every node", body: "Each agent emits spans to an observability backend (Langfuse / OTLP). I can see exactly where latency or hallucinations enter the pipeline." },
  { num: "05", title: "Harden with a validator", body: "A lightweight LLM-as-judge agent scores coherence and confidence before results leave the pipeline. Below threshold, re-route or flag for human review." },
];

const ENTERPRISE = [
  {
    firm: "Deloitte",
    label: "Human-in-the-Loop (HITL)",
    body: "Regulated industries require agents to pause and route high-risk decisions to human reviewers before action. Mandatory in Deloitte AI deployments for finance and healthcare.",
    tags: ["Azure AI Studio", "Semantic Kernel", "Approval Workflows"],
  },
  {
    firm: "Accenture",
    label: "Guardrails + PII Redaction",
    body: "Constitutional AI filters, hallucination detection, and automatic PII scrubbing on every agent output. Accenture AI Hub mandates these before any client data touches an LLM.",
    tags: ["NeMo Guardrails", "Presidio", "Azure Content Safety"],
  },
  {
    firm: "McKinsey / Big 4",
    label: "Audit Trails + Compliance",
    body: "Every agent action, tool call, and decision is logged with full trace context. SOC2, ISO 27001, and GDPR-ready architecture required across all enterprise AI platforms.",
    tags: ["Langfuse", "OpenTelemetry", "Immutable Logs"],
  },
  {
    firm: "IBM / SAP",
    label: "Enterprise Orchestration Platforms",
    body: "Large firms standardise on IBM Watson Orchestrate, AWS Bedrock Agents, or Google Vertex AI Agents for governance, cost control, and multi-model routing across business units.",
    tags: ["Watson Orchestrate", "Bedrock Agents", "Vertex AI"],
  },
];

const STACK = [
  "LangGraph", "AutoGen", "Semantic Kernel", "CrewAI",
  "Azure AI Studio", "AWS Bedrock", "Vertex AI",
  "Redis", "pgvector", "Pinecone",
  "Langfuse", "OpenTelemetry",
  "NeMo Guardrails", "FastAPI", "Docker", "Kubernetes",
];

/* ── Work (verbatim content; agentic builds lead) ── */
type Project = {
  num: string;
  title: string;
  subtitle: string;
  role: string;
  saas?: boolean;
  description: string;
  extra: string;
  impact: string;
  formula: string;
  tags: string[];
  url: string | null;
  screenshots: { src: string; label: string; arch?: string }[];
};

const EXPERIENCE_PROJECTS: Project[] = [
  {
    num: "01",
    title: "Resso.ai",
    subtitle: "Real-Time AI Interview Intelligence",
    role: "Founding Engineer",
    description:
      "Built the entire production ML platform from scratch. WebRTC audio capture at 8 kHz, speaker diarization pipeline separating candidate and interviewer voices in real time, NLP feature extraction across prosody, semantics and pace, and live hire-probability scoring — all streaming inference at sub-2-second latency during a live interview. The AI rates conversations as they happen, not after.",
    extra:
      "Designed the talking AI avatar system: lip-sync audio-to-viseme mapping, WebSocket event bus, and on-device model quantisation for smooth real-time video rendering. The system processes every spoken word into actionable structured signals.",
    impact: "Inference latency: 8s → <2s · Job placement rate +45% · Live during interview",
    formula: "P(hire | audio, transcript, t) = σ(Wₜhₜ + b)",
    tags: ["PyTorch", "WebRTC", "Speaker Diarization", "NLP", "Docker", "AWS", "MLOps", "ONNX"],
    url: "https://www.resso.ai",
    screenshots: [
      { src: "/images/portfolio/resso.png", label: "Resso.ai — Real-time interview scoring platform", arch: "WebRTC · PyTorch · ONNX · AWS" },
    ],
  },
  {
    num: "02",
    title: "Corol.org & NunaFab",
    subtitle: "UHPC Strength Prediction · Small, Explainable ML for Structural Engineering",
    role: "ML Engineer",
    description:
      "Ultra-High Performance Concrete (UHPC) meets machine learning. Working with Corol.org and NunaFab, I built compressive strength prediction models for UHPC mix designs — telling structural engineers not just what mix achieves target strength, but WHY each constituent (water-cement ratio, silica fume, fibre dosage, curing age) drives the outcome. The dataset was only 200 rows. Transfer learning from related concrete domains, aggressive feature engineering, and an SHAP-explainable gradient-boosting ensemble got R² to 0.89.",
    extra:
      "SHAP attribution made the model interpretable: engineers saw exact feature impact values (φᵢ) for each mix ingredient — silica fume contribution, fibre reinforcement effect, W/C ratio influence. Reduced physical lab testing cycles from weeks to a single afternoon. Screened hundreds of UHPC formulations computationally before any concrete was poured.",
    impact: "Lab cycles: weeks → one afternoon · 100s of mixes screened computationally · R² = 0.89 · SHAP-explainable",
    formula: "ŷ = Σ wₖfₖ(X) + ε     SHAP: φᵢ = E[f(X)|Xᵢ] − E[f(X)]",
    tags: ["SHAP", "XGBoost", "Scikit-learn", "Transfer Learning", "Ensemble", "Feature Engineering"],
    url: "https://www.corol.org",
    screenshots: [
      { src: "/images/portfolio/uhpc.png", label: "UHPC formulation prediction platform", arch: "XGBoost · SHAP attribution · R²=0.89" },
    ],
  },
];

const PERSONAL_PROJECTS: Project[] = [
  {
    num: "01",
    title: "MCP Integration Server",
    subtitle: "Universal Agentic Tool Layer",
    role: "Builder",
    description:
      "Every enterprise tool lives in a silo — Slack, CRMs, databases, internal APIs. AI agents need one standard to speak to all of them. I built a production MCP (Model Context Protocol) server that acts as the universal backbone. Write one integration, reach everything. The agent calls MCP; MCP speaks to the world. This is how agentic behaviour is triggered in real-world systems: LLM receives context → determines tool needed → MCP routes call → returns structured result → LLM continues reasoning.",
    extra:
      "Built multi-tool orchestration: parallel tool calls, retry logic, structured output parsing, and context memory integration so agents remember previous tool results across a session.",
    impact: "One server · N integrations · Agentic pipelines with persistent context memory",
    formula: "Agent(t) → [LLM + context] → MCP → {toolₙ} → structured_result → LLM",
    tags: ["MCP Protocol", "TypeScript", "Node.js", "Tool Use", "Agentic AI", "Context Memory"],
    url: null,
    screenshots: [],
  },
  {
    num: "02",
    title: "Lawline.tech",
    subtitle: "Privilege-Compliant Legal AI · Live SaaS · Air-Gapped RAG",
    role: "AI Engineer",
    saas: true,
    description:
      "Built the AI core for Lawline.tech — a Canadian legal research platform serving attorneys who cannot use any cloud AI due to attorney-client privilege. Built a fully local RAG stack: HNSW vector store over Canadian legal corpora, BGE cross-encoder reranker, GGUF-quantized local LLM — zero data ever leaves the office. Sub-4% hallucination rate on legal eval sets, now in enterprise licensing discussions.",
    extra:
      "Designed the full pipeline: PDF ingestion → semantic chunking (512-token, 128 overlap) → local embeddings → HNSW index → top-K reranked retrieval → GGUF LLM response. Built confidence-gated output: low-confidence answers route to human review instead of surfacing to attorneys. The architecture became the sales pitch — attorneys demo'd the zero-outbound-packets screen to their law society contacts.",
    impact: "Sub-4% hallucination · Air-gapped · 0 bytes leave the office · Privilege-compliant",
    formula: "E(doc) = LLM(top-k(HNSW(chunk)) + clause_template) → {party, obligation, risk, date}",
    tags: ["Legal AI", "Fine-tuning", "Document Parsing", "HNSW", "FastAPI", "TypeScript", "ONNX"],
    url: "https://lawline.tech",
    screenshots: [
      { src: "/images/portfolio/lawline.png", label: "Lawline.tech — Live SaaS product", arch: "Fine-tuned LLM · HNSW · FastAPI" },
    ],
  },
  {
    num: "03",
    title: "Vadtal — Vector DB Platform",
    subtitle: "On-Premise RAG · Private AI · Zero Data Egress",
    role: "AI Architect",
    description:
      "A religious organisation managing thousands of donors needed AI search but couldn't send a single byte to the cloud. I designed and built a complete on-premise RAG stack for Vadtal: quantized LLM running on 16 GB RAM using GGUF format, a custom HNSW vector store with semantic chunking and metadata filtering, cosine similarity scoring, and a FastAPI inference server. Everything — embedding, retrieval, generation — runs locally.",
    extra:
      "Built the full RAG pipeline: document ingestion → semantic chunking → embedding (local model) → HNSW index → top-k retrieval with cosine similarity → context injection → LLM response. Sub-1s end-to-end query latency, 100% private, works offline.",
    impact: "Sub-1s queries · 100% private · Fully offline · 16 GB RAM footprint",
    formula: "R(q) = top-k(cosine(E(q), Eᵢ)) → LLM(prompt + context)",
    tags: ["Local LLM", "GGUF", "HNSW", "Vector DB", "ONNX", "FastAPI", "Semantic Chunking"],
    url: null,
    screenshots: [],
  },
  {
    num: "04",
    title: "Lost and Found",
    subtitle: "Transit-Scale Lost & Found · AI Similarity Matching",
    role: "Full-Stack Engineer",
    description:
      "Built a complete digital Lost & Found system designed for a major North American transit network at 1.7M-daily-rider scale. The platform digitizes the entire claim lifecycle: staff report found items via a mobile app, each item gets a unique QR-tagged scan record, and owners submit claims through a mobile-first portal. An AI similarity-matching engine connects found items to incoming claims using description embeddings.",
    extra:
      "Full pipeline: mobile item reporting → QR generation → owner claim portal → AI description similarity matching → staff approval dashboard. Built for real operational constraints — works on spotty transit WiFi, handles hundreds of daily items, fully auditable claim history. Production-ready architecture, not a school demo.",
    impact: "Full claim lifecycle · AI item matching · 1.7M-rider scale · Mobile-first",
    formula: "match(claim, item) = cosine(E(desc_claim), E(desc_item)) > θ → notify_owner",
    tags: ["Next.js", "TypeScript", "AI Matching", "QR Code", "Mobile-First", "PostgreSQL", "FastAPI"],
    url: null,
    screenshots: [
      { src: "/images/portfolio/LostAndFound.png", label: "TTC Lost & Found — System overview", arch: "Full-stack · AI similarity matching engine" },
    ],
  },
];

/* ── Process (verbatim) ── */
const PROCESS_STEPS = [
  {
    num: "01",
    title: "Diagnose",
    sub: "Week 1",
    body: "I sit with your team, map the actual problem against what you think the problem is, and identify the root cause. No solution proposed until I can write a one-paragraph problem statement you fully agree with.",
    tags: ["Stakeholder interviews", "System audit", "Root cause analysis"],
  },
  {
    num: "02",
    title: "Scope",
    sub: "Week 1-2",
    body: "I write a Statement of Work with a fixed deliverable, success metric, and timeline. You know exactly what you're getting and how you'll know if it worked — before a single line of code is written.",
    tags: ["SoW", "Success metrics", "Risk register"],
  },
  {
    num: "03",
    title: "Build",
    sub: "Week 2-6",
    body: "I ship in weekly increments. Each Friday you get a working demo, not a slide. Every agent, model, or API is tested in an environment that mirrors production — not a notebook.",
    tags: ["Weekly demos", "CI/CD from day 1", "Real data testing"],
  },
  {
    num: "04",
    title: "Harden",
    sub: "Week 6-8",
    body: "Guardrails, observability, and load testing before anything touches your users. I instrument every pipeline node so you can see latency, error rates, and model drift without calling me.",
    tags: ["Observability", "Guardrails", "Load testing"],
  },
  {
    num: "05",
    title: "Transfer",
    sub: "Week 8+",
    body: "I document everything, train your team, and hand over a codebase your engineers can own. The goal is for you to not need me — and for the system to keep working after I leave.",
    tags: ["Runbooks", "Team training", "Clean handoff"],
  },
];

/* ── About (verbatim) ── */
const ABOUT_EXPERIENCE = [
  {
    company: "Resso.ai",
    url: "https://www.resso.ai",
    role: "Founding Engineer — AI, ML & Real-Time Systems",
    period: "Nov 2025 — Present",
    highlight: true,
    description:
      "Designed and built the entire AI platform from zero: WebRTC audio ingestion at 8 kHz, custom speaker diarization pipeline separating candidate and interviewer in real time, NLP feature extraction across prosody and semantics, and a live hire-probability scoring model at <2s inference latency. Built the talking AI avatar system — lip-sync via audio-to-viseme mapping, on-device model quantisation, and WebSocket event bus for real-time video rendering. Every word spoken becomes structured signals. Every interview is scored live.",
  },
  {
    company: "HariKrushna Software",
    url: null,
    role: "AI Architect & Agentic Software Engineer",
    period: "Jun 2024 — Present",
    highlight: false,
    description:
      "Consulting on production AI architecture for enterprise clients across HR tech, compliance, and materials science. Delivered: on-premise RAG stacks (GGUF + HNSW, 100% private, offline-capable), MCP server integrations bridging AI agents to enterprise APIs (Slack, CRMs, databases), and multi-agent orchestration pipelines with persistent context memory. Work spans the full agentic stack — from LLM reasoning loops and tool dispatch, to MLOps and drift detection.",
  },
  {
    company: "Corol.org & NunaFab",
    url: "https://www.corol.org",
    role: "ML Engineer — UHPC Strength Prediction",
    period: "2024",
    highlight: false,
    description:
      "Applied ML to Ultra-High Performance Concrete (UHPC) compressive strength prediction. Built SHAP-explainable XGBoost ensemble models on a 200-row dataset — showing structural engineers not just which mix achieves target strength, but which constituents drive the outcome (W/C ratio, silica fume, fibre dosage, curing age — φᵢ values per ingredient). Transfer learning + aggressive feature engineering got R² = 0.89. Extended to NunaFab's structural composite formulations. Result: physical lab testing cycles cut from weeks to one afternoon, hundreds of mixes screened computationally.",
  },
];

const SKILLS = [
  "Python", "TypeScript", "React", "Next.js", "Node.js",
  "PyTorch", "TensorFlow", "Scikit-learn",
  "AWS", "Docker", "Kubernetes", "MLflow",
  "FastAPI", "PostgreSQL", "Redis", "Vector DBs",
  "WebRTC", "RAG", "MCP", "ONNX",
];

const CAPABILITIES = [
  "Multi-agent systems that automate business workflows",
  "Private RAG: your data stays on your servers",
  "Full product — backend, frontend, and the AI layer",
  "Real-time ML inference — <2s end-to-end",
  "MLOps: monitoring, drift detection, auto-retrain pipelines",
  "Cloud infra that scales without breaking (AWS/GCP/Azure)",
];

const EDUCATION = [
  { school: "Sheridan College", degree: "BASc — Artificial Intelligence (Honours)", note: "AI Minds Board Member, Sheridan EDGE" },
  { school: "AWS Academy", degree: "Cloud Developing Graduate", note: "Dec 2025" },
];

/* ── Pipeline diagram (restrained active-step cycle, no glow) ── */
function PipelineDiagram() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % PIPELINE_STEPS.length), 1100);
    return () => clearInterval(id);
  }, []);

  const cols: Record<number, typeof PIPELINE_STEPS> = {};
  PIPELINE_STEPS.forEach(s => { (cols[s.col] = cols[s.col] || []).push(s); });

  return (
    <div className="em-pipe-scroll">
      <div className="em-pipe">
        {[0, 1, 2, 3, 4].map((col, ci) => (
          <div className="em-pipe-col-wrap" key={col}>
            <div className="em-pipe-col">
              {cols[col]?.map(step => {
                const idx = PIPELINE_STEPS.findIndex(s => s.id === step.id);
                const isActive = idx === active;
                const isDone = idx < active;
                return (
                  <div key={step.id} className={`em-pipe-node${isActive ? " on" : ""}${isDone ? " done" : ""}`}>
                    <div className="em-pipe-t">{step.label}</div>
                    <div className="em-pipe-s">{step.sub}</div>
                  </div>
                );
              })}
            </div>
            {ci < 4 && <div className="em-pipe-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="em-proj">
      <div className="em-proj-head">
        <span className="em-proj-num">{p.num}</span>
        <div className="em-proj-id">
          <div className="em-proj-titlerow">
            <h3 className="em-proj-title">{p.title}</h3>
            <span className="em-proj-role">{p.role}</span>
            {p.saas && <span className="em-proj-live">Live SaaS</span>}
          </div>
          <div className="em-proj-sub">{p.subtitle}</div>
        </div>
        {p.url && (
          <a className="em-tlink" href={p.url} target="_blank" rel="noopener noreferrer">Visit →</a>
        )}
      </div>
      <div className="em-proj-formula">{p.formula}</div>
      {p.screenshots.length > 0 && (
        <div className="em-proj-shots">
          {p.screenshots.map((img, idx) => (
            <figure className="em-shot" key={idx}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.label} loading="lazy" />
              <figcaption>
                <span>{img.label}</span>
                {img.arch && <span className="em-shot-arch">{img.arch}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <p className="em-proj-desc">{p.description}</p>
      <p className="em-proj-extra">{p.extra}</p>
      <div className="em-proj-impact">{p.impact}</div>
      <div className="em-tags">
        {p.tags.map(t => <span className="em-tag" key={t}>{t}</span>)}
      </div>
    </article>
  );
}

export default function EngineeringMono() {
  return (
    <div className="em" id="hero">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .em { font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue','Inter',sans-serif;
          font-optical-sizing:auto;
          color:#0A0A0C; background:#FAFAF8; -webkit-font-smoothing:antialiased;
          text-rendering:optimizeLegibility; }
        .em *, .em *::before, .em *::after { box-sizing:border-box; }
        .em a { text-decoration:none; }
        .em ::selection { background:#26262E; color:#FAFAF8; }
        .em h1, .em h2, .em h3 { text-wrap:balance; margin:0; }
        .em p { text-wrap:pretty; }
        .em-w { max-width:1100px; margin:0 auto; padding:0 32px; }

        .em-eyebrow { font-family:'Geist Mono',monospace; font-size:11px; font-weight:400;
          letter-spacing:0.22em; text-transform:uppercase; color:#6E6E78; }
        .em-h2 { margin-top:24px; font-size:42px; font-weight:600; letter-spacing:-0.028em;
          line-height:1.12; color:#0A0A0C; }
        .em-intro { margin:30px 0 0; font-size:18px; font-weight:400; line-height:1.7;
          color:#26262E; max-width:720px; }
        .em-sec { background:#FAFAF8; }
        .em-sec.hairline { border-bottom:1px solid #E9E9E5; }
        .em-sec-in { max-width:1100px; margin:0 auto; padding:120px 32px; }
        .em-dark { background:#0A0A0C; }
        .em-dark .em-h2 { color:#FAFAF8; }

        /* Buttons & text links */
        .em-btn { display:inline-block; font-size:15px; font-weight:500; color:#0A0A0C;
          background:#FAFAF8; padding:14px 26px; border-radius:8px; transition:background 0.15s; }
        .em-btn:hover { background:#E9E9E5; }
        .em-btn.inv { color:#FAFAF8; background:#0A0A0C; }
        .em-btn.inv:hover { background:#26262E; }
        .em-tlink { font-size:14px; font-weight:500; color:#6E6E78; transition:color 0.15s; }
        .em-tlink:hover { color:#0A0A0C; }

        /* ── Nav ── */
        .em-nav { position:sticky; top:0; z-index:100; background:#0A0A0C; border-bottom:1px solid #26262E; }
        .em-nav-in { max-width:1100px; margin:0 auto; padding:0 32px; height:64px;
          display:flex; align-items:center; justify-content:space-between; }
        .em-brand { display:flex; align-items:center; gap:11px; font-size:17px;
          font-weight:600; letter-spacing:-0.015em; color:#FAFAF8; }
        .em-nav-r { display:flex; align-items:center; gap:26px; }
        .em-nav-link { font-size:14px; font-weight:400; color:#6E6E78; transition:color 0.15s; }
        .em-nav-link:hover { color:#FAFAF8; }
        .em-nav-cta { font-size:14px; font-weight:500; color:#0A0A0C; background:#FAFAF8;
          padding:9px 18px; border-radius:7px; transition:background 0.15s; }
        .em-nav-cta:hover { background:#E9E9E5; }

        /* ── Hero ── */
        .em-hero { background:#0A0A0C; }
        .em-hero-in { max-width:1100px; margin:0 auto; padding:104px 32px 88px; }
        .em-avail { display:flex; align-items:center; gap:10px; font-family:'Geist Mono',monospace;
          font-size:10.5px; letter-spacing:0.16em; text-transform:uppercase; color:#6E6E78; }
        .em-avail::before { content:""; width:5px; height:5px; background:#FAFAF8; }
        .em-h1 { margin-top:28px; font-size:64px; font-weight:600; letter-spacing:-0.032em;
          line-height:1.05; color:#FAFAF8; }
        .em-h1 .dim { color:#6E6E78; }
        .em-role { margin-top:22px; font-family:'Geist Mono',monospace; font-size:11px;
          letter-spacing:0.18em; text-transform:uppercase; color:#6E6E78; }
        .em-role b { font-weight:400; color:#FAFAF8; }
        .em-hero-sub { margin:26px 0 0; font-size:18px; font-weight:400; line-height:1.7;
          color:#6E6E78; max-width:560px; }
        .em-hero-tags { margin-top:26px; display:flex; flex-wrap:wrap; gap:8px; }
        .em-hero-tag { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em;
          text-transform:uppercase; color:#6E6E78; border:1px solid #26262E; padding:6px 12px; }
        .em-hero-cta { margin-top:40px; display:flex; align-items:center; gap:28px; flex-wrap:wrap; }
        .em-hero-link { font-size:15px; font-weight:500; color:#FAFAF8; opacity:0.9; transition:opacity 0.15s; }
        .em-hero-link:hover { opacity:0.6; }

        .em-metrics { border-top:1px solid #26262E; }
        .em-metrics-in { max-width:1100px; margin:0 auto; padding:0 32px;
          display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:#26262E; }
        .em-metric { background:#0A0A0C; padding:26px 20px 30px; }
        .em-metric-v { font-size:32px; font-weight:500; letter-spacing:-0.03em; color:#FAFAF8; }
        .em-metric-l { margin-top:8px; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.12em; text-transform:uppercase; color:#6E6E78; line-height:1.5; }

        /* ── Hairline grids ── */
        .em-grid { margin-top:56px; display:grid; gap:1px; background:#E9E9E5; border:1px solid #E9E9E5; }
        .em-grid.dark { background:#26262E; border-color:#26262E; }

        /* ── Orchestration (dark) ── */
        .em-pipe-box { margin-top:56px; border:1px solid #26262E; padding:28px; }
        .em-pipe-label { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; margin-bottom:22px; }
        .em-pipe-scroll { overflow-x:auto; }
        .em-pipe { display:flex; align-items:center; min-width:640px; }
        .em-pipe-col-wrap { display:flex; align-items:center; flex:1; }
        .em-pipe-col { display:flex; flex-direction:column; gap:8px; flex:1; }
        .em-pipe-node { border:1px solid #26262E; padding:12px 14px; transition:border-color 0.3s, background 0.3s; }
        .em-pipe-node.on { border-color:#FAFAF8; }
        .em-pipe-node.done { border-color:#6E6E78; }
        .em-pipe-t { font-size:14px; font-weight:500; color:#FAFAF8; }
        .em-pipe-s { margin-top:4px; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.06em; color:#6E6E78; }
        .em-pipe-arrow { width:36px; flex-shrink:0; text-align:center; color:#6E6E78; font-size:14px; }

        .em-cols { margin-top:72px; display:grid; grid-template-columns:1fr 1fr; gap:60px 80px; }
        .em-col-label { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; padding-bottom:14px; border-bottom:1px solid #26262E; }
        .em-why-row { padding:20px 0; border-bottom:1px solid #26262E; }
        .em-why-row:last-child { border-bottom:none; }
        .em-why-p { font-size:16px; font-weight:500; color:#FAFAF8; }
        .em-why-s { margin:8px 0 0; font-size:15px; line-height:1.65; color:#6E6E78; }
        .em-how-step { display:flex; gap:18px; padding:18px 0; border-bottom:1px solid #26262E; }
        .em-how-step:last-child { border-bottom:none; }
        .em-how-num { font-family:'Geist Mono',monospace; font-size:11px; color:#6E6E78; flex-shrink:0;
          padding-top:3px; width:24px; }
        .em-how-t { font-size:16px; font-weight:500; color:#FAFAF8; }
        .em-how-b { margin:6px 0 0; font-size:15px; line-height:1.65; color:#6E6E78; }

        .em-firm { background:#0A0A0C; padding:28px; }
        .em-firm-f { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .em-firm-t { margin-top:16px; font-size:17px; font-weight:500; letter-spacing:-0.01em;
          color:#FAFAF8; line-height:1.3; }
        .em-firm-b { margin:12px 0 0; font-size:14.5px; line-height:1.65; color:#6E6E78; }
        .em-tags { margin-top:16px; display:flex; flex-wrap:wrap; gap:6px; }
        .em-tag { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.06em;
          padding:4px 10px; border:1px solid #26262E; color:#6E6E78; }
        .em-sec:not(.em-dark) .em-tag { border-color:#E9E9E5; }
        .em-stack { margin-top:48px; border:1px solid #26262E; padding:24px 28px;
          display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .em-stack-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; margin-right:10px; }

        /* ── Work ── */
        .em-subhead { margin-top:64px; display:flex; align-items:baseline; gap:16px;
          border-bottom:1px solid #E9E9E5; padding-bottom:14px; }
        .em-subhead:first-of-type { margin-top:56px; }
        .em-subhead-l { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .em-subhead-r { margin-left:auto; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.1em; text-transform:uppercase; color:#6E6E78; }
        .em-proj { border:1px solid #E9E9E5; padding:36px; margin-top:24px; background:#FAFAF8; }
        .em-proj-head { display:flex; align-items:flex-start; gap:24px; flex-wrap:wrap; }
        .em-proj-num { font-family:'Geist Mono',monospace; font-size:12px; color:#6E6E78; padding-top:6px; }
        .em-proj-id { flex:1; min-width:220px; }
        .em-proj-titlerow { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .em-proj-title { font-size:22px; font-weight:500; letter-spacing:-0.015em; color:#0A0A0C; }
        .em-proj-role { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em;
          text-transform:uppercase; color:#6E6E78; border:1px solid #E9E9E5; padding:4px 10px; }
        .em-proj-live { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em;
          text-transform:uppercase; color:#FAFAF8; background:#0A0A0C; padding:4px 10px; }
        .em-proj-sub { margin-top:8px; font-family:'Geist Mono',monospace; font-size:11px;
          letter-spacing:0.08em; text-transform:uppercase; color:#6E6E78; }
        .em-proj-formula { margin-top:20px; font-family:'Geist Mono',monospace; font-size:12px;
          color:#6E6E78; overflow-x:auto; white-space:nowrap; padding-bottom:4px; }
        .em-proj-shots { margin-top:20px; display:flex; gap:12px; overflow-x:auto; padding-bottom:6px; }
        .em-shot { margin:0; flex-shrink:0; width:320px; border:1px solid #E9E9E5; }
        .em-shot img { width:100%; height:180px; object-fit:cover; display:block;
          filter:grayscale(1); transition:filter 0.3s; }
        .em-shot:hover img { filter:grayscale(0); }
        .em-shot figcaption { padding:12px 14px; border-top:1px solid #E9E9E5; }
        .em-shot figcaption span { display:block; font-size:13px; color:#26262E; }
        .em-shot .em-shot-arch { margin-top:4px; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.06em; color:#6E6E78; }
        .em-proj-desc { margin:22px 0 0; font-size:15.5px; line-height:1.7; color:#26262E; max-width:760px; }
        .em-proj-extra { margin:16px 0 0; font-size:14.5px; line-height:1.7; color:#6E6E78;
          max-width:760px; border-left:1px solid #E9E9E5; padding-left:18px; }
        .em-proj-impact { margin-top:20px; font-family:'Geist Mono',monospace; font-size:11px;
          letter-spacing:0.08em; text-transform:uppercase; color:#0A0A0C;
          border:1px solid #E9E9E5; padding:12px 16px; }

        /* ── Process (dark) ── */
        .em-step { background:#0A0A0C; padding:32px 28px 36px; }
        .em-step-n { font-family:'Geist Mono',monospace; font-size:12px; color:#6E6E78; }
        .em-step-w { margin-top:6px; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.12em; text-transform:uppercase; color:#6E6E78; }
        .em-step-t { margin-top:18px; font-size:19px; font-weight:500; letter-spacing:-0.01em; color:#FAFAF8; }
        .em-step-b { margin:14px 0 0; font-size:14.5px; font-weight:400; line-height:1.65; color:#6E6E78; }

        /* ── About ── */
        .em-about { display:grid; grid-template-columns:0.8fr 1.2fr; gap:72px; align-items:start; margin-top:56px; }
        .em-photo-card { border:1px solid #E9E9E5; padding:24px; }
        .em-photo { width:100%; aspect-ratio:4/5; object-fit:cover; object-position:center 65%;
          display:block; filter:grayscale(1); transition:filter 0.3s; }
        .em-photo:hover { filter:grayscale(0); }
        .em-photo-links { margin-top:20px; padding-top:18px; border-top:1px solid #E9E9E5;
          display:flex; flex-direction:column; gap:10px; }
        .em-photo-links a, .em-photo-links span { font-size:14px; color:#6E6E78; }
        .em-photo-links a { font-weight:500; transition:color 0.15s; }
        .em-photo-links a:hover { color:#0A0A0C; }
        .em-bio { margin:0; font-size:17px; line-height:1.7; color:#26262E; }
        .em-label { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .em-edu-row { padding:16px 0; border-bottom:1px solid #E9E9E5; }
        .em-edu-school { font-size:16px; font-weight:500; color:#0A0A0C; }
        .em-edu-line { margin-top:4px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .em-edu-deg { font-size:14.5px; color:#26262E; }
        .em-edu-note { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.08em;
          text-transform:uppercase; color:#6E6E78; }
        .em-exp-row { padding:28px 0; border-bottom:1px solid #E9E9E5; display:grid;
          grid-template-columns:1fr auto; gap:20px; align-items:start; }
        .em-exp-company { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .em-exp-company a, .em-exp-company .plain { font-size:18px; font-weight:500; color:#0A0A0C;
          transition:color 0.15s; }
        .em-exp-company a:hover { color:#6E6E78; }
        .em-exp-active { font-family:'Geist Mono',monospace; font-size:9.5px; letter-spacing:0.14em;
          text-transform:uppercase; color:#FAFAF8; background:#0A0A0C; padding:3px 9px; }
        .em-exp-role { margin-top:6px; font-family:'Geist Mono',monospace; font-size:11px;
          letter-spacing:0.08em; text-transform:uppercase; color:#6E6E78; }
        .em-exp-desc { margin:14px 0 0; font-size:15px; line-height:1.7; color:#26262E; max-width:680px; }
        .em-exp-period { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.08em;
          text-transform:uppercase; color:#6E6E78; white-space:nowrap; padding-top:6px; }
        .em-two-col { margin-top:64px; display:grid; grid-template-columns:1fr 1fr; gap:64px; }
        .em-cap-row { padding:13px 0; border-bottom:1px solid #E9E9E5; font-size:15px; color:#26262E; }
        .em-cap-row:last-child { border-bottom:none; }

        /* ── Contact (dark) ── */
        .em-contact-in { max-width:760px; margin:0 auto; padding:140px 32px 96px; text-align:center; }
        .em-contact-h2 { margin-top:24px; font-size:46px; font-weight:600; letter-spacing:-0.028em;
          line-height:1.12; color:#FAFAF8; }
        .em-contact-sub { margin:26px auto 0; font-size:17px; line-height:1.7; color:#6E6E78; max-width:460px; }
        .em-anchors { margin:44px 0 48px; display:flex; justify-content:center; gap:48px; flex-wrap:wrap; }
        .em-anchor-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .em-anchor-v { display:block; margin-top:8px; font-size:15px; font-weight:500; color:#FAFAF8;
          transition:opacity 0.15s; }
        a.em-anchor-v:hover { opacity:0.6; }
        .em-foot { margin-top:72px; padding-top:26px; border-top:1px solid #26262E;
          display:flex; flex-direction:column; gap:14px; align-items:center; }
        .em-foot-links { display:flex; gap:28px; flex-wrap:wrap; justify-content:center; }
        .em-foot-links a { font-size:14px; color:#FAFAF8; opacity:0.85; transition:opacity 0.15s; }
        .em-foot-links a:hover { opacity:0.5; }
        .em-foot-c { font-size:13px; color:#6E6E78; }

        .em a:focus-visible, .em button:focus-visible { outline:1px solid #6E6E78; outline-offset:3px; }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .em-nav-link { display:none; }
          .em-h1 { font-size:44px; }
          .em-h2 { font-size:32px; }
          .em-contact-h2 { font-size:34px; }
          .em-hero-in { padding:72px 32px 64px; }
          .em-sec-in { padding:88px 32px; }
          .em-metrics-in { grid-template-columns:repeat(2,1fr); }
          .em-cols { grid-template-columns:1fr; gap:48px; }
          .em-about { grid-template-columns:1fr; gap:48px; }
          .em-photo-card { max-width:340px; }
          .em-two-col { grid-template-columns:1fr; gap:48px; }
          .em-exp-row { grid-template-columns:1fr; gap:8px; }
          .em-proj { padding:28px 24px; }
        }
        @media (max-width: 600px) {
          .em-w, .em-nav-in, .em-hero-in, .em-sec-in, .em-metrics-in, .em-contact-in
            { padding-left:24px; padding-right:24px; }
          .em-h1 { font-size:38px; }
          .em-metrics-in { grid-template-columns:1fr; }
          .em-anchors { gap:28px; }
        }
        .em-grid.c2 { grid-template-columns:1fr 1fr; }
        .em-grid.c4 { grid-template-columns:repeat(4,1fr); }
        .em-grid.c5 { grid-template-columns:repeat(5,1fr); }
        @media (max-width: 960px) {
          .em-grid.c2, .em-grid.c4, .em-grid.c5 { grid-template-columns:1fr 1fr; }
        }
        @media (max-width: 600px) {
          .em-grid.c2, .em-grid.c4, .em-grid.c5 { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ============ Nav ============ */}
      <div className="em-nav">
        <div className="em-nav-in">
          <a href="/" className="em-brand">
            <OmMark size={26} ink="#FAFAF8" sw={1.4} dot={2.1} animate />
            <BrandName />
          </a>
          <div className="em-nav-r">
            <a className="em-nav-link" href="#agents">Agents</a>
            <a className="em-nav-link" href="#work">Work</a>
            <a className="em-nav-link" href="#process">Process</a>
            <a className="em-nav-link" href="#about">About</a>
            <a className="em-nav-link" href="/resume">Resume</a>
            <SwitchLink href="/consulting" label="Consulting" />
            <a className="em-nav-cta" href="#contact">Hire me</a>
          </div>
        </div>
      </div>

      {/* ============ Hero ============ */}
      <div className="em-hero">
        <div className="em-hero-in">
          <div className="em-avail">Available · Founding engineer roles &amp; AI consulting</div>
          <h1 className="em-h1">
            Omkumar Solanki.<br />
            <span className="dim">AI agents, shipped to production.</span>
          </h1>
          <div className="em-role"><b>Founding Engineer @ Resso.ai</b> · Applied AI architect</div>
          <p className="em-hero-sub">
            I take a business problem, build the AI system that solves it, and hand it off
            running in production. Autonomous agent networks, multi-agent orchestration,
            on-premise RAG, real-time inference — end-to-end, every layer owned.
          </p>
          <div className="em-hero-tags">
            {ROLE_TAGS.map(t => <span className="em-hero-tag" key={t}>{t}</span>)}
          </div>
          <div className="em-hero-cta">
            <a className="em-btn" href="#contact">Hire me</a>
            <a className="em-hero-link" href="#work">See my work →</a>
            <a className="em-hero-link" href="/resume" target="_blank" rel="noopener noreferrer">Resume →</a>
          </div>
        </div>
        <div className="em-metrics">
          <div className="em-metrics-in">
            {METRICS.map(m => (
              <div className="em-metric" key={m.label}>
                <div className="em-metric-v">{m.value}</div>
                <div className="em-metric-l">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Multi-agent orchestration (dark) ============ */}
      <div id="agents" className="em-dark">
        <div className="em-sec-in">
          <div className="em-eyebrow">Multi-agent orchestration</div>
          <h2 className="em-h2">Why one LLM isn&apos;t enough. How I architect the alternative.</h2>
          <p className="em-intro" style={{ color: "#6E6E78" }}>
            I build pipelines where specialised agents plan, remember, predict, and validate
            in concert. Reliable AI products, not fragile demos. Industry-standard architecture
            used at Deloitte, Accenture, and McKinsey.
          </p>

          <div className="em-pipe-box">
            <div className="em-pipe-label">Pipeline trace — task execution flow</div>
            <PipelineDiagram />
          </div>

          <div className="em-cols">
            <div>
              <div className="em-col-label">Why multi-agent</div>
              {WHY.map(w => (
                <div className="em-why-row" key={w.problem}>
                  <div className="em-why-p">{w.problem}</div>
                  <p className="em-why-s">{w.solution}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="em-col-label">How I build them</div>
              {HOW.map(h => (
                <div className="em-how-step" key={h.num}>
                  <span className="em-how-num">{h.num}</span>
                  <div>
                    <div className="em-how-t">{h.title}</div>
                    <p className="em-how-b">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 72 }}>
            <div className="em-col-label" style={{ borderBottom: "none", paddingBottom: 0 }}>
              Industry-standard patterns used at top-tier firms
            </div>
            <div className="em-grid c2 dark" style={{ marginTop: 28 }}>
              {ENTERPRISE.map(e => (
                <div className="em-firm" key={e.firm}>
                  <div className="em-firm-f">{e.firm}</div>
                  <div className="em-firm-t">{e.label}</div>
                  <p className="em-firm-b">{e.body}</p>
                  <div className="em-tags">
                    {e.tags.map(t => <span className="em-tag" key={t}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="em-stack">
            <span className="em-stack-l">Full stack</span>
            {STACK.map(t => <span className="em-tag" key={t}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* ============ Work ============ */}
      <div id="work" className="em-sec hairline">
        <div className="em-sec-in">
          <div className="em-eyebrow">Experience &amp; projects</div>
          <h2 className="em-h2">Production AI systems. Real companies.</h2>
          <p className="em-intro">
            Every system here runs in the real world — with real users, real data, and real
            consequences when something breaks. Agentic systems lead; ML appears where a
            small, explainable model earned its place.
          </p>

          <div id="experience" style={{ scrollMarginTop: 80 }} />
          <div className="em-subhead">
            <span className="em-subhead-l">Experience</span>
            <span className="em-subhead-r">Companies worked for</span>
          </div>
          {EXPERIENCE_PROJECTS.map(p => <ProjectCard p={p} key={p.title} />)}

          <div className="em-subhead">
            <span className="em-subhead-l">SaaS products &amp; projects</span>
            <span className="em-subhead-r">Live products &amp; independent builds</span>
          </div>
          {PERSONAL_PROJECTS.map(p => <ProjectCard p={p} key={p.title} />)}
        </div>
      </div>

      {/* ============ Process (dark) ============ */}
      <div id="process" className="em-dark">
        <div className="em-sec-in">
          <div className="em-eyebrow">My engagement process</div>
          <h2 className="em-h2">From your problem to working software. No slide decks.</h2>
          <p className="em-intro" style={{ color: "#6E6E78" }}>
            Five steps that any client or hiring manager can hold me to. Every phase ends
            with a clear deliverable, not a status update.
          </p>
          <div className="em-grid c5 dark">
            {PROCESS_STEPS.map(s => (
              <div className="em-step" key={s.num}>
                <div className="em-step-n">{s.num}</div>
                <div className="em-step-w">{s.sub}</div>
                <div className="em-step-t">{s.title}</div>
                <p className="em-step-b">{s.body}</p>
                <div className="em-tags">
                  {s.tags.map(t => <span className="em-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Ask my AI ============ */}
      <div id="ai" className="em-sec hairline">
        <div className="em-sec-in">
          <div className="em-eyebrow">Ask my AI</div>
          <h2 className="em-h2" style={{ maxWidth: 720 }}>Put a problem to the agent.</h2>
          <p className="em-intro">
            A multi-agent pipeline — router, case-matcher, architect, consultant — grounded
            in the systems I&apos;ve shipped. Ask it how I&apos;d build yours.
          </p>
          <div style={{ maxWidth: 820, marginTop: 56 }}>
            <EngAgentChat />
          </div>
        </div>
      </div>

      {/* ============ About ============ */}
      <div id="about" className="em-sec hairline">
        <div className="em-sec-in">
          <div className="em-eyebrow">About</div>
          <h2 className="em-h2">The engineer who ships the whole thing.</h2>
          <p className="em-intro">
            Honours BASc in AI. AWS-certified. Three years building production AI
            systems across hiring tech, legal AI, materials science, and enterprise
            automation — each one deployed, measured, and handed off with documentation.
          </p>

          <div className="em-about">
            <div className="em-photo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="em-photo" src="/images/omkumar/Omkumar10.jpeg" alt="Omkumar Solanki" />
              <div className="em-photo-links">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn →</a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub →</a>
                <span>Toronto, Canada</span>
              </div>
            </div>
            <div>
              <p className="em-bio">
                I started building AI systems before the current wave made it fashionable.
                I understand the math — gradient descent, attention mechanisms, RAG
                architectures — and I understand what it takes to keep them working at 3 AM
                when an inference pipeline is down and someone&apos;s live interview is waiting.
                My standard is simple: if you can&apos;t measure it improving something real,
                it doesn&apos;t ship.
              </p>
              <div style={{ marginTop: 40 }}>
                <div className="em-label">Education</div>
                {EDUCATION.map(edu => (
                  <div className="em-edu-row" key={edu.school}>
                    <div className="em-edu-school">{edu.school}</div>
                    <div className="em-edu-line">
                      <span className="em-edu-deg">{edu.degree}</span>
                      <span className="em-edu-note">{edu.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 72 }}>
            <div className="em-label">Experience</div>
            {ABOUT_EXPERIENCE.map(exp => (
              <div className="em-exp-row" key={exp.company}>
                <div>
                  <div className="em-exp-company">
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noopener noreferrer">{exp.company} →</a>
                    ) : (
                      <span className="plain">{exp.company}</span>
                    )}
                    {exp.highlight && <span className="em-exp-active">Active</span>}
                  </div>
                  <div className="em-exp-role">{exp.role}</div>
                  <p className="em-exp-desc">{exp.description}</p>
                </div>
                <div className="em-exp-period">{exp.period}</div>
              </div>
            ))}
          </div>

          <div className="em-two-col">
            <div>
              <div className="em-label" style={{ display: "block", marginBottom: 20 }}>Technologies</div>
              <div className="em-tags" style={{ marginTop: 0 }}>
                {SKILLS.map(s => <span className="em-tag" key={s}>{s}</span>)}
              </div>
            </div>
            <div>
              <div className="em-label" style={{ display: "block", marginBottom: 12 }}>What I build</div>
              {CAPABILITIES.map(c => <div className="em-cap-row" key={c}>{c}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* ============ Contact (dark) ============ */}
      <div id="contact" className="em-dark">
        <div className="em-contact-in">
          <div className="em-eyebrow">Get in touch</div>
          <h2 className="em-contact-h2">Let&apos;s build something.</h2>
          <p className="em-contact-sub">
            Open to founding roles, consulting engagements, and ambitious teams that
            need AI that actually works.
          </p>

          <div className="em-anchors">
            <div>
              <div className="em-anchor-l">Email</div>
              <a className="em-anchor-v" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <div>
              <div className="em-anchor-l">LinkedIn</div>
              <a className="em-anchor-v" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">/in/omkumar-solanki</a>
            </div>
            <div>
              <div className="em-anchor-l">Location</div>
              <span className="em-anchor-v">Toronto, Canada</span>
            </div>
          </div>

          <EngContactForm />

          <div className="em-foot">
            <div className="em-foot-links">
              <a href="https://www.resso.ai" target="_blank" rel="noopener noreferrer">resso.ai</a>
              <a href="https://www.corol.org" target="_blank" rel="noopener noreferrer">corol.org</a>
              <a href="https://www.nunafab.com" target="_blank" rel="noopener noreferrer">nunafab.com</a>
            </div>
            <div className="em-foot-c">Designed &amp; built by Omkumar Solanki · 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
