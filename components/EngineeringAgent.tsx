"use client";

/**
 * Engineering-specific deep agentic chatbot — embedded in the engineering page.
 * Dark / teal. Shows the multi-agent pipeline working (router → case-match →
 * architect → consultant), reveals the live trace, then answers — grounded in
 * Om's work via /api/consult. Technical framing for engineering teams.
 */
import { useEffect, useRef, useState } from "react";

const ACCENT = "#39d9b4";
const MONO = "var(--font-mono)";

type Trace = { agent: string; label: string };
type MatchedCase = { matched?: boolean; reference?: string; result?: string };
type Result = { answer: string; matched_case?: MatchedCase; trace?: Trace[] };
type Msg = { role: "user" | "assistant"; text: string };

const PIPELINE = ["router", "case_match", "architect", "consultant"];
const CHIPS = [
  "How would you build a real-time inference pipeline?",
  "How do you make agents production-reliable?",
  "What's your MLOps stack on AWS?",
];

export default function EngineeringAgent() {
  const [phase, setPhase] = useState<"intro" | "run">("intro");
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [chat, setChat] = useState<Msg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const first = useRef("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [result, revealed, chat, chatLoading]);

  // Reveal the real trace step by step once the result lands.
  useEffect(() => {
    if (!result?.trace) return;
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setRevealed(i); if (i >= (result.trace?.length ?? 0)) clearInterval(id); }, 480);
    return () => clearInterval(id);
  }, [result]);

  async function run(q: string) {
    const text = q.trim();
    if (!text || submitting) return;
    first.current = text;
    setPhase("run"); setSubmitting(true); setResult(null); setChat([]); setInput("");
    try {
      const res = await fetch("/api/consult", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: text, persist: true }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setResult({ answer: "The agent is busy — book a call and Om will answer directly.", trace: [] });
    } catch {
      setResult({ answer: "Network hiccup — try again, or book a call.", trace: [] });
    } finally { setSubmitting(false); }
  }

  async function followUp(q: string) {
    const text = q.trim();
    if (!text || chatLoading) return;
    const next = [...chat, { role: "user" as const, text }];
    setChat(next); setChatLoading(true); setInput("");
    try {
      const history = [{ role: "assistant", content: result?.answer || "" }, ...next.map(m => ({ role: m.role, content: m.text }))];
      const res = await fetch("/api/consult", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: first.current, history, persist: false }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "assistant", text: data.error ? "The agent is busy — book a call." : data.answer }]);
    } catch {
      setChat(prev => [...prev, { role: "assistant", text: "Network hiccup — try again." }]);
    } finally { setChatLoading(false); }
  }

  const done = result?.trace?.slice(0, revealed).map(t => t.agent) ?? [];
  const finished = !!result && revealed >= (result.trace?.length ?? 0);

  return (
    <div className="ea">
      <style>{`
        .ea { --ac:${ACCENT}; background:#0a0b0d; border:1px solid rgba(255,255,255,.1); border-radius:14px;
          overflow:hidden; font-family:${MONO}; display:flex; flex-direction:column; min-height:560px; max-height:720px; }
        .ea-hd { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,.08); }
        .ea-hd-t { font-size:12px; color:#f0f0f0; font-weight:600; }
        .ea-hd-t b { color:var(--ac); }
        .ea-hd-s { font-size:9px; color:var(--ac); letter-spacing:.05em; margin-top:2px; }
        .ea-book { font-size:10px; font-weight:600; color:#001512; background:var(--ac); padding:6px 11px; border-radius:6px; text-decoration:none; }
        .ea-body { flex:1; overflow-y:auto; padding:16px; scrollbar-width:thin; }
        .ea-greet { font-size:12px; color:#c8c4bc; line-height:1.7; margin-bottom:14px; }
        .ea-chips { display:flex; flex-direction:column; gap:8px; }
        .ea-chip { text-align:left; font-family:${MONO}; font-size:11.5px; color:#c8c4bc; background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:10px 12px; cursor:pointer; transition:border-color .15s,color .15s; }
        .ea-chip:hover { border-color:rgba(57,217,180,.45); color:#f0f0f0; }

        .ea-pipe { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
        .ea-node { font-size:10px; padding:4px 9px; border-radius:20px; border:1px solid rgba(255,255,255,.1); color:#5a5a5a; transition:all .3s; }
        .ea-node.on { border-color:rgba(57,217,180,.5); color:var(--ac); background:rgba(57,217,180,.08); }
        .ea-brief { padding:11px 12px; border-radius:8px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          font-size:11.5px; color:#c8c4bc; line-height:1.6; margin-bottom:14px; }
        .ea-brief span { color:#5a5a5a; font-size:9px; letter-spacing:.1em; text-transform:uppercase; display:block; margin-bottom:4px; }
        .ea-trace { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
        .ea-tl { font-size:11px; color:#c8c4bc; animation:eapop .25s ease; }
        .ea-tl b { color:var(--ac); font-weight:500; }
        .ea-working { font-size:11.5px; color:#5a5a5a; letter-spacing:.12em; }
        @keyframes eapop { from{opacity:0;transform:translateY(4px);} to{opacity:1;transform:none;} }

        .ea-ans { border:1px solid rgba(57,217,180,.25); border-radius:10px; overflow:hidden; animation:eapop .3s ease; }
        .ea-ans-h { padding:7px 13px; border-bottom:1px solid rgba(255,255,255,.06); font-size:9.5px; letter-spacing:.08em; color:var(--ac); }
        .ea-ans-b { padding:13px; font-size:12px; color:#e0ddd6; line-height:1.7; white-space:pre-wrap; }
        .ea-match { margin-top:11px; padding:10px; border-radius:6px; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.06); }
        .ea-match span { font-size:9px; color:#5a5a5a; text-transform:uppercase; letter-spacing:.1em; display:block; margin-bottom:4px; }
        .ea-match p { font-size:11px; color:#c8c4bc; line-height:1.6; }
        .ea-match em { color:var(--ac); font-style:normal; display:block; margin-top:5px; }

        .ea-msgs { display:flex; flex-direction:column; gap:9px; margin-top:14px; }
        .ea-msg { max-width:88%; font-size:11.5px; line-height:1.6; padding:9px 12px; border-radius:11px; white-space:pre-wrap; }
        .ea-msg.user { align-self:flex-end; background:rgba(57,217,180,.12); border:1px solid rgba(57,217,180,.25); color:#bdeee2; border-bottom-right-radius:3px; }
        .ea-msg.assistant { align-self:flex-start; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:#d8d5cf; border-bottom-left-radius:3px; }

        .ea-foot { display:flex; gap:8px; padding:12px 14px; border-top:1px solid rgba(255,255,255,.08); align-items:flex-end; }
        .ea-foot textarea { flex:1; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:8px;
          padding:9px 11px; resize:none; outline:none; font-family:${MONO}; font-size:11.5px; color:#e8e8e8; max-height:80px; }
        .ea-foot textarea:focus { border-color:rgba(57,217,180,.4); }
        .ea-send { width:34px; height:34px; flex-shrink:0; border:none; border-radius:8px; background:var(--ac); color:#001512; font-size:15px; cursor:pointer; }
        .ea-send:disabled { opacity:.35; cursor:default; }
        @media(prefers-reduced-motion:reduce){ .ea-tl,.ea-ans{ animation:none; } }
      `}</style>

      <div className="ea-hd">
        <div>
          <div className="ea-hd-t">agent<b>.engineering</b></div>
          <div className="ea-hd-s">● multi-agent · grounded in Om&apos;s work</div>
        </div>
        <a href="/book" className="ea-book">Book a call</a>
      </div>

      <div className="ea-body" ref={bodyRef}>
        {phase === "intro" && (
          <>
            <div className="ea-greet">
              Ask how Om architects production AI — agents, RAG, real-time inference, MLOps.
              The pipeline matches your question to work he&apos;s shipped, then answers.
            </div>
            <div className="ea-chips">
              {CHIPS.map(c => <button key={c} className="ea-chip" onClick={() => run(c)}>{c}</button>)}
            </div>
          </>
        )}

        {phase === "run" && (
          <>
            <div className="ea-brief"><span>your question</span>{first.current}</div>

            <div className="ea-pipe">
              {PIPELINE.map(a => (
                <span key={a} className={`ea-node ${done.includes(a) ? "on" : ""}`}>{done.includes(a) ? "✓ " : ""}{a}</span>
              ))}
            </div>

            {submitting && !result && <div className="ea-working">agents working···</div>}

            {result?.trace && revealed > 0 && (
              <div className="ea-trace">
                {result.trace.slice(0, revealed).map((t, i) => (
                  <div className="ea-tl" key={i}><b>{t.agent}</b> · {t.label}</div>
                ))}
              </div>
            )}

            {finished && (
              <div className="ea-ans">
                <div className="ea-ans-h">{result?.matched_case?.matched ? "◆ MATCHED A SHIPPED SYSTEM" : "◆ HOW OM WOULD BUILD IT"}</div>
                <div className="ea-ans-b">
                  {result?.answer}
                  {result?.matched_case?.matched && result.matched_case.reference && (
                    <div className="ea-match">
                      <span>proof</span>
                      <p>{result.matched_case.reference}{result.matched_case.result && <em>→ {result.matched_case.result}</em>}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {chat.length > 0 && (
              <div className="ea-msgs">
                {chat.map((m, i) => <div key={i} className={`ea-msg ${m.role}`}>{m.text}</div>)}
                {chatLoading && <div className="ea-working">···</div>}
              </div>
            )}
          </>
        )}
      </div>

      {(finished || phase === "run") && (
        <div className="ea-foot">
          <textarea
            value={input} rows={1} placeholder={finished ? "Ask a follow-up…" : "…"}
            disabled={!finished && submitting}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finished ? followUp(input) : run(input); } }}
          />
          <button className="ea-send" disabled={!input.trim() || chatLoading || (submitting && !finished)}
            onClick={() => (finished ? followUp(input) : run(input))}>→</button>
        </div>
      )}
    </div>
  );
}
