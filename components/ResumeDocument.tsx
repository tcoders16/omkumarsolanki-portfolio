"use client";

/**
 * ResumeDocument — single source of truth for Omkumar Solanki's resume.
 *
 * variant="tech"        → AI Engineer / MLOps / Architecture framing
 * variant="consulting"  → AI Consultant / Technology Strategy framing
 *
 * Design: A4 (210mm × 297mm), print-accurate, world-class typography.
 * Style reference: top-tier AI/ML engineering and management consulting resumes —
 * McKinsey, DeepMind, Waymo, OpenAI, Stripe, BCG, Deloitte digital.
 *
 * Rules:
 *  - Every bullet: Action Verb → What Was Built/Done → Quantified Outcome
 *  - No filler words. Every sentence earns its line.
 *  - Teal #0a7a6a accent (section rules + role titles) — one accent colour only.
 *  - Syne 800 for name + company headings. Inter for body. JetBrains Mono for meta.
 */

export type ResumeVariant = "tech" | "consulting";

interface Props {
  variant?: ResumeVariant;
  pdfFilename?: string;
  hideSaveBtn?: boolean;
}

/* ── VARIANT CONFIG ── */
const VARIANTS = {
  tech: {
    subtitle: "AI ENGINEER · ML ENGINEER · MLOPS · AGENTIC SYSTEMS · LLM INFRASTRUCTURE",
    summary: "AI and full-stack engineer with a track record of shipping production systems that generate measurable business outcomes. Built and deployed multi-agent orchestration, real-time conversational AI, and on-premise RAG stacks across legal, EdTech, civil engineering, and transit verticals. Owns the full stack — from Azure OpenAI API contracts to PostgreSQL schemas to React dashboards — and runs POCs all the way to production without hand-offs.",
    expOrder: ["resso", "harikrushna", "corol", "freelance"] as const,
    filename: "Omkumar-Solanki-AI-Engineer-Resume",
  },
  consulting: {
    subtitle: "AI CONSULTANT · TECHNOLOGY STRATEGY · SYSTEMS ENGINEERING · CANADA",
    summary: "AI consultant with four cross-industry engagements delivered end-to-end across Legal AI, EdTech, Civil Engineering, and Public Transit. Operates discovery-first — 2–3 days on-site with clients before any architecture decision. Translates business constraints into technology strategy and presents outcomes in CFO-legible metrics: $1M investment conversation opened, 72% → 98% context retention, attorney-client privilege maintained at zero data egress.",
    expOrder: ["harikrushna", "resso", "corol", "freelance"] as const,
    filename: "Omkumar-Solanki-Consulting-Resume",
  },
};

/* ── EXPERIENCE DATA ── */
/*
 * Writing standard (McKinsey / DeepMind):
 *   [Strong verb] [specific action with technical precision] [quantified outcome]; [supporting detail].
 *   No "I". No "responsible for". No passive voice. Every sentence proves value.
 */
