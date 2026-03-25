"use client";
import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════
   SIGMOID CANVAS — animated decision gate
════════════════════════════════════════════════════════ */
function SigmoidCanvas({ z, threshold = 0.5 }: { z: number; threshold?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const sig = (x: number) => 1 / (1 + Math.exp(-x));
    const PAD = 12;
    const toX = (x: number) => ((x + 4.5) / 9) * (W - PAD * 2) + PAD;
    const toY = (y: number) => H - PAD - y * (H - PAD * 2);

    ctx.clearRect(0, 0, W, H);

    // Background zones
    const triggered = sig(z) >= threshold;
    ctx.fillStyle = "rgba(61,186,126,0.04)";
    ctx.fillRect(0, 0, W, toY(threshold));
    ctx.fillStyle = "rgba(86,156,214,0.04)";
    ctx.fillRect(0, toY(threshold), W, H - toY(threshold));

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(y => {
      ctx.beginPath(); ctx.moveTo(PAD, toY(y)); ctx.lineTo(W - PAD, toY(y)); ctx.stroke();
    });

    // Threshold dashed line
    ctx.strokeStyle = "rgba(220,195,90,0.7)";
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD, toY(threshold)); ctx.lineTo(W - PAD, toY(threshold));
    ctx.stroke();
    ctx.setLineDash([]);

    // Threshold label
    ctx.fillStyle = "rgba(220,195,90,0.8)";
    ctx.font = "9px 'Courier New', monospace";
    ctx.fillText(`θ = ${threshold.toFixed(2)}`, W - 56, toY(threshold) - 4);

    // Sigmoid curve gradient
    const curveColor = triggered ? "#3dba7e" : "#4a9eff";
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = PAD; px < W - PAD; px++) {
      const x = ((px - PAD) / (W - PAD * 2)) * 9 - 4.5;
      const y = sig(x);
      if (px === PAD) ctx.moveTo(px, toY(y));
      else ctx.lineTo(px, toY(y));
    }
    ctx.stroke();

    // Current point
    const sy = sig(z);
    const px = toX(z), py = toY(sy);

    // Drop line
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([2, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, toY(0)); ctx.stroke();
    ctx.setLineDash([]);

    // Animated glow ring
    ctx.strokeStyle = triggered ? "rgba(61,186,126,0.4)" : "rgba(86,156,214,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Point
    ctx.fillStyle = triggered ? "#3dba7e" : "#7ab0d4";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();

    // Axis labels
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "8px 'Courier New', monospace";
    ctx.fillText("0", PAD + 2, toY(0) - 3);
    ctx.fillText("1", PAD + 2, toY(1) + 10);
    ctx.fillText("σ(z)", W / 2 - 8, 10);
  }, [z, threshold]);

  return (
    <canvas
      ref={ref} width={340} height={200}
      style={{ width: "100%", height: 200, display: "block" }}
    />
  );
}

/* ════════════════════════════════════════════════════════
   TRIGGER SIGNAL CARD
════════════════════════════════════════════════════════ */
type SignalState = "ok" | "warn" | "fired";
interface Signal {
  id: string;
  label: string;
  unit: string;
  value: number;
  threshold: number;
  higherBad: boolean; // true = fire when value > threshold
  color: string;
}

