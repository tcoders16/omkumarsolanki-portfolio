"use client";
import { useState, useEffect, useRef } from "react";

/* ── Floating checklist ── */
const checklist = [
  { req: "Problem Structuring & MECE Thinking",  metric: "4 industries · hypothesis-first" },
  { req: "Client Discovery & Requirements",       metric: "On-site before any code" },
  { req: "Stakeholder Alignment",                 metric: "Weekly eval dashboards · sign-offs" },
  { req: "Cross-Industry Experience",             metric: "Legal · EdTech · Eng · Transit" },
  { req: "Data-Driven Business Case",             metric: "$1M conversation · renewed contracts" },
  { req: "AI / Technology Strategy",              metric: "P&L framing, not feature lists" },
  { req: "End-to-End Delivery",                   metric: "Solo: scoping → prod → P0 support" },
  { req: "Executive Communication",               metric: "Briefs that close the room" },
];

const TICKER_ITEMS = [
  { label: "Context Retention",   val: "72% → 98%",     sub: "Resso.ai" },
  { label: "Hallucination",       val: "14% → 3.8%",    sub: "LLM engineering" },
  { label: "Data Egress",         val: "0 bytes",        sub: "Lawline · Air-gapped" },
  { label: "Investment Unlocked", val: "$1M",            sub: "Rogers President" },
  { label: "Rider Base",          val: "1.7M / day",    sub: "TTC Lost and Found" },
  { label: "Prediction R²",       val: "0.89",           sub: "Corol · UHPC ML" },
  { label: "P0 Incident",        val: "24 min",          sub: "Resolved in prod" },
  { label: "Lab Cycle",           val: "Weeks → 1 day", sub: "UHPC screening" },
];

