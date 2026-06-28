"use client";
import { useEffect, useRef, useState, FormEvent } from "react";

/* ── Animated success toast ── */
function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(-50%) translateY(-28px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(-50%) translateY(0);     opacity: 1; }
          to   { transform: translateX(-50%) translateY(-28px); opacity: 0; }
        }
        @keyframes tickDraw {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes circleGrow {
          0%   { stroke-dashoffset: 126; opacity: 0.3; }
          60%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes toastGlow {
          0%,100% { box-shadow: 0 0 18px rgba(57,217,180,0.12), 0 8px 32px rgba(0,0,0,0.6); }
          50%     { box-shadow: 0 0 32px rgba(57,217,180,0.22), 0 8px 32px rgba(0,0,0,0.6); }
        }
        .success-toast {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px 14px 16px;
          background: rgba(6,6,6,0.96);
          border: 1px solid rgba(57,217,180,0.28);
          border-radius: 10px;
          backdrop-filter: blur(20px);
          white-space: nowrap;
          animation: toastGlow 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        .success-toast.entering {
          animation: toastSlideIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                     toastGlow 2.4s 0.42s ease-in-out infinite;
        }
        .success-toast.leaving {
          animation: toastSlideOut 0.32s ease-in forwards;
        }
        .toast-icon {
          width: 36px; height: 36px; flex-shrink: 0;
        }
        .toast-circle {
          stroke-dasharray: 126;
          stroke-dashoffset: 126;
          animation: circleGrow 0.55s 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-tick {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: tickDraw 0.3s 0.55s ease-out forwards;
        }
        .toast-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .toast-title {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #39d9b4;
        }
        .toast-sub {
          font-family: var(--font-body);
          font-size: 0.72rem;
          color: rgba(240,240,240,0.45);
        }
      `}</style>

      {visible && (
        <div className="success-toast entering">
          <svg className="toast-icon" viewBox="0 0 36 36" fill="none">
            <circle
              className="toast-circle"
              cx="18" cy="18" r="16"
              stroke="#39d9b4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <polyline
              className="toast-tick"
              points="11,18 16,23 25,13"
              stroke="#39d9b4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="toast-text-wrap">
            <span className="toast-title">Message sent</span>
            <span className="toast-sub">I&apos;ll reply within 24 hours</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [sending, setSending]     = useState(false);
  const [sent,    setSent]        = useState(false);
  const [toast,   setToast]       = useState(false);
  const [error,   setError]       = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting)
          el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Show toast for 4 s then dismiss */
  useEffect(() => {
    if (!sent) return;
    setToast(true);
    const t = setTimeout(() => setToast(false), 4200);
    return () => clearTimeout(t);
  }, [sent]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    data.get("name"),
          email:   data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      form.reset();
    } catch {
      setError("Something went wrong. Email me directly at emailtosolankiom@gmail.com");
    }
    setSending(false);
  };

  return (
    <>
      <SuccessToast visible={toast} />

      <section
        id="contact"
        ref={ref}
        style={{ borderTop: "1px solid var(--border)", paddingTop: "clamp(96px, 13vh, 160px)", paddingBottom: 48, scrollMarginTop: 0 }}
      >
        <div className="container" style={{ maxWidth: 680 }}>

          {/* Section rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }} className="reveal">
            <span className="section-index">07 //</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Heading */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="label-accent" style={{ display: "block", marginBottom: 16 }}>Get in touch</span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
              color: "var(--white)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginBottom: 20,
            }}>
              Let&apos;s build something<span style={{ color: "var(--accent)" }}>.</span>
            </h2>
            <p className="body-lg" style={{ maxWidth: 420, margin: "0 auto" }}>
              Open to founding roles, consulting engagements,
              and ambitious teams that need AI that actually works.
            </p>
          </div>

          {/* Contact anchors */}
          <div className="reveal reveal-d1" style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginBottom: 52,
            flexWrap: "wrap",
          }}>
            {[
              { label: "Email",    value: "emailtosolankiom@gmail.com",             href: "mailto:emailtosolankiom@gmail.com" },
              { label: "LinkedIn", value: "/in/omkumar-solanki",      href: "https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" },
              { label: "Location", value: "Toronto, Canada",          href: null },
            ].map(({ label, value, href }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span className="label">{label}</span>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.88rem",
                      color: "var(--accent)", textDecoration: "none", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {value}
                  </a>
                ) : (
                  <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.88rem", color: "var(--cream)" }}>
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="reveal reveal-d2"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "32px 32px",
              background: "var(--surface)",
              border: `1px solid ${sent ? "rgba(57,217,180,0.25)" : "var(--border)"}`,
              borderRadius: 2,
              transition: "border-color 0.4s ease",
            }}
          >
            {sent ? (
              /* ── Inline success state ── */
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "28px 0",
              }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle
                    cx="26" cy="26" r="23"
                    stroke="#39d9b4" strokeWidth="1.5"
                    strokeDasharray="145"
                    strokeDashoffset="0"
                    style={{ opacity: 0.25 }}
                  />
                  <circle
                    cx="26" cy="26" r="23"
                    stroke="#39d9b4" strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 145,
                      strokeDashoffset: 0,
                      animation: "circleGrow 0.6s ease-out forwards",
                    }}
                  />
                  <polyline
                    points="16,26 22,33 36,19"
                    stroke="#39d9b4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      strokeDasharray: 50,
                      strokeDashoffset: 0,
                      animation: "tickDraw 0.35s 0.5s ease-out forwards",
                    }}
                  />
                </svg>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: "1.05rem", color: "var(--white)",
                }}>
                  Message received<span style={{ color: "var(--accent)" }}>.</span>
                </div>
                <p className="body-sm" style={{ textAlign: "center", maxWidth: 300 }}>
                  I&apos;ll get back to you shortly — usually within a day.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(57,217,180,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#39d9b4")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(57,217,180,0.5)")}
                >
                  Send another →
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="grid-2">
                  <input className="input" name="name"  placeholder="Your name"  required />
                  <input className="input" name="email" type="email" placeholder="Your email" required />
                </div>
                <input className="input" name="subject" placeholder="Subject — founding role, consulting, project..." />
                <textarea
                  className="input"
                  name="message"
                  placeholder="Tell me what you're building and what you need..."
                  rows={5}
                  required
                  style={{ resize: "vertical" }}
                />
                {error && (
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                    color: "#f87171", padding: "10px 14px",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 2,
                  }}>
                    {error}
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={sending}
                  style={{ width: "100%", justifyContent: "center", marginTop: 4, padding: "15px 32px" }}
                >
                  {sending ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 12, height: 12,
                        border: "1.5px solid rgba(57,217,180,0.3)",
                        borderTopColor: "#39d9b4",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Sending…
                    </span>
                  ) : "Send message →"}
                </button>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="reveal reveal-d4" style={{
            textAlign: "center",
            marginTop: 72,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "resso.ai",    href: "https://www.resso.ai" },
                { label: "corol.org",   href: "https://www.corol.org" },
                { label: "nunafab.com", href: "https://www.nunafab.com" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                    color: "var(--dim)", textDecoration: "none",
                    transition: "color 0.2s", letterSpacing: "0.06em",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              color: "var(--dim)", letterSpacing: "0.08em",
            }}>
              Designed &amp; built by Omkumar Solanki · 2026
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
