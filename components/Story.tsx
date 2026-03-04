"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE SIGMOID VISUALIZATION
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

    const pad = { top: 30, right: 30, bottom: 50, left: 50 };
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
    ctx.fillText("z  (input)", pad.left + gw / 2, pad.top + gh + 40);
    ctx.save();
    ctx.translate(12, pad.top + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("σ(z)  (probability)", 0, 0);
    ctx.restore();

    // Threshold
    const threshY = pad.top + gh - gh * threshold;
    ctx.strokeStyle = "rgba(61,186,126,0.3)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, threshY); ctx.lineTo(pad.left + gw, threshY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(61,186,126,0.7)";
    ctx.font = "500 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`threshold = ${threshold.toFixed(2)}`, pad.left + gw - 130, threshY - 8);

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

    // Annotations
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
      ctx.fillText("inflection: z=0, σ=0.5", ipx + 8, ipy - 10);
      ctx.fillText("σ'(0) = σ(1−σ) = 0.25", ipx + 8, ipy + 4);

      [{ z: -2, label: "σ'≈0.10" }, { z: 2, label: "σ'≈0.10" }].forEach(({ z, label }) => {
        const t2 = (z + 6) / 12;
        const px2 = pad.left + t2 * gw;
        const py2 = pad.top + gh - sigmoid(z) * gh;
        ctx.beginPath(); ctx.arc(px2, py2, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,151,58,${0.8 * anno})`; ctx.fill();
        ctx.fillStyle = `rgba(200,151,58,${0.7 * anno})`;
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.fillText(label, px2, py2 - 10);
      });

      if (anno > 0.5) {
        ctx.fillStyle = `rgba(255,255,255,${0.15 * anno})`;
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText("σ → 1  (z → ∞)", pad.left + 6, pad.top + 12);
        ctx.fillText("σ → 0  (z → −∞)", pad.left + 6, pad.top + gh - 6);
      }
    }

    // Shaded regions
    if (progress > 0.8) {
      const regionAlpha = Math.min(0.06, (progress - 0.8) * 0.3);
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
        ctx.fillStyle = "rgba(61,186,126,0.4)";
        ctx.textAlign = "right"; ctx.fillText('"Hire"', pad.left + gw - 10, pad.top + 20);
        ctx.fillStyle = "rgba(192,90,90,0.35)";
        ctx.fillText('"Pass"', pad.left + gw - 10, pad.top + gh - 10);
      }
    }

    // Hover
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

        ctx.fillStyle = "rgba(10,10,10,0.9)";
        ctx.strokeStyle = "rgba(61,186,126,0.3)"; ctx.lineWidth = 1;
        const tx = mx + 12, ty = py - 36;
        ctx.beginPath(); ctx.roundRect(tx, ty, 130, 30, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#3dba7e";
        ctx.font = "500 10px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText(`z=${xVal.toFixed(1)}  σ=${yVal.toFixed(3)}`, tx + 8, ty + 19);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [threshold, hoverX, sigmoid]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 24px 16px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--white)", marginBottom: 4 }}>The Hire/No-Hire Decision</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#3dba7e", letterSpacing: "0.02em" }}>
            {"σ(z) = 1 / (1 + e"}<sup style={{ fontSize: "0.6rem" }}>{" −z"}</sup>{")  →  P(hire | candidate)"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Drag threshold</span>
          <input type="range" min="0.1" max="0.9" step="0.01" value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            style={{ width: 120, accentColor: "#3dba7e", cursor: "pointer" }} />
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 260, cursor: "crosshair" }}
        onMouseMove={e => setHoverX(e.clientX)} onMouseLeave={() => setHoverX(null)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }} className="grid-3">
        {[
          { label: "For non-tech", val: "The Idea", desc: "Just like a credit score decides your loan, this score decides if a candidate gets hired. We automate the decision." },
          { label: "Threshold", val: threshold.toFixed(2), desc: "Someone chose this number. In school it was the pass mark. In hiring, we set it based on real outcome data." },
          { label: "What we save", val: "~60%", desc: "Manual HR screening cost. Automated scoring in under 2 seconds per candidate vs 20 min/person human review." },
          { label: "For tech", val: "AUC 0.97", desc: "Trained on prosody, semantics, and pace features. ONNX quantised for real-time inference during live interviews." },
        ].map(({ label, val, desc }) => (
          <div key={label}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.1rem", color: "#3dba7e" }}>{val}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
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
   BUSINESS IMPACT CARD — for non-tech readers
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
      { threshold: 0.2 }
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
        @media (max-width: 768px) {
          .builds-grid { grid-template-columns: 1fr !important; }
          .impact-grid { grid-template-columns: 1fr !important; }
          .now-grid { grid-template-columns: 1fr !important; }
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
          <h2 className="display-lg reveal reveal-d1" style={{ maxWidth: 760, marginBottom: 16 }}>
            From{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#c05a5a" }}>
              Section C
            </span>{" "}
            to Founding Engineer —{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#3dba7e" }}>
              building the AI you need.
            </span>
          </h2>
          <p className="body-lg reveal reveal-d2" style={{ maxWidth: 600, marginBottom: 20 }}>
            I&apos;ve been labeled a failure. Worked at Starbucks while building AI companies.
            Today I build real-time ML systems for businesses that can&apos;t afford to be wrong.
          </p>
          {/* Dual-audience tag */}
          <div className="reveal reveal-d3" style={{
            display: "inline-flex", gap: 0,
            border: "1px solid var(--border)", borderRadius: 6,
            overflow: "hidden", marginBottom: 72,
          }}>
            {[
              { label: "Non-tech?", desc: "You'll see what problems I solve and how much you save.", color: "#c8973a" },
              { label: "Tech?", desc: "You'll see the architecture, stack, and real metrics.", color: "#3dba7e" },
            ].map(({ label, desc, color }) => (
              <div key={label} style={{ padding: "10px 18px", background: "var(--surface)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color, letterSpacing: "0.08em", marginRight: 8 }}>{label}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── OPENING PHOTOS — 3 columns ── */}
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
              }}>Starbucks, Canada · Cup: &quot;Omkumar&quot; · Screen: Lawline.tech</div>
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
          <ChapterHeader number="01" title="The Division" subtitle="School — The label that was supposed to stick" accent="#c05a5a" />
          <div style={{ paddingLeft: 68, maxWidth: 640 }}>
            {[
              { text: "In our school, students were sorted into sections like products on a shelf. Section A — the toppers. Section B — average. Section C — the ones they'd already decided weren't worth the effort.", isShort: false },
              { text: "I was in Section C.", isShort: true },
              { text: "Every exam was a public ranking. Marks read aloud. Heads shaken. A number used to define whether you mattered. But nobody ever told me why they chose that pass mark. It was just a number someone decided.", isShort: false },
              { text: "That number. That arbitrary line. It would later become the thing I understood better than anyone.", isShort: false },
            ].map(({ text, isShort }, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 4)}`} style={{
                fontSize: isShort ? "1.1rem" : "0.92rem",
                color: isShort ? "var(--white)" : "var(--muted)",
                lineHeight: 1.8, marginBottom: i < 3 ? 16 : 0,
                fontWeight: isShort ? 600 : 400,
                fontFamily: isShort ? "var(--font-display)" : "var(--font-body)",
              }}>{text}</p>
            ))}
          </div>
        </div>

        {/* ── HERO PHOTO BREAK: THE STARBUCKS MOMENT ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 460 }}>
            <Image src="/images/starbucks/starbucks01.jpeg" alt="Building Lawline.tech at Starbucks" fill
              style={{ objectFit: "cover", objectPosition: "center", filter: "brightness(0.75) saturate(0.9)" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent)",
            }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px", maxWidth: 520 }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#3dba7e",
                letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
              }}>
                Starbucks · Canada · 2024 · Actual photo
              </div>
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)", color: "#f0f0f0", lineHeight: 1.45, marginBottom: 18,
              }}>
                Cup says &ldquo;Omkumar.&rdquo;<br />
                Screen shows Lawline.tech.<br />
                <span style={{ color: "#3dba7e" }}>This is where it happened.</span>
              </p>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                While teachers were writing Section C on my reports,
                I was building an AI legal platform from a coffee shop.
                No office. No funding. Just a laptop and a problem to solve.
              </p>
            </div>
            <div style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(61,186,126,0.3)", padding: "6px 12px", borderRadius: 4,
              fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#3dba7e", letterSpacing: "0.1em",
            }}>
              BUILDING IN PUBLIC
            </div>
          </div>
        </div>

        {/* ── CHAPTER 02: THE GRIND ── */}
        <div data-block style={{ paddingBottom: 40 }}>
          <ChapterHeader number="02" title="The Grind" subtitle="Canada 2024 — Building from scratch, in cafés, with zero budget" accent="#c8973a" />
          <div style={{ paddingLeft: 68, maxWidth: 640 }}>
            {[
              "The AI revolution was happening, but I wasn't at a funded startup or a big tech company. I was at Starbucks. Serving coffee in the morning, writing Python in the afternoon.",
              "Most people see AI as something only Silicon Valley does. I saw it as a problem-solving tool. And I had real problems in front of me — businesses spending thousands on legal review, companies unable to screen 500 candidates, labs wasting months on trial-and-error chemistry.",
              "I didn't ask permission. I just started building.",
            ].map((text, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.8,
                marginBottom: i < 2 ? 16 : 0, fontFamily: "var(--font-body)",
              }}>{text}</p>
            ))}
          </div>
        </div>

        {/* ── BUSINESS IMPACT CARDS — for non-tech ── */}
        <div data-block style={{ marginBottom: 72 }}>
          <div className="reveal" style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--dim)",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>For non-tech readers — What problems we actually solved</span>
          </div>
          <div className="reveal impact-grid">
            <ImpactCard
              tag="Legal AI"
              headline="Legal review used to take hours and cost hundreds"
              plain="A lawyer charges $300/hr to read contracts. For a small business reviewing 20 documents a month, that's $6,000/month just to understand what you signed. I built an AI that reads the same documents in 3 seconds, flags the risky parts, and costs a fraction."
              metric="60% fewer legal errors · 3s per document · not 3 hours"
            />
            <ImpactCard
              tag="Hiring AI"
              headline="Hiring the wrong person costs 30% of their salary"
              plain="One bad hire in a 50-person company can cost $15,000–$50,000 once you factor in rehiring, training, lost time. I built an AI that scores candidates in real time during the interview — so hiring managers make decisions on data, not gut feel."
              metric="+45% job placement rate · AUC 0.97 · <2s scoring"
            />
            <ImpactCard
              tag="Chemistry ML"
              headline="R&D cycles that took 6 months now take 2"
              plain="A chemistry lab testing new materials has to physically make and test hundreds of samples. I built an ML model on just 200 data points that predicts which ingredients work before they even mix them. That's 40% fewer wasted experiments."
              metric="R2 = 0.89 · 40% cost reduction · 3x faster iterations"
            />
            <ImpactCard
              tag="AI Integration"
              headline="Your internal tools could talk to each other — they don't"
              plain="Most companies have Slack, a CRM, a database, and five different tools that don't share data. I built a single AI layer (using the MCP protocol) that connects them all. Your AI assistant can now look up a client, update the CRM, and notify the team — one command."
              metric="1 integration layer · N tools connected · zero vendor lock-in"
            />
          </div>
        </div>

        {/* ── CHAPTER 03: THE PATTERN (sigmoid) ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="03" title="The Pattern" subtitle="Engineering — When the math became a metaphor for everything" accent="#3dba7e" />
          <div style={{ paddingLeft: 68 }}>
            {[
              { text: "In engineering, I finally saw a pattern. When someone explained logistic regression — not just the formula, but WHY it exists — everything clicked. The sigmoid function maps any number to a probability between 0 and 1.", isShort: false },
              { text: "And then I saw it: the pass mark. The grade threshold. It was just a number someone chose.", isShort: true },
              { text: "In AI, we call it a decision boundary. In school, they called it the pass mark. Same math. But in AI, you can question it, move it, measure whether it's actually right. In school, you couldn't.", isShort: false },
            ].map(({ text, isShort }, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                fontSize: isShort ? "1.05rem" : "0.92rem",
                color: isShort ? "var(--white)" : "var(--muted)",
                lineHeight: 1.8, marginBottom: i < 2 ? 16 : 24,
                fontWeight: isShort ? 600 : 400,
                fontFamily: isShort ? "var(--font-display)" : "var(--font-body)",
                maxWidth: 640,
              }}>{text}</p>
            ))}
            <div data-graph className="reveal reveal-d3" style={{ maxWidth: 720, marginBottom: 16 }}>
              {graphVisible && <SigmoidGraph />}
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--dim)",
                marginTop: 12, letterSpacing: "0.04em", lineHeight: 1.6,
              }}>
                <strong style={{ color: "var(--muted)" }}>Non-tech:</strong> Drag the threshold — you decide what &quot;good enough&quot; means.{" "}
                <strong style={{ color: "var(--muted)" }}>Tech:</strong> This is the actual sigmoid used in Resso&apos;s hire-probability scorer. AUC 0.97 in production.
              </p>
            </div>
          </div>
        </div>

        {/* ── CHAPTER 04: THE TRUTH ── */}
        <div data-block style={{ paddingBottom: 64 }}>
          <ChapterHeader number="04" title="The Truth" subtitle="The problem was never ability — it was the metric" accent="#8b5cf6" />
          <div style={{ paddingLeft: 68, maxWidth: 640 }}>
            {[
              "The system was optimised for memorisation. Recite the formula. Get the mark. Move on. Nobody checked if you could actually use what you learned.",
              "But businesses don't want someone who memorises documentation. They want someone who builds things that save them money, time, and mistakes. That's a completely different metric.",
              "I build things that generate real ROI. Not because I got 95% in an exam — but because I understand the problem deeply enough to see what an AI system actually needs to solve it.",
            ].map((text, i) => (
              <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.8,
                marginBottom: i < 2 ? 16 : 0, fontFamily: "var(--font-body)",
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
            }}>
              The receipts — things I actually built
            </span>
          </div>
          <div className="reveal builds-grid">
            {[
              { name: "Resso.ai", role: "Founding Engineer", plain: "AI that scores candidates in real time during live interviews — so hiring managers stop guessing.", tech: "WebRTC · Speaker Diarization · ONNX · <2s latency" },
              { name: "Vadtal — Vector DB", role: "AI Architect", plain: "Private AI brain for companies that can't send data to the cloud. Runs 100% on your own server.", tech: "GGUF · HNSW · FastAPI · 100% offline · 16GB RAM" },
              { name: "Lawline.tech", role: "Built at Starbucks", plain: "Upload a legal document. AI reads it, flags risky clauses, extracts obligations. 3 seconds, not 3 hours.", tech: "Fine-tuned LLM · Clause classification · 94% accuracy" },
              { name: "Corol / NunaFab", role: "ML Engineer", plain: "ML model that predicts chemistry results before running lab tests. 40% fewer wasted experiments.", tech: "XGBoost · SHAP · 200-row dataset · R2 = 0.89" },
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
          <ChapterHeader number="05" title="Now" subtitle="Founding Engineer at Resso.ai · Building AI that pays for itself" accent="#3dba7e" />
          <div className="now-grid">
            <div style={{ paddingLeft: 68 }}>
              {[
                "Today I'm a Founding Engineer building production AI systems — real-time pipelines, autonomous agents, infrastructure that companies actually depend on.",
                "The difference between me and most AI engineers: I start with the business problem, not the model. What does it cost you today? How much would you save if this worked? Then I build the system that gets you there.",
                "To every teacher who read out my marks and shook their head — I have one question:",
              ].map((text, i) => (
                <p key={i} className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{
                  fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.8,
                  marginBottom: i < 2 ? 16 : 24, fontFamily: "var(--font-body)",
                }}>{text}</p>
              ))}

              {/* Climax */}
              <div className="reveal reveal-d3" style={{
                padding: "28px 24px", background: "var(--surface)",
                border: "1px solid rgba(61,186,126,0.15)", borderRadius: 12,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -40, right: -40, width: 200, height: 200,
                  background: "radial-gradient(circle, rgba(61,186,126,0.05), transparent 70%)",
                  pointerEvents: "none",
                }} />
                <p style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "var(--accent)",
                  lineHeight: 1.4, marginBottom: 10, position: "relative",
                }}>
                  &ldquo;What&apos;s your net worth?&rdquo;
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, position: "relative" }}>
                  You loved measuring us by numbers. Read our marks out loud, shook your heads at 63%.
                  Let&apos;s talk numbers. What&apos;s yours? Why the silence?
                </p>
                <div style={{
                  marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)", fontSize: "0.56rem",
                  color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  Section C → Founding Engineer · The marks didn&apos;t matter. The understanding did.
                </div>
              </div>
            </div>

            {/* Photo column — single portrait */}
            <div className="reveal" style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 480, border: "1px solid var(--border)" }}>
              <Image src="/images/omkumar/Omkumar01.jpeg" alt="Om Kumar Solanki" fill
                style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.88) saturate(0.9)" }} />
            </div>
          </div>
        </div>

        {/* ── CLOSING ── */}
        <div data-block className="reveal" style={{
          marginTop: 80, paddingTop: 48,
          borderTop: "1px solid var(--border)",
          textAlign: "center", maxWidth: 600, marginLeft: "auto", marginRight: "auto",
        }}>
          <p style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: "var(--cream)", lineHeight: 1.6, marginBottom: 20,
          }}>
            The system didn&apos;t fail me. The metric did.
            I&apos;m not here to impress the system — I&apos;m here to build what it couldn&apos;t.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 28 }}>
            If you&apos;re a <strong style={{ color: "var(--cream)" }}>business owner</strong> — I&apos;ll show you where AI saves you money and how fast.
            If you&apos;re <strong style={{ color: "var(--cream)" }}>technical</strong> — let&apos;s talk architecture, latency, and real production trade-offs.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap",
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            color: "var(--dim)", letterSpacing: "0.08em",
          }}>
            <span>SECTION C → FOUNDING ENGINEER</span>
            <span style={{ color: "var(--accent)" }}>·</span>
            <span>63% → AUC 0.97</span>
            <span style={{ color: "var(--accent)" }}>·</span>
            <span>STARBUCKS → RESSO.AI</span>
          </div>
        </div>

      </div>
    </section>
  );
}
