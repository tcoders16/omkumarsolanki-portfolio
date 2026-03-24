"use client";
import { useState } from "react";
import ResumeDocument, { ResumeVariant } from "@/components/ResumeDocument";

const VARIANTS: {
  id: ResumeVariant;
  label: string;
  tag: string;
  subtitle: string;
  targets: string[];
  highlights: { metric: string; label: string }[];
  filename: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}[] = [
  {
    id: "tech",
    label: "AI Engineering",
    tag: "Engineering · MLOps · Architecture",
    subtitle: "For technical roles at product companies and AI labs",
    targets: ["Google", "Amex", "BMO", "DeepMind", "OpenAI", "Stripe", "Meta AI", "Shopify"],
    highlights: [
      { metric: "800ms", label: "Conversation latency" },
      { metric: "98%",   label: "Context retention" },
      { metric: "3.8%",  label: "Hallucination rate" },
      { metric: "7",     label: "On-prem deployments" },
    ],
    filename: "Omkumar-Solanki-AI-Engineer-Resume",
    accent: "#0a7a6a",
    accentBg: "#f0faf8",
    accentBorder: "#b0d9d2",
  },
  {
    id: "consulting",
    label: "AI Consulting",
    tag: "Strategy · Discovery · Business Translation",
    subtitle: "For consulting firms and strategy roles in Canada",
    targets: ["Deloitte", "McKinsey", "Accenture", "KPMG", "BCG", "PwC", "Oliver Wyman", "Capgemini"],
    highlights: [
      { metric: "$1M",     label: "Investment conversation" },
      { metric: "4",       label: "Industries consulted" },
      { metric: "0 bytes", label: "Data egress (Lawline)" },
      { metric: "10+",     label: "Startups advised" },
    ],
    filename: "Omkumar-Solanki-Consulting-Resume",
    accent: "#1d4ed8",
    accentBg: "#eff6ff",
    accentBorder: "#bfdbfe",
  },
];

