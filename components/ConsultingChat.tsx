"use client";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   ConsultingChat — client-facing agentic RAG chat.
   The visitor describes their problem; the multi-agent service
   (router → case-match → architect → consultant) answers with how
   Om would help — grounded in his real, shipped work — and matches
   a proven case when one fits. Powers the /consulting centerpiece.
═══════════════════════════════════════════════════════════════ */

const T = "#39d9b4";
const VI = "#8b5cf6";

type MatchedCase = {
  matched: boolean;
  problem?: string;
  solution?: string;
  reference?: string;
  result?: string;
  score?: number;
};
type ConsultResult = {
  answer: string;
  classification?: { domain?: string; urgency?: string; intent?: string };
  matched_case?: MatchedCase;
  show_booking?: boolean;
  booking_url?: string;
};
type Msg = { role: "user" | "assistant"; text: string; result?: ConsultResult };

const STARTERS = [
  "Our agent works in the demo but breaks in production.",
  "Our LLM costs are scaling out of control.",
  "The agent hallucinates and we can't tell when.",
  "We have no senior AI lead to own reliability.",
];

export default function ConsultingChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorProblem, setAnchorProblem] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string) {
    const problem = text.trim();
    if (!problem || loading) return;
    setInput("");

    const isFirst = msgs.length === 0;
    const anchor = isFirst ? problem : anchorProblem;
    if (isFirst) setAnchorProblem(problem);

    const history = msgs.map(m => ({ role: m.role, content: m.text }));
    setMsgs(prev => [...prev, { role: "user", text: problem }]);
    setLoading(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: isFirst ? problem : anchor,
          // follow-up turns carry the new question as the latest history entry
          history: isFirst ? [] : [...history, { role: "user", content: problem }],
          persist: isFirst, // first turn saves a lead; follow-ups don't
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsgs(prev => [...prev, { role: "assistant", text: `Sorry — ${data.error || "something went wrong."} You can reach Om directly at om@resso.ai.` }]);
      } else {
        setMsgs(prev => [...prev, { role: "assistant", text: data.answer, result: data as ConsultResult }]);
      }
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Sorry — I couldn't reach the consulting agent. Email Om directly at om@resso.ai." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cchat" id="consult-chat">
      <style>{`
        .cchat { border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:linear-gradient(180deg,#0b0b0b,#070707); overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,.5); display:flex; flex-direction:column; height:100%; max-height:100%; }
        .cchat-hd { display:flex; align-items:center; gap:11px; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07); background:rgba(57,217,180,.03); }
        .cchat-dot { width:8px; height:8px; border-radius:50%; background:${T}; box-shadow:0 0 0 0 rgba(57,217,180,.5); animation:cc-pulse 2s infinite; flex-shrink:0; }
        @keyframes cc-pulse { 0%{box-shadow:0 0 0 0 rgba(57,217,180,.5);} 70%{box-shadow:0 0 0 7px rgba(57,217,180,0);} 100%{box-shadow:0 0 0 0 rgba(57,217,180,0);} }
        .cchat-hd-t { font-family:'Syne',sans-serif; font-weight:800; font-size:14px; color:#f0f0f0; letter-spacing:-.01em; }
        .cchat-hd-s { font-family:'JetBrains Mono',monospace; font-size:10px; color:#707070; letter-spacing:.05em; margin-top:2px; }

        .cchat-thread { padding:22px 20px; flex:1 1 auto; min-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; }
        .cchat-empty { color:#9a968e; font-family:'Space Grotesk',sans-serif; font-weight:300; font-size:14px; line-height:1.7; }
        .cchat-empty strong { color:#f0f0f0; font-weight:600; }

        .cc-row { display:flex; flex-direction:column; max-width:88%; }
        .cc-row.user { align-self:flex-end; align-items:flex-end; }
        .cc-row.assistant { align-self:flex-start; align-items:flex-start; }
        .cc-bub { padding:13px 16px; border-radius:12px; font-family:'Space Grotesk',sans-serif; font-size:13.5px; line-height:1.65; font-weight:300; white-space:pre-wrap; }
        .cc-row.user .cc-bub { background:${T}; color:#001512; font-weight:400; border-bottom-right-radius:3px; }
        .cc-row.assistant .cc-bub { background:#141414; color:#e8e6e1; border:1px solid rgba(255,255,255,0.07); border-bottom-left-radius:3px; }

        .cc-case { margin-top:10px; border:1px solid rgba(57,217,180,.28); background:rgba(57,217,180,.05); border-radius:9px; padding:14px 15px; max-width:100%; }
        .cc-case.tailored { border-color:rgba(139,92,246,.3); background:rgba(139,92,246,.05); }
        .cc-case-tag { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:${T}; margin-bottom:9px; }
        .cc-case.tailored .cc-case-tag { color:#a98bff; }
        .cc-case-row { font-family:'Space Grotesk',sans-serif; font-size:12px; line-height:1.55; color:#c8c4bc; margin-top:6px; }
        .cc-case-row b { color:#f0f0f0; font-weight:600; }

        .cc-book { display:inline-flex; align-items:center; gap:7px; margin-top:12px; font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; padding:10px 16px; background:${T}; color:#001512; border-radius:3px; text-decoration:none; transition:transform .18s; }
        .cc-book:hover { transform:translateY(-1px); }

        .cc-typing { display:flex; gap:5px; padding:13px 16px; }
        .cc-typing span { width:6px; height:6px; border-radius:50%; background:#5a5a5a; animation:cc-blink 1.3s infinite; }
        .cc-typing span:nth-child(2){ animation-delay:.18s; } .cc-typing span:nth-child(3){ animation-delay:.36s; }
        @keyframes cc-blink { 0%,60%,100%{opacity:.25;} 30%{opacity:1;} }

        .cchat-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }
        .cc-chip { font-family:'Space Grotesk',sans-serif; font-size:12px; color:#c8c4bc; background:#0f0f0f; border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:8px 14px; cursor:pointer; text-align:left; transition:border-color .15s, color .15s; }
        .cc-chip:hover { border-color:rgba(57,217,180,.45); color:#f0f0f0; }

        .cchat-input { display:flex; gap:10px; padding:14px 16px; border-top:1px solid rgba(255,255,255,0.07); background:#080808; }
        .cchat-input textarea { flex:1; resize:none; background:#0f0f0f; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#f0f0f0; font-family:'Space Grotesk',sans-serif; font-size:13.5px; padding:11px 13px; line-height:1.5; outline:none; transition:border-color .15s; max-height:120px; }
        .cchat-input textarea:focus { border-color:rgba(57,217,180,.5); }
        .cchat-send { flex-shrink:0; align-self:flex-end; background:${T}; color:#001512; border:none; border-radius:8px; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; padding:11px 18px; cursor:pointer; transition:background .15s, opacity .15s; }
        .cchat-send:disabled { opacity:.45; cursor:not-allowed; }
        .cchat-foot { padding:10px 16px; border-top:1px solid rgba(255,255,255,0.05); font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.05em; color:#5a5a5a; text-align:center; }
      `}</style>

      <div className="cchat-hd">
        <span className="cchat-dot" />
        <div>
          <div className="cchat-hd-t">Talk to my AI consultant</div>
          <div className="cchat-hd-s">multi-agent · grounded in Om&apos;s real, shipped work</div>
        </div>
      </div>

      <div className="cchat-thread" ref={threadRef}>
        {msgs.length === 0 && (
          <div className="cchat-empty">
            <p>
              Describe what your AI agent or product is doing wrong — <strong>hallucinating, drifting,
              burning budget, breaking at scale</strong>. The agent will tell you the likely root cause,
              show how Om would fix it (matched to a case he&apos;s already shipped when one fits), and
              what the next step looks like.
            </p>
            <div className="cchat-chips">
              {STARTERS.map(s => (
                <button key={s} className="cc-chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`cc-row ${m.role}`}>
            <div className="cc-bub">{m.text}</div>
            {m.result?.matched_case && (
              <CaseCard mc={m.result.matched_case} />
            )}
            {m.result?.show_booking && (
              <a href={m.result.booking_url || "/book"} className="cc-book">Book a free 30-min call →</a>
            )}
          </div>
        ))}

        {loading && (
          <div className="cc-row assistant">
            <div className="cc-bub" style={{ padding: 0 }}>
              <div className="cc-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
      </div>

      <div className="cchat-input">
        <textarea
          rows={1}
          placeholder="Describe your agent / AI problem…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
        />
        <button className="cchat-send" disabled={loading || !input.trim()} onClick={() => send(input)}>
          {loading ? "…" : "Send"}
        </button>
      </div>
      <div className="cchat-foot">
        NeMo-guarded · only your first message is saved as an inquiry · for a real scope, book a call
      </div>
    </div>
  );
}

function CaseCard({ mc }: { mc: MatchedCase }) {
  if (mc.matched) {
    return (
      <div className="cc-case">
        <div className="cc-case-tag">◆ Matched a proven case{typeof mc.score === "number" ? ` · ${(mc.score * 100).toFixed(0)}%` : ""}</div>
        {mc.solution && <div className="cc-case-row"><b>Solution:</b> {mc.solution}</div>}
        {mc.reference && <div className="cc-case-row"><b>Proof:</b> {mc.reference}</div>}
        {mc.result && <div className="cc-case-row"><b>Result:</b> {mc.result}</div>}
      </div>
    );
  }
  return (
    <div className="cc-case tailored">
      <div className="cc-case-tag" style={{ color: VI }}>◆ Tailored approach — designed from adjacent work</div>
    </div>
  );
}
