"use client";
import { useEffect, useRef, useState } from "react";

const T = {
  white:  "#f0f0f0",
  dim:    "#888",
  faint:  "#444",
  border: "rgba(255,255,255,0.08)",
  surf:   "rgba(255,255,255,0.03)",
  accent: "#4a9eff",
  green:  "#3dba7e",
  amber:  "#c8973a",
  purple: "#8b78d4",
};

type PipeStage = { label: string; sub: string; badge: string; color: string };

const TRAIN_PIPE: PipeStage[] = [
  { label:"Business Data",    sub:"CRM · docs · logs",          badge:"INPUT",       color:T.dim    },
  { label:"Clean + Label",    sub:"deduplicate · annotate",      badge:"PREPROCESS",  color:T.dim    },
  { label:"Base Model",       sub:"Llama 3.1 · Mistral · Phi-3", badge:"FOUNDATION",  color:T.accent },
  { label:"LoRA Fine-tune",   sub:"QLoRA 4-bit · custom corpus", badge:"FINE-TUNE",   color:T.accent },
  { label:"Eval Loop",        sub:"F1 · AUC · BLEU · perplexity",badge:"EVALUATE",    color:T.amber  },
  { label:"ONNX Export",      sub:"INT8 quant · 4× speedup",     badge:"COMPRESS",    color:T.amber  },
  { label:"Production",       sub:"serve · monitor · retrain",   badge:"DEPLOY",      color:T.green  },
];

const INFER_PIPE: PipeStage[] = [
  { label:"Business Signal",  sub:"event · query · document",   badge:"TRIGGER",     color:T.dim    },
  { label:"Embed",            sub:"nomic-embed · on-premise",   badge:"LOCAL",       color:T.accent },
  { label:"HNSW Search",      sub:"4.2ms p99 · no cloud",       badge:"RETRIEVAL",   color:T.accent },
  { label:"Fine-tuned LLM",   sub:"your domain · your data",    badge:"REASON",      color:T.purple },
  { label:"Sigmoid Gate",     sub:"P(action) = σ(z) > 0.50",   badge:"DECISION",    color:T.amber  },
  { label:"Agent",            sub:"MCP · tool-use · memory",    badge:"ORCHESTRATE", color:T.amber  },
  { label:"Business Action",  sub:"hire · alert · escalate",    badge:"OUTPUT",      color:T.green  },
];