export default function ResumeSelectorPage() {
  const [selected, setSelected] = useState<ResumeVariant>("tech");
  const active = VARIANTS.find(v => v.id === selected)!;

  const handleDownload = () => {
    if (typeof window === "undefined") return;
    const prev = document.title;
    document.title = active.filename;
    window.print();
    document.title = prev;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        /* ── FORCE LIGHT MODE — override dark portfolio globals ── */
        html { background: #ece9e4 !important; scroll-behavior: smooth; }
        body {
          background: #ece9e4 !important;
          font-family: 'Inter', sans-serif !important;
          -webkit-font-smoothing: antialiased;
          color: #111 !important;
        }
        body::before { display: none !important; }
        .grain { display: none !important; }

        /* ── SELECTOR WRAPPER ── */
        .rs-wrap {
          background: #ece9e4;
          min-height: 100vh;
        }

        /* ── TOP HEADER BAND ── */
        .rs-header {
          background: #fff;
          border-bottom: 1px solid #e0dcd6;
          padding: 0 32px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .rs-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rs-breadcrumb {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #aaa;
        }
        .rs-breadcrumb-sep { color: #ddd; margin: 0 8px; }
        .rs-breadcrumb-cur { color: #555; }
        .rs-back {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          color: #aaa;
          text-decoration: none;
          letter-spacing: .1em;
          text-transform: uppercase;
          transition: color .15s;
        }
        .rs-back:hover { color: #111; }

        /* ── SELECTOR CONTENT ── */
        .rs-content {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px 0;
        }

        /* ── PAGE HEADING ── */
        .rs-heading-row {
          text-align: center;
          margin-bottom: 40px;
        }
        .rs-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .26em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 12px;
        }
        .rs-heading {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #0d0d0d;
          letter-spacing: -.02em;
          margin-bottom: 8px;
        }
        .rs-subhead {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
        }

        /* ── CARDS ROW ── */
        .rs-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) { .rs-cards { grid-template-columns: 1fr; } }

        /* ── VARIANT CARD ── */
        .rs-card {
          background: #fff;
          border: 1.5px solid #e0dcd6;
          border-radius: 14px;
          padding: 24px 24px 20px;
          cursor: pointer;
          transition: box-shadow .18s, border-color .18s, transform .18s;
          position: relative;
          overflow: hidden;
          user-select: none;
        }
        .rs-card:hover {
          box-shadow: 0 6px 28px rgba(0,0,0,.07);
          transform: translateY(-2px);
        }
        .rs-card.active {
          border-color: var(--rs-accent);
          box-shadow: 0 0 0 3px var(--rs-accent-bg), 0 8px 32px rgba(0,0,0,.08);
        }
        .rs-card.active::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--rs-accent);
          border-radius: 14px 14px 0 0;
        }

        /* card top row */
        .rsc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .rsc-label {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0d0d0d;
          letter-spacing: -.01em;
        }
        .rsc-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid #d8d4ce;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 3px;
          transition: all .15s;
          background: #fff;
        }
        .rs-card.active .rsc-radio {
          background: var(--rs-accent);
          border-color: var(--rs-accent);
        }
        .rsc-radio-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          opacity: 0;
          transition: opacity .15s;
        }
        .rs-card.active .rsc-radio-dot { opacity: 1; }

        .rsc-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--rs-accent);
          margin-bottom: 8px;
        }
        .rsc-sub {
          font-size: 12.5px;
          color: #888;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        /* target firm pills */
        .rsc-firms {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 18px;
        }
        .rsc-firm {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          background: var(--rs-accent-bg);
          color: var(--rs-accent);
          border: 1px solid var(--rs-accent-border);
          letter-spacing: .06em;
        }

        /* metrics row */
        .rsc-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #f0ece8;
        }
        .rsc-metric { text-align: center; }
        .rsc-metric-n {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: var(--rs-accent);
          line-height: 1;
          margin-bottom: 3px;
        }
        .rsc-metric-l {
          font-size: 9px;
          color: #aaa;
          line-height: 1.3;
        }

        /* ── DOWNLOAD ACTION BAR ── */
        .rs-action {
          background: #fff;
          border: 1.5px solid #e0dcd6;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .rs-action-left { display: flex; align-items: center; gap: 14px; }
        .rs-action-icon {
          width: 40px;
          height: 40px;
          border-radius: 9px;
          background: var(--rs-accent-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .rs-action-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 3px;
        }
        .rs-action-filename {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }
        .rs-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: var(--rs-accent);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: filter .15s, transform .15s, box-shadow .15s;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: -.01em;
        }
        .rs-dl-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,.14);
        }
        .rs-dl-btn:active { transform: translateY(0); }

        /* ── PREVIEW DIVIDER ── */
        .rs-preview-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .rs-pd-rule { flex: 1; height: 1px; background: #dcd8d2; }
        .rs-pd-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #c0bbb4;
        }

        /* ── PRINT ── */
        @media print {
          .rs-wrap > *:not(.rd-shell-outer) { display: none !important; }
          html, body { background: #fff !important; }
        }
      `}</style>

      <div className="rs-wrap">

        {/* ── STICKY HEADER ── */}
        <div className="rs-header">
          <div className="rs-header-left">
            <a href="/" className="rs-back">← Portfolio</a>
            <span className="rs-breadcrumb">
              <span className="rs-breadcrumb-sep">/</span>
              <span className="rs-breadcrumb-cur">Resume</span>
            </span>
          </div>
        </div>

        {/* ── SELECTOR ── */}
        <div className="rs-content">
          <div className="rs-heading-row">
            <div className="rs-eyebrow">Select & Download</div>
            <h1 className="rs-heading">Choose your version</h1>
            <p className="rs-subhead">Two tailored variants. Pick the one that fits the role, preview it live, then download as PDF.</p>
          </div>

          {/* CARDS */}
          <div className="rs-cards">
            {VARIANTS.map(v => (
              <div
                key={v.id}
                className={`rs-card${selected === v.id ? " active" : ""}`}
                style={{ "--rs-accent": v.accent, "--rs-accent-bg": v.accentBg, "--rs-accent-border": v.accentBorder } as React.CSSProperties}
                onClick={() => setSelected(v.id)}
              >
                <div className="rsc-top">
                  <div className="rsc-label">{v.label}</div>
                  <div className="rsc-radio"><div className="rsc-radio-dot" /></div>
                </div>
                <div className="rsc-tag">{v.tag}</div>
                <div className="rsc-sub">{v.subtitle}</div>
                <div className="rsc-firms">
                  {v.targets.map(t => <span key={t} className="rsc-firm">{t}</span>)}
                </div>
                <div className="rsc-metrics">
                  {v.highlights.map((h, i) => (
                    <div key={i} className="rsc-metric">
                      <div className="rsc-metric-n">{h.metric}</div>
                      <div className="rsc-metric-l">{h.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DOWNLOAD ACTION BAR */}
          <div
            className="rs-action"
            style={{ "--rs-accent": active.accent, "--rs-accent-bg": active.accentBg } as React.CSSProperties}
          >
            <div className="rs-action-left">
              <div className="rs-action-icon">📄</div>
              <div>
                <div className="rs-action-label">Ready to save</div>
                <div className="rs-action-filename">{active.filename}.pdf</div>
              </div>
            </div>
            <button className="rs-dl-btn" onClick={handleDownload}>
              ↓ Download PDF
            </button>
          </div>

          {/* PREVIEW LABEL */}
          <div className="rs-preview-divider">
            <div className="rs-pd-rule" />
            <span className="rs-pd-label">Live Preview</span>
            <div className="rs-pd-rule" />
          </div>
        </div>

        {/* ── LIVE RESUME PREVIEW ── */}
        <ResumeDocument
          variant={selected}
          pdfFilename={active.filename}
          hideSaveBtn
        />

      </div>
    </>
  );
}
