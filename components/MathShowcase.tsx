"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   1. GRADIENT DESCENT — Interactive loss landscape
═══════════════════════════════════════════════════════════════════ */
function GradientDescent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [running, setRunning] = useState(false);
  const stateRef  = useRef({ x: -2.2, vx: 0, step: 0, done: false });

  const loss  = (x: number) => 0.3 * x ** 4 - 2 * x ** 2 + 0.5 * x + 2.8;
  const dloss = (x: number) => 1.2 * x ** 3 - 4 * x + 0.5;

  const reset = useCallback(() => {
    stateRef.current = { x: -2.2, vx: 0, step: 0, done: false };
    setRunning(false);
  }, []);
  const run = useCallback(() => {
    if (stateRef.current.done) reset();
    setRunning(true);
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    const PAD = { t: 20, r: 20, b: 36, l: 44 };
    const LR = 0.06;
    const xMin = -2.8, xMax = 2.8, yMin = -0.5, yMax = 5.5;
    function toC(x: number, y: number) {
      const gw = W - PAD.l - PAD.r, gh = H - PAD.t - PAD.b;
      return { cx: PAD.l + ((x - xMin) / (xMax - xMin)) * gw, cy: PAD.t + (1 - (y - yMin) / (yMax - yMin)) * gh };
    }
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const gw = W - PAD.l - PAD.r, gh = H - PAD.t - PAD.b;
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) { const y = PAD.t + gh * i / 5; ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + gw, y); ctx.stroke(); }
      for (let i = 0; i <= 6; i++) { const x = PAD.l + gw * i / 6; ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + gh); ctx.stroke(); }
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "500 9px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText("θ (parameter)", PAD.l + gw / 2, PAD.t + gh + 28);
      ctx.save(); ctx.translate(12, PAD.t + gh / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("L(θ)", 0, 0); ctx.restore();
      ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1.5;
      for (let i = 0; i <= 300; i++) { const x = xMin + i / 300 * (xMax - xMin); const p = toC(x, loss(x)); if (i === 0) ctx.moveTo(p.cx, p.cy); else ctx.lineTo(p.cx, p.cy); }
      ctx.stroke();
      const minP = toC(1.28, loss(1.28));
      ctx.strokeStyle = "rgba(57,217,180,0.2)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(minP.cx, PAD.t); ctx.lineTo(minP.cx, minP.cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(57,217,180,0.5)"; ctx.font = "500 8px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText("global min", minP.cx, PAD.t + 12);
      const s = stateRef.current;
      const ball = toC(s.x, loss(s.x));
      ctx.beginPath(); ctx.arc(ball.cx, ball.cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#39d9b4"; ctx.shadowColor = "rgba(57,217,180,0.6)"; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
      const grad = dloss(s.x);
      const dir = grad > 0 ? -1 : 1;
      ctx.strokeStyle = "rgba(245,158,11,0.7)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ball.cx, ball.cy); ctx.lineTo(ball.cx + dir * Math.min(Math.abs(grad) * 14, 40), ball.cy); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "500 9px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText(`step ${s.step}  L=${loss(s.x).toFixed(3)}  ∇=${grad.toFixed(3)}`, PAD.l, PAD.t + gh + 14);
      if (running && !s.done) { s.x -= LR * dloss(s.x); s.step += 1; if (s.step > 120 || Math.abs(dloss(s.x)) < 0.001) s.done = true; }
      rafRef.current = requestAnimationFrame(draw);
    }
    resize(); draw();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [running]);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Gradient Descent</div>
          <div className="math-formula">θ ← θ − α · ∇L(θ)</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={run} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", padding: "5px 12px", border: "1px solid var(--accent-ring)", borderRadius: 2, background: running ? "var(--accent-dim)" : "transparent", color: "var(--accent)", cursor: "pointer", textTransform: "uppercase" }}>{running ? "Running…" : "Run"}</button>
          <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", padding: "5px 12px", border: "1px solid var(--border)", borderRadius: 2, background: "transparent", color: "var(--muted)", cursor: "pointer", textTransform: "uppercase" }}>Reset</button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 190, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.04em" }}>α = 0.06 · Orange arrow = gradient direction · Ball follows −∇L</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   2. SELF-ATTENTION MAP
