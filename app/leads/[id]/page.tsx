"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Trace = { agent: string; label: string };
type Lead = {
  id: string; company: string; industry: string; whatTheyDo: string; problem: string;
  intent: string; domain: string; urgency: string;
  matched: boolean; reference?: string; solution?: string; result?: string;
  answer: string; trace: Trace[]; createdAt: string;
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const mono = "var(--font-mono)";

  useEffect(() => {
    const k = localStorage.getItem("om_admin_key");
    if (!k) { setError("No admin key. Open /leads first."); return; }
    fetch(`/api/consults?key=${encodeURIComponent(k)}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        const found = (d.consults as Lead[]).find(c => c.id === id);
        if (!found) setError("Lead not found.");
        else setLead(found);
      })
      .catch(() => setError("Failed to load lead."));
  }, [id]);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/leads" style={{ fontFamily: mono, fontSize: "0.55rem", color: "#39d9b4", textDecoration: "none" }}>← all leads</Link>

        {error && <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#f87171", marginTop: 24 }}>{error}</div>}

        {lead && (
          <div style={{ marginTop: 20, border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, background: "#0e0e0e", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <h1 style={{ fontFamily: mono, fontSize: "0.85rem", color: "#f0f0f0", margin: 0 }}>{lead.company || "Anonymous"}</h1>
              <span style={{ fontFamily: mono, fontSize: "0.48rem", color: lead.matched ? "#3dba7e" : "#8b5cf6" }}>
                {lead.matched ? "MATCHED CASE" : "TAILORED APPROACH"}
              </span>
            </div>
            <div style={{ fontFamily: mono, fontSize: "0.52rem", color: "#5a5a5a", marginBottom: 20 }}>
              {lead.industry || "—"} · {lead.domain} · {lead.urgency} urgency · {new Date(lead.createdAt).toLocaleString()}
            </div>

            <Field label="What they do" mono={mono}>{lead.whatTheyDo || "—"}</Field>
            <Field label="Problem" mono={mono}>{lead.problem}</Field>
            {lead.matched && (
              <>
                <Field label="Solution" mono={mono}>{lead.solution || "—"}</Field>
                <Field label="Om's proof (matched)" mono={mono}>{lead.reference || "—"}</Field>
                <Field label="Client outcome" mono={mono}>{lead.result || "—"}</Field>
              </>
            )}
            <Field label="Agent answer" mono={mono}>{lead.answer}</Field>

            <div style={{ marginTop: 16, fontFamily: mono, fontSize: "0.46rem", color: "#5a5a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Agent trace
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {lead.trace.map((t, i) => (
                <div key={i} style={{ fontFamily: mono, fontSize: "0.54rem", color: "#c8c4bc" }}>
                  <span style={{ color: "#39d9b4" }}>{t.agent}</span> · {t.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, mono }: { label: string; children: React.ReactNode; mono: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: mono, fontSize: "0.46rem", color: "#5a5a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#e0ddd6", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{children}</div>
    </div>
  );
}
