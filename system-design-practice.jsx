import { useState } from "react";

const questions = [
  {
    id: 1,
    title: "RAG Pipeline",
    tag: "Most Likely",
    tagColor: "#ef4444",
    prompt: "Design a system where Amex card members can ask natural language questions about their transaction history. Must be secure, fast, and grounded in real data.",
    components: [
      { label: "Ingestion Pipeline", color: "#1e40af", desc: "Kafka streams new transactions in real-time from Postgres/Oracle DB" },
      { label: "Chunker", color: "#1e40af", desc: "Each transaction → text chunk with metadata (userId, date, amount, merchant)" },
      { label: "Embedder", color: "#1e40af", desc: "OpenAI text-embedding-3 or internal model converts text → vector" },
      { label: "Vector Store", color: "#1e40af", desc: "Pinecone / pgvector stores embeddings + metadata per user" },
      { label: "Query Embedder", color: "#0f766e", desc: "User question gets embedded the same way" },
      { label: "Hybrid Search", color: "#0f766e", desc: "Vector similarity + metadata filter (userId, date range, amount)" },
      { label: "Re-ranker", color: "#0f766e", desc: "Cross-encoder reorders top-K chunks for relevance" },
      { label: "Prompt Builder", color: "#7c3aed", desc: "Assembles system prompt + context chunks + user query" },
      { label: "LLM", color: "#7c3aed", desc: "GPT-4 / internal model generates grounded response with citations" },
    ],
    flow: [
      { from: "Transactions DB", to: "Kafka", label: "stream" },
      { from: "Kafka", to: "Chunker", label: "events" },
      { from: "Chunker", to: "Embedder", label: "text" },
      { from: "Embedder", to: "Vector Store", label: "vectors" },
      { from: "User Query", to: "Query Embedder", label: "" },
      { from: "Query Embedder", to: "Hybrid Search", label: "embedding" },
      { from: "Vector Store", to: "Hybrid Search", label: "lookup" },
      { from: "Hybrid Search", to: "Re-ranker", label: "top-K" },
      { from: "Re-ranker", to: "Prompt Builder", label: "ranked" },
      { from: "Prompt Builder", to: "LLM", label: "prompt" },
      { from: "LLM", to: "User Response", label: "answer" },
    ],
    tradeoffs: [
      { decision: "pgvector over Pinecone", why: "Already in Postgres, less infra", cost: "Slower at 100M+ vectors" },
      { decision: "1 transaction = 1 chunk", why: "Precise retrieval", cost: "More vectors to store" },
      { decision: "Hybrid search", why: "Handles exact filters (amount > $200)", cost: "More complex query logic" },
      { decision: "Stream LLM response", why: "Feels fast to user", cost: "Harder error handling mid-stream" },
    ],
    keyInsight: "🔒 SECURITY: Every vector search MUST filter by userId before returning. Never mix card member data.",
  },
  {
    id: 2,
    title: "Agentic Dispute Handler",
    tag: "Very Likely",
    tagColor: "#f97316",
    prompt: "Design an AI agent that autonomously handles card member disputes — reads complaint, pulls records, classifies type, then auto-resolves or escalates to human. Must be safe and auditable.",
    components: [
      { label: "Dispute Intake API", color: "#1e40af", desc: "REST endpoint receives complaint text + card member ID" },
      { label: "Intent Classifier", color: "#1e40af", desc: "LLM classifies dispute: fraud / billing error / merchant dispute / other" },
      { label: "Tool Orchestrator", color: "#0f766e", desc: "Agent brain — decides which tools to call in what order (LangChain/custom)" },
      { label: "Transaction Fetcher", color: "#0f766e", desc: "Tool: pulls raw transaction data from DB for the disputed period" },
      { label: "Policy Engine", color: "#0f766e", desc: "Tool: checks Amex policy — is this auto-approvable? What's the limit?" },
      { label: "Resolution Generator", color: "#7c3aed", desc: "LLM drafts resolution letter or decision with reasoning" },
      { label: "Human Escalation Queue", color: "#dc2626", desc: "If confidence < threshold or amount > $500, route to human agent" },
      { label: "Audit Logger", color: "#374151", desc: "Every agent step, tool call, and decision logged immutably for compliance" },
    ],
    flow: [],
    tradeoffs: [
      { decision: "Hard limit on auto-resolve amount", why: "Risk management — $500 cap", cost: "More human workload for large disputes" },
      { decision: "Audit every step", why: "Financial services compliance (SOX)", cost: "Storage cost, latency" },
      { decision: "Confidence threshold for escalation", why: "Safety net for low-confidence decisions", cost: "Requires calibration" },
      { decision: "Stateless agent per request", why: "Easy to retry/replay", cost: "No memory across dispute sessions" },
    ],
    keyInsight: "⚠️ SAFETY: Agent must never auto-resolve if confidence < 85% or amount > $500. Always log the full reasoning chain.",
  },
  {
    id: 3,
    title: "LLM Evaluation System",
    tag: "Likely",
    tagColor: "#eab308",
    prompt: "Your team ships a new LLM feature every 2 weeks. Design an evaluation pipeline that automatically tests each release for correctness, safety, and regression before it hits production.",
    components: [
      { label: "Eval Dataset Store", color: "#1e40af", desc: "Golden dataset: 500+ question-answer pairs, curated by domain experts" },
      { label: "Test Runner", color: "#1e40af", desc: "On every PR merge: runs new model/prompt against full eval dataset" },
      { label: "Faithfulness Scorer", color: "#0f766e", desc: "Cross-encoder NLI: is answer grounded in retrieved context? (0-1 score)" },
      { label: "Relevance Scorer", color: "#0f766e", desc: "Are retrieved chunks actually relevant to the query?" },
      { label: "Safety Classifier", color: "#dc2626", desc: "Checks for PII leakage, hallucinated account numbers, harmful content" },
      { label: "Regression Detector", color: "#0f766e", desc: "Compares score vs previous version — flags if any metric drops > 2%" },
      { label: "Eval Dashboard", color: "#7c3aed", desc: "Visual report: scores per category, failed cases, trend over releases" },
      { label: "Gate: Block / Allow", color: "#374151", desc: "Auto-blocks deploy if safety fails OR regression > threshold" },
    ],
    flow: [],
    tradeoffs: [
      { decision: "RAGAS framework", why: "Open source, battle-tested RAG eval", cost: "Not tailored to financial domain" },
      { decision: "Automated + human eval", why: "Automated catches regressions; human catches nuance", cost: "Human eval is slow and expensive" },
      { decision: "Block on safety failure, warn on relevance drop", why: "Safety is non-negotiable", cost: "Might slow releases" },
      { decision: "Versioned eval datasets", why: "Can re-run old evals on new models", cost: "Dataset curation effort" },
    ],
    keyInsight: "📊 METRICS: Faithfulness (is it grounded?) + Relevance (right chunks?) + Safety (no PII?) + Latency (< 2s?)",
  },
  {
    id: 4,
    title: "Real-Time Fraud Detection",
    tag: "Possible",
    tagColor: "#6b7280",
    prompt: "Design a system that flags potentially fraudulent transactions in real time. A card member swipes — you have 200ms to decide fraud or not before approving or declining.",
    components: [
      { label: "Transaction Event", color: "#1e40af", desc: "Card swipe triggers event: amount, merchant, location, time, deviceId" },
      { label: "Kafka Topic", color: "#1e40af", desc: "Transaction stream — high throughput, ordered per cardId" },
      { label: "Feature Extractor", color: "#0f766e", desc: "Real-time: velocity (txns/hour), geo-distance from last txn, time-of-day pattern" },
      { label: "Feature Store", color: "#0f766e", desc: "Redis: pre-computed user features (avg spend, typical merchants, home location)" },
      { label: "ML Model", color: "#7c3aed", desc: "Gradient Boost or LSTM: outputs fraud probability score 0-1 in < 50ms" },
      { label: "Rule Engine", color: "#7c3aed", desc: "Hard rules: country not visited before, amount 10x avg, card reported stolen" },
      { label: "Decision Engine", color: "#dc2626", desc: "Combines ML score + rules → APPROVE / DECLINE / STEP-UP (OTP)" },
      { label: "Feedback Loop", color: "#374151", desc: "Card member confirms/denies fraud → retrains model weekly" },
    ],
    flow: [],
    tradeoffs: [
      { decision: "Redis for feature store", why: "Sub-millisecond reads, perfect for 200ms budget", cost: "Memory expensive, data loss risk" },
      { decision: "Gradient Boost over deep learning", why: "Fast inference, interpretable", cost: "Less accurate on sequence patterns" },
      { decision: "Step-up auth instead of hard decline", why: "Less false positive friction", cost: "Extra UX step for legitimate users" },
      { decision: "Async model retraining", why: "Don't block real-time path", cost: "Model lags behind new fraud patterns" },
    ],
    keyInsight: "⚡ LATENCY: 200ms budget. Feature fetch: 10ms, Model inference: 50ms, Rules: 5ms, Decision: 5ms. Rest is network.",
  },
  {
    id: 5,
    title: "LLM Gateway / AI Platform",
    tag: "Possible",
    tagColor: "#6b7280",
    prompt: "50 product teams all want to use LLMs. Design a central LLM gateway handling routing, rate limiting, cost tracking, prompt logging, and model fallback — so teams don't build their own.",
    components: [
      { label: "API Gateway", color: "#1e40af", desc: "Teams call one endpoint: POST /llm/complete — auth via API key per team" },
      { label: "Auth + Rate Limiter", color: "#1e40af", desc: "Token bucket per team — enforces cost quotas and requests/min limits" },
      { label: "Router", color: "#0f766e", desc: "Routes to correct model based on: task type, cost tier, latency requirement" },
      { label: "Model Registry", color: "#0f766e", desc: "Tracks available models: GPT-4, Claude, Gemini, internal — with health status" },
      { label: "Prompt Logger", color: "#7c3aed", desc: "Every request/response logged (with PII scrubbing) for audit + debugging" },
      { label: "Cost Tracker", color: "#7c3aed", desc: "Per team, per model token cost → dashboard + monthly budget alerts" },
      { label: "Fallback Handler", color: "#dc2626", desc: "If primary model fails or is slow → auto-failover to secondary model" },
      { label: "Cache Layer", color: "#374151", desc: "Semantic cache: if same/similar prompt seen before, return cached response" },
    ],
    flow: [],
    tradeoffs: [
      { decision: "Semantic cache", why: "30-40% cost reduction on repeated queries", cost: "Cache invalidation complexity" },
      { decision: "Per-team API keys", why: "Isolates cost, enables quota enforcement", cost: "Key rotation overhead" },
      { decision: "Async logging", why: "Doesn't add latency to request path", cost: "Possible log loss on crash" },
      { decision: "Model-agnostic interface", why: "Teams don't change code when model changes", cost: "Lowest-common-denominator API" },
    ],
    keyInsight: "💰 COST: Semantic caching alone can cut LLM costs by 30-40%. Always pitch this — Amex cares about cost at scale.",
  },
];

