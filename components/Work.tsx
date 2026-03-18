"use client";
import { useEffect, useRef } from "react";

/* ── Mini canvas visualizations per project ── */

/* Resso.ai: animated audio waveform + inference score bar */
function WaveformViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width  = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      t += 0.04;

      // Waveform bars
      const bars = 32;
      const bw   = W / bars - 1;
      for (let i = 0; i < bars; i++) {
        const h   = (0.15 + 0.75 * Math.abs(Math.sin(t + i * 0.35 + Math.sin(i * 0.2) * 2))) * H * 0.85;
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 0.5 + i * 0.2));
        ctx!.fillStyle = `rgba(32,100,82,${alpha})`;
        ctx!.fillRect(i * (bw + 1), (H - h) / 2, bw, h);
      }

      // Score overlay
      const score = 0.72 + 0.18 * Math.sin(t * 0.3);
      ctx!.fillStyle = "rgba(32,100,82,0.9)";
      ctx!.font = `600 ${Math.round(H * 0.22)}px 'JetBrains Mono', monospace`;
      ctx!.textAlign = "right";
      ctx!.fillText(`P(hire)=${score.toFixed(2)}`, W - 4, H * 0.2);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 72, display: "block" }} />;
}

/* MCP: animated node connection graph */
function MCPViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const APIS = ["Slack", "DB", "CRM", "Auth", "Mail", "Files"];
    let t = 0;
    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width  = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      t += 0.025;

      // Center hub (MCP)
      const cx = W * 0.35, cy = H / 2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(32,100,82,${0.6 + 0.3 * Math.sin(t)})`;
      ctx!.fill();
      ctx!.fillStyle = "rgba(0,0,0,0.8)";
      ctx!.font = "600 8px 'JetBrains Mono', monospace";
      ctx!.textAlign = "center";
      ctx!.fillText("MCP", cx, cy + 3);

      // Agent on left
      const ax = W * 0.08, ay = H / 2;
      ctx!.beginPath();
      ctx!.arc(ax, ay, 7, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(139,92,246,0.7)";
      ctx!.fill();
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.font = "500 7px 'JetBrains Mono', monospace";
      ctx!.fillText("AI", ax, ay + 3);

      // Line agent → MCP with pulse
      const pt = (t * 1.5) % 1;
      const px = ax + (cx - ax) * pt;
      const py = ay;
      ctx!.strokeStyle = "rgba(139,92,246,0.3)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(ax, ay);
      ctx!.lineTo(cx, cy);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(px, py, 3, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(139,92,246,0.8)";
      ctx!.fill();

      // API endpoints
      APIS.forEach((api, i) => {
        const angle = (i / APIS.length) * Math.PI * 2 - Math.PI / 2;
        const r     = Math.min(W * 0.28, H * 0.45);
        const ex    = cx + W * 0.32 + Math.cos(angle) * r * 0.55;
        const ey    = cy + Math.sin(angle) * r;
        ctx!.strokeStyle = `rgba(32,100,82,0.15)`;
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(ex, ey);
        ctx!.stroke();
        // Pulse on this edge
        const ep = (t * 0.8 + i * 0.16) % 1;
        ctx!.beginPath();
        ctx!.arc(cx + (ex - cx) * ep, cy + (ey - cy) * ep, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(32,100,82,${0.5 * Math.sin(t + i)})`;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(ex, ey, 5, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(32,100,82,0.2)";
        ctx!.fill();
        ctx!.fillStyle = "rgba(200,196,188,0.6)";
        ctx!.font = "500 7px 'JetBrains Mono', monospace";
        ctx!.textAlign = "center";
        ctx!.fillText(api, ex, ey + 3);
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 80, display: "block" }} />;
}

