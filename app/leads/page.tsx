"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Trace = { agent: string; label: string };
type Lead = {
  id: string; company: string; industry: string; whatTheyDo: string; problem: string;
  intent: string; domain: string; urgency: string;
  matched: boolean; reference?: string; solution?: string; result?: string;
  answer: string; trace: Trace[]; createdAt: string;
};

const URGENCY_COLOR: Record<string, string> = {
  high: "#f59e0b", medium: "#39d9b4", low: "#5a5a5a",
};

export default function LeadsDashboard() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("om_admin_key");
    if (saved) { setKey(saved); load(saved); }
  }, []);

  async function load(k: string) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/consults?key=${encodeURIComponent(k)}`);
      if (!res.ok) {
        setError(res.status === 401 ? "Invalid admin key." : "Failed to load.");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setLeads(data.consults ?? []);
      setAuthed(true);
      localStorage.setItem("om_admin_key", k);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const mono = "var(--font-mono)";

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
        <div style={{ width: 320, padding: 28, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, background: "#0e0e0e" }}>
          <div style={{ fontFamily: mono, fontSize: "0.7rem", color: "#f0f0f0", marginBottom: 6, letterSpacing: "0.08em" }}>CONSULT LEADS</div>
          <div style={{ fontFamily: mono, fontSize: "0.55rem", color: "#5a5a5a", marginBottom: 18 }}>Admin access required.</div>
          <input
            type="password" value={key} placeholder="admin key"
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load(key)}
            style={{ width: "100%", padding: "9px 11px", borderRadius: 6, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)", color: "#f0f0f0", fontFamily: mono, fontSize: "0.6rem", outline: "none" }}
          />
          {error && <div style={{ fontFamily: mono, fontSize: "0.52rem", color: "#f87171", marginTop: 8 }}>{error}</div>}
          <button onClick={() => load(key)} disabled={loading}
            style={{ width: "100%", marginTop: 12, padding: "9px", borderRadius: 6, border: "none",
              background: "#39d9b4", color: "#001512", fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "..." : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", padding: "40px 24px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontFamily: mono, fontSize: "0.9rem", color: "#f0f0f0", letterSpacing: "0.08em", margin: 0 }}>
            CONSULT LEADS <span style={{ color: "#39d9b4" }}>({leads.length})</span>
          </h1>
          <button onClick={() => load(key)} style={{ fontFamily: mono, fontSize: "0.55rem", color: "#39d9b4",
            background: "transparent", border: "1px solid rgba(57,217,180,0.3)", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>
            ↻ refresh
          </button>
        </div>

        {leads.length === 0 && (
          <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#5a5a5a", padding: 40, textAlign: "center" }}>
            No leads yet. Submissions from the Consult panel show up here.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {leads.map(l => (
            <div key={l.id} style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, background: "#0e0e0e", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === l.id ? null : l.id)}
                style={{ width: "100%", textAlign: "left", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer",
                  display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: mono, fontSize: "0.66rem", color: "#f0f0f0", marginBottom: 4 }}>
                    {l.company || "Anonymous"} {l.industry && <span style={{ color: "#5a5a5a" }}>· {l.industry}</span>}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "0.56rem", color: "#c8c4bc", lineHeight: 1.5,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 560 }}>
                    {l.problem}
                  </div>
                </div>
                <span style={{ fontFamily: mono, fontSize: "0.46rem", padding: "3px 7px", borderRadius: 4,
                  color: l.matched ? "#3dba7e" : "#8b5cf6", border: `1px solid ${l.matched ? "rgba(61,186,126,0.3)" : "rgba(139,92,246,0.3)"}` }}>
                  {l.matched ? "MATCHED CASE" : "TAILORED"}
                </span>
                <span style={{ fontFamily: mono, fontSize: "0.46rem", color: URGENCY_COLOR[l.urgency] || "#5a5a5a", textTransform: "uppercase" }}>
                  {l.domain} · {l.urgency}
                </span>
              </button>

              {open === l.id && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Section label="What they do" mono={mono}>{l.whatTheyDo || "—"}</Section>
                  <Section label="Problem" mono={mono}>{l.problem}</Section>
                  {l.matched && l.reference && <Section label="Matched proof" mono={mono}>{l.reference}</Section>}
                  <Section label="Agent answer" mono={mono}>{l.answer}</Section>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {l.trace.map((t, i) => (
                      <span key={i} style={{ fontFamily: mono, fontSize: "0.46rem", color: "#39d9b4",
                        border: "1px solid rgba(57,217,180,0.2)", borderRadius: 4, padding: "2px 6px" }}>
                        {t.agent}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: mono, fontSize: "0.46rem", color: "#444" }}>
                      {new Date(l.createdAt).toLocaleString()}
                    </span>
                    <Link href={`/leads/${l.id}`} style={{ fontFamily: mono, fontSize: "0.5rem", color: "#39d9b4", textDecoration: "none" }}>
                      open ↗
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children, mono }: { label: string; children: React.ReactNode; mono: string }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontFamily: mono, fontSize: "0.46rem", color: "#5a5a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: "0.58rem", color: "#c8c4bc", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{children}</div>
    </div>
  );
}
