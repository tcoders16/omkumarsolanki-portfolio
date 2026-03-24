"use client";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   CASE STUDIES — real problems, real outcomes
───────────────────────────────────────────── */
const CASES = [
  {
    id: "resso",
    client: "Resso.ai",
    sector: "Edtech / HR Tech",
    accent: "#39d9b4",
    bg: "rgba(57,217,180,0.04)",
    border: "rgba(57,217,180,0.15)",
    icon: "R",
    status: "Live in production",
    statusColor: "#39d9b4",
    problem: {
      headline: "AI call agents that forgot everything mid-conversation",
      body: "Edtech clients were running AI interview and coaching calls — but the agent lost context every few turns, kept restarting questions from scratch, and students dropped off. Retention was collapsing. Clients threatened to churn.",
    },
    discovery: "Spent 2-3 days embedded with the edtech clients before writing a single line of code. Mapped exact conversation breakpoints. Found the root issue: no stateful context layer between turns — each API call was cold. The agent had no memory of what it already knew.",
    built: [
      "Stateful session architecture: conversation history compressed and injected per-turn via sliding context window",
      "Per-persona model routing: different LLM configurations per interview type (technical, behavioural, coaching)",
      "Real-time confidence scoring: if agent certainty drops below threshold, it gracefully redirects instead of hallucinating",
      "MLOps dashboard: accuracy, latency, context retention, completion rate — tracked daily per client",
    ],
    outcomes: [
      { before: "72%", after: "98%", label: "Context retention across turns" },
      { before: "14%", after: "3.8%", label: "Hallucination rate" },
      { before: "1", after: "5", label: "AI personas - client expanded" },
      { before: "Churn risk", after: "Renewed + expanded", label: "Client contract" },
    ],
    quote: "They renewed the contract and expanded from 1 AI persona to 5 within 3 months of go-live.",
    tags: ["Stateful AI", "Context Memory", "MLOps", "Real-time Inference", "WebRTC", "PyTorch"],
  },
  {
    id: "lawline",
    client: "Lawline.tech",
    sector: "Legal AI / Enterprise · For Rogers",
    accent: "#dc2626",
    bg: "rgba(220,38,38,0.04)",
    border: "rgba(220,38,38,0.15)",
    icon: "L",
    status: "Live · $1M Rogers conversation",
    statusColor: "#dc2626",
    problem: {
      headline: "Attorneys needed AI but could not send one byte to the cloud",
      body: "Attorney-client privilege is not a preference — it is a legal obligation. Any cloud AI model meant one accidental data egress could end careers and disbar firms. Every existing tool was a non-starter. The privacy constraint eliminated all conventional options.",
    },
    discovery: "Interviewed 4 attorneys before speccing anything. Understood exactly what they needed: fast legal research, cited sources, case law retrieval — but with a hard guarantee that no data ever leaves the building. The architecture had to be the proof, not a promise.",
    built: [
      "Fully air-gapped RAG stack: GGUF-quantized LLM running on 16GB RAM, zero external API calls",
      "HNSW vector store over Canadian legal corpora — 200K+ documents, sub-1s retrieval",
      "BGE cross-encoder reranker: top-12 candidates reranked to top-4 before LLM sees them",
      "Confidence-gated output: low-confidence answers routed to human review, not surfaced to attorneys",
      "Zero-packet-egress proof: showed attorneys real-time network monitor during a live query",
    ],
    outcomes: [
      { before: "Cloud AI", after: "Air-gapped local", label: "Privacy guarantee" },
      { before: "Impossible", after: "Live daily", label: "AI legal research" },
      { before: "14%", after: "Sub-4%", label: "Hallucination rate" },
      { before: "Startup", after: "$1M conversation", label: "Rogers President interest" },
    ],
    quote: "Attorneys started demoing the zero-outbound-packets screen to their law society contacts. The architecture became the sales pitch.",
    tags: ["Air-gapped RAG", "Local LLM", "GGUF", "HNSW", "Legal AI", "Zero Data Egress"],
  },
  {
    id: "corol",
    client: "Corol / UHPC Research",
    sector: "Structural Engineering / Materials Science",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.04)",
    border: "rgba(245,158,11,0.15)",
    icon: "C",
    status: "12 engineers using daily",
    statusColor: "#f59e0b",
    problem: {
      headline: "UHPC testing took weeks — engineers could only try a few mixes",
      body: "Ultra-High Performance Concrete research required physical lab tests for every mix variation. Each test: hours of preparation, curing time, measurement. The team could run maybe 5-10 experiments per week when the problem space had hundreds of combinations to explore.",
    },
    discovery: "Shadowed engineers in the lab for 3 days before touching a dataset. Watched every step of the mix design process — learned what silica fume dosage, W/C ratio, and fibre type mean to a structural engineer. Built domain intuition before building any model.",
    built: [
      "SHAP-explainable XGBoost ensemble: R² = 0.89 on 200-row dataset via transfer learning",
      "Feature engineering: W/C ratio, silica fume %, fibre dosage, curing age — all domain-grounded",
      "SHAP attribution per mix: engineers see exact phi-values per ingredient, not just a prediction",
      "Formulation screener: scan 100+ mixes computationally before a single gram of concrete is poured",
    ],
    outcomes: [
      { before: "Hours", after: "2 seconds", label: "Per strength prediction" },
      { before: "5-10/week", after: "100s/afternoon", label: "Mixes screened" },
      { before: "0", after: "12", label: "Engineers using it daily" },
      { before: "Skeptical", after: "Demoing to peers", label: "Scientists' reaction" },
    ],
    quote: "Scientists who started as skeptics ended up demoing the tool to their own colleagues. They trusted it because it matched what they already knew.",
    tags: ["SHAP Explainability", "XGBoost", "Transfer Learning", "Feature Engineering", "UHPC", "Materials ML"],
  },
  {
    id: "ttc",
    client: "Lost and Found",
    sector: "Transit / Public Infrastructure · TTC",
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.04)",
    border: "rgba(59,130,246,0.15)",
    icon: "T",
    status: "Pitching TTC Director May 2026",
    statusColor: "#f59e0b",
    problem: {
      headline: "1.7 million daily riders. Lost items tracked on paper and phone calls.",
      body: "Toronto Transit Commission handles 1.7M passengers every day. When riders lose belongings, staff log them manually, match by eye, and call people back on paper trails. Recovery rates are low. Turnaround is slow. No AI, no search, no system.",
    },
    discovery: "Shadowed TTC staff at Union Station for a full day before writing a line of code. Watched how found items get logged, how staff search for matches, and where the bottlenecks were. Understood the operational constraints: spotty WiFi, aging hardware, hundreds of items daily.",
    built: [
      "AI matching engine: cosine similarity over description embeddings links rider claims to found items",
      "Staff dashboard: fast, mobile-optimised, works on existing TTC hardware with no new infra",
      "Rider claim portal: mobile-first, SMS-based status updates, QR-tagged items",
      "Confidence-gated routing: high-confidence match triggers immediate SMS; low-confidence queues for staff review",
      "Full audit trail: every item, every decision, every notification — logged and queryable",
    ],
    outcomes: [
      { before: "Paper + phone", after: "AI-matched", label: "Item recovery process" },
      { before: "Days", after: "Hours", label: "Claim resolution time" },
      { before: "0", after: "Full system", label: "Digital infrastructure" },
      { before: "Capstone", after: "Director pitch", label: "May 2026 stakeholder" },
    ],
    quote: "This is production-ready architecture built to hand off to TTC engineering. Not a school demo. A deployable proposal.",
    tags: ["Vector Similarity", "Next.js", "FastAPI", "PostgreSQL", "pgvector", "SMS", "AI Matching"],
  },
];

