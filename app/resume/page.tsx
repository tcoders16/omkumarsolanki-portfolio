"use client";
export default function ResumePage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: Georgia, 'Times New Roman', serif;
          background: #d0d0d0;
          color: #000;
          padding: 24px 0 48px;
          font-size: 13px;
          line-height: 1.35;
        }

        .page {
          max-width: 740px;
          margin: 0 auto;
          padding: 36px 44px;
          background: #fff;
          box-shadow: 0 4px 40px rgba(0,0,0,0.18);
        }

        /* Header */
        .name {
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .contact {
          text-align: center;
          font-size: 11.5px;
          color: #000;
          line-height: 1.5;
        }
        .contact a { color: #000; text-decoration: none; }
        .contact a:hover { text-decoration: underline; }
        .contact .sep { margin: 0 4px; color: #999; }
        .header-rule {
          border: none;
          border-top: 1px solid #000;
          margin: 7px 0 10px;
        }

        /* Section */
        .rs { margin-bottom: 11px; }
        .rs-title {
          font-size: 9.5px;
          font-variant: small-caps;
          font-weight: 700;
          letter-spacing: 0.12em;
          border-bottom: 0.5px solid #000;
          padding-bottom: 1px;
          margin-bottom: 6px;
          text-transform: lowercase;
        }

        /* Experience */
        .exp-item { margin-bottom: 8px; }
        .exp-row { display: flex; justify-content: space-between; align-items: baseline; }
        .exp-company { font-size: 13px; font-weight: 700; }
        .exp-period { font-size: 11.5px; font-style: italic; color: #333; }
        .exp-role { font-size: 12px; font-style: italic; margin-bottom: 2px; }
        ul.bullets { padding-left: 15px; margin-top: 2px; }
        ul.bullets li { font-size: 11.5px; line-height: 1.4; margin-bottom: 2px; list-style-type: disc; }

        /* Education */
        .edu-item { margin-bottom: 6px; }
        .edu-row { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-school { font-size: 13px; font-weight: 700; }
        .edu-year { font-size: 11.5px; font-style: italic; color: #333; }
        .edu-degree { font-size: 12px; font-style: italic; }
        .edu-note { font-size: 11.5px; }

        /* Projects */
        .proj-item { margin-bottom: 6px; }
        .proj-row { display: flex; justify-content: space-between; align-items: baseline; }
        .proj-name { font-size: 12px; font-weight: 700; }
        .proj-tech { font-size: 11.5px; font-style: italic; color: #333; }
        .proj-desc { font-size: 11.5px; line-height: 1.4; }

        /* Save button */
        .save-btn {
          position: fixed; top: 16px; right: 16px;
          background: #000; color: #fff;
          border: none; padding: 8px 18px;
          font-family: Georgia, serif;
          font-size: 11px; cursor: pointer;
          letter-spacing: 0.06em; z-index: 100;
        }
        .save-btn:hover { background: #222; }

        /* ─── PRINT OVERRIDES (mm/pt only here) ─── */
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { background: #fff; padding: 0; font-size: 9pt; line-height: 1.3; }
          .page {
            max-width: none;
            width: 210mm;
            margin: 0;
            padding: 12mm 16mm;
            box-shadow: none;
          }
          .name { font-size: 20pt; }
          .contact { font-size: 8.5pt; }
          .rs-title { font-size: 8pt; }
          .rs { margin-bottom: 8pt; }
          .exp-item { margin-bottom: 6pt; }
          .exp-company { font-size: 9.5pt; }
          .exp-period, .exp-role { font-size: 8.5pt; }
          ul.bullets li { font-size: 8.5pt; line-height: 1.35; }
          .edu-degree, .edu-year, .edu-note { font-size: 8.5pt; }
          .proj-name { font-size: 9pt; }
          .proj-tech, .proj-desc { font-size: 8.5pt; }
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
          <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/">LinkedIn</a>
          <span className="sep">|</span>
          <a href="https://x.com/SolankiOmkumar">X</a>
          <span className="sep">|</span>
          <a href="https://www.omkumarsolanki.com">omkumarsolanki.com</a>
          <span className="sep">|</span>
          <a href="https://maps.google.com/?q=Oakville,+Ontario,+Canada">Oakville, Canada</a>
        </div>
        <hr className="header-rule" />

        {/* EXPERIENCE */}
        <div className="rs">
          <div className="rs-title">Experience</div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Resso.ai</span>
              <span className="exp-period">November 2025 - Present</span>
            </div>
            <div className="exp-role">Founding Engineer - AI, ML &amp; Real-Time Systems</div>
            <ul className="bullets">
              <li>Architected the complete production ML platform from zero: WebRTC audio ingestion at 8 kHz, custom speaker diarization pipeline separating candidate and interviewer voices in real time with no third-party dependency.</li>
              <li>Designed and shipped live hire-probability scoring model powered by logistic regression with sigmoid output; achieved sub-2-second end-to-end inference latency during active interviews, improving client job placement rate by 45% within 90 days.</li>
              <li>Built sigmoid-gated agentic pipeline: model output drives downstream actions (schedule interview, update CRM, trigger next agent, send recruiter notification) or skips entirely - zero wasted compute below threshold.</li>
              <li>Engineered talking AI avatar with audio-to-viseme lip-sync mapping and on-device ONNX INT8 quantization; reduced inference latency from 8 s to under 2 s (75% reduction) with no GPU requirement.</li>
              <li>Designed MLOps retraining trigger bus aggregating data drift, F1 degradation, time-based signals, and LLM confidence into a sigmoid-gated automated retraining pipeline; eliminated manual intervention entirely.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">HariKrushna Software</span>
              <span className="exp-period">June 2024 - Present</span>
            </div>
            <div className="exp-role">AI Consultant &amp; Software Developer</div>
            <ul className="bullets">
              <li>Designed and delivered on-premise RAG stacks using GGUF-quantized LLMs and custom HNSW vector stores with semantic chunking and cosine similarity retrieval; achieved 100% data privacy, full offline capability, and sub-1 s query latency on 16 GB RAM commodity hardware.</li>
              <li>Built production MCP servers connecting AI agents to Slack, CRMs, databases, and internal REST APIs through a single universal protocol; enabled persistent context memory, parallel tool execution, and zero vendor lock-in across enterprise systems.</li>
              <li>Implemented LoRA/QLoRA fine-tuning pipelines for domain-specific LLMs; reduced hallucination rate on proprietary document corpora by calibrating temperature and sampling against held-out validation sets.</li>
              <li>Delivered end-to-end agentic orchestration layer with tool-use, memory, and multi-step planning; integrated Claude API with custom function-calling schemas for autonomous workflow execution.</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Corol.org &amp; NunaFab</span>
              <span className="exp-period">2024</span>
            </div>
            <div className="exp-role">ML Engineer - Sustainable Chemistry</div>
            <ul className="bullets">
              <li>Applied transfer learning from related chemical domains to build a SHAP-explainable XGBoost ensemble on a 200-row sparse dataset; achieved R² = 0.89, exceeding naive baseline by 2.4×.</li>
              <li>Delivered per-ingredient SHAP feature attribution (φᵢ) enabling chemists to interpret model predictions directly without ML expertise; reduced R&amp;D iteration cycles by 3× and cut formulation costs by 40%.</li>
              <li>Engineered feature engineering pipeline handling sparse tabular data: median imputation, domain-specific interaction terms, and cross-validated hyperparameter tuning via Optuna.</li>
              <li>Solved cold-start problem on 200-sample dataset using transfer learning from adjacent chemical property datasets; validated generalization with stratified k-fold cross-validation preventing data leakage on small corpora.</li>
              <li>Packaged trained pipeline as an interactive Streamlit dashboard with SHAP waterfall visualizations; enabled non-technical chemists to interpret ingredient impact scores directly, eliminating dependency on ML team for routine formulation decisions.</li>
            </ul>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="rs">
          <div className="rs-title">Education</div>

          <div className="edu-item">
            <div className="edu-degree" style={{ fontWeight: 700, fontStyle: "normal", fontSize: "13px" }}>Sheridan College</div>
            <div className="edu-degree">Bachelor of Applied Science (Honours) - Artificial Intelligence</div>
            <div className="edu-note">AI Minds Board Member · Sheridan EDGE</div>
          </div>

          <div className="edu-item">
            <div className="edu-degree" style={{ fontWeight: 700, fontStyle: "normal", fontSize: "13px" }}>AWS Academy</div>
            <div className="edu-degree">Cloud Developing Graduate Certificate</div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="rs">
          <div className="rs-title">Selected Projects</div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Lawline.tech - AI Legal Document Intelligence</span>
              <span className="proj-tech">Live SaaS · Fine-tuned LLM · FastAPI</span>
            </div>
            <div className="proj-desc">Fine-tuned LLM pipeline for clause classification, party identification, obligation extraction, and risk flagging from legal PDFs. Produces confidence-scored structured JSON in under 3 seconds; reduced manual review errors by 60%.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">Vadtal - On-Premise RAG Platform</span>
              <span className="proj-tech">GGUF · HNSW · FastAPI · Python</span>
            </div>
            <div className="proj-desc">Complete local RAG stack with GGUF-quantized LLM, custom HNSW vector store, semantic chunking, and cosine similarity retrieval. Fully offline, 100% private, sub-1s query latency on 16 GB RAM.</div>
          </div>

          <div className="proj-item">
            <div className="proj-row">
              <span className="proj-name">MCP Integration Server</span>
              <span className="proj-tech">MCP Protocol · TypeScript · Agentic Systems</span>
            </div>
            <div className="proj-desc">Production MCP server enabling AI agents to interface with any enterprise tool (Slack, CRM, database, APIs) through a single universal protocol with parallel tool calls and persistent context memory.</div>
          </div>
        </div>

      </div>
    </>
  );
}