const ArchDiagram = ({ q }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const ingestion = q.components.slice(0, 4);
  const query = q.components.slice(4, 7);
  const output = q.components.slice(7);

  const groups = [
    { label: "Ingestion / Setup", items: ingestion, bg: "#1e3a5f" },
    { label: "Query / Runtime", items: query, bg: "#134e4a" },
    { label: "Output / Decision", items: output, bg: "#3b1f6e" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ background: g.bg, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            {g.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {g.items.map((comp, ci) => {
              const globalIdx = gi * 4 + ci;
              return (
                <div
                  key={ci}
                  onMouseEnter={() => setHoveredIdx(globalIdx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    background: hoveredIdx === globalIdx ? "#ffffff18" : "#ffffff0d",
                    border: `1px solid ${hoveredIdx === globalIdx ? "#60a5fa" : "#ffffff15"}`,
                    borderRadius: 7,
                    padding: "8px 12px",
                    cursor: "default",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{comp.label}</div>
                  {hoveredIdx === globalIdx && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{comp.desc}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Trade-offs */}
      <div style={{ background: "#1e1e2e", borderRadius: 10, padding: "12px 14px", border: "1px solid #374151" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Trade-offs
        </div>
        {q.tradeoffs.map((t, i) => (
          <div key={i} style={{ marginBottom: 8, borderLeft: "3px solid #3b82f6", paddingLeft: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{t.decision}</div>
            <div style={{ fontSize: 11, color: "#86efac" }}>✓ {t.why}</div>
            <div style={{ fontSize: 11, color: "#fca5a5" }}>✗ {t.cost}</div>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div style={{ background: "#1a1a2e", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>{q.keyInsight}</div>
      </div>
    </div>
  );
};

export default function SystemDesignPractice() {
  const [activeQ, setActiveQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const q = questions[activeQ];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#0f0f1a",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#e2e8f0",
      overflow: "hidden",
    }}>

      {/* LEFT PANEL */}
      <div style={{
        width: 340,
        background: "#13131f",
        borderRight: "1px solid #1e1e2e",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            Amex AI Engineer I
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginTop: 4 }}>
            System Design
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            5 questions · Hover boxes for details
          </div>
        </div>

        {/* Question List */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {questions.map((question, idx) => (
            <div
              key={idx}
              onClick={() => { setActiveQ(idx); setShowAnswer(false); }}
              style={{
                background: activeQ === idx ? "#1e1e3a" : "transparent",
                border: `1px solid ${activeQ === idx ? "#4f46e5" : "#1e1e2e"}`,
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 8,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: activeQ === idx ? "#4f46e5" : "#1e1e2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: activeQ === idx ? "#fff" : "#64748b",
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: activeQ === idx ? "#e2e8f0" : "#94a3b8" }}>
                  {question.title}
                </div>
              </div>
              <div style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                color: question.tagColor,
                border: `1px solid ${question.tagColor}`,
                borderRadius: 4,
                padding: "1px 7px",
                marginBottom: 6,
              }}>
                {question.tag}
              </div>
              {activeQ === idx && (
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginTop: 4 }}>
                  {question.prompt}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer tips */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #1e1e2e", background: "#0f0f1a" }}>
          <div style={{ fontSize: 11, color: "#4f46e5", fontWeight: 700, marginBottom: 6 }}>
            Interview Framework
          </div>
          {["1. Clarify (2 min)", "2. Scope it", "3. High-level design", "4. Deep dive x2", "5. Trade-offs", "6. Scale / failure"].map((step, i) => (
            <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Question Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid #1e1e2e",
          background: "#13131f",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              fontSize: 28,
              fontWeight: 900,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Q{activeQ + 1}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>{q.title}</div>
              <div style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                color: q.tagColor,
                border: `1px solid ${q.tagColor}`,
                borderRadius: 4,
                padding: "1px 8px",
                marginTop: 2,
              }}>
                {q.tag}
              </div>
            </div>
          </div>
          <div style={{
            background: "#1e1e2e",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 14,
            color: "#cbd5e1",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}>
            "{q.prompt}"
          </div>
        </div>

        {/* Architecture */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          <div style={{ display: "flex", gap: 16 }}>

            {/* Steps to answer */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                How to Answer This
              </div>

              {[
                {
                  step: "01",
                  title: "Clarify First",
                  content: `"Before I design, a few questions: How many card members? Real-time or batch? What's the latency budget? Any compliance constraints I should know about?"`
                },
                {
                  step: "02",
                  title: "Scope It",
                  content: `"I'll focus on the ${q.components[0].label} and ${q.components[Math.floor(q.components.length / 2)].label} — those are the core pieces. I'll mention the others at a high level."`
                },
                {
                  step: "03",
                  title: "Deep Dive",
                  content: `Pick ${q.components[0].label} and ${q.components[q.components.length - 1].label}. Explain each choice in detail. Mention alternatives you considered.`
                },
                {
                  step: "04",
                  title: "Failure Modes",
                  content: `"What breaks at 10x load? ${q.components[3]?.label || q.components[0].label} becomes the bottleneck. Here's how I'd scale it..."`,
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#13131f",
                  border: "1px solid #1e1e2e",
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 10,
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: "#4f46e5",
                      minWidth: 28,
                      paddingTop: 1,
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{item.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Components count */}
              <div style={{
                background: "#13131f",
                border: "1px solid #1e1e2e",
                borderRadius: 8,
                padding: "12px 14px",
                marginTop: 4,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>Components to Know</div>
                {q.components.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: c.color,
                      marginTop: 5,
                      flexShrink: 0,
                    }} />
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{c.label}: </span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Diagram */}
            <div style={{ width: 320, flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Architecture · Hover to expand
              </div>
              <ArchDiagram q={q} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{
          padding: "12px 28px",
          borderTop: "1px solid #1e1e2e",
          background: "#13131f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <button
            onClick={() => { setActiveQ(Math.max(0, activeQ - 1)); setShowAnswer(false); }}
            disabled={activeQ === 0}
            style={{
              background: activeQ === 0 ? "#1e1e2e" : "#1e1e3a",
              border: `1px solid ${activeQ === 0 ? "#1e1e2e" : "#4f46e5"}`,
              borderRadius: 7,
              padding: "8px 18px",
              color: activeQ === 0 ? "#374151" : "#e2e8f0",
              fontWeight: 700,
              cursor: activeQ === 0 ? "not-allowed" : "pointer",
              fontSize: 13,
            }}
          >
            ← Prev
          </button>

          <div style={{ fontSize: 12, color: "#64748b" }}>
            {activeQ + 1} / {questions.length}
          </div>

          <button
            onClick={() => { setActiveQ(Math.min(questions.length - 1, activeQ + 1)); setShowAnswer(false); }}
            disabled={activeQ === questions.length - 1}
            style={{
              background: activeQ === questions.length - 1 ? "#1e1e2e" : "#4f46e5",
              border: "none",
              borderRadius: 7,
              padding: "8px 18px",
              color: activeQ === questions.length - 1 ? "#374151" : "#fff",
              fontWeight: 700,
              cursor: activeQ === questions.length - 1 ? "not-allowed" : "pointer",
              fontSize: 13,
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
