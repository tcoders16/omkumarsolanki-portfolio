"use client";
import { useState } from "react";
import Nav from "@/components/Nav";

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
const AC = "#39d9b4";
const AM = "#f59e0b";
const VI = "#8b5cf6";
const RD = "#dc2626";
const BL = "#3b82f6";

/* ══════════════════════════════════════════════════════
   POC BRIDGES — the actual technical decisions made
══════════════════════════════════════════════════════ */
const BRIDGES = [
  {
    id: "resso",
    client: "Resso.ai",
    sector: "Edtech · AI Interview Platform",
    accent: AC,
    req: "Client requirement: AI agents must remember everything said earlier in the conversation — or students drop off.",
    diagnosis: "Root cause: Every LLM call was cold. No session layer. Each API call received zero history. The agent was architecturally amnesiac.",
    before: `# BEFORE — cold call every turn
def get_ai_response(user_message: str) -> str:
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_message},  # ← no history
        ]
    )
    return response.choices[0].message.content
# Result: agent asks "what's your name?" on turn 7
# Context retention: 72%  |  Student drop-off: HIGH`,
    after: `# AFTER — stateful sliding window with Redis
def get_ai_response(session_id: str, user_message: str) -> str:
    history    = redis.get(f"session:{session_id}") or []
    compressed = compress_turns(history, max_tokens=3_000)

    messages = [
        {"role": "system", "content": PERSONA_CONFIGS[session_id]},
        *compressed,                    # ← full history, compressed
        {"role": "user", "content": user_message},
    ]
    response = openai.chat.completions.create(
        model="gpt-4", messages=messages
    )
    redis.set(f"session:{session_id}", append(history, response))
    return response.choices[0].message.content
# Context retention: 98%  |  Hallucination: 14% → 3.8%`,
    outcomes: [
      { n: "72% → 98%", l: "Context retention" },
      { n: "14% → 3.8%", l: "Hallucination rate" },
      { n: "1 → 5", l: "Personas (client expanded)" },
      { n: "Renewed", l: "Contract + expanded" },
    ],
  },
  {
    id: "lawline",
    client: "Lawline.tech (Rogers)",
    sector: "Legal AI · Air-gapped · $1M conversation",
    accent: RD,
    req: "Client requirement: AI for legal research — but attorney-client privilege means zero bytes can leave our network. No cloud. No API. No exceptions.",
    diagnosis: "Root cause: Every AI option assumed cloud egress. This is not a technical constraint — it is an architecture choice. Build the entire stack local.",
    before: `# BEFORE — cloud dependency (every existing solution)
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": legal_query}]
)
# Problem: your legal query just left your building.
# Attorney-client privilege: BROKEN.
# Viable for law firms: NO.

# Every SaaS legal AI tool had this same problem.
# The constraint ruled out 100% of existing products.`,
    after: `# AFTER — fully air-gapped local stack
from llama_cpp import Llama
from hnswlib   import Index

# Local GGUF model — runs on 16GB RAM, 0 external calls
llm    = Llama("models/mistral-7b-instruct.Q4_K_M.gguf",
               n_ctx=4096, n_gpu_layers=35)
index  = Index(space="cosine", dim=384)
index.load_index("indexes/canadian_legal_200k.bin")

def query(q: str) -> str:
    emb     = embed_local(q)               # local model, no API
    labels, _ = index.knn_query(emb, k=12)
    chunks  = rerank(q, [docs[i] for i in labels[0]])[:4]
    context = "\\n---\\n".join(chunks)
    return llm(f"[INST]{context}\\n\\nQ: {q}[/INST]")["choices"][0]["text"]
# Network packets during query: 0
# Hallucination rate: <4%  |  Retrieval latency: <1s`,
    outcomes: [
      { n: "0 bytes", l: "Data egress per query" },
      { n: "<4%", l: "Hallucination rate" },
      { n: "<1s", l: "Retrieval over 200K docs" },
      { n: "$1M", l: "Rogers President conversation" },
    ],
  },
  {
    id: "corol",
    client: "Corol / UHPC Research",
    sector: "Materials Engineering · Structural ML",
    accent: AM,
    req: "Client requirement: We need to test hundreds of concrete mix designs but each physical test takes days. We can only run 5-10 per week.",
    diagnosis: "Root cause: Physical tests are the wrong information source. The relationships between mix constituents and strength are learnable. Build a predictor — not a faster test.",
    before: `# BEFORE — physical lab testing (the client's workflow)
# Week 1: mix design → pour → cure 28 days → crush → record
# Week 5: adjust W/C ratio → repeat
# Week 9: adjust silica fume → repeat
# ...
# Throughput: ~5-10 experiments per week
# Time to screen 100 mixes: ~20 weeks
# Cost: materials + lab time + engineer hours

# The bottleneck is NOT slowness — it is the information model.
# Physical tests are the last resort. They should be confirmations.`,
    after: `import xgboost as xgb, shap, pandas as pd

# Features grounded in structural engineering domain
FEATURES = ["w_c_ratio","silica_fume_pct","fibre_kg_m3",
            "curing_days","superplasticiser","fly_ash_pct"]

model = xgb.XGBRegressor(n_estimators=400, max_depth=5,
                          subsample=0.8, colsample_bytree=0.7)
model.fit(X_train, y_train)          # R² = 0.89 on 200-row dataset

# SHAP: show engineers WHY, not just WHAT
explainer = shap.TreeExplainer(model)
shap_vals = explainer.shap_values(X_test)
# Output: φ(w_c_ratio)=+12.4 MPa, φ(silica_fume)=+8.7 MPa ...

# Screener: rank 200 candidate mixes in 0.3 seconds
predictions = model.predict(candidate_mixes_df)
top_10 = candidate_mixes_df.iloc[predictions.argsort()[-10:]]
# Lab tests only needed for top 10. Not 200.`,
    outcomes: [
      { n: "2 sec", l: "Per strength prediction" },
      { n: "Weeks → afternoon", l: "To screen 100 mixes" },
      { n: "R² 0.89", l: "On only 200 training rows" },
      { n: "12", l: "Engineers using daily" },
    ],
  },
  {
    id: "ttc",
    client: "Lost and Found (TTC)",
    sector: "Transit · 1.7M daily riders · Pitch May 2026",
    accent: BL,
    req: "Client requirement: TTC staff spend hours matching lost items to claims by hand. 1.7M riders. Paper logs. Phone calls. Recovery rates are low.",
    diagnosis: "Root cause: Matching is a semantic similarity problem disguised as an admin problem. Descriptions contain all the information needed — they just need a vector space to live in.",
    before: `# BEFORE — current TTC workflow
# Staff process:
# 1. Rider calls in: "I lost a blue Nike bag on Line 1"
# 2. Staff manually read through paper log of found items
# 3. Staff call back if they think something matches
# 4. Rider comes in to check — often wrong item
#
# Problems:
# - No searchability              → staff read every entry by eye
# - No ranking                    → 1 match attempt, then dropped
# - No async notification         → rider must follow up manually
# - No audit trail                → no record of attempts or outcomes
# Scale: hundreds of items daily, 1.7M riders, 2 staff`,
    after: `import pgvector, fastapi, sentence_transformers as st

encoder = st.SentenceTransformer("all-MiniLM-L6-v2")

# On item intake: encode and store
@app.post("/staff/found-item")
def log_item(item: FoundItem):
    embedding = encoder.encode(item.description).tolist()
    db.execute("""
        INSERT INTO found_items (description, location, found_at, embedding)
        VALUES (%s,%s,%s,%s::vector)
    """, [item.description, item.location, item.found_at, embedding])

# On claim: rank all items by cosine similarity
@app.post("/rider/claim")
def submit_claim(claim: Claim):
    q_emb = encoder.encode(claim.description).tolist()
    matches = db.execute("""
        SELECT *, 1-(embedding<=>%s::vector) AS score
        FROM found_items ORDER BY score DESC LIMIT 5
    """, [q_emb]).fetchall()

    for m in matches:
        if m.score > 0.82:      # high confidence → auto-notify
            sms.send(claim.phone, f"We may have your item: {m.description}")
        elif m.score > 0.60:    # low confidence → staff queue
            dashboard.add_review(claim, m)
# Resolution time: days → hours  |  Full audit trail: yes`,
    outcomes: [
      { n: "Hours", l: "Resolution (was: days)" },
      { n: "0.82 threshold", l: "Auto-notify confidence gate" },
      { n: "Full audit", l: "Every decision logged" },
      { n: "May 2026", l: "TTC Director pitch" },
    ],
  },
];

