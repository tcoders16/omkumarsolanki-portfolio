"use client";

/**
 * ResumeDocument — single source of truth for Omkumar Solanki's resume.
 *
 * variant="tech"       → AI Engineer / MLOps / Architecture
 * variant="consulting" → AI Consultant / Technology Strategy
 *
 * A4 (210mm × 297mm), print-accurate. Teal #0a7a6a accent.
 * Bullet standard: Verb + action + metric. One clean line each. No filler.
 */

export type ResumeVariant = "tech" | "consulting";

interface Props {
  variant?: ResumeVariant;
  pdfFilename?: string;
  hideSaveBtn?: boolean;
}

const VARIANTS = {
  tech: {
    subtitle: "AI ENGINEER · ML ENGINEER · MLOPS · AGENTIC SYSTEMS · LLM INFRASTRUCTURE",
    expOrder: ["resso", "harikrushna", "corol", "freelance"] as const,
    filename: "Omkumar-Solanki-AI-Engineer-Resume",
  },
  consulting: {
    subtitle: "AI CONSULTANT · TECHNOLOGY STRATEGY · SYSTEMS ENGINEERING · CANADA",
    expOrder: ["harikrushna", "resso", "corol", "freelance"] as const,
    filename: "Omkumar-Solanki-Consulting-Resume",
  },
};

