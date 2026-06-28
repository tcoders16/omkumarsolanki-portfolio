"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Checkout = AI intake + smooth appointment booking.
 *  1. The agent captures the visitor's requirements/problem (persisted as a lead
 *     for Om via /api/consult).
 *  2. They pick a day + slot.
 *  3. Booking posts to /api/bookings → persists + sends the Gmail emails
 *     (client confirmation + Om notification, with their requirements in the note).
 * "Checkout" means "book the call", not pay-now.
 */
type Msg = { role: "user" | "assistant"; text: string };
type Service = { name: string; label: string };
type Booking = { date: string; slot: string };

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];
const DAY_L = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MON_L = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function nextBusinessDays(n = 5): string[] {
  const days: string[] = [];
  const now = new Date();
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  while (days.length < n) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) {
      days.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
function fmtDay(s: string) { const [y, m, d] = s.split("-").map(Number); const dt = new Date(y, m - 1, d); return `${DAY_L[dt.getDay()]} ${MON_L[m - 1]} ${d}`; }
function isPast(date: string, slot: string) { const [h, mi] = slot.split(":").map(Number); const [y, mo, d] = date.split("-").map(Number); return new Date(y, mo - 1, d, h, mi) <= new Date(); }
function slotLabel(slot: string) { const [h, m] = slot.split(":").map(Number); const ampm = h >= 12 ? "PM" : "AM"; const hh = h > 12 ? h - 12 : h === 0 ? 12 : h; return `${hh}:${String(m).padStart(2, "0")} ${ampm}`; }

export default function CheckoutAgent({ service, onClose }: { service: Service; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: "assistant",
    text: `You're checking out the ${service.name}. Tell me what you're trying to solve — your goal, the problem, and any constraints. I'll take notes for Om, then you pick a time.`,
  }]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);
  const [bookErr, setBookErr] = useState("");
  const started = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const days = nextBusinessDays(5);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, loading]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    fetch("/api/bookings").then(r => r.json()).then(d => Array.isArray(d) && setBookings(d)).catch(() => {});
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const emailOk = EMAIL_RE.test(email);
  const gaveRequirements = msgs.some(m => m.role === "user");
  const requirements = msgs.filter(m => m.role === "user").map(m => m.text).join(" · ");

  // one call per day → a day with any booking is unavailable
  const dayTaken = (d: string) => bookings.some(b => b.date === d);
  const openSlots = (d: string) => SLOTS.filter(s => !isPast(d, s));

  async function send(text: string) {
    const t = text.trim();
    if (loading || !t) return;
    const found = t.match(EMAIL_RE)?.[0];
    if (found) setEmail(found);
    const next = [...msgs, { role: "user" as const, text: t }];
    setMsgs(next); setInput(""); setLoading(true);
    const persist = !started.current; started.current = true;
    try {
      const res = await fetch("/api/consult", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: `[Service selected: ${service.name} — ${service.label}]\n\n${t}`,
          history: next.map(m => ({ role: m.role, content: m.text })),
          contactName: name.trim(),
          contactEmail: (found || email).trim(),
          persist,
        }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "assistant", text: (data.answer || "Got it — noted.").trim() }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Noted. Pick a time below and Om will follow up." }]);
    } finally { setLoading(false); }
  }

  async function book(slot: string) {
    if (!day || booking || !emailOk || !name.trim()) return;
    setBooking(true); setBookErr("");
    try {
      const note = `${service.name} — ${requirements}`.slice(0, 300);
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: day, slot, name: name.trim(), email: email.trim(), note }),
      });
      const data = await res.json();
      if (!res.ok) { setBookErr(data.error || "Couldn't book that slot."); return; }
      setBooked(`${fmtDay(day)} · ${slotLabel(slot)} ET`);
    } catch {
      setBookErr("Network error — try again or use the calendar link.");
    } finally { setBooking(false); }
  }

  const bookHref = `/book?note=${encodeURIComponent(service.name + " — " + requirements.slice(0, 180))}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  const canPick = emailOk && name.trim() && gaveRequirements;

  return (
    <div className="co-back" onClick={onClose}>
      <div className="co" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Checkout — ${service.name}`}>
        <style>{`
          .co-back { position:fixed; inset:0; z-index:9990; background:rgba(11,15,25,.55); backdrop-filter:blur(4px);
            display:flex; align-items:center; justify-content:center; padding:20px; animation:coFade .2s ease both; font-family:'Inter',system-ui,sans-serif; }
          @keyframes coFade { from{opacity:0} to{opacity:1} }
          .co { --ink:#0b0f19; --paper:#f7f8fb; --card:#fff; --line:#d3d7e0; --line-soft:#e3e6ec; --muted:#5b6373; --accent:#2f5bff;
            width:min(560px,100%); max-height:90vh; background:var(--paper); border:1px solid var(--line); border-radius:14px;
            display:flex; flex-direction:column; overflow:hidden; box-shadow:0 40px 90px -40px rgba(11,15,25,.6); animation:coIn .26s cubic-bezier(.22,1,.36,1) both; }
          @keyframes coIn { from{opacity:0; transform:translateY(12px) scale(.98)} to{opacity:1; transform:none} }
          .co-hd { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid var(--line); background:var(--card); }
          .co-hd-l { display:flex; flex-direction:column; gap:3px; }
          .co-eye { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
          .co-svc { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:17px; color:var(--ink); letter-spacing:-.01em; }
          .co-x { background:none; border:none; color:var(--muted); font-size:16px; cursor:pointer; padding:4px 6px; line-height:1; }
          .co-x:hover { color:var(--ink); }
          .co-body { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:12px; }
          .co-msg { font-size:13.5px; line-height:1.6; max-width:88%; padding:10px 13px; border-radius:11px; }
          .co-msg.assistant { background:var(--card); border:1px solid var(--line-soft); color:var(--ink); align-self:flex-start; }
          .co-msg.user { background:var(--accent); color:#fff; align-self:flex-end; }
          .co-typing { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); align-self:flex-start; }
          .co-pick { border-top:1px dashed var(--line); padding-top:12px; }
          .co-pick-h { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:9px; }
          .co-chips { display:flex; flex-wrap:wrap; gap:7px; }
          .co-chip { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--accent); background:rgba(47,91,255,.06);
            border:1px solid rgba(47,91,255,.3); border-radius:7px; padding:7px 11px; cursor:pointer; transition:background .15s; }
          .co-chip:hover { background:rgba(47,91,255,.14); }
          .co-chip.sel { background:var(--accent); color:#fff; }
          .co-chip:disabled { opacity:.3; cursor:default; text-decoration:line-through; }
          .co-confirm { border:1px solid rgba(47,91,255,.4); background:rgba(47,91,255,.05); border-radius:10px; padding:16px; }
          .co-confirm b { color:var(--ink); }
          .co-bookerr { font-family:'JetBrains Mono',monospace; font-size:11px; color:#c0392b; }
          .co-foot { border-top:1px solid var(--line); background:var(--card); padding:12px 16px; display:flex; flex-direction:column; gap:9px; }
          .co-fields { display:flex; gap:8px; }
          .co-in { flex:1; box-sizing:border-box; font-family:'JetBrains Mono',monospace; font-size:12px; padding:9px 11px;
            border:1px solid var(--line); border-radius:8px; outline:none; color:var(--ink); background:var(--paper); }
          .co-in:focus { border-color:var(--accent); }
          .co-row { display:flex; gap:8px; }
          .co-ta { flex:1; box-sizing:border-box; resize:none; font-family:'Inter',sans-serif; font-size:13px; padding:10px 12px;
            border:1px solid var(--line); border-radius:8px; outline:none; color:var(--ink); background:var(--paper); max-height:90px; }
          .co-ta:focus { border-color:var(--accent); }
          .co-send { flex-shrink:0; width:40px; border:none; border-radius:8px; background:var(--ink); color:#fff; font-size:15px; cursor:pointer; }
          .co-send:disabled { opacity:.4; cursor:default; }
          .co-hint { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); text-align:center; }
          .co-link { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); text-align:center; }
          .co-link a { color:var(--accent); }
        `}</style>

        <div className="co-hd">
          <div className="co-hd-l">
            <span className="co-eye">Checkout · books a call</span>
            <span className="co-svc">{service.name}</span>
          </div>
          <button className="co-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="co-body" ref={bodyRef}>
          {msgs.map((m, i) => <div key={i} className={`co-msg ${m.role}`}>{m.text}</div>)}
          {loading && <div className="co-typing">taking notes…</div>}

          {booked ? (
            <div className="co-confirm">
              <div style={{ marginBottom: 6 }}>✓ <b>You&apos;re booked — {booked}.</b></div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                A confirmation is on its way to <b>{email}</b>, and Om has your requirements. See you then.
              </div>
            </div>
          ) : canPick && (
            <div className="co-pick">
              <div className="co-pick-h">{day ? "Pick a time (ET)" : "Pick a day"}</div>
              {!day ? (
                <div className="co-chips">
                  {days.map(d => (
                    <button key={d} className="co-chip" onClick={() => setDay(d)} disabled={dayTaken(d) || openSlots(d).length === 0}>
                      {fmtDay(d)}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="co-chips">
                    {openSlots(day).map(s => (
                      <button key={s} className="co-chip" onClick={() => book(s)} disabled={booking}>{slotLabel(s)}</button>
                    ))}
                  </div>
                  <button className="co-link" style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer" }} onClick={() => setDay(null)}>← pick another day</button>
                </>
              )}
              {bookErr && <div className="co-bookerr" style={{ marginTop: 8 }}>{bookErr}</div>}
            </div>
          )}
        </div>

        {!booked && (
          <div className="co-foot">
            <div className="co-fields">
              <input className="co-in" placeholder="your name *" value={name} onChange={e => setName(e.target.value)} />
              <input className="co-in" placeholder="your email *" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="co-row">
              <textarea className="co-ta" rows={1} placeholder="Describe your requirements / problem…"
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
              <button className="co-send" onClick={() => send(input)} disabled={loading || !input.trim()}>→</button>
            </div>
            {!canPick && <div className="co-hint">Add your name + email and describe your problem to unlock booking.</div>}
            <div className="co-link">Prefer the full calendar? <a href={bookHref}>Open it →</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
