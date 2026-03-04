"use client";
export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─── SCREEN LAYOUT (px-based, no absolute units) ─── */
        body {
          font-family: 'EB Garamond', Georgia, serif;
          background: #d0d0d0;
          color: #000;
          padding: 32px 0 64px;
          font-size: 15px;
          line-height: 1.5;
        }

        .page {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 56px;
          background: #fff;
          box-shadow: 0 4px 40px rgba(0,0,0,0.18);
        }

        /* Header */
        .name {
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-bottom: 6px;
        }
        .contact {
          text-align: center;
          font-size: 13px;
          color: #000;
          line-height: 1.6;
        }
        .contact a { color: #000; text-decoration: none; }
        .contact a:hover { text-decoration: underline; }
        .contact .sep { margin: 0 5px; color: #888; }
        .header-rule {
          border: none;
          border-top: 1.5px solid #000;
          margin: 10px 0 14px;
        }

        /* Section */
        .rs { margin-bottom: 16px; }
        .rs-title {
          font-size: 11px;
          font-variant: small-caps;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-bottom: 0.75px solid #000;
          padding-bottom: 2px;
          margin-bottom: 9px;
          text-transform: lowercase;
        }

        /* Summary */
        .summary { font-size: 14px; line-height: 1.55; }

        /* Skills table */
        .skills-table { width: 100%; border-collapse: collapse; }
        .skills-table td { font-size: 13px; line-height: 1.6; vertical-align: top; padding: 1px 0; }
        .skills-table td:first-child { font-weight: 700; white-space: nowrap; padding-right: 10px; width: 1%; }

        /* Experience */
        .exp-item { margin-bottom: 12px; }
        .exp-row { display: flex; justify-content: space-between; align-items: baseline; }
        .exp-company { font-size: 15px; font-weight: 700; }
        .exp-period { font-size: 13px; font-style: italic; color: #333; }
        .exp-role { font-size: 14px; font-style: italic; margin-bottom: 4px; }
        ul.bullets { padding-left: 18px; margin-top: 3px; }
        ul.bullets li { font-size: 13px; line-height: 1.55; margin-bottom: 3px; list-style-type: disc; }

        /* Education */
        .edu-item { margin-bottom: 9px; }
        .edu-row { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-school { font-size: 15px; font-weight: 700; }
        .edu-year { font-size: 13px; font-style: italic; color: #333; }
        .edu-degree { font-size: 14px; font-style: italic; }
        .edu-note { font-size: 13px; }

        /* Projects */
        .proj-item { margin-bottom: 9px; }
        .proj-row { display: flex; justify-content: space-between; align-items: baseline; }
        .proj-name { font-size: 14px; font-weight: 700; }
        .proj-tech { font-size: 13px; font-style: italic; color: #333; }
        .proj-desc { font-size: 13px; line-height: 1.55; }

        /* Save button */
        .save-btn {
          position: fixed; top: 16px; right: 16px;
          background: #000; color: #fff;
          border: none; padding: 10px 22px;
          font-family: Georgia, serif;
          font-size: 12px; cursor: pointer;
          letter-spacing: 0.06em; z-index: 100;
        }
        .save-btn:hover { background: #222; }

        /* ─── PRINT OVERRIDES (mm/pt only here) ─── */
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { background: #fff; padding: 0; font-size: 10pt; }
          .page {
            max-width: none;
            width: 210mm;
            margin: 0;
            padding: 16mm 20mm;
            box-shadow: none;
          }
          .name { font-size: 26pt; }
          .contact { font-size: 9.5pt; }
          .rs-title { font-size: 9.5pt; }
          .rs { padding: 0; }
          .summary { font-size: 10pt; }
          .skills-table td { font-size: 9.5pt; }
          .exp-company { font-size: 10.5pt; }
          .exp-period, .exp-role { font-size: 9.5pt; }
          ul.bullets li { font-size: 9.5pt; }
          .edu-school { font-size: 10.5pt; }
          .edu-degree, .edu-year, .edu-note { font-size: 9.5pt; }
          .proj-name { font-size: 10pt; }
          .proj-tech, .proj-desc { font-size: 9.5pt; }
          .no-print { display: none; }
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

        <div className="name">Omkumar Solanki</div>
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
        <div className="rs">
          <div className="rs-title">Summary</div>
          <p className="summary">
            Founding Engineer and AI/ML Architect with 3+ years shipping production AI systems that serve real users at scale.
            Built complete ML platforms from zero — WebRTC audio pipelines, real-time inference engines, agentic orchestration,
            and on-premise RAG stacks. Consistently delivers measurable outcomes: 45% improvement in job placement rates,
            75% latency reduction, R² = 0.89 on sparse datasets, 3× faster R&amp;D cycles.
            Owns the full stack from model training and ONNX quantization to cloud infrastructure and product delivery.
          </p>
        </div>

        {/* SKILLS */}
        <div className="rs">
          <div className="rs-title">Technical Skills</div>
          <table className="skills-table">
            <tbody>
              <tr>
                <td>Languages &amp; Frameworks</td>
                <td>Python, TypeScript, Node.js, React, Next.js, FastAPI</td>
              </tr>
              <tr>
                <td>AI / ML</td>
                <td>PyTorch, ONNX, Scikit-learn, XGBoost, Fine-tuning (LoRA/QLoRA), RAG, Speaker Diarization, NLP, SHAP, MLflow, GGUF, HNSW</td>
              </tr>
              <tr>
                <td>Infrastructure</td>
                <td>AWS, Docker, Kubernetes, WebRTC, WebSocket, MCP Protocol, PostgreSQL, Redis, Vector Databases, CI/CD, MLOps</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EXPERIENCE */}
        <div className="rs">
          <div className="rs-title">Experience</div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Resso.ai</span>
              <span className="exp-period">November 2025 — Present</span>
            </div>
            <div className="exp-role">Founding Engineer — AI, ML &amp; Real-Time Systems</div>
            <ul className="bullets">
              <li>Architected and delivered the complete production ML platform from zero, including WebRTC audio ingestion at 8 kHz and a custom speaker diarization pipeline separating candidate and interviewer voices in real time — no third-party dependency.</li>
              <li>Built and shipped live hire-probability scoring model with sub-2-second inference latency during active interviews; improved client job placement rate by 45% within 90 days of deployment.</li>
              <li>Engineered a talking AI avatar system with audio-to-viseme lip-sync mapping and on-device ONNX INT8 quantization; reduced end-to-end inference latency from 8s to under 2s — a 75% improvement — with no GPU requirement.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">HariKrushna Software</span>
              <span className="exp-period">June 2024 — Present</span>
            </div>
            <div className="exp-role">AI Architect &amp; Agentic Software Engineer</div>
            <ul className="bullets">
              <li>Designed and delivered on-premise RAG stacks using GGUF-quantized LLMs and custom HNSW vector stores; achieved 100% data privacy, full offline capability, and sub-1s query latency on standard 16 GB RAM hardware.</li>
              <li>Built production MCP servers integrating AI agents with Slack, CRMs, databases, and internal APIs through a single universal protocol; enabled persistent context memory and parallel tool execution across enterprise systems.</li>
              <li>Designed sigmoid-gated multi-signal MLOps trigger system aggregating drift detection, F1 degradation, time-based signals, and LLM confidence scores into a unified automated retraining pipeline.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Corol.org &amp; NunaFab</span>
              <span className="exp-period">2024</span>
            </div>
            <div className="exp-role">ML Engineer — Sustainable Chemistry</div>
            <ul className="bullets">
              <li>Applied transfer learning from related chemical domains to build a SHAP-explainable XGBoost ensemble on a 200-row sparse dataset; achieved R² = 0.89, exceeding naive baseline by 2.4×.</li>
              <li>Delivered per-ingredient feature attribution (φᵢ) enabling chemists to interpret predictions directly; reduced R&amp;D iteration cycles by 3× and cut formulation costs by 40%.</li>
            </ul>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="rs">
          <div className="rs-title">Education</div>

          <div className="edu-item">
            <div className="edu-row">
              <span className="edu-school">Sheridan College</span>
              <span className="edu-year">2021 — 2025</span>
            </div>
            <div className="edu-degree">Bachelor of Applied Science (Honours) — Artificial Intelligence</div>
            <div className="edu-note">AI Minds Board Member · Sheridan EDGE</div>
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
        <div className="rs">
          <div className="rs-title">Selected Projects</div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Lawline.tech — AI Legal Document Intelligence</span>
              <span className="proj-tech">Live SaaS · Fine-tuned LLM · FastAPI</span>
            </div>
            <div className="proj-desc">Fine-tuned LLM pipeline for clause classification, party identification, obligation extraction, and risk flagging from legal PDFs. Produces confidence-scored structured JSON in under 3 seconds; reduced manual review errors by 60%.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Vadtal — On-Premise RAG Platform</span>
              <span className="proj-tech">GGUF · HNSW · FastAPI · Python</span>
            </div>
            <div className="proj-desc">Complete local RAG stack with GGUF-quantized LLM, custom HNSW vector store, semantic chunking, and cosine similarity retrieval. Fully offline, 100% private, sub-1s query latency on 16 GB RAM.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">MCP Integration Server</span>
              <span className="proj-tech">MCP Protocol · TypeScript · Agentic Systems</span>
            </div>
            <div className="proj-desc">Production MCP server enabling AI agents to interface with any enterprise tool — Slack, CRM, database, APIs — through a single universal protocol with parallel tool calls and persistent context memory.</div>
          </div>
        </div>

      </div>
    </>
  );
}