/* RAG: animated vector similarity rings */
function RAGViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    const vectors = Array.from({ length: 18 }, (_, i) => ({
      x: 0.1 + Math.random() * 0.55,
      y: 0.1 + Math.random() * 0.8,
      sim: 0.2 + Math.random() * 0.8,
    }));
    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width  = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      t += 0.02;

      // Query vector (right side)
      const qx = W * 0.82, qy = H / 2;
      // Expanding rings
      for (let r = 0; r < 3; r++) {
        const radius = ((t * 40 + r * 30) % 100) + 5;
        const alpha  = Math.max(0, 0.3 - radius / 130);
        ctx!.beginPath();
        ctx!.arc(qx, qy, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(245,158,11,${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
      ctx!.beginPath();
      ctx!.arc(qx, qy, 7, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(245,158,11,0.9)";
      ctx!.fill();

      // Vector dots
      vectors.forEach(v => {
        const vx = v.x * W * 0.7;
        const vy = v.y * H;
        const r  = 2 + v.sim * 2;
        const dist = Math.sqrt((vx - qx) ** 2 + (vy - qy) ** 2);
        const inRange = dist < 90;
        ctx!.beginPath();
        ctx!.arc(vx, vy, r, 0, Math.PI * 2);
        ctx!.fillStyle = inRange
          ? `rgba(32,100,82,${0.4 + v.sim * 0.5})`
          : `rgba(200,196,188,0.15)`;
        ctx!.fill();
        if (inRange) {
          ctx!.strokeStyle = `rgba(32,100,82,0.15)`;
          ctx!.lineWidth = 0.8;
          ctx!.beginPath();
          ctx!.moveTo(vx, vy);
          ctx!.lineTo(qx, qy);
          ctx!.stroke();
        }
      });

      // Labels
      ctx!.fillStyle = "rgba(245,158,11,0.7)";
      ctx!.font = "500 8px 'JetBrains Mono', monospace";
      ctx!.textAlign = "center";
      ctx!.fillText("query", qx, qy + 18);
      ctx!.fillStyle = "rgba(32,100,82,0.5)";
      ctx!.fillText("top-k match", W * 0.25, H * 0.1);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 72, display: "block" }} />;
}

/* Corol: scatter plot with regression line */
function ScatterViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    // Generate correlated data (R²=0.89)
    const points = Array.from({ length: 28 }, (_, i) => {
      const x = 0.05 + (i / 28) * 0.9 + (Math.random() - 0.5) * 0.05;
      const y = 0.1 + x * 0.85 + (Math.random() - 0.5) * 0.12;
      return { x, y: Math.min(0.95, Math.max(0.05, y)), shap: Math.random() };
    });
    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width  = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      t += 0.015;
      const PAD = 14;
      const gw  = W - PAD * 2;
      const gh  = H - PAD * 2;

      // Regression line
      ctx!.strokeStyle = "rgba(32,100,82,0.5)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(PAD, PAD + gh * (1 - 0.1));
      ctx!.lineTo(PAD + gw, PAD + gh * (1 - 0.97));
      ctx!.stroke();

      // Points
      points.forEach((p, i) => {
        const px = PAD + p.x * gw;
        const py = PAD + (1 - p.y) * gh;
        const highlight = Math.abs(Math.sin(t + i * 0.4)) > 0.85;
        ctx!.beginPath();
        ctx!.arc(px, py, highlight ? 4 : 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = highlight
          ? `rgba(32,100,82,0.9)`
          : `rgba(32,100,82,0.35)`;
        ctx!.fill();
        if (highlight) {
          ctx!.fillStyle = "rgba(32,100,82,0.6)";
          ctx!.font = "500 7px 'JetBrains Mono', monospace";
          ctx!.textAlign = "center";
          ctx!.fillText(`φ=${p.shap.toFixed(2)}`, px, py - 7);
        }
      });

      // R² label
      ctx!.fillStyle = "rgba(245,158,11,0.7)";
      ctx!.font = "600 9px 'JetBrains Mono', monospace";
      ctx!.textAlign = "left";
      ctx!.fillText("R² = 0.89", PAD + 4, PAD + 12);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 72, display: "block" }} />;
}