/* ══════════════════════════════════════════════════════
   WHAT BUSINESSES ACTUALLY BUY
══════════════════════════════════════════════════════ */
const VALUE_PROPS = [
  {
    icon: "01",
    color: AC,
    title: "You stop losing customers to AI failures",
    real: "Resso: edtech clients renewed and expanded from 1 to 5 AI personas. The alternative was churn.",
    technical: "Stateful session layer + confidence-gated output routing",
  },
  {
    icon: "02",
    color: RD,
    title: "You unlock markets that cloud AI cannot touch",
    real: "Lawline: law firms cannot use any cloud AI. Air-gapped local LLM opened a $1M enterprise conversation with Rogers.",
    technical: "GGUF quantized LLM + HNSW local vector store — 0 external API calls",
  },
  {
    icon: "03",
    color: AM,
    title: "You make decisions in hours instead of weeks",
    real: "Corol: UHPC researchers were running 5 experiments per week. Now they screen 200 mixes in one afternoon before touching the lab.",
    technical: "XGBoost ensemble + SHAP attribution on 200-row domain dataset",
  },
  {
    icon: "04",
    color: BL,
    title: "You replace manual triage with intelligent routing",
    real: "TTC: staff read paper logs and called riders back manually. Now high-confidence matches trigger automatic SMS. Staff only see items that genuinely need human judgement.",
    technical: "pgvector cosine similarity + sigmoid confidence threshold gate",
  },
];

