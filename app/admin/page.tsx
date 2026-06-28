"use client";

/**
 * Unified admin portal — your daily workspace.
 * One login (ADMIN_KEY) → live visitor analytics, leads, and bookings.
 * Minimal, animated, dark. Auto-refreshes every 20s.
 */
import { useCallback, useEffect, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Series = { day: string; views: number; sessions: number };
type Tally = { key: string; count: number };
type Session = {
  sid: string; device?: string; ref?: string; pages: string[];
  views: number; clicks: number; firstTs: number; lastTs: number; live: boolean;
};
type Summary = {
  totals: { views: number; sessions: number; clicks: number };
  today: { views: number; sessions: number };
  liveCount: number;
  series: Series[];
  topPages: Tally[]; topClicks: Tally[]; topReferrers: Tally[]; devices: Tally[];
  sessions: Session[];
  generatedAt: number;
};
type Lead = {
  id: string; company: string; industry: string; problem: string;
  domain: string; urgency: string; matched: boolean; answer: string; createdAt: string;
};
type Booking = {
  id: string; date: string; slot: string; name: string; email: string; note: string; bookedAt: string;
};

const C = {
  bg: "#070707", surface: "#0e0e0e", border: "rgba(255,255,255,0.09)",
  borderSoft: "rgba(255,255,255,0.06)", white: "#f0f0f0", cream: "#c8c4bc",
  muted: "#5a5a5a", dim: "#333", accent: "#39d9b4", amber: "#f59e0b", violet: "#8b5cf6",
};
const mono = "var(--font-mono)";

// ── Helpers ──────────────────────────────────────────────────────────────────
function ago(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60); if (m < 60) return `${m}m`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPortal() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "visitors" | "leads" | "bookings">("overview");

  const [summary, setSummary] = useState<Summary | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshedAt, setRefreshedAt] = useState(0);

  const loadAll = useCallback(async (k: string) => {
    const k2 = encodeURIComponent(k);
    const [aRes, cRes, bRes] = await Promise.all([
      fetch(`/api/analytics?key=${k2}`),
      fetch(`/api/consults?key=${k2}`),
      fetch(`/api/bookings`),
    ]);
    if (aRes.status === 401) throw new Error("unauthorized");
    if (aRes.ok) setSummary(await aRes.json());
    if (cRes.ok) setLeads((await cRes.json()).consults ?? []);
    if (bRes.ok) {
      const raw = await bRes.json();
      setBookings(Array.isArray(raw) ? raw : raw.bookings ?? []);
    }
    setRefreshedAt(Date.now());
  }, []);

  const unlock = useCallback(async (k: string) => {
    setLoading(true); setError("");
    try {
      await loadAll(k);
      setAuthed(true);
      localStorage.setItem("om_admin_key", k);
    } catch (e) {
      setError(e instanceof Error && e.message === "unauthorized" ? "Invalid admin key." : "Network error.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, [loadAll]);

  useEffect(() => {
    const saved = localStorage.getItem("om_admin_key");
    if (saved) { setKey(saved); unlock(saved); }
  }, [unlock]);

  // Auto-refresh while authed.
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => { loadAll(key).catch(() => {}); }, 20_000);
    return () => clearInterval(t);
  }, [authed, key, loadAll]);

  if (!authed) {
    return (
      <>
        <Style />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
          <div className="fade-up" style={{ width: 340, padding: 30, border: `1px solid ${C.border}`, borderRadius: 14, background: C.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="dot-live" />
              <div style={{ fontFamily: mono, fontSize: "0.72rem", color: C.white, letterSpacing: "0.1em" }}>OM · CONTROL ROOM</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: "0.55rem", color: C.muted, marginBottom: 20 }}>Sign in to your workspace.</div>
            <input
              type="password" value={key} placeholder="admin key" autoFocus
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && unlock(key)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.border}`, color: C.white, fontFamily: mono, fontSize: "0.62rem", outline: "none" }}
            />
            {error && <div style={{ fontFamily: mono, fontSize: "0.52rem", color: "#f87171", marginTop: 8 }}>{error}</div>}
            <button onClick={() => unlock(key)} disabled={loading}
              style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 8, border: "none",
                background: C.accent, color: "#001512", fontFamily: mono, fontSize: "0.62rem", fontWeight: 700, cursor: "pointer" }}>
              {loading ? "…" : "Unlock"}
            </button>
          </div>
        </div>
      </>
    );
  }

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "visitors", label: `Visitors${summary ? ` · ${summary.liveCount}` : ""}` },
    { id: "leads", label: `Leads · ${leads.length}` },
    { id: "bookings", label: `Calls · ${bookings.length}` },
  ] as const;

  return (
    <>
      <Style />
      <div style={{ minHeight: "100vh", background: C.bg, padding: "28px 20px 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="dot-live" />
              <div>
                <div style={{ fontFamily: mono, fontSize: "0.8rem", color: C.white, letterSpacing: "0.1em" }}>CONTROL ROOM</div>
                <div style={{ fontFamily: mono, fontSize: "0.48rem", color: C.muted, marginTop: 2 }}>
                  {summary?.liveCount ?? 0} online now · synced {refreshedAt ? ago(refreshedAt) : "—"} ago
                </div>
              </div>
            </div>
            <button onClick={() => loadAll(key).catch(() => {})}
              style={{ fontFamily: mono, fontSize: "0.52rem", color: C.accent, background: "transparent",
                border: `1px solid rgba(57,217,180,0.3)`, borderRadius: 7, padding: "6px 13px", cursor: "pointer" }}>
              ↻ refresh
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ fontFamily: mono, fontSize: "0.54rem", padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${tab === t.id ? "rgba(57,217,180,0.4)" : C.border}`,
                  background: tab === t.id ? "rgba(57,217,180,0.08)" : "transparent",
                  color: tab === t.id ? C.accent : C.cream, transition: "all 0.18s" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && <Overview s={summary} leads={leads} bookings={bookings} />}
          {tab === "visitors" && <Visitors s={summary} />}
          {tab === "leads" && <Leads leads={leads} />}
          {tab === "bookings" && <Bookings bookings={bookings} />}
        </div>
      </div>
    </>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────────
function Overview({ s, leads, bookings }: { s: Summary | null; leads: Lead[]; bookings: Booking[] }) {
  if (!s) return <Empty>Loading analytics…</Empty>;
  const cards = [
    { label: "Online now", value: s.liveCount, color: C.accent, pulse: true },
    { label: "Views today", value: s.today.views, color: C.white, sub: `${s.today.sessions} visitors` },
    { label: "Total views", value: s.totals.views, color: C.white, sub: `${s.totals.sessions} sessions` },
    { label: "Leads · Calls", value: `${leads.length} · ${bookings.length}`, color: C.amber },
  ];
  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ padding: 16, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {c.pulse && <span className="dot-live" style={{ width: 6, height: 6 }} />}
              <div style={{ fontFamily: mono, fontSize: "0.46rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{c.label}</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: "1.5rem", color: c.color, marginTop: 8, fontWeight: 600 }}>{c.value}</div>
            {c.sub && <div style={{ fontFamily: mono, fontSize: "0.46rem", color: C.dim, marginTop: 2 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      <Card title="Traffic · last 14 days">
        <Sparkline series={s.series} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 12 }}>
        <Card title="Top pages"><Bars items={s.topPages} color={C.accent} /></Card>
        <Card title="Most clicked"><Bars items={s.topClicks} color={C.violet} /></Card>
        <Card title="Referrers"><Bars items={s.topReferrers.length ? s.topReferrers : [{ key: "direct / none", count: 0 }]} color={C.amber} /></Card>
        <Card title="Devices"><Bars items={s.devices} color={C.cream} /></Card>
      </div>
    </div>
  );
}

// ── Visitors ─────────────────────────────────────────────────────────────────
function Visitors({ s }: { s: Summary | null }) {
  if (!s) return <Empty>Loading…</Empty>;
  if (!s.sessions.length) return <Empty>No visitors tracked yet. Open the site in another browser to test.</Empty>;
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {s.sessions.map(v => (
        <div key={v.sid} style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span className={v.live ? "dot-live" : ""} style={{ width: 7, height: 7, borderRadius: "50%", background: v.live ? undefined : C.dim }} />
            <span style={{ fontFamily: mono, fontSize: "0.56rem", color: v.live ? C.accent : C.cream }}>
              {v.live ? "live" : `${ago(v.lastTs)} ago`}
            </span>
            <span style={{ fontFamily: mono, fontSize: "0.48rem", color: C.muted }}>{v.device ?? "—"}</span>
            {v.ref && <span style={{ fontFamily: mono, fontSize: "0.48rem", color: C.amber }}>← {v.ref}</span>}
            <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: "0.48rem", color: C.muted }}>
              {v.views} views · {v.clicks} clicks
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {v.pages.map((p, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: C.dim, fontFamily: mono, fontSize: "0.5rem" }}>→</span>}
                <span style={{ fontFamily: mono, fontSize: "0.5rem", color: C.cream,
                  border: `1px solid ${C.borderSoft}`, borderRadius: 5, padding: "2px 7px" }}>{p}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Leads ────────────────────────────────────────────────────────────────────
function Leads({ leads }: { leads: Lead[] }) {
  if (!leads.length) return <Empty>No leads yet. Consult-panel submissions land here.</Empty>;
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {leads.map(l => (
        <div key={l.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, padding: "13px 15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
            <div style={{ fontFamily: mono, fontSize: "0.62rem", color: C.white }}>
              {l.company || "Anonymous"} {l.industry && <span style={{ color: C.muted }}>· {l.industry}</span>}
            </div>
            <span style={{ fontFamily: mono, fontSize: "0.44rem", color: l.matched ? C.accent : C.violet,
              border: `1px solid ${l.matched ? "rgba(57,217,180,0.3)" : "rgba(139,92,246,0.3)"}`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
              {l.matched ? "MATCHED" : "TAILORED"}
            </span>
          </div>
          <div style={{ fontFamily: mono, fontSize: "0.54rem", color: C.cream, lineHeight: 1.55 }}>{l.problem}</div>
          <div style={{ fontFamily: mono, fontSize: "0.44rem", color: C.dim, marginTop: 7 }}>
            {l.domain} · {l.urgency} · {new Date(l.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bookings ─────────────────────────────────────────────────────────────────
function Bookings({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length) return <Empty>No calls booked yet.</Empty>;
  const sorted = [...bookings].sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sorted.map(b => (
        <div key={b.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, padding: "13px 15px",
          display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ textAlign: "center", minWidth: 70 }}>
            <div style={{ fontFamily: mono, fontSize: "0.6rem", color: C.accent }}>{b.date}</div>
            <div style={{ fontFamily: mono, fontSize: "0.5rem", color: C.muted }}>{b.slot} ET</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: "0.6rem", color: C.white }}>{b.name}</div>
            <a href={`mailto:${b.email}`} style={{ fontFamily: mono, fontSize: "0.5rem", color: "#4a9eff", textDecoration: "none" }}>{b.email}</a>
            {b.note && <div style={{ fontFamily: mono, fontSize: "0.5rem", color: C.cream, marginTop: 4 }}>{b.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Primitives ───────────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface }}>
      <div style={{ fontFamily: mono, fontSize: "0.46rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="fade-up" style={{ fontFamily: mono, fontSize: "0.58rem", color: C.muted, padding: 48, textAlign: "center" }}>{children}</div>;
}

function Bars({ items, color }: { items: Tally[]; color: string }) {
  if (!items.length) return <div style={{ fontFamily: mono, fontSize: "0.5rem", color: C.dim }}>No data yet.</div>;
  const max = Math.max(...items.map(i => i.count), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: mono, fontSize: "0.5rem", color: C.cream, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{it.key}</span>
            <span style={{ fontFamily: mono, fontSize: "0.5rem", color: C.muted }}>{it.count}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div className="bar-grow" style={{ height: "100%", width: `${(it.count / max) * 100}%`, background: color, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ series }: { series: Series[] }) {
  const w = 100, h = 34;
  const max = Math.max(...series.map(s => s.views), 1);
  const step = series.length > 1 ? w / (series.length - 1) : w;
  const pts = series.map((s, i) => [i * step, h - (s.views / max) * (h - 4) - 2]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const todayViews = series[series.length - 1]?.views ?? 0;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 90, display: "block" }}>
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark)" />
        <path className="spark-line" d={line} fill="none" stroke={C.accent} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.6" fill={C.accent} />}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontFamily: mono, fontSize: "0.44rem", color: C.dim }}>{series[0]?.day.slice(5)}</span>
        <span style={{ fontFamily: mono, fontSize: "0.44rem", color: C.accent }}>today: {todayViews}</span>
        <span style={{ fontFamily: mono, fontSize: "0.44rem", color: C.dim }}>{series[series.length - 1]?.day.slice(5)}</span>
      </div>
    </div>
  );
}

function Style() {
  return (
    <style>{`
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .fade-up { animation: fadeUp 0.4s cubic-bezier(0.2,0.8,0.2,1) both; }
      @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(57,217,180,0.5); } 70% { box-shadow: 0 0 0 6px rgba(57,217,180,0); } }
      .dot-live { display:inline-block; width:8px; height:8px; border-radius:50%; background:#39d9b4; animation: pulse 1.8s infinite; }
      @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .bar-grow { transform-origin: left; animation: grow 0.6s cubic-bezier(0.2,0.8,0.2,1) both; }
      @keyframes draw { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
      .spark-line { stroke-dasharray: 300; animation: draw 1.1s ease-out both; }
    `}</style>
  );
}