/* ─────────────────────────────────────────────
   APPROACH STEPS
───────────────────────────────────────────── */
const APPROACH = [
  {
    num: "01",
    title: "Discover",
    sub: "Before any code",
    color: "#39d9b4",
    desc: "I spend 1-3 days in your operation before speccing anything. Interviews with users, observation of workflows, mapping where time and money actually go. Most projects fail because engineers skip this step.",
    proof: "Shadowed TTC staff, interviewed 4 attorneys, embedded with edtech clients — before writing a line of code on any of them.",
  },
  {
    num: "02",
    title: "Diagnose",
    sub: "Find the real problem",
    color: "#f59e0b",
    desc: "The stated problem is rarely the actual problem. I translate vague business pain ('our AI is bad') into precise technical root causes ('no stateful context layer, cold API calls per turn'). That diagnosis is the most valuable deliverable.",
    proof: "Resso's context retention problem looked like a model quality issue. It was actually a missing session architecture. Two different solutions with very different costs.",
  },
  {
    num: "03",
    title: "Architect",
    sub: "Design before building",
    color: "#8b5cf6",
    desc: "Architecture decisions made in day one cost nothing to change. The same decision made at launch costs everything. I produce a concrete technical proposal — stack, data flow, failure modes, cost model — before a single line is written.",
    proof: "Lawline's air-gapped architecture was designed entirely before implementation. The zero-egress proof became the sales pitch to Rogers.",
  },
  {
    num: "04",
    title: "Build",
    sub: "Production, not prototypes",
    color: "#3b82f6",
    desc: "I build systems designed to be handed to engineering teams, not demos designed to impress in a meeting. Every component is tested, documented, and deployed in real infrastructure. I own every layer — model, API, infra, dashboard.",
    proof: "Resso: WebRTC ingestion, speaker diarization, NLP pipeline, hire scorer, ONNX export, MLOps dashboard — entire stack, one engineer.",
  },
  {
    num: "05",
    title: "Measure",
    sub: "Outcomes, not activity",
    color: "#39d9b4",
    desc: "Every engagement ships with measurable baselines and target metrics. I track what changed, not what was built. Latency before and after. Accuracy before and after. Retention before and after.",
    proof: "Resso: context retention 72% to 98%. Hallucination 14% to 3.8%. Corol: lab cycles from weeks to one afternoon.",
  },
];

