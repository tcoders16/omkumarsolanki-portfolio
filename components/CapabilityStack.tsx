"use client";
import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   MULTI-AGENT ORCHESTRATION — why I build them + how
════════════════════════════════════════════════════════════════════ */

/* ── Pipeline animation data ──────────────────────────────────────── */
const PIPELINE_STEPS = [
  { id: "input",   label: "User Task",        sub: "\"analyse this contract\"",      icon: "▸", col: 0 },
  { id: "orch",    label: "Orchestrator",     sub: "plans · routes · retries",       icon: "⬡", col: 1 },
  { id: "mem",     label: "Memory Agent",     sub: "reads session + vector store",   icon: "⟳", col: 2 },
  { id: "ml",      label: "ML Agent",         sub: "risk scoring · classification",  icon: "∿", col: 2 },
  { id: "api",     label: "Tool Agent",       sub: "fetches docs · calls APIs",      icon: "⇌", col: 2 },
  { id: "valid",   label: "Validator",        sub: "checks coherence · confidence",  icon: "✓", col: 3 },
  { id: "output",  label: "Structured Output",sub: "JSON · report · action",         icon: "◈", col: 4 },
];

const WHY = [
  {
    problem: "Single LLM forgets",
    solution: "Memory Agent keeps session context short-term and retrieves long-term facts from a vector store — agents never lose the thread.",
  },
  {
    problem: "One model can't specialise",
    solution: "Each agent is tuned for its job — an ML agent runs a fine-tuned risk model, a tool agent handles API calls. No jack-of-all-trades hallucinations.",
  },
  {
    problem: "Long tasks time out or drift",
    solution: "The orchestrator breaks work into atomic sub-tasks, runs them in parallel where possible, and retries failed nodes without re-running the whole chain.",
  },
  {
    problem: "No fault tolerance",
    solution: "A validator agent checks every agent's output before it passes downstream. Bad outputs are caught and rerouted — not silently swallowed.",
  },
];

const HOW = [
  { num: "01", title: "Define agent contracts", body: "Each agent gets a strict input/output schema. The orchestrator enforces types — no agent can accept or emit arbitrary blobs." },
  { num: "02", title: "Build the orchestrator", body: "LangGraph or a custom state machine. It holds the DAG of agent dependencies, handles branching logic, and owns retry / fallback policy." },
  { num: "03", title: "Wire the memory layer", body: "Session memory lives in Redis (fast, ephemeral). Permanent memory indexes into pgvector or Pinecone. Agents query both on every turn." },
  { num: "04", title: "Instrument every node", body: "Each agent emits spans to an observability backend (Langfuse / OTLP). I can see exactly where latency or hallucinations enter the pipeline." },
  { num: "05", title: "Harden with a validator", body: "A lightweight LLM-as-judge agent scores coherence and confidence before results leave the pipeline. Below threshold → re-route or flag for human review." },
];

