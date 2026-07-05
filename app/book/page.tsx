"use client";
import { useEffect, useState } from "react";
import OmMark from "@/components/OmMark";
import BrandName from "@/components/BrandName";

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

  return (
    <div className="bk">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .bk { min-height:100vh; background:#0A0A0C; color:#FAFAF8;
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue','Inter',sans-serif;
          font-optical-sizing:auto; -webkit-font-smoothing:antialiased; }
        .bk *, .bk *::before, .bk *::after { box-sizing:border-box; }
        .bk a { text-decoration:none; }
        .bk ::selection { background:#26262E; color:#FAFAF8; }
        .bk-bar { height:64px; border-bottom:1px solid #26262E; display:flex; align-items:center;
          justify-content:space-between; padding:0 32px; }
        .bk-brand { display:flex; align-items:center; gap:11px; font-size:17px;
          font-weight:600; letter-spacing:-0.015em; color:#FAFAF8; }
        .bk-back { font-size:14px; font-weight:500; color:#6E6E78; transition:color 0.15s; }
        .bk-back:hover { color:#FAFAF8; }
        .bk-main { max-width:760px; margin:0 auto; padding:96px 32px 96px; }
        .bk-eyebrow { font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.22em;
          text-transform:uppercase; color:#6E6E78; }
        .bk-h1 { margin:26px 0 0; font-size:46px; font-weight:600; letter-spacing:-0.028em;
          line-height:1.12; color:#FAFAF8; text-wrap:balance; }
        .bk-sub { margin:22px 0 48px; font-size:16px; line-height:1.7; color:#6E6E78; max-width:520px; }
        .bk-load { font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.14em;
          text-transform:uppercase; color:#6E6E78; }
        .bk-panel { border:1px solid #26262E; padding:44px 32px; text-align:center; }
        .bk-panel-t { font-size:18px; font-weight:500; margin-bottom:12px; }
        .bk-panel-p { font-size:15px; color:#6E6E78; line-height:1.7; margin:0 0 22px; }
        .bk-btn { display:inline-block; font-size:15px; font-weight:500; color:#0A0A0C;
          background:#FAFAF8; border:none; border-radius:8px; padding:14px 26px; cursor:pointer;
          transition:background 0.15s; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Inter',sans-serif; }
        .bk-btn:hover { background:#E9E9E5; }
        .bk-btn:disabled { opacity:0.5; cursor:default; }
        .bk-step-l { font-family:'Geist Mono',monospace; font-size:10.5px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; margin-bottom:12px; }
        .bk-chips { display:flex; flex-wrap:wrap; gap:8px; }
        .bk-chip { font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.06em;
          padding:10px 14px; border:1px solid #26262E; background:transparent; color:#FAFAF8;
          cursor:pointer; transition:all 0.15s; border-radius:0; }
        .bk-chip:hover { border-color:#6E6E78; }
        .bk-chip.on { background:#FAFAF8; color:#0A0A0C; border-color:#FAFAF8; }
        .bk-in { width:100%; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Inter',sans-serif; font-size:15px;
          padding:13px 15px; border:1px solid #26262E; border-radius:0; background:#0A0A0C;
          color:#FAFAF8; outline:none; transition:border-color 0.15s; }
        .bk-in::placeholder { color:#6E6E78; }
        .bk-in:focus { border-color:#6E6E78; }
        .bk-err { font-size:14px; color:#FAFAF8; border:1px solid #26262E; padding:11px 14px; }
        .bk-done { border:1px solid #26262E; padding:28px; }
        .bk-done-t { font-size:18px; font-weight:500; margin-bottom:10px; }
        .bk-done-p { font-size:15px; color:#6E6E78; line-height:1.7; margin:0 0 16px; }
        .bk-done-p b { color:#FAFAF8; font-weight:500; }
        .bk-link { font-size:14px; font-weight:500; color:#FAFAF8; opacity:0.9; transition:opacity 0.15s; }
        .bk-link:hover { opacity:0.6; }
        @media (max-width: 600px) { .bk-h1 { font-size:34px; } .bk-main { padding:64px 24px; } }
      `}</style>

      <div className="bk-bar">
        <a href="/" className="bk-brand">
          <OmMark size={26} ink="#FAFAF8" sw={1.4} dot={2.1} animate />
          <BrandName />
        </a>
        <a href="/consulting" className="bk-back">← Back to Polymath</a>
      </div>

      <main className="bk-main">
        <p className="bk-eyebrow">Book a call</p>
        <h1 className="bk-h1">Book a free 30&#8209;minute AI strategy call.</h1>
        <p className="bk-sub">
          Pick any open time — it books straight onto Om&apos;s Google Calendar and
          you&apos;ll get the invite by email.
        </p>

        {connected === null && <div className="bk-load">Loading availability…</div>}

        {connected === false && (
          <div className="bk-panel">
            <div className="bk-panel-t">Scheduling opens here shortly.</div>
            <p className="bk-panel-p">Email Om to grab a time and he&apos;ll send a Google Calendar invite.</p>
            <a href="mailto:hello@omkumarsolanki.com" className="bk-btn">Email Om</a>
          </div>
        )}

        {connected && done && (
          <div className="bk-done">
            <div className="bk-done-t">Booked — {done.when}</div>
            <p className="bk-done-p">
              It&apos;s on Om&apos;s Google Calendar and the invite is on its way to <b>{form.email}</b>.
            </p>
            {done.link && <a href={done.link} target="_blank" rel="noreferrer" className="bk-link">View the event →</a>}
          </div>
        )}

        {connected && !done && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <div className="bk-step-l">1 · Pick a day</div>
              <div className="bk-chips">
                {days.map(d => (
                  <button key={d} className={`bk-chip${day === d ? " on" : ""}`}
                    onClick={() => { setDay(d); setSlot(null); }}>{fmtDay(d)}</button>
                ))}
              </div>
            </div>

            {day && (
              <div>
                <div className="bk-step-l">2 · Pick a time (ET)</div>
                <div className="bk-chips">
                  {SLOTS.filter(s => !isPast(day, s)).map(s => (
                    <button key={s} className={`bk-chip${slot === s ? " on" : ""}`}
                      onClick={() => setSlot(s)}>{slotLabel(s)}</button>
                  ))}
                </div>
              </div>
            )}

            {day && slot && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
                <div className="bk-step-l" style={{ marginBottom: 0 }}>3 · Your details</div>
                <input className="bk-in" placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="bk-in" placeholder="Your email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <textarea className="bk-in" style={{ resize: "vertical", minHeight: 72 }}
                  placeholder="What do you want to cover? (optional)" value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                {err && <div className="bk-err">{err}</div>}
                <button className="bk-btn" onClick={submit}
                  disabled={busy || !form.name.trim() || !form.email.trim()}>
                  {busy ? "Booking…" : `Book ${fmtDay(day)} · ${slotLabel(slot)}`}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
