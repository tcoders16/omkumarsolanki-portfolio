"use client";

/**
 * The diagnosis agent, in the Polymath design language.
 * Strictly monochrome (Carbon / Graphite / Steel / Fog / Porcelain),
 * Fog hairlines, no radius on the panel, no shadows.
 * Flow: describe the business + where it loses time → live fix via
 * /api/consult → capture + book. Degrades gracefully if unreachable.
 */
import { useState } from "react";

type Phase = "ask" | "thinking" | "answer" | "error";
type ConsultResult = {
  answer?: string;
  matched_case?: { matched?: boolean; reference?: string; result?: string };
};

const STEPS = [
  "Reading where the work breaks",
  "Matching it to systems we've shipped",
  "Writing the first draft of the fix",
];

const BOOK_HREF = "/book";

export default function PolymathAgent() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [business, setBusiness] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ConsultResult | null>(null);
  const [step, setStep] = useState(0);

  async function run() {
    if (!problem.trim()) return;
    setPhase("thinking");
    setStep(0);
    const ticker = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1400);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatTheyDo: business, problem, persist: true }),
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

  const bookNote = `Business: ${business || "—"}. Loses time at: ${problem}`.slice(0, 280);
  const bookHref = `${BOOK_HREF}?note=${encodeURIComponent(bookNote)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;

  return (
    <div className="pma">
      <style>{`
        .pma { border:1px solid #E9E9E5; background:#FAFAF8; text-align:left;
          display:flex; flex-direction:column; min-height:440px;
          font-family:'Inter','Helvetica Neue',sans-serif; }
        .pma-hd { display:flex; align-items:center; justify-content:space-between; gap:16px;
          padding:16px 24px; border-bottom:1px solid #E9E9E5; }
        .pma-hd-t { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .pma-hd-s { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; display:flex; align-items:center; gap:8px; }
        .pma-dot { width:5px; height:5px; background:#0A0A0C; }
        .pma-body { flex:1; padding:28px 24px 30px; }

        .pma-l { display:block; font-family:'Geist Mono',monospace; font-size:10.5px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; margin:0 0 10px; }
        .pma-in, .pma-ta { width:100%; font-family:'Inter','Helvetica Neue',sans-serif; font-size:15px;
          color:#0A0A0C; background:#FAFAF8; border:1px solid #E9E9E5; padding:13px 15px;
          outline:none; border-radius:0; transition:border-color 0.15s; }
        .pma-in::placeholder, .pma-ta::placeholder { color:#6E6E78; opacity:0.7; }
        .pma-in:focus, .pma-ta:focus { border-color:#26262E; }
        .pma-ta { resize:vertical; min-height:92px; line-height:1.65; }
        .pma-gap { height:20px; }

        .pma-btn { display:inline-flex; align-items:center; justify-content:center;
          font-family:'Inter','Helvetica Neue',sans-serif; font-size:15px; font-weight:500;
          color:#FAFAF8; background:#0A0A0C; border:none; border-radius:8px; padding:14px 26px;
          cursor:pointer; transition:background 0.15s; }
        .pma-btn:hover { background:#26262E; }
        .pma-btn:disabled { opacity:0.35; cursor:not-allowed; background:#0A0A0C; }
        .pma-go { width:100%; margin-top:24px; }
        .pma-hint { margin:14px 0 0; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; text-align:center; }

        .pma-think { display:flex; flex-direction:column; gap:16px; padding:8px 0; }
        .pma-step { display:flex; align-items:center; gap:14px; font-size:15px; color:#6E6E78;
          transition:color 0.3s; }
        .pma-step.on { color:#0A0A0C; font-weight:500; }
        .pma-step.done { color:#26262E; }
        .pma-ind { flex-shrink:0; width:12px; height:12px; border:1px solid #E9E9E5; }
        .pma-step.on .pma-ind { border-color:#26262E; animation:pmaTurn 1.1s cubic-bezier(0.3,0,0.15,1) infinite; }
        .pma-step.done .pma-ind { border-color:#26262E; background:#26262E; }
        @keyframes pmaTurn { from { transform:rotate(0deg); } to { transform:rotate(90deg); } }

        @keyframes pmaFade { from { opacity:0; } to { opacity:1; } }
        .pma-ans { animation:pmaFade 0.35s ease both; }
        .pma-tag { display:inline-block; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; margin-bottom:16px; }
        .pma-plan { font-size:15.5px; font-weight:400; line-height:1.65; color:#26262E; white-space:pre-wrap; }
        .pma-match { margin-top:20px; border:1px solid #E9E9E5; padding:16px 18px; }
        .pma-match-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.14em;
          text-transform:uppercase; color:#6E6E78; margin-bottom:8px; }
        .pma-match-v { font-size:15px; line-height:1.6; color:#26262E; }
        .pma-cta { margin-top:26px; padding-top:24px; border-top:1px solid #E9E9E5; }
        .pma-row { display:flex; gap:12px; flex-wrap:wrap; }
        .pma-row .pma-in { flex:1; min-width:180px; }
        .pma-restart { background:none; border:none; padding:0; margin-top:16px; cursor:pointer;
          font-size:14px; font-weight:500; color:#6E6E78; transition:color 0.15s;
          font-family:'Inter','Helvetica Neue',sans-serif; }
        .pma-restart:hover { color:#0A0A0C; }
        .pma-err { margin:0; font-size:15.5px; line-height:1.65; color:#26262E; }

        .pma a:focus-visible, .pma button:focus-visible, .pma input:focus-visible,
        .pma textarea:focus-visible { outline:1px solid #26262E; outline-offset:2px; }
        @media (prefers-reduced-motion: reduce) {
          .pma-step.on .pma-ind { animation:none; }
          .pma-ans { animation:none; }
        }
      `}</style>

      <div className="pma-hd">
        <span className="pma-hd-t">Diagnosis agent</span>
        <span className="pma-hd-s"><span className="pma-dot" />Ready</span>
      </div>

      <div className="pma-body">
        {phase === "ask" && (
          <>
            <label className="pma-l" htmlFor="pma-business">What does your business do</label>
            <input id="pma-business" className="pma-in"
              placeholder="Manufacturing firm · law practice · clinic · online retailer…"
              value={business} onChange={e => setBusiness(e.target.value)} />
            <div className="pma-gap" />
            <label className="pma-l" htmlFor="pma-problem">Where does it lose time</label>
            <textarea id="pma-problem" className="pma-ta"
              placeholder="Staff re-typing the same data across systems · reports assembled by hand · requests waiting days for triage…"
              value={problem} onChange={e => setProblem(e.target.value)} />
            <button className="pma-btn pma-go" disabled={!problem.trim()} onClick={run}>
              Run the diagnosis
            </button>
            <p className="pma-hint">Free · about 15 seconds · no signup</p>
          </>
        )}

        {phase === "thinking" && (
          <div className="pma-think">
            {STEPS.map((s, i) => (
              <div key={s} className={`pma-step ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}>
                <span className="pma-ind" />
                {s}
              </div>
            ))}
          </div>
        )}

        {phase === "answer" && result && (
          <div className="pma-ans">
            <span className="pma-tag">
              {result.matched_case?.matched ? "We've shipped this before" : "The first read"}
            </span>
            <div className="pma-plan">{result.answer || "Book a consultation and we'll map the fix together."}</div>
            {result.matched_case?.matched && result.matched_case.result && (
              <div className="pma-match">
                <div className="pma-match-l">Result from similar work</div>
                <div className="pma-match-v">{result.matched_case.result}</div>
              </div>
            )}
            <div className="pma-cta">
              <label className="pma-l" htmlFor="pma-email">Want us to build it</label>
              <div className="pma-row">
                <input id="pma-email" className="pma-in" placeholder="Your email (optional)"
                  value={email} onChange={e => setEmail(e.target.value)} />
                <a className="pma-btn" href={bookHref}>Book a consultation</a>
              </div>
              <button className="pma-restart" onClick={() => { setPhase("ask"); setResult(null); }}>
                ← Diagnose a different problem
              </button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="pma-ans">
            <p className="pma-err">
              The agent is busy. Book a 30-minute consultation and we&apos;ll trace the
              friction with you directly.
            </p>
            <div className="pma-cta">
              <a className="pma-btn" href={bookHref}>Book a consultation</a>
              <div>
                <button className="pma-restart" onClick={() => setPhase("ask")}>← Try again</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