/* Lawline: document scanning + entity extraction viz */
function LawlineViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    const ENTITIES = ["clause", "party", "date", "obligation", "penalty", "jurisdiction"];
    const boxes = ENTITIES.map((label, i) => ({
      label,
      x: 0.05 + (i % 3) * 0.32,
      y: 0.15 + Math.floor(i / 3) * 0.55,
      w: 0.26, h: 0.3,
      conf: 0.82 + Math.random() * 0.17,
    }));
    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width  = W * (window.devicePixelRatio || 1);
      canvas!.height = H * (window.devicePixelRatio || 1);
      ctx!.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, W, H);
      t += 0.018;

      // Document background (right side)
      const docX = W * 0.62, docW = W * 0.36, docH = H * 0.9, docY = H * 0.05;
      ctx!.fillStyle = "rgba(255,255,255,0.03)";
      ctx!.fillRect(docX, docY, docW, docH);
      // Text lines on doc
      for (let row = 0; row < 9; row++) {
        const lineW = (0.5 + Math.random() * 0.45) * docW;
        ctx!.fillStyle = "rgba(255,255,255,0.07)";
        ctx!.fillRect(docX + 6, docY + 8 + row * (docH - 16) / 9, lineW, 2);
      }

      // Scanning beam
      const scanY = docY + ((t * 30) % docH);
      ctx!.fillStyle = "rgba(139,92,246,0.12)";
      ctx!.fillRect(docX, scanY - 2, docW, 5);

      // Entity boxes (left side)
      boxes.forEach((b, i) => {
        const bx = b.x * W * 0.58, by = b.y * H;
        const bw = b.w * W * 0.58, bh = b.h * H;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 0.9);
        ctx!.strokeStyle = `rgba(139,92,246,${0.25 + 0.25 * pulse})`;
        ctx!.lineWidth = 1;
        ctx!.strokeRect(bx, by, bw, bh);
        ctx!.fillStyle = `rgba(139,92,246,${0.06 + 0.04 * pulse})`;
        ctx!.fillRect(bx, by, bw, bh);
        ctx!.fillStyle = "rgba(139,92,246,0.7)";
        ctx!.font = "500 7px 'JetBrains Mono', monospace";
        ctx!.textAlign = "left";
        ctx!.fillText(b.label, bx + 4, by + 11);
        ctx!.fillStyle = "rgba(32,100,82,0.6)";
        ctx!.font = "500 7px 'JetBrains Mono', monospace";
        ctx!.fillText(`${(b.conf * 100).toFixed(0)}%`, bx + 4, by + bh - 4);
        // Arrow to doc
        ctx!.strokeStyle = "rgba(139,92,246,0.15)";
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(bx + bw, by + bh / 2);
        ctx!.lineTo(docX, docY + docH * (0.1 + i * 0.15));
        ctx!.stroke();
      });

      // Label
      ctx!.fillStyle = "rgba(139,92,246,0.55)";
      ctx!.font = "600 8px 'JetBrains Mono', monospace";
      ctx!.textAlign = "right";
      ctx!.fillText("LLM extraction", W - 4, 10);

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 80, display: "block" }} />;
}

