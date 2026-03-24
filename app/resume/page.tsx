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
  accentDim: string;
}[] = [
  {
    id: "tech",
    label: "AI Engineering",
    tag: "Engineering · MLOps · Architecture",
    subtitle: "Best for technical roles at product companies and AI labs",
    targets: ["Google", "Amex", "BMO", "DeepMind", "OpenAI", "Stripe", "Meta AI", "Shopify"],
    highlights: [
      { metric: "800ms", label: "Real-time AI latency" },
      { metric: "98%",   label: "Context retention" },
      { metric: "3.8%",  label: "Hallucination rate" },
      { metric: "7",     label: "On-prem deployments" },
    ],
    filename: "Omkumar-Solanki-AI-Engineer-Resume",
    accent: "#0a7a6a",
    accentDim: "#e4faf5",
  },
  {
    id: "consulting",
    label: "AI Consulting",
    tag: "Strategy · Discovery · Business Translation",
    subtitle: "Best for consulting firms and strategy roles in Canada",
    targets: ["Deloitte", "McKinsey", "Accenture", "KPMG", "BCG", "PwC", "Oliver Wyman", "Capgemini"],
    highlights: [
      { metric: "$1M",        label: "Investment conversation" },
      { metric: "4",          label: "Industries consulted" },
      { metric: "0 bytes",    label: "Data egress (Lawline)" },
      { metric: "10+",        label: "Startups advised" },
    ],
    filename: "Omkumar-Solanki-Consulting-Resume",
    accent: "#1d4ed8",
    accentDim: "#eff6ff",
  },
];

const FILENAMES: Record<ResumeVariant, string> = {
  tech: "Omkumar-Solanki-AI-Engineer-Resume",
  consulting: "Omkumar-Solanki-Consulting-Resume",
};

export default function ResumeSelectorPage() {
  const [selected, setSelected] = useState<ResumeVariant>("tech");
  const active = VARIANTS.find(v => v.id === selected)!;

  const handleDownload = () => {
    if (typeof window === "undefined") return;
    const prev = document.title;
    document.title = FILENAMES[selected];
    window.print();
    document.title = prev;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { background: #e8e5e0; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

        /* SELECTOR UI — hidden on print */
        .sel-ui { padding: 36px 20px 0; max-width: 900px; margin: 0 auto; }

        /* TOP EYEBROW */
        .sel-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 10px;
          text-align: center;
        }
        .sel-heading {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0d0d0d;
          text-align: center;
          letter-spacing: -.02em;
          margin-bottom: 6px;
        }
        .sel-sub {
          font-size: 14px;
          color: #777;
          text-align: center;
          margin-bottom: 28px;
        }

        /* VARIANT CARDS */
        .sel-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (max-width: 580px) { .sel-cards { grid-template-columns: 1fr; } }

        .sel-card {
          background: #fff;
          border: 2px solid #e0ddd8;
          border-radius: 12px;
          padding: 20px 22px;
          cursor: pointer;
          transition: all .18s;
          position: relative;
          overflow: hidden;
        }
        .sel-card:hover {
          border-color: #aaa;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,.08);
        }
        .sel-card.active {
          border-color: var(--acc);
          box-shadow: 0 0 0 3px var(--acc-dim), 0 6px 28px rgba(0,0,0,.09);
        }
        .sel-card.active::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--acc);
        }

        .sc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .sc-label {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #0d0d0d;
          line-height: 1.2;
        }
        .sc-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all .15s;
          font-size: 12px;
          color: #fff;
        }
        .sel-card.active .sc-check {
          background: var(--acc);
          border-color: var(--acc);
        }
        .sc-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--acc);
          margin-bottom: 8px;
        }
        .sc-sub {
          font-size: 12.5px;
          color: #777;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        /* TARGET ROW */
        .sc-targets {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
        }
        .sc-target {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          background: var(--acc-dim);
          color: var(--acc);
          border: 1px solid var(--acc)30;
        }

        /* HIGHLIGHTS */
        .sc-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          border-top: 1px solid #f0ede8;
          padding-top: 12px;
        }
        .sc-metric { text-align: center; }
        .sc-metric-n {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: var(--acc);
        }
        .sc-metric-l {
          font-size: 9px;
          color: #999;
          margin-top: 1px;
          line-height: 1.3;
        }

        /* DOWNLOAD BAR */
        .dl-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border: 1.5px solid #e0ddd8;
          border-radius: 10px;
          padding: 14px 20px;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .dl-info { }
        .dl-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 3px;
        }
        .dl-filename {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }
        .dl-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--acc);
          color: #fff;
          border: none;
          padding: 11px 22px;
          border-radius: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .18s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .dl-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,.15); }
        .dl-btn:active { transform: translateY(0); }

        /* RESUME PREVIEW LABEL */
        .preview-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .preview-rule { flex: 1; height: 1px; background: #d8d5d0; }
        .preview-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #bbb;
        }

        @media print {
          .sel-ui { display: none !important; }
        }
      `}</style>

      {/* ── SELECTOR UI ── */}
      <div className="sel-ui">
        <div className="sel-eyebrow">Resume · Select & Download</div>
        <h1 className="sel-heading">Choose your version</h1>
        <p className="sel-sub">Both are tailored. Pick the one that matches the role, then download as PDF.</p>

        {/* VARIANT CARDS */}
        <div className="sel-cards">
          {VARIANTS.map(v => (
            <div
              key={v.id}
              className={`sel-card${selected === v.id ? " active" : ""}`}
              style={{ "--acc": v.accent, "--acc-dim": v.accentDim } as React.CSSProperties}
              onClick={() => setSelected(v.id)}
            >
              <div className="sc-top">
                <div className="sc-label">{v.label}</div>
                <div className="sc-check">{selected === v.id && "✓"}</div>
              </div>
              <div className="sc-tag">{v.tag}</div>
              <div className="sc-sub">{v.subtitle}</div>
              <div className="sc-targets">
                {v.targets.map(t => (
                  <span key={t} className="sc-target">{t}</span>
                ))}
              </div>
              <div className="sc-metrics">
                {v.highlights.map((h, i) => (
                  <div key={i} className="sc-metric">
                    <div className="sc-metric-n">{h.metric}</div>
                    <div className="sc-metric-l">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DOWNLOAD BAR */}
        <div
          className="dl-bar"
          style={{ "--acc": active.accent, "--acc-dim": active.accentDim } as React.CSSProperties}
        >
          <div className="dl-info">
            <div className="dl-label">Ready to save</div>
            <div className="dl-filename">{active.filename}.pdf</div>
          </div>
          <button className="dl-btn" onClick={handleDownload}>
            ⬇ &nbsp;Download PDF
          </button>
        </div>

        {/* PREVIEW LABEL */}
        <div className="preview-label">
          <div className="preview-rule" />
          <span className="preview-text">Live Preview ↓</span>
          <div className="preview-rule" />
        </div>
      </div>

      {/* ── RESUME (live preview + prints) ── */}
      <ResumeDocument
        variant={selected}
        pdfFilename={active.filename}
        hideSaveBtn
      />
    </>
  );
}