function PipeRow({ stages, label, active }: { stages: PipeStage[]; label: string; active: boolean }) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setPulse(p => (p + 1) % stages.length), 700);
    return () => clearInterval(id);
  }, [active, stages.length]);

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.48rem", color:T.faint,
        letterSpacing:"0.12em", marginBottom:8, textTransform:"uppercase" }}>
        {label}
      </div>
      <div style={{ display:"flex", alignItems:"stretch", gap:0, overflowX:"auto" }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ flex:1, minWidth:96,
              background: pulse === i ? `${s.color}0a` : T.surf,
              border:`1px solid ${pulse === i ? s.color + "30" : T.border}`,
              borderRadius:5, padding:"10px 10px 9px", transition:"all 0.4s ease" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.46rem",
                color:s.color, letterSpacing:"0.1em", marginBottom:5 }}>{s.badge}</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem",
                color:T.white, fontWeight:600, marginBottom:3, lineHeight:1.2 }}>{s.label}</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                color:T.faint, lineHeight:1.4 }}>{s.sub}</div>
            </div>
            {i < stages.length - 1 && (
              <div style={{ width:20, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:T.faint }}>—</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const TRIGGERS = [
  { signal:"Interview audio stream",    model:"Hire-scorer (ONNX INT8)",    threshold:"P > 0.80",   action:"Flag candidate  ·  update ATS",       retrain:"Data drift > 0.30" },
  { signal:"Customer churn signals",    model:"Churn classifier (XGBoost)", threshold:"P > 0.65",   action:"Trigger retention offer via CRM",     retrain:"F1 drops < 0.82"  },
  { signal:"Invoice / document ingest", model:"Doc parser (fine-tuned LLM)",threshold:"conf > 0.90",action:"Route to approver  ·  auto-fill ERP", retrain:"Monthly + errors" },
  { signal:"Support ticket submitted",  model:"Intent classifier",          threshold:"P > 0.75",   action:"Escalate  ·  assign  ·  draft reply", retrain:"New intent labels" },
  { signal:"Sales call transcript",     model:"Opportunity scorer",         threshold:"score > 70", action:"Alert AE  ·  update pipeline stage",  retrain:"Win-rate feedback" },
];

const TIERS = [
  {
    name: "Discovery",
    label: "AUDIT",
    timeline: "1–2 weeks",
    outcome: "You get a clear map of where AI saves you time and money.",
    desc: "We audit your data, workflows, and stack. You walk away with a concrete AI roadmap — no fluff, no guessing.",
    items: ["Stack + data readiness audit","AI opportunity map","Architecture proposal","ROI model for each opportunity"],
    color: T.dim,
  },
  {
    name: "Build",
    label: "DEPLOY",
    timeline: "4–10 weeks",
    outcome: "A fully deployed AI system running inside your infrastructure.",
    desc: "End-to-end: model fine-tuned on your data, agentic pipeline, sigmoid trigger automation — deployed on-premise. Your data never leaves.",
    items: ["Fine-tune on your business corpus","On-premise RAG + vector search","Agentic trigger pipeline","MLOps monitoring + auto-retrain","Full source + documentation"],
    color: T.green,
    highlight: true,
  },
  {
    name: "Scale",
    label: "ENTERPRISE",
    timeline: "2–4 months",
    outcome: "AI across every department. Your whole org moves faster.",
    desc: "Multi-agent platform, continuous retraining, air-gapped deployment, rolled out department by department.",
    items: ["Multi-agent orchestration","Air-gapped deployment","CI/CD for model retraining","Department-level rollout","Ongoing retainer included"],
    color: T.purple,
  },
];

const B2B_VALUE = [
  { icon:"01", title:"Your data stays yours", body:"Every model runs inside your building. No cloud APIs. No data leaving your network. GDPR-compliant by architecture, not policy." },
  { icon:"02", title:"AI that acts, not just answers", body:"Agentic systems that read signals from your business — tickets, calls, documents — and take actions inside your tools automatically." },
  { icon:"03", title:"Built on your domain", body:"Models fine-tuned on your actual data. Not a generic ChatGPT wrapper. A system that understands your industry, your customers, your language." },
  { icon:"04", title:"Measurable ROI", body:"Every engagement starts with an ROI model. If we can't show you how it pays for itself, we don't build it. Cost per outcome, not cost per hour." },
];

export default function Rates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setActive(true);
        el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
      }
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="rates" ref={sectionRef} className="section"
      style={{ borderTop:`1px solid ${T.border}` }}>
      <div className="container">

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:52 }} className="reveal">
          <span className="section-index">07 //</span>
          <div style={{ flex:1, height:1, background:T.border }} />
        </div>

        <div className="reveal" style={{ marginBottom:10 }}>
          <span className="label-accent">AI Consulting</span>
        </div>

        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom:16 }}>
          What I can build{" "}
          <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--accent)" }}>
            for you.
          </span>
        </h2>

        <p className="body-lg reveal reveal-d2" style={{ maxWidth:640, marginBottom:52, color:T.dim }}>
          AI systems that run inside your infrastructure, trained on your data,
          and triggered by real business events — not a chatbot wrapper.
          Your documents, your workflows, your edge. Zero data leaves your building.
        </p>

        {/* B2B Value blocks */}
        <div className="reveal reveal-d2" style={{
          display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:52,
        }}>
          {B2B_VALUE.map(v => (
            <div key={v.icon} style={{
              border:`1px solid ${T.border}`, borderRadius:8,
              padding:"20px 22px", background:T.surf,
            }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.46rem",
                color:T.faint, letterSpacing:"0.12em", marginBottom:10 }}>{v.icon}</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem",
                color:T.white, fontWeight:600, marginBottom:8, lineHeight:1.3 }}>{v.title}</div>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:"0.54rem",
                color:T.dim, lineHeight:1.7, margin:0 }}>{v.body}</p>
            </div>
          ))}
        </div>

        {/* Architecture */}
        <div className="reveal reveal-d2" style={{ marginBottom:8 }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem",
            color:T.faint, letterSpacing:"0.12em" }}>
            HOW IT WORKS  ·  TWO-LAYER PIPELINE
          </span>
        </div>

        <div className="reveal reveal-d3" style={{
          border:`1px solid ${T.border}`, borderRadius:8,
          padding:"20px 20px 16px", background:"rgba(255,255,255,0.01)", marginBottom:10,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            marginBottom:16, fontFamily:"var(--font-mono)", fontSize:"0.48rem",
            borderBottom:`1px solid ${T.border}`, paddingBottom:10 }}>
            <span style={{ color:T.green, letterSpacing:"0.1em" }}>
              SECURE PERIMETER  ·  AIR-GAPPED  ·  ON-PREMISE
            </span>
            <span style={{ color:T.faint }}>
              0 external API calls  ·  encrypted at rest  ·  GDPR compliant
            </span>
          </div>
          <PipeRow stages={TRAIN_PIPE} label="01  TRAINING PIPELINE  —  fine-tune a model on your business corpus" active={active} />
          <div style={{ display:"flex", alignItems:"center", gap:8, margin:"12px 0" }}>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.46rem",
              color:T.faint, letterSpacing:"0.1em" }}>TRAINED MODEL ARTIFACT</span>
            <div style={{ flex:1, height:1, background:T.border }} />
          </div>
          <PipeRow stages={INFER_PIPE} label="02  INFERENCE + TRIGGER PIPELINE  —  live agentic decisions in production" active={active} />
          <div style={{ marginTop:14, fontFamily:"var(--font-mono)", fontSize:"0.5rem",
            color:T.faint, textAlign:"center", letterSpacing:"0.04em",
            borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
            P(retrain) = σ(w₁·drift + w₂·F1_drop + w₃·days + b)  ·  P(action) = σ(w₁·signal + w₂·confidence + b)
          </div>
        </div>

        <div className="reveal reveal-d3" style={{
          display:"flex", gap:20, flexWrap:"wrap", marginBottom:52,
          fontFamily:"var(--font-mono)", fontSize:"0.49rem", color:T.faint,
        }}>
          {[
            { color:T.accent, l:"Foundation & embedding" },
            { color:T.amber,  l:"Evaluation & decision gate" },
            { color:T.green,  l:"Deploy & business output" },
            { color:T.purple, l:"Fine-tuned reasoning" },
          ].map(({ color, l }) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:14, height:1, background:color }} />
              <span>{l}</span>
            </div>
          ))}
        </div>

        {/* Business trigger table */}
        <div className="reveal reveal-d3" style={{ marginBottom:8 }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem",
            color:T.faint, letterSpacing:"0.12em" }}>
            REAL BUSINESS TRIGGERS  ·  WHAT THE AI RESPONDS TO
          </span>
        </div>

        <div className="reveal reveal-d3 rates-trigger-table-wrap" style={{
          border:`1px solid ${T.border}`, borderRadius:8, overflow:"hidden", marginBottom:52,
        }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 2fr 1.5fr", minWidth:560,
            padding:"8px 16px", background:"rgba(255,255,255,0.02)",
            borderBottom:`1px solid ${T.border}`,
            fontFamily:"var(--font-mono)", fontSize:"0.46rem",
            color:T.faint, letterSpacing:"0.1em", textTransform:"uppercase", gap:12 }}>
            <span>Input signal</span><span>Model</span><span>Threshold</span>
            <span>Action</span><span>Retrain trigger</span>
          </div>
          {TRIGGERS.map((row, i) => (
            <div key={row.signal} style={{
              display:"grid", gridTemplateColumns:"2fr 2fr 1fr 2fr 1.5fr", minWidth:560,
              padding:"11px 16px",
              borderBottom: i < TRIGGERS.length - 1 ? `1px solid ${T.border}` : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              gap:12, alignItems:"baseline" }}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.56rem", color:T.white }}>{row.signal}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.54rem", color:T.dim }}>{row.model}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.54rem", color:T.amber }}>{row.threshold}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem", color:T.dim }}>{row.action}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:T.faint }}>{row.retrain}</span>
            </div>
          ))}
        </div>

        {/* Engagement tiers — no prices */}
        <div className="reveal reveal-d3" style={{ marginBottom:8 }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem",
            color:T.faint, letterSpacing:"0.12em" }}>
            HOW WE ENGAGE
          </span>
        </div>
        <h3 className="display-md reveal reveal-d3" style={{ marginBottom:32 }}>
          From idea to{" "}
          <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic" }}>production.</span>
        </h3>

        <div className="tiers-grid reveal reveal-d3" style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24,
        }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{
              border:`1px solid ${tier.highlight ? tier.color + "35" : T.border}`,
              borderRadius:8, padding:"24px 22px",
              background: tier.highlight ? `${tier.color}05` : "rgba(255,255,255,0.01)",
              position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1,
                background:tier.color, opacity:0.4, borderRadius:1 }} />

              {tier.highlight && (
                <div style={{ position:"absolute", top:12, right:14,
                  fontFamily:"var(--font-mono)", fontSize:"0.44rem",
                  color:tier.color, letterSpacing:"0.1em",
                  border:`1px solid ${tier.color}40`, padding:"2px 7px", borderRadius:2 }}>
                  MOST COMMON
                </div>
              )}

              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem",
                color:tier.color, letterSpacing:"0.12em", marginBottom:6 }}>
                {tier.label}
              </div>
              <div style={{ fontFamily:"var(--font-serif)", fontStyle:"italic",
                fontSize:"1.45rem", color:T.white, lineHeight:1.1, marginBottom:4 }}>
                {tier.name}
              </div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.48rem",
                color:T.faint, letterSpacing:"0.08em", marginBottom:14 }}>
                {tier.timeline}
              </div>

              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.56rem",
                color:tier.color, lineHeight:1.5, marginBottom:12, fontStyle:"italic" }}>
                {tier.outcome}
              </div>

              <p style={{ fontFamily:"var(--font-mono)", fontSize:"0.54rem",
                color:T.dim, lineHeight:1.7, marginBottom:16 }}>
                {tier.desc}
              </p>

              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
                {tier.items.map(d => (
                  <div key={d} style={{ display:"flex", gap:8, alignItems:"baseline",
                    fontFamily:"var(--font-mono)", fontSize:"0.54rem", color:T.faint,
                    marginBottom:6, lineHeight:1.4 }}>
                    <span style={{ color:tier.color, flexShrink:0, fontSize:"0.5rem" }}>+</span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Retainer — no price */}
        <div className="reveal reveal-d4" style={{
          border:`1px solid ${T.border}`, borderRadius:8,
          padding:"20px 24px", marginBottom:20,
        }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
            color:T.faint, letterSpacing:"0.12em", marginBottom:6 }}>
            ONGOING PARTNERSHIP
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.8rem", color:T.white, marginBottom:4 }}>
            Monthly advisory + hands-on engineering
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem", color:T.faint }}>
            Architecture reviews  ·  model monitoring  ·  incident response  ·  new feature development
          </div>
        </div>

        {/* CTA */}
        <div className="reveal reveal-d4" style={{
          border:`1px solid ${T.border}`, borderRadius:8,
          padding:"28px 28px", display:"flex",
          justifyContent:"space-between", alignItems:"center", gap:24, flexWrap:"wrap",
          background:"rgba(74,158,255,0.03)",
        }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.8rem",
              color:T.white, fontWeight:600, marginBottom:8 }}>
              Ready to talk scope?
            </div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.56rem", color:T.dim, lineHeight:1.7 }}>
              Every engagement starts with a free 30-minute call where we define<br/>
              the problem, the deliverable, and the metric that proves it worked.
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", flexShrink:0 }}>
            <a href="/book"
              style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem",
                letterSpacing:"0.06em", padding:"12px 24px", borderRadius:4,
                textDecoration:"none", background:T.white, color:"#000",
                fontWeight:700, transition:"opacity 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity="0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
              Book a free call
            </a>
            <a href="#contact"
              style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem",
                letterSpacing:"0.06em", padding:"12px 24px", borderRadius:4,
                textDecoration:"none", border:`1px solid ${T.border}`, color:T.dim,
                transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.dim; }}>
              Send message
            </a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width:860px) {
          .tiers-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width:680px) {
          .b2b-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width:480px) {
          .rates-trigger-table-wrap { border-radius: 6px; }
          .tiers-grid > div { padding: 20px 16px !important; }
        }
      `}</style>
    </section>
  );
}