/* ══════════════════════════════════════════════════════
   POC CARD
══════════════════════════════════════════════════════ */
function PocCard({ b, open, onToggle }: { b: typeof BRIDGES[0]; open: boolean; onToggle: () => void }) {
  return (
    <div style={{
      border: `1px solid ${open ? b.accent + "35" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14,
      overflow: "hidden",
      background: open ? `${b.accent}04` : "rgba(255,255,255,0.01)",
      transition: "all 0.25s ease",
    }}>
      {/* Header */}
      <button onClick={onToggle} style={{
        width: "100%", background: "none", border: "none",
        cursor: "pointer", padding: "22px 26px",
        display: "flex", alignItems: "flex-start", gap: 16, textAlign: "left",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: `${b.accent}15`, border: `1.5px solid ${b.accent}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: b.accent,
        }}>
          {b.client[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.46rem",
            color: b.accent, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3,
          }}>{b.sector}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(0.95rem,1.8vw,1.2rem)", color: "#f0f0f0",
            letterSpacing: "-0.02em", marginBottom: 4,
          }}>{b.client}</div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.56rem",
            color: "#777", lineHeight: 1.55, fontStyle: "italic",
          }}>&ldquo;{b.req.replace("Client requirement: ", "")}&rdquo;</div>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          color: open ? b.accent : "#444", flexShrink: 0, marginTop: 4, transition: "color 0.2s",
        }}>
          {open ? "▲" : "▼ see the code"}
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 26px 28px" }}>
          <div style={{ height: 1, background: `${b.accent}20`, marginBottom: 24 }} />

          {/* Diagnosis */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${b.accent}20`,
            borderLeft: `3px solid ${b.accent}`,
            borderRadius: "0 8px 8px 0",
            padding: "12px 16px", marginBottom: 22,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.44rem",
              color: b.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6,
            }}>Root Cause Diagnosis</div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#bbb", lineHeight: 1.65 }}>
              {b.diagnosis}
            </p>
          </div>

          {/* Code: Before / After */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22,
          }} className="poc-code-grid">
            {/* Before */}
            <div style={{
              background: "#0d0d0d",
              border: "1px solid rgba(244,67,54,0.2)",
              borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{
                padding: "8px 14px",
                background: "rgba(244,67,54,0.06)",
                borderBottom: "1px solid rgba(244,67,54,0.15)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f44336", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.46rem", color: "#f44336", letterSpacing: "0.1em" }}>BEFORE</span>
              </div>
              <pre style={{
                padding: "14px 14px",
                fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                color: "#888", lineHeight: 1.7, overflowX: "auto",
                margin: 0, whiteSpace: "pre",
              }}>{b.before}</pre>
            </div>

            {/* After */}
            <div style={{
              background: "#0a0f0c",
              border: `1px solid ${b.accent}30`,
              borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{
                padding: "8px 14px",
                background: `${b.accent}08`,
                borderBottom: `1px solid ${b.accent}20`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: b.accent, display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.46rem", color: b.accent, letterSpacing: "0.1em" }}>AFTER</span>
              </div>
              <pre style={{
                padding: "14px 14px",
                fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                color: "#c8c4bc", lineHeight: 1.7, overflowX: "auto",
                margin: 0, whiteSpace: "pre",
              }}>{b.after}</pre>
            </div>
          </div>

          {/* Outcomes */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
          }} className="poc-outcomes">
            {b.outcomes.map(o => (
              <div key={o.l} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8, padding: "12px 14px",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "clamp(0.9rem,1.4vw,1.2rem)", color: b.accent,
                  letterSpacing: "-0.03em", marginBottom: 4, lineHeight: 1,
                }}>{o.n}</div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.44rem",
                  color: "#555", letterSpacing: "0.08em", textTransform: "uppercase",
                }}>{o.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function ConsultingPage() {
  const [openBridge, setOpenBridge] = useState<string | null>("resso");

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .cf { animation: fadeUp 0.55s ease forwards; opacity: 0; }
        .cf1 { animation-delay: 0.08s; }
        .cf2 { animation-delay: 0.18s; }
        .cf3 { animation-delay: 0.28s; }
        .cf4 { animation-delay: 0.38s; }
        @media (max-width: 760px) {
          .poc-code-grid  { grid-template-columns: 1fr !important; }
          .poc-outcomes   { grid-template-columns: 1fr 1fr !important; }
          .proof-strip    { grid-template-columns: 1fr 1fr !important; }
          .value-grid     { grid-template-columns: 1fr !important; }
          .hero-ctas      { flex-direction: column !important; }
        }
        @media (max-width: 500px) {
          .proof-strip    { grid-template-columns: 1fr !important; }
          .poc-outcomes   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <Nav />

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "64vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(20px, 5vw, 80px) 72px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        {/* grid bg */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(57,217,180,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,180,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }} />
        {/* teal glow top-left */}
        <div style={{
          position: "absolute", top: -80, left: -80,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(57,217,180,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div className="cf cf1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            color: AC, letterSpacing: "0.18em", textTransform: "uppercase",
            border: "1px solid rgba(57,217,180,0.25)", borderRadius: 3,
            padding: "5px 14px", marginBottom: 28,
            background: "rgba(57,217,180,0.04)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: AC, animation: "pulse 2s ease infinite" }} />
            AI Consulting · I solve real business problems
          </div>

          <h1 className="cf cf2" style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(2.6rem, 7vw, 6rem)",
            letterSpacing: "-0.045em", lineHeight: 0.88,
            color: "#f0f0f0", marginBottom: 28,
          }}>
            I read the business<br />
            problem.{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: AC }}>
              Then I write<br />the code.
            </span>
          </h1>

          <p className="cf cf3" style={{
            fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
            color: "#666", lineHeight: 1.8,
            maxWidth: 560, marginBottom: 36, fontWeight: 300,
          }}>
            Every case study below shows the exact business requirement, the root cause diagnosis,
            the before-and-after code, and the measured outcome.
            No abstractions. No claims without proof.
          </p>

          <div className="cf cf4 hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#bridge" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.08em", padding: "13px 26px", borderRadius: 4,
              background: AC, color: "#000", textDecoration: "none", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              See the code ↓
            </a>
            <a href="/book" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.08em", padding: "13px 24px", borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.12)", color: "#ccc",
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}>
              Book a free call
            </a>
            <a href="/" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.56rem",
              color: "#444", textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#888"}
            onMouseLeave={e => e.currentTarget.style.color = "#444"}>
              ← Back to portfolio
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PROOF NUMBERS
      ══════════════════════════════ */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "28px clamp(20px,5vw,80px)",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
        }} className="proof-strip">
          {[
            { n: "4",    l: "Production systems shipped",  s: "Resso · Lawline · Corol · TTC" },
            { n: "$1M",  l: "Investment conversation",     s: "Rogers President · Lawline.tech" },
            { n: "1.7M", l: "TTC riders impacted",         s: "Director pitch · May 2026" },
            { n: "98%",  l: "Context retention (Resso)",   s: "Was 72% before the fix" },
          ].map((s, i) => (
            <div key={s.n} style={{
              padding: "22px 26px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(1.5rem,2.8vw,2.2rem)", color: AC,
                letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 5,
              }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#ccc", marginBottom: 2 }}>{s.l}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.46rem", color: "#444", letterSpacing: "0.06em" }}>{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          WHAT BUSINESSES ACTUALLY BUY
      ══════════════════════════════ */}
      <section style={{
        padding: "72px clamp(20px,5vw,80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: AC, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Real Business Value</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", letterSpacing: "-0.04em",
            color: "#f0f0f0", marginBottom: 10, lineHeight: 1.1,
          }}>
            What businesses actually get.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#555", lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
            Not features. Not technology. Outcomes that appear on a P&L.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="value-grid">
            {VALUE_PROPS.map(v => (
              <div key={v.icon} style={{
                background: "rgba(255,255,255,0.01)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "24px 24px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${v.color}35`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.44rem",
                  color: v.color, letterSpacing: "0.16em", marginBottom: 10,
                }}>{v.icon}</div>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "clamp(0.95rem,1.6vw,1.15rem)", color: "#f0f0f0",
                  letterSpacing: "-0.02em", marginBottom: 10, lineHeight: 1.25,
                }}>{v.title}</div>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "0.82rem",
                  color: "#888", lineHeight: 1.75, fontWeight: 300, marginBottom: 14,
                }}>{v.real}</p>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                  color: "#444", letterSpacing: "0.08em",
                  borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12,
                }}>
                  Technical solution: <span style={{ color: v.color }}>{v.technical}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          BUSINESS REQ → TECH BRIDGE (POC)
      ══════════════════════════════ */}
      <section id="bridge" style={{
        padding: "72px clamp(20px,5vw,80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: AM, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
            Proof of Concept
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", letterSpacing: "-0.04em",
            color: "#f0f0f0", marginBottom: 10, lineHeight: 1.1,
          }}>
            Business requirement → root cause → actual code.
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.88rem",
            color: "#555", lineHeight: 1.7, maxWidth: 560, marginBottom: 40,
          }}>
            Every card below shows the business requirement verbatim, the technical root cause,
            the before code (what was wrong), the after code (what was built), and the measured outcome.
            Open each one and read the diff.
          </p>

          {/* Legend */}
          <div style={{
            display: "flex", gap: 18, flexWrap: "wrap",
            fontFamily: "var(--font-mono)", fontSize: "0.46rem",
            color: "#555", letterSpacing: "0.08em", marginBottom: 28,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f44336", display: "inline-block" }} />
              BEFORE — the broken state
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: AC, display: "inline-block" }} />
              AFTER — what was built
            </span>
            <span>Click any card to expand</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BRIDGES.map(b => (
              <PocCard
                key={b.id}
                b={b}
                open={openBridge === b.id}
                onToggle={() => setOpenBridge(p => p === b.id ? null : b.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW I WORK — 5 steps
      ══════════════════════════════ */}
      <section style={{
        padding: "72px clamp(20px,5vw,80px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.005)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: AC, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Process</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", letterSpacing: "-0.04em",
            color: "#f0f0f0", marginBottom: 10, lineHeight: 1.1,
          }}>Five steps. Every engagement.</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#555", lineHeight: 1.7, maxWidth: 480, marginBottom: 44 }}>
            Most engineers jump to step 4. I start at step 1. That is the difference between a system that demos well and one that works in production.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { n:"01", title:"Discover", color: AC, desc:"1-3 days in your operation before any code. Interviews with users, observation of real workflows, mapping where time and money actually disappear.", proof:"Shadowed TTC staff at Union Station for a full day. Interviewed 4 attorneys. Embedded with edtech clients for 2-3 days." },
              { n:"02", title:"Diagnose", color: AM, desc:"Translate the business pain into a precise technical root cause. The stated problem is rarely the actual problem. This diagnosis is the most valuable deliverable of the engagement.", proof:"Resso context issue: not a model quality problem — a missing session architecture. Different solution, 10x lower cost." },
              { n:"03", title:"Architect", color: VI, desc:"Design the system before building it. Stack choice, data flow, failure modes, cost model — documented and agreed before a line of code is written. Decisions made at this stage cost nothing to change.", proof:"Lawline: entire air-gapped architecture designed upfront. The zero-egress proof became the $1M Rogers sales pitch." },
              { n:"04", title:"Build", color: BL, desc:"Production systems, not prototypes. Every component tested, deployed in real infrastructure, documented for handoff. I own every layer: model, API, infra, dashboard, MLOps.", proof:"Resso: WebRTC ingestion, diarization, NLP pipeline, hire scorer, ONNX export, MLOps dashboard — one engineer, full stack." },
              { n:"05", title:"Measure", color: AC, desc:"Every engagement ships with before/after baselines. Latency. Accuracy. Retention. Cost per outcome. You know exactly what changed and by how much.", proof:"Resso: context retention 72%→98%. Hallucination 14%→3.8%. Corol: lab cycles weeks→one afternoon." },
            ].map((s, i) => (
              <div key={s.n} style={{
                display: "grid", gridTemplateColumns: "60px 1fr",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                padding: "22px 0",
                gap: 24, alignItems: "start",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                  color: s.color, letterSpacing: "0.12em", paddingTop: 4,
                }}>{s.n}</div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "1rem", color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 6,
                  }}>{s.title}</div>
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.75, fontWeight: 300, marginBottom: 8, maxWidth: 600 }}>{s.desc}</p>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                    color: "#444", lineHeight: 1.6, fontStyle: "italic",
                    borderLeft: `2px solid ${s.color}30`, paddingLeft: 10,
                  }}>{s.proof}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA
      ══════════════════════════════ */}
      <section style={{ padding: "72px clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            background: "rgba(57,217,180,0.03)",
            border: "1px solid rgba(57,217,180,0.14)",
            borderRadius: 16, padding: "52px 48px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 32, flexWrap: "wrap",
          }}>
            <div style={{ maxWidth: 520 }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(1.4rem,2.5vw,2.2rem)", letterSpacing: "-0.03em",
                color: "#f0f0f0", marginBottom: 12, lineHeight: 1.15,
              }}>
                Tell me what is broken.<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: AC }}>
                  I will tell you how to fix it.
                </span>
              </h2>
              <p style={{ fontSize: "0.86rem", color: "#555", lineHeight: 1.75, fontWeight: 300 }}>
                Free 30-minute call. I will ask about your operation, identify the root cause, and give you a concrete technical direction — whether or not we work together.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <a href="/book" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700,
                letterSpacing: "0.08em", padding: "16px 32px", borderRadius: 6,
                background: AC, color: "#000", textDecoration: "none",
                textAlign: "center", whiteSpace: "nowrap", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Book a free call ↗
              </a>
              <a href="mailto:emailtosolankiom@gmail.com" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                color: "#444", textDecoration: "none",
                textAlign: "center", letterSpacing: "0.06em", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
              onMouseLeave={e => e.currentTarget.style.color = "#444"}>
                or email directly
              </a>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.52rem",
              color: "#333", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#777"}
            onMouseLeave={e => e.currentTarget.style.color = "#333"}>
              ← Back to portfolio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