/* ── Experience (companies worked for) ── */
const experience = [
  {
    num: "01",
    title: "Resso.ai",
    subtitle: "Real-Time AI Interview Intelligence",
    role: "Founding Engineer",
    description:
      "Built the entire production ML platform from scratch. WebRTC audio capture at 8 kHz, speaker diarization pipeline separating candidate and interviewer voices in real time, NLP feature extraction across prosody, semantics and pace, and live hire-probability scoring — all streaming inference at sub-2-second latency during a live interview. The AI rates conversations as they happen, not after.",
    extra: "Designed the talking AI avatar system: lip-sync audio-to-viseme mapping, WebSocket event bus, and on-device model quantisation for smooth real-time video rendering. The system processes every spoken word into actionable structured signals.",
    impact: "Inference latency: 8s → <2s · Job placement rate +45% · Live during interview",
    formula: "P(hire | audio, transcript, t) = σ(Wₜhₜ + b)",
    tags: ["PyTorch", "WebRTC", "Speaker Diarization", "NLP", "Docker", "AWS", "MLOps", "ONNX"],
    url: "https://www.resso.ai",
    accentColor: "#27856b",
    Viz: WaveformViz,
    screenshots: [
      { src: "/images/portfolio/resso.png", label: "Resso.ai — Real-time interview scoring platform", arch: "WebRTC · PyTorch · ONNX · AWS" },
    ],
  },
  {
    num: "02",
    title: "Corol.org & NunaFab",
    subtitle: "UHPC Strength Prediction · ML for Structural Engineering",
    role: "ML Engineer",
    description:
      "Ultra-High Performance Concrete (UHPC) meets machine learning. Working with Corol.org and NunaFab, I built compressive strength prediction models for UHPC mix designs — telling structural engineers not just what mix achieves target strength, but WHY each constituent (water-cement ratio, silica fume, fibre dosage, curing age) drives the outcome. The dataset was only 200 rows. Transfer learning from related concrete domains, aggressive feature engineering, and an SHAP-explainable gradient-boosting ensemble got R² to 0.89.",
    extra: "SHAP attribution made the model interpretable: engineers saw exact feature impact values (φᵢ) for each mix ingredient — silica fume contribution, fibre reinforcement effect, W/C ratio influence. Reduced physical lab testing cycles from weeks to a single afternoon. Screened hundreds of UHPC formulations computationally before any concrete was poured.",
    impact: "Lab cycles: weeks → one afternoon · 100s of mixes screened computationally · R² = 0.89 · SHAP-explainable",
    formula: "ŷ = Σ wₖfₖ(X) + ε     SHAP: φᵢ = E[f(X)|Xᵢ] − E[f(X)]",
    tags: ["SHAP", "XGBoost", "Scikit-learn", "Transfer Learning", "Ensemble", "Feature Engineering"],
    url: "https://www.corol.org",
    accentColor: "#27856b",
    Viz: ScatterViz,
    screenshots: [
      { src: "/images/portfolio/uhpc.png", label: "UHPC formulation prediction platform", arch: "XGBoost · SHAP attribution · R²=0.89" },
    ],
  },
];