const EXP = {
  resso: {
    org: "Resso.ai",
    loc: "Remote, Canada",
    role: { tech: "AI Engineer / Full-Stack Engineer", consulting: "AI Systems Architect & Lead Engineer" },
    period: "2025 – Present",
    bullets: {
      tech: [
        "Engineered a sub-800ms real-time conversation engine (Azure OpenAI GPT-4o Realtime API, Avatar TTS, two-phase VAD) powering AI avatar interviews, coaching, and training simulations; served 200+ live sessions in the first month at production scale.",
        "Resolved session amnesia — the root cause of 100% of high-dropout sessions — by implementing a vector-database session memory with event-driven context injection (silence timeout, barge-in, topic-switch); lifted context retention from 72% to 98% across 500+ sessions.",
        "Architected and deployed a multi-tenant platform (PostgreSQL, Prisma, PgBouncer, Redis) with RBAC, 30+ AI personas, and session lifecycle tracking across 4 Azure environments; added GitHub Actions CI/CD pipeline and i18n support for 5 locales.",
        "Built and maintained a 500-document automated evaluation pipeline monitoring hallucination rate, retention %, and P(hire) scores per session; shipped weekly performance dashboards to product and business stakeholders.",
      ],
      consulting: [
        "Diagnosed root cause of high student dropout through session-level analysis: the AI agent was stateless and re-asked questions already answered, triggering 100% of dropout events. Designed and implemented a Redis sliding-window session layer; context retention rose from 72% to 98% across 500+ sessions — contract renewed and scope expanded mid-engagement.",
        "Shipped 5 configurable interview personas and a 500-document automated evaluation pipeline; delivered weekly business-legible dashboards (retention %, error rate, P(hire) score) to client stakeholders with no surprises.",
        "Deployed a multi-tenant platform (PostgreSQL, Redis, 4 Azure environments, GitHub Actions CI/CD) as a solo engagement; every layer owned from schema to production support.",
      ],
    },
    stack: "Azure OpenAI · GPT-4o Realtime · Avatar TTS · Vector DB · Next.js 15 · Prisma · PostgreSQL · Redis · WebSockets",
  },

  harikrushna: {
    org: "HariKrushna Software Developers",
    loc: "Ontario, Canada",
    role: { tech: "Senior AI Consultant", consulting: "Senior AI Consultant — Discovery & Architecture" },
    period: "Jun 2024 – Present",
    bullets: {
      tech: [
        "Architected on-premise RAG stacks (GGUF-quantized LLMs, HNSW vector stores, semantic chunking) for 7 clients in regulated industries (legal, healthcare, finance) who could not use cloud inference; delivered sub-1s query latency on 16 GB consumer hardware with full data sovereignty.",
        "Reduced LLM hallucination from 14% to 3.8% on a 500-document evaluation set by running LoRA/QLoRA fine-tuning pipelines with schema validation, held-out test monitoring, and regression testing — for a fintech client with zero tolerance for factual error.",
        "Built production MCP servers connecting AI agents to Slack, CRM, databases, and REST/gRPC APIs via a universal routing protocol; cut enterprise AI integration time from 4 weeks to 3 days across 5 deployments.",
        "Led technical discovery and architecture workshops with founders and engineering teams at 10+ startups; scoped AI roadmaps, defined evaluation criteria, selected model architectures, and mentored 3 junior ML engineers across concurrent engagements.",
      ],
      consulting: [
        "Conducted on-site discovery with clients in regulated industries; identified that cloud LLM vendors structurally violated data sovereignty requirements — ruling out the entire market. Designed air-gapped RAG stacks (GGUF, HNSW, Python/Go) deployed on 16 GB hardware at 7 client sites with full data sovereignty and sub-1s query latency.",
        "Led architecture workshops and AI roadmap sessions with founders and product teams at 10+ organisations; defined measurable success criteria before implementation, selected model architectures based on constraint mapping, and mentored 3 junior engineers across concurrent engagements.",
        "Reduced LLM hallucination from 14% to 3.8% on a 500-document evaluation set through LoRA/QLoRA fine-tuning with schema validation and held-out monitoring; presented outcomes in business terms (liability reduction, accuracy SLA) to client finance teams.",
        "Built production MCP integration servers; reduced AI integration time from 4 weeks to 3 days across 5 enterprise deployments — presented as a cost-per-integration metric to executive stakeholders.",
      ],
    },
    stack: "Python · Go · FastAPI · Claude API · GGUF · HNSW · LoRA/QLoRA · Docker · Kubernetes · AWS",
  },

  corol: {
    org: "Corol.org and NunaFab",
    loc: "Ontario, Canada",
    role: { tech: "Machine Learning Engineer", consulting: "ML Strategy Consultant & Research Engineer" },
    period: "2023 – 2024",
    bullets: {
      tech: [
        "Trained a 150-estimator Random Forest ensemble (R² = 0.73, 2,200 samples, 25 features) to predict UHPC compressive strength at 3, 7, 28, and 90-day horizons; replaced 28-day physical curing cycles with instant predictions and 95% confidence intervals.",
        "Exposed the model via a JWT-secured FastAPI REST endpoint with SciPy SLSQP mix optimisation and sensitivity analysis; built a Next.js dashboard with real-time prediction cards deployed to Vercel, used daily by 12 research engineers.",
      ],
      consulting: [
        "Embedded with structural engineers for 2 days before modelling; identified that domain-informed feature engineering (W/C ratio, silica fume %, fibre dosage, curing age) could overcome the 200-row data constraint. Trained an XGBoost ensemble achieving R² = 0.89 — engineers now validate on a single physical mix rather than dozens.",
        "Added a SHAP interpretability layer surfacing per-prediction feature attribution; eliminated the black-box objection, drove adoption to 12 engineers daily, and reduced mix evaluation cycle from weeks to a single afternoon — 100s of formulations screened computationally per session.",
      ],
    },
    stack: "Python · FastAPI · scikit-learn · XGBoost · SHAP · SciPy SLSQP · Next.js · Recharts · Vercel",
  },

  freelance: {
    org: "Freelance AI Consulting",
    loc: "Remote",
    role: { tech: "AI/ML Developer and Cloud Engineer", consulting: "AI/ML Developer and Cloud Engineer" },
    period: "2021 – 2023",
    bullets: {
      tech: [
        "Built and launched Lawline.tech — 16 AI agents orchestrated in a 5-stage pipeline (Ingest, Extract, Reason, Generate, Verify) producing source-linked legal chronologies in 42 seconds; processed 12,000+ case files across 6 practice areas, saving 94% of manual review time. Deployed air-gapped on-premises: zero cloud egress.",
        "Trained XGBoost models on 200K+ e-commerce transactions with Optuna hyperparameter optimisation; lifted conversion rate from 2.1% to 2.8%, generating an estimated $180K additional annual revenue for the client.",
        "Shipped an event-driven medical record pipeline (Kafka, AWS Lambda) across 3 hospital systems; freed 120 staff-hours monthly for direct patient care.",
        "Created Vadtal: custom HNSW vector store with GGUF-quantized RAG pipeline over 50,000+ donor records; sub-1s semantic search, fully offline, no cloud dependency.",
      ],
      consulting: [
        "Built Lawline.tech — the only AI legal intelligence platform that maintains attorney-client privilege. 16 agents in a 5-stage pipeline, air-gapped on-premises, zero data egress; 12,000+ files processed, 94% time saved. Translated the compliance constraint into a $1M investment conversation with the Rogers President: no competitor could make the same claim.",
        "Diagnosed an e-commerce conversion problem (2.1%, no personalization model) through data analysis; trained XGBoost on 200K+ transactions with Optuna HPO, lifting conversion to 2.8% — estimated $180K additional annual revenue presented as a board-level ROI metric.",
        "Reduced 120 staff-hours of monthly manual medical record processing to zero by shipping a Kafka/Lambda event-driven pipeline across 3 hospital systems; outcome reported to clinical leadership as hours freed for patient care.",
      ],
    },
    stack: "Python · PyTorch · XGBoost · FastAPI · AWS (Lambda, S3, SageMaker) · Kafka · Docker · PostgreSQL · gRPC",
  },
} as const;

