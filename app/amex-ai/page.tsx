"use client";
export default function AmexAIPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #efefed;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: #1a1a1a;
          font-size: 13px;
          line-height: 1.5;
          padding: 28px 0 56px;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          padding: 40px 50px 44px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.07);
          border-top: 3px solid #1a6648;
        }

        /* HEADER */
        .name {
          font-family: 'Syne', sans-serif;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111;
          margin-bottom: 2px;
        }
        .headline {
          font-size: 10.5px;
          font-weight: 600;
          color: #1a6648;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .contact {
          font-size: 11.5px;
          color: #777;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
        .contact a { color: #777; text-decoration: none; }
        .contact a:hover { color: #222; }
        .contact a.link { color: #1a6648; font-weight: 500; }
        .contact a.link:hover { color: #125036; }
        .contact a.email { color: #333; font-weight: 600; }
        .contact a.email:hover { color: #111; }
        .contact a.site {
          color: #1a6648;
          font-weight: 600;
          font-style: italic;
          border-bottom: 1.5px solid #1a6648;
          padding-bottom: 1px;
        }
        .contact a.site:hover { color: #125036; border-color: #125036; }
        .sep { margin: 0 7px; color: #ddd; font-weight: 300; }

        .rule {
          border: none;
          border-top: 1px solid #e8e8e8;
          margin: 10px 0 14px;
        }

        /* SECTION */
        .rs { margin-bottom: 16px; }
        .rs-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #1a6648;
          padding-bottom: 4px;
          border-bottom: 1.5px solid #1a6648;
          margin-bottom: 10px;
        }

        /* EXPERIENCE */
        .exp-item { margin-bottom: 14px; }
        .exp-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1px;
        }
        .exp-company {
          font-size: 13px;
          font-weight: 700;
          color: #111;
          font-family: 'Syne', sans-serif;
        }
        .exp-loc {
          font-size: 10px;
          color: #bbb;
          font-family: 'JetBrains Mono', monospace;
        }
        .exp-role-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 5px;
        }
        .exp-role {
          font-size: 11.5px;
          color: #1a6648;
          font-weight: 600;
        }
        .exp-period {
          font-size: 10px;
          color: #bbb;
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
        }
        ul.bullets { padding-left: 14px; }
        ul.bullets li {
          font-size: 11.5px;
          line-height: 1.55;
          margin-bottom: 2px;
          color: #444;
          list-style: disc;
        }
        ul.bullets li::marker { color: #c5dfd5; }
        .tech-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          color: #999;
          margin-top: 4px;
        }

        /* PROJECTS */
        .proj-item { margin-bottom: 9px; }
        .proj-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 10px;
        }
        .proj-name { font-size: 12px; font-weight: 700; color: #111; }
        .proj-tech {
          font-size: 9.5px;
          color: #bbb;
          font-family: 'JetBrains Mono', monospace;
          text-align: right;
          white-space: nowrap;
        }
        .proj-desc { font-size: 11px; color: #666; line-height: 1.55; margin-top: 1px; }

        /* EDUCATION */
        .edu-row { display: flex; gap: 36px; }
        .edu-item { flex: 1; }
        .edu-inst { font-size: 12.5px; font-weight: 700; color: #111; }
        .edu-deg  { font-size: 11px; color: #555; margin-top: 1px; }
        .edu-note {
          font-size: 10px;
          color: #999;
          margin-top: 2px;
          font-family: 'JetBrains Mono', monospace;
        }

        /* SAVE BUTTON */
        .save-btn {
          position: fixed; top: 16px; right: 16px;
          background: #1a6648; color: #fff;
          border: none; padding: 9px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; cursor: pointer;
          letter-spacing: 0.1em; text-transform: uppercase;
          font-weight: 600; z-index: 100; border-radius: 2px;
          box-shadow: 0 2px 10px rgba(26,102,72,0.25);
        }
        .save-btn:hover { background: #155539; }

        /* PRINT */
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { background: #fff; padding: 0; font-size: 9pt; }
          .page {
            max-width: none; width: 210mm; margin: 0;
            padding: 11mm 15mm; box-shadow: none;
            border-top: 2.5pt solid #1a6648;
          }
          .name { font-size: 18pt; }
          .headline { font-size: 7pt; }
          .contact { font-size: 8pt; }
          .rs-title { font-size: 6.5pt; }
          .rs { margin-bottom: 9pt; }
          .exp-item { margin-bottom: 7pt; }
          .exp-company { font-size: 10pt; }
          .exp-role { font-size: 8pt; }
          .exp-period, .exp-loc { font-size: 7pt; }
          ul.bullets li { font-size: 7.5pt; line-height: 1.4; margin-bottom: 1.5pt; }
          .tech-line { font-size: 6.5pt; }
          .proj-name { font-size: 8pt; }
          .proj-tech, .proj-desc { font-size: 7pt; }
          .edu-inst { font-size: 9pt; }
          .edu-deg, .edu-note { font-size: 7.5pt; }
          .no-print { display: none; }
        }
      `}</style>

      <button
        className="save-btn no-print"
        onClick={() => {
          if (typeof window === "undefined") return;
          const prev = document.title;
          document.title = "Omkumar-Solanki-AI-Engineer-Resume";
          window.print();
          document.title = prev;
        }}
      >
        Save PDF
      </button>

      <div className="page">

        {/* HEADER */}
        <div className="name">Omkumar Solanki</div>
        <div className="headline">AI Engineer · ML Engineer · MLOps · Agentic Systems · LLM Infrastructure</div>
        <div className="contact">
          <a href="mailto:emailtosolankiom@gmail.com" className="email">emailtosolankiom@gmail.com</a>
          <span className="sep">|</span>
          <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" className="link">LinkedIn</a>
          <span className="sep">|</span>
          <a href="https://www.omkumarsolanki.com" className="site"><em>omkumarsolanki.com</em></a>
          <span className="sep">|</span>
          <a href="https://www.lawline.tech" className="site"><em>lawline.tech</em></a>
          <span className="sep">|</span>
          <span>Toronto / Oakville, ON</span>
        </div>
        <hr className="rule" />

        {/* EXPERIENCE */}
        <div className="rs">
          <div className="rs-title">Experience</div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Resso.ai</span>
              <span className="exp-loc">Remote, Canada</span>
            </div>
            <div className="exp-role-row">
              <span className="exp-role">AI Engineer / Full-Stack Engineer</span>
              <span className="exp-period">2025 - Present</span>
            </div>
            <ul className="bullets">
              <li>Existing interview platforms lacked real-time AI with persistent context and video. Engineered a sub-800ms conversation engine (Azure OpenAI Realtime API, GPT-4o, Avatar TTS, two-phase VAD) powering live AI avatar interviews, coaching, and training simulations; 200+ sessions served in the first month.</li>
              <li>Conversations lost context after 10 minutes. Implemented a vector database session memory with event-driven triggers (silence timeout, barge-in, topic-switch) that inject prior context into the agent prompt; retention rose from 72% to 98% across 500+ sessions.</li>
              <li>Partnered with product and design to ship a multi-tenant platform (PostgreSQL, Prisma, PgBouncer, Redis) with RBAC, 30+ AI personas, and session lifecycle tracking; deployed across 4 Azure environments with GitHub Actions CI/CD and i18n in 5 locales.</li>
            </ul>
            <div className="tech-line">Azure OpenAI · GPT-4o · Avatar TTS · Vector DB · Next.js 15 · Prisma · PostgreSQL · Redis · WebSockets</div>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">HariKrushna Software Developers</span>
              <span className="exp-loc">Ontario, Canada</span>
            </div>
            <div className="exp-role-row">
              <span className="exp-role">Senior AI Consultant</span>
              <span className="exp-period">Jun 2024 - Present</span>
            </div>
            <ul className="bullets">
              <li>Clients in regulated industries (healthcare, legal, finance) could not send proprietary data to cloud LLMs. Architected on-premise RAG stacks (GGUF-quantized models, HNSW vector stores, semantic chunking) in Python and Go; 7 clients deployed with sub-1s query latency on 16 GB hardware and full data sovereignty.</li>
              <li>Enterprise teams managed AI integrations through fragmented custom code. Created production MCP servers connecting agents to Slack, CRM, databases, and REST/gRPC APIs via a universal protocol; reduced integration time from 4 weeks to 3 days across 5 deployments.</li>
              <li>Off-the-shelf LLMs hallucinated on client-specific terminology at a 14% rate. Ran LoRA/QLoRA fine-tuning pipelines with schema validation and held-out test monitoring; drove hallucination down to 3.8% on a 500-document evaluation set for a fintech client.</li>
              <li>Led technical discovery and architecture workshops with founders and product teams at 10+ startups; scoped AI roadmaps, selected model architectures, and mentored 3 junior ML engineers across concurrent engagements.</li>
            </ul>
            <div className="tech-line">Python · Go · FastAPI · Claude API · GGUF · HNSW · Docker · Kubernetes · AWS</div>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Corol.org and NunaFab</span>
              <span className="exp-loc">Ontario, Canada</span>
            </div>
            <div className="exp-role-row">
              <span className="exp-role">Machine Learning Engineer</span>
              <span className="exp-period">2023 - 2024</span>
            </div>
            <ul className="bullets">
              <li>Lab testing of concrete mixes required 28-day curing cycles before engineers knew if a batch met ACI 239R standards. Trained a 150-estimator Random Forest ensemble (R2 = 0.73) on 2,200 samples with 25 features to predict compressive strength at 3, 7, 28, and 90 days; replaced 4 weeks of lab waiting with instant predictions and 95% confidence intervals.</li>
              <li>Worked with materials scientists to expose the model via a JWT-secured REST API (FastAPI) with mix optimization (SciPy SLSQP), sensitivity analysis, and a React dashboard (Next.js 16) with real-time prediction cards; deployed as a Vercel serverless function used by 12 research engineers daily.</li>
            </ul>
            <div className="tech-line">Python · FastAPI · scikit-learn · SciPy · Next.js 16 · Recharts · Vercel</div>
          </div>

          <div className="exp-item">
            <div className="exp-row">
              <span className="exp-company">Freelance AI Consulting</span>
              <span className="exp-loc">Remote</span>
            </div>
            <div className="exp-role-row">
              <span className="exp-role">AI/ML Developer and Cloud Engineer</span>
              <span className="exp-period">2021 - 2023</span>
            </div>
            <ul className="bullets">
              <li>Law firms spent 6-8 hours reviewing 800-page case files. Built and launched Lawline.tech: 16 AI agents in a 5-stage pipeline producing source-linked chronologies in 42 seconds; 12,000+ files processed, 94% time saved across 6 practice areas. Air-gapped on-prem.</li>
              <li>A religious organization managed 50,000+ donor records in spreadsheets with no search. Created Vadtal with a custom HNSW vector store and RAG pipeline (GGUF-quantized LLM); sub-1s semantic search, fully offline.</li>
              <li>An e-commerce client had a 2.1% conversion rate with no personalization. Trained XGBoost models on 200K+ transactions with Optuna HPO; conversion rose to 2.8%, adding an estimated $180K annual revenue.</li>
              <li>Clinical staff at a healthcare startup spent 120+ hours monthly on manual record processing. Shipped an event-driven pipeline (Kafka, Lambda) for ingestion and alerting across 3 hospital systems; freed 120 hours monthly for patient care.</li>
            </ul>
            <div className="tech-line">Python · PyTorch · XGBoost · FastAPI · AWS · Kafka · Docker · PostgreSQL · gRPC</div>
          </div>
        </div>

        {/* LIVE PRODUCTS */}
        <div className="rs">
          <div className="rs-title">Live Products</div>
          <div style={{fontSize: '11.5px', color: '#444', lineHeight: '1.7'}}>
            <strong style={{color: '#111'}}>Resso.ai</strong> - Real-time AI conversation platform: avatar interviews, coaching, training simulations (Azure OpenAI, Vector DB, multi-tenant)
            <br/>
            <strong style={{color: '#111'}}>Lawline.tech</strong> - AI legal intelligence with 16 agentic agents, air-gapped on-prem, 6 practice areas
            <br/>
            <strong style={{color: '#111'}}>Vadtal</strong> - On-premise RAG platform with HNSW vector store over 50,000+ records, fully offline
            <br/>
            <strong style={{color: '#111'}}>Enterprise MCP Server</strong> - Universal AI agent integration layer (Slack, CRM, databases, REST/gRPC)
            <br/>
            <strong style={{color: '#111'}}>UHPC-ML</strong> - Concrete strength prediction dashboard (R2 = 0.73, multi-horizon forecasts, Vercel serverless)
          </div>
        </div>

        {/* EDUCATION */}
        <div className="rs" style={{marginBottom: 0}}>
          <div className="rs-title">Education and Certifications</div>
          <div className="edu-row">
            <div className="edu-item">
              <div className="edu-inst">Sheridan College</div>
              <div className="edu-deg">Bachelor of Applied Science (Honours), Artificial Intelligence</div>
              <div className="edu-note">AI Minds Club, Board Member · Sheridan EDGE Programme</div>
            </div>
            <div className="edu-item">
              <div className="edu-inst">AWS Academy</div>
              <div className="edu-deg">Cloud Developing Graduate Certificate</div>
              <div className="edu-note">EC2 · S3 · Lambda · SageMaker · IAM · CloudWatch</div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