/* ── Personal Projects / SaaS ── */
const personalProjects = [
  {
    num: "01",
    title: "Lawline.tech",
    subtitle: "Legal AI Platform for Rogers · Live SaaS · $1M Investment Conversation",
    role: "AI Engineer",
    saas: true,
    description:
      "Built the AI core for Lawline.tech — a Canadian legal research platform serving attorneys who cannot use any cloud AI due to attorney-client privilege. Built a fully local RAG stack: HNSW vector store over Canadian legal corpora, BGE cross-encoder reranker, GGUF-quantized local LLM — zero data ever leaves the office. Sub-4% hallucination rate on legal eval sets. Now in an active $1M investment conversation with the President of Rogers for enterprise licensing across Rogers' legal and compliance teams.",
    extra:
      "Designed the full pipeline: PDF ingestion → semantic chunking (512-token, 128 overlap) → local embeddings → HNSW index → top-K reranked retrieval → GGUF LLM response. Built confidence-gated output: low-confidence answers route to human review instead of surfacing to attorneys. The architecture became the sales pitch — attorneys demo'd the zero-outbound-packets screen to their law society contacts.",
    impact: "Sub-4% hallucination · Air-gapped · 0 bytes leave the office · $1M Rogers President conversation",
    formula: "E(doc) = LLM(top-k(HNSW(chunk)) + clause_template) → {party, obligation, risk, date}",
    tags: ["Legal AI", "Fine-tuning", "Document Parsing", "HNSW", "FastAPI", "TypeScript", "ONNX"],
    url: "https://lawline.tech",
    accentColor: "#8b5cf6",
    Viz: LawlineViz,
    screenshots: [
      { src: "/images/portfolio/lawline.png", label: "Lawline.tech — Live SaaS product", arch: "Fine-tuned LLM · HNSW · FastAPI" },
    ],
  },
  {
    num: "02",
    title: "MCP Integration Server",
    subtitle: "Universal Agentic Tool Layer",
    role: "Builder",
    description:
      "Every enterprise tool lives in a silo — Slack, CRMs, databases, internal APIs. AI agents need one standard to speak to all of them. I built a production MCP (Model Context Protocol) server that acts as the universal backbone. Write one integration, reach everything. The agent calls MCP; MCP speaks to the world. This is how agentic behaviour is triggered in real-world systems: LLM receives context → determines tool needed → MCP routes call → returns structured result → LLM continues reasoning.",
    extra: "Built multi-tool orchestration: parallel tool calls, retry logic, structured output parsing, and context memory integration so agents remember previous tool results across a session.",
    impact: "One server · N integrations · Agentic pipelines with persistent context memory",
    formula: "Agent(t) → [LLM + context] → MCP → {toolₙ} → structured_result → LLM",
    tags: ["MCP Protocol", "TypeScript", "Node.js", "Tool Use", "Agentic AI", "Context Memory"],
    url: null,
    accentColor: "#8b5cf6",
    Viz: MCPViz,
    screenshots: [] as { src: string; label: string; arch?: string }[],
  },
  {
    num: "03",
    title: "Vadtal — Vector DB Platform",
    subtitle: "On-Premise RAG · Private AI · Zero Data Egress",
    role: "AI Architect",
    description:
      "A religious organisation managing thousands of donors needed AI search but couldn't send a single byte to the cloud. I designed and built a complete on-premise RAG stack for Vadtal: quantized LLM running on 16 GB RAM using GGUF format, a custom HNSW vector store with semantic chunking and metadata filtering, cosine similarity scoring, and a FastAPI inference server. Everything — embedding, retrieval, generation — runs locally.",
    extra: "Built the full RAG pipeline: document ingestion → semantic chunking → embedding (local model) → HNSW index → top-k retrieval with cosine similarity → context injection → LLM response. Sub-1s end-to-end query latency, 100% private, works offline.",
    impact: "Sub-1s queries · 100% private · Fully offline · 16 GB RAM footprint",
    formula: "R(q) = top-k(cosine(E(q), Eᵢ)) → LLM(prompt + context)",
    tags: ["Local LLM", "GGUF", "HNSW", "Vector DB", "ONNX", "FastAPI", "Semantic Chunking"],
    url: null,
    accentColor: "#c8973a",
    Viz: RAGViz,
    screenshots: [] as { src: string; label: string; arch?: string }[],
  },
  {
    num: "04",
    title: "Lost and Found",
    subtitle: "TTC · Transit Capstone · Pitching to TTC Director — May 2026",
    role: "Full-Stack Engineer",
    saas: false,
    description:
      "Built a complete digital Lost & Found system for the Toronto Transit Commission — one of North America's largest transit networks serving 1.7M daily riders. The platform digitizes the entire claim lifecycle: TTC staff report found items via a mobile app, each item gets a unique QR-tagged scan record, and owners submit claims through a mobile-first portal. An AI similarity-matching engine connects found items to incoming claims using description embeddings. Pitching this to the TTC Director in May 2026.",
    extra:
      "Full pipeline: mobile item reporting → QR generation → owner claim portal → AI description similarity matching → staff approval dashboard. Built for TTC's operational constraints — works on spotty transit WiFi, handles hundreds of daily items, fully auditable claim history. Production-ready architecture, not a school demo.",
    impact: "Full claim lifecycle · AI item matching · 1.7M riders · Mobile-first · Pitching to TTC Director May 2026",
    formula: "match(claim, item) = cosine(E(desc_claim), E(desc_item)) > θ → notify_owner",
    tags: ["Next.js", "TypeScript", "AI Matching", "QR Code", "Mobile-First", "PostgreSQL", "FastAPI"],
    url: null,
    accentColor: "#c01a08",
    Viz: ScatterViz,
    screenshots: [
      { src: "/images/portfolio/LostAndFound.png", label: "TTC Lost & Found — System overview", arch: "Full-stack · AI similarity matching engine" },
    ],
  },
];

