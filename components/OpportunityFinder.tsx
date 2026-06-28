"use client";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   OpportunityFinder — a free, takeaway-generating agent.
   The visitor describes their business; the agent returns the top-3
   AI/automation opportunities tailored to them (impact, effort, and
   how Om would build each). A helpful artifact that also qualifies a lead.
═══════════════════════════════════════════════════════════════ */

const T = "#39d9b4";

type Opportunity = {
  title: string;
  what: string;
  impact: string;
  effort: string;
  how_om_builds: string;
};
type Result = { summary: string; opportunities: Opportunity[] };

const EFFORT_COLOR: Record<string, string> = {
  "Quick win": "#39d9b4",
  Medium: "#f59e0b",
  Large: "#8b5cf6",
};

export default function OpportunityFinder() {
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function run() {
    if (!business.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: business.trim(), goal: goal.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setResult(data as Result);
    } catch {
      setError("Couldn't reach the agent. Email om@resso.ai.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="of">
      <style>{`
        .of { margin-top:34px; }
        .of-form { display:grid; gap:12px; max-width:680px; }
        .of-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#707070; margin-bottom:7px; display:block; }
        .of-in { width:100%; background:#0d0d0d; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#f0f0f0; font-family:'Space Grotesk',sans-serif; font-size:14px; padding:13px 14px; outline:none; transition:border-color .15s; resize:vertical; }
        .of-in:focus { border-color:rgba(57,217,180,.5); }
        .of-go { justify-self:start; margin-top:4px; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; padding:13px 24px; background:${T}; color:#001512; border:none; border-radius:4px; cursor:pointer; transition:transform .18s, opacity .15s; }
        .of-go:hover:not(:disabled) { transform:translateY(-2px); }
        .of-go:disabled { opacity:.45; cursor:not-allowed; }
        .of-err { color:#f87171; font-family:'Space Grotesk',sans-serif; font-size:13px; margin-top:14px; }

        .of-result { margin-top:30px; animation:of-fade .3s ease; }
        @keyframes of-fade { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }
        .of-summary { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#f0f0f0; line-height:1.5; max-width:720px; margin-bottom:22px; padding-left:14px; border-left:2px solid ${T}; }
        .of-cards { display:grid; gap:1px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.06); border-radius:8px; overflow:hidden; }
        .of-card { background:#0a0a0a; padding:22px 22px; }
        .of-card-hd { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:10px; }
        .of-card-t { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#f0f0f0; letter-spacing:-.01em; }
        .of-badge { flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:4px 9px; border-radius:20px; }
        .of-what { font-family:'Space Grotesk',sans-serif; font-weight:300; font-size:13.5px; line-height:1.6; color:#c8c4bc; margin-bottom:12px; }
        .of-meta { display:grid; gap:8px; }
        .of-meta-row { display:flex; gap:9px; font-family:'Space Grotesk',sans-serif; font-size:12.5px; line-height:1.55; }
        .of-meta-k { flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#707070; width:64px; padding-top:2px; }
        .of-meta-v { color:#9a968e; } .of-meta-v.impact { color:${T}; }
        .of-cta { margin-top:24px; display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .of-cta a { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; padding:12px 22px; border-radius:4px; text-decoration:none; }
        .of-cta .p { background:${T}; color:#001512; }
        .of-cta .s { border:1px solid rgba(255,255,255,0.16); color:#f0f0f0; }
        .of-cta-note { font-family:'Space Grotesk',sans-serif; font-weight:300; font-size:12.5px; color:#707070; }
      `}</style>

      <div className="of-form">
        <div>
          <label className="of-label">What does your business or team do?</label>
          <textarea
            className="of-in"
            rows={3}
            placeholder="e.g. We're a 20-person insurance brokerage; agents manually re-key claim forms and answer the same policy questions all day."
            value={business}
            onChange={e => setBusiness(e.target.value)}
          />
        </div>
        <div>
          <label className="of-label">A goal, if you have one <span style={{ opacity: .6 }}>(optional)</span></label>
          <input
            className="of-in"
            placeholder="e.g. cut response time, reduce manual data entry, scale support without hiring"
            value={goal}
            onChange={e => setGoal(e.target.value)}
          />
        </div>
        <button className="of-go" disabled={loading || !business.trim()} onClick={run}>
          {loading ? "Analyzing your business…" : "Find my AI opportunities →"}
        </button>
      </div>

      {error && <p className="of-err">⚠ {error}</p>}

      {result && (
        <div className="of-result">
          {result.summary && <p className="of-summary">{result.summary}</p>}
          <div className="of-cards">
            {result.opportunities.map((o, i) => {
              const c = EFFORT_COLOR[o.effort] || "#9a968e";
              return (
                <div key={i} className="of-card">
                  <div className="of-card-hd">
                    <span className="of-card-t">{i + 1}. {o.title}</span>
                    <span className="of-badge" style={{ color: c, border: `1px solid ${c}`, background: `${c}14` }}>{o.effort}</span>
                  </div>
                  <p className="of-what">{o.what}</p>
                  <div className="of-meta">
                    <div className="of-meta-row"><span className="of-meta-k">Impact</span><span className="of-meta-v impact">{o.impact}</span></div>
                    <div className="of-meta-row"><span className="of-meta-k">How Om builds it</span><span className="of-meta-v">{o.how_om_builds}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="of-cta">
            <a href="/book" className="p">Book a free call to scope it →</a>
            <a href="#consult-chat" className="s">Ask the AI consultant</a>
            <span className="of-cta-note">These are starting points — a call turns them into a plan.</span>
          </div>
        </div>
      )}
    </div>
  );
}