/* ─────────────────────────────────────────────
   EXPERIENCE — tight bullets, one line each
   Format: Verb · what · quantified outcome
───────────────────────────────────────────── */
const EXP = {
  resso: {
    org: "Resso.ai",
    loc: "Remote, Canada",
    role: {
      tech: "AI Engineer / Full-Stack Engineer",
      consulting: "AI Systems Architect & Lead Engineer",
    },
    period: "2025 – Present",
    bullets: {
      tech: [
        "Engineered sub-800ms real-time conversation engine (Azure OpenAI GPT-4o Realtime, Avatar TTS, two-phase VAD); 200+ live sessions served in month one.",
        "Resolved session amnesia — root cause of all high-dropout events — by implementing vector-DB session memory with event-driven context injection; lifted retention 72% → 98% across 500+ sessions.",
        "Architected multi-tenant platform (PostgreSQL, Prisma, Redis, RBAC, 30+ personas) across 4 Azure environments with GitHub Actions CI/CD and i18n for 5 locales.",
        "Built 500-document automated evaluation pipeline tracking hallucination rate, retention %, and P(hire) score; shipped weekly dashboards to product and business stakeholders.",
      ],
      consulting: [
        "Diagnosed 100% of dropout events to stateless architecture (agent re-asked answered questions); implemented Redis sliding-window session layer, lifting retention 72% → 98% — contract renewed and scope expanded mid-engagement.",
        "Delivered weekly client dashboards (retention %, hallucination rate, P(hire) score); success metrics agreed before deployment — zero surprises.",
        "Deployed multi-tenant platform (PostgreSQL, Redis, 4 Azure environments, CI/CD) as a solo engagement — owned every layer from schema to production support.",
      ],
    },
    stack: "Azure OpenAI · GPT-4o Realtime · Avatar TTS · Vector DB · Next.js 15 · Prisma · PostgreSQL · Redis · WebSockets",
  },

  harikrushna: {
    org: "HariKrushna Software Developers",
    loc: "Toronto, Canada",
    role: {
      tech: "Senior AI Consultant",
      consulting: "Senior AI Consultant — Discovery & Architecture",
    },
    period: "Jun 2024 – Present",
    bullets: {
      tech: [
        "Architected on-premise RAG stacks (GGUF, HNSW, Python/Go) for 7 regulated-industry clients; sub-1s query latency on 16 GB hardware with full data sovereignty.",
        "Cut hallucination 14% → 3.8% on a 500-document eval set via LoRA/QLoRA fine-tuning with schema validation and held-out regression testing.",
        "Built production MCP servers routing agents to Slack, CRM, databases, and REST/gRPC; reduced enterprise AI integration time from 4 weeks to 3 days across 5 deployments.",
        "Led technical discovery workshops with founders at 10+ startups; scoped AI roadmaps, selected model architectures, mentored 3 junior ML engineers concurrently.",
      ],
      consulting: [
        "Conducted on-site discovery; identified cloud LLMs violated data sovereignty for all 7 regulated clients — entire vendor market ruled out. Designed air-gapped GGUF/HNSW stacks achieving sub-1s latency on consumer hardware.",
        "Led AI roadmap workshops with 10+ organisations; defined success criteria before any build, selected architectures via constraint mapping, mentored 3 engineers concurrently.",
        "Reduced hallucination 14% → 3.8% via LoRA/QLoRA fine-tuning; presented outcomes as liability reduction and accuracy SLA to client finance teams.",
        "Built production MCP integration servers; cut AI integration time 4 weeks → 3 days across 5 enterprise deployments — reported as cost-per-integration metric to executive stakeholders.",
      ],
    },
    stack: "Python · Go · FastAPI · Claude API · GGUF · HNSW · LoRA/QLoRA · Docker · Kubernetes · AWS",
  },

  corol: {
    org: "Corol.org and NunaFab",
    loc: "Toronto, Canada",
    role: {
      tech: "Machine Learning Engineer",
      consulting: "ML Strategy Consultant & Research Engineer",
    },
    period: "2023 – 2024",
    bullets: {
      tech: [
        "Trained 150-estimator Random Forest (R² = 0.73, 2,200 samples, 25 features) predicting UHPC compressive strength at 3/7/28/90-day horizons; replaced 28-day curing wait with instant predictions.",
        "Exposed predictions via JWT-secured FastAPI with SciPy SLSQP mix optimisation; built Next.js dashboard on Vercel, active daily with 12 research engineers.",
      ],
      consulting: [
        "Embedded 2 days in UHPC lab before modelling; domain-engineered features (W/C ratio, silica fume, fibre dosage) overcame 200-row data constraint — XGBoost ensemble achieved R² = 0.89.",
        "Added SHAP per-prediction attribution; eliminated black-box objection, drove adoption to 12 engineers daily, cut mix evaluation cycle from weeks to one afternoon.",
      ],
    },
    stack: "Python · FastAPI · scikit-learn · XGBoost · SHAP · SciPy SLSQP · Next.js · Recharts · Vercel",
  },

  freelance: {
    org: "Freelance AI Consulting",
    loc: "Remote",
    role: {
      tech: "AI/ML Developer and Cloud Engineer",
      consulting: "AI/ML Developer and Cloud Engineer",
    },
    period: "2021 – 2023",
    bullets: {
      tech: [
        "Built Lawline.tech: 16-agent 5-stage pipeline generating source-linked legal chronologies in 42 seconds; 12,000+ files processed, 94% time saved across 6 practice areas. Air-gapped, zero cloud egress.",
        "Trained XGBoost on 200K+ e-commerce transactions with Optuna HPO; lifted conversion 2.1% → 2.8%, adding ~$180K estimated annual revenue.",
        "Shipped Kafka/Lambda event-driven medical pipeline across 3 hospital systems; freed 120 staff-hours monthly for patient care.",
        "Created Vadtal: HNSW vector store + GGUF-quantized RAG over 50,000+ donor records; sub-1s semantic search, fully offline.",
      ],
      consulting: [
        "Built Lawline.tech — only privilege-compliant legal AI platform; 16 agents, air-gapped, 0 bytes egress, 12,000+ files processed. Opened $1M Rogers investment conversation: no competitor could make the same claim.",
        "Lifted e-commerce conversion 2.1% → 2.8% via XGBoost on 200K+ transactions (Optuna HPO); ~$180K annual revenue uplift presented as board-level ROI.",
        "Freed 120 monthly clinical staff-hours by shipping Kafka/Lambda pipeline across 3 hospital systems; reported to leadership as patient-care hours recovered.",
      ],
    },
    stack: "Python · PyTorch · XGBoost · FastAPI · AWS (Lambda, S3, SageMaker) · Kafka · Docker · PostgreSQL · gRPC",
  },
} as const;

type ExpKey = "resso" | "harikrushna" | "corol" | "freelance";