export default function Work() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
        });
      },
      { threshold: 0.04 }
    );
    el.querySelectorAll("[data-reveal-group]").forEach(g => obs.observe(g));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" ref={ref} className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Section rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }} className="reveal">
          <span className="section-index">01 //</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 10 }}>
          <span className="label-accent">Experience & Projects</span>
        </div>
        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom: 14 }}>
          Production AI systems.{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>Real companies.</span>
        </h2>
        <p className="body-lg reveal reveal-d2" style={{ maxWidth: 520, marginBottom: 64 }}>
          Every system here runs in the real world — with real users, real data,
          and real consequences when something breaks.
        </p>

        {/* ── Experience subsection ── */}
        <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600,
            letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
            Experience
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--dim)",
            letterSpacing: "0.06em" }}>Companies worked for</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 60 }}>
          {experience.map((p, i) => (
            <article
              key={p.num}
              data-reveal-group
              className={`project-card reveal reveal-d${Math.min(i + 1, 4)}`}
              style={{ borderLeft: `2px solid ${p.accentColor}22` }}
            >
              {/* Top row */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
                marginBottom: 18,
                flexWrap: "wrap",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: "var(--dim)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  minWidth: 52,
                  userSelect: "none",
                }}>
                  {p.num}
                </span>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1rem, 2vw, 1.4rem)",
                      color: "var(--white)",
                      letterSpacing: "-0.03em",
                    }}>
                      {p.title}
                    </h3>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.52rem",
                      color: p.accentColor,
                      border: `1px solid ${p.accentColor}30`,
                      padding: "2px 8px",
                      borderRadius: 2,
                      letterSpacing: "0.06em",
                    }}>
                      {p.role}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    letterSpacing: "0.04em",
                  }}>
                    {p.subtitle}
                  </div>
                </div>

                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-accent"
                    style={{ padding: "6px 14px", alignSelf: "flex-start" }}
                  >
                    Visit ↗
                  </a>
                )}
              </div>

              {/* Formula */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: p.accentColor,
                opacity: 0.65,
                marginBottom: 14,
                letterSpacing: "0.03em",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}>
                {p.formula}
              </div>

              {/* Mini visualization */}
              <div style={{
                background: `${p.accentColor}05`,
                border: `1px solid ${p.accentColor}15`,
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 16,
              }}>
                <p.Viz />
              </div>

              {/* Screenshots Gallery */}
              {"screenshots" in p && Array.isArray((p as any).screenshots) && (p as any).screenshots.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.48rem",
                    color: "var(--dim)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}>
                    Live Screenshots
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                    {(p as any).screenshots.map((img: { src: string; label: string; arch?: string }, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          flexShrink: 0,
                          width: idx === 0 ? 300 : 200,
                          borderRadius: 6,
                          overflow: "hidden",
                          border: `1px solid ${p.accentColor}30`,
                          position: "relative",
                          background: "#0a0a0a",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.label}
                          style={{
                            width: "100%",
                            display: "block",
                            height: idx === 0 ? 175 : 110,
                            objectFit: "cover",
                            opacity: 0.93,
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                          padding: "18px 9px 8px",
                        }}>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.46rem",
                            color: "#e8e8e8",
                            letterSpacing: "0.04em",
                            display: "block",
                            marginBottom: 2,
                          }}>
                            {img.label}
                          </span>
                          {img.arch && (
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.4rem",
                              color: p.accentColor,
                              letterSpacing: "0.04em",
                              display: "block",
                              opacity: 0.85,
                            }}>
                              {img.arch}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p style={{
                fontSize: "0.88rem",
                color: "var(--muted)",
                lineHeight: 1.85,
                maxWidth: 720,
                marginBottom: 12,
                fontWeight: 300,
              }}>
                {p.description}
              </p>

              {/* Extra detail */}
              <p style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                maxWidth: 720,
                marginBottom: 16,
                fontWeight: 300,
                opacity: 0.75,
                borderLeft: `2px solid ${p.accentColor}20`,
                paddingLeft: 14,
              }}>
                {p.extra}
              </p>

              {/* Impact */}
              <div style={{
                padding: "10px 16px",
                background: `${p.accentColor}07`,
                borderLeft: `2px solid ${p.accentColor}`,
                marginBottom: 16,
                borderRadius: "0 2px 2px 0",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: p.accentColor,
                  letterSpacing: "0.04em",
                }}>
                  {p.impact}
                </span>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* ── SaaS & Projects subsection ── */}
        <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600,
            letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
            SaaS Products & Projects
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--dim)",
            letterSpacing: "0.06em" }}>Live products & independent builds</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {personalProjects.map((p, i) => (
            <article
              key={`proj-${p.num}`}
              data-reveal-group
              className={`project-card reveal reveal-d${Math.min(i + 1, 4)}`}
              style={{ borderLeft: `2px solid ${p.accentColor}22` }}
            >
              {/* Top row */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
                marginBottom: 18,
                flexWrap: "wrap",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: "var(--dim)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  minWidth: 52,
                  userSelect: "none",
                }}>
                  {p.num}
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1rem, 2vw, 1.4rem)",
                      color: "var(--white)",
                      letterSpacing: "-0.03em",
                    }}>
                      {p.title}
                    </h3>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.52rem",
                      color: p.accentColor,
                      border: `1px solid ${p.accentColor}30`,
                      padding: "2px 8px",
                      borderRadius: 2,
                      letterSpacing: "0.06em",
                    }}>
                      {p.role}
                    </span>
                    {"saas" in p && p.saas && (
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5rem",
                        color: "#3dba7e",
                        background: "rgba(61,186,126,0.08)",
                        border: "1px solid rgba(61,186,126,0.25)",
                        padding: "2px 8px",
                        borderRadius: 2,
                        letterSpacing: "0.08em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3dba7e", display: "inline-block" }} />
                        LIVE SAAS
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    letterSpacing: "0.04em",
                  }}>
                    {p.subtitle}
                  </div>
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-accent"
                    style={{ padding: "6px 14px", alignSelf: "flex-start" }}
                  >
                    Visit ↗
                  </a>
                )}
              </div>

              {/* Formula */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: p.accentColor,
                opacity: 0.65,
                marginBottom: 14,
                letterSpacing: "0.03em",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}>
                {p.formula}
              </div>

              {/* Mini visualization */}
              <div style={{
                background: `${p.accentColor}05`,
                border: `1px solid ${p.accentColor}15`,
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 16,
              }}>
                <p.Viz />
              </div>

              {/* Screenshots Gallery */}
              {"screenshots" in p && Array.isArray((p as any).screenshots) && (p as any).screenshots.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.48rem",
                    color: "var(--dim)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}>
                    Live Screenshots
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                    {(p as any).screenshots.map((img: { src: string; label: string; arch?: string }, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          flexShrink: 0,
                          width: idx === 0 ? 300 : 200,
                          borderRadius: 6,
                          overflow: "hidden",
                          border: `1px solid ${p.accentColor}30`,
                          position: "relative",
                          background: "#0a0a0a",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.label}
                          style={{
                            width: "100%",
                            display: "block",
                            height: idx === 0 ? 175 : 110,
                            objectFit: "cover",
                            opacity: 0.93,
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                          padding: "18px 9px 8px",
                        }}>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.46rem",
                            color: "#e8e8e8",
                            letterSpacing: "0.04em",
                            display: "block",
                            marginBottom: 2,
                          }}>
                            {img.label}
                          </span>
                          {img.arch && (
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.4rem",
                              color: p.accentColor,
                              letterSpacing: "0.04em",
                              display: "block",
                              opacity: 0.85,
                            }}>
                              {img.arch}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p style={{
                fontSize: "0.88rem",
                color: "var(--muted)",
                lineHeight: 1.85,
                maxWidth: 720,
                marginBottom: 12,
                fontWeight: 300,
              }}>
                {p.description}
              </p>

              {/* Extra detail */}
              <p style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                maxWidth: 720,
                marginBottom: 16,
                fontWeight: 300,
                opacity: 0.75,
                borderLeft: `2px solid ${p.accentColor}20`,
                paddingLeft: 14,
              }}>
                {p.extra}
              </p>

              {/* Impact */}
              <div style={{
                padding: "10px 16px",
                background: `${p.accentColor}07`,
                borderLeft: `2px solid ${p.accentColor}`,
                marginBottom: 16,
                borderRadius: "0 2px 2px 0",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: p.accentColor,
                  letterSpacing: "0.04em",
                }}>
                  {p.impact}
                </span>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