═══════════════════════════════════════════════════════════════════ */
const TOKENS = ["I", "build", "AI", "systems", "that", "ship"];
const WEIGHTS = [
  [0.55, 0.18, 0.12, 0.06, 0.05, 0.04],
  [0.12, 0.48, 0.20, 0.10, 0.06, 0.04],
  [0.08, 0.14, 0.52, 0.14, 0.07, 0.05],
  [0.05, 0.09, 0.18, 0.45, 0.14, 0.09],
  [0.04, 0.06, 0.09, 0.15, 0.50, 0.16],
  [0.03, 0.05, 0.08, 0.10, 0.18, 0.56],
];
function AttentionMap() {
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const N = TOKENS.length;
  const cellSize = `${100 / N}%`;
  const toColor = (w: number, hover: boolean) => {
    const a = hover ? Math.min(w * 2, 0.95) : w;
    return w > 0.4 ? `rgba(57,217,180,${a * 0.9})` : w > 0.15 ? `rgba(57,217,180,${a * 0.7})` : `rgba(57,217,180,${a * 0.4})`;
  };
  const [hRow, hCol] = hovered ?? [-1, -1];
  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Self-Attention</div>
        <div className="math-formula">Attn(Q,K,V) = softmax(QKᵀ/√dₖ)·V</div>
      </div>
      <div style={{ display: "flex", paddingLeft: 48, marginBottom: 2 }}>
        {TOKENS.map(tok => <div key={tok} style={{ width: cellSize, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--muted)" }}>{tok}</div>)}
      </div>
      {WEIGHTS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <div style={{ width: 48, fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--muted)", flexShrink: 0 }}>{TOKENS[ri]}</div>
          {row.map((w, ci) => {
            const isHover = ri === hRow && ci === hCol;
            const dimmed  = (hRow !== -1 || hCol !== -1) && !isHover;
            return (
              <div key={ci} onMouseEnter={() => setHovered([ri, ci])} onMouseLeave={() => setHovered(null)}
                style={{ width: cellSize, aspectRatio: "1", background: toColor(w, isHover), border: isHover ? "1px solid var(--accent)" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "crosshair", transition: "all 0.15s", opacity: dimmed ? 0.3 : 1, borderRadius: 1 }}>
                {isHover && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: w > 0.3 ? "#000" : "var(--accent)", fontWeight: 600 }}>{w.toFixed(2)}</span>}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", letterSpacing: "0.04em" }}>
        {hovered ? `"${TOKENS[hovered[0]]}" → "${TOKENS[hovered[1]]}"  weight = ${WEIGHTS[hovered[0]][hovered[1]].toFixed(3)}` : "Hover cells to inspect attention weights between token pairs."}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   3. FORWARD PASS — Animated neural net
═══════════════════════════════════════════════════════════════════ */
function ForwardPass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [equation, setEquation] = useState("a¹ = ReLU(W¹x + b¹)");
  const eqRef = useRef(equation);
  eqRef.current = equation;
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    const ARCH = [3, 5, 5, 2];
    const COLORS = ["#39d9b4", "#8b5cf6", "#8b5cf6", "#f59e0b"];
    const LABELS = ["Input x", "Hidden h¹", "Hidden h²", "Output ŷ"];
    type AnimNode = { x: number; y: number; active: number };
    let nodes: AnimNode[][] = [];
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
      const PAD_X = 28;
      nodes = ARCH.map((count, li) => {
        const x = PAD_X + li / (ARCH.length - 1) * (W - 2 * PAD_X);
        const sp = Math.min((H - 40) / (count + 1), 34);
        return Array.from({ length: count }, (_, ni) => ({ x, y: H / 2 - (count - 1) * sp / 2 + ni * sp, active: 0 }));
      });
    }
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H); t += 0.04;
      const waveLayer = Math.floor(t % (ARCH.length + 2));
      for (let li = 0; li < ARCH.length; li++) for (const n of nodes[li]) { n.active += ((li < waveLayer ? 1 : 0) - n.active) * 0.12; }
      if (waveLayer === 1 && eqRef.current !== "a¹ = ReLU(W¹x + b¹)") setEquation("a¹ = ReLU(W¹x + b¹)");
      if (waveLayer === 2 && eqRef.current !== "a² = ReLU(W²a¹ + b²)") setEquation("a² = ReLU(W²a¹ + b²)");
      if (waveLayer === 3 && eqRef.current !== "ŷ = softmax(W³a² + b³)") setEquation("ŷ = softmax(W³a² + b³)");
      for (let li = 0; li < ARCH.length - 1; li++) for (const a of nodes[li]) for (const b of nodes[li + 1]) {
        const act = Math.min(a.active, b.active);
        ctx.strokeStyle = `rgba(${act > 0.5 ? "57,217,180" : "255,255,255"},${0.04 + act * 0.12})`; ctx.lineWidth = 0.8 + act * 0.6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (let li = 0; li < ARCH.length; li++) {
        const col = COLORS[li];
        for (const n of nodes[li]) {
          const r = 5 + n.active * 3;
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col === "#39d9b4" ? "57,217,180" : col === "#8b5cf6" ? "139,92,246" : "245,158,11"},${0.2 + n.active * 0.7})`;
          ctx.fill();
          if (n.active > 0.5) { ctx.shadowColor = col; ctx.shadowBlur = 10 * n.active; ctx.fill(); ctx.shadowBlur = 0; }
        }
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "500 8px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
        ctx.fillText(LABELS[li], nodes[li][0].x, 10);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    resize(); draw();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Deep Learning Forward Pass</div>
        <div className="math-formula" style={{ minHeight: "1.2em", transition: "all 0.3s" }}>{equation}</div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 155, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.04em" }}>Live forward pass — activation wave propagates layer by layer.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   4. ML PIPELINE — Interactive stages
═══════════════════════════════════════════════════════════════════ */
const PIPELINE_STAGES = [
  { id: "data",   label: "Data",   formula: "Xᵣₐw→X̃",    color: "#39d9b4", math: "X_train, X_val, X_test = split(X̃, 0.7/0.15/0.15)", ops: ["Imputation", "Normalise", "Feature Engineering", "Train/Val/Test split"] },
  { id: "model",  label: "Model",  formula: "ŷ=f(X;θ)",  color: "#8b5cf6", math: "θ* = argmin_θ E[(y − f(X;θ))²]",                    ops: ["Architecture search", "Weight init", "Activation fn", "Dropout / BN"] },
  { id: "train",  label: "Train",  formula: "θ←θ−α∇L",   color: "#f59e0b", math: "L = (1/N)∑ℓ(yᵢ,f(xᵢ;θ)) + λ||θ||²",              ops: ["Mini-batch SGD", "LR scheduling", "Early stopping", "Grad clipping"] },
  { id: "eval",   label: "Eval",   formula: "F₁,AUC,R²", color: "#39d9b4", math: "P(y=1|x) = σ(wᵀx+b)",                               ops: ["Confusion matrix", "ROC/AUC", "SHAP", "Error analysis"] },
  { id: "deploy", label: "Deploy", formula: "p99<2s",     color: "#8b5cf6", math: "latency_p99 ≤ SLA ∧ drift_score < τ",              ops: ["ONNX export", "Containerise", "A/B shadow", "Drift detection"] },
];
function MLPipeline() {
  const [active, setActive] = useState<string | null>(null);
  const s = PIPELINE_STAGES.find(x => x.id === active);
  return (
    <div className="math-card" style={{ padding: "24px 24px 20px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Classic ML Pipeline</div>
        <div className="math-formula">Data → f(X;θ*) → ŷ → prod</div>
      </div>
      <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.id} onClick={() => setActive(active === stage.id ? null : stage.id)}
            style={{ flex: 1, minWidth: 68, padding: "14px 10px", cursor: "pointer", borderTop: `2px solid ${active === stage.id ? stage.color : `${stage.color}30`}`, background: active === stage.id ? `${stage.color}08` : "transparent", borderRight: i < PIPELINE_STAGES.length - 1 ? "1px solid var(--border)" : "none", transition: "all 0.2s", position: "relative" }}>
            {i < PIPELINE_STAGES.length - 1 && <span style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", color: "var(--dim)", fontSize: "0.7rem", zIndex: 1 }}>›</span>}
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: active === stage.id ? stage.color : "var(--cream)", marginBottom: 4 }}>{stage.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: active === stage.id ? stage.color : "var(--muted)", lineHeight: 1.4 }}>{stage.formula}</div>
          </div>
        ))}
      </div>
      {s && (
        <div style={{ marginTop: 14, padding: "16px 18px", background: `${s.color}06`, border: `1px solid ${s.color}20`, borderRadius: 2 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: s.color, marginBottom: 10 }}>{s.math}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {s.ops.map(op => <span key={op} style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "3px 9px", border: `1px solid ${s.color}30`, borderRadius: 2, color: "var(--muted)" }}>{op}</span>)}
          </div>
        </div>
      )}
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 12, lineHeight: 1.6 }}>Click a stage for the math + operations behind it.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   5. KNN CLASSIFIER — Interactive nearest neighbours
═══════════════════════════════════════════════════════════════════ */
function KNNViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [k, setK] = useState(5);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);

  const COLORS = ["#39d9b4", "#8b5cf6", "#f59e0b"];
  const pointsRef = useRef(
    Array.from({ length: 55 }, (_, i) => {
      const cls = i % 3;
      const cx  = [0.25, 0.65, 0.45][cls];
      const cy  = [0.35, 0.30, 0.70][cls];
      return { x: cx + (Math.random() - 0.5) * 0.35, y: cy + (Math.random() - 0.5) * 0.35, cls };
    })
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    };
    const onLeave = () => { mouseRef.current = null; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    function draw() {
      const W = canvas!.clientWidth, H = canvas!.clientHeight;
      canvas!.width = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);

      const pts = pointsRef.current;
      const mx  = mouseRef.current;

      if (mx) {
        const dists = pts.map((p, i) => ({ i, d: Math.hypot(p.x - mx.x, p.y - mx.y) })).sort((a, b) => a.d - b.d);
        const kNearest = dists.slice(0, k);
        const votes = [0, 0, 0];
        kNearest.forEach(nn => votes[pts[nn.i].cls]++);
        const pred = votes.indexOf(Math.max(...votes));

        // Background prediction region
        ctx!.fillStyle = `${COLORS[pred]}10`;
        ctx!.fillRect(0, 0, W, H);

        kNearest.forEach(nn => {
          const p = pts[nn.i];
          ctx!.strokeStyle = `${COLORS[p.cls]}55`;
          ctx!.lineWidth = 1;
          ctx!.setLineDash([3, 3]);
          ctx!.beginPath();
          ctx!.moveTo(mx.x * W, mx.y * H);
          ctx!.lineTo(p.x * W, p.y * H);
          ctx!.stroke();
          ctx!.setLineDash([]);
        });

        ctx!.beginPath();
        ctx!.arc(mx.x * W, mx.y * H, 8, 0, Math.PI * 2);
        ctx!.fillStyle = COLORS[pred];
        ctx!.fill();
        ctx!.strokeStyle = "white";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Prediction label
        const labels = ["Class A", "Class B", "Class C"];
        ctx!.fillStyle = COLORS[pred];
        ctx!.font = "bold 10px 'JetBrains Mono', monospace";
        ctx!.textAlign = "left";
        const tx = Math.min(mx.x * W + 14, W - 70);
        const ty = mx.y * H - 8;
        ctx!.fillText(`→ ${labels[pred]}`, tx, ty);
      }

      pts.forEach(p => {
        ctx!.beginPath();
        ctx!.arc(p.x * W, p.y * H, 4.5, 0, Math.PI * 2);
        ctx!.fillStyle = `${COLORS[p.cls]}cc`;
        ctx!.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(rafRef.current); canvas.removeEventListener("mousemove", onMove); canvas.removeEventListener("mouseleave", onLeave); };
  }, [k]);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>K-Nearest Neighbours</div>
          <div className="math-formula">{"ŷ = mode({y : x∈kNN(xₜₑₛₜ)})   d = √Σ(xᵢ−yᵢ)²"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>k = {k}</span>
          <input type="range" min="1" max="11" step="2" value={k} onChange={e => setK(Number(e.target.value))} style={{ width: 90, accentColor: "#39d9b4", cursor: "pointer" }} />
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, display: "block", cursor: "crosshair" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.04em" }}>Hover to classify a new point. Lines = k nearest neighbours. Adjust k to see bias-variance tradeoff.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   6. K-MEANS CLUSTERING — Animated EM loop
═══════════════════════════════════════════════════════════════════ */
function KMeansViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [playing, setPlaying] = useState(true);

  const COLORS = ["#39d9b4", "#8b5cf6", "#f59e0b"];
  const stateRef = useRef({
    points: Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), cls: 0 })),
    centroids: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.5, y: 0.75 }],
    step: 0,
    converged: false,
  });

  const playRef = useRef(playing);
  playRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    function assign() {
      const s = stateRef.current;
      s.points.forEach(p => {
        const dists = s.centroids.map((c, i) => ({ i, d: Math.hypot(p.x - c.x, p.y - c.y) }));
        p.cls = dists.sort((a, b) => a.d - b.d)[0].i;
      });
    }

    function moveCentroids() {
      const s = stateRef.current;
      const prev = s.centroids.map(c => ({ ...c }));
      s.centroids.forEach((c, i) => {
        const cluster = s.points.filter(p => p.cls === i);
        if (cluster.length === 0) return;
        c.x = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
        c.y = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
      });
      const moved = s.centroids.some((c, i) => Math.hypot(c.x - prev[i].x, c.y - prev[i].y) > 0.001);
      if (!moved) { s.converged = true; }
      s.step++;
    }

    function draw() {
      const W = canvas!.clientWidth, H = canvas!.clientHeight;
      canvas!.width = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);

      const s = stateRef.current;
      frameCount++;

      if (playRef.current && !s.converged && frameCount % 40 === 0) {
        assign();
        moveCentroids();
        if (s.step > 50) { s.converged = false; s.step = 0; s.centroids = [{ x: Math.random(), y: Math.random() }, { x: Math.random(), y: Math.random() }, { x: Math.random(), y: Math.random() }]; assign(); }
      }

      // Points
      s.points.forEach(p => {
        ctx!.beginPath();
        ctx!.arc(p.x * W, p.y * H, 4, 0, Math.PI * 2);
        ctx!.fillStyle = `${COLORS[p.cls]}88`;
        ctx!.fill();
      });

      // Centroids
      s.centroids.forEach((c, i) => {
        const cx2 = c.x * W, cy2 = c.y * H;
        ctx!.beginPath();
        ctx!.arc(cx2, cy2, 9, 0, Math.PI * 2);
        ctx!.strokeStyle = COLORS[i];
        ctx!.lineWidth = 2;
        ctx!.stroke();
        ctx!.fillStyle = `${COLORS[i]}22`;
        ctx!.fill();
        // Cross marker
        ctx!.strokeStyle = COLORS[i];
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(cx2 - 5, cy2); ctx!.lineTo(cx2 + 5, cy2);
        ctx!.moveTo(cx2, cy2 - 5); ctx!.lineTo(cx2, cy2 + 5);
        ctx!.stroke();
      });

      // Step label
      ctx!.fillStyle = "rgba(255,255,255,0.3)";
      ctx!.font = "500 9px 'JetBrains Mono', monospace";
      ctx!.textAlign = "left";
      ctx!.fillText(`iter ${s.step}${s.converged ? " — converged" : ""}`, 8, 14);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>K-Means Clustering</div>
          <div className="math-formula">{"J = Σᵢ Σ_{x∈Cᵢ} ||x − μᵢ||²"}</div>
        </div>
        <button onClick={() => setPlaying(p => !p)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", padding: "5px 12px", border: "1px solid var(--accent-ring)", borderRadius: 2, background: playing ? "var(--accent-dim)" : "transparent", color: "var(--accent)", cursor: "pointer", textTransform: "uppercase" }}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>EM loop: assign points → move centroids → repeat until convergence. + marks = centroids.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   7. CONFUSION MATRIX — Interactive classifier eval
═══════════════════════════════════════════════════════════════════ */
function ConfusionMatrix() {
  const [values, setValues] = useState({ tp: 87, fp: 12, fn: 9, tn: 142 });
  const { tp, fp, fn, tn } = values;
  const precision = tp / (tp + fp);
  const recall    = tp / (tp + fn);
  const f1        = 2 * (precision * recall) / (precision + recall);
  const accuracy  = (tp + tn) / (tp + fp + fn + tn);
  const cells = [
    { label: "TP", value: tp, color: "#39d9b4", desc: "True Positive",  key: "tp" },
    { label: "FP", value: fp, color: "#f59e0b", desc: "False Positive", key: "fp" },
    { label: "FN", value: fn, color: "#f59e0b", desc: "False Negative", key: "fn" },
    { label: "TN", value: tn, color: "#39d9b4", desc: "True Negative",  key: "tn" },
  ];
  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Confusion Matrix</div>
        <div className="math-formula">Precision = TP/(TP+FP) · Recall = TP/(TP+FN)</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 14 }}>
        {cells.map(c => (
          <div key={c.key} style={{ padding: "16px 14px", background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 2, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--muted)", marginTop: 4 }}>{c.desc}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: c.color, opacity: 0.7 }}>{c.label}</div>
            <input type="range" min="1" max="200" value={c.value}
              onChange={e => setValues(v => ({ ...v, [c.key]: Number(e.target.value) }))}
              style={{ width: "90%", accentColor: c.color, marginTop: 8, cursor: "pointer" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {[["Precision", precision], ["Recall", recall], ["F1", f1], ["Accuracy", accuracy]].map(([label, val]) => (
          <div key={label as string} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "var(--dim)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: (val as number) > 0.8 ? "#39d9b4" : "var(--cream)" }}>{(val as number).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   8. ROC CURVE — AUC visualization
═══════════════════════════════════════════════════════════════════ */
function ROCCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [threshold, setThreshold] = useState(0.5);
  const threshRef = useRef(threshold);
  threshRef.current = threshold;

  // Parameterised ROC curve points
  const rocPoints = Array.from({ length: 101 }, (_, i) => {
    const t = i / 100;
    const fpr = t;
    const tpr = Math.min(1, t === 0 ? 0 : 1 - Math.pow(1 - t, 0.3));
    return { fpr, tpr };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    function draw() {
      const W = canvas!.clientWidth, H = canvas!.clientHeight;
      canvas!.width = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      const PAD = { t: 20, r: 20, b: 44, l: 44 };
      const gw = W - PAD.l - PAD.r, gh = H - PAD.t - PAD.b;

      const toC = (fpr: number, tpr: number) => ({ cx: PAD.l + fpr * gw, cy: PAD.t + (1 - tpr) * gh });

      // Grid
      ctx!.strokeStyle = "rgba(255,255,255,0.04)"; ctx!.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = PAD.t + gh * i / 4; ctx!.beginPath(); ctx!.moveTo(PAD.l, y); ctx!.lineTo(PAD.l + gw, y); ctx!.stroke();
        const x = PAD.l + gw * i / 4; ctx!.beginPath(); ctx!.moveTo(x, PAD.t); ctx!.lineTo(x, PAD.t + gh); ctx!.stroke();
      }
      // Diagonal (random classifier)
      ctx!.strokeStyle = "rgba(255,255,255,0.1)"; ctx!.setLineDash([4, 4]);
      ctx!.beginPath(); ctx!.moveTo(PAD.l, PAD.t + gh); ctx!.lineTo(PAD.l + gw, PAD.t); ctx!.stroke(); ctx!.setLineDash([]);

      // AUC fill
      ctx!.fillStyle = "rgba(57,217,180,0.05)";
      ctx!.beginPath();
      ctx!.moveTo(PAD.l, PAD.t + gh);
      rocPoints.forEach(p => { const c = toC(p.fpr, p.tpr); ctx!.lineTo(c.cx, c.cy); });
      ctx!.lineTo(PAD.l + gw, PAD.t + gh);
      ctx!.closePath(); ctx!.fill();

      // ROC curve
      ctx!.strokeStyle = "#39d9b4"; ctx!.lineWidth = 2;
      ctx!.beginPath();
      rocPoints.forEach((p, i) => { const c = toC(p.fpr, p.tpr); if (i === 0) ctx!.moveTo(c.cx, c.cy); else ctx!.lineTo(c.cx, c.cy); });
      ctx!.stroke();

      // Threshold point
      const th = threshRef.current;
      const fpr = th; const tpr = Math.min(1, 1 - Math.pow(1 - th, 0.3));
      const tp  = toC(fpr, tpr);
      ctx!.beginPath(); ctx!.arc(tp.cx, tp.cy, 6, 0, Math.PI * 2);
      ctx!.fillStyle = "#f59e0b"; ctx!.shadowColor = "rgba(245,158,11,0.5)"; ctx!.shadowBlur = 10; ctx!.fill(); ctx!.shadowBlur = 0;

      // Labels
      ctx!.fillStyle = "rgba(255,255,255,0.25)"; ctx!.font = "500 9px 'JetBrains Mono', monospace"; ctx!.textAlign = "center";
      ctx!.fillText("FPR", PAD.l + gw / 2, PAD.t + gh + 34);
      ctx!.save(); ctx!.translate(12, PAD.t + gh / 2); ctx!.rotate(-Math.PI / 2); ctx!.fillText("TPR", 0, 0); ctx!.restore();
      ctx!.fillStyle = "rgba(57,217,180,0.7)"; ctx!.textAlign = "right";
      ctx!.fillText("AUC = 0.89", PAD.l + gw - 4, PAD.t + 18);
      ctx!.fillStyle = "rgba(245,158,11,0.7)"; ctx!.textAlign = "left";
      ctx!.fillText(`threshold=${th.toFixed(2)}`, tp.cx + 10, tp.cy - 4);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>ROC Curve / AUC</div>
          <div className="math-formula">AUC = ∫₀¹ TPR(FPR) dFPR</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.08em" }}>threshold</span>
          <input type="range" min="0" max="1" step="0.01" value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: 100, accentColor: "#f59e0b", cursor: "pointer" }} />
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>Drag threshold to move the operating point. AUC = 0.89 (random = 0.5, perfect = 1.0).</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   9. RAG SYSTEM FLOW — Animated pipeline
═══════════════════════════════════════════════════════════════════ */
function RAGFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActiveStep(s => (s + 1) % 5), 1400);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const steps = [
    { label: "Query",       formula: "q → E(q)",                 color: "#f59e0b", desc: "User question gets embedded into vector space" },
    { label: "Embed",       formula: "E(q) ∈ ℝᵈ",               color: "#8b5cf6", desc: "Dense vector representation (d=1536 dims)" },
    { label: "HNSW Search", formula: "top-k cosine(E(q), Eᵢ)",   color: "#39d9b4", desc: "Approximate nearest neighbour search over corpus" },
    { label: "Context",     formula: "ctx = concat(doc₁…docₖ)",  color: "#39d9b4", desc: "Top-k documents injected into prompt" },
    { label: "Generate",    formula: "LLM(system+ctx+q) → ŷ",    color: "#f59e0b", desc: "LLM generates grounded, cited answer" },
  ];

  return (
    <div className="math-card" style={{ padding: "24px 24px 20px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>RAG System Architecture</div>
        <div className="math-formula">R(q) = top-k(cosine(E(q),Eᵢ)) → LLM(ctx+q)</div>
      </div>

      {/* Pipeline flow */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", paddingBottom: 8 }}>
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div
              onClick={() => setActiveStep(i)}
              style={{
                padding: "10px 10px",
                border: `1px solid ${i === activeStep ? step.color : `${step.color}25`}`,
                background: i === activeStep ? `${step.color}10` : "transparent",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.7rem", color: i === activeStep ? step.color : "var(--cream)", marginBottom: 4 }}>{step.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: i === activeStep ? step.color : "var(--muted)", opacity: 0.8 }}>{step.formula}</div>
            </div>
            {i < steps.length - 1 && (
              <span style={{ color: i < activeStep ? steps[i + 1].color : "var(--dim)", fontSize: "1rem", flexShrink: 0, transition: "color 0.3s" }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Active step detail */}
      <div style={{ marginTop: 12, padding: "12px 14px", background: `${steps[activeStep].color}08`, border: `1px solid ${steps[activeStep].color}20`, borderRadius: 2 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: steps[activeStep].color, marginBottom: 4 }}>{steps[activeStep].formula}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)" }}>{steps[activeStep].desc}</div>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>Click any stage · RAG = Retrieval-Augmented Generation — LLM grounded in your private data.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   10. AGENTIC PIPELINE — LLM + context memory + tools
═══════════════════════════════════════════════════════════════════ */
function AgenticPipeline() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: "user",    label: "User Input",        formula: "t=0: query q₀",                   color: "#f59e0b", x: "0%",   desc: "User sends a natural language query to the agent" },
    { id: "ctx",     label: "Context Memory",    formula: "M(t) = [h₁,h₂,…,hₜ]",            color: "#8b5cf6", x: "20%",  desc: "Conversation history + retrieved memory. Bounded by context window (e.g. 128K tokens)" },
    { id: "llm",     label: "LLM Reasoning",     formula: "π(aₜ|qₜ, M(t), tools)",          color: "#39d9b4", x: "42%",  desc: "LLM reads query + memory + tool schemas. Decides: answer directly OR call a tool" },
    { id: "tools",   label: "Tool Dispatch",      formula: "aₜ = tool_call(name, args)",      color: "#f59e0b", x: "62%",  desc: "MCP routes tool call to the right API (search, DB, code exec, web). Structured result returned." },
    { id: "reflect", label: "Reflection",         formula: "oₜ = tool_result → M(t+1)",       color: "#8b5cf6", x: "80%",  desc: "Tool output injected back into context. LLM re-reasons. Loop until task complete." },
    { id: "resp",    label: "Response",           formula: "ŷ = LLM(q,M,observations)",      color: "#39d9b4", x: "100%", desc: "Final grounded response returned to user. Context updated for next turn." },
  ];

  const active = nodes.find(n => n.id === activeNode);

  return (
    <div className="math-card" style={{ padding: "24px 24px 20px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Agentic AI Pipeline</div>
        <div className="math-formula">Agent(t) = LLM(qₜ, M(t), tools) → action/response loop</div>
      </div>

      {/* Node row */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
        {nodes.map((node, i) => (
          <div key={node.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              style={{
                padding: "10px 8px",
                border: `1px solid ${activeNode === node.id ? node.color : `${node.color}22`}`,
                background: activeNode === node.id ? `${node.color}10` : "var(--surface-2)",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.25s",
                minWidth: 82,
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.65rem", color: activeNode === node.id ? node.color : "var(--cream)", marginBottom: 3 }}>{node.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: activeNode === node.id ? node.color : "var(--dim)", lineHeight: 1.3 }}>{node.formula}</div>
            </div>
            {i < nodes.length - 1 && (
              <span style={{ color: "var(--dim)", fontSize: "0.8rem", padding: "0 3px", flexShrink: 0 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Context window bar */}
      <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Context Window (128K tokens)</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--accent)" }}>67% used</span>
        </div>
        <div style={{ height: 6, background: "var(--faint)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ width: "12%", background: "#f59e0b", opacity: 0.7 }} title="System prompt" />
            <div style={{ width: "31%", background: "#8b5cf6", opacity: 0.7 }} title="Conversation history" />
            <div style={{ width: "18%", background: "#39d9b4", opacity: 0.7 }} title="Retrieved context" />
            <div style={{ width: "6%",  background: "#f59e0b", opacity: 0.5 }} title="Tool results" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
          {[["System", "#f59e0b", "12%"], ["History", "#8b5cf6", "31%"], ["RAG ctx", "#39d9b4", "18%"], ["Tools", "#f59e0b", "6%"]].map(([label, color, pct]) => (
            <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: color as string }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--dim)" }}>{label} {pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active node detail */}
      {active && (
        <div style={{ marginTop: 10, padding: "12px 14px", background: `${active.color}08`, border: `1px solid ${active.color}20`, borderRadius: 2 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: active.color, marginBottom: 5 }}>{active.formula}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7 }}>{active.desc}</div>
        </div>
      )}

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>Click any node · This is how agentic behaviour is triggered in production: LLM reasons → calls tools → updates memory → loops.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   11. BACKPROPAGATION — Chain rule gradient flow
═══════════════════════════════════════════════════════════════════ */
function BackpropViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle"|"forward"|"backward">("idle");
  const [bpStep, setBpStep] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const layers = [
        { n: 3, x: W * 0.12, label: "x" },
        { n: 4, x: W * 0.37, label: "h¹" },
        { n: 3, x: W * 0.63, label: "h²" },
        { n: 1, x: W * 0.88, label: "L" },
      ];
      const nodeY = (li: number, ni: number) => H * 0.1 + (ni + 0.5) * (H * 0.78 / layers[li].n);
      const gradActive = (li: number) => phase === "backward" && li >= layers.length - 1 - bpStep;
      const fwdActive = phase !== "idle";

      // Edges
      for (let li = 0; li < layers.length - 1; li++) {
        const hasGrad = gradActive(li);
        for (let ni = 0; ni < layers[li].n; ni++) {
          for (let nj = 0; nj < layers[li+1].n; nj++) {
            ctx.beginPath();
            ctx.moveTo(layers[li].x, nodeY(li, ni));
            ctx.lineTo(layers[li+1].x, nodeY(li+1, nj));
            ctx.strokeStyle = hasGrad ? "rgba(139,92,246,0.5)" : fwdActive ? "rgba(57,217,180,0.15)" : "rgba(255,255,255,0.05)";
            ctx.lineWidth = hasGrad ? 1.2 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (let li = 0; li < layers.length; li++) {
        const l = layers[li];
        const hasGrad = gradActive(li - 1) || (phase === "backward" && li === layers.length - 1);
        const isLoss = li === layers.length - 1;
        for (let ni = 0; ni < l.n; ni++) {
          const x = l.x, y = nodeY(li, ni), r = isLoss ? 10 : 7;
          if (hasGrad) {
            const grd = ctx.createRadialGradient(x, y, 0, x, y, r + 10);
            grd.addColorStop(0, "rgba(139,92,246,0.3)"); grd.addColorStop(1, "transparent");
            ctx.beginPath(); ctx.arc(x, y, r+10, 0, Math.PI*2); ctx.fillStyle = grd; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
          ctx.fillStyle = hasGrad ? "rgba(139,92,246,0.75)" : isLoss ? "rgba(239,68,68,0.6)" : fwdActive ? "rgba(57,217,180,0.35)" : "rgba(255,255,255,0.1)";
          ctx.fill();
          ctx.strokeStyle = hasGrad ? "#8b5cf6" : isLoss ? "#ef4444" : "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.fillStyle = hasGrad ? "#c4b5fd" : "rgba(255,255,255,0.3)";
        ctx.font = "8px monospace"; ctx.textAlign = "center";
        ctx.fillText(l.label, l.x, H - 4);
      }

      ctx.font = "9px monospace"; ctx.textAlign = "center";
      if (phase === "idle") {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillText("press Run →", W/2, H/2);
      } else if (phase === "forward") {
        ctx.fillStyle = "rgba(57,217,180,0.7)";
        ctx.fillText("forward pass: x → h¹ → h² → L", W/2, 13);
      } else {
        ctx.fillStyle = "#c4b5fd";
        const eqs = ["computing ∂L/∂h²", "computing ∂L/∂h¹", "computing ∂L/∂x"];
        ctx.fillText(eqs[Math.min(bpStep-1, 2)] || "gradient flow", W/2, 13);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [phase, bpStep]);

  const runAnim = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase("forward"); setBpStep(0);
    const tickRef = { v: 0 };
    const go = () => {
      tickRef.v++;
      if      (tickRef.v === 35) { setPhase("backward"); setBpStep(1); }
      else if (tickRef.v === 55) { setBpStep(2); }
      else if (tickRef.v === 75) { setBpStep(3); }
      else if (tickRef.v === 95) { setBpStep(4); }
      else if (tickRef.v > 115)  { return; }
      rafRef.current = requestAnimationFrame(go);
    };
    rafRef.current = requestAnimationFrame(go);
  }, []);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Backpropagation</div>
          <div className="math-formula">{"∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w   (chain rule)"}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setPhase("idle"); setBpStep(0); cancelAnimationFrame(rafRef.current); }} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", padding: "5px 10px", border: "1px solid var(--border)", borderRadius: 2, background: "transparent", color: "var(--dim)", cursor: "pointer" }}>Reset</button>
          <button onClick={runAnim} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", padding: "5px 12px", border: "1px solid var(--accent-ring)", borderRadius: 2, background: "var(--accent-dim)", color: "var(--accent)", cursor: "pointer", textTransform: "uppercase" }}>Run</button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 190, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>Gradients flow right-to-left via chain rule. Green = forward pass. Purple = gradient signal propagating back. This is how every neural net learns.</p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   12. DECISION TREE — Gini impurity interactive
═══════════════════════════════════════════════════════════════════ */
function DecisionTreeViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  type TreeNode = {
    id: string; label: string; gini: number; samples: number;
    split?: string; color: string;
    left?: TreeNode; right?: TreeNode;
  };

  const tree: TreeNode = {
    id: "root", label: "Root", gini: 0.48, samples: 240, split: "age ≤ 32?", color: "#39d9b4",
    left: {
      id: "l1", label: "age ≤ 32", gini: 0.21, samples: 110, split: "exp ≤ 2yr?", color: "#a78bfa",
      left:  { id: "ll", label: "Junior", gini: 0.05, samples: 68, color: "#f59e0b" },
      right: { id: "lr", label: "Mid", gini: 0.14, samples: 42, color: "#f59e0b" },
    },
    right: {
      id: "r1", label: "age > 32", gini: 0.18, samples: 130, split: "exp ≤ 5yr?", color: "#a78bfa",
      left:  { id: "rl", label: "Senior", gini: 0.08, samples: 74, color: "#f59e0b" },
      right: { id: "rr", label: "Lead", gini: 0.02, samples: 56, color: "#f59e0b" },
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const positions: Record<string, {x:number;y:number}> = {};

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // Node positions
      positions["root"] = { x: W/2, y: H * 0.13 };
      positions["l1"]   = { x: W * 0.28, y: H * 0.42 };
      positions["r1"]   = { x: W * 0.72, y: H * 0.42 };
      positions["ll"]   = { x: W * 0.15, y: H * 0.76 };
      positions["lr"]   = { x: W * 0.40, y: H * 0.76 };
      positions["rl"]   = { x: W * 0.60, y: H * 0.76 };
      positions["rr"]   = { x: W * 0.85, y: H * 0.76 };

      const drawEdge = (from: string, to: string, label: string) => {
        const f = positions[from], t = positions[to];
        ctx.beginPath(); ctx.moveTo(f.x, f.y + 16); ctx.lineTo(t.x, t.y - 16);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "8px monospace"; ctx.textAlign = "center";
        ctx.fillText(label, (f.x+t.x)/2 + (t.x > f.x ? 8 : -8), (f.y+t.y)/2);
      };

      drawEdge("root", "l1", "Yes"); drawEdge("root", "r1", "No");
      drawEdge("l1", "ll", "Yes"); drawEdge("l1", "lr", "No");
      drawEdge("r1", "rl", "Yes"); drawEdge("r1", "rr", "No");

      const drawNode = (node: TreeNode) => {
        const pos = positions[node.id];
        const isLeaf = !node.left;
        const isHov = hovered === node.id;
        const w = isLeaf ? 68 : 88, h = isLeaf ? 44 : 54;

        // Box
        ctx.beginPath();
        ctx.roundRect(pos.x - w/2, pos.y - h/2, w, h, 4);
        ctx.fillStyle = isHov ? `${node.color}18` : `${node.color}0a`;
        ctx.fill();
        ctx.strokeStyle = isHov ? node.color : `${node.color}40`;
        ctx.lineWidth = isHov ? 1.5 : 1;
        ctx.stroke();

        ctx.textAlign = "center";
        if (!isLeaf) {
          ctx.fillStyle = node.color;
          ctx.font = "bold 8px monospace";
          ctx.fillText(node.split || "", pos.x, pos.y - 14);
        }
        ctx.fillStyle = isLeaf ? node.color : "rgba(255,255,255,0.7)";
        ctx.font = isLeaf ? "bold 9px monospace" : "8px monospace";
        ctx.fillText(node.label, pos.x, pos.y + (isLeaf ? -4 : 0));
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "7px monospace";
        ctx.fillText(`Gini ${node.gini.toFixed(2)}  n=${node.samples}`, pos.x, pos.y + (isLeaf ? 11 : 14));

        if (node.left) { drawNode(node.left); drawNode(node.right!); }
      };

      drawNode(tree);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [hovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const W = rect.width, H = rect.height;
    const pos: Record<string, {x:number;y:number}> = {
      root: { x: W/2, y: H*0.13 }, l1: { x: W*0.28, y: H*0.42 }, r1: { x: W*0.72, y: H*0.42 },
      ll: { x: W*0.15, y: H*0.76 }, lr: { x: W*0.40, y: H*0.76 }, rl: { x: W*0.60, y: H*0.76 }, rr: { x: W*0.85, y: H*0.76 },
    };
    let found: string | null = null;
    for (const [id, p] of Object.entries(pos)) {
      if (Math.abs(mx - p.x) < 50 && Math.abs(my - p.y) < 30) { found = id; break; }
    }
    setHovered(found);
  }, []);

  const labels: Record<string, string> = { root: "Gini=0.48 → split reduces impurity", l1: "age ≤ 32: mostly junior/mid", r1: "age > 32: mostly senior/lead", ll: "Leaf: Junior (pure, Gini 0.05)", lr: "Leaf: Mid", rl: "Leaf: Senior", rr: "Leaf: Lead (very pure, Gini 0.02)" };

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Decision Tree</div>
        <div className="math-formula">{"Gini(t) = 1 − Σ pᵢ²   (split where Gini drops most)"}</div>
      </div>
      <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}
        style={{ width: "100%", height: 200, display: "block", cursor: "crosshair" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>
        {hovered ? labels[hovered] : "Hover nodes to inspect. Each split maximises class purity (minimises Gini impurity)."}
      </p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   13. ACTIVATION FUNCTIONS — ReLU / Sigmoid / Tanh / GELU comparison
═══════════════════════════════════════════════════════════════════ */
function ActivationFnsViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const fns = [
    { name: "ReLU",    color: "#39d9b4", fn: (z: number) => Math.max(0, z),        formula: "max(0, z)" },
    { name: "Sigmoid", color: "#8b5cf6", fn: (z: number) => 1/(1+Math.exp(-z)),    formula: "1/(1+e⁻ᶻ)" },
    { name: "Tanh",    color: "#f59e0b", fn: (z: number) => Math.tanh(z),           formula: "(eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)" },
    { name: "GELU",    color: "#f472b6", fn: (z: number) => 0.5*z*(1+Math.tanh(Math.sqrt(2/Math.PI)*(z+0.044715*z**3))), formula: "z·Φ(z)" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const PAD = { t: 18, r: 16, b: 28, l: 36 };
      const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
      const zMin = -4, zMax = 4, yMin = -1.2, yMax = 1.2;
      const toX = (z: number) => PAD.l + (z - zMin) / (zMax - zMin) * pw;
      const toY = (y: number) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * ph;

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 0.5;
      [-1, 0, 1].forEach(y => {
        ctx.beginPath(); ctx.moveTo(PAD.l, toY(y)); ctx.lineTo(PAD.l + pw, toY(y)); ctx.stroke();
      });
      [-4,-2,0,2,4].forEach(x => {
        ctx.beginPath(); ctx.moveTo(toX(x), PAD.t); ctx.lineTo(toX(x), PAD.t+ph); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "7px monospace"; ctx.textAlign = "center";
        ctx.fillText(String(x), toX(x), H - 4);
      });
      // Y axis labels
      ctx.textAlign = "right";
      [-1, 0, 1].forEach(y => {
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "7px monospace";
        ctx.fillText(String(y), PAD.l - 4, toY(y) + 3);
      });

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD.l, toY(0)); ctx.lineTo(PAD.l+pw, toY(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(toX(0), PAD.t); ctx.lineTo(toX(0), PAD.t+ph); ctx.stroke();

      // Curves
      fns.forEach(({ name, color, fn }) => {
        const isActive = active === null || active === name;
        ctx.beginPath();
        for (let px = 0; px <= pw; px++) {
          const z = zMin + (px / pw) * (zMax - zMin);
          const y = fn(z);
          const cx = PAD.l + px, cy = toY(Math.max(yMin, Math.min(yMax, y)));
          px === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = isActive ? color : `${color}22`;
        ctx.lineWidth = isActive ? (active === name ? 2.5 : 1.5) : 0.8;
        ctx.stroke();
      });

      // Legend
      fns.forEach(({ name, color, formula }, i) => {
        const lx = PAD.l + 6 + i * (pw/4);
        const ly = PAD.t + 6;
        const isActive = active === null || active === name;
        ctx.fillStyle = isActive ? color : `${color}44`;
        ctx.font = `bold 7px monospace`; ctx.textAlign = "left";
        ctx.fillText(name, lx, ly);
        ctx.font = "6px monospace"; ctx.fillStyle = isActive ? `${color}99` : `${color}22`;
        ctx.fillText(formula, lx, ly + 9);
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 8 }}>Activation Functions</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["ReLU","Sigmoid","Tanh","GELU"].map((n, i) => {
            const colors = ["#39d9b4","#8b5cf6","#f59e0b","#f472b6"];
            return (
              <button key={n} onClick={() => setActive(a => a === n ? null : n)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "3px 10px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.06em",
                  border: `1px solid ${active === n ? colors[i] : `${colors[i]}30`}`,
                  background: active === n ? `${colors[i]}18` : "transparent",
                  color: active === n ? colors[i] : `${colors[i]}80`,
                  transition: "all 0.2s",
                }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 185, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>
        {active === "ReLU" ? "ReLU: max(0,z). Fast, sparse. Suffers from dying neurons at z<0." :
         active === "Sigmoid" ? "Sigmoid: squashes to (0,1). Vanishing gradient for |z|>3." :
         active === "Tanh" ? "Tanh: zero-centred sigmoid. Stronger gradients than sigmoid." :
         active === "GELU" ? "GELU: used in BERT, GPT. Smooth non-linearity, better gradient flow." :
         "Click to isolate a function. ReLU dominates hidden layers. GELU used in transformers."}
      </p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   14. BAYESIAN INFERENCE — Prior × Likelihood → Posterior
═══════════════════════════════════════════════════════════════════ */
function BayesianViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [evidenceStrength, setEvidenceStrength] = useState(5);

  const gaussian = (x: number, mu: number, sigma: number) =>
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const PAD = { t: 20, r: 16, b: 28, l: 36 };
      const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
      const xMin = -5, xMax = 5;
      const toX = (x: number) => PAD.l + (x - xMin) / (xMax - xMin) * pw;

      // Prior: N(0, 2), Likelihood: N(2, 1/evidence), Posterior: moves toward likelihood
      const priorMu = 0, priorSig = 2;
      const likeMu = 2.5, likeSig = Math.max(0.4, 2.2 - evidenceStrength * 0.18);
      // Posterior: precision-weighted mean
      const postPrec = 1/priorSig**2 + 1/likeSig**2;
      const postMu = (priorMu/priorSig**2 + likeMu/likeSig**2) / postPrec;
      const postSig = Math.sqrt(1/postPrec);

      // Find max y for scaling
      let maxY = 0;
      for (let i = 0; i <= 200; i++) {
        const x = xMin + (i/200)*(xMax-xMin);
        maxY = Math.max(maxY, gaussian(x, priorMu, priorSig), gaussian(x, likeMu, likeSig), gaussian(x, postMu, postSig));
      }
      const toY = (y: number) => PAD.t + ph - (y / (maxY * 1.1)) * ph;

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(PAD.l, toY(0)); ctx.lineTo(PAD.l+pw, toY(0)); ctx.stroke();
      [-4,-2,0,2,4].forEach(x => {
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "7px monospace"; ctx.textAlign = "center";
        ctx.fillText(String(x), toX(x), H - 4);
      });

      const drawCurve = (mu: number, sig: number, color: string, label: string) => {
        ctx.beginPath();
        for (let i = 0; i <= pw; i++) {
          const x = xMin + (i/pw)*(xMax-xMin);
          const y = gaussian(x, mu, sig);
          i === 0 ? ctx.moveTo(PAD.l+i, toY(y)) : ctx.lineTo(PAD.l+i, toY(y));
        }
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();

        // Fill under curve
        ctx.lineTo(toX(xMax), toY(0)); ctx.lineTo(toX(xMin), toY(0)); ctx.closePath();
        ctx.fillStyle = `${color}12`; ctx.fill();

        // Label at peak
        ctx.fillStyle = color; ctx.font = "bold 7.5px monospace"; ctx.textAlign = "center";
        ctx.fillText(label, toX(mu), toY(gaussian(mu, sig, )) - 6);
      };

      drawCurve(priorMu, priorSig, "rgba(100,160,255,0.8)", "Prior");
      drawCurve(likeMu, likeSig, "rgba(245,158,11,0.85)", "Likelihood");
      drawCurve(postMu, postSig, "rgba(57,217,180,0.9)", "Posterior");
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [evidenceStrength]);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Bayesian Inference</div>
        <div className="math-formula">{"P(H|E) = P(E|H) · P(H) / P(E)"}</div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 180, display: "block" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", whiteSpace: "nowrap" }}>Evidence strength</span>
        <input type="range" min={1} max={10} value={evidenceStrength} onChange={e => setEvidenceStrength(+e.target.value)}
          style={{ flex: 1, accentColor: "var(--accent)", height: 2 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--accent)", minWidth: 16 }}>{evidenceStrength}</span>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 8, lineHeight: 1.6 }}>
        Blue = prior belief. Orange = likelihood (data). Teal = posterior. More evidence → likelihood narrows → posterior shifts away from prior.
      </p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   15. VANISHING GRADIENT — Sigmoid vs ReLU depth comparison
═══════════════════════════════════════════════════════════════════ */
function VanishingGradViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activation, setActivation] = useState<"sigmoid"|"relu">("sigmoid");

  // Sigmoid derivative max = 0.25, so gradient shrinks by 0.25 per layer (worst case)
  // ReLU derivative = 1 for z>0 (no vanishing through active neurons)
  const computeGrads = (act: "sigmoid"|"relu", layers: number) => {
    const grads: number[] = [];
    let g = 1.0;
    for (let i = 0; i < layers; i++) {
      if (act === "sigmoid") g *= (0.18 + Math.random() * 0.07); // avg sigmoid deriv ~0.2
      else g *= (0.88 + Math.random() * 0.12); // ReLU: mostly preserved
      grads.unshift(g);
    }
    return grads;
  };

  const [grads, setGrads] = useState(() => computeGrads("sigmoid", 8));

  useEffect(() => {
    setGrads(computeGrads(activation, 8));
  }, [activation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const PAD = { t: 20, r: 20, b: 44, l: 20 };
      const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
      const n = grads.length;
      const barW = pw / n * 0.65;
      const gap   = pw / n;

      grads.forEach((g, i) => {
        const barH = ph * Math.min(g / 1.0, 1);
        const x = PAD.l + i * gap + (gap - barW) / 2;
        const y = PAD.t + ph - barH;
        const color = activation === "sigmoid" ? `rgba(239,68,68,${0.3 + g * 0.7})` : `rgba(57,217,180,${0.3 + g * 0.7})`;

        // Bar
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.roundRect(x, y, barW, barH, 2); ctx.fill();

        // Gradient value
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = "6.5px monospace"; ctx.textAlign = "center";
        ctx.fillText(g.toFixed(3), x + barW/2, y - 4);

        // Layer label
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "7px monospace";
        ctx.fillText(`L${i+1}`, x + barW/2, PAD.t + ph + 14);
      });

      // Output label
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "7px monospace"; ctx.textAlign = "left";
      ctx.fillText("← input layers         output →", PAD.l, PAD.t + ph + 28);

      // Title line
      ctx.textAlign = "center";
      ctx.fillStyle = activation === "sigmoid" ? "rgba(239,68,68,0.8)" : "rgba(57,217,180,0.8)";
      ctx.font = "8px monospace";
      ctx.fillText(activation === "sigmoid" ? "Sigmoid: gradient vanishes in early layers" : "ReLU: gradient preserved through depth", W/2, 14);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [grads, activation]);

  return (
    <div className="math-card" style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--white)", marginBottom: 3 }}>Vanishing Gradient</div>
          <div className="math-formula">{"σ'(z) ≤ 0.25 → gradient shrinks each layer"}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["sigmoid","relu"] as const).map(a => (
            <button key={a} onClick={() => setActivation(a)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "4px 10px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase",
                border: `1px solid ${activation===a ? (a==="sigmoid"?"#ef4444":"var(--accent)") : "var(--border)"}`,
                background: activation===a ? (a==="sigmoid"?"rgba(239,68,68,0.1)":"var(--accent-dim)") : "transparent",
                color: activation===a ? (a==="sigmoid"?"#ef4444":"var(--accent)") : "var(--dim)",
              }}>
              {a}
            </button>
          ))}
          <button onClick={() => setGrads(computeGrads(activation, 8))}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "4px 10px", border: "1px solid var(--border)", borderRadius: 2, background: "transparent", color: "var(--dim)", cursor: "pointer" }}>
            Resample
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 175, display: "block" }} />
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginTop: 10, lineHeight: 1.6 }}>
        {activation === "sigmoid" ? "Each sigmoid layer multiplies gradient by ≤0.25. After 8 layers: near zero. Early layers learn nothing." : "ReLU derivative is 1 for z>0. Gradient flows through intact. Enabled deep nets (ResNets, GPT)."}
      </p>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MATH SHOWCASE — Section wrapper
═══════════════════════════════════════════════════════════════════ */
export default function MathShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
        }
      },
      { threshold: 0.03 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="math" ref={sectionRef} className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }} className="reveal">
          <span className="section-index">02 //</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div className="reveal" style={{ marginBottom: 10 }}>
          <span className="label-accent">Mathematical Foundations</span>
        </div>
        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom: 14 }}>
          The math I work with.{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>Every day.</span>
        </h2>
        <p className="body-lg reveal reveal-d2" style={{ maxWidth: 520, marginBottom: 52 }}>
          Not textbook exercises. These are the algorithms powering every system I build.
          Interactive — explore how each one works.
        </p>

        {visible && (
          <>
            {/* Row 1 */}
            <div className="reveal reveal-d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <GradientDescent />
              <AttentionMap />
            </div>

            {/* Row 2 */}
            <div className="reveal reveal-d3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <ForwardPass />
              <MLPipeline />
            </div>

            {/* Row 3 */}
            <div className="reveal reveal-d3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <KNNViz />
              <KMeansViz />
            </div>

            {/* Row 4 */}
            <div className="reveal reveal-d4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <ConfusionMatrix />
              <ROCCurve />
            </div>

            {/* Row 5 */}
            <div className="reveal reveal-d4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <RAGFlow />
              <AgenticPipeline />
            </div>

            {/* Row 6 */}
            <div className="reveal reveal-d5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <BackpropViz />
              <DecisionTreeViz />
            </div>

            {/* Row 7 */}
            <div className="reveal reveal-d5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} data-grid>
              <ActivationFnsViz />
              <BayesianViz />
            </div>

            {/* Row 8 — full width */}
            <div className="reveal reveal-d5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} data-grid>
              <VanishingGradViz />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="reveal reveal-d5" style={{ marginTop: 36, padding: "16px 24px", border: "1px solid var(--border)", borderRadius: 2, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--dim)", letterSpacing: "0.06em" }}>
            PyTorch · Scikit-learn · ONNX · MLflow · FastAPI · HNSW · MCP · WebRTC · GGUF
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--accent)", opacity: 0.6, letterSpacing: "0.06em" }}>
            All models ship to production.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
