"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

/**
 * /book — books directly onto Om's Google Calendar via the OAuth API
 * (/api/gcal-book). Pick a day → slot → details → an event is created on the
 * calendar and Google emails the invite. Needs the server authorized once at
 * /api/google/connect (mints GOOGLE_OAUTH_REFRESH_TOKEN).
 */
const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];
const DAY_L = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MON_L = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function nextBusinessDays(n = 5): string[] {
  const days: string[] = []; const now = new Date();
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  while (days.length < n) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6)
      days.push(`${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,"0")}-${String(cur.getDate()).padStart(2,"0")}`);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
function fmtDay(s: string) { const [y,m,d] = s.split("-").map(Number); const dt = new Date(y,m-1,d); return `${DAY_L[dt.getDay()]} ${MON_L[m-1]} ${d}`; }
function isPast(date: string, slot: string) { const [h,mi] = slot.split(":").map(Number); const [y,mo,d] = date.split("-").map(Number); return new Date(y,mo-1,d,h,mi) <= new Date(); }
function slotLabel(slot: string) { const [h,m] = slot.split(":").map(Number); const ap = h>=12?"PM":"AM"; const hh = h>12?h-12:h===0?12:h; return `${hh}:${String(m).padStart(2,"0")} ${ap}`; }

export default function BookPage() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ when: string; link: string } | null>(null);
  const [err, setErr] = useState("");
  const days = nextBusinessDays(5);

  useEffect(() => {
    fetch("/api/gcal-book").then(r => r.json()).then(d => setConnected(!!d.connected)).catch(() => setConnected(false));
  }, []);

  async function submit() {
    if (!day || !slot || !form.name.trim() || !form.email.trim() || busy) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/gcal-book", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: day, slot, ...form }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error || "Couldn't book."); if (r.status === 409) setSlot(null); return; }
      setDone({ when: `${fmtDay(day)} · ${slotLabel(slot)} ET`, link: data.eventLink || "" });
    } catch { setErr("Network error — try again."); }
    finally { setBusy(false); }
  }

  const accent = "#4a9eff";
  const chip = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 12, padding: "9px 13px", borderRadius: 8, cursor: "pointer",
    border: `1px solid ${active ? accent : "rgba(255,255,255,0.14)"}`, background: active ? "rgba(74,158,255,0.14)" : "transparent",
    color: active ? "#cfe0ff" : "#c8c4bc",
  });
  const input: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", fontFamily: "var(--font-mono)", fontSize: 13, padding: "11px 13px",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#f0f0f0", outline: "none",
  };

  return (
    <>
      <Nav />
      <main style={{ background: "#000", minHeight: "100vh", color: "#f0f0f0", padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#39d9b4", marginBottom: 14 }}>Book a call</p>
          <h1 style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.05 }}>
            Book a free 30-min <span style={{ color: accent }}>AI strategy call.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#7a7a7a", margin: "0 0 40px" }}>
            Pick any open time — it books straight onto Om&apos;s Google Calendar and you&apos;ll get the invite by email.
          </p>

          {connected === null && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#7a7a7a" }}>Loading availability…</div>}

          {connected === false && (
            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "44px 32px", textAlign: "center", background: "rgba(255,255,255,0.015)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, marginBottom: 10 }}>Scheduling opens here shortly.</div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#7a7a7a", lineHeight: 1.8, margin: "0 0 18px" }}>Email Om to grab a time and he&apos;ll send a Google Calendar invite.</p>
              <a href="mailto:emailtosolankiom@gmail.com" style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#001512", background: "#39d9b4", padding: "11px 20px", borderRadius: 6, textDecoration: "none" }}>Email Om →</a>
            </div>
          )}

          {connected && done && (
            <div style={{ border: `1px solid ${accent}66`, borderRadius: 12, padding: 24, background: "rgba(74,158,255,0.06)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, marginBottom: 8 }}>✓ Booked — {done.when}</div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#c8c4bc", lineHeight: 1.7, margin: "0 0 14px" }}>It&apos;s on Om&apos;s Google Calendar and the invite is on its way to <b>{form.email}</b>.</p>
              {done.link && <a href={done.link} target="_blank" rel="noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: accent }}>View the event →</a>}
            </div>
          )}

          {connected && !done && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5a5a", marginBottom: 10 }}>1 · Pick a day</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {days.map(d => <button key={d} style={chip(day === d)} onClick={() => { setDay(d); setSlot(null); }}>{fmtDay(d)}</button>)}
                </div>
              </div>

              {day && (
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5a5a", marginBottom: 10 }}>2 · Pick a time (ET)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SLOTS.filter(s => !isPast(day, s)).map(s => <button key={s} style={chip(slot === s)} onClick={() => setSlot(s)}>{slotLabel(s)}</button>)}
                  </div>
                </div>
              )}

              {day && slot && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 460 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5a5a" }}>3 · Your details</div>
                  <input style={input} placeholder="your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input style={input} placeholder="your email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  <textarea style={{ ...input, resize: "vertical", minHeight: 60 }} placeholder="what do you want to cover? (optional)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                  {err && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171" }}>{err}</div>}
                  <button onClick={submit} disabled={busy || !form.name.trim() || !form.email.trim()}
                    style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#001512", background: busy ? "#2a6" : "#39d9b4", border: "none", borderRadius: 8, padding: "13px", cursor: busy ? "default" : "pointer", opacity: (!form.name.trim() || !form.email.trim()) ? 0.5 : 1 }}>
                    {busy ? "Booking…" : `Book ${fmtDay(day)} · ${slotLabel(slot)} →`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
