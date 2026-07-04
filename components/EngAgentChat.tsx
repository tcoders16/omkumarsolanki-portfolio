"use client";

/**
 * Engineering agentic chatbot, monochrome edition.
 * Same flow as before: router → case_match → architect → consultant pipeline
 * over /api/consult, live trace reveal, grounded answers, follow-up chat.
 * Styled in the site's five-tone system — hairlines, no radius, no shadows.
 */
import { useEffect, useRef, useState } from "react";

type Trace = { agent: string; label: string };
type MatchedCase = { matched?: boolean; reference?: string; result?: string };
type Result = { answer: string; matched_case?: MatchedCase; trace?: Trace[] };
type Msg = { role: "user" | "assistant"; text: string };

const PIPELINE = ["router", "case_match", "architect", "consultant"];
const CHIPS = [
  "How do you make agents production-reliable?",
  "How would you design multi-agent orchestration with memory?",
  "How would you build a real-time inference pipeline?",
];

export default function EngAgentChat() {
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

  useEffect(() => {
    if (!result?.trace) return;
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= (result.trace?.length ?? 0)) clearInterval(id);
    }, 480);
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
    <div className="eac">
      <style>{`
        .eac { border:1px solid #E9E9E5; background:#FAFAF8; display:flex; flex-direction:column;
          min-height:520px; max-height:680px; text-align:left;
          font-family:'Inter','Helvetica Neue',sans-serif; }
        .eac-hd { display:flex; align-items:center; justify-content:space-between; gap:16px;
          padding:16px 24px; border-bottom:1px solid #E9E9E5; }
        .eac-hd-t { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .eac-hd-s { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.14em;
          text-transform:uppercase; color:#6E6E78; display:flex; align-items:center; gap:8px; }
        .eac-dot { width:5px; height:5px; background:#0A0A0C; }
        .eac-book { font-size:14px; font-weight:500; color:#FAFAF8; background:#0A0A0C;
          padding:8px 16px; border-radius:7px; transition:background 0.15s; text-decoration:none; }
        .eac-book:hover { background:#26262E; }
        .eac-body { flex:1; overflow-y:auto; padding:24px; scrollbar-width:thin; }

        .eac-greet { font-size:15.5px; color:#26262E; line-height:1.65; margin:0 0 18px; }
        .eac-chips { display:flex; flex-direction:column; gap:8px; }
        .eac-chip { text-align:left; font-family:'Inter','Helvetica Neue',sans-serif; font-size:15px;
          color:#26262E; background:#FAFAF8; border:1px solid #E9E9E5; padding:13px 16px;
          cursor:pointer; transition:border-color 0.15s, color 0.15s; border-radius:0; }
        .eac-chip:hover { border-color:#26262E; color:#0A0A0C; }

        .eac-brief { border:1px solid #E9E9E5; padding:14px 16px; font-size:15px; color:#26262E;
          line-height:1.6; margin-bottom:16px; }
        .eac-brief span { display:block; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; margin-bottom:6px; }
        .eac-pipe { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
        .eac-node { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em;
          text-transform:uppercase; padding:5px 11px; border:1px solid #E9E9E5; color:#6E6E78;
          transition:all 0.3s; }
        .eac-node.on { border-color:#0A0A0C; background:#0A0A0C; color:#FAFAF8; }
        .eac-trace { display:flex; flex-direction:column; gap:7px; margin-bottom:16px; }
        .eac-tl { font-size:14px; color:#26262E; line-height:1.5; animation:eacpop 0.25s ease; }
        .eac-tl b { font-family:'Geist Mono',monospace; font-size:11.5px; font-weight:400;
          letter-spacing:0.08em; text-transform:uppercase; color:#6E6E78; }
        .eac-working { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        @keyframes eacpop { from { opacity:0; } to { opacity:1; } }

        .eac-ans { border:1px solid #E9E9E5; animation:eacpop 0.3s ease; }
        .eac-ans-h { padding:10px 16px; border-bottom:1px solid #E9E9E5;
          font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.14em;
          text-transform:uppercase; color:#6E6E78; }
        .eac-ans-b { padding:16px; font-size:15.5px; color:#26262E; line-height:1.65; white-space:pre-wrap; }
        .eac-match { margin-top:14px; border:1px solid #E9E9E5; padding:12px 14px; }
        .eac-match span { display:block; font-family:'Geist Mono',monospace; font-size:10px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; margin-bottom:6px; }
        .eac-match p { margin:0; font-size:14.5px; color:#26262E; line-height:1.6; }
        .eac-match em { display:block; margin-top:6px; font-style:normal; font-weight:500; color:#0A0A0C; }

        .eac-msgs { display:flex; flex-direction:column; gap:10px; margin-top:16px; }
        .eac-msg { max-width:88%; font-size:15px; line-height:1.6; padding:11px 14px; white-space:pre-wrap; }
        .eac-msg.user { align-self:flex-end; background:#0A0A0C; color:#FAFAF8; }
        .eac-msg.assistant { align-self:flex-start; border:1px solid #E9E9E5; color:#26262E; }

        .eac-foot { display:flex; gap:10px; padding:16px 24px; border-top:1px solid #E9E9E5; align-items:flex-end; }
        .eac-foot textarea { flex:1; background:#FAFAF8; border:1px solid #E9E9E5; border-radius:0;
          padding:11px 13px; resize:none; outline:none; font-family:'Inter','Helvetica Neue',sans-serif;
          font-size:15px; color:#0A0A0C; max-height:88px; transition:border-color 0.15s; }
        .eac-foot textarea:focus { border-color:#26262E; }
        .eac-send { flex-shrink:0; border:none; border-radius:7px; background:#0A0A0C; color:#FAFAF8;
          font-size:15px; font-weight:500; padding:11px 18px; cursor:pointer; transition:background 0.15s;
          font-family:'Inter','Helvetica Neue',sans-serif; }
        .eac-send:hover { background:#26262E; }
        .eac-send:disabled { opacity:0.35; cursor:default; background:#0A0A0C; }
        @media (prefers-reduced-motion: reduce) { .eac-tl, .eac-ans { animation:none; } }
      `}</style>

      <div className="eac-hd">
        <div>
          <div className="eac-hd-t">Engineering agent</div>
          <div className="eac-hd-s" style={{ marginTop: 5 }}>
            <span className="eac-dot" />Multi-agent · grounded in shipped work
          </div>
        </div>
        <a href="/book" className="eac-book">Book a call</a>
      </div>

      <div className="eac-body" ref={bodyRef}>
        {phase === "intro" && (
          <>
            <div className="eac-greet">
              Ask how Om architects production AI — agents, orchestration, RAG, real-time
              inference. The pipeline matches your question to work he&apos;s shipped, then answers.
            </div>
            <div className="eac-chips">
              {CHIPS.map(c => <button key={c} className="eac-chip" onClick={() => run(c)}>{c}</button>)}
            </div>
          </>
        )}

        {phase === "run" && (
          <>
            <div className="eac-brief"><span>Your question</span>{first.current}</div>

            <div className="eac-pipe">
              {PIPELINE.map(a => (
                <span key={a} className={`eac-node ${done.includes(a) ? "on" : ""}`}>{a}</span>
              ))}
            </div>

            {submitting && !result && <div className="eac-working">Agents working</div>}

            {result?.trace && revealed > 0 && (
              <div className="eac-trace">
                {result.trace.slice(0, revealed).map((t, i) => (
                  <div className="eac-tl" key={i}><b>{t.agent}</b> · {t.label}</div>
                ))}
              </div>
            )}

            {finished && (
              <div className="eac-ans">
                <div className="eac-ans-h">
                  {result?.matched_case?.matched ? "Matched a shipped system" : "How Om would build it"}
                </div>
                <div className="eac-ans-b">
                  {result?.answer}
                  {result?.matched_case?.matched && result.matched_case.reference && (
                    <div className="eac-match">
                      <span>Proof</span>
                      <p>
                        {result.matched_case.reference}
                        {result.matched_case.result && <em>→ {result.matched_case.result}</em>}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {chat.length > 0 && (
              <div className="eac-msgs">
                {chat.map((m, i) => <div key={i} className={`eac-msg ${m.role}`}>{m.text}</div>)}
                {chatLoading && <div className="eac-working">···</div>}
              </div>
            )}
          </>
        )}
      </div>

      {(finished || phase === "run") && (
        <div className="eac-foot">
          <textarea
            value={input} rows={1} placeholder={finished ? "Ask a follow-up…" : "…"}
            disabled={!finished && submitting}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (finished) followUp(input); else run(input);
              }
            }}
          />
          <button className="eac-send" disabled={!input.trim() || chatLoading || (submitting && !finished)}
            onClick={() => (finished ? followUp(input) : run(input))}>Send</button>
        </div>
      )}
    </div>
  );
}