const PRODUCTS = {
  tech: [
    { name: "Resso.ai",              desc: "Real-time AI conversation platform — avatar interviews, coaching, simulations (Azure OpenAI, Vector DB, multi-tenant, 30+ personas)" },
    { name: "Lawline.tech",          desc: "16-agent legal AI pipeline, air-gapped on-premises, 6 practice areas, 12,000+ files, 0 bytes cloud egress" },
    { name: "Enterprise MCP Server", desc: "Universal AI agent integration layer (Slack, CRM, databases, REST/gRPC) — integration time 4 weeks → 3 days" },
    { name: "Vadtal",                desc: "On-premise RAG platform, HNSW vector store, 50,000+ records — fully offline, sub-1s semantic search" },
    { name: "UHPC-ML",               desc: "Concrete strength prediction dashboard (R² = 0.73, multi-horizon, SHAP, Vercel serverless) — 12 engineers daily" },
  ],
  consulting: [
    { name: "Lawline.tech",          desc: "Air-gapped legal AI, 16 agents, 0 bytes egress — opened $1M Rogers investment conversation; only privilege-compliant solution in the market" },
    { name: "Resso.ai",              desc: "AI interview platform — retention 72% → 98%, contract renewed and expanded mid-engagement" },
    { name: "TTC Lost and Found",    desc: "Civic AI: pgvector cosine similarity, confidence-gated SMS routing, 1.7M daily riders (Capstone · Pitching May 2026)" },
    { name: "Enterprise MCP Server", desc: "Universal agent integration layer — 4 weeks → 3 days across 5 enterprise deployments" },
    { name: "UHPC-ML",               desc: "UHPC concrete predictor (R² = 0.89, SHAP) — mix evaluation weeks → one afternoon, 100s screened computationally" },
  ],
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
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

        /* ── Override dark portfolio globals ── */
        .rd-shell-outer {
          background: #ece9e4;
          padding: 28px 16px 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── A4 PAPER ── */
        .rd-paper {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          padding: 13mm 16mm 18mm;
          box-shadow: 0 2px 32px rgba(0,0,0,.12);
          font-family: 'Inter', sans-serif;
          font-size: 9.5pt;
          line-height: 1.55;
          color: #111;
          -webkit-font-smoothing: antialiased;
        }
        @media (max-width: 840px) {
          .rd-shell-outer { padding: 0; }
          .rd-paper { width: 100%; min-height: unset; padding: 28px 20px 40px; box-shadow: none; }
        }

        /* ── SAVE BUTTON ── */
        .rd-save-btn {
          align-self: flex-end;
          margin-right: calc((100vw - 210mm) / 2 - 16px);
          margin-bottom: 12px;
          background: #0a7a6a; color: #fff; border: none;
          padding: 9px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          cursor: pointer; border-radius: 3px;
          box-shadow: 0 2px 12px rgba(10,122,106,.25);
          transition: background .15s;
        }
        .rd-save-btn:hover { background: #086358; }
        @media (max-width: 840px) { .rd-save-btn { display: none; } }

        /* ── NAME ── */
        .rd-name {
          font-family: 'Syne', sans-serif;
          font-size: 28pt; font-weight: 800;
          color: #0d0d0d; letter-spacing: -.025em; line-height: 1;
          margin-bottom: 5pt;
        }
        .rd-subtitle {
          font-size: 7pt; font-weight: 600;
          letter-spacing: .24em; text-transform: uppercase;
          color: #222; margin-bottom: 7pt;
        }
        .rd-contact {
          font-size: 8pt; color: #888;
          display: flex; flex-wrap: wrap; align-items: center;
        }
        .rd-contact a { color: #888; text-decoration: none; }
        .rd-contact a:hover { color: #222; }
        .rd-ca { color: #0a7a6a !important; }
        .rd-sep { margin: 0 6pt; color: #d8d4ce; }

        /* ── DIVIDER ── */
        .rd-hr { height: 1px; background: #ddd; margin: 9pt 0 11pt; }

        /* ── SECTION HEAD ── */
        .rd-sec { margin-bottom: 12pt; }
        .rd-sec:last-child { margin-bottom: 0; }
        .rd-sec-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 6.5pt; font-weight: 700;
          letter-spacing: .28em; text-transform: uppercase;
          color: #0a7a6a; margin-bottom: 3pt;
        }
        .rd-rule { height: 1px; background: #0a7a6a; opacity: .5; margin-bottom: 9pt; }

        /* ── EXPERIENCE ENTRY ── */
        .rd-exp { margin-bottom: 11pt; }
        .rd-exp:last-child { margin-bottom: 0; }

        .rd-exp-top {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 8pt; margin-bottom: 1.5pt;
        }
        .rd-exp-org {
          font-family: 'Syne', sans-serif;
          font-size: 11pt; font-weight: 700; color: #0d0d0d;
        }
        .rd-exp-loc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7pt; color: #bbb; white-space: nowrap; flex-shrink: 0;
        }
        .rd-exp-mid {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 8pt; margin-bottom: 6pt;
        }
        .rd-exp-role { font-size: 9pt; font-weight: 600; color: #0a7a6a; }
        .rd-exp-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7pt; color: #bbb; white-space: nowrap; flex-shrink: 0;
        }

        /* ── BULLETS ── */
        .rd-blist { list-style: none; padding: 0; }
        .rd-blist li {
          font-size: 9pt; color: #3a3a3a; line-height: 1.52;
          padding-left: 11pt; position: relative; margin-bottom: 3pt;
        }
        .rd-blist li:last-child { margin-bottom: 0; }
        .rd-blist li::before {
          content: "▸"; position: absolute; left: 0;
          color: #0a7a6a; font-size: 7pt; top: 2.5pt;
        }
        .rd-blist li strong { color: #0d0d0d; font-weight: 600; }

        /* ── STACK LINE ── */
        .rd-stack {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5pt; color: #b0b0a8; margin-top: 5pt; line-height: 1.5;
        }

        /* ── PRODUCTS ── */
        .rd-plist { list-style: none; padding: 0; }
        .rd-plist li {
          font-size: 9pt; color: #444; line-height: 1.55;
          margin-bottom: 3.5pt; padding-left: 11pt; position: relative;
        }
        .rd-plist li:last-child { margin-bottom: 0; }
        .rd-plist li::before {
          content: "▸"; position: absolute; left: 0;
          color: #0a7a6a; font-size: 7pt; top: 2.5pt;
        }
        .rd-pname { font-weight: 700; color: #0d0d0d; }

        /* ── EDUCATION ── */
        .rd-edu {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20pt;
        }
        @media (max-width: 520px) { .rd-edu { grid-template-columns: 1fr; gap: 10pt; } }
        .rd-edu-inst {
          font-family: 'Syne', sans-serif;
          font-size: 10.5pt; font-weight: 700; color: #0d0d0d; margin-bottom: 2pt;
        }
        .rd-edu-deg { font-size: 8.5pt; color: #555; line-height: 1.4; margin-bottom: 2pt; }
        .rd-edu-note { font-family: 'JetBrains Mono', monospace; font-size: 7pt; color: #b0b0a8; }

        /* ── PRINT ── */
        @media print {
          .rd-save-btn { display: none !important; }
          .rd-shell-outer { background: #fff; padding: 0; }
          .rd-paper {
            width: 210mm; min-height: 297mm;
            padding: 13mm 16mm 16mm;
            box-shadow: none;
            font-size: 9pt;
          }
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="rd-shell-outer">
        {!hideSaveBtn && (
          <button className="rd-save-btn" onClick={handleSave}>⬇ Save PDF</button>
        )}

        <div className="rd-paper">

          {/* NAME */}
          <div className="rd-name">Omkumar Solanki</div>
          <div className="rd-subtitle">{V.subtitle}</div>
          <div className="rd-contact">
            <a href="mailto:emailtosolankiom@gmail.com">emailtosolankiom@gmail.com</a>
            <span className="rd-sep">|</span>
            <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" target="_blank" rel="noreferrer" className="rd-ca">LinkedIn</a>
            <span className="rd-sep">|</span>
            <a href="https://omkumarsolanki.com" target="_blank" rel="noreferrer" className="rd-ca">omkumarsolanki.com</a>
            <span className="rd-sep">|</span>
            <a href="https://lawline.tech" target="_blank" rel="noreferrer" className="rd-ca">lawline.tech</a>
            <span className="rd-sep">|</span>
            <span>Toronto / Oakville, ON</span>
          </div>

          <div className="rd-hr" />

          {/* EXPERIENCE */}
          <div className="rd-sec">
            <div className="rd-sec-lbl">E&thinsp;X&thinsp;P&thinsp;E&thinsp;R&thinsp;I&thinsp;E&thinsp;N&thinsp;C&thinsp;E</div>
            <div className="rd-rule" />

            {(V.expOrder as readonly ExpKey[]).map(key => {
              const e = EXP[key];
              const role    = variant === "consulting" ? e.role.consulting   : e.role.tech;
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
                  <ul className="rd-blist">
                    {(bullets as readonly string[]).map((b, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                    ))}
                  </ul>
                  <div className="rd-stack">{e.stack}</div>
                </div>
              );
            })}
          </div>

          {/* LIVE PRODUCTS */}
          <div className="rd-sec">
            <div className="rd-sec-lbl">L&thinsp;I&thinsp;V&thinsp;E&ensp;P&thinsp;R&thinsp;O&thinsp;D&thinsp;U&thinsp;C&thinsp;T&thinsp;S</div>
            <div className="rd-rule" />
            <ul className="rd-plist">
              {PRODUCTS[variant].map((p, i) => (
                <li key={i}><span className="rd-pname">{p.name}</span> — {p.desc}</li>
              ))}
            </ul>
          </div>

          {/* EDUCATION */}
          <div className="rd-sec">
            <div className="rd-sec-lbl">E&thinsp;D&thinsp;U&thinsp;C&thinsp;A&thinsp;T&thinsp;I&thinsp;O&thinsp;N&ensp;A&thinsp;N&thinsp;D&ensp;C&thinsp;E&thinsp;R&thinsp;T&thinsp;I&thinsp;F&thinsp;I&thinsp;C&thinsp;A&thinsp;T&thinsp;I&thinsp;O&thinsp;N&thinsp;S</div>
            <div className="rd-rule" />
            <div className="rd-edu">
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

        </div>
      </div>
    </>
  );
}
