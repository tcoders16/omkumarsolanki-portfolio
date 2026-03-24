"use client";
import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   CAPABILITY STACK — what I build as an engineer + consultant
════════════════════════════════════════════════════════════════════ */

const AGENTS = [
  {
    id: "memory",
    label: "Memory\nAgent",
    sub: "Session + Persistent",
    angle: -120,
    color: "#39d9b4",
    icon: "⟳",
  },
  {
    id: "ml",
    label: "ML / Pred\nAgent",
    sub: "Model Inference",
    angle: -60,
    color: "#39d9b4",
    icon: "∿",
  },
  {
    id: "api",
    label: "API\nAgent",
    sub: "Tool + Function Calls",
    angle: 60,
    color: "#39d9b4",
    icon: "⇌",
  },
  {
    id: "ui",
    label: "UI\nAgent",
    sub: "Frontend Delivery",
    angle: 120,
    color: "#39d9b4",
    icon: "◫",
  },
];

const CAPS = [
  {
    num: "01",
    title: "Multi-Agent Orchestration",
    body: "Design and ship pipelines where specialized agents hand off tasks — planner → executor → validator — with retry logic, fallback routing, and observable traces.",
    tags: ["LangGraph", "CrewAI", "OpenAI Swarm"],
  },
  {
    num: "02",
    title: "Session & Persistent Memory",
    body: "Give agents short-term working memory (in-session context windows) and long-term recall (vector + KV stores) so they remember past decisions across runs.",
    tags: ["Pinecone", "Redis", "Chroma", "pgvector"],
  },
  {
    num: "03",
    title: "ML Model Prediction",
    body: "Train, fine-tune, and serve classification, regression, and generative models. Build evaluation pipelines with drift detection and retraining triggers.",
    tags: ["PyTorch", "scikit-learn", "HuggingFace", "MLflow"],
  },
  {
    num: "04",
    title: "Full-Stack Engineering",
    body: "Ship production web apps from Postgres schema to React UI — REST & GraphQL APIs, auth flows, real-time sockets, and CI pipelines included.",
    tags: ["Next.js", "FastAPI", "Node", "PostgreSQL"],
  },
  {
    num: "05",
    title: "Cloud & Infrastructure",
    body: "Containerise workloads, automate deployments, and architect scalable cloud infra with cost controls, observability dashboards, and zero-downtime releases.",
    tags: ["AWS", "GCP", "Docker", "Terraform", "k8s"],
  },
  {
    num: "06",
    title: "Business Analysis & Consulting",
    body: "Translate board-level problems into scoped technical solutions. Deliver ROI-clear recommendations with working prototypes — not slide decks.",
    tags: ["Root Cause", "SoW Design", "Stakeholder Mgmt"],
  },
];