/* ── Animated pipeline ───────────────────────────────────────────── */
function Pipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % PIPELINE_STEPS.length), 1100);
    return () => clearInterval(id);
  }, []);

  // group by column
  const cols: Record<number, typeof PIPELINE_STEPS> = {};
  PIPELINE_STEPS.forEach(s => { cols[s.col] = cols[s.col] || []; cols[s.col].push(s); });
  const colKeys = [0, 1, 2, 3, 4];

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        minWidth: 640,
        padding: "28px 0",
      }}>
        {colKeys.map((col, ci) => (
          <div key={col} style={{ display: "flex", alignItems: "center", flex: col === 2 ? 1.4 : 1 }}>
            {/* nodes in this column */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
              alignItems: "center",
            }}>
              {cols[col]?.map(step => {
                const isActive = PIPELINE_STEPS[active].id === step.id;
                const isDone = PIPELINE_STEPS.findIndex(s => s.id === step.id) < active;
                return (
                  <div key={step.id} style={{
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: isActive
                      ? "1px solid rgba(57,217,180,0.7)"
                      : isDone
                        ? "1px solid rgba(57,217,180,0.25)"
                        : "1px solid rgba(255,255,255,0.07)",
                    background: isActive
                      ? "rgba(57,217,180,0.08)"
                      : isDone
                        ? "rgba(57,217,180,0.03)"
                        : "rgba(255,255,255,0.02)",
                    width: "100%",
                    transition: "all 0.35s ease",
                    boxShadow: isActive ? "0 0 18px rgba(57,217,180,0.12)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        color: isActive ? "#39d9b4" : isDone ? "rgba(57,217,180,0.4)" : "rgba(255,255,255,0.2)",
                        transition: "color 0.35s",
                      }}>{step.icon}</span>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: isActive ? "#f0f0f0" : isDone ? "rgba(240,240,240,0.55)" : "rgba(240,240,240,0.3)",
                        transition: "color 0.35s",
                      }}>{step.label}</span>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      color: isActive ? "rgba(57,217,180,0.75)" : "rgba(255,255,255,0.2)",
                      letterSpacing: "0.03em",
                      transition: "color 0.35s",
                    }}>{step.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* arrow between columns */}
            {ci < colKeys.length - 1 && (
              <div style={{
                width: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                  <path d="M0 6h22M22 6l-5-4M22 6l-5 4"
                    stroke={active > ci ? "rgba(57,217,180,0.6)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1.5" strokeLinecap="round"
                    style={{ transition: "stroke 0.35s" }}
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export default function CapabilityStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="agents" className={`ma-wrap${visible ? " visible" : ""}`}>
      <style>{`
        .ma-wrap {
          background: #000;
          color: #f0f0f0;
          padding: 120px 24px 100px;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
        }
        .ma-inner { max-width: 1100px; margin: 0 auto; }

        /* ── entrance animations ── */
        .ma-fade {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .ma-wrap.visible .ma-fade { opacity: 1; transform: none; }
        .ma-wrap.visible .ma-d1 { transition-delay: 0.05s; }
        .ma-wrap.visible .ma-d2 { transition-delay: 0.12s; }
        .ma-wrap.visible .ma-d3 { transition-delay: 0.20s; }
        .ma-wrap.visible .ma-d4 { transition-delay: 0.28s; }
        .ma-wrap.visible .ma-d5 { transition-delay: 0.36s; }

        /* ── eyebrow ── */
        .ma-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #39d9b4;
          margin-bottom: 16px;
        }
        .ma-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 800; line-height: 1.08;
          margin: 0 0 14px; color: #f0f0f0;
        }
        .ma-sub {
          font-size: 1rem; color: #707070; max-width: 560px;
          line-height: 1.7; margin: 0 0 60px;
        }

        /* ── pipeline box ── */
        .ma-pipeline-box {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 28px 24px 20px;
          background: rgba(255,255,255,0.015);
          margin-bottom: 72px;
        }
        .ma-pipeline-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(57,217,180,0.4);
          margin-bottom: 18px;
        }

        /* ── two-col: why + how ── */
        .ma-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px 80px;
          margin-bottom: 72px;
        }
        @media (max-width: 820px) { .ma-cols { grid-template-columns: 1fr; gap: 48px; } }

        .ma-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(57,217,180,0.5);
          margin-bottom: 28px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* WHY rows */
        .ma-why-row {
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ma-why-row:last-child { border-bottom: none; }
        .ma-problem {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          color: rgba(240,240,240,0.9); margin-bottom: 6px;
          display: flex; align-items: center; gap: 10px;
        }
        .ma-problem::before {
          content: "✕";
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: rgba(255,80,80,0.6);
          flex-shrink: 0;
        }
        .ma-solution {
          font-size: 0.8rem; color: #606060; line-height: 1.65;
          padding-left: 18px;
        }

        /* HOW steps */
        .ma-how-step {
          display: flex; gap: 18px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ma-how-step:last-child { border-bottom: none; }
        .ma-how-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          color: rgba(57,217,180,0.4); flex-shrink: 0;
          padding-top: 3px; width: 22px;
        }
        .ma-how-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          color: rgba(240,240,240,0.9); margin-bottom: 5px;
        }
        .ma-how-body {
          font-size: 0.79rem; color: #606060; line-height: 1.65; margin: 0;
        }

        /* ── tech stack bar ── */
        .ma-stack-bar {
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 24px 28px;
          background: rgba(255,255,255,0.012);
          display: flex; align-items: center;
          gap: 12px; flex-wrap: wrap;
        }
        .ma-stack-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(57,217,180,0.45);
          margin-right: 8px; flex-shrink: 0;
        }
        .ma-stack-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.05em;
          padding: 4px 10px; border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.02);
        }
      `}</style>

      <div className="ma-inner">

        {/* Header */}
        <p className="ma-eyebrow ma-fade ma-d1">Multi-Agent Orchestration</p>
        <h2 className="ma-h1 ma-fade ma-d2">
          Why one LLM isn&apos;t enough —<br />and how I architect the alternative.
        </h2>
        <p className="ma-sub ma-fade ma-d3">
          I build pipelines where specialised agents plan, remember, predict, and validate
          in concert — shipping reliable AI products instead of fragile demos.
        </p>

        {/* Animated pipeline */}
        <div className="ma-pipeline-box ma-fade ma-d3">
          <p className="ma-pipeline-label">▸ Live pipeline trace — task execution flow</p>
          <Pipeline />
        </div>

        {/* Why + How */}
        <div className="ma-cols">

          {/* WHY */}
          <div className="ma-fade ma-d4">
            <p className="ma-section-label">Why multi-agent?</p>
            {WHY.map(w => (
              <div key={w.problem} className="ma-why-row">
                <div className="ma-problem">{w.problem}</div>
                <div className="ma-solution">{w.solution}</div>
              </div>
            ))}
          </div>

          {/* HOW */}
          <div className="ma-fade ma-d5">
            <p className="ma-section-label">How I build them</p>
            {HOW.map(h => (
              <div key={h.num} className="ma-how-step">
                <span className="ma-how-num">{h.num}</span>
                <div>
                  <div className="ma-how-title">{h.title}</div>
                  <p className="ma-how-body">{h.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Tech stack */}
        <div className="ma-stack-bar ma-fade ma-d5">
          <span className="ma-stack-label">Stack</span>
          {["LangGraph", "CrewAI", "LangChain", "OpenAI API", "Anthropic API",
            "Redis", "pgvector", "Pinecone", "Langfuse", "FastAPI", "Docker", "AWS"].map(t => (
            <span key={t} className="ma-stack-tag">{t}</span>
          ))}
        </div>

      </div>
    </section>
  );
}
