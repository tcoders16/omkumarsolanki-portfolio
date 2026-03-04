"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════
   SIGMOID GRAPH — Full formula breakdown with e, threshold, linear
═══════════════════════════════════════════════════════════════════ */

function SigmoidGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [threshold, setThreshold] = useState(0.5);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const animRef = useRef(0);
  const progressRef = useRef(0);

  const sigmoid = useCallback((x: number) => 1 / (1 + Math.exp(-x)), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    if (progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + 0.015);
    }
    const progress = progressRef.current;

    const pad = { top: 30, right: 30, bottom: 50, left: 52 };
    const gw = w - pad.left - pad.right;
    const gh = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (gh * i) / 4;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gw, y); ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const x = pad.left + (gw * i) / 6;
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gh); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gh);
    ctx.lineTo(pad.left + gw, pad.top + gh);
    ctx.stroke();

    // Y labels
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "500 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      ctx.fillText((i / 4).toFixed(1), pad.left - 8, pad.top + gh - (gh * i) / 4 + 4);
    }

    // X labels
    ctx.textAlign = "center";
    for (let i = 0; i <= 6; i++) {
      ctx.fillText((-6 + i * 2).toString(), pad.left + (gw * i) / 6, pad.top + gh + 20);
    }

    // Axis titles
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = "500 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("z = w·x + b  (linear input)", pad.left + gw / 2, pad.top + gh + 40);
    ctx.save();
    ctx.translate(13, pad.top + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("σ(z)  =  probability", 0, 0);
    ctx.restore();

    // Threshold line
    const threshY = pad.top + gh - gh * threshold;
    ctx.strokeStyle = "rgba(61,186,126,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, threshY); ctx.lineTo(pad.left + gw, threshY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(61,186,126,0.8)";
    ctx.font = "600 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`threshold = ${threshold.toFixed(2)}  ← drag me`, pad.left + 8, threshY - 8);

    // Sigmoid curve
    const drawPoints = Math.floor(200 * progress);
    ctx.strokeStyle = "#3dba7e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= drawPoints; i++) {
      const t = i / 200;
      const px = pad.left + t * gw;
      const py = pad.top + gh - sigmoid(-6 + t * 12) * gh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Annotations after full draw
    if (progress > 0.9) {
      const anno = Math.min(1, (progress - 0.9) / 0.1);
      const ipx = pad.left + 0.5 * gw;
      const ipy = pad.top + gh - 0.5 * gh;
      const tanLen = gw * 0.18;

      ctx.strokeStyle = `rgba(139,92,246,${0.65 * anno})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ipx - tanLen, ipy + tanLen * 0.25 * (gh / 1));
      ctx.lineTo(ipx + tanLen, ipy - tanLen * 0.25 * (gh / 1));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(ipx, ipy, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${0.9 * anno})`;
      ctx.fill();

      ctx.fillStyle = `rgba(139,92,246,${0.85 * anno})`;
      ctx.font = "500 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("z=0 → σ=0.5  (inflection)", ipx + 8, ipy - 10);
      ctx.fillText("e⁻⁰ = 1  →  1/(1+1) = 0.5", ipx + 8, ipy + 4);

      if (anno > 0.5) {
        ctx.fillStyle = `rgba(255,255,255,${0.15 * anno})`;
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText("σ → 1  as z → +∞", pad.left + 6, pad.top + 12);
        ctx.fillText("σ → 0  as z → −∞", pad.left + 6, pad.top + gh - 6);
      }
    }

    // Shaded regions (above/below threshold)
    if (progress > 0.8) {
      const regionAlpha = Math.min(0.07, (progress - 0.8) * 0.35);
      ctx.fillStyle = `rgba(61,186,126,${regionAlpha})`;
      ctx.beginPath(); ctx.moveTo(pad.left, threshY);
      for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const py = pad.top + gh - sigmoid(-6 + t * 12) * gh;
        ctx.lineTo(pad.left + t * gw, py < threshY ? Math.max(py, pad.top) : threshY);
      }
      ctx.lineTo(pad.left + gw, threshY); ctx.closePath(); ctx.fill();

      ctx.fillStyle = `rgba(192,90,90,${regionAlpha * 0.8})`;
      ctx.beginPath(); ctx.moveTo(pad.left, threshY);
      for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const py = pad.top + gh - sigmoid(-6 + t * 12) * gh;
        ctx.lineTo(pad.left + t * gw, py > threshY ? Math.min(py, pad.top + gh) : threshY);
      }
      ctx.lineTo(pad.left + gw, threshY); ctx.closePath(); ctx.fill();

      if (progress > 0.95) {
        ctx.font = "600 10px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "rgba(61,186,126,0.45)";
        ctx.textAlign = "right"; ctx.fillText("PASS (in school: high marks)", pad.left + gw - 10, pad.top + 20);
        ctx.fillStyle = "rgba(192,90,90,0.38)";
        ctx.fillText("FAIL (in school: Section C)", pad.left + gw - 10, pad.top + gh - 10);
      }
    }

    // Hover crosshair
    if (hoverX !== null) {
      const rect = canvas.getBoundingClientRect();
      const mx = hoverX - rect.left;
      if (mx >= pad.left && mx <= pad.left + gw) {
        const t = (mx - pad.left) / gw;
        const xVal = -6 + t * 12;
        const yVal = sigmoid(xVal);
        const py = pad.top + gh - yVal * gh;

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mx, pad.top); ctx.lineTo(mx, pad.top + gh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.left, py); ctx.lineTo(pad.left + gw, py); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#3dba7e";
        ctx.beginPath(); ctx.arc(mx, py, 5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "rgba(10,10,10,0.92)";
        ctx.strokeStyle = "rgba(61,186,126,0.3)"; ctx.lineWidth = 1;
        const tx = Math.min(mx + 12, w - 155);
        const ty = Math.max(py - 46, pad.top + 4);
        ctx.beginPath(); ctx.roundRect(tx, ty, 148, 38, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#3dba7e";
        ctx.font = "500 10px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText(`z = ${xVal.toFixed(2)}`, tx + 8, ty + 14);
        ctx.fillText(`σ(z) = ${yVal.toFixed(4)}`, tx + 8, ty + 28);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [threshold, hoverX, sigmoid]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Formula header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--white)", marginBottom: 12 }}>
          The Sigmoid — What They Should Have Taught
        </div>
        {/* Formula breakdown */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Step 1 — Linear regression</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#9cdcfe", background: "rgba(156,220,254,0.06)", padding: "8px 12px", borderRadius: 6, letterSpacing: "0.04em" }}>
              z = w₁x₁ + w₂x₂ + … + b
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>z can be any number — like a test score</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Step 2 — Sigmoid</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#3dba7e", background: "rgba(61,186,126,0.07)", padding: "8px 12px", borderRadius: 6, letterSpacing: "0.04em" }}>
              σ(z) = 1 / (1 + e<sup style={{ fontSize: "0.6rem" }}>−z</sup>)
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>e ≈ 2.71828 — Euler's constant</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Step 3 — Decision</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#c8973a", background: "rgba(200,151,58,0.07)", padding: "8px 12px", borderRadius: 6, letterSpacing: "0.04em" }}>
              if σ(z) ≥ τ → predict 1
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>τ = threshold (the arbitrary pass mark)</div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div style={{ padding: "16px 24px 8px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", letterSpacing: "0.08em" }}>Move threshold:</span>
          <input type="range" min="0.1" max="0.9" step="0.01" value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            style={{ width: 110, accentColor: "#3dba7e", cursor: "pointer" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#3dba7e", minWidth: 36 }}>{threshold.toFixed(2)}</span>
        </div>
        <canvas ref={canvasRef} style={{ width: "100%", height: 240, cursor: "crosshair", display: "block" }}
          onMouseMove={e => setHoverX(e.clientX)} onMouseLeave={() => setHoverX(null)} />
      </div>

      {/* Euler's number breakdown */}
      <div style={{ padding: "14px 24px 20px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="formula-grid">
        {[
          { label: "e ≈ 2.71828", val: "Euler's number", desc: "The base of natural logarithm. Always appears when things grow or decay continuously. Here it controls how fast σ rises." },
          { label: "e⁻ᶻ", val: "exponential decay", desc: "As z → +∞, e⁻ᶻ → 0, so σ → 1. As z → −∞, e⁻ᶻ → ∞, so σ → 0. The curve is S-shaped — always bounded." },
          { label: "τ = threshold", val: "the arbitrary line", desc: "In school: 35%, 40%, 50% pass mark. In ML we optimise τ using real data. School never did. They just chose a number." },
        ].map(({ label, val, desc }) => (
          <div key={label}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#3dba7e", marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>{val}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MARKS COMPARISON — The race nobody asked for
═══════════════════════════════════════════════════════════════════ */
function MarksTimeline() {
  const marks = [
    { grade: "Class 8", score: 63, label: "Section C assigned" },
    { grade: "Class 9", score: 72, label: '"You can do better"' },
    { grade: "Class 10", score: 78, label: '"Still not enough"' },
    { grade: "Class 11", score: 68, label: '"Disappointing"' },
    { grade: "Class 12", score: 71, label: '"Try harder next time"' },
  ];

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 22px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
        The Race — Every year, the same metric
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {marks.map(({ grade, score, label }) => (
          <div key={grade} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", minWidth: 60 }}>{grade}</span>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${score}%`, height: "100%", borderRadius: 3,
                background: score >= 75 ? "rgba(61,186,126,0.6)" : score >= 65 ? "rgba(200,151,58,0.6)" : "rgba(192,90,90,0.6)",
                transition: "width 1.2s ease",
              }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--white)", minWidth: 36 }}>{score}%</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--dim)", fontStyle: "italic" }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "rgba(192,90,90,0.7)", letterSpacing: "0.06em" }}>
        Nobody once asked: "Do you understand the concept?"
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AGENTIC TRIGGER — Sigmoid as yes/no decision in a live AI pipeline
═══════════════════════════════════════════════════════════════════ */
function AgenticTrigger() {
  const [score, setScore] = useState(0.62);
  const [threshold] = useState(0.65);
  const fires = score >= threshold;

  const steps = [
    { label: "z = w·x + b", desc: "Linear score from candidate signals", color: "#9cdcfe" },
    { label: "σ(z) = 1/(1+e⁻ᶻ)", desc: "Squash to probability 0→1", color: "#c8973a" },
    { label: fires ? "σ ≥ τ → FIRE" : "σ < τ → SKIP", desc: fires ? "Agent triggers downstream actions" : "Pipeline stops — no wasted compute", color: fires ? "#3dba7e" : "rgba(192,90,90,0.85)" },
  ];

  const actions = fires
    ? [
        { icon: "📅", text: "schedule_interview(candidate_id)" },
        { icon: "✉️", text: "send_email(recruiter, \"Strong match\")" },
        { icon: "🗂️", text: "update_crm(status = \"interview_scheduled\")" },
        { icon: "🤖", text: "trigger → next agent in pipeline" },
      ]
    : [
        { icon: "🚫", text: "no_action(candidate_id)" },
        { icon: "📝", text: "log(reason = \"below_threshold\")" },
        { icon: "💰", text: "saved: 0 emails, 0 API calls, 0 time" },
      ];

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden", marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px 14px", borderBottom: "1px solid var(--border)",
        background: "rgba(61,186,126,0.03)",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "var(--white)", flex: 1 }}>
          Sigmoid → Agentic Trigger
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#3dba7e",
          letterSpacing: "0.1em", border: "1px solid rgba(61,186,126,0.25)",
          padding: "3px 8px", borderRadius: 3,
        }}>
          LIVE DEMO · Resso.ai interview scorer
        </div>
      </div>

      <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="agentic-grid">
        {/* Left — Pipeline */}
        <div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--dim)",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14,
          }}>
            Pipeline: candidate interview → hire decision
          </div>

          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 6 : 0, alignItems: "flex-start" }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: s.color,
                marginTop: 5, flexShrink: 0,
              }} />
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: s.color,
                  fontWeight: 600, letterSpacing: "0.04em",
                }}>{s.label}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
              {i < 2 && (
                <div style={{
                  width: 1, background: "var(--border)", height: 16,
                  marginLeft: 2, marginTop: 24, flexShrink: 0,
                }} />
              )}
            </div>
          ))}

          {/* Slider */}
          <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 10,
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.54rem", color: "var(--dim)", letterSpacing: "0.06em" }}>
                Interview score (drag to test)
              </span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                color: fires ? "#3dba7e" : "rgba(192,90,90,0.85)", fontWeight: 700,
              }}>
                σ = {score.toFixed(2)}
              </span>
            </div>
            <input
              type="range" min="0.1" max="0.99" step="0.01" value={score}
              onChange={e => setScore(Number(e.target.value))}
              style={{ width: "100%", accentColor: fires ? "#3dba7e" : "#c05a5a", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: "var(--dim)" }}>0.0 — weak candidate</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: "var(--dim)" }}>strong candidate — 1.0</span>
            </div>
            <div style={{
              marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-mono)", fontSize: "0.52rem",
              color: "var(--dim)", letterSpacing: "0.06em",
            }}>
              threshold τ = {threshold.toFixed(2)} &nbsp;
              <span style={{ color: fires ? "#3dba7e" : "rgba(192,90,90,0.85)" }}>
                {score.toFixed(2)} {fires ? "≥" : "<"} {threshold.toFixed(2)} → {fires ? "FIRE" : "SKIP"}
              </span>
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: fires ? "#3dba7e" : "rgba(192,90,90,0.7)",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14,
          }}>
            {fires ? "Agent fires — actions triggered" : "Agent skips — nothing runs"}
          </div>

          <div style={{
            background: fires ? "rgba(61,186,126,0.04)" : "rgba(192,90,90,0.04)",
            border: `1px solid ${fires ? "rgba(61,186,126,0.2)" : "rgba(192,90,90,0.2)"}`,
            borderRadius: 8, padding: "12px 14px",
            transition: "all 0.3s ease",
          }}>
            {actions.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 8, alignItems: "baseline",
                marginBottom: i < actions.length - 1 ? 8 : 0,
              }}>
                <span style={{ fontSize: "0.7rem", flexShrink: 0 }}>{a.icon}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                  color: fires ? "rgba(61,186,126,0.85)" : "rgba(192,90,90,0.7)",
                  letterSpacing: "0.02em", lineHeight: 1.5,
                }}>{a.text}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: "rgba(255,255,255,0.015)", borderRadius: 6, border: "1px solid var(--border)",
            fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)",
            lineHeight: 1.65, letterSpacing: "0.02em",
          }}>
            <span style={{ color: "var(--muted)" }}>This is exactly what I built at Resso.ai.</span> The sigmoid output drives everything — schedule, email, CRM, next agent — or nothing. One number. One threshold. The entire decision.
          </div>
        </div>
      </div>

      <style>{`
        .agentic-grid { }
        @media (max-width: 640px) {
          .agentic-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHAPTER HEADER
═══════════════════════════════════════════════════════════════════ */
function ChapterHeader({ number, title, subtitle, accent }: {
  number: string; title: string; subtitle: string; accent: string;
}) {
  return (
    <div className="reveal" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
      <span style={{
        fontFamily: "var(--font-serif)", fontStyle: "italic",
        fontSize: "clamp(2.5rem, 5vw, 4rem)", color: accent,
        lineHeight: 0.9, opacity: 0.3, flexShrink: 0, minWidth: 48,
      }}>{number}</span>
      <div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "var(--white)",
          letterSpacing: "-0.02em", marginBottom: 4,
        }}>{title}</h3>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.65rem",
          color: accent, letterSpacing: "0.06em", opacity: 0.7,
        }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   IMPACT CARD
═══════════════════════════════════════════════════════════════════ */
function ImpactCard({ tag, headline, plain, metric }: {
  tag: string; headline: string; plain: string; metric: string;
}) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "16px 18px",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.52rem", fontWeight: 600,
        color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase",
        marginBottom: 10, borderBottom: "1px solid var(--border)", paddingBottom: 8,
      }}>{tag}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "0.85rem", color: "var(--white)", marginBottom: 8, lineHeight: 1.4,
      }}>{headline}</div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{plain}</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.58rem",
        color: "#3dba7e", letterSpacing: "0.08em", textTransform: "uppercase",
      }}>{metric}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN STORY
═══════════════════════════════════════════════════════════════════ */
export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const [graphVisible, setGraphVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
          }
        });
      },
      { threshold: 0.04 }
    );
    el.querySelectorAll("[data-block]").forEach(b => obs.observe(b));
    obs.observe(el);

    const graphObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setGraphVisible(true); },
      { threshold: 0.1 }
    );
    const graphEl = el.querySelector("[data-graph]");
    if (graphEl) graphObs.observe(graphEl);
    return () => { obs.disconnect(); graphObs.disconnect(); };
  }, []);

  return (
    <section id="story" ref={sectionRef} className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <style>{`
        .builds-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .now-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 40px; align-items: start; }
        .formula-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 768px) {
          .builds-grid { grid-template-columns: 1fr !important; }
          .impact-grid { grid-template-columns: 1fr !important; }
          .now-grid { grid-template-columns: 1fr !important; }
          .formula-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="container">

        {/* ── SECTION HEADER ── */}
        <div data-block>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }} className="reveal">
            <span className="section-index">03 //</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div className="reveal" style={{ marginBottom: 12 }}>
            <span className="label-accent">The Story Behind The Work</span>
          </div>
          <h2 className="display-lg reveal reveal-d1" style={{ maxWidth: 780, marginBottom: 16 }}>
            They put me in{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#c05a5a" }}>
              Section C.
            </span>{" "}
            The sigmoid proved{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#3dba7e" }}>
              the threshold was wrong all along.
            </span>
          </h2>
          <p className="body-lg reveal reveal-d2" style={{ maxWidth: 620, marginBottom: 20 }}>
            I scored 63%, 72%, 78% and was reminded every year I was failing.
            Nobody told me the pass mark was an arbitrary number someone just decided.
            That number — I now set it for AI systems that make million-dollar hiring decisions.
          </p>
          <div className="reveal reveal-d3" style={{
            display: "inline-flex", gap: 0,
            border: "1px solid var(--border)", borderRadius: 6,
            overflow: "hidden", marginBottom: 72,
          }}>
            {[
              { label: "Non-tech?", desc: "You'll see what problems I solve and how much you save.", color: "#c8973a" },
              { label: "Technical?", desc: "You'll see the architecture, the actual σ formula, and real production metrics.", color: "#3dba7e" },
            ].map(({ label, desc, color }) => (
              <div key={label} style={{ padding: "10px 18px", background: "var(--surface)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color, letterSpacing: "0.08em", marginRight: 8 }}>{label}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PHOTOS ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, height: 280, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ position: "relative" }}>
              <Image src="/images/starbucks/starbucks01.jpeg" alt="Starbucks — Lawline.tech on screen" fill
                style={{ objectFit: "cover", objectPosition: "center center", filter: "brightness(0.74) saturate(0.85)" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em",
              }}>Starbucks, Canada · Cup: "Omkumar" · Screen: Lawline.tech</div>
            </div>
            <div style={{ position: "relative" }}>
              <Image src="/images/secondcup/secondcup01.jpeg" alt="Second Cup café" fill
                style={{ objectFit: "cover", objectPosition: "center center", filter: "brightness(0.7) saturate(0.8)" }} />
            </div>
            <div style={{ position: "relative" }}>
              <Image src="/images/starbucks/starbucks02.jpeg" alt="Starbucks" fill
                style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.7) saturate(0.8)" }} />
            </div>
          </div>
          <p className="reveal" style={{
            fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--dim)",
            marginTop: 8, letterSpacing: "0.08em",
          }}>
            Canada · 2024 · These photos are real. Built AI companies from coffee shops with no office, no funding.
          </p>
        </div>

        {/* ── CHAPTER 01: THE DIVISION ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="01" title="The Division" subtitle="Class 8 — The label that was supposed to stick forever" accent="#c05a5a" />
          <div style={{ paddingLeft: 68, maxWidth: 660 }}>
            <p className="reveal reveal-d1" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 20, fontFamily: "var(--font-body)" }}>
              Our school had a system. Section A — the students who scored the most marks. Section B — average. Section C — the ones they&apos;d already quietly given up on. We weren&apos;t told this. But we felt it. In the tone of voice. In how questions in class were directed at A section students, not us.
            </p>

            <p className="reveal reveal-d1" style={{
              fontSize: "1.15rem", fontWeight: 700, color: "var(--white)",
              lineHeight: 1.6, marginBottom: 20, fontFamily: "var(--font-display)",
              borderLeft: "2px solid rgba(192,90,90,0.5)", paddingLeft: 20,
            }}>
              I was in Section C.
            </p>

            <p className="reveal reveal-d2" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 20, fontFamily: "var(--font-body)" }}>
              And so the game began. Every year, from class 8 to class 12, it was the same ritual. Exams. Results. Public comparison. Teachers reading scores aloud. Students ranked. The race had one rule: marks at the end. Not understanding. Not curiosity. Not depth. Just the number.
            </p>

            <p className="reveal reveal-d2" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 20, fontFamily: "var(--font-body)" }}>
              I scored <span style={{ color: "rgba(192,90,90,0.8)", fontWeight: 600 }}>63%</span>. Then <span style={{ color: "rgba(200,151,58,0.8)", fontWeight: 600 }}>72%</span>. Then <span style={{ color: "rgba(200,151,58,0.8)", fontWeight: 600 }}>78%</span>. Then <span style={{ color: "rgba(192,90,90,0.8)", fontWeight: 600 }}>68%</span>. Teachers shook their heads. Parents worried. I started believing them. I told myself I was a failure. The system was very good at making that happen.
            </p>

            <p className="reveal reveal-d2" style={{
              fontSize: "1.0rem", fontWeight: 600, color: "rgba(192,90,90,0.75)",
              lineHeight: 1.65, marginBottom: 24, fontFamily: "var(--font-display)",
              borderLeft: "2px solid rgba(192,90,90,0.3)", paddingLeft: 20,
            }}>
              That was Grade 8. For the next <span style={{ color: "rgba(192,90,90,1)" }}>8 years</span> — from class 8 through every year until engineering college — I carried that label. I thought the problem was me.
            </p>

            <div className="reveal reveal-d3" style={{ marginBottom: 24 }}>
              <MarksTimeline />
            </div>

            <p className="reveal reveal-d3" style={{
              fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.85,
              fontFamily: "var(--font-body)", fontStyle: "italic",
              borderLeft: "2px solid rgba(255,255,255,0.08)", paddingLeft: 20,
            }}>
              No teacher ever said: &ldquo;You know what, let&apos;s talk about how many students I failed this year.&rdquo;
              They never compared their own performance. They only measured ours.
              They celebrated when their &ldquo;A section&rdquo; students placed — never asking if the C section students had potential they never unlocked.
            </p>
          </div>
        </div>

        {/* ── HERO PHOTO BREAK ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 460 }}>
            <Image src="/images/starbucks/starbucks01.jpeg" alt="Building Lawline.tech at Starbucks" fill
              style={{ objectFit: "cover", objectPosition: "center", filter: "brightness(0.75) saturate(0.9)" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 60%, transparent)",
            }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px", maxWidth: 520 }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#3dba7e",
                letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
              }}>
                Starbucks · Canada · 2024 · Real photo
              </div>
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)", color: "#f0f0f0", lineHeight: 1.45, marginBottom: 18,
              }}>
                Cup says &ldquo;Omkumar.&rdquo;<br />
                Screen shows Lawline.tech.<br />
                <span style={{ color: "#3dba7e" }}>While Section C was on my record.</span>
              </p>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                No office. No funding. No team. Just a laptop, a problem to solve,
                and years of being told I wasn&apos;t good enough — which turned out to be fuel.
              </p>
            </div>
            <div style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(61,186,126,0.3)", padding: "6px 12px", borderRadius: 4,
              fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#3dba7e", letterSpacing: "0.1em",
            }}>
              SECTION C → LIVE SAAS
            </div>
          </div>
        </div>

        {/* ── CHAPTER 02: THE GRIND ── */}
        <div data-block style={{ paddingBottom: 40 }}>
          <ChapterHeader number="02" title="The Grind" subtitle="Canada 2024 — No office. No funding. Just problems worth solving." accent="#c8973a" />
          <div style={{ paddingLeft: 68, maxWidth: 640 }}>
            {[
              "The AI revolution was happening. But I wasn't at a funded startup or a big tech company. I was at Starbucks — serving coffee in the morning, writing Python in the afternoon.",
              "Most people see AI as something only Silicon Valley does. I saw it as a tool. There were real problems in front of me: businesses spending hundreds of dollars an hour on legal review. Companies spending weeks screening 500 candidates and still making bad hires. Labs wasting months on trial-and-error chemistry.",
              "I didn't ask permission. I didn't wait for a job offer or a VC cheque. I just started building.",
            ].map((text, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85,
                marginBottom: i < 2 ? 18 : 0, fontFamily: "var(--font-body)",
              }}>{text}</p>
            ))}
          </div>
        </div>

        {/* ── IMPACT CARDS ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>For non-tech — What problems were actually solved</span>
          </div>
          <div className="reveal impact-grid">
            <ImpactCard tag="Legal AI" headline="Legal review used to take hours and cost hundreds"
              plain="A lawyer charges $300/hr to read contracts. For a small business reviewing 20 documents a month, that's $6,000/month just to understand what you signed. I built an AI that reads the same documents in 3 seconds, flags the risky parts, and costs a fraction."
              metric="60% fewer legal errors · 3s per document · not 3 hours" />
            <ImpactCard tag="Hiring AI" headline="Hiring the wrong person costs 30% of their salary"
              plain="One bad hire in a 50-person company can cost $15,000–$50,000 once you factor in rehiring, training, lost time. I built an AI that scores candidates in real time during the interview — so hiring managers make decisions on data, not gut feel."
              metric="+45% placement rate · AUC 0.97 · <2s scoring" />
            <ImpactCard tag="Chemistry ML" headline="R&D cycles that took 6 months now take 2"
              plain="A chemistry lab testing new materials has to physically make and test hundreds of samples. I built an ML model on just 200 data points that predicts which ingredients work before they even mix them."
              metric="R² = 0.89 · 40% cost reduction · 3× faster iterations" />
            <ImpactCard tag="AI Integration" headline="Your internal tools could talk to each other — they don't"
              plain="Most companies have Slack, a CRM, a database, and five different tools that don't share data. I built a single AI layer using the MCP protocol that connects them all — one command, everything updates."
              metric="1 integration layer · N tools connected · zero vendor lock-in" />
          </div>
        </div>

        {/* ── CHAPTER 03: THE PATTERN ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="03" title="The Pattern" subtitle="Engineering — When I finally understood WHY, everything clicked" accent="#3dba7e" />
          <div style={{ paddingLeft: 68 }}>

            <p className="reveal reveal-d1" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 18, maxWidth: 640, fontFamily: "var(--font-body)" }}>
              For <strong style={{ color: "var(--cream)" }}>8 years</strong> — from Grade 8 all the way to engineering college — I didn&apos;t know why I scored low. I studied. I read. But nothing stuck. And I genuinely believed the problem was me.
            </p>

            <p className="reveal reveal-d1" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 18, maxWidth: 640, fontFamily: "var(--font-body)" }}>
              Then in college, I noticed a pattern in myself — <strong style={{ color: "var(--cream)" }}>I didn&apos;t need more math. I needed a reason to do math.</strong> The moment someone gave me WHY a concept existed, I understood it completely. Not the formula. The problem it solved.
            </p>

            <p className="reveal reveal-d2" style={{
              fontSize: "1.05rem", fontWeight: 700, color: "var(--white)",
              lineHeight: 1.6, marginBottom: 18, maxWidth: 640, fontFamily: "var(--font-display)",
              borderLeft: "2px solid rgba(61,186,126,0.4)", paddingLeft: 20,
            }}>
              Someone explained logistic regression — not &ldquo;here&apos;s the formula&rdquo;
              but &ldquo;here&apos;s the problem it solves&rdquo; — and I got the sigmoid instantly.
              And then I thought: <span style={{ color: "#3dba7e" }}>wait. If the output is a probability with a threshold... that&apos;s a yes/no switch. And a yes/no switch can run code.</span>
            </p>

            <p className="reveal reveal-d2" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 18, maxWidth: 640, fontFamily: "var(--font-body)" }}>
              Linear regression gives you any number — unbounded. Sigmoid wraps it using Euler&apos;s constant <em>e</em>, squashing it to 0–1. The S-curve emerges naturally. Then the threshold: the line that decides PASS or FAIL — FIRE or SKIP. That&apos;s it. That&apos;s the whole machine.
            </p>

            <p className="reveal reveal-d2" style={{
              fontSize: "1.0rem", fontWeight: 600, color: "var(--accent)",
              lineHeight: 1.65, marginBottom: 16, maxWidth: 640, fontFamily: "var(--font-display)",
            }}>
              In school, that threshold was a number someone just decided. In AI, it&apos;s something you prove with data. You can move it. Question it. Optimise it. School never let us do that.
            </p>

            <p className="reveal reveal-d3" style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 28, maxWidth: 640, fontFamily: "var(--font-body)" }}>
              The problem was never me. It was the way they taught — without the &ldquo;why.&rdquo;
              No context. No reason. No <em>what problem does this solve?</em> Just: memorise, reproduce, get marked.
              The second I understood WHY something existed, I couldn&apos;t stop.
              I went from 8 years of feeling useless to staying up all night building things — because now I had a reason.
            </p>

            {/* Agentic Trigger demo */}
            <div className="reveal reveal-d3" style={{ maxWidth: 760, marginBottom: 32 }}>
              <AgenticTrigger />
            </div>

            <div data-graph className="reveal reveal-d3" style={{ maxWidth: 760, marginBottom: 16 }}>
              {graphVisible && <SigmoidGraph />}
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--dim)",
                marginTop: 12, letterSpacing: "0.04em", lineHeight: 1.6,
              }}>
                <strong style={{ color: "var(--muted)" }}>Non-tech:</strong> Drag the threshold — you decide what &ldquo;good enough&rdquo; means. Notice how arbitrary it feels.{" "}
                <strong style={{ color: "var(--muted)" }}>Tech:</strong> This is the actual σ used in Resso&apos;s hire-probability scorer. AUC 0.97 in production.
              </p>
            </div>
          </div>
        </div>

        {/* ── CHAPTER 04: THE TRUTH ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="04" title="The Truth" subtitle="The problem was never ability — it was the metric they chose" accent="#8b5cf6" />
          <div style={{ paddingLeft: 68, maxWidth: 640 }}>
            {[
              "The system was optimised for memorisation. Recite the formula. Get the mark. Move on. Nobody checked if you could actually use what you learned. Nobody measured whether you understood the 'why'.",
              "I now build systems where the metric is: does this model make the right decision when it matters? Does the business save money? Did the wrong hire get screened out? Is the chemistry formula actually better? Those are real metrics. Percentage marks at class 10 was not.",
              "I build things that generate real ROI — not because I memorised formulas, but because I understand the problem deeply enough to know exactly what an AI system needs to solve it.",
            ].map((text, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85,
                marginBottom: i < 2 ? 18 : 0, fontFamily: "var(--font-body)",
              }}>{text}</p>
            ))}
          </div>
        </div>

        {/* ── BUILDS GALLERY ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ marginBottom: 16 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>The receipts — things actually built</span>
          </div>
          <div className="reveal builds-grid">
            {[
              { name: "Resso.ai", role: "Founding Engineer", plain: "AI that scores candidates in real time during live interviews — so hiring managers stop guessing.", tech: "WebRTC · Speaker Diarization · ONNX INT8 · <2s latency" },
              { name: "Vadtal — Vector DB", role: "AI Architect", plain: "Private AI brain for companies that can't send data to the cloud. Runs 100% on your own server.", tech: "GGUF · HNSW · FastAPI · 100% offline · 16GB RAM" },
              { name: "Lawline.tech", role: "Built at Starbucks", plain: "Upload a legal document. AI reads it, flags risky clauses, extracts obligations. 3 seconds, not 3 hours.", tech: "Fine-tuned LLM · Clause classification · Live SaaS" },
              { name: "Corol / NunaFab", role: "ML Engineer", plain: "ML model that predicts chemistry results before running lab tests. 40% fewer wasted experiments.", tech: "XGBoost · SHAP · 200-row sparse dataset · R² = 0.89" },
            ].map((proj, i) => (
              <div key={i} style={{
                borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--surface)", padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "var(--white)" }}>{proj.name}</div>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "#3dba7e",
                    border: "1px solid rgba(61,186,126,0.25)", padding: "2px 7px", borderRadius: 3,
                    letterSpacing: "0.06em", whiteSpace: "nowrap", marginLeft: 8,
                  }}>{proj.role}</span>
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>{proj.plain}</p>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.54rem", color: "var(--dim)",
                  borderTop: "1px solid var(--border)", paddingTop: 8, letterSpacing: "0.04em",
                }}>{proj.tech}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHAPTER 05: NOW ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="05" title="Now" subtitle="Founding Engineer · The threshold was always wrong — I just needed data to prove it" accent="#3dba7e" />
          <div className="now-grid">
            <div style={{ paddingLeft: 68 }}>
              {[
                "Today I'm a Founding Engineer building production AI systems — real-time pipelines, autonomous agents, infrastructure that companies actually depend on.",
                "The difference between me and most AI engineers: I start with the business problem, not the model. What does it cost you today? How much do you save if this works? Then I build the system that gets you there.",
                "To every teacher who read my marks aloud, shook their head, and moved on to the next student —",
              ].map((text, i) => (
                <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                  fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.85,
                  marginBottom: i < 2 ? 18 : 24, fontFamily: "var(--font-body)",
                }}>{text}</p>
              ))}

              {/* THE CLIMAX */}
              <div className="reveal reveal-d3" style={{
                padding: "32px 28px", background: "var(--surface)",
                border: "1px solid rgba(61,186,126,0.18)", borderRadius: 14,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -60, right: -60, width: 280, height: 280,
                  background: "radial-gradient(circle, rgba(61,186,126,0.06), transparent 70%)",
                  pointerEvents: "none",
                }} />

                <p style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 2.8vw, 2rem)", color: "var(--accent)",
                  lineHeight: 1.35, marginBottom: 14, position: "relative",
                }}>
                  &ldquo;What&apos;s your net worth?
                  <br />
                  <span style={{ fontSize: "0.8em", color: "rgba(192,90,90,0.85)" }}>Why are you shut down?&rdquo;</span>
                </p>

                <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 16, position: "relative" }}>
                  You loved measuring us by numbers. You read our scores aloud — 63%, 72%, 78% — and shook your heads.
                  Numbers were everything. Fine. Let&apos;s talk numbers now.
                  What&apos;s yours? The business you built? The impact you had?
                  <strong style={{ color: "var(--cream)" }}> Why the silence?</strong>
                </p>

                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 16, position: "relative" }}>
                  You taught the formula but not the reason. You set the threshold but never questioned it.
                  You measured us — but nobody was measuring you.
                  The metric was wrong from day one. It took me an engineering degree to prove it.
                </p>

                <div style={{
                  paddingTop: 16, borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)", fontSize: "0.56rem",
                  color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase",
                  position: "relative",
                }}>
                  Section C → Founding Engineer · 63% → AUC 0.97 · Pass mark was always arbitrary
                </div>
              </div>
            </div>

            {/* Portrait */}
            <div className="reveal" style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 520, border: "1px solid var(--border)" }}>
              <Image src="/images/omkumar/Omkumar01.jpeg" alt="Omkumar Solanki" fill
                style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.88) saturate(0.9)" }} />
            </div>
          </div>
        </div>

        {/* ── CLOSING ── */}
        <div data-block className="reveal" style={{
          marginTop: 80, paddingTop: 52,
          borderTop: "1px solid var(--border)",
          textAlign: "center", maxWidth: 620, marginLeft: "auto", marginRight: "auto",
        }}>
          <p style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)", color: "var(--cream)", lineHeight: 1.6, marginBottom: 22,
          }}>
            The system didn&apos;t fail me. The metric did.
            I&apos;m not here to impress the system —
            I&apos;m here to build what it couldn&apos;t imagine.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 32 }}>
            If you&apos;re a <strong style={{ color: "var(--cream)" }}>business owner</strong> — I&apos;ll show you exactly where AI saves you money and how fast.
            If you&apos;re <strong style={{ color: "var(--cream)" }}>technical</strong> — let&apos;s talk architecture, latency, and real production trade-offs.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap",
            fontFamily: "var(--font-mono)", fontSize: "0.58rem",
            color: "var(--dim)", letterSpacing: "0.08em",
          }}>
            <span>SECTION C → FOUNDING ENGINEER</span>
            <span style={{ color: "var(--accent)" }}>·</span>
            <span>63% → AUC 0.97</span>
            <span style={{ color: "var(--accent)" }}>·</span>
            <span>STARBUCKS → RESSO.AI</span>
            <span style={{ color: "var(--accent)" }}>·</span>
            <span>THE THRESHOLD WAS WRONG</span>
          </div>
        </div>

      </div>
    </section>
  );
}
