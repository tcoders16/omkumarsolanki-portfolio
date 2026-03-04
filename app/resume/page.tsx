"use client";
export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #fff;
          color: #111;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 14mm 16mm 14mm 16mm;
          background: #fff;
        }

        /* ── Header ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 10px;
          border-bottom: 2px solid #111;
          margin-bottom: 12px;
        }
        .header-left h1 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .header-left .title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .header-right {
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: #444;
          line-height: 1.8;
        }
        .header-right a {
          color: #1a6b52;
          text-decoration: none;
        }

        /* ── Sections ── */
        .section { margin-bottom: 14px; }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 4px;
          margin-bottom: 9px;
        }

        /* ── Summary ── */
        .summary {
          font-size: 9.5px;
          color: #222;
          line-height: 1.7;
          max-width: 100%;
        }

        /* ── Experience ── */
        .exp-item { margin-bottom: 11px; }
        .exp-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }
        .exp-company {
          font-size: 11px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.02em;
        }
        .exp-company-accent { color: #1a6b52; }
        .exp-period {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          color: #888;
        }
        .exp-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          font-weight: 500;
          color: #1a6b52;
          margin-bottom: 4px;
          letter-spacing: 0.02em;
        }
        .exp-desc {
          font-size: 9px;
          color: #333;
          line-height: 1.65;
        }
        .exp-bullets {
          margin-top: 4px;
          padding-left: 12px;
        }
        .exp-bullets li {
          font-size: 9px;
          color: #333;
          line-height: 1.65;
          margin-bottom: 2px;
          list-style: none;
          position: relative;
        }
        .exp-bullets li::before {
          content: "·";
          position: absolute;
          left: -10px;
          color: #1a6b52;
          font-weight: 700;
        }

        /* ── Projects ── */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .project-item {
          border: 1px solid #e8e8e8;
          border-left: 3px solid #1a6b52;
          padding: 7px 9px;
          border-radius: 1px;
        }
        .project-item.purple { border-left-color: #7c5cbf; }
        .project-item.amber  { border-left-color: #b8872a; }
        .project-name {
          font-size: 9.5px;
          font-weight: 700;
          color: #111;
          margin-bottom: 1px;
        }
        .project-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7px;
          color: #888;
          margin-bottom: 4px;
        }
        .project-desc {
          font-size: 8.5px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 3px;
        }
        .project-impact {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7px;
          color: #1a6b52;
        }
        .project-item.purple .project-impact { color: #7c5cbf; }
        .project-item.amber .project-impact  { color: #b8872a; }

        /* ── Skills ── */
        .skills-block { margin-bottom: 6px; }
        .skills-block-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          font-weight: 600;
          color: #555;
          margin-bottom: 4px;
          letter-spacing: 0.06em;
        }
        .skills-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          color: #222;
          background: #f4f4f4;
          border: 1px solid #e0e0e0;
          padding: 2px 7px;
          border-radius: 2px;
        }

        /* ── Metrics bar ── */
        .metrics {
          display: flex;
          gap: 0;
          border: 1px solid #e8e8e8;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .metric-item {
          flex: 1;
          padding: 6px 10px;
          text-align: center;
          border-right: 1px solid #e8e8e8;
        }
        .metric-item:last-child { border-right: none; }
        .metric-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #1a6b52;
          line-height: 1;
          display: block;
        }
        .metric-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 6.5px;
          color: #888;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-top: 2px;
        }

        /* ── Print ── */
        @media print {
          body { background: #fff; }
          .page { margin: 0; padding: 12mm 14mm; }
          .no-print { display: none; }
        }

        /* ── Screen helper ── */
        @media screen {
          body { background: #e8e8e8; padding: 20px 0 40px; }
          .print-btn {
            position: fixed; top: 16px; right: 16px;
            background: #111; color: #fff;
            border: none; padding: 10px 20px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px; cursor: pointer;
            border-radius: 2px; z-index: 100;
            letter-spacing: 0.06em;
          }
          .print-btn:hover { background: #1a6b52; }
        }
      `}</style>

      <button className="print-btn no-print" onClick={() => typeof window !== "undefined" && window.print()}>
        PRINT / SAVE PDF ↓
      </button>

      <div className="page">

        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-left">
            <h1>Om Kumar Solanki</h1>
            <div className="title">AI / ML Engineer  ·  Agentic Systems  ·  MLOps</div>
          </div>
          <div className="header-right">
            <div><a href="mailto:emailtosolankiom@gmail.com">emailtosolankiom@gmail.com</a></div>
            <div><a href="https://github.com/omkumarsolanki">github.com/omkumarsolanki</a></div>
            <div><a href="https://www.resso.ai">resso.ai</a></div>
            <div>Canada / Remote</div>
          </div>
        </div>

        {/* ── METRICS ── */}
        <div className="metrics">
          {[
            { v: "3+",    l: "Years Prod AI" },
            { v: "<2s",   l: "Inference Latency" },
            { v: "0.97",  l: "AUC Score" },
            { v: "100%",  l: "Private RAG" },
            { v: "R²=0.89", l: "Chemistry ML" },
          ].map(m => (
            <div key={m.l} className="metric-item">
              <span className="metric-val">{m.v}</span>
              <span className="metric-lbl">{m.l}</span>
            </div>
          ))}
        </div>

        {/* ── SUMMARY ── */}
        <div className="section">
          <div className="section-label">Summary</div>
          <p className="summary">
            Founding Engineer and AI/ML Architect with 3+ years building production AI systems from scratch.
            Designed real-time ML inference pipelines (sub-2s latency), sigmoid-gated agentic trigger architectures,
            on-premise RAG stacks (zero data egress), and MCP-based multi-agent orchestration systems.
            Comfortable owning the full stack — from model training and ONNX quantisation to WebRTC audio pipelines,
            FastAPI inference servers, and AWS infrastructure. Currently building live AI interview intelligence at Resso.ai.
          </p>
        </div>

        {/* ── EXPERIENCE ── */}
        <div className="section">
          <div className="section-label">Experience</div>

          <div className="exp-item">
            <div className="exp-top">
              <span className="exp-company"><span className="exp-company-accent">Resso.ai</span></span>
              <span className="exp-period">Nov 2025 — Present</span>
            </div>
            <div className="exp-role">Founding Engineer — AI, ML &amp; Real-Time Systems</div>
            <ul className="exp-bullets">
              <li>Designed and built the complete production ML platform from zero — WebRTC audio ingestion at 8 kHz, custom speaker diarization pipeline separating candidate and interviewer voices in real time.</li>
              <li>Built NLP feature extraction across prosody, semantics and pace; deployed live hire-probability scorer running at &lt;2s inference latency during active interviews.</li>
              <li>Engineered the talking AI avatar system: audio-to-viseme lip sync, WebSocket event bus, on-device ONNX model quantisation for smooth real-time video rendering.</li>
              <li>Reduced inference latency from 8s → &lt;2s. Job placement rate improved +45%.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-top">
              <span className="exp-company">HariKrushna Software</span>
              <span className="exp-period">Jun 2024 — Present</span>
            </div>
            <div className="exp-role">AI Architect &amp; Agentic Software Engineer</div>
            <ul className="exp-bullets">
              <li>Delivered on-premise RAG stacks (GGUF + HNSW vector store, 100% private, offline-capable) for enterprise clients unable to use cloud AI.</li>
              <li>Built production MCP server integrating AI agents with Slack, CRMs, databases, and internal APIs via a single universal protocol.</li>
              <li>Designed sigmoid-gated multi-signal MLOps trigger systems: drift detection (KL divergence), F1 degradation, time-based, and LLM-confidence triggers driving automated model retraining pipelines.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-top">
              <span className="exp-company">Corol.org &amp; NunaFab</span>
              <span className="exp-period">2024</span>
            </div>
            <div className="exp-role">ML Engineer — Sustainable Chemistry</div>
            <ul className="exp-bullets">
              <li>Built SHAP-explainable XGBoost ensemble on a 200-row dataset using transfer learning from related chemical domains; achieved R² = 0.89.</li>
              <li>Delivered interpretable feature attribution (φᵢ per ingredient) — reducing R&amp;D iteration cycles 3× and costs 40%.</li>
            </ul>
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div className="section">
          <div className="section-label">Key Projects</div>
          <div className="projects-grid">
            <div className="project-item">
              <div className="project-name">Vadtal — Vector DB Platform</div>
              <div className="project-sub">On-Premise RAG · Private AI · Zero Data Egress</div>
              <div className="project-desc">Complete local RAG stack: GGUF quantized LLM on 16 GB RAM, custom HNSW vector store, semantic chunking, cosine similarity search, FastAPI server. 100% offline.</div>
              <div className="project-impact">Sub-1s queries · 100% private · 16 GB RAM</div>
            </div>
            <div className="project-item purple">
              <div className="project-name">MCP Integration Server</div>
              <div className="project-sub">Universal Agentic Tool Layer</div>
              <div className="project-desc">Production MCP server enabling AI agents to speak to any enterprise tool — Slack, CRM, DB, APIs — through one standard protocol with parallel tool calls and context memory.</div>
              <div className="project-impact">1 server · N integrations · persistent context</div>
            </div>
            <div className="project-item purple">
              <div className="project-name">Lawline.tech</div>
              <div className="project-sub">AI-Powered Legal Document Intelligence</div>
              <div className="project-desc">Fine-tuned LLM pipeline for clause classification, party/obligation/risk extraction from legal PDFs. Confidence-scored output flags low-confidence clauses for review.</div>
              <div className="project-impact">&lt;3s processing · 94% accuracy · 60% fewer errors</div>
            </div>
            <div className="project-item amber">
              <div className="project-name">Sigmoid Agentic Trigger System</div>
              <div className="project-sub">MLOps · Automated Model Retraining</div>
              <div className="project-desc">Multi-signal monitoring (drift, F1, time, LLM confidence) aggregated through sigmoid gate. LLM orchestrator decides when to retrain, what to retrain, and routes to retrain agent.</div>
              <div className="project-impact">σ(z) gated · 4-signal · &lt;4h retrain cycle</div>
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="section">
          <div className="section-label">Skills</div>
          <div className="skills-block">
            <div className="skills-block-label">Languages &amp; Frameworks</div>
            <div className="skills-pills">
              {["Python", "TypeScript", "Node.js", "React", "Next.js", "FastAPI"].map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          </div>
          <br />
          <div className="skills-block">
            <div className="skills-block-label">AI / ML</div>
            <div className="skills-pills">
              {["PyTorch", "ONNX", "Scikit-learn", "XGBoost", "Fine-tuning", "LoRA/QLoRA", "RAG", "HNSW", "GGUF", "Speaker Diarization", "NLP", "SHAP", "MLflow"].map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          </div>
          <br />
          <div className="skills-block">
            <div className="skills-block-label">Infrastructure &amp; Tools</div>
            <div className="skills-pills">
              {["AWS", "Docker", "Kubernetes", "WebRTC", "MCP Protocol", "PostgreSQL", "Redis", "Vector DBs", "CI/CD", "MLOps"].map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
