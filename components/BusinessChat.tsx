"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

type Msg = { role: "user" | "assistant"; text: string; showBooking?: boolean };

const CLIENT_LIMIT = 7;
const CAL_URL = "https://cal.com/om-solanki/consultation";

const OPENER: Msg = {
  role: "assistant",
  text: "Hi — I'm Om's AI business advisor.\n\nWhat does your business do, and what's the most time-consuming manual task your team deals with right now?",
};

export default function BusinessChat() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Msg[]>([OPENER]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [count,   setCount]   = useState(0);
  const [hasNew,  setHasNew]  = useState(true);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 80); setHasNew(false); }
  }, [open]);

  // Global opener — nav "Ask AI" button calls this
  useEffect(() => {
    (window as unknown as Record<string, unknown>).openBusinessChat = () => setOpen(true);
    return () => { delete (window as unknown as Record<string, unknown>).openBusinessChat; };
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading || count >= CLIENT_LIMIT) return;
    setInput("");
    setCount(c => c + 1);
    const userMsg: Msg = { role: "user", text };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);

    try {
      const history = next.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const res = await fetch("/api/business-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1),
        }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, {
        role: "assistant",
        text: data.error ? `Sorry — ${data.error}` : data.text,
        showBooking: !!data.showBooking,
      }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Network error — try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const remaining = CLIENT_LIMIT - count;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="AI Business Advisor"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%",
          background: open ? "#1a1a1a" : "#4a9eff",
          border: `1px solid ${open ? "rgba(255,255,255,0.12)" : "#4a9eff"}`,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "#6ab3ff"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = open ? "#1a1a1a" : "#4a9eff"; }}
      >
        {open ? (
          /* Close X */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          /* AI Bot face icon */
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            {/* Head */}
            <rect x="4" y="7" width="18" height="14" rx="4" stroke="white" strokeWidth="1.7"/>
            {/* Antenna */}
            <line x1="13" y1="2" x2="13" y2="7" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
            <circle cx="13" cy="2" r="1.4" fill="white"/>
            {/* Eyes */}
            <circle cx="9.5" cy="13.5" r="1.8" fill="white"/>
            <circle cx="16.5" cy="13.5" r="1.8" fill="white"/>
            {/* Eye shine */}
            <circle cx="10.1" cy="12.9" r="0.55" fill="#4a9eff"/>
            <circle cx="17.1" cy="12.9" r="0.55" fill="#4a9eff"/>
            {/* Mouth */}
            <path d="M9.5 17.5 Q13 19.5 16.5 17.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          </svg>
        )}
        {!open && hasNew && (
          <div style={{
            position: "absolute", top: 3, right: 3,
            width: 10, height: 10, borderRadius: "50%",
            background: "#ff4444", border: "2px solid #000",
          }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel" style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9998,
          width: 370, maxHeight: 560,
          background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14, boxShadow: "0 16px 64px rgba(0,0,0,0.8)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "chatSlideUp 0.2s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,#4a9eff22,#3dba7e22)",
              border: "1px solid #4a9eff55",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              color: "#4a9eff", fontWeight: 700, flexShrink: 0,
            }}>OS</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.63rem",
                color: "#f0f0f0", fontWeight: 600 }}>AI Business Advisor</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.49rem",
                color: "#3dba7e", letterSpacing: "0.06em" }}>● Om Kumar Solanki · AI Consultant</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem",
              color: "#444", letterSpacing: "0.06em" }}>
              {remaining} left
            </div>
          </div>

          {/* Messages */}
          <div ref={bodyRef} style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 10,
            scrollbarWidth: "none",
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "84%",
                  padding: "9px 13px",
                  borderRadius: m.role === "user"
                    ? "12px 12px 2px 12px"
                    : "12px 12px 12px 2px",
                  background: m.role === "user"
                    ? "rgba(74,158,255,0.13)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${m.role === "user"
                    ? "rgba(74,158,255,0.22)"
                    : "rgba(255,255,255,0.07)"}`,
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: m.role === "user" ? "#9cdcfe" : "#cccccc",
                  lineHeight: 1.65, whiteSpace: "pre-wrap",
                }}>
                  {m.text}
                </div>

                {/* Agentic booking CTA — pops in when AI decides the user is ready */}
                {m.showBooking && (
                  <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: 8, alignSelf: "flex-start",
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "9px 14px",
                      background: "linear-gradient(90deg,#3dba7e,#29a868)",
                      borderRadius: 8,
                      fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                      color: "#fff", fontWeight: 700, letterSpacing: "0.04em",
                      textDecoration: "none",
                      boxShadow: "0 2px 14px rgba(61,186,126,0.4)",
                      cursor: "pointer",
                      animation: "bookingPop 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="16" r="1.5" fill="white"/>
                    </svg>
                    Book Free 30-min Strategy Call →
                  </a>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "9px 16px",
                  borderRadius: "12px 12px 12px 2px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#444",
                  letterSpacing: "0.12em",
                }}>
                  ···
                </div>
              </div>
            )}

            {count >= CLIENT_LIMIT && (
              <div style={{
                textAlign: "center", fontFamily: "var(--font-mono)",
                fontSize: "0.52rem", color: "#555", padding: "8px 0",
              }}>
                Session limit reached —{" "}
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#3dba7e", textDecoration: "none", fontWeight: 600 }}>
                  book a free call directly
                </a>
              </div>
            )}
          </div>

          {/* Quick suggestion chips — shown before user sends anything */}
          {count === 0 && (
            <div style={{
              padding: "6px 12px 2px",
              display: "flex", gap: 6, flexWrap: "wrap",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
              {[
                { label: "/book", action: "link", href: "/book" },
                { label: "/resume", action: "link", href: "/resume" },
                { label: "/more", action: "msg", text: "Tell me more about Om's services and what he can build." },
              ].map(chip => (
                chip.action === "link" ? (
                  <a
                    key={chip.label}
                    href={chip.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                      color: "#4a9eff", textDecoration: "none",
                      padding: "4px 9px", borderRadius: 20,
                      border: "1px solid rgba(74,158,255,0.3)",
                      background: "rgba(74,158,255,0.07)",
                      letterSpacing: "0.04em", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {chip.label}
                  </a>
                ) : (
                  <button
                    key={chip.label}
                    onClick={() => { setInput(chip.text!); setTimeout(() => inputRef.current?.focus(), 30); }}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                      color: "#3dba7e", background: "rgba(61,186,126,0.07)",
                      padding: "4px 9px", borderRadius: 20,
                      border: "1px solid rgba(61,186,126,0.3)",
                      letterSpacing: "0.04em", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {chip.label}
                  </button>
                )
              ))}
            </div>
          )}

          {/* Input */}
          {count < CLIENT_LIMIT && (
            <div style={{
              padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex", gap: 8, alignItems: "flex-end",
              background: "rgba(255,255,255,0.01)",
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Describe your business challenge..."
                rows={1}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                  padding: "8px 10px", resize: "none", outline: "none",
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "#cccccc", lineHeight: 1.5, maxHeight: 80, overflowY: "auto",
                }}
                onInput={e => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 80) + "px";
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                style={{
                  width: 34, height: 34, borderRadius: 6, flexShrink: 0,
                  background: input.trim() && !loading ? "#4a9eff" : "rgba(255,255,255,0.06)",
                  border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: "5px 14px 8px",
            fontFamily: "var(--font-mono)", fontSize: "0.44rem",
            color: "#333", textAlign: "center", letterSpacing: "0.06em",
          }}>
            Powered by Om's AI · Data not stored · Business inquiries only
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bookingPop {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }

        @media (max-width: 480px) {
          .chat-panel {
            bottom: 80px !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 14px 14px 0 0 !important;
            max-height: 72vh !important;
          }
        }
      `}</style>
    </>
  );
}