export default function ConsultingResume() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [listOpen, setListOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setTimerActive(false); setChecked(new Set()); return 300; }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : (next.add(i), !timerActive && startTimer());
    setChecked(next);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#f0ede8; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; color:#111; }

        /* TICKER */
        .ticker-wrap { position:sticky; top:0; z-index:300; }
        .ticker-bar  { background:#111; border-bottom:3px solid #1d4ed8; display:flex; height:48px; overflow:hidden; }
        .tick-label  { flex-shrink:0; background:#1d4ed8; color:#fff; padding:0 20px; display:flex; align-items:center; gap:8px; min-width:150px; }
        .tick-label-dot { width:9px; height:9px; border-radius:50%; background:#fff; animation:tblink .8s infinite; }
        @keyframes tblink { 0%,100%{opacity:1}50%{opacity:.05} }
        .tick-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; letter-spacing:.04em; text-transform:uppercase; }
        .tick-track { flex:1; overflow:hidden; display:flex; align-items:center; }
        .tick-inner { display:flex; white-space:nowrap; animation:tscroll 48s linear infinite; }
        .tick-inner:hover { animation-play-state:paused; }
        @keyframes tscroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .tick-item  { display:inline-flex; align-items:center; gap:10px; padding:0 36px; font-size:13px; color:#aaa; }
        .tick-item strong { color:#fff; font-weight:700; }
        .tick-sep   { color:#1d4ed8; font-weight:700; }

        /* CHECKLIST FLOAT */
        .float-wrap { position:fixed; right:18px; top:50%; transform:translateY(-50%); z-index:400; width:290px; }
        .float-btn  { width:100%; background:#1d4ed8; color:#fff; border:none; padding:11px 16px; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }
        .float-body { background:#fff; border:1.5px solid #dde8ff; border-top:none; border-radius:0 0 10px 10px; overflow:hidden; }
        .float-head { background:#f4f8ff; padding:10px 14px; border-bottom:1px solid #e4edff; }
        .float-htitle { font-family:'Syne',sans-serif; font-size:12px; font-weight:700; color:#1d4ed8; }
        .float-hsub   { font-family:'JetBrains Mono',monospace; font-size:9px; color:#999; margin-top:2px; letter-spacing:.1em; text-transform:uppercase; }
        .float-timer  { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; color:#1d4ed8; text-align:center; padding:8px 0; border-bottom:1px solid #eee; }
        .float-list   { list-style:none; }
        .float-item   { display:flex; align-items:flex-start; gap:9px; padding:8px 14px; cursor:pointer; border-bottom:1px solid #f5f5f3; transition:background .1s; }
        .float-item:last-child { border-bottom:none; }
        .float-item:hover { background:#f8f9ff; }
        .float-item.done  { background:#f0fbf8; }
        .f-box { width:16px; height:16px; border-radius:3px; border:1.5px solid #ccc; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; transition:all .15s; }
        .float-item.done .f-box { background:#0a9280; border-color:#0a9280; color:#fff; font-size:10px; }
        .f-req { font-size:11px; color:#333; font-weight:500; line-height:1.4; }
        .f-met { font-family:'JetBrains Mono',monospace; font-size:9px; color:#1d4ed8; margin-top:1px; }
        @media(max-width:900px){ .float-wrap{ display:none; } }

        /* PAGE SHELL */
        .page { max-width:820px; margin:0 auto; padding:40px 28px 100px; }

        /* PRINT BUTTON */
        .print-btn { display:flex; align-items:center; gap:8px; background:#fff; border:1.5px solid #e0ddd8; border-radius:7px; padding:8px 16px; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:#555; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; margin-left:auto; margin-bottom:20px; transition:all .15s; }
        .print-btn:hover { border-color:#1d4ed8; color:#1d4ed8; }
        @media print {
          .ticker-wrap, .float-wrap, .print-btn { display:none !important; }
          .page { padding:0; max-width:100%; }
          body { background:#fff; }
          .resume-paper { box-shadow:none !important; border-radius:0 !important; }
        }

        /* RESUME PAPER */
        .resume-paper { background:#fff; border-radius:12px; box-shadow:0 4px 40px rgba(0,0,0,.1); overflow:hidden; }

        /* HEADER BAND */
        .r-header { background:#0d1117; padding:42px 48px 36px; position:relative; overflow:hidden; }
        .r-header::after { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#1d4ed8,#0a9280,#8b5cf6); }
        .r-name   { font-family:'Syne',sans-serif; font-size:36px; font-weight:800; color:#f4f4f2; letter-spacing:-.02em; margin-bottom:6px; }
        .r-title  { font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.22em; text-transform:uppercase; color:#60a5fa; margin-bottom:20px; }
        .r-contact-row { display:flex; flex-wrap:wrap; gap:20px; }
        .r-contact-item { display:flex; align-items:center; gap:7px; font-size:13px; color:#aaa; text-decoration:none; }
        .r-contact-item:hover { color:#fff; }
        .r-contact-item span { color:#555; }

        /* BODY LAYOUT */
        .r-body { display:grid; grid-template-columns:1fr 280px; gap:0; }
        @media(max-width:640px) { .r-body { grid-template-columns:1fr; } }

        /* MAIN COLUMN */
        .r-main { padding:38px 40px 48px; border-right:1px solid #f0ede8; }

        /* SIDEBAR */
        .r-side { padding:38px 28px 48px; background:#fafaf8; }

        /* SECTION HEADER */
        .sec-head { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
        .sec-rule { flex:1; height:1px; background:#e8e8e2; }
        .sec-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:#1d4ed8; font-weight:700; white-space:nowrap; }
        .mb-36 { margin-bottom:36px; }
        .mb-28 { margin-bottom:28px; }

        /* SUMMARY */
        .summary-text { font-size:14px; color:#444; line-height:1.85; }
        .summary-text strong { color:#111; font-weight:600; }

        /* EXPERIENCE ENTRIES */
        .exp-entry { margin-bottom:30px; }
        .exp-entry:last-child { margin-bottom:0; }
        .exp-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:4px; }
        .exp-role { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#0d0d0d; }
        .exp-period { font-family:'JetBrains Mono',monospace; font-size:10px; color:#999; white-space:nowrap; margin-top:3px; }
        .exp-org { font-size:13px; color:#1d4ed8; font-weight:600; margin-bottom:10px; }
        .exp-org span { color:#999; font-weight:400; }
        .exp-bullets { list-style:none; padding-left:0; }
        .exp-bullets li { font-size:13.5px; color:#555; line-height:1.75; padding-left:16px; position:relative; margin-bottom:6px; }
        .exp-bullets li:last-child { margin-bottom:0; }
        .exp-bullets li::before { content:'—'; position:absolute; left:0; color:#1d4ed8; font-weight:700; }
        .exp-bullets li strong { color:#111; font-weight:600; }
        .exp-metrics { display:flex; flex-wrap:wrap; gap:7px; margin-top:12px; }
        .exp-chip { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:700; padding:3px 9px; border-radius:4px; }
        .chip-blue   { color:#1d4ed8; background:#eff6ff; border:1px solid #3b82f630; }
        .chip-teal   { color:#0a7a6a; background:#e4faf5; border:1px solid #0a928030; }
        .chip-amber  { color:#b87000; background:#fffbeb; border:1px solid #d9920030; }
        .chip-red    { color:#c01a08; background:#fff5f5; border:1px solid #e8321430; }

        /* SIDEBAR SECTIONS */
        .side-sec { margin-bottom:30px; }
        .side-sec:last-child { margin-bottom:0; }
        .side-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:#1d4ed8; font-weight:700; margin-bottom:12px; border-bottom:1px solid #e8e8e2; padding-bottom:6px; }

        .skill-group { margin-bottom:12px; }
        .sg-title { font-size:11px; font-weight:700; color:#333; margin-bottom:5px; }
        .sg-tags  { display:flex; flex-wrap:wrap; gap:4px; }
        .sg-tag   { font-family:'JetBrains Mono',monospace; font-size:9.5px; color:#555; background:#f4f4f1; border:1px solid #e4e4de; border-radius:4px; padding:2px 7px; }

        /* EDUCATION */
        .edu-entry { margin-bottom:16px; }
        .edu-entry:last-child { margin-bottom:0; }
        .edu-degree { font-size:13px; font-weight:700; color:#111; line-height:1.35; }
        .edu-school { font-size:12px; color:#555; margin-top:2px; }
        .edu-date   { font-family:'JetBrains Mono',monospace; font-size:9.5px; color:#999; margin-top:3px; }

        /* CERTS */
        .cert-row { display:flex; align-items:flex-start; gap:8px; margin-bottom:10px; font-size:12px; color:#444; }
        .cert-row:last-child { margin-bottom:0; }
        .cert-icon { font-size:14px; flex-shrink:0; }

        /* METRICS BAND */
        .metrics-band { background:#f4f8ff; border-top:1px solid #dde8ff; border-bottom:1px solid #dde8ff; padding:20px 40px; display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        @media(max-width:580px) { .metrics-band { grid-template-columns:repeat(2,1fr); } }
        .metric-box { text-align:center; }
        .metric-n { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#1d4ed8; }
        .metric-l { font-size:11px; color:#777; margin-top:2px; line-height:1.4; }

        /* INDUSTRIES ROW */
        .ind-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
        .ind-pill { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:700; padding:4px 10px; border-radius:20px; border:1px solid; }

        /* STATEMENT BAR */
        .statement-bar { background:#0d1117; padding:18px 40px; display:flex; align-items:center; gap:16px; }
        .sb-quote { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#f0f0ee; flex:1; line-height:1.5; }
        .sb-attr  { font-family:'JetBrains Mono',monospace; font-size:9px; color:#555; white-space:nowrap; }
      `}</style>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <div className="tick-label">
            <div className="tick-label-dot" />
            <span className="tick-title">Live Record</span>
          </div>
          <div className="tick-track">
            <div className="tick-inner">
              {ticker.map((t, i) => (
                <span key={i} className="tick-item">
                  <span style={{ fontSize: 11, color: "#555" }}>{t.label}</span>
                  <strong>{t.val}</strong>
                  <span style={{ fontSize: 11 }}>{t.sub}</span>
                  <span className="tick-sep">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING CHECKLIST ── */}
      <div className="float-wrap">
        <button className="float-btn" onClick={() => setListOpen(v => !v)}>
          <span>Consulting Checklist</span>
          <span>{listOpen ? "▲" : "▼"}</span>
        </button>
        {listOpen && (
          <div className="float-body">
            <div className="float-head">
              <div className="float-htitle">What Big Firms Need</div>
              <div className="float-hsub">Tap to verify each requirement</div>
            </div>
            {timerActive && <div className="float-timer">{fmt(timeLeft)}</div>}
            <ul className="float-list">
              {checklist.map((item, i) => (
                <li key={i} className={`float-item${checked.has(i) ? " done" : ""}`} onClick={() => toggleCheck(i)}>
                  <div className="f-box">{checked.has(i) && "✓"}</div>
                  <div>
                    <div className="f-req">{item.req}</div>
                    <div className="f-met">{item.metric}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── PAGE ── */}
      <div className="page">

        <button className="print-btn" onClick={() => window.print()}>
          🖨 Print / Save as PDF
        </button>

        <div className="resume-paper">

          {/* ── HEADER ── */}
          <div className="r-header">
            <div className="r-name">Omkumar Solanki</div>
            <div className="r-title">AI Consulting · Technology Strategy · Systems Engineering</div>
            <div className="r-contact-row">
              <a href="mailto:om@resso.ai" className="r-contact-item"><span>✉</span> om@resso.ai</a>
              <a href="https://www.linkedin.com/in/omkumarsolanki" target="_blank" rel="noreferrer" className="r-contact-item"><span>in</span> linkedin.com/in/omkumarsolanki</a>
              <a href="https://www.omkumarsolanki.com" target="_blank" rel="noreferrer" className="r-contact-item"><span>↗</span> omkumarsolanki.com</a>
              <span className="r-contact-item"><span>📍</span> Toronto, Canada</span>
            </div>
          </div>

          {/* ── KEY METRICS BAND ── */}
          <div className="metrics-band">
            <div className="metric-box">
              <div className="metric-n">4</div>
              <div className="metric-l">Industries consulted</div>
            </div>
            <div className="metric-box">
              <div className="metric-n">$1M</div>
              <div className="metric-l">Investment conversation opened</div>
            </div>
            <div className="metric-box">
              <div className="metric-n">98%</div>
              <div className="metric-l">Context retention achieved</div>
            </div>
            <div className="metric-box">
              <div className="metric-n">0</div>
              <div className="metric-l">Bytes of data egress (Lawline)</div>
            </div>
          </div>

          {/* ── STATEMENT BAR ── */}
          <div className="statement-bar">
            <div className="sb-quote">
              I diagnose before I prescribe. Every engagement starts with on-site discovery and ends with a number your CFO recognises.
            </div>
            <div className="sb-attr">Consulting Approach</div>
          </div>

          {/* ── BODY ── */}
          <div className="r-body">

            {/* MAIN COLUMN */}
            <div className="r-main">

              {/* SUMMARY */}
              <div className="mb-36">
                <div className="sec-head"><span className="sec-label">Professional Summary</span><div className="sec-rule" /></div>
                <p className="summary-text">
                  AI and technology consultant with <strong>four cross-industry engagements</strong> delivered end-to-end — Legal AI, EdTech, Civil Engineering, and Public Transit. Operates discovery-first: 2–3 days on-site before any architecture decision. Translates business constraints into technology strategy and presents outcomes in P&amp;L terms to executive stakeholders. Proven ability to <strong>open investment conversations, renew contracts, and ship production systems</strong> that non-technical clients can verify and trust.
                </p>
              </div>

              {/* CONSULTING EXPERIENCE */}
              <div className="mb-36">
                <div className="sec-head"><span className="sec-label">Consulting Experience</span><div className="sec-rule" /></div>

                {/* LAWLINE */}
                <div className="exp-entry">
                  <div className="exp-top">
                    <div className="exp-role">AI Strategy Consultant & Systems Engineer</div>
                    <div className="exp-period">2024 – Present</div>
                  </div>
                  <div className="exp-org">Lawline.tech <span>· Legal AI Platform · Rogers ($1M conversation)</span></div>
                  <ul className="exp-bullets">
                    <li>Conducted <strong>3-day discovery</strong> with 4 practising attorneys; identified that every existing AI legal tool violated attorney-client privilege under Canadian law — ruling out the entire vendor market.</li>
                    <li>Designed and built an <strong>air-gapped RAG stack</strong> (GGUF local LLM + HNSW vector store) ingesting Canadian legal corpora — zero bytes leave the building, eliminating the privilege constraint structurally.</li>
                    <li>Reduced hallucination from <strong>14% to 3.8%</strong> through 6-layer defence: schema validation, RAG grounding, SHAP attribution, confidence gating, retry logic, and dead-letter queue.</li>
                    <li>Translated technical architecture into a <strong>$1M executive business case</strong> presented to the Rogers President: &ldquo;Every other vendor is a liability. This system is the only viable option.&rdquo;</li>
                  </ul>
                  <div className="exp-metrics">
                    <span className="exp-chip chip-red">Air-gapped · 0 bytes egress</span>
                    <span className="exp-chip chip-teal">14% → 3.8% hallucination</span>
                    <span className="exp-chip chip-blue">$1M investment conversation</span>
                    <span className="exp-chip chip-teal">Live SaaS · Production</span>
                  </div>
                </div>

                {/* RESSO */}
                <div className="exp-entry">
                  <div className="exp-top">
                    <div className="exp-role">AI Systems Architect & Lead Engineer</div>
                    <div className="exp-period">2023 – Present</div>
                  </div>
                  <div className="exp-org">Resso.ai <span>· EdTech · AI Interview Platform</span></div>
                  <ul className="exp-bullets">
                    <li>Performed <strong>session-level dropout analysis</strong>; identified root cause as stateless architecture — the agent forgot the student mid-interview, triggering 100% of high-dropout sessions.</li>
                    <li>Architected a <strong>Redis sliding-window session layer</strong> with dynamic persona injection, lifting context retention from 72% to 98% and reducing hallucination from 14% to 3.8%.</li>
                    <li>Shipped <strong>5 configurable interview personas</strong> and an automated 500-document evaluation pipeline; shared weekly eval dashboards with client — retention %, error rate, P(hire) score.</li>
                    <li>Delivered outcome metrics in business language; contract <strong>renewed and expanded in scope</strong> mid-engagement based on visible performance gains.</li>
                  </ul>
                  <div className="exp-metrics">
                    <span className="exp-chip chip-teal">72% → 98% retention</span>
                    <span className="exp-chip chip-teal">5 personas shipped</span>
                    <span className="exp-chip chip-blue">Contract renewed + expanded</span>
                    <span className="exp-chip chip-amber">500-doc eval pipeline</span>
                  </div>
                </div>

                {/* COROL */}
                <div className="exp-entry">
                  <div className="exp-top">
                    <div className="exp-role">ML Strategy Consultant & Research Engineer</div>
                    <div className="exp-period">2024</div>
                  </div>
                  <div className="exp-org">Corol <span>· Civil Engineering · UHPC Structural Materials</span></div>
                  <ul className="exp-bullets">
                    <li>Spent <strong>2 days embedded in the UHPC concrete lab</strong> with structural engineers; mapped every tracked variable (W/C ratio, silica fume %, fibre dosage, curing age) before modelling.</li>
                    <li>Overcame the small-data constraint (200 rows) through <strong>domain-informed feature engineering</strong> — domain knowledge substituted for data volume where no other approach would have worked.</li>
                    <li>Delivered an <strong>XGBoost strength predictor (R² = 0.89)</strong> with SHAP interpretability layer; engineers see which input drives each prediction, enabling adoption without a black-box objection.</li>
                    <li>Reduced mix evaluation cycle from <strong>weeks to a single afternoon</strong>; 100s of formulations now screened computationally before a single physical pour.</li>
                  </ul>
                  <div className="exp-metrics">
                    <span className="exp-chip chip-amber">R² = 0.89 on 200 rows</span>
                    <span className="exp-chip chip-teal">Weeks → one afternoon</span>
                    <span className="exp-chip chip-blue">SHAP interpretability</span>
                    <span className="exp-chip chip-amber">XGBoost · domain features</span>
                  </div>
                </div>

                {/* TTC */}
                <div className="exp-entry">
                  <div className="exp-top">
                    <div className="exp-role">Full-Stack AI Consultant & Systems Engineer</div>
                    <div className="exp-period">2025 – May 2026</div>
                  </div>
                  <div className="exp-org">TTC — Lost and Found <span>· Public Transit · Civic AI · Capstone</span></div>
                  <ul className="exp-bullets">
                    <li><strong>Shadowed TTC Lost &amp; Found operations</strong> during peak shift; mapped the matching bottleneck — staff reviewed every claim manually with no semantic search and no confidence scoring.</li>
                    <li>Built <strong>pgvector cosine similarity</strong> over item descriptions with confidence-gated SMS routing: high-confidence matches trigger automated SMS; low-confidence cases enter a pre-ranked staff queue.</li>
                    <li>Delivered a <strong>FastAPI + PostgreSQL backbone</strong> with full audit log; every match decision is traceable, satisfying public accountability requirements for a 1.7M-rider-per-day system.</li>
                    <li>Pitching to TTC stakeholders <strong>May 2026</strong>; system demonstrates how civic infrastructure can be automated without removing human oversight for ambiguous cases.</li>
                  </ul>
                  <div className="exp-metrics">
                    <span className="exp-chip chip-blue">1.7M riders / day</span>
                    <span className="exp-chip chip-blue">pgvector · semantic match</span>
                    <span className="exp-chip chip-teal">Confidence-gated automation</span>
                    <span className="exp-chip chip-amber">Pitching May 2026</span>
                  </div>
                </div>
              </div>

              {/* EDUCATION */}
              <div>
                <div className="sec-head"><span className="sec-label">Education</span><div className="sec-rule" /></div>
                <div className="edu-entry">
                  <div className="edu-degree">Bachelor of Engineering — Computer Engineering</div>
                  <div className="edu-school">Seneca Polytechnic · Toronto, Ontario</div>
                  <div className="edu-date">Expected 2026 · Capstone: TTC Lost and Found AI System</div>
                </div>
              </div>

            </div>

            {/* SIDEBAR */}
            <div className="r-side">

              {/* CORE CONSULTING SKILLS */}
              <div className="side-sec">
                <div className="side-label">Core Consulting Skills</div>
                <div className="skill-group">
                  <div className="sg-title">Problem Structuring</div>
                  <div className="sg-tags">
                    <span className="sg-tag">MECE decomposition</span>
                    <span className="sg-tag">Root cause analysis</span>
                    <span className="sg-tag">Hypothesis-first</span>
                    <span className="sg-tag">Constraint mapping</span>
                  </div>
                </div>
                <div className="skill-group">
                  <div className="sg-title">Client Engagement</div>
                  <div className="sg-tags">
                    <span className="sg-tag">On-site discovery</span>
                    <span className="sg-tag">Stakeholder interviews</span>
                    <span className="sg-tag">SOW analysis</span>
                    <span className="sg-tag">Compliance mapping</span>
                  </div>
                </div>
                <div className="skill-group">
                  <div className="sg-title">Communication</div>
                  <div className="sg-tags">
                    <span className="sg-tag">Executive briefs</span>
                    <span className="sg-tag">Demo-to-close decks</span>
                    <span className="sg-tag">Weekly eval reports</span>
                    <span className="sg-tag">Tech → business translation</span>
                  </div>
                </div>
                <div className="skill-group">
                  <div className="sg-title">Delivery</div>
                  <div className="sg-tags">
                    <span className="sg-tag">Solo end-to-end</span>
                    <span className="sg-tag">Agile cadence</span>
                    <span className="sg-tag">P0 incident response</span>
                    <span className="sg-tag">Production support</span>
                  </div>
                </div>
              </div>

              {/* TECHNICAL SKILLS */}
              <div className="side-sec">
                <div className="side-label">Technology</div>
                <div className="skill-group">
                  <div className="sg-title">AI / ML</div>
                  <div className="sg-tags">
                    <span className="sg-tag">PyTorch</span>
                    <span className="sg-tag">XGBoost</span>
                    <span className="sg-tag">SHAP</span>
                    <span className="sg-tag">LangGraph</span>
                    <span className="sg-tag">GGUF · HNSW</span>
                    <span className="sg-tag">RAG pipelines</span>
                  </div>
                </div>
                <div className="skill-group">
                  <div className="sg-title">Engineering</div>
                  <div className="sg-tags">
                    <span className="sg-tag">Python · FastAPI</span>
                    <span className="sg-tag">Next.js · TypeScript</span>
                    <span className="sg-tag">PostgreSQL · Redis</span>
                    <span className="sg-tag">pgvector</span>
                    <span className="sg-tag">Docker</span>
                  </div>
                </div>
                <div className="skill-group">
                  <div className="sg-title">Cloud & Observability</div>
                  <div className="sg-tags">
                    <span className="sg-tag">Azure OpenAI · AKS</span>
                    <span className="sg-tag">AWS · Certified</span>
                    <span className="sg-tag">OpenTelemetry</span>
                    <span className="sg-tag">Prometheus · Grafana</span>
                  </div>
                </div>
              </div>

              {/* INDUSTRIES */}
              <div className="side-sec">
                <div className="side-label">Industries</div>
                <div className="ind-row">
                  <span className="ind-pill" style={{ color:"#c01a08", borderColor:"#e8321430", background:"#fff5f5" }}>Legal Technology</span>
                  <span className="ind-pill" style={{ color:"#0a7a6a", borderColor:"#0a928030", background:"#e4faf5" }}>EdTech</span>
                  <span className="ind-pill" style={{ color:"#b87000", borderColor:"#d9920030", background:"#fffbeb" }}>Civil Engineering</span>
                  <span className="ind-pill" style={{ color:"#1d4ed8", borderColor:"#3b82f630", background:"#eff6ff" }}>Public Transit</span>
                </div>
              </div>

              {/* CERTIFICATIONS */}
              <div className="side-sec">
                <div className="side-label">Certifications</div>
                <div className="cert-row">
                  <span className="cert-icon">☁</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>AWS Certified Cloud Practitioner</div>
                    <div style={{ fontSize: 11, color: "#777" }}>Amazon Web Services</div>
                  </div>
                </div>
                <div className="cert-row">
                  <span className="cert-icon">🤖</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>Azure AI · OpenAI Production</div>
                    <div style={{ fontSize: 11, color: "#777" }}>Microsoft Azure · Production deployments</div>
                  </div>
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="side-sec">
                <div className="side-label">Availability</div>
                <div style={{ background: "#e4faf5", border: "1px solid #0a928030", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a9280", animation: "tblink 1.5s infinite" }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#0a7a6a", letterSpacing: ".1em", textTransform: "uppercase" }}>Open to Offers</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                    Full-time consulting roles, project engagements, and associate positions across Canada. Available immediately.
                  </div>
                </div>
              </div>

            </div>
          </div>{/* end r-body */}

        </div>{/* end resume-paper */}
      </div>
    </>
  );
}
