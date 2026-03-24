"use client";
import { useEffect, useRef, useState, FormEvent } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

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
    <section
      id="contact"
      ref={ref}
      style={{ borderTop: "1px solid var(--border)", paddingTop: "clamp(96px, 13vh, 160px)", paddingBottom: 48 }}
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
            { label: "Location", value: "Ontario, Canada",          href: null },
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
        {sent ? (
          <div className="reveal" style={{
            padding: "40px 32px",
            background: "var(--surface)",
            border: "1px solid var(--accent-ring)",
            borderRadius: 2,
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "1.1rem", color: "var(--white)", marginBottom: 8,
            }}>
              Message received<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <p className="body-sm">I&apos;ll get back to you shortly — usually within a day.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="reveal reveal-d2"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "32px 32px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 2,
            }}
          >
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
              {sending ? "Sending…" : "Send message →"}
            </button>
          </form>
        )}

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
  );
}
