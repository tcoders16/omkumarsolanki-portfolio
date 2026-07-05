"use client";

/**
 * Contact form for the dark final section — same /api/contact wiring as before,
 * restyled in the five-tone monochrome system (Graphite hairlines on Carbon).
 */
import { useState, FormEvent } from "react";

export default function EngContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

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
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      form.reset();
    } catch {
      setError("Something went wrong. Email me directly at hello@omkumarsolanki.com");
    }
    setSending(false);
  };

  return (
    <div className="ecf">
      <style>{`
        .ecf { border:1px solid #26262E; padding:34px; text-align:left; }
        .ecf-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media (max-width: 640px) { .ecf-grid { grid-template-columns:1fr; } }
        .ecf input, .ecf textarea { width:100%; box-sizing:border-box;
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Inter',sans-serif; font-size:15px; color:#FAFAF8;
          background:#0A0A0C; border:1px solid #26262E; border-radius:0; padding:13px 15px;
          outline:none; transition:border-color 0.15s; }
        .ecf input::placeholder, .ecf textarea::placeholder { color:#6E6E78; }
        .ecf input:focus, .ecf textarea:focus { border-color:#6E6E78; }
        .ecf textarea { resize:vertical; min-height:120px; line-height:1.65; margin-top:12px; }
        .ecf .ecf-subject { margin-top:12px; }
        .ecf-err { margin-top:12px; font-size:14px; line-height:1.6; color:#FAFAF8;
          border:1px solid #26262E; padding:12px 14px; }
        .ecf-btn { width:100%; margin-top:16px; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Inter',sans-serif;
          font-size:15px; font-weight:500; color:#0A0A0C; background:#FAFAF8; border:none;
          border-radius:8px; padding:15px 30px; cursor:pointer; transition:background 0.15s; }
        .ecf-btn:hover { background:#E9E9E5; }
        .ecf-btn:disabled { opacity:0.5; cursor:default; }
        .ecf-done { text-align:center; padding:36px 0; }
        .ecf-done-t { font-size:19px; font-weight:500; color:#FAFAF8; }
        .ecf-done-s { margin:12px auto 0; font-size:15px; line-height:1.65; color:#6E6E78; max-width:340px; }
        .ecf-again { margin-top:20px; background:none; border:none; padding:0; cursor:pointer;
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Inter',sans-serif; font-size:14px; font-weight:500;
          color:#6E6E78; transition:color 0.15s; }
        .ecf-again:hover { color:#FAFAF8; }
      `}</style>

      {sent ? (
        <div className="ecf-done">
          <div className="ecf-done-t">Message received.</div>
          <p className="ecf-done-s">I&apos;ll get back to you shortly — usually within a day.</p>
          <button className="ecf-again" onClick={() => setSent(false)}>← Send another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="ecf-grid">
            <input name="name" placeholder="Your name" required />
            <input name="email" type="email" placeholder="Your email" required />
          </div>
          <div className="ecf-subject">
            <input name="subject" placeholder="Subject — founding role, consulting, project…" />
          </div>
          <textarea name="message" placeholder="Tell me what you're building and what you need…" rows={5} required />
          {error && <div className="ecf-err">{error}</div>}
          <button className="ecf-btn" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
