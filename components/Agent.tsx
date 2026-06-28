"use client";

/**
 * The common agent — floating bottom-right on every page. Progressive flow:
 *   1. CHAT     — people chat about Om (background, experience).
 *   2. HARNESS  — company/business questions surface the multi-agent run.
 *   3. FORM     — then we offer to book: an intake that emails Om + /book.
 *
 * Page-aware: replies are steered by where the visitor is (engineering vs
 * consultancy). Answers are cleaned of external scheduling links and rendered
 * as markdown. Grounded via /api/consult.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const ACCENT = "#39d9b4";
const MONO = "var(--font-mono)";

type Trace = { agent: string; label: string };
type Msg = { role: "user" | "assistant"; text: string; harness?: Trace[] };
type ConsultResp = { answer?: string; error?: string; trace?: Trace[]; matched_case?: { matched?: boolean; result?: string };
  appointment?: { booked?: boolean; start?: string; event_link?: string; proposed_slots?: string[] } };

const PIPELINE = ["router", "case_match", "architect", "consultant"];

type Persona = { id: string; label: string; greet: string; chips: string[]; steer: string };
const PERSONAS: Record<string, Persona> = {
  engineering: {
    id: "engineering",
    label: "engineering",
    greet: "Ask about how Om architects production AI — agents, RAG, real-time inference, MLOps. I'll answer with concrete architecture and efficiency examples.",
    chips: ["How would you cut inference latency?", "Show an agent architecture you've shipped", "How do you make ML reliable in production?"],
    steer: "The visitor is on Om's engineering portfolio. Answer as a senior AI/ML engineer with concrete architecture, system-design, and efficiency examples (latency, cost, reliability, throughput). Be technical and specific. Do not include any external booking or calendar links.",
  },
  consulting: {
    id: "consulting",
    label: "consultancy",
    greet: "Tell me about your startup's agents — memory, workflows, architecture. I'll show how Om would fix them, scale them, and hand the system to your team.",
    chips: ["Fix our agent's memory", "Make our multi-step workflow reliable", "How do you hand it over to our team?"],
    steer: "The visitor is on Om's consultancy site for AI startups. Answer about agent architecture, memory, multi-step workflows, reliability, scaling the company, and clean handover to their team. Practical and outcome-focused. Do not include any external booking or calendar links.",
  },
  default: {
    id: "default",
    label: "ask anything",
    greet: "Hi — I'm Om's AI. Ask about Om: his background, experience, how he works. Or tell me about your company and I'll show how he'd help.",
    chips: ["Who is Om?", "What's his experience?", "How can he help my company?"],
    steer: "Answer questions about Om's background and experience, or about how he'd help the visitor's company. Do not include any external booking or calendar links.",
  },
};

function personaFor(path: string | null): Persona {
  if (path?.startsWith("/consulting")) return PERSONAS.consulting;
  if (path?.startsWith("/engineering")) return PERSONAS.engineering;
  return PERSONAS.default;
}

const WHAT_YOU_GET = [
  { n: "01", t: "A diagnosis", b: "The real problem named — not the symptom." },
  { n: "02", t: "A plan", b: "Scope, effort, and the impact it buys you." },
  { n: "03", t: "Shipped", b: "Built and in production — not just advice." },
];

const BIZ_RE = /\b(my|our|we|us|company|business|startup|team|client|customers?|automat|workflow|agent|scale|deploy|production|problem|process|pipeline|product|leads?|cost|integrat|build|help (me|us))\b/i;

const DEFAULT_TRACE: Trace[] = [
  { agent: "router", label: "classified your request" },
  { agent: "case_match", label: "searched Om's prior work" },
  { agent: "architect", label: "designed the approach" },
  { agent: "consultant", label: "wrote the recommendation" },
];

// Live harness stages shown while the multi-agent backend runs.
const STAGES = [
  { k: "guardrails.check", d: "NeMo guardrails" },
  { k: "router.route", d: "intent routing" },
  { k: "memory.recall", d: "vector + episodic memory" },
  { k: "kb.retrieve", d: "knowledge-base facts" },
  { k: "agent.synthesize", d: "consultant synthesis" },
];

function isBusinessRun(d: ConsultResp): boolean {
  return (d.trace ?? []).some(t => ["case_match", "architect", "consultant"].includes(t.agent)) || !!d.matched_case?.matched;
}

// Strip external scheduling links — booking goes through our own flow.
function cleanAnswer(a: string): string {
  return a
    .replace(/\[([^\]]*)\]\((https?:\/\/[^)]*(?:cal\.com|calendly)[^)]*)\)/gi, "the Book button below")
    .replace(/https?:\/\/[^\s)]*(?:cal\.com|calendly)[^\s)]*/gi, "the Book button below")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Tiny markdown → JSX (bold, inline code, links, bullet lists, paragraphs).
