"use client";

/**
 * The diagnosis agent — schematic identity (cobalt on paper, mono structure).
 * Flow: describe your agent + the failure  →  it writes the fix (live, /api/consult)
 *       →  capture + book. Degrades gracefully if the live agent is unreachable.
 */
import { useState } from "react";

type Phase = "ask" | "thinking" | "answer" | "error";
type ConsultResult = {
  answer?: string;
  matched_case?: { matched?: boolean; reference?: string; result?: string };
};

const STEPS = ["Reading the failure", "Matching it to systems I've shipped", "Writing the fix"];

export default function ConsultAgentFlow() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [agent, setAgent] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ConsultResult | null>(null);
  const [step, setStep] = useState(0);

  async function run() {
    if (!problem.trim()) return;
    setPhase("thinking"); setStep(0);
    const ticker = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1400);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatTheyDo: agent, problem, persist: true }),
      });
      const data = await res.json();
      clearInterval(ticker);
      if (!res.ok) { setPhase("error"); return; }
      setResult(data);
      setPhase("answer");
    } catch {
      clearInterval(ticker);
      setPhase("error");
    }
  }

  const bookNote = `Agent: ${agent || "—"}. Breaks at: ${problem}`.slice(0, 280);
  const bookHref = `/book?note=${encodeURIComponent(bookNote)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;

  return (
    <div className="af">
      <style>{`
        .af { --ink:#0b0f19; --accent:#2f5bff; --signal:#f59e0b; --line:#d3d7e0; --line-soft:#e3e6ec; --muted:#5b6373;
          background:#fff; border:1px solid var(--line); box-shadow:0 28px 60px -40px rgba(11,15,25,.45);
          font-family:'Inter',system-ui,sans-serif; text-align:left; display:flex; flex-direction:column; min-height:480px; }
        .af-body { flex:1; }
        .af-hd { display:flex; align-items:center; justify-content:space-between; padding:13px 18px; border-bottom:1px solid var(--line-soft); }
        .af-hd-t { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink); }
        .af-hd-t b { color:var(--accent); font-weight:600; }
        .af-live { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); display:flex; align-items:center; gap:6px; }
        .af-led { width:7px; height:7px; border-radius:50%; background:var(--signal); animation:afpulse 2s infinite; }
        @keyframes afpulse { 0%,100%{ box-shadow:0 0 0 0 rgba(245,158,11,.5);} 70%{ box-shadow:0 0 0 5px rgba(245,158,11,0);} }
        .af-body { padding:22px 18px 24px; }

        .af-l { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.04em; color:var(--muted); display:block; margin:0 0 8px; }
        .af-in, .af-ta { width:100%; font-family:'Inter',sans-serif; font-size:15px; color:var(--ink);
          background:#fafbfc; border:1px solid var(--line); padding:12px 14px; outline:none; transition:border-color .15s, background .15s; }
        .af-in:focus, .af-ta:focus { border-color:var(--accent); background:#fff; }
        .af-ta { resize:vertical; min-height:88px; line-height:1.55; }
        .af-gap { height:16px; }
        .af-btn { font-family:'JetBrains Mono',monospace; font-weight:600; font-size:13px; color:#fff; background:var(--ink);
          border:1px solid var(--ink); padding:13px 20px; cursor:pointer; transition:background .15s, border-color .15s, transform .14s;
          display:inline-flex; align-items:center; gap:8px; }
        .af-btn:hover { background:var(--accent); border-color:var(--accent); transform:translateY(-1px); }
        .af-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; background:var(--ink); border-color:var(--ink); }
        .af-go { width:100%; justify-content:center; margin-top:20px; }
        .af-hint { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#9aa1b0; margin-top:13px; text-align:center; }

        /* thinking */
        .af-think { display:flex; flex-direction:column; gap:14px; padding:10px 2px; }
        .af-step { display:flex; align-items:center; gap:12px; font-family:'JetBrains Mono',monospace; font-size:13px; color:#b6bccb; transition:color .3s; }
        .af-step.on { color:var(--ink); } .af-step.done { color:var(--accent); }
        .af-spin { width:13px; height:13px; border:2px solid var(--line); border-top-color:var(--accent); border-radius:50%; animation:afspin .7s linear infinite; flex-shrink:0; }
        .af-check { width:13px; height:13px; flex-shrink:0; color:var(--accent); }
        .af-pend { width:13px; height:13px; border:2px solid #e9ebf0; border-radius:50%; flex-shrink:0; }
        @keyframes afspin { to { transform:rotate(360deg); } }

        /* answer */
        @keyframes affade { from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:none;} }
        .af-ans { animation:affade .35s ease both; }
        .af-tag { display:inline-flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace; font-size:10px;
          letter-spacing:.08em; text-transform:uppercase; color:var(--accent); border:1px solid rgba(47,91,255,.3); padding:4px 9px; margin-bottom:14px; }
        .af-plan { font-size:14.5px; line-height:1.7; color:#1a1f2b; white-space:pre-wrap; }
        .af-match { margin-top:16px; border-left:2px solid var(--signal); background:#fff9ef; padding:12px 14px; }
        .af-match-l { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
        .af-match-v { font-size:13px; line-height:1.55; color:#1a1f2b; }
        .af-cta { margin-top:22px; padding-top:20px; border-top:1px solid var(--line-soft); }
        .af-row { display:flex; gap:10px; flex-wrap:wrap; }
        .af-row .af-in { flex:1; min-width:170px; }
        .af-restart { background:none; border:none; color:var(--muted); font-family:'JetBrains Mono',monospace; font-size:11px; cursor:pointer; margin-top:14px; padding:0; }
        .af-restart:hover { color:var(--ink); }
        .af-err { font-size:14.5px; line-height:1.7; color:#1a1f2b; }

        @media(prefers-reduced-motion:reduce){ .af-led,.af-spin{ animation:none; } }
      `}</style>

      <div className="af-hd">
        <span className="af-hd-t">agent.<b>diagnose()</b></span>
        <span className="af-live"><span className="af-led" />ready</span>
      </div>

      <div className="af-body">
        {phase === "ask" && (
          <>
            <label className="af-l">{"// what does your agent do?"}</label>
            <input className="af-in" placeholder="support agent · research agent · coding copilot…"
              value={agent} onChange={e => setAgent(e.target.value)} />
            <div className="af-gap" />
            <label className="af-l">{"// where does it break?"}</label>
            <textarea className="af-ta"
              placeholder="forgets context across sessions · loops · fails halfway through a multi-step task · hallucinates under load…"
              value={problem} onChange={e => setProblem(e.target.value)} />
            <button className="af-btn af-go" disabled={!problem.trim()} onClick={run}>Run diagnosis →</button>
            <p className="af-hint">free · ~15s · no signup</p>
          </>
        )}

        {phase === "thinking" && (
          <div className="af-think">
            {STEPS.map((s, i) => (
              <div key={s} className={`af-step ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}>
                {i < step
                  ? <svg className="af-check" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : i === step ? <span className="af-spin" /> : <span className="af-pend" />}
                {s}
              </div>
            ))}
          </div>
        )}

        {phase === "answer" && result && (
          <div className="af-ans">
            <span className="af-tag">{result.matched_case?.matched ? "I've shipped this before" : "Here's the fix"}</span>
            <div className="af-plan">{result.answer || "Let's get on a call and map the fix together."}</div>
            {result.matched_case?.matched && result.matched_case.result && (
              <div className="af-match">
                <div className="af-match-l">result from similar work</div>
                <div className="af-match-v">{result.matched_case.result}</div>
              </div>
            )}
            <div className="af-cta">
              <label className="af-l">{"// want me to build it?"}</label>
              <div className="af-row">
                <input className="af-in" placeholder="your email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
                <a className="af-btn" href={bookHref}>Book a call →</a>
              </div>
              <button className="af-restart" onClick={() => { setPhase("ask"); setResult(null); }}>← diagnose a different failure</button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="af-ans">
            <p className="af-err">The live agent is busy. Book a 20-minute call and I&apos;ll trace the failure with you directly.</p>
            <div className="af-cta">
              <a className="af-btn" href={bookHref}>Book a call →</a>
              <button className="af-restart" onClick={() => setPhase("ask")}>← try again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
