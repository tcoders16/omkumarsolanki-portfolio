"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";

type Booking = {
  id: string; date: string; slot: string;
  name: string; email: string; note: string; bookedAt: string;
};

const SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
];

const DAY_L   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTH_L = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };
const CELL_H     = 54;
const TIME_COL_W = 58;

function nextBusinessDays(n = 5): string[] {
  const days: string[] = [];
  const now = new Date();
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  while (days.length < n) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) {
      days.push(
        `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,"0")}-${String(cur.getDate()).padStart(2,"0")}`
      );
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function fmt(s: string) {
  const [y,m,d] = s.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return { day: DAY_L[dt.getDay()], mon: MONTH_L[m-1], d };
}

function isPast(date: string, slot: string) {
  const [h,mi] = slot.split(":").map(Number);
  const [y,mo,d] = date.split("-").map(Number);
  return new Date(y, mo-1, d, h, mi) <= new Date();
}

function slotLabel(slot: string) {
  const [h,m] = slot.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h > 12 ? h-12 : h === 0 ? 12 : h;
  return `${hh}:${String(m).padStart(2,"0")} ${ampm}`;
}

export default function BookPage() {
  const [days,       setDays]       = useState<string[]>([]);
  const [bookings,   setBookings]   = useState<Booking[]>([]);
  const [watchers,   setWatchers]   = useState(1);
  const [live,       setLive]       = useState(false);
  const [selected,   setSelected]   = useState<{ date: string; slot: string } | null>(null);
  const [form,       setForm]       = useState({ name: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState<string | null>(null);
  const [err,        setErr]        = useState<string | null>(null);

  useEffect(() => {
    setDays(nextBusinessDays(5));
    const es = new EventSource("/api/bookings/stream");
    es.onopen    = () => setLive(true);
    es.onerror   = () => setLive(false);
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "init" || msg.type === "booking") setBookings(msg.bookings);
        if (msg.type === "watchers") setWatchers(msg.count);
      } catch {}
    };
    return () => es.close();
  }, []);

  async function submit() {
    if (!selected || !form.name.trim() || !form.email.trim()) return;
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selected, ...form }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      const f = fmt(selected.date);
      setDone(`${f.day} ${f.mon} ${f.d} · ${slotLabel(selected.slot)}`);
      setSelected(null);
      setForm({ name: "", email: "", note: "" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <Nav />

      <div style={{
        minHeight: "100vh", background: "#080808",
        padding: "80px 24px 80px",
        position: "relative", zIndex: 1,
      }}>

        {/* ── Header ── */}
        <div style={{ maxWidth: 880, margin: "0 auto 36px" }}>
          {/* Live badge */}
          <div style={{
            ...MONO, display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 22, fontSize: "0.55rem", color: "#444",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: live ? "#3dba7e" : "#222",
              boxShadow: live ? "0 0 0 0 rgba(61,186,126,0.4)" : "none",
              animation: live ? "livePulse 2s ease-in-out infinite" : "none",
            }} />
            {live
              ? `Live · ${watchers} ${watchers === 1 ? "person" : "people"} watching`
              : "Connecting…"}
          </div>

          <h1 style={{
            ...MONO, margin: "0 0 12px",
            fontSize: "clamp(1.6rem,3vw,2.5rem)",
            fontWeight: 700, color: "#f0f0f0", lineHeight: 1.12,
          }}>
            Book a free 30-min{" "}
            <span style={{ color: "#4a9eff" }}>AI strategy call.</span>
          </h1>
          <p style={{ ...MONO, margin: 0, fontSize: "0.62rem", color: "#444", lineHeight: 1.75 }}>
            Click any open slot to book. One call per day · Eastern Time (ET) · live for everyone.
          </p>

          {done && (
            <div style={{
              ...MONO, marginTop: 22,
              background: "rgba(61,186,126,0.07)",
              border: "1px solid rgba(61,186,126,0.2)",
              borderRadius: 10, padding: "12px 16px",
              fontSize: "0.6rem", color: "#3dba7e",
            }}>
              ✓ Booked: <strong>{done}</strong> - Om will reach out to confirm.
            </div>
          )}
        </div>

        {/* ── Calendar grid ── */}
        <div style={{ maxWidth: 880, margin: "0 auto", overflowX: "auto", WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}>
          <div style={{ minWidth: 520 }}>

            {/* Day headers */}
            <div style={{ display: "flex", paddingLeft: TIME_COL_W, marginBottom: 4 }}>
              {days.map(date => {
                const f = fmt(date);
                return (
                  <div key={date} style={{ flex: 1, textAlign: "center", padding: "0 2px 12px" }}>
                    <div style={{ ...MONO, fontSize: "0.42rem", color: "#282828", letterSpacing: "0.14em", marginBottom: 5, textTransform: "uppercase" }}>
                      {f.day}
                    </div>
                    <div style={{ ...MONO, fontSize: "0.74rem", fontWeight: 700, color: "#bbb" }}>
                      {f.mon} {f.d}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thin top border */}
            <div style={{ display: "flex", paddingLeft: TIME_COL_W, marginBottom: 0 }}>
              {days.map(date => (
                <div key={date} style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)", margin: "0 2px" }} />
              ))}
            </div>

            {/* Slot rows */}
            {SLOTS.map((slot, si) => {
              const isHour = slot.endsWith(":00");
              // Gap row between morning and afternoon
              const isGap = si > 0 && slot === "13:00";

              return (
                <div key={slot}>
                  {isGap && (
                    <div style={{ display: "flex", paddingLeft: TIME_COL_W, height: 16 }}>
                      {days.map(date => (
                        <div key={date} style={{ flex: 1, margin: "0 2px", borderTop: "1px dashed rgba(255,255,255,0.04)" }} />
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", height: CELL_H, alignItems: "stretch" }}>
                    {/* Time label */}
                    <div style={{
                      width: TIME_COL_W, flexShrink: 0,
                      display: "flex", alignItems: "flex-start",
                      justifyContent: "flex-end",
                      paddingRight: 14, paddingTop: 6,
                      ...MONO, fontSize: "0.46rem",
                      color: isHour ? "#2c2c2c" : "transparent",
                      letterSpacing: "0.04em",
                      userSelect: "none",
                    }}>
                      {slotLabel(slot)}
                    </div>

                    {/* Day cells */}
                    {days.map(date => {
                      const past       = isPast(date, slot);
                      const dayBooking = bookings.find(b => b.date === date);
                      const slotBook   = bookings.find(b => b.date === date && b.slot === slot);
                      const dayTaken   = !!dayBooking;
                      const isSel      = selected?.date === date && selected?.slot === slot;
                      const canClick   = !past && !dayTaken;

                      return (
                        <div
                          key={date}
                          onClick={() => canClick && setSelected({ date, slot })}
                          style={{
                            flex: 1,
                            margin: "1px 2px",
                            borderRadius: 7,
                            cursor: canClick ? "pointer" : "default",
                            position: "relative",
                            background: isSel
                              ? "rgba(74,158,255,0.16)"
                              : slotBook
                              ? "rgba(61,186,126,0.1)"
                              : canClick
                              ? "rgba(255,255,255,0.018)"
                              : "transparent",
                            border: `1px solid ${
                              isSel
                                ? "rgba(74,158,255,0.35)"
                                : slotBook
                                ? "rgba(61,186,126,0.22)"
                                : canClick
                                ? "rgba(255,255,255,0.04)"
                                : "transparent"
                            }`,
                            transition: "background 0.1s, border 0.1s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={e => {
                            if (canClick && !isSel) {
                              e.currentTarget.style.background = "rgba(74,158,255,0.08)";
                              e.currentTarget.style.borderColor = "rgba(74,158,255,0.18)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (canClick && !isSel) {
                              e.currentTarget.style.background = "rgba(255,255,255,0.018)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                            }
                          }}
                        >
                          {slotBook ? (
                            <span style={{ ...MONO, fontSize: "0.42rem", color: "#3dba7e", fontWeight: 600, letterSpacing: "0.06em" }}>
                              booked
                            </span>
                          ) : isSel ? (
                            <span style={{ ...MONO, fontSize: "0.46rem", color: "#4a9eff", fontWeight: 700 }}>
                              {slotLabel(slot)}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row divider */}
                  {isHour && si < SLOTS.length - 1 && (
                    <div style={{ display: "flex", paddingLeft: TIME_COL_W }}>
                      {days.map(date => (
                        <div key={date} style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.035)", margin: "0 2px" }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          ...MONO, maxWidth: 880, margin: "18px auto 0",
          fontSize: "0.43rem", color: "#1e1e1e", letterSpacing: "0.06em",
        }}>
          ↻ live · Eastern Time (ET) · 30 min · free
        </div>
      </div>

      {/* ── Booking modal ── */}
      {selected && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setSelected(null); setErr(null); } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{
            background: "#0e0e0e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "28px 28px 22px",
            width: "100%", maxWidth: 420,
            animation: "modalIn 0.22s cubic-bezier(0.34,1.2,0.64,1)",
          }}>
            <div style={{ ...MONO, fontSize: "0.46rem", color: "#2e2e2e", letterSpacing: "0.14em", marginBottom: 8 }}>
              BOOK A SLOT
            </div>
            <div style={{ ...MONO, fontSize: "0.9rem", color: "#f0f0f0", fontWeight: 700, marginBottom: 4 }}>
              {(() => { const f = fmt(selected.date); return `${f.day} · ${f.mon} ${f.d}`; })()}
            </div>
            <div style={{ ...MONO, fontSize: "0.62rem", color: "#4a9eff", marginBottom: 28 }}>
              {slotLabel(selected.slot)} ET · 30 min · free
            </div>

            {([
              { label: "Your name *",   key: "name",  type: "text",  ph: "Jane Smith" },
              { label: "Work email *",  key: "email", type: "email", ph: "jane@company.com" },
              { label: "What are we discussing? (optional)", key: "note", type: "text", ph: "e.g. automate our onboarding flow" },
            ] as const).map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ ...MONO, fontSize: "0.46rem", color: "#3a3a3a", letterSpacing: "0.08em", display: "block", marginBottom: 7 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.ph}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7, padding: "10px 12px",
                    ...MONO, fontSize: "0.6rem", color: "#e0e0e0", outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(74,158,255,0.45)"}
                  onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            ))}

            {err && (
              <div style={{ ...MONO, fontSize: "0.55rem", color: "#ff6666", marginBottom: 14 }}>
                {err}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => { setSelected(null); setErr(null); }}
                style={{
                  flex: 1, padding: "11px",
                  ...MONO, fontSize: "0.58rem", color: "#444",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={submitting || !form.name.trim() || !form.email.trim()}
                style={{
                  flex: 2, padding: "11px",
                  ...MONO, fontSize: "0.6rem", fontWeight: 700, color: "#fff",
                  background: (submitting || !form.name.trim() || !form.email.trim())
                    ? "rgba(74,158,255,0.18)" : "#4a9eff",
                  border: "none", borderRadius: 8,
                  cursor: (submitting || !form.name.trim() || !form.email.trim()) ? "default" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {submitting ? "Booking…" : "Confirm Booking →"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(61,186,126,0.4);}
          50%{opacity:.6;box-shadow:0 0 0 5px rgba(61,186,126,0);}
        }
        @keyframes modalIn {
          from{opacity:0;transform:scale(.94) translateY(8px);}
          to{opacity:1;transform:scale(1) translateY(0);}
        }
        input::placeholder{color:#252525;}
        *::-webkit-scrollbar{display:none;}
      `}</style>
    </>
  );
}
