"use client";
import { useEffect, useRef } from "react";

const experience = [
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
    role: "ML Engineer — Sustainable Chemistry",
    period: "2024",
    highlight: false,
    description:
      "Applied ML to bio-based compound formulation prediction. Built SHAP-explainable XGBoost ensemble models on a 200-row dataset — showing chemists not just what blend works, but which molecular features drive the prediction (φᵢ values per ingredient). Transfer learning from related chemical domains + aggressive feature engineering got R² = 0.89. Extended to NunaFab's bio-composite material formulations. Result: 3× faster R&D cycles, 40% cost reduction.",
  },
];

const skills = [
  "Python", "TypeScript", "React", "Next.js", "Node.js",
  "PyTorch", "TensorFlow", "Scikit-learn",
  "AWS", "Docker", "Kubernetes", "MLflow",
  "FastAPI", "PostgreSQL", "Redis", "Vector DBs",
  "WebRTC", "RAG", "MCP", "ONNX",
];

const capabilities = [
  "Real-time ML inference pipelines",
  "Multi-agent orchestration systems",
  "RAG architectures — cloud & on-premise",
  "Production cloud infrastructure (AWS)",
  "Full-stack web applications",
  "MLOps, CI/CD & drift detection",
];

// TODO: Replace with your actual GitHub URL
const GITHUB_URL = "https://github.com/omkumarsolanki";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting)
          el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
      },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Section rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }} className="reveal">
          <span className="section-index">06 //</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div className="reveal" style={{ marginBottom: 10 }}>
          <span className="label-accent">About</span>
        </div>
        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom: 14 }}>
          The engineer behind{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>the systems.</span>
        </h2>
        <p className="body-lg reveal reveal-d2" style={{ maxWidth: 540, marginBottom: 64 }}>
          Honours BASc in Artificial Intelligence. AWS Academy Graduate.
          I ship production AI — not demos. Every role built the instinct
          to connect systems end-to-end.
        </p>

        {/* Top row — Photo + Bio */}
        <div
          className="reveal reveal-d2"
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 48,
            marginBottom: 64,
            alignItems: "start",
          }}
        >
          {/* Photo */}
          <div>
            {/* Drop your photo as /public/photo.jpg (or profile.jpg) and update src below */}
            <div style={{
              width: 180,
              height: 220,
              border: "1px solid var(--border-mid)",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src="/images/omkumar/Omkumar01.jpeg"
                alt="Om Kumar Solanki"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            </div>

            {/* Social links below photo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              <a
                href="mailto:om@resso.ai"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "var(--muted)", textDecoration: "none",
                  letterSpacing: "0.06em", transition: "color 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                ✉ om@resso.ai
              </a>
              <a
                href="https://www.linkedin.com/in/omkumar-solanki"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "var(--muted)", textDecoration: "none",
                  letterSpacing: "0.06em", transition: "color 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                ↗ LinkedIn
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "var(--muted)", textDecoration: "none",
                  letterSpacing: "0.06em", transition: "color 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                ↗ GitHub
              </a>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                color: "var(--dim)", letterSpacing: "0.06em",
              }}>
                ◎ Ontario, Canada
              </span>
            </div>
          </div>

          {/* Bio text + education */}
          <div>
            <p style={{
              fontSize: "0.92rem", color: "var(--muted)",
              lineHeight: 1.85, marginBottom: 28, fontWeight: 300,
            }}>
              I started building AI systems before the current wave made it fashionable.
              I understand the math — gradient descent, attention mechanisms, RLHF, RAG architectures —
              and I understand what it takes to make them work at 3 AM when the inference pipeline
              is down and someone&apos;s live interview is waiting.
            </p>

            {/* Education */}
            <div style={{ marginBottom: 0 }}>
              <span className="label" style={{ display: "block", marginBottom: 16 }}>Education</span>
              {[
                { school: "Sheridan College", degree: "BASc — Artificial Intelligence (Honours)", note: "AI Minds Board Member, Sheridan EDGE" },
                { school: "AWS Academy", degree: "Cloud Developing Graduate", note: "Dec 2025" },
              ].map(edu => (
                <div key={edu.school} style={{
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 600,
                    fontSize: "0.88rem", color: "var(--cream)", marginBottom: 3,
                  }}>
                    {edu.school}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                    <span className="body-sm" style={{ fontSize: "0.78rem" }}>{edu.degree}</span>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                      color: "var(--dim)", letterSpacing: "0.06em",
                    }}>
                      {edu.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="reveal reveal-d3" style={{ marginBottom: 64 }}>
          <span className="label" style={{ display: "block", marginBottom: 24 }}>Experience</span>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {experience.map((exp, i) => (
              <div
                key={exp.company}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid var(--border)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "0.95rem",
                      color: exp.highlight ? "var(--white)" : "var(--cream)",
                    }}>
                      {exp.url ? (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                          onMouseLeave={e => (e.currentTarget.style.color = exp.highlight ? "var(--white)" : "var(--cream)")}
                        >
                          {exp.company} ↗
                        </a>
                      ) : exp.company}
                    </span>
                    {exp.highlight && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "2px 8px", borderRadius: 2,
                        background: "rgba(57,217,180,0.07)",
                        border: "1px solid rgba(57,217,180,0.15)",
                        fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                        color: "var(--accent)", letterSpacing: "0.08em",
                      }}>
                        <span style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: "var(--accent)",
                          animation: "pulse 2s ease-in-out infinite",
                        }} />
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="body-sm" style={{ fontSize: "0.78rem", marginBottom: 8 }}>
                    {exp.role}
                  </div>
                  <p style={{
                    fontSize: "0.82rem", color: "var(--muted)",
                    lineHeight: 1.75, fontWeight: 300, maxWidth: 600,
                  }}>
                    {exp.description}
                  </p>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "var(--dim)", whiteSpace: "nowrap", letterSpacing: "0.06em",
                }}>
                  {exp.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills + Capabilities — two col */}
        <div
          className="reveal reveal-d4"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}
        >
          {/* Left: Tech stack */}
          <div>
            <span className="label" style={{ display: "block", marginBottom: 20 }}>Technologies</span>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {skills.map(s => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>

          {/* Right: What I build */}
          <div>
            <span className="label" style={{ display: "block", marginBottom: 20 }}>What I build</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {capabilities.map(item => (
                <div
                  key={item}
                  style={{
                    padding: "11px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "color 0.2s",
                    fontWeight: 300,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--cream)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >
                  <span style={{
                    width: 3, height: 3, borderRadius: "50%",
                    background: "var(--accent)", flexShrink: 0, opacity: 0.5,
                  }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          #about [style*="grid-template-columns: 200px"] {
            grid-template-columns: 1fr !important;
          }
          #about [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