/* ─────────────────────────────────────────────
   BUSINESS vs TECHNICAL TRANSLATION
───────────────────────────────────────────── */
const TRANSLATIONS = [
  {
    business: "Our AI keeps giving wrong answers to customers",
    diagnosis: "No confidence gating — model outputs surfaced regardless of certainty score",
    technical: "Add sigmoid gate P(action) = sigma(z) > threshold before any output reaches user. Route low-confidence outputs to human review queue.",
    outcome: "Hallucination rate: 14% to 3.8%",
  },
  {
    business: "Our AI forgets what we told it earlier in the conversation",
    diagnosis: "Stateless API calls — no session layer, each turn is a cold start",
    technical: "Sliding context window with conversation compression. Redis session store keyed by conversation ID. Inject compressed history into every system prompt.",
    outcome: "Context retention: 72% to 98%",
  },
  {
    business: "We can't use any AI because of our data privacy rules",
    diagnosis: "All AI options require cloud egress — not a technical limit, an architecture choice",
    technical: "GGUF-quantized local LLM on 16GB RAM. HNSW vector store on-premise. Zero external API calls. Zero data egress by design.",
    outcome: "Attorney-client privilege maintained. $1M enterprise conversation opened.",
  },
  {
    business: "Our lab testing is too slow — we can't run enough experiments",
    diagnosis: "Physical bottleneck masking an information problem — predictions, not more tests",
    technical: "XGBoost ensemble + SHAP attribution on domain-informed features. Transfer learning to compensate for small dataset. Screener UI for rapid formulation comparison.",
    outcome: "100s of mixes screened in one afternoon vs. weeks in the lab.",
  },
];