type ExpKey = "resso" | "harikrushna" | "corol" | "freelance";

const PRODUCTS = {
  tech: [
    { name: "Resso.ai", desc: "Real-time AI conversation platform: avatar interviews, coaching, training simulations — Azure OpenAI, Vector DB, multi-tenant, 30+ personas" },
    { name: "Lawline.tech", desc: "16-agent legal AI pipeline, air-gapped on-premises, 6 practice areas, 12,000+ files processed, 0 bytes cloud egress" },
    { name: "Enterprise MCP Server", desc: "Universal AI agent integration layer (Slack, CRM, databases, REST/gRPC); integration time 4 weeks → 3 days across 5 deployments" },
    { name: "Vadtal", desc: "On-premise RAG platform with HNSW vector store over 50,000+ records — fully offline, sub-1s semantic search" },
    { name: "UHPC-ML", desc: "Concrete strength prediction dashboard (R² = 0.73, multi-horizon forecasts, SHAP, Vercel serverless) — 12 engineers daily" },
  ],
  consulting: [
    { name: "Lawline.tech", desc: "Air-gapped legal AI, 16 agents, 6 practice areas, 0 bytes data egress — opened $1M Rogers investment conversation; only privilege-compliant product in the market" },
    { name: "Resso.ai", desc: "AI interview platform — 72% → 98% context retention, contract renewed and expanded mid-engagement" },
    { name: "TTC Lost and Found", desc: "Civic AI: pgvector cosine similarity + confidence-gated SMS routing for 1.7M daily riders (Capstone · Pitching May 2026)" },
    { name: "Enterprise MCP Server", desc: "Universal agent integration layer — 4 weeks → 3 days integration time, 5 enterprise deployments" },
    { name: "UHPC-ML", desc: "UHPC concrete predictor (R² = 0.89, SHAP): mix evaluation cycle weeks → one afternoon, 100s of mixes screened computationally" },
  ],
};

