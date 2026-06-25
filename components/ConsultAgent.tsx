"use client";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  The consulting agent slide-over.                                   */
/*  Views (with back/forth navigation):                               */
/*    form   - multi-step intake (company/industry -> what -> problem) */
/*    run    - live agent trace + matched-case/approach + follow-up    */
/*    roster - the multi-agent system: agents & their skills          */
/* ------------------------------------------------------------------ */

const ACCENT = "#39d9b4";
const MONO = "var(--font-mono)";

type Trace = { agent: string; label: string };
type MatchedCase = {
  matched: boolean; problem?: string; solution?: string; reference?: string; result?: string; score?: number;
};
type ConsultResult = {
  answer: string;
  classification?: { domain?: string; urgency?: string; intent?: string };
  matched_case: MatchedCase;
  trace: Trace[];
  show_booking?: boolean;
  booking_url?: string;
  leadId?: string;
};
type ChatMsg = { role: "user" | "assistant"; text: string };

const AGENTS = [
  { id: "router", name: "Router / Supervisor", role: "Classifies the request and routes it.", skills: ["classify_intent", "detect_domain"] },
  { id: "case_match", name: "Case-Match Agent", role: "Searches Om's prior client work for a proven, matching case.", skills: ["retrieve_cases", "score_match"] },
  { id: "architect", name: "Solution-Architect Agent", role: "Designs how Om would solve it when no prior case fits.", skills: ["retrieve_skills", "compose_approach"] },
  { id: "consultant", name: "Consultant Agent", role: "Synthesises the answer, ties it to ROI, proposes next step.", skills: ["estimate_value", "draft_cta"] },
  { id: "profile_qa", name: "Profile-QA Agent", role: "Answers general questions about Om.", skills: ["retrieve_profile"] },
];

const STEPS = [
  { key: "about", title: "Your company" },
  { key: "context", title: "What you do" },
  { key: "problem", title: "The problem" },
];

