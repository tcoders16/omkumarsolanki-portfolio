"use client";
export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'EB Garamond', Georgia, serif;
          background: #fff;
          color: #000;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 18mm 20mm;
          background: #fff;
        }

        /* ── Header ── */
        .name {
          text-align: center;
          font-size: 26pt;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .contact {
          text-align: center;
          font-size: 10pt;
          color: #000;
          line-height: 1.6;
        }
        .contact a { color: #000; text-decoration: none; }
        .contact .sep { margin: 0 6px; }
        .header-rule {
          border: none;
          border-top: 2px solid #000;
          margin: 10px 0 14px;
        }

        /* ── Section ── */
        .section { margin-bottom: 14px; }
        .section-title {
          font-size: 11pt;
          font-variant: small-caps;
          font-weight: 700;
          letter-spacing: 0.06em;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
          margin-bottom: 8px;
          text-transform: lowercase;
        }

        /* ── Summary ── */
        .summary {
          font-size: 10.5pt;
          line-height: 1.55;
        }

        /* ── Experience ── */
        .exp-item { margin-bottom: 10px; }
        .exp-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .exp-company {
          font-size: 11pt;
          font-weight: 700;
        }
        .exp-period {
          font-size: 10pt;
          font-style: italic;
        }
        .exp-role {
          font-size: 10.5pt;
          font-style: italic;
          margin-bottom: 4px;
        }
        ul.bullets {
          padding-left: 18px;
          margin-top: 2px;
        }
        ul.bullets li {
          font-size: 10pt;
          line-height: 1.55;
          margin-bottom: 2px;
          list-style-type: disc;
        }

        /* ── Education ── */
        .edu-item { margin-bottom: 8px; }
        .edu-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .edu-school { font-size: 11pt; font-weight: 700; }
        .edu-year   { font-size: 10pt; font-style: italic; }
        .edu-degree { font-size: 10.5pt; font-style: italic; }
        .edu-note   { font-size: 10pt; }

        /* ── Projects ── */
        .proj-item  { margin-bottom: 8px; }
        .proj-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .proj-name  { font-size: 10.5pt; font-weight: 700; }
        .proj-tech  { font-size: 10pt; font-style: italic; }
        .proj-desc  { font-size: 10pt; line-height: 1.55; }

        /* ── Skills ── */
        .skills-row { font-size: 10.5pt; line-height: 1.7; }
        .skills-row strong { font-weight: 700; }

        /* ── Print ── */
        @media print {
          body { background: #fff; }
          .page { margin: 0; padding: 15mm 18mm; }
          .no-print { display: none; }
        }

        /* ── Screen ── */
        @media screen {
          body { background: #d6d6d6; padding: 30px 0 60px; }
          .save-btn {
            position: fixed; top: 16px; right: 16px;
            background: #000; color: #fff;
            border: none; padding: 10px 20px;
            font-family: Georgia, serif;
            font-size: 12px; cursor: pointer;
            letter-spacing: 0.04em; z-index: 100;
          }
          .save-btn:hover { background: #333; }
        }
      `}</style>

      <button
        className="save-btn no-print"
        onClick={() => {
          if (typeof window === "undefined") return;
          const prev = document.title;
          document.title = "Omkumar-Solanki-Resume";
          window.print();
          document.title = prev;
        }}
      >
        Save PDF ↓
      </button>

      <div className="page">

        {/* NAME */}
        <div className="name">Om Kumar Solanki</div>
        <div className="contact">
          <a href="mailto:emailtosolankiom@gmail.com">emailtosolankiom@gmail.com</a>
          <span className="sep">|</span>
          <a href="https://www.linkedin.com/in/omkumarsolanki">linkedin.com/in/omkumarsolanki</a>
          <span className="sep">|</span>
          <a href="https://github.com/omkumarsolanki">github.com/omkumarsolanki</a>
          <span className="sep">|</span>
          <a href="https://www.omkumarsolanki.com">omkumarsolanki.com</a>
          <span className="sep">|</span>
          Ontario, Canada
        </div>
        <hr className="header-rule" />

        {/* SUMMARY */}
        <div className="section">
          <div className="section-title">Summary</div>
          <p className="summary">
            Founding Engineer and AI/ML Architect with 3+ years of experience building production AI systems.
            Specializes in real-time ML inference pipelines, agentic architectures, on-premise RAG stacks, and
            full-stack AI applications. Designed and shipped systems that run in production with real users and
            real consequences — from WebRTC audio ingestion pipelines to sigmoid-gated multi-agent orchestration.
            Comfortable owning the full stack from model training and ONNX quantization to cloud infrastructure.
          </p>
        </div>

        {/* EXPERIENCE */}
        <div className="section">
          <div className="section-title">Experience</div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Resso.ai</span>
              <span className="exp-period">November 2025 — Present</span>
            </div>
            <div className="exp-role">Founding Engineer — AI, ML &amp; Real-Time Systems</div>
            <ul className="bullets">
              <li>Designed and built the complete production ML platform from zero, including WebRTC audio ingestion at 8 kHz and a custom speaker diarization pipeline separating candidate and interviewer voices in real time.</li>
              <li>Deployed live hire-probability scoring model with sub-2-second inference latency during active interviews; improved job placement rate by 45%.</li>
              <li>Engineered a talking AI avatar system using audio-to-viseme lip-sync mapping, WebSocket event bus, and on-device ONNX model quantization for real-time video rendering.</li>
              <li>Reduced end-to-end inference latency from 8s to under 2s through pipeline optimization and INT8 quantization.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">HariKrushna Software</span>
              <span className="exp-period">June 2024 — Present</span>
            </div>
            <div className="exp-role">AI Architect &amp; Agentic Software Engineer</div>
            <ul className="bullets">
              <li>Delivered on-premise RAG stacks using GGUF-quantized LLMs and HNSW vector stores — 100% private, offline-capable, with sub-1s query latency on 16 GB RAM.</li>
              <li>Built production MCP servers integrating AI agents with Slack, CRMs, databases, and internal APIs through a single universal protocol with persistent context memory.</li>
              <li>Designed sigmoid-gated multi-signal MLOps trigger systems aggregating drift detection, F1 degradation, time-based signals, and LLM confidence scores to drive automated retraining pipelines.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Corol.org &amp; NunaFab</span>
              <span className="exp-period">2024</span>
            </div>
            <div className="exp-role">ML Engineer — Sustainable Chemistry</div>
            <ul className="bullets">
              <li>Built SHAP-explainable XGBoost ensemble on 200-row dataset using transfer learning from related chemical domains; achieved R² = 0.89 and reduced R&amp;D iteration cycles by 3× with 40% cost reduction.</li>
              <li>Delivered interpretable feature attribution (φᵢ per ingredient) enabling chemists to understand which molecular features drive predictions.</li>
            </ul>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="section">
          <div className="section-title">Education</div>

          <div className="edu-item">
            <div className="edu-row">
              <span className="edu-school">Sheridan College</span>
              <span className="edu-year">2021 — 2025</span>
            </div>
            <div className="edu-degree">Bachelor of Applied Science (Honours) — Artificial Intelligence</div>
            <div className="edu-note">AI Minds Board Member, Sheridan EDGE</div>
          </div>

          <div className="edu-item">
            <div className="edu-row">
              <span className="edu-school">AWS Academy</span>
              <span className="edu-year">December 2025</span>
            </div>
            <div className="edu-degree">Cloud Developing Graduate Certificate</div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="section">
          <div className="section-title">Selected Projects</div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Lawline.tech — AI Legal Document Intelligence</span>
              <span className="proj-tech">Live SaaS Product</span>
            </div>
            <div className="proj-desc">Fine-tuned LLM pipeline for clause classification, party identification, obligation extraction, and risk flagging from legal PDFs. Confidence-scored structured JSON output in under 3 seconds. Reduced manual review errors by 60%.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Vadtal — On-Premise RAG Platform</span>
              <span className="proj-tech">GGUF · HNSW · FastAPI</span>
            </div>
            <div className="proj-desc">Complete local RAG stack with GGUF-quantized LLM, custom HNSW vector store, semantic chunking, and cosine similarity search. Fully offline, 100% private, sub-1s query latency on 16 GB RAM.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">MCP Integration Server</span>
              <span className="proj-tech">MCP Protocol · Agentic Systems</span>
            </div>
            <div className="proj-desc">Production MCP server enabling AI agents to interface with any enterprise tool — Slack, CRM, database, APIs — through a single universal protocol with parallel tool calls and persistent context memory.</div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="section">
          <div className="section-title">Skills</div>
          <div className="skills-row"><strong>Languages &amp; Frameworks:</strong> Python, TypeScript, Node.js, React, Next.js, FastAPI</div>
          <div className="skills-row"><strong>AI / ML:</strong> PyTorch, ONNX, Scikit-learn, XGBoost, Fine-tuning, LoRA/QLoRA, RAG, HNSW, GGUF, Speaker Diarization, NLP, SHAP, MLflow</div>
          <div className="skills-row"><strong>Infrastructure:</strong> AWS, Docker, Kubernetes, WebRTC, MCP Protocol, PostgreSQL, Redis, Vector Databases, CI/CD, MLOps</div>
        </div>

      </div>
    </>
  );
}