/* ─────────────────────────────────────────────
   WHAT I BRING (differentiators)
───────────────────────────────────────────── */
const DIFFERENTIATORS = [
  {
    icon: "◈",
    title: "I talk to your users first",
    body: "Every project I've delivered started with field observation, not a requirements doc. The real problem is always one layer deeper than the stated problem.",
    color: "#39d9b4",
  },
  {
    icon: "◈",
    title: "I own every layer",
    body: "Model, API, infrastructure, dashboard, MLOps. No handoffs between five contractors. One person who understands how all the layers affect each other.",
    color: "#f59e0b",
  },
  {
    icon: "◈",
    title: "I measure outcomes, not activity",
    body: "Every engagement ships with before/after metrics. Latency. Accuracy. Retention. Cost per outcome. You always know exactly what changed and by how much.",
    color: "#8b5cf6",
  },
  {
    icon: "◈",
    title: "I explain it so your team understands",
    body: "SHAP attributions so engineers see why a model is making a prediction. Architecture diagrams for CTO sign-off. Plain English summaries for the boardroom. All three, same engagement.",
    color: "#3b82f6",
  },
  {
    icon: "◈",
    title: "I build for handoff",
    body: "Every system I deliver is documented, tested, and designed so your internal engineering team can take it over. No black boxes. No lock-in.",
    color: "#39d9b4",
  },
  {
    icon: "◈",
    title: "I've done this at the President of Rogers level",
    body: "Active $1M investment conversation with the President of Rogers. TTC Director stakeholder. I operate at the level where business decisions get made.",
    color: "#dc2626",
  },
];

/* ─────────────────────────────────────────────
   OUTCOME CHIP
───────────────────────────────────────────── */
function OutcomeChip({ before, after, label }: { before: string; after: string; label: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 8,
      padding: "12px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#666", textDecoration: "line-through" }}>{before}</span>
        <span style={{ color: "#444", fontSize: "0.5rem" }}>→</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, color: "#39d9b4" }}>{after}</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CASE STUDY CARD