export default function ConsultAgent() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"form" | "run" | "roster">("form");
  const prevView = useRef<"form" | "run">("form");

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ company: "", industry: "", whatTheyDo: "", problem: "" });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ConsultResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [error, setError] = useState("");

  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Global opener — Nav "Consult" button calls this.
  useEffect(() => {
    (window as unknown as Record<string, unknown>).openConsultAgent = () => setOpen(true);
    return () => { delete (window as unknown as Record<string, unknown>).openConsultAgent; };
  }, []);

  // Tell the floating Business Advisor to step aside while this panel is open
  // so the two AI entry points don't overlap in the bottom-right corner.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("consult:toggle", { detail: { open } }));
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chat, revealed, result]);

  // Staged reveal of the real agent trace once the result lands.
  useEffect(() => {
    if (!result) return;
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= result.trace.length) clearInterval(id);
    }, 520);
    return () => clearInterval(id);
  }, [result]);

  function reset() {
    setView("form"); setStep(0); setForm({ company: "", industry: "", whatTheyDo: "", problem: "" });
    setResult(null); setRevealed(0); setChat([]); setError("");
  }

  async function submit() {
    if (!form.problem.trim() || submitting) return;
    setSubmitting(true); setError(""); setResult(null); setChat([]);
    prevView.current = "run";
    setView("run");
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, persist: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data as ConsultResult);
    } catch {
      setError("Network error — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendFollowUp() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    const next = [...chat, { role: "user" as const, text }];
    setChat(next);
    setChatLoading(true);
    try {
      const history = [
        { role: "assistant", content: result?.answer || "" },
        ...next.map(m => ({ role: m.role, content: m.text })),
      ];
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, problem: form.problem, history, persist: false }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "assistant", text: data.error ? `Sorry — ${data.error}` : data.answer }]);
    } catch {
      setChat(prev => [...prev, { role: "assistant", text: "Network error — try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  const canNext = step === 0 ? true : step === 1 ? true : form.problem.trim().length > 0;

  return (
    <>
      {open && (
        <>
          {/* Scrim */}
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 9990, background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)", animation: "caFade 0.2s ease",
          }} />
          {/* Slide-over panel */}
          <div className="consult-panel" style={{
            position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9991,
            width: 440, maxWidth: "100vw", background: "#0b0b0b",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "-16px 0 64px rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column",
            animation: "caSlideIn 0.26s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Header */}
            <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", gap: 10 }}>
              {/* Back button (contextual) */}
              {(view === "run" || view === "roster") && (
                <button onClick={() => setView(view === "roster" ? prevView.current : "form")}
                  aria-label="Back" style={iconBtn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 1L3 7l6 6" stroke="#c8c4bc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: MONO, fontSize: "0.7rem", color: "#f0f0f0", fontWeight: 600, letterSpacing: "0.04em" }}>
                  AI Consulting Agent
                </div>
                <div style={{ fontFamily: MONO, fontSize: "0.49rem", color: ACCENT, letterSpacing: "0.06em" }}>
                  ● Multi-agent · NeMo-guarded · grounded in Om's work
                </div>
              </div>
              <button onClick={() => setView(view === "roster" ? prevView.current : "roster")}
                style={{ ...pill, color: view === "roster" ? "#001512" : ACCENT, background: view === "roster" ? ACCENT : "transparent" }}>
                agents
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close" style={iconBtn}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" stroke="#c8c4bc" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 18, scrollbarWidth: "none" }}>
              {view === "roster" && <Roster />}

              {view === "form" && (
                <FormView step={step} form={form} setForm={setForm} />
              )}

              {view === "run" && (
                <RunView
                  form={form} submitting={submitting} result={result} revealed={revealed} error={error}
                  chat={chat} chatLoading={chatLoading} onEditBrief={() => setView("form")}
                />
              )}
            </div>

            {/* Footer / actions */}
            {view === "form" && (
              <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, fontFamily: MONO, fontSize: "0.5rem", color: "#5a5a5a" }}>
                  Step {step + 1} of {STEPS.length} · {STEPS[step].title}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} style={ghostBtn}>back</button>
                )}
                {step < STEPS.length - 1 ? (
                  <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext} style={primaryBtn(canNext)}>next →</button>
                ) : (
                  <button onClick={submit} disabled={!form.problem.trim() || submitting} style={primaryBtn(!!form.problem.trim() && !submitting)}>
                    {submitting ? "…" : "Run agents →"}
                  </button>
                )}
              </div>
            )}

            {view === "run" && result && (
              <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex", gap: 8, alignItems: "flex-end" }}>
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFollowUp(); } }}
                  placeholder="Ask a follow-up…" rows={1}
                  style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "8px 10px", resize: "none", outline: "none",
                    fontFamily: MONO, fontSize: "0.6rem", color: "#ccc", maxHeight: 80 }} />
                <button onClick={sendFollowUp} disabled={!chatInput.trim() || chatLoading} style={primaryBtn(!!chatInput.trim() && !chatLoading)}>
                  send
                </button>
              </div>
            )}

            {view === "run" && (error || result) && (
              <button onClick={reset} style={{ ...ghostBtn, margin: "0 18px 12px", textAlign: "center" }}>
                ↺ start a new consultation
              </button>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes caFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes caSlideIn { from { transform: translateX(28px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes caPop { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .consult-panel ::-webkit-scrollbar { display: none }
        @media (max-width: 480px) { .consult-panel { width: 100vw !important; border-left: none !important } }
      `}</style>
    </>
  );
}

/* ----------------------------- views ----------------------------- */

function FormView({ step, form, setForm }: {
  step: number; form: { company: string; industry: string; whatTheyDo: string; problem: string };
  setForm: React.Dispatch<React.SetStateAction<{ company: string; industry: string; whatTheyDo: string; problem: string }>>;
}) {
  return (
    <div style={{ animation: "caPop 0.22s ease" }}>
      <Intro />
      {step === 0 && (
        <>
          <Label>Company name</Label>
          <Input value={form.company} placeholder="Acme Inc." onChange={v => setForm(f => ({ ...f, company: v }))} />
          <Label>Industry</Label>
          <Input value={form.industry} placeholder="e.g. recruiting, legal, manufacturing" onChange={v => setForm(f => ({ ...f, industry: v }))} />
        </>
      )}
      {step === 1 && (
        <>
          <Label>What does your company do?</Label>
          <TextArea value={form.whatTheyDo} placeholder="A sentence or two about your business and how it operates today."
            onChange={v => setForm(f => ({ ...f, whatTheyDo: v }))} />
        </>
      )}
      {step === 2 && (
        <>
          <Label>What problem or slow process do you want to fix?</Label>
          <TextArea value={form.problem} rows={5}
            placeholder="Describe the manual, slow, or costly process. The agents will match it to Om's proven work — or design how he'd solve it."
            onChange={v => setForm(f => ({ ...f, problem: v }))} />
        </>
      )}
    </div>
  );
}

function RunView({ form, submitting, result, revealed, error, chat, chatLoading, onEditBrief }: {
  form: { company: string; problem: string };
  submitting: boolean; result: ConsultResult | null; revealed: number; error: string;
  chat: ChatMsg[]; chatLoading: boolean; onEditBrief: () => void;
}) {
  const pipeline = ["router", "case_match", "architect", "consultant"];
  const activeAgents = result ? result.trace.slice(0, revealed).map(t => t.agent) : [];

  return (
    <div style={{ animation: "caPop 0.22s ease" }}>
      {/* Brief recap */}
      <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.46rem", color: "#5a5a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
          Brief {form.company && `· ${form.company}`}
        </div>
        <div style={{ fontFamily: MONO, fontSize: "0.57rem", color: "#c8c4bc", lineHeight: 1.6 }}>{form.problem}</div>
        <button onClick={onEditBrief} style={{ ...ghostBtn, marginTop: 8, padding: "3px 8px", fontSize: "0.48rem" }}>edit brief</button>
      </div>

      {/* Live pipeline */}
      <div style={{ fontFamily: MONO, fontSize: "0.46rem", color: "#5a5a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        Agent orchestration
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {pipeline.map(a => {
          const done = activeAgents.includes(a);
          const running = submitting && !result;
          return (
            <span key={a} style={{
              fontFamily: MONO, fontSize: "0.5rem", padding: "4px 9px", borderRadius: 20,
              border: `1px solid ${done ? "rgba(57,217,180,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: done ? ACCENT : "#5a5a5a",
              background: done ? "rgba(57,217,180,0.08)" : "transparent",
              opacity: running ? 0.6 : 1, transition: "all 0.3s",
            }}>
              {done ? "✓ " : ""}{a}
            </span>
          );
        })}
      </div>

      {/* Trace lines, revealed step by step */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {result.trace.slice(0, revealed).map((t, i) => (
            <div key={i} style={{ fontFamily: MONO, fontSize: "0.53rem", color: "#c8c4bc", animation: "caPop 0.25s ease" }}>
              <span style={{ color: ACCENT }}>{t.agent}</span> · {t.label}
            </div>
          ))}
        </div>
      )}

      {(submitting && !result) && (
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: "#5a5a5a", letterSpacing: "0.12em" }}>agents working···</div>
      )}

      {error && (
        <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: "#f87171", padding: 12,
          border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8 }}>{error}</div>
      )}

      {/* Result card */}
      {result && revealed >= result.trace.length && (
        <ResultCard result={result} />
      )}

      {/* Follow-up chat */}
      {chat.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "86%",
              padding: "9px 12px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.role === "user" ? "rgba(57,217,180,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${m.role === "user" ? "rgba(57,217,180,0.25)" : "rgba(255,255,255,0.07)"}`,
              fontFamily: MONO, fontSize: "0.58rem", color: m.role === "user" ? "#bdeee2" : "#ccc",
              lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
          ))}
          {chatLoading && <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: "#444", letterSpacing: "0.12em" }}>···</div>}
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: ConsultResult }) {
  const mc = result.matched_case;
  const matched = mc?.matched;
  return (
    <div style={{ animation: "caPop 0.3s ease", borderRadius: 10, overflow: "hidden",
      border: `1px solid ${matched ? "rgba(61,186,126,0.3)" : "rgba(139,92,246,0.3)"}`,
      background: matched ? "rgba(61,186,126,0.05)" : "rgba(139,92,246,0.05)" }}>
      <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.08em",
        color: matched ? "#3dba7e" : "#a98bff" }}>
        {matched ? "◆ MATCHED A PROVEN CASE" : "◆ TAILORED APPROACH (no prior case)"}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#e6e3dc", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {result.answer}
        </div>
        {matched && mc.reference && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.44rem", color: "#5a5a5a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Om&apos;s proof</div>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: "#c8c4bc", lineHeight: 1.6 }}>{mc.reference}</div>
            {mc.result && <div style={{ fontFamily: MONO, fontSize: "0.53rem", color: "#3dba7e", marginTop: 6 }}>→ {mc.result}</div>}
          </div>
        )}
        {result.show_booking && result.booking_url && (
          <a href={result.booking_url} target="_blank" rel="noopener noreferrer" style={{
            marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px",
            background: "linear-gradient(90deg,#3dba7e,#29a868)", borderRadius: 8, textDecoration: "none",
            fontFamily: MONO, fontSize: "0.56rem", color: "#fff", fontWeight: 700,
            boxShadow: "0 2px 14px rgba(61,186,126,0.35)" }}>
            Book a free 30-min strategy call →
          </a>
        )}
      </div>
    </div>
  );
}

function Roster() {
  return (
    <div style={{ animation: "caPop 0.22s ease" }}>
      <div style={{ fontFamily: MONO, fontSize: "0.64rem", color: "#f0f0f0", marginBottom: 4 }}>The multi-agent system</div>
      <div style={{ fontFamily: MONO, fontSize: "0.53rem", color: "#5a5a5a", lineHeight: 1.6, marginBottom: 16 }}>
        Orchestrated with LangGraph, retrieval over Om&apos;s knowledge base (RAG + vectorless),
        and wrapped in NeMo Guardrails.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AGENTS.map(a => (
          <div key={a.id} style={{ padding: 12, borderRadius: 9, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: ACCENT, marginBottom: 3 }}>{a.name}</div>
            <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: "#c8c4bc", lineHeight: 1.55, marginBottom: 8 }}>{a.role}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {a.skills.map(s => (
                <span key={s} style={{ fontFamily: MONO, fontSize: "0.46rem", color: "#8b8b8b",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 6px" }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- primitives --------------------------- */

function Intro() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: "#f0f0f0", lineHeight: 1.6, marginBottom: 6 }}>
        Tell the agents about your business
      </div>
      <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: "#5a5a5a", lineHeight: 1.6 }}>
        They&apos;ll match your problem to a case Om has already solved — or design how he&apos;d solve it.
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: MONO, fontSize: "0.48rem", color: "#8b8b8b", textTransform: "uppercase",
    letterSpacing: "0.1em", margin: "14px 0 6px" }}>{children}</div>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", padding: "9px 11px", borderRadius: 6, background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.12)", color: "#f0f0f0", fontFamily: MONO, fontSize: "0.6rem", outline: "none" }} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} placeholder={placeholder} rows={rows} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", padding: "9px 11px", borderRadius: 6, background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.12)", color: "#f0f0f0", fontFamily: MONO, fontSize: "0.6rem",
      outline: "none", resize: "vertical", lineHeight: 1.6 }} />;
}

const iconBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, flexShrink: 0, background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};
const pill: React.CSSProperties = {
  fontFamily: MONO, fontSize: "0.5rem", padding: "4px 10px", borderRadius: 20,
  border: `1px solid rgba(57,217,180,0.4)`, cursor: "pointer", letterSpacing: "0.04em",
};
const ghostBtn: React.CSSProperties = {
  fontFamily: MONO, fontSize: "0.52rem", color: "#c8c4bc", background: "transparent",
  border: "1px solid rgba(255,255,255,0.14)", borderRadius: 6, padding: "7px 12px", cursor: "pointer",
};
function primaryBtn(active: boolean): React.CSSProperties {
  return {
    fontFamily: MONO, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.03em",
    color: active ? "#001512" : "#5a5a5a", background: active ? ACCENT : "rgba(255,255,255,0.06)",
    border: "none", borderRadius: 6, padding: "8px 14px", cursor: active ? "pointer" : "default",
  };
}
