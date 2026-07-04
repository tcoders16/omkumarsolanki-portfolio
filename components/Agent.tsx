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
import OmMark from "@/components/OmMark";

/* Monochrome five-tone system, shared with the Polymath + engineering pages. */
const MONO = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";
const SANS = "'Inter','Helvetica Neue',sans-serif";

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
          <span className="ag-av"><OmMark size={22} ink="#0A0A0C" sw={1.3} dot={1.9} /></span>
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
  .ag-panel { display:flex; flex-direction:column; background:#FAFAF8;
    border:1px solid #E9E9E5; border-radius:14px; overflow:hidden;
    font-family:${SANS}; box-shadow:0 24px 70px -24px rgba(10,10,12,.28); }
  .ag-panel *, .ag-panel *::before, .ag-panel *::after { box-sizing:border-box; }
  .ag-hd { display:flex; align-items:center; justify-content:space-between; padding:14px 16px;
    background:#0A0A0C; border-bottom:1px solid #26262E; }
  .ag-hd-l { display:flex; align-items:center; gap:11px; }
  .ag-av { width:32px; height:32px; flex-shrink:0; background:#FAFAF8;
    color:#0A0A0C; display:flex; align-items:center; justify-content:center; font-family:${SANS}; font-weight:500; font-size:15px; }
  .ag-hd-l > span:last-child { display:flex; flex-direction:column; }
  .ag-hd-l b { font-size:14px; color:#FAFAF8; font-weight:500; letter-spacing:-.01em; }
  .ag-hd-l i { font-family:${MONO}; font-size:9.5px; color:#6E6E78; font-style:normal; letter-spacing:.12em;
    text-transform:uppercase; margin-top:3px; display:flex; align-items:center; gap:6px; }
  .ag-stat { width:5px; height:5px; background:#FAFAF8; box-shadow:0 0 0 0 rgba(250,250,248,.35); animation:agpulse 2s infinite; }
  @keyframes agpulse { 0%,100%{ box-shadow:0 0 0 0 rgba(250,250,248,.35);} 70%{ box-shadow:0 0 0 5px rgba(250,250,248,0);} }
  .ag-x { background:none; border:none; color:#6E6E78; font-size:14px; cursor:pointer; padding:2px 4px; transition:color .15s; }
  .ag-x:hover { color:#FAFAF8; }
  .ag-body { flex:1; overflow-y:auto; padding:18px 16px; display:flex; flex-direction:column; gap:14px; scrollbar-width:thin; }
  .ag-greet { font-size:14.5px; color:#26262E; line-height:1.65; }
  .ag-greet b { color:#0A0A0C; font-weight:500; }
  .ag-cap { font-family:${MONO}; font-size:9.5px; color:#6E6E78; letter-spacing:.1em; text-transform:uppercase; line-height:1.7; }
  .ag-chips { display:flex; flex-direction:column; gap:8px; }
  .ag-chip { text-align:left; font-family:${SANS}; font-size:14px; color:#26262E; background:#FAFAF8;
    border:1px solid #E9E9E5; border-radius:0; padding:12px 14px; cursor:pointer; transition:border-color .15s, color .15s; }
  .ag-chip:hover { border-color:#26262E; color:#0A0A0C; }
  .ag-turn { display:flex; flex-direction:column; }
  .ag-msg { font-size:14.5px; line-height:1.65; padding:11px 14px; }
  .ag-msg.user { align-self:flex-end; max-width:90%; background:#0A0A0C; color:#FAFAF8; white-space:pre-wrap; }
  .ag-asst { display:flex; flex-direction:column; align-items:flex-start; max-width:94%; }
  .ag-msg.assistant { background:#FAFAF8; border:1px solid #E9E9E5; color:#26262E; max-width:100%; }
  .ag-copy { background:none; border:none; color:#6E6E78; font-family:${MONO}; font-size:9.5px; letter-spacing:.08em;
    text-transform:uppercase; cursor:pointer; margin-top:5px; padding:0 2px; transition:color .15s; }
  .ag-copy:hover { color:#0A0A0C; }
  /* markdown */
  .ag-md p { margin:0 0 8px; } .ag-md p:last-child { margin-bottom:0; }
  .ag-md strong { color:#0A0A0C; font-weight:500; }
  .ag-md code { font-family:${MONO}; background:#E9E9E5; padding:1px 5px; font-size:12.5px; color:#0A0A0C; }
  .ag-md ul { margin:6px 0 8px; padding-left:18px; } .ag-md li { margin:3px 0; }
  .ag-md a { color:#0A0A0C; text-decoration:underline; }
  .ag-typing { display:flex; gap:4px; padding:6px 4px; }
  .ag-typing span { width:6px; height:6px; border-radius:50%; background:#6E6E78; animation:agbounce 1s infinite; }
  .ag-typing span:nth-child(2){ animation-delay:.15s; } .ag-typing span:nth-child(3){ animation-delay:.3s; }
  @keyframes agbounce { 0%,60%,100%{ transform:translateY(0); opacity:.4; } 30%{ transform:translateY(-4px); opacity:1; } }

  /* harness */
  .ag-harness { border:1px solid #E9E9E5; padding:12px 13px; margin-bottom:8px;
    background:#FAFAF8; animation:agpop .3s ease both; }
  @keyframes agpop { from{opacity:0;} to{opacity:1;} }
  .ag-harness-h { font-family:${MONO}; font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#6E6E78; margin-bottom:10px; }
  .ag-pipe { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:11px; }
  .ag-node { font-family:${MONO}; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase;
    padding:4px 9px; border:1px solid #E9E9E5; color:#6E6E78; transition:all .3s; }
  .ag-node.on { border-color:#0A0A0C; color:#FAFAF8; background:#0A0A0C; }
  .ag-trace { display:flex; flex-direction:column; gap:5px; }
  .ag-tl { font-size:13px; color:#26262E; }
  .ag-tl b { font-family:${MONO}; font-size:11px; font-weight:400; letter-spacing:.06em; text-transform:uppercase; color:#6E6E78; }

  /* live running harness loader */
  .ag-run { align-self:flex-start; min-width:240px; }
  .ag-rsteps { display:flex; flex-direction:column; gap:9px; }
  .ag-rstep { display:flex; align-items:center; gap:10px; font-family:${MONO}; font-size:11px; color:#6E6E78; transition:color .25s; }
  .ag-rstep.on { color:#0A0A0C; } .ag-rstep.done { color:#26262E; }
  .ag-ricon { width:13px; display:inline-flex; justify-content:center; flex-shrink:0; }
  .ag-rspin { width:10px; height:10px; border:2px solid #E9E9E5; border-top-color:#0A0A0C; border-radius:50%; animation:agspin .7s linear infinite; }
  @keyframes agspin { to { transform:rotate(360deg); } }
  .ag-rk { color:inherit; letter-spacing:.06em; } .ag-rd { color:#6E6E78; margin-left:auto; font-size:9.5px; letter-spacing:.04em; }
  .ag-rstep.on .ag-rd, .ag-rstep.done .ag-rd { color:#6E6E78; }

  /* offer + quick prompts */
  .ag-offer { margin:0 16px 10px; padding:12px; border:1px solid #E9E9E5;
    background:#FAFAF8; color:#0A0A0C; font-family:${SANS}; font-size:14px; font-weight:500; cursor:pointer; transition:background .15s, border-color .15s; }
  .ag-offer:hover { background:rgba(10,10,12,.03); border-color:#26262E; }
  .ag-quick { display:flex; gap:6px; overflow-x:auto; padding:0 16px 10px; scrollbar-width:none; }
  .ag-quick::-webkit-scrollbar { display:none; }
  .ag-qchip { flex-shrink:0; font-family:${MONO}; font-size:10px; letter-spacing:.06em; color:#6E6E78; background:#FAFAF8;
    border:1px solid #E9E9E5; border-radius:999px; padding:6px 12px; cursor:pointer; white-space:nowrap; transition:border-color .15s, color .15s; }
  .ag-qchip:hover { border-color:#26262E; color:#0A0A0C; }

  /* chat input row */
  .ag-input { display:flex; align-items:flex-end; gap:10px; padding:12px 16px;
    border-top:1px solid #E9E9E5; background:#FAFAF8; }
  .ag-input textarea { flex:1; resize:none; max-height:120px;
    background:#FAFAF8; border:1px solid #E9E9E5; border-radius:0;
    padding:11px 13px; outline:none; font-family:${SANS}; font-size:15px; color:#0A0A0C; line-height:1.45; transition:border-color .15s; }
  .ag-input textarea::placeholder { color:#6E6E78; }
  .ag-input textarea:focus { border-color:#26262E; }
  .ag-send { flex-shrink:0; width:42px; height:42px; border:none; border-radius:8px; background:#0A0A0C;
    color:#FAFAF8; font-size:16px; cursor:pointer; display:flex; align-items:center;
    justify-content:center; transition:background .15s; }
  .ag-send:hover { background:#26262E; }
  .ag-send:disabled { opacity:.35; cursor:default; background:#0A0A0C; }

  /* form */
  .ag-back { align-self:flex-start; background:none; border:none; color:#6E6E78; font-family:${SANS};
    font-size:14px; font-weight:500; cursor:pointer; padding:0; transition:color .15s; }
  .ag-back:hover { color:#0A0A0C; }
  .ag-body > * { flex-shrink:0; }
  .ag-l { display:block; font-family:${MONO}; font-size:10px; color:#6E6E78; letter-spacing:.12em;
    text-transform:uppercase; margin:0 0 8px; }
  .ag-ta, .ag-in { width:100%; background:#FAFAF8; border:1px solid #E9E9E5; border-radius:0;
    padding:11px 13px; outline:none; font-family:${SANS}; font-size:15px; color:#0A0A0C; transition:border-color .15s; }
  .ag-ta::placeholder, .ag-in::placeholder { color:#6E6E78; }
  .ag-ta { min-height:72px; resize:vertical; line-height:1.55; }
  .ag-ta:focus, .ag-in:focus { border-color:#26262E; }
  .ag-fw-l { font-family:${MONO}; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#6E6E78; margin:6px 0 2px; }
  .ag-fw { display:flex; flex-direction:column; gap:12px; }
  .ag-fw-row { display:flex; gap:12px; }
  .ag-fw-n { font-family:${MONO}; font-size:11px; color:#6E6E78; padding-top:2px; }
  .ag-fw-row span:last-child { display:flex; flex-direction:column; }
  .ag-fw-row b { font-size:14.5px; color:#0A0A0C; font-weight:500; }
  .ag-fw-row i { font-size:13.5px; color:#6E6E78; font-style:normal; margin-top:3px; line-height:1.55; }
  .ag-book-big { display:block; width:100%; text-align:center; margin-top:10px; background:#0A0A0C; color:#FAFAF8;
    font-family:${SANS}; font-weight:500; font-size:15px; padding:14px; border:none; border-radius:8px; text-decoration:none; cursor:pointer; transition:background .15s; }
  .ag-book-big:hover { background:#26262E; }
  .ag-book-big:disabled { opacity:.4; cursor:default; background:#0A0A0C; }
  .ag-pick { display:block; text-align:center; margin-top:12px; color:#6E6E78; font-family:${SANS}; font-size:14px; font-weight:500; text-decoration:none; transition:color .15s; }
  .ag-pick:hover { color:#0A0A0C; }
  .ag-err { font-size:13.5px; color:#0A0A0C; border:1px solid #E9E9E5; padding:11px 13px; margin-top:12px; }
  .ag-sent { text-align:center; padding:28px 6px; animation:agpop .3s ease both; }
  .ag-sent-ic { width:44px; height:44px; margin:0 auto 16px; border:1px solid #E9E9E5; background:#FAFAF8;
    color:#0A0A0C; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .ag-sent-t { font-size:18px; color:#0A0A0C; font-weight:500; margin-bottom:10px; }
  .ag-sent-b { font-size:14px; color:#6E6E78; line-height:1.65; margin-bottom:20px; }
  .ag-sent-b b { color:#0A0A0C; font-weight:500; }

  /* floating shell — bottom right */
  .ag-fab { position:fixed; right:22px; bottom:22px; z-index:9992; display:flex; align-items:center; gap:9px;
    font-family:${SANS}; font-size:14px; font-weight:500; color:#FAFAF8; background:#0A0A0C;
    border:none; border-radius:999px; padding:13px 20px; cursor:pointer; box-shadow:0 10px 30px -10px rgba(10,10,12,.4);
    transition:transform .18s, background .18s; }
  .ag-fab:hover { transform:translateY(-2px); background:#26262E; }
  .ag-fab .ag-fab-dot { width:6px; height:6px; border-radius:50%; background:#FAFAF8; }
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
          <OmMark size={17} ink="#FAFAF8" sw={1.2} dot={1.7} /> Ask Om&apos;s AI
        </button>
      )}
    </>
  );
}