/* ── Animated SVG orbit diagram ─────────────────────────────────── */
function OrbitDiagram() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => (p + 1) % 4), 900);
    return () => clearInterval(id);
  }, []);

  const cx = 200, cy = 200, R = 120, r = 42;

  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block", overflow: "visible" }}
    >
      {/* orbit ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,217,180,0.10)" strokeWidth="1" strokeDasharray="4 6" />

      {/* connection lines — pulse sequentially */}
      {AGENTS.map((ag, i) => {
        const rad = (ag.angle * Math.PI) / 180;
        const ax = cx + R * Math.cos(rad);
        const ay = cy + R * Math.sin(rad);
        const active = pulse === i;
        return (
          <line
            key={ag.id}
            x1={cx} y1={cy} x2={ax} y2={ay}
            stroke={active ? "rgba(57,217,180,0.7)" : "rgba(57,217,180,0.13)"}
            strokeWidth={active ? 1.5 : 1}
            style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
          />
        );
      })}

      {/* center node — orchestrator */}
      <circle cx={cx} cy={cy} r={38} fill="#000" stroke="rgba(57,217,180,0.4)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={33} fill="rgba(57,217,180,0.06)" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#39d9b4"
        fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.08em">
        ORCH
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="rgba(240,240,240,0.8)"
        fontSize="8.5" fontFamily="'Space Grotesk', sans-serif">
        ESTRATOR
      </text>
      <text x={cx} y={cy + 19} textAnchor="middle" fill="rgba(240,240,240,0.4)"
        fontSize="7" fontFamily="'JetBrains Mono', monospace">
        ─ plans · routes · retries ─
      </text>

      {/* agent nodes */}
      {AGENTS.map((ag, i) => {
        const rad = (ag.angle * Math.PI) / 180;
        const ax = cx + R * Math.cos(rad);
        const ay = cy + R * Math.sin(rad);
        const active = pulse === i;
        const lines = ag.label.split("\n");
        return (
          <g key={ag.id}>
            <circle cx={ax} cy={ay} r={r}
              fill={active ? "rgba(57,217,180,0.10)" : "#000"}
              stroke={active ? "rgba(57,217,180,0.6)" : "rgba(57,217,180,0.18)"}
              strokeWidth={active ? 1.5 : 1}
              style={{ transition: "all 0.3s" }}
            />
            {/* icon */}
            <text x={ax} y={ay - 11} textAnchor="middle" fill="rgba(57,217,180,0.7)"
              fontSize="13" fontFamily="monospace">{ag.icon}</text>
            {lines.map((ln, li) => (
              <text key={li} x={ax} y={ay + 3 + li * 11} textAnchor="middle"
                fill={active ? "#f0f0f0" : "rgba(240,240,240,0.75)"}
                fontSize="8.5" fontFamily="'Space Grotesk', sans-serif"
                style={{ transition: "fill 0.3s" }}>
                {ln}
              </text>
            ))}
            <text x={ax} y={ay + r + 13} textAnchor="middle"
              fill="rgba(57,217,180,0.55)" fontSize="7"
              fontFamily="'JetBrains Mono', monospace">
              {ag.sub}
            </text>
          </g>
        );
      })}

      {/* data flow arrow hint */}
      <text x={cx} y={395} textAnchor="middle" fill="rgba(240,240,240,0.2)"
        fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
        every node can call tools · read memory · emit results
      </text>
    </svg>
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
    <section ref={sectionRef} className={`cs-wrap${visible ? " visible" : ""}`}>
      <style>{`
        /* ── tokens ── */
        .cs-wrap {
          background: #000;
          color: #f0f0f0;
          padding: 120px 24px 100px;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .cs-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ── header ── */
        .cs-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #39d9b4;
          margin-bottom: 18px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .cs-wrap.visible .cs-eyebrow { opacity: 1; transform: none; }

        .cs-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.1rem, 5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.08;
          margin: 0 0 18px;
          color: #f0f0f0;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s;
        }
        .cs-wrap.visible .cs-h1 { opacity: 1; transform: none; }

        .cs-sub {
          font-size: 1.05rem;
          color: #888;
          max-width: 540px;
          line-height: 1.7;
          margin: 0 0 72px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.55s ease 0.16s, transform 0.55s ease 0.16s;
        }
        .cs-wrap.visible .cs-sub { opacity: 1; transform: none; }

        /* ── two-col layout ── */
        .cs-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px 80px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .cs-body { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ── orbit side ── */
        .cs-orbit-wrap {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .cs-wrap.visible .cs-orbit-wrap { opacity: 1; transform: scale(1); }

        .cs-orbit-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(57,217,180,0.5);
          text-align: center;
          margin-bottom: 24px;
        }

        /* ── capability cards ── */
        .cs-caps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .cs-cap {
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          opacity: 0;
          transform: translateX(16px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .cs-wrap.visible .cs-cap { opacity: 1; transform: none; }
        .cs-wrap.visible .cs-cap:nth-child(1) { transition-delay: 0.15s; }
        .cs-wrap.visible .cs-cap:nth-child(2) { transition-delay: 0.22s; }
        .cs-wrap.visible .cs-cap:nth-child(3) { transition-delay: 0.29s; }
        .cs-wrap.visible .cs-cap:nth-child(4) { transition-delay: 0.36s; }
        .cs-wrap.visible .cs-cap:nth-child(5) { transition-delay: 0.43s; }
        .cs-wrap.visible .cs-cap:nth-child(6) { transition-delay: 0.50s; }

        .cs-cap-row {
          display: flex;
          gap: 14px;
          align-items: baseline;
          margin-bottom: 5px;
        }
        .cs-cap-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: rgba(57,217,180,0.4);
          flex-shrink: 0;
          padding-top: 2px;
        }
        .cs-cap-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.97rem;
          font-weight: 700;
          color: #f0f0f0;
        }
        .cs-cap-body {
          font-size: 0.82rem;
          color: #707070;
          line-height: 1.65;
          margin: 0 0 10px 0;
          padding-left: 27px;
        }
        .cs-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-left: 27px;
        }
        .cs-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.06em;
          color: #505050;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px;
          padding: 2px 7px;
          background: rgba(255,255,255,0.02);
        }

        /* ── bottom call-to-action bar ── */
        .cs-cta-bar {
          margin-top: 80px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          background: rgba(255,255,255,0.015);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .cs-wrap.visible .cs-cta-bar { opacity: 1; transform: none; }

        .cs-cta-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #f0f0f0;
          line-height: 1.4;
        }
        .cs-cta-sub {
          font-size: 0.82rem;
          color: #606060;
          margin-top: 6px;
          font-family: 'Space Grotesk', sans-serif;
        }
        .cs-cta-links {
          display: flex;
          gap: 14px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .cs-cta-btn {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 11px 24px;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }
        .cs-cta-btn:hover { opacity: 0.8; }
        .cs-cta-btn.primary {
          background: #39d9b4;
          color: #000;
          border: 1px solid #39d9b4;
        }
        .cs-cta-btn.ghost {
          background: transparent;
          color: #f0f0f0;
          border: 1px solid rgba(255,255,255,0.15);
        }

        @media (max-width: 640px) {
          .cs-cta-bar { flex-direction: column; align-items: flex-start; padding: 28px 24px; }
          .cs-cta-links { width: 100%; }
          .cs-cta-btn { flex: 1; text-align: center; }
        }
      `}</style>

      <div className="cs-inner">

        {/* Header */}
        <p className="cs-eyebrow">Engineering Capability Stack</p>
        <h2 className="cs-h1">
          I build systems<br />that think, learn &amp; ship.
        </h2>
        <p className="cs-sub">
          From multi-agent pipelines with memory to ML inference in production —
          every layer built end-to-end, with consulting clarity on why it matters.
        </p>

        {/* Body grid */}
        <div className="cs-body">

          {/* LEFT — orbit diagram */}
          <div className="cs-orbit-wrap">
            <p className="cs-orbit-label">Multi-Agent Orchestration System</p>
            <OrbitDiagram />

            {/* layer legend below diagram */}
            <div style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}>
              {[
                { icon: "☁", label: "Cloud Infra", sub: "AWS · GCP · k8s" },
                { icon: "⬡", label: "Full-Stack", sub: "Next.js · FastAPI" },
                { icon: "∿", label: "ML Models", sub: "PyTorch · HuggingFace" },
                { icon: "⟳", label: "Memory Layer", sub: "Vector + KV stores" },
              ].map(item => (
                <div key={item.label} style={{
                  padding: "12px 14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.015)",
                }}>
                  <div style={{ fontSize: 14, marginBottom: 4, color: "rgba(57,217,180,0.6)" }}>{item.icon}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#e0e0e0",
                    marginBottom: 2,
                  }}>{item.label}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: "#505050",
                    letterSpacing: "0.06em",
                  }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — capability cards */}
          <div className="cs-caps">
            {CAPS.map(cap => (
              <div key={cap.num} className="cs-cap">
                <div className="cs-cap-row">
                  <span className="cs-cap-num">{cap.num}</span>
                  <span className="cs-cap-title">{cap.title}</span>
                </div>
                <p className="cs-cap-body">{cap.body}</p>
                <div className="cs-tags">
                  {cap.tags.map(t => <span key={t} className="cs-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div className="cs-cta-bar">
          <div>
            <div className="cs-cta-text">Need this for your business or firm?</div>
            <div className="cs-cta-sub">
              I take on consulting engagements and full-time roles — Deloitte, McKinsey, or early-stage startups.
            </div>
          </div>
          <div className="cs-cta-links">
            <a href="/consulting" className="cs-cta-btn primary">View Consulting Work</a>
            <a href="#contact" className="cs-cta-btn ghost">Get in Touch</a>
          </div>
        </div>

      </div>
    </section>
  );
}