───────────────────────────────────────────── */
function CaseCard({ c, open, onToggle }: { c: typeof CASES[0]; open: boolean; onToggle: () => void }) {
  return (
    <div style={{
      background: open ? c.bg : "rgba(255,255,255,0.01)",
      border: `1px solid ${open ? c.border : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16,
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}>
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "24px 28px",
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          textAlign: "left",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: c.accent + "18",
          border: `1.5px solid ${c.accent}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800,
          color: c.accent, flexShrink: 0,
        }}>
          {c.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            color: c.accent, letterSpacing: "0.16em", textTransform: "uppercase",
            marginBottom: 4,
          }}>
            {c.sector}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            {c.client}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            color: "#888", lineHeight: 1.5,
          }}>
            {c.problem.headline}
          </div>
        </div>

        {/* Status badge + toggle */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: "0.48rem",
            fontWeight: 700, color: c.statusColor,
            background: c.statusColor + "12",
            border: `1px solid ${c.statusColor}30`,
            borderRadius: 20, padding: "4px 12px",
            whiteSpace: "nowrap",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.statusColor, display: "inline-block" }} />
            {c.status}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            color: open ? c.accent : "#444",
            transition: "color 0.2s",
          }}>
            {open ? "▲ collapse" : "▼ read case study"}
          </div>
        </div>
      </button>

      {/* Expandable body */}
      {open && (
        <div style={{ padding: "0 28px 32px" }}>
          <div style={{ height: 1, background: `${c.accent}20`, marginBottom: 28 }} />

          {/* The Problem */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              color: c.accent, letterSpacing: "0.16em", textTransform: "uppercase",
              marginBottom: 10,
            }}>
              The Problem
            </div>
            <p style={{ fontSize: "0.9rem", color: "#aaa", lineHeight: 1.8, fontWeight: 300, marginBottom: 10 }}>
              {c.problem.body}
            </p>
          </div>

          {/* Discovery */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: `3px solid ${c.accent}`,
            borderRadius: "0 8px 8px 0",
            padding: "14px 18px",
            marginBottom: 28,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              color: c.accent, letterSpacing: "0.16em", textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Discovery (before writing any code)
            </div>
            <p style={{ fontSize: "0.84rem", color: "#999", lineHeight: 1.75, fontWeight: 300 }}>
              {c.discovery}
            </p>
          </div>

          {/* What I built */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              color: c.accent, letterSpacing: "0.16em", textTransform: "uppercase",
              marginBottom: 12,
            }}>
              What I Built
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {c.built.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                    color: c.accent, marginTop: 4, flexShrink: 0,
                  }}>+</span>
                  <span style={{ fontSize: "0.84rem", color: "#bbb", lineHeight: 1.7, fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              color: c.accent, letterSpacing: "0.16em", textTransform: "uppercase",
              marginBottom: 12,
            }}>
              Outcomes
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
            }}>
              {c.outcomes.map((o) => (
                <OutcomeChip key={o.label} {...o} />
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{
            background: `${c.accent}08`,
            border: `1px solid ${c.accent}20`,
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 20,
          }}>
            <p style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontSize: "0.92rem", color: "#ccc", lineHeight: 1.7,
            }}>
              &ldquo;{c.quote}&rdquo;
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {c.tags.map(t => (
              <span key={t} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                color: "#666", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 3, padding: "3px 9px", letterSpacing: "0.06em",
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function ConsultingPage() {
  const [openCase, setOpenCase] = useState<string | null>("resso");

  const handleToggle = (id: string) => {
    setOpenCase(prev => prev === id ? null : id);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .c-fade { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .c-fade-1 { animation-delay: 0.1s; }
        .c-fade-2 { animation-delay: 0.22s; }
        .c-fade-3 { animation-delay: 0.34s; }
        .c-fade-4 { animation-delay: 0.46s; }
        @media (max-width: 700px) {
          .approach-grid { grid-template-columns: 1fr !important; }
          .diff-grid { grid-template-columns: 1fr !important; }
          .trans-grid { grid-template-columns: 1fr !important; }
          .proof-strip { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAV spacer ── */}
      <div style={{ height: 60 }} />

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "62vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px clamp(20px, 5vw, 80px) 64px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(57,217,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,180,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          <div className="c-fade c-fade-1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono)", fontSize: "0.55rem",
            color: "#39d9b4", letterSpacing: "0.18em", textTransform: "uppercase",
            border: "1px solid rgba(57,217,180,0.25)", borderRadius: 3,
            padding: "5px 14px", marginBottom: 28,
            background: "rgba(57,217,180,0.04)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#39d9b4", animation: "pulse 2s ease infinite" }} />
            AI Consulting · Real problems. Real outcomes.
          </div>

          <h1 className="c-fade c-fade-2" style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
            letterSpacing: "-0.045em", lineHeight: 0.92,
            color: "#f0f0f0", marginBottom: 28,
          }}>
            I solve the business<br />
            problem first.{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              color: "#39d9b4",
            }}>Then I build.</span>
          </h1>

          <p className="c-fade c-fade-3" style={{
            fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
            color: "#888", lineHeight: 1.75,
            maxWidth: 580, marginBottom: 36, fontWeight: 300,
          }}>
            Most AI projects fail because engineers start coding before they understand the problem.
            I spend time in your operation first — talking to users, mapping workflows, finding the real root cause.
            Then I build a system that actually solves it.
          </p>

          <div className="c-fade c-fade-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#cases" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              fontWeight: 700, letterSpacing: "0.08em",
              padding: "13px 26px", borderRadius: 4,
              background: "#39d9b4", color: "#000",
              textDecoration: "none", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              See Case Studies ↓
            </a>
            <a href="/book" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              fontWeight: 600, letterSpacing: "0.08em",
              padding: "13px 26px", borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.12)", color: "#ccc",
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}>
              Book a free call
            </a>
            <a href="/" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              color: "#555", textDecoration: "none", letterSpacing: "0.06em",
              padding: "13px 0", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}>
              ← Back to portfolio
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PROOF STRIP
      ══════════════════════════════ */}
      <section style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "32px clamp(20px, 5vw, 80px)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }} className="proof-strip">
          {[
            { n: "4", label: "Production systems shipped", sub: "Resso · Lawline · Corol · TTC" },
            { n: "$1M", label: "Investment conversation", sub: "Rogers President · Lawline.tech" },
            { n: "1.7M", label: "Riders impacted", sub: "TTC Lost and Found pitch" },
            { n: "12", label: "Engineers using daily", sub: "Corol UHPC platform" },
          ].map((s, i) => (
            <div key={s.n} style={{
              padding: "24px 28px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: "#39d9b4", letterSpacing: "-0.04em", lineHeight: 1,
                marginBottom: 6,
              }}>{s.n}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                color: "#ccc", fontWeight: 500, marginBottom: 3,
              }}>{s.label}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                color: "#444", letterSpacing: "0.06em",
              }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          HOW I WORK
      ══════════════════════════════ */}
      <section style={{
        padding: "80px clamp(20px, 5vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          color: "#39d9b4", letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: 12,
        }}>
          How I Work
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
          letterSpacing: "-0.04em", color: "#f0f0f0",
          marginBottom: 12, lineHeight: 1.1,
        }}>
          Five steps. Every project.
        </h2>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.9rem",
          color: "#666", lineHeight: 1.7, maxWidth: 520, marginBottom: 52,
        }}>
          Most engineers start at step 4. I start at step 1. That is the difference between a system that works in a demo and one that works in production.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
        }} className="approach-grid">
          {APPROACH.map((step) => (
            <div key={step.num} style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: `3px solid ${step.color}`,
              borderRadius: "0 0 12px 12px",
              padding: "22px 18px 20px",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                color: step.color, letterSpacing: "0.12em", marginBottom: 8,
              }}>{step.num}</div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "1.05rem", color: "#f0f0f0",
                letterSpacing: "-0.02em", marginBottom: 2,
              }}>{step.title}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                color: "#555", letterSpacing: "0.08em", marginBottom: 12,
              }}>{step.sub}</div>
              <p style={{
                fontSize: "0.78rem", color: "#777",
                lineHeight: 1.7, fontWeight: 300, marginBottom: 14,
              }}>{step.desc}</p>
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 12,
                fontFamily: "var(--font-mono)", fontSize: "0.46rem",
                color: "#555", lineHeight: 1.6,
                fontStyle: "italic",
              }}>
                {step.proof}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          CASE STUDIES
      ══════════════════════════════ */}
      <section id="cases" style={{
        padding: "80px clamp(20px, 5vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          color: "#39d9b4", letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Case Studies
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
          letterSpacing: "-0.04em", color: "#f0f0f0",
          marginBottom: 12, lineHeight: 1.1,
        }}>
          Four real problems.{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#39d9b4" }}>
            Four measured outcomes.
          </span>
        </h2>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.9rem",
          color: "#666", lineHeight: 1.7, maxWidth: 520, marginBottom: 48,
        }}>
          Click any case to expand the full story — problem, discovery process, what was built, and what changed.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CASES.map(c => (
            <CaseCard
              key={c.id}
              c={c}
              open={openCase === c.id}
              onToggle={() => handleToggle(c.id)}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          BUSINESS → TECH TRANSLATION
      ══════════════════════════════ */}
      <section style={{
        padding: "80px clamp(20px, 5vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.005)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: 12,
          }}>
            Business to Technical Translation
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
            letterSpacing: "-0.04em", color: "#f0f0f0",
            marginBottom: 12, lineHeight: 1.1,
          }}>
            What you say. What I hear. What gets built.
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.9rem",
            color: "#666", lineHeight: 1.7, maxWidth: 520, marginBottom: 48,
          }}>
            The gap between business pain and technical root cause is where most AI projects fail. I close that gap.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="trans-grid">
            {TRANSLATIONS.map((t, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: 0,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                overflow: "hidden",
              }}>
                <div style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                    color: "#666", letterSpacing: "0.12em", textTransform: "uppercase",
                    marginBottom: 8,
                  }}>What you say</div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "0.82rem",
                    color: "#ccc", lineHeight: 1.6, fontStyle: "italic",
                    fontWeight: 300,
                  }}>&ldquo;{t.business}&rdquo;</p>
                </div>

                <div style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                    color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase",
                    marginBottom: 8,
                  }}>Root cause</div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "0.8rem",
                    color: "#aaa", lineHeight: 1.6, fontWeight: 300,
                  }}>{t.diagnosis}</p>
                </div>

                <div style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                    color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase",
                    marginBottom: 8,
                  }}>What gets built</div>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                    color: "#888", lineHeight: 1.7,
                  }}>{t.technical}</p>
                </div>

                <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", minWidth: 140 }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                      color: "#39d9b4", letterSpacing: "0.12em", textTransform: "uppercase",
                      marginBottom: 6,
                    }}>Outcome</div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                      fontWeight: 700, color: "#39d9b4", lineHeight: 1.4,
                    }}>{t.outcome}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          WHAT I BRING
      ══════════════════════════════ */}
      <section style={{
        padding: "80px clamp(20px, 5vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          color: "#39d9b4", letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Why Me
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
          letterSpacing: "-0.04em", color: "#f0f0f0",
          marginBottom: 48, lineHeight: 1.1,
        }}>
          What I bring that most engineers{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>do not.</span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }} className="diff-grid">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.title} style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "24px 22px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${d.color}40`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "1rem",
                color: d.color, marginBottom: 12,
              }}>{d.icon}</div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.95rem", color: "#f0f0f0",
                letterSpacing: "-0.02em", marginBottom: 10, lineHeight: 1.3,
              }}>{d.title}</div>
              <p style={{
                fontSize: "0.8rem", color: "#777",
                lineHeight: 1.75, fontWeight: 300,
              }}>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          CTA
      ══════════════════════════════ */}
      <section style={{
        padding: "80px clamp(20px, 5vw, 80px)",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{
          background: "rgba(57,217,180,0.03)",
          border: "1px solid rgba(57,217,180,0.14)",
          borderRadius: 16,
          padding: "52px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.5rem",
              color: "#39d9b4", letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: 14,
            }}>
              Start Here
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              letterSpacing: "-0.03em", color: "#f0f0f0",
              marginBottom: 14, lineHeight: 1.15,
            }}>
              Tell me what is not working. I will tell you what to build.
            </h2>
            <p style={{
              fontSize: "0.88rem", color: "#666",
              lineHeight: 1.7, fontWeight: 300,
            }}>
              Free 30-minute call. No pitch. I will ask about your operation, identify where AI can actually help, and give you a concrete next step — whether or not we work together.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <a href="/book" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.66rem",
              fontWeight: 700, letterSpacing: "0.08em",
              padding: "16px 32px", borderRadius: 6,
              background: "#39d9b4", color: "#000",
              textDecoration: "none", textAlign: "center",
              transition: "opacity 0.2s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Book a free call ↗
            </a>
            <a href="mailto:emailtosolankiom@gmail.com" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              color: "#555", textDecoration: "none",
              textAlign: "center", letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}>
              or send an email directly
            </a>
          </div>
        </div>

        {/* Back to portfolio */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href="/" style={{
            fontFamily: "var(--font-mono)", fontSize: "0.55rem",
            color: "#444", textDecoration: "none", letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#888"}
          onMouseLeave={e => e.currentTarget.style.color = "#444"}>
            ← Back to portfolio
          </a>
        </div>
      </section>
    </>
  );
}