function inline(text: string, k0 = 0): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g;
  let last = 0, m: RegExpExecArray | null, k = k0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2]) out.push(<strong key={k++}>{m[2]}</strong>);
    else if (m[3]) out.push(<code key={k++}>{m[3]}</code>);
    else if (m[4]) out.push(<a key={k++} href={m[5]} target="_blank" rel="noopener noreferrer">{m[4]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function renderMd(text: string): React.ReactNode[] {
  const lines = text.split(/\n/);
  const blocks: React.ReactNode[] = [];
  let list: React.ReactNode[] | null = null, k = 0;
  for (const line of lines) {
    const b = line.match(/^\s*[-*]\s+(.*)/);
    if (b) { (list ??= []).push(<li key={k++}>{inline(b[1], k * 100)}</li>); continue; }
    if (list) { blocks.push(<ul key={k++}>{list}</ul>); list = null; }
    if (line.trim() === "") continue;
    blocks.push(<p key={k++}>{inline(line, k * 100)}</p>);
  }
  if (list) blocks.push(<ul key={k++}>{list}</ul>);
  return blocks;
}

function Panel({ onClose }: { onClose?: () => void }) {
  const persona = personaFor(usePathname());
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [lastProblem, setLastProblem] = useState("");
  const [view, setView] = useState<"chat" | "form">("chat");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [copied, setCopied] = useState(-1);
  const [stage, setStage] = useState(0);
  const started = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, loading, view, sent]);

  function copy(text: string, i: number) {
    navigator.clipboard?.writeText(text).then(() => { setCopied(i); setTimeout(() => setCopied(-1), 1200); }).catch(() => {});
  }

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, text: t }];
    setMsgs(next); setInput("");

    // Capture an email the visitor types so the appointment agent can book directly.
    const foundEmail = t.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0];
    const useEmail = foundEmail || email;
    if (foundEmail) setEmail(foundEmail);

    setLoading(true); setStage(0);
    const ticker = setInterval(() => setStage(s => Math.min(s + 1, STAGES.length - 1)), 650);
    const persist = !started.current; started.current = true;
    try {
      const res = await fetch("/api/consult", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: `[Context: ${persona.steer}]\n\nQuestion: ${t}`,
          history: next.map(m => ({ role: m.role, content: m.text })),
          contactName: name.trim(),
          contactEmail: useEmail.trim(),
          persist,
        }),
      });
      const data: ConsultResp = await res.json();
      if (!res.ok) {
        setMsgs(prev => [...prev, { role: "assistant", text: "I'm having trouble reaching the agent — you can book a call and Om will reply directly." }]);
        return;
      }
      const biz = isBusinessRun(data) || BIZ_RE.test(t);
      if (biz) { setHasBusiness(true); setLastProblem(t); }
      const harness = biz ? (data.trace && data.trace.length ? data.trace : DEFAULT_TRACE) : undefined;
      // If the appointment agent booked a real slot, surface the calendar link inline.
      let answer = cleanAnswer(data.answer || "");
      const appt = data.appointment;
      if (appt?.booked && appt.event_link) answer += `\n\n[Add to your calendar →](${appt.event_link})`;
      setMsgs(prev => [...prev, { role: "assistant", text: answer, harness }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Network hiccup — try again, or book a call." }]);
    } finally { clearInterval(ticker); setLoading(false); }
  }

  async function requestAppointment() {
    if (!lastProblem.trim() || !email.trim() || sending) return;
    setSending(true); setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Website visitor", email: email.trim(), subject: `Appointment request (${persona.label})`, message: lastProblem }),
      });
      if (res.ok) setSent(true);
      else setSendError("Couldn't send — use “pick a time now” below.");
    } catch { setSendError("Network error — use “pick a time now” below."); }
    finally { setSending(false); }
  }

  const bookHref = `/book?note=${encodeURIComponent(lastProblem.slice(0, 280))}${email ? `&email=${encodeURIComponent(email)}` : ""}`;

  return (
    <div className="ag-panel">
      <div className="ag-hd">
        <span className="ag-hd-l">
          <span className="ag-av">O</span>
          <span>
            <b>Om&apos;s AI</b>
            <i><span className="ag-stat" /> online · {view === "form" ? "intake" : persona.label}</i>
          </span>
        </span>
        {onClose && <button onClick={onClose} aria-label="Close" className="ag-x">✕</button>}
      </div>

      {view === "chat" ? (
        <>
          <div className="ag-body" ref={bodyRef}>
            {msgs.length === 0 && (
              <>
                <div className="ag-greet">{persona.greet}</div>
                <div className="ag-cap">Capabilities · architecture · code &amp; systems · cost / latency · grounded in Om&apos;s work</div>
                <div className="ag-chips">
                  {persona.chips.map(c => <button key={c} className="ag-chip" onClick={() => send(c)}>{c}</button>)}
                </div>
              </>
            )}
            {msgs.map((m, i) => (
              <div key={i} className="ag-turn">
                {m.harness && m.harness.length > 0 && <Harness trace={m.harness} />}
                {m.role === "user"
                  ? <div className="ag-msg user">{m.text}</div>
                  : (
                    <div className="ag-asst">
                      <div className="ag-msg assistant ag-md">{renderMd(m.text)}</div>
                      <button className="ag-copy" onClick={() => copy(m.text, i)}>{copied === i ? "copied ✓" : "copy"}</button>
                    </div>
                  )}
              </div>
            ))}
            {loading && <RunningHarness stage={stage} />}
          </div>

          {hasBusiness && (
            <button className="ag-offer" onClick={() => setView("form")}>Would you like to book an appointment? →</button>
          )}

          {msgs.length > 0 && (
            <div className="ag-quick">
              {persona.chips.map(c => <button key={c} className="ag-qchip" onClick={() => send(c)}>{c}</button>)}
            </div>
          )}

          <div className="ag-input">
            <textarea value={input} rows={1} placeholder="Ask anything…"
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="ag-send">→</button>
          </div>
        </>
      ) : (
        <div className="ag-body" ref={bodyRef}>
          <button className="ag-back" onClick={() => setView("chat")}>← back to chat</button>
          {sent ? (
            <div className="ag-sent">
              <div className="ag-sent-ic">✓</div>
              <div className="ag-sent-t">Request sent</div>
              <div className="ag-sent-b">Om will email you at <b>{email}</b> to confirm a time. Want to lock a slot now?</div>
              <a className="ag-book-big" href={bookHref}>Pick a time now →</a>
            </div>
          ) : (
            <>
              <div className="ag-greet">Send Om your request — he&apos;ll email you to confirm a time. Or pick a slot directly.</div>
              <label className="ag-l">{"// your name"}</label>
              <input className="ag-in" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
              <label className="ag-l">{"// what should Om help with?"}</label>
              <textarea className="ag-ta" rows={3} placeholder="a sentence on what you're trying to fix…"
                value={lastProblem} onChange={e => setLastProblem(e.target.value)} />
              <label className="ag-l">{"// your email"}</label>
              <input className="ag-in" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
              {sendError && <div className="ag-err">{sendError}</div>}
              <button className="ag-book-big" disabled={sending || !email.trim() || !lastProblem.trim()} onClick={requestAppointment}>
                {sending ? "Sending…" : "Request appointment →"}
              </button>
              <a className="ag-pick" href={bookHref}>or pick a time now →</a>
              <div className="ag-fw-l">What you&apos;d get</div>
              <div className="ag-fw">
                {WHAT_YOU_GET.map(f => (
                  <div key={f.n} className="ag-fw-row"><span className="ag-fw-n">{f.n}</span><span><b>{f.t}</b><i>{f.b}</i></span></div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RunningHarness({ stage }: { stage: number }) {
  return (
    <div className="ag-harness ag-run">
      <div className="ag-harness-h">◆ agent run · live</div>
      <div className="ag-rsteps">
        {STAGES.map((s, i) => (
          <div key={s.k} className={`ag-rstep ${i === stage ? "on" : ""} ${i < stage ? "done" : ""}`}>
            <span className="ag-ricon">{i < stage ? "✓" : i === stage ? <span className="ag-rspin" /> : "○"}</span>
            <span className="ag-rk">{s.k}</span>
            <span className="ag-rd">{s.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Harness({ trace }: { trace: Trace[] }) {
  const agents = trace.map(t => t.agent);
  return (
    <div className="ag-harness">
      <div className="ag-harness-h">◆ agent run</div>
      <div className="ag-pipe">
        {PIPELINE.map(a => <span key={a} className={`ag-node ${agents.includes(a) ? "on" : ""}`}>{agents.includes(a) ? "✓ " : ""}{a}</span>)}
      </div>
      <div className="ag-trace">
        {trace.map((t, i) => <div key={i} className="ag-tl"><b>{t.agent}</b> · {t.label}</div>)}
      </div>
    </div>
  );
}

const STYLE = `
  .ag-panel { --ac:${ACCENT}; display:flex; flex-direction:column; background:#0c0d10;
    border:1px solid rgba(255,255,255,.12); border-radius:16px; overflow:hidden;
    font-family:${MONO}; box-shadow:0 24px 70px -20px rgba(0,0,0,.7); }
  .ag-hd { display:flex; align-items:center; justify-content:space-between; padding:12px 14px;
    border-bottom:1px solid rgba(255,255,255,.08); background:linear-gradient(180deg,rgba(57,217,180,.05),transparent); }
  .ag-hd-l { display:flex; align-items:center; gap:10px; }
  .ag-av { width:32px; height:32px; border-radius:9px; flex-shrink:0; background:linear-gradient(135deg,#39d9b4,#0d9488);
    color:#001512; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:800; font-size:15px; }
  .ag-hd-l > span:last-child { display:flex; flex-direction:column; }
  .ag-hd-l b { font-size:12.5px; color:#f0f0f0; font-weight:600; }
  .ag-hd-l i { font-size:9.5px; color:#8a8f8d; font-style:normal; letter-spacing:.03em; margin-top:2px; display:flex; align-items:center; gap:5px; }
  .ag-stat { width:6px; height:6px; border-radius:50%; background:var(--ac); box-shadow:0 0 0 0 rgba(57,217,180,.5); animation:agpulse 2s infinite; }
  @keyframes agpulse { 0%,100%{ box-shadow:0 0 0 0 rgba(57,217,180,.5);} 70%{ box-shadow:0 0 0 5px rgba(57,217,180,0);} }
  .ag-x { background:none; border:none; color:#777; font-size:13px; cursor:pointer; padding:2px 4px; }
  .ag-x:hover { color:#f0f0f0; }
  .ag-body { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:11px; scrollbar-width:thin; }
  .ag-greet { font-size:11.5px; color:#c8c4bc; line-height:1.7; }
  .ag-greet b { color:#f0f0f0; }
  .ag-cap { font-size:9.5px; color:#5a5a5a; letter-spacing:.02em; line-height:1.6; }
  .ag-chips { display:flex; flex-direction:column; gap:7px; }
  .ag-chip { text-align:left; font-family:${MONO}; font-size:11px; color:#c8c4bc; background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:10px 12px; cursor:pointer; transition:border-color .15s, color .15s; }
  .ag-chip:hover { border-color:rgba(57,217,180,.45); color:#f0f0f0; }
  .ag-turn { display:flex; flex-direction:column; }
  .ag-msg { font-size:11.5px; line-height:1.65; padding:10px 13px; border-radius:12px; }
  .ag-msg.user { align-self:flex-end; max-width:90%; background:rgba(57,217,180,.12); border:1px solid rgba(57,217,180,.25); color:#bdeee2; border-bottom-right-radius:3px; white-space:pre-wrap; }
  .ag-asst { display:flex; flex-direction:column; align-items:flex-start; max-width:92%; }
  .ag-msg.assistant { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:#dcd9d2; border-bottom-left-radius:3px; max-width:100%; }
  .ag-copy { background:none; border:none; color:#4a4a4a; font-family:${MONO}; font-size:9px; cursor:pointer; margin-top:4px; padding:0 2px; }
  .ag-copy:hover { color:var(--ac); }
  /* markdown */
  .ag-md p { margin:0 0 7px; } .ag-md p:last-child { margin-bottom:0; }
  .ag-md strong { color:#fff; font-weight:600; }
  .ag-md code { font-family:${MONO}; background:rgba(255,255,255,.09); padding:1px 5px; border-radius:4px; font-size:10.5px; color:#bdeee2; }
  .ag-md ul { margin:5px 0 7px; padding-left:16px; } .ag-md li { margin:3px 0; }
  .ag-md a { color:#7fe7cf; text-decoration:underline; }
  .ag-typing { display:flex; gap:4px; padding:6px 4px; }
  .ag-typing span { width:6px; height:6px; border-radius:50%; background:#4a4a4a; animation:agbounce 1s infinite; }
  .ag-typing span:nth-child(2){ animation-delay:.15s; } .ag-typing span:nth-child(3){ animation-delay:.3s; }
  @keyframes agbounce { 0%,60%,100%{ transform:translateY(0); opacity:.4; } 30%{ transform:translateY(-4px); opacity:1; } }

  /* harness */
  .ag-harness { border:1px solid rgba(57,217,180,.22); border-radius:9px; padding:10px 11px; margin-bottom:8px;
    background:rgba(57,217,180,.03); animation:agpop .3s ease both; }
  @keyframes agpop { from{opacity:0;transform:translateY(5px);} to{opacity:1;transform:none;} }
  .ag-harness-h { font-size:9px; letter-spacing:.1em; color:var(--ac); margin-bottom:8px; }
  .ag-pipe { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:9px; }
  .ag-node { font-size:9px; padding:3px 7px; border-radius:20px; border:1px solid rgba(255,255,255,.1); color:#5a5a5a; }
  .ag-node.on { border-color:rgba(57,217,180,.5); color:var(--ac); background:rgba(57,217,180,.08); }
  .ag-trace { display:flex; flex-direction:column; gap:4px; }
  .ag-tl { font-size:10px; color:#9a9a9a; } .ag-tl b { color:var(--ac); font-weight:500; }

  /* live running harness loader */
  .ag-run { align-self:flex-start; min-width:240px; }
  .ag-rsteps { display:flex; flex-direction:column; gap:8px; }
  .ag-rstep { display:flex; align-items:center; gap:9px; font-size:10.5px; color:#4f5560; transition:color .25s; }
  .ag-rstep.on { color:#f0f0f0; } .ag-rstep.done { color:var(--ac); }
  .ag-ricon { width:13px; display:inline-flex; justify-content:center; flex-shrink:0; }
  .ag-rspin { width:10px; height:10px; border:2px solid rgba(255,255,255,.15); border-top-color:var(--ac); border-radius:50%; animation:agspin .7s linear infinite; }
  @keyframes agspin { to { transform:rotate(360deg); } }
  .ag-rk { color:inherit; } .ag-rd { color:#5a5a5a; margin-left:auto; font-size:9px; }
  .ag-rstep.on .ag-rd, .ag-rstep.done .ag-rd { color:#7a7f88; }

  /* offer + quick prompts */
  .ag-offer { margin:0 12px 8px; padding:10px; border-radius:8px; border:1px dashed rgba(57,217,180,.4);
    background:rgba(57,217,180,.05); color:var(--ac); font-family:${MONO}; font-size:11px; font-weight:600; cursor:pointer; transition:background .15s; }
  .ag-offer:hover { background:rgba(57,217,180,.1); }
  .ag-quick { display:flex; gap:6px; overflow-x:auto; padding:0 12px 8px; scrollbar-width:none; }
  .ag-quick::-webkit-scrollbar { display:none; }
  .ag-qchip { flex-shrink:0; font-family:${MONO}; font-size:10px; color:#9a9a9a; background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:5px 11px; cursor:pointer; white-space:nowrap; transition:border-color .15s, color .15s; }
  .ag-qchip:hover { border-color:rgba(57,217,180,.4); color:#f0f0f0; }

  /* chat input row */
  .ag-input { display:flex; align-items:flex-end; gap:8px; padding:10px 12px;
    border-top:1px solid rgba(255,255,255,.08); background:#0c0d10; }
  .ag-input textarea { flex:1; box-sizing:border-box; resize:none; max-height:120px;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:10px;
    padding:10px 12px; outline:none; font-family:${MONO}; font-size:12px; color:#e8e8e8; line-height:1.4; }
  .ag-input textarea::placeholder { color:#5a5a5a; }
  .ag-input textarea:focus { border-color:rgba(57,217,180,.4); }
  .ag-send { flex-shrink:0; width:38px; height:38px; border:none; border-radius:10px; background:var(--ac);
    color:#001512; font-size:16px; font-weight:700; cursor:pointer; display:flex; align-items:center;
    justify-content:center; transition:opacity .15s; }
  .ag-send:disabled { opacity:.35; cursor:default; }

  /* form */
  .ag-back { align-self:flex-start; background:none; border:none; color:#5a5a5a; font-family:${MONO}; font-size:10.5px; cursor:pointer; padding:0; }
  .ag-back:hover { color:#f0f0f0; }
  .ag-body > * { flex-shrink:0; }
  .ag-l { display:block; font-size:10.5px; color:#5a5a5a; letter-spacing:.04em; margin:0 0 7px; }
  .ag-ta, .ag-in { width:100%; box-sizing:border-box; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:8px;
    padding:9px 11px; outline:none; font-family:${MONO}; font-size:11.5px; color:#e8e8e8; }
  .ag-ta { min-height:64px; resize:vertical; }
  .ag-ta:focus, .ag-in:focus { border-color:rgba(57,217,180,.4); }
  .ag-fw-l { font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:#5a5a5a; margin:6px 0 2px; }
  .ag-fw { display:flex; flex-direction:column; gap:9px; }
  .ag-fw-row { display:flex; gap:11px; }
  .ag-fw-n { font-size:10px; color:var(--ac); padding-top:1px; }
  .ag-fw-row span:last-child { display:flex; flex-direction:column; }
  .ag-fw-row b { font-size:11.5px; color:#f0f0f0; font-weight:600; }
  .ag-fw-row i { font-size:10.5px; color:#9a9a9a; font-style:normal; margin-top:2px; line-height:1.5; }
  .ag-book-big { display:block; width:100%; text-align:center; margin-top:8px; background:var(--ac); color:#001512;
    font-family:${MONO}; font-weight:700; font-size:12px; padding:12px; border:none; border-radius:8px; text-decoration:none; cursor:pointer; transition:opacity .15s; }
  .ag-book-big:disabled { opacity:.4; cursor:default; }
  .ag-pick { display:block; text-align:center; margin-top:10px; color:#5a5a5a; font-family:${MONO}; font-size:10.5px; text-decoration:none; }
  .ag-pick:hover { color:var(--ac); }
  .ag-err { font-family:${MONO}; font-size:10.5px; color:#f87171; margin-top:10px; }
  .ag-sent { text-align:center; padding:24px 6px; animation:agpop .3s ease both; }
  .ag-sent-ic { width:42px; height:42px; margin:0 auto 14px; border-radius:50%; background:rgba(57,217,180,.12);
    border:1px solid rgba(57,217,180,.4); color:var(--ac); display:flex; align-items:center; justify-content:center; font-size:18px; }
  .ag-sent-t { font-family:${MONO}; font-size:14px; color:#f0f0f0; font-weight:600; margin-bottom:8px; }
  .ag-sent-b { font-family:${MONO}; font-size:11.5px; color:#9a9a9a; line-height:1.6; margin-bottom:18px; }
  .ag-sent-b b { color:#c8c4bc; }

  /* floating shell — bottom right */
  .ag-fab { position:fixed; right:22px; bottom:22px; z-index:9992; display:flex; align-items:center; gap:8px;
    font-family:${MONO}; font-size:12px; font-weight:600; color:#001512; background:${ACCENT};
    border:none; border-radius:999px; padding:12px 18px; cursor:pointer; box-shadow:0 10px 30px -8px rgba(57,217,180,.5);
    transition:transform .18s, box-shadow .18s; }
  .ag-fab:hover { transform:translateY(-2px); box-shadow:0 14px 36px -8px rgba(57,217,180,.6); }
  .ag-fab .ag-fab-dot { width:8px; height:8px; border-radius:50%; background:#001512; }
  .ag-float { position:fixed; right:22px; bottom:22px; z-index:9993; width:440px; max-width:calc(100vw - 28px); height:660px; max-height:calc(100vh - 44px);
    animation:agIn .26s cubic-bezier(.22,1,.36,1); }
  .ag-float .ag-panel { height:100%; }
  @keyframes agIn { from { opacity:0; transform:translateY(14px) scale(.98);} to { opacity:1; transform:none;} }
  @media(max-width:480px){ .ag-float { left:14px; right:14px; bottom:14px; width:auto; } .ag-fab { right:14px; bottom:14px; } }
  @media(prefers-reduced-motion:reduce){ .ag-stat,.ag-float,.ag-harness,.ag-typing span{ animation:none; } }
`;

export default function Agent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).openAgent = () => setOpen(true);
    return () => { delete (window as unknown as Record<string, unknown>).openAgent; };
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      {open ? (
        <div className="ag-float"><Panel onClose={() => setOpen(false)} /></div>
      ) : (
        <button className="ag-fab" onClick={() => setOpen(true)}>
          <span className="ag-fab-dot" /> Ask Om&apos;s AI
        </button>
      )}
    </>
  );
}