function TriggerCard({ sig, state }: { sig: Signal; state: SignalState }) {
  const pct = sig.higherBad
    ? Math.min(sig.value / (sig.threshold * 1.8), 1)
    : Math.min(1 - (sig.value - sig.threshold * 0.4) / (sig.threshold * 0.6), 1);

  const fillPct = sig.higherBad
    ? Math.min((sig.value / (sig.threshold * 1.8)) * 100, 100)
    : Math.min(100 - ((sig.value - sig.threshold * 0.4) / (sig.threshold * 0.6)) * 100, 100);

  const stateColor = state === "fired" ? "#c05a5a" : state === "warn" ? "#b8a84a" : "#3dba7e";
  const stateLabel = state === "fired" ? "TRIGGERED" : state === "warn" ? "APPROACHING" : "NOMINAL";

  return (
    <div style={{
      background: state === "fired" ? "rgba(244,71,71,0.05)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${state === "fired" ? "rgba(244,71,71,0.25)" : state === "warn" ? "rgba(220,195,90,0.2)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 6, padding: "12px 14px", position: "relative", overflow: "hidden",
      transition: "all 0.5s",
    }}>
      {/* Glow edge when fired */}
      {state === "fired" && (
        <div style={{ position:"absolute", inset:0, borderRadius:6,
          boxShadow:"inset 0 0 12px rgba(244,71,71,0.15)", pointerEvents:"none" }} />
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"#888", letterSpacing:"0.08em" }}>
          {sig.label.toUpperCase()}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:stateColor,
          letterSpacing:"0.06em", animation: state==="fired" ? "pulse-text 1.4s ease-in-out infinite" : "none" }}>
          {stateLabel}
        </span>
      </div>

      {/* Value */}
      <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:8 }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"1.4rem", fontWeight:700,
          color: state === "fired" ? "#c05a5a" : state === "warn" ? "#b8a84a" : "#e8e8e8",
          lineHeight:1 }}>
          {sig.value.toFixed(sig.unit === "d" ? 0 : 2)}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"#555" }}>{sig.unit}</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"#444" }}>
          {sig.higherBad ? ">" : "<"} {sig.threshold.toFixed(sig.unit === "d" ? 0 : 2)} threshold
        </span>
      </div>

      {/* Bar */}
      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:2,
          width: `${Math.min(fillPct, 100)}%`,
          background: state === "fired" ? "#c05a5a" : state === "warn" ? "#b8a84a" : "#3dba7e",
          transition: "width 0.8s ease, background 0.5s",
        }} />
      </div>

      {/* Threshold marker */}
      <div style={{ position:"relative", marginTop:2 }}>
        <div style={{
          position:"absolute",
          left: `${sig.higherBad ? (1 / 1.8) * 100 : 52}%`,
          top:-6, width:1, height:10,
          background:"rgba(220,195,90,0.5)",
        }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   AGENT DECISION LOG
════════════════════════════════════════════════════════ */
const AGENT_SCRIPTS = [
  { delay: 0,    type:"dim",     text:"[orchestrator] polling trigger bus..." },
  { delay: 600,  type:"warn",    text:"[trigger-bus] 3 signals fired: DRIFT · F1 · LLM_CONF" },
  { delay: 1200, type:"info",    text:"[llm-router] aggregating signals via sigmoid gate..." },
  { delay: 1800, type:"accent",  text:"[llm-router] P(retrain) = σ(2.81) = 0.943 > θ(0.50)" },
  { delay: 2400, type:"success", text:"[decision] RETRAIN → confidence 94.3%  — routing to agent" },
  { delay: 3000, type:"info",    text:"[retrain-agent] queuing GPU job on resso-ml-prod-01..." },
  { delay: 3600, type:"dim",     text:"[retrain-agent] datasets: train.parquet · val.parquet · drift_shard_3" },
  { delay: 4200, type:"accent",  text:"[retrain-agent] ETA 4h 12m  ·  model: hire_scorer_v3.onnx" },
  { delay: 4800, type:"info",    text:"[eval-agent] scheduled post-train benchmark (AUC · F1 · latency)" },
  { delay: 5400, type:"success", text:"[deploy-agent] canary → 10% → 50% → 100% rollout plan set" },
  { delay: 6000, type:"dim",     text:"[orchestrator] next evaluation in 24h  ·  watching 4 signals" },
];

type LogType = "dim"|"warn"|"info"|"accent"|"success"|"out";
const LOG_C: Record<LogType, string> = {
  dim:"#555", warn:"#b8a84a", info:"#7ab0d4", accent:"#4a9eff", success:"#3dba7e", out:"#ccc",
};

function AgentLog({ active }: { active: boolean }) {
  const [lines, setLines] = useState<{type:LogType; text:string}[]>([]);
  const [running, setRunning] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || running) return;
    setRunning(true);
    setLines([]);
    AGENT_SCRIPTS.forEach(({ delay, type, text }) => {
      setTimeout(() => {
        setLines(prev => [...prev, { type: type as LogType, text }]);
      }, delay);
    });
    // Loop after full script
    setTimeout(() => {
      setRunning(false);
    }, 7000);
  }, [active]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  return (
    <div ref={bodyRef} style={{
      background:"#0e0e0e", borderRadius:6, padding:"12px 14px", height:200,
      overflowY:"auto", fontFamily:"var(--font-mono)", fontSize:"0.62rem",
      lineHeight:1.8, border:"1px solid rgba(255,255,255,0.07)",
      scrollbarWidth:"none",
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: LOG_C[l.type], whiteSpace:"pre-wrap" }}>
          {l.text}
        </div>
      ))}
      {lines.length === 0 && (
        <span style={{ color:"#333" }}>waiting for trigger signals...</span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   RETRAIN TIMELINE
════════════════════════════════════════════════════════ */
const TIMELINE = [
  { day:-45, trigger:"time",  label:"v1.0", color:"#3dba7e" },
  { day:-32, trigger:"drift", label:"v1.1", color:"#c05a5a" },
  { day:-18, trigger:"perf",  label:"v1.2", color:"#b8a84a" },
  { day:-7,  trigger:"drift+llm", label:"v2.0", color:"#c05a5a" },
  { day:0,   trigger:"LIVE",  label:"v2.1", color:"#4a9eff" },
  { day:12,  trigger:"pred",  label:"v3.0?", color:"#555", future:true },
];

function RetrainTimeline() {
  return (
    <div style={{ padding:"14px", background:"rgba(255,255,255,0.02)", borderRadius:6,
      border:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"#555",
        letterSpacing:"0.1em", marginBottom:14 }}>
        MODEL RETRAIN HISTORY  ·  hire_scorer.onnx
      </div>

      {/* Timeline rail */}
      <div style={{ position:"relative", height:52 }}>
        {/* Rail */}
        <div style={{ position:"absolute", left:0, right:0, top:22, height:1,
          background:"rgba(255,255,255,0.1)" }} />

        {/* Future rail (dashed) */}
        <div style={{ position:"absolute", left:"82%", right:0, top:22, height:1,
          background:"repeating-linear-gradient(90deg,rgba(86,156,214,0.4) 0 4px,transparent 4px 8px)" }} />

        {TIMELINE.map((ev, i) => {
          const leftPct = ((ev.day + 48) / 62) * 100;
          return (
            <div key={i} style={{ position:"absolute", left:`${leftPct}%`, top:0,
              transform:"translateX(-50%)", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                color: ev.future ? "#444" : "#777", marginBottom:6, whiteSpace:"nowrap" }}>
                {ev.future ? `+${ev.day}d` : ev.day === 0 ? "now" : `${ev.day}d`}
              </div>
              <div style={{
                width:10, height:10, borderRadius:"50%",
                background: ev.future ? "transparent" : ev.color,
                border: ev.future ? `2px dashed ${ev.color}` : `2px solid ${ev.color}`,
                margin:"0 auto",
                boxShadow: ev.day === 0 ? `0 0 8px ${ev.color}` : "none",
              }} />
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                color: ev.future ? "#444" : "#888", marginTop:5, whiteSpace:"nowrap" }}>
                {ev.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:12, marginTop:8, flexWrap:"wrap" }}>
        {[
          { color:"#c05a5a", label:"data drift" },
          { color:"#b8a84a", label:"perf drop" },
          { color:"#3dba7e", label:"time interval" },
          { color:"#4a9eff", label:"current" },
          { color:"#555",    label:"LLM predicted" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:color }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#555" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function Agentic() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [z, setZ] = useState(-2);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Sigmoid animation
  useEffect(() => {
    if (!active) return;
    const animate = () => {
      tRef.current += 0.018;
      // oscillate z: slow rise → crosses threshold → slow fall → repeats
      const newZ = Math.sin(tRef.current * 0.9) * 3.2;
      setZ(newZ);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  // Dynamic signal values
  const [signals, setSignals] = useState([
    { id:"drift",   label:"Data Drift",      unit:"",  value:0.14, threshold:0.30, higherBad:true,  color:"#c05a5a" },
    { id:"perf",    label:"F1 Degradation",  unit:"",  value:0.91, threshold:0.80, higherBad:false, color:"#b8a84a" },
    { id:"time",    label:"Days Since Train", unit:"d", value:8,    threshold:30,   higherBad:true,  color:"#3dba7e" },
    { id:"llmconf", label:"LLM Confidence",  unit:"",  value:0.88, threshold:0.70, higherBad:false, color:"#7ab0d4" },
  ]);

  // Animate signals slowly drifting toward trigger zone
  const sigTRef = useRef(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      sigTRef.current += 1;
      const t = sigTRef.current;
      setSignals([
        { id:"drift",   label:"Data Drift",      unit:"",  value: 0.14 + 0.58 * Math.abs(Math.sin(t * 0.04)), threshold:0.30, higherBad:true,  color:"#c05a5a" },
        { id:"perf",    label:"F1 Degradation",  unit:"",  value: 0.91 - 0.17 * Math.abs(Math.sin(t * 0.03 + 1)), threshold:0.80, higherBad:false, color:"#b8a84a" },
        { id:"time",    label:"Days Since Train", unit:"d", value: 8 + (t % 30),  threshold:30, higherBad:true,  color:"#3dba7e" },
        { id:"llmconf", label:"LLM Confidence",  unit:"",  value: 0.88 - 0.22 * Math.abs(Math.sin(t * 0.05 + 2)), threshold:0.70, higherBad:false, color:"#7ab0d4" },
      ]);
    }, 400);
    return () => clearInterval(id);
  }, [active]);

  // Intersection observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setActive(true);
        el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  const sigmoidOut = sig(z);
  const triggered = sigmoidOut >= 0.5;

  const getState = (s: typeof signals[0]): SignalState => {
    if (s.higherBad) {
      if (s.value >= s.threshold) return "fired";
      if (s.value >= s.threshold * 0.8) return "warn";
      return "ok";
    } else {
      if (s.value <= s.threshold) return "fired";
      if (s.value <= s.threshold * 1.1) return "warn";
      return "ok";
    }
  };

  const firedCount = signals.filter(s => getState(s) === "fired").length;

  return (
    <section id="agentic" ref={sectionRef} className="section" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="container">

        {/* Section rule */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:52 }} className="reveal">
          <span className="section-index">02.5 //</span>
          <div style={{ flex:1, height:1, background:"var(--border)" }} />
        </div>

        <div className="reveal" style={{ marginBottom:10 }}>
          <span className="label-accent">Agentic Architecture</span>
        </div>
        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom:14 }}>
          Sigmoid-gated{" "}
          <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--accent)" }}>
            trigger systems.
          </span>
        </h2>
        <p className="body-lg reveal reveal-d2" style={{ maxWidth:600, marginBottom:48 }}>
          Production MLOps automation: multi-signal monitoring routes through a sigmoid decision gate —
          LLM orchestrator aggregates drift, performance, time, and confidence signals to decide
          <em> when</em> to retrain, <em>what</em> to retrain, and <em>how</em> to deploy.
        </p>

        {/* ── TOP GRID: sigmoid + signals ── */}
        <div className="reveal reveal-d2 agentic-grid" style={{
          display:"grid", gridTemplateColumns:"360px 1fr", gap:24, marginBottom:24, alignItems:"start",
        }}>

          {/* LEFT: Sigmoid gate */}
          <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:8,
            border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"#888", letterSpacing:"0.08em" }}>
                SIGMOID DECISION GATE
              </span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem",
                color: triggered ? "#3dba7e" : "#4a9eff",
                animation: triggered ? "pulse-text 1s ease-in-out infinite" : "none" }}>
                {triggered ? "▲ TRIGGER" : "— IDLE"}
              </span>
            </div>

            <div style={{ padding:"8px 12px 4px" }}>
              <SigmoidCanvas z={z} threshold={0.5} />
            </div>

            {/* Live readout */}
            <div style={{ padding:"8px 16px 14px", fontFamily:"var(--font-mono)", fontSize:"0.65rem" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:4, padding:"8px 10px" }}>
                  <div style={{ color:"#555", fontSize:"0.5rem", letterSpacing:"0.1em", marginBottom:3 }}>INPUT z</div>
                  <div style={{ color:"#7ab0d4", fontSize:"1rem", fontWeight:700 }}>{z.toFixed(3)}</div>
                </div>
                <div style={{ background: triggered ? "rgba(61,186,126,0.08)" : "rgba(86,156,214,0.08)",
                  borderRadius:4, padding:"8px 10px",
                  border: `1px solid ${triggered ? "rgba(61,186,126,0.25)" : "rgba(86,156,214,0.15)"}` }}>
                  <div style={{ color:"#555", fontSize:"0.5rem", letterSpacing:"0.1em", marginBottom:3 }}>σ(z)</div>
                  <div style={{ color: triggered ? "#3dba7e" : "#4a9eff", fontSize:"1rem", fontWeight:700 }}>
                    {sigmoidOut.toFixed(4)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop:10, padding:"8px 10px",
                background: triggered ? "rgba(61,186,126,0.06)" : "rgba(255,255,255,0.03)",
                borderRadius:4, display:"flex", justifyContent:"space-between", alignItems:"center",
                border: `1px solid ${triggered ? "rgba(61,186,126,0.2)" : "rgba(255,255,255,0.06)"}`,
                transition:"all 0.4s" }}>
                <span style={{ color:"#666", fontSize:"0.55rem" }}>DECISION</span>
                <span style={{ color: triggered ? "#3dba7e" : "#4a9eff", fontWeight:700, letterSpacing:"0.08em",
                  animation: triggered ? "pulse-text 1.2s ease-in-out infinite" : "none" }}>
                  {triggered ? "✓ YES — TRIGGER ACTION" : "— NO ACTION"}
                </span>
              </div>

              <div style={{ marginTop:8, fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#444",
                textAlign:"center" }}>
                P(action) = σ(w₁·drift + w₂·perf + w₃·time + w₄·conf + b)
              </div>
            </div>
          </div>

          {/* RIGHT: 4 signal monitors */}
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"#555",
              letterSpacing:"0.1em", marginBottom:10 }}>
              LIVE SIGNAL MONITORS  ·  polling every 400ms  ·  {firedCount} / 4 signals fired
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {signals.map(s => (
                <TriggerCard key={s.id} sig={s} state={getState(s)} />
              ))}
            </div>

            {/* Aggregation box */}
            <div style={{ marginTop:12, padding:"12px 14px",
              background: firedCount >= 2 ? "rgba(61,186,126,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${firedCount >= 2 ? "rgba(61,186,126,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius:6, transition:"all 0.5s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                fontFamily:"var(--font-mono)" }}>
                <div>
                  <div style={{ fontSize:"0.5rem", color:"#555", letterSpacing:"0.1em", marginBottom:4 }}>
                    LLM ORCHESTRATOR DECISION
                  </div>
                  <div style={{ fontSize:"0.7rem", color: firedCount >= 2 ? "#3dba7e" : "#666" }}>
                    {firedCount === 0 && "All signals nominal — no action required"}
                    {firedCount === 1 && "1 signal fired — monitoring, no action yet"}
                    {firedCount === 2 && "2 signals fired → scheduling retrain evaluation"}
                    {firedCount === 3 && "3 signals fired → RETRAIN NOW — high confidence"}
                    {firedCount >= 4 && "ALL signals fired → CRITICAL — immediate retrain + alert"}
                  </div>
                </div>
                {firedCount >= 2 && (
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"1.1rem", fontWeight:700,
                    color:"#3dba7e", animation:"pulse-text 1.2s ease-in-out infinite" }}>
                    P = {(0.5 + firedCount * 0.12).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: Agent log + timeline ── */}
        <div className="reveal reveal-d3 agentic-bottom" style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:24,
        }}>
          {/* Agent execution log */}
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"#555",
              letterSpacing:"0.1em", marginBottom:8, display:"flex", justifyContent:"space-between",
              alignItems:"center" }}>
              <span>AGENT EXECUTION LOG  ·  real-time orchestration</span>
              <button onClick={() => setActive(v => { setTimeout(() => setActive(true), 50); return false; })}
                style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#444",
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:3, padding:"2px 8px", cursor:"pointer" }}>
                ↺ replay
              </button>
            </div>
            <AgentLog active={active} />
          </div>

          {/* Retrain timeline */}
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"#555",
              letterSpacing:"0.1em", marginBottom:8 }}>
              RETRAIN TIMELINE  ·  automated scheduling
            </div>
            <RetrainTimeline />

            {/* Schedule explanation */}
            <div style={{ marginTop:10, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { label:"Time-based", desc:"Every 30 days\nfallback trigger" },
                { label:"Drift-based", desc:"KL > 0.30\ndata distribution shift" },
                { label:"Perf-based",  desc:"F1 < 0.80\nmodel degradation" },
                { label:"LLM-decided", desc:"Conf < 0.70\nagent prediction" },
              ].map(({ label, desc }) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.02)", borderRadius:5,
                  padding:"8px 10px", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"#888",
                    marginBottom:3 }}>{label}</div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#555",
                    whiteSpace:"pre-line", lineHeight:1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proof strip */}
        <div className="reveal reveal-d4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:1, background:"#111", marginTop:24, borderRadius:4, overflow:"hidden",
          border:"1px solid rgba(255,255,255,0.06)" }}>
          {[
            { v:"σ(z)",    l:"Sigmoid-gated decisions" },
            { v:"4-signal", l:"Multi-trigger monitoring" },
            { v:"LLM+ML",  l:"Hybrid orchestration" },
            { v:"<4h",     l:"End-to-end retrain cycle" },
          ].map(({ v, l }) => (
            <div key={l} style={{ background:"#1a1a1a", padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"1.1rem", color:"#3dba7e",
                lineHeight:1, marginBottom:5, fontWeight:700 }}>{v}</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                color:"#555", letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-text { 0%,100% { opacity:1 } 50% { opacity:0.6 } }
        @media (max-width:860px) {
          .agentic-grid { grid-template-columns: 1fr !important; }
          .agentic-bottom { grid-template-columns: 1fr !important; }
        }
        #agents div::-webkit-scrollbar { display:none; }
      `}</style>
    </section>
  );
}