/* ── COMPONENT ── */
export default function ResumeDocument({ variant = "tech", pdfFilename, hideSaveBtn = false }: Props) {
  const V = VARIANTS[variant];
  const fname = pdfFilename ?? V.filename;

  const handleSave = () => {
    if (typeof window === "undefined") return;
    const prev = document.title;
    document.title = fname;
    window.print();
    document.title = prev;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        /* ─── SCREEN WRAPPER ─── */
        .rd-shell {
          min-height: 100vh;
          background: #e8e5e0;
          padding: 32px 16px 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ─── A4 PAPER ─── */
        /* 210mm × 297mm at 96dpi = 794px × 1123px */
        .rd-paper {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          padding: 14mm 16mm 16mm;
          box-shadow: 0 4px 40px rgba(0,0,0,.14);
          font-family: 'Inter', sans-serif;
          font-size: 9.5pt;
          line-height: 1.55;
          color: #111;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }
        @media (max-width: 840px) {
          .rd-paper {
            width: 100%;
            min-height: unset;
            padding: 28px 20px 36px;
          }
        }

        /* ─── SAVE BUTTON ─── */
        .rd-save-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #0a7a6a;
          color: #fff;
          border: none;
          padding: 9px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 3px;
          box-shadow: 0 2px 14px rgba(10,122,106,.3);
          margin-bottom: 14px;
          align-self: flex-end;
          margin-right: calc((100% - 210mm) / 2);
        }
        .rd-save-btn:hover { background: #086358; }
        @media (max-width: 840px) { .rd-save-btn { margin-right: 0; } }

        /* ─── NAME BLOCK ─── */
        .rd-name {
          font-family: 'Syne', sans-serif;
          font-size: 28pt;
          font-weight: 800;
          color: #0d0d0d;
          letter-spacing: -.025em;
          line-height: 1;
          margin-bottom: 5pt;
        }
        .rd-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 7pt;
          font-weight: 600;
          letter-spacing: .24em;
          text-transform: uppercase;
          color: #222;
          margin-bottom: 7pt;
        }
        .rd-contact-row {
          font-size: 8pt;
          color: #777;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0;
          margin-bottom: 0;
        }
        .rd-contact-row a { color: #777; text-decoration: none; }
        .rd-contact-row a:hover { color: #222; }
        .rd-ca { color: #0a7a6a !important; font-weight: 500; }
        .rd-sep { margin: 0 6pt; color: #ccc; }

        /* ─── DIVIDER ─── */
        .rd-divider {
          height: 1px;
          background: #ddd;
          margin: 9pt 0 11pt;
        }

        /* ─── SECTION HEAD ─── */
        .rd-sec { margin-bottom: 13pt; }
        .rd-sec:last-child { margin-bottom: 0; }
        .rd-sec-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 6.5pt;
          font-weight: 700;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: #0a7a6a;
          margin-bottom: 3pt;
        }
        .rd-rule {
          height: 1px;
          background: #0a7a6a;
          opacity: .55;
          margin-bottom: 10pt;
        }

        /* ─── EXPERIENCE ─── */
        .rd-exp { margin-bottom: 11pt; }
        .rd-exp:last-child { margin-bottom: 0; }
        .rd-exp-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8pt;
          margin-bottom: 1.5pt;
        }
        .rd-exp-org {
          font-family: 'Syne', sans-serif;
          font-size: 11pt;
          font-weight: 700;
          color: #0d0d0d;
        }
        .rd-exp-loc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7pt;
          color: #bbb;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rd-exp-mid {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8pt;
          margin-bottom: 5pt;
        }
        .rd-exp-role {
          font-size: 9pt;
          font-weight: 600;
          color: #0a7a6a;
        }
        .rd-exp-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7pt;
          color: #bbb;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ─── BULLETS ─── */
        .rd-bullets { list-style: none; padding: 0; }
        .rd-bullets li {
          font-size: 9pt;
          color: #333;
          line-height: 1.52;
          padding-left: 11pt;
          position: relative;
          margin-bottom: 3.5pt;
        }
        .rd-bullets li:last-child { margin-bottom: 0; }
        .rd-bullets li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #0a7a6a;
          font-size: 7pt;
          top: 2.5pt;
        }
        .rd-bullets li strong { color: #0d0d0d; font-weight: 600; }

        /* ─── TECH STACK ─── */
        .rd-stack {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5pt;
          color: #aaa;
          margin-top: 5pt;
          line-height: 1.5;
        }

        /* ─── PRODUCTS ─── */
        .rd-prod-list { list-style: none; padding: 0; }
        .rd-prod-list li {
          font-size: 9pt;
          color: #444;
          line-height: 1.55;
          margin-bottom: 3.5pt;
          padding-left: 11pt;
          position: relative;
        }
        .rd-prod-list li:last-child { margin-bottom: 0; }
        .rd-prod-list li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #0a7a6a;
          font-size: 7pt;
          top: 2.5pt;
        }
        .rd-prod-name { font-weight: 700; color: #0d0d0d; }

        /* ─── EDUCATION ─── */
        .rd-edu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20pt;
        }
        @media (max-width: 500px) { .rd-edu-grid { grid-template-columns: 1fr; gap: 10pt; } }
        .rd-edu-inst {
          font-family: 'Syne', sans-serif;
          font-size: 10.5pt;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 2pt;
        }
        .rd-edu-deg { font-size: 8.5pt; color: #555; line-height: 1.4; margin-bottom: 2pt; }
        .rd-edu-note {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7pt;
          color: #aaa;
        }

        /* ─── SUMMARY ─── */
        .rd-summary {
          font-size: 9pt;
          color: #444;
          line-height: 1.6;
        }
        .rd-summary strong { color: #111; font-weight: 600; }

        /* ─── PRINT ─── */
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { background: #fff; margin: 0; padding: 0; }
          .rd-shell { background: #fff; padding: 0; display: block; }
          .rd-save-btn { display: none !important; }
          .rd-paper {
            width: 210mm;
            min-height: 297mm;
            padding: 13mm 16mm 16mm;
            box-shadow: none;
            font-size: 9pt;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="rd-shell">
        {!hideSaveBtn && (
          <button className="rd-save-btn" onClick={handleSave}>
            ⬇ Save PDF
          </button>
        )}

        <div className="rd-paper">

          {/* ── NAME BLOCK ── */}
          <div className="rd-name">Omkumar Solanki</div>
          <div className="rd-subtitle">{V.subtitle}</div>
          <div className="rd-contact-row">
            <a href="mailto:emailtosolankiom@gmail.com">emailtosolankiom@gmail.com</a>
            <span className="rd-sep">|</span>
            <a href="https://www.linkedin.com/in/omkumarsolanki" target="_blank" rel="noreferrer" className="rd-ca">LinkedIn</a>
            <span className="rd-sep">|</span>
            <a href="https://www.omkumarsolanki.com" target="_blank" rel="noreferrer" className="rd-ca">omkumarsolanki.com</a>
            <span className="rd-sep">|</span>
            <a href="https://lawline.tech" target="_blank" rel="noreferrer" className="rd-ca">lawline.tech</a>
            <span className="rd-sep">|</span>
            <span>Toronto / Oakville, ON</span>
          </div>

          <div className="rd-divider" />

          {/* ── SUMMARY ── */}
          <div className="rd-sec" style={{ marginBottom: "12pt" }}>
            <p className="rd-summary">{V.summary}</p>
          </div>

          {/* ── EXPERIENCE ── */}
          <div className="rd-sec">
            <div className="rd-sec-label">E&thinsp;X&thinsp;P&thinsp;E&thinsp;R&thinsp;I&thinsp;E&thinsp;N&thinsp;C&thinsp;E</div>
            <div className="rd-rule" />

            {(V.expOrder as readonly ExpKey[]).map((key) => {
              const e = EXP[key];
              const role = variant === "consulting" ? e.role.consulting : e.role.tech;
              const bullets = variant === "consulting" ? e.bullets.consulting : e.bullets.tech;
              return (
                <div key={key} className="rd-exp">
                  <div className="rd-exp-top">
                    <span className="rd-exp-org">{e.org}</span>
                    <span className="rd-exp-loc">{e.loc}</span>
                  </div>
                  <div className="rd-exp-mid">
                    <span className="rd-exp-role">{role}</span>
                    <span className="rd-exp-date">{e.period}</span>
                  </div>
                  <ul className="rd-bullets">
                    {bullets.map((b, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                    ))}
                  </ul>
                  <div className="rd-stack">{e.stack}</div>
                </div>
              );
            })}
          </div>

          {/* ── LIVE PRODUCTS ── */}
          <div className="rd-sec">
            <div className="rd-sec-label">L&thinsp;I&thinsp;V&thinsp;E&ensp;P&thinsp;R&thinsp;O&thinsp;D&thinsp;U&thinsp;C&thinsp;T&thinsp;S</div>
            <div className="rd-rule" />
            <ul className="rd-prod-list">
              {PRODUCTS[variant].map((p, i) => (
                <li key={i}>
                  <span className="rd-prod-name">{p.name}</span> — {p.desc}
                </li>
              ))}
            </ul>
          </div>

          {/* ── EDUCATION ── */}
          <div className="rd-sec">
            <div className="rd-sec-label">E&thinsp;D&thinsp;U&thinsp;C&thinsp;A&thinsp;T&thinsp;I&thinsp;O&thinsp;N&ensp;A&thinsp;N&thinsp;D&ensp;C&thinsp;E&thinsp;R&thinsp;T&thinsp;I&thinsp;F&thinsp;I&thinsp;C&thinsp;A&thinsp;T&thinsp;I&thinsp;O&thinsp;N&thinsp;S</div>
            <div className="rd-rule" />
            <div className="rd-edu-grid">
              <div>
                <div className="rd-edu-inst">Sheridan College</div>
                <div className="rd-edu-deg">Bachelor of Applied Science (Honours), Artificial Intelligence</div>
                <div className="rd-edu-note">AI Minds Club, Board Member · Sheridan EDGE Programme</div>
              </div>
              <div>
                <div className="rd-edu-inst">AWS Academy</div>
                <div className="rd-edu-deg">Cloud Developing Graduate Certificate</div>
                <div className="rd-edu-note">EC2 · S3 · Lambda · SageMaker · IAM · CloudWatch</div>
              </div>
            </div>
          </div>

        </div>{/* end rd-paper */}
      </div>
    </>
  );
}
