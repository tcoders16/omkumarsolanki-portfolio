"use client";
import { useState } from "react";

const jdMap = [
  { req: "LLM-powered agentic features", detail: "Built full multi-agent orchestration at Resso.ai on Azure OpenAI GPT-4o — state machines, barge-in detection, topic switching, silence timeout. Every conversation routed to the right agent in real time.", metric: "sub-800ms · 200+ sessions" },
  { req: "RAG over enterprise data", detail: "Built RAG from scratch for 7 enterprise clients — custom HNSW vector stores, semantic chunking, cross-encoder rerankers. All on-premise, air-gapped, GGUF-quantized models on 16 GB hardware.", metric: "sub-1s retrieval · 7 clients" },
  { req: "Agent orchestration + tool calling", detail: "Production MCP servers: agent sends tool_call JSON → Pydantic schema validation → right adapter (REST, gRPC). Retry logic, dead letter queue after 3 attempts.", metric: "4 wks → 3 days · 5 deploys" },
  { req: "Python, Go, TypeScript", detail: "Python: FastAPI, PyTorch, LangChain, LangGraph across all roles. Go: MCP server network layer, goroutines beat Python GIL for concurrent routing. TypeScript: entire Resso.ai Next.js 15 platform, Prisma ORM, WebSocket handlers.", metric: "All 3 in production" },
  { req: "AWS, Kubernetes, Kafka", detail: "AWS Academy certified: EC2, S3, Lambda, SageMaker. Kafka event pipeline across 3 hospital systems — partitioned topics, consumer groups, DLQ, exactly-once semantics. K8s: HPA, rolling updates, liveness/readiness probes.", metric: "Production across all three" },
  { req: "Schema validation + structured outputs", detail: "Pydantic BaseModel on every LLM output. Retry with constrained re-prompt. After max retries: safe default + DLQ. One of six layers that cut hallucination rate from 14% to 3.8%.", metric: "14% → 3.8% hallucination" },
  { req: "Evaluation and monitoring", detail: "Per-persona dashboards at Resso: accuracy, latency, context retention, completion rate — daily. Automated 500-doc eval pipeline at HariKrushna with regression detection on every push.", metric: "72% → 98% retention" },
  { req: "Fintech + regulated environments", detail: "7 enterprise clients: fintech, healthcare, legal — every model update required eval report and compliance sign-off before deploy. Lawline.tech: air-gapped, attorney-client privilege, zero telemetry.", metric: "7 enterprise clients" },
];

const incidentLog = [
  { time: "08:00", type: "ALERT", color: "#dc2626", text: "Production down. All agent endpoints unreachable. Founder calls." },
  { time: "08:05", type: "DEBUG", color: "#d97706", text: "Intern force-pushed to prod branch. No PR review. Vector DB connection pool broken. Agent routing crashed downstream." },
  { time: "08:12", type: "DECISION", color: "#7c3aed", text: "No direct prod patch under pressure. Took staging, wired prod PostgreSQL + vector DB + Redis, redirected prod URL to staging." },
  { time: "08:24", type: "RESOLVE", color: "#0a9280", text: "Staging serving live traffic. All endpoints responsive. Zero data loss." },
  { time: "09:15", type: "MENTOR", color: "#2563eb", text: "CEO wanted to fire intern. Intervened. Walked through root cause, PR workflow, commit signing. Saved his job." },
  { time: "12:30", type: "INTERVIEW", color: "#0a9280", text: "Amex interview. On time. Prepared. This is what production ownership looks like." },
];

export default function AmexTechFit() {
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [ressoOpen, setRessoOpen] = useState(true);
  const [corolOpen, setCorolOpen] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f7f7f5; color: #111; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.75; -webkit-font-smoothing: antialiased; }
        .shell { max-width: 900px; margin: 0 auto; padding: 52px 28px 100px; }

        .badge-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; border: 1px solid; }
        .badge-tech { color: #0a7a6a; border-color: #0a928040; background: #e4faf5; }
        .badge-co { color: #666; border-color: #d4d4ce; }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        .hero { margin-bottom: 56px; }
        .hero-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: #0a9280; margin-bottom: 14px; }
        .hero-h1 { font-family: 'Syne', sans-serif; font-size: clamp(30px, 5vw, 48px); font-weight: 800; color: #080808; line-height: 1.1; letter-spacing: -.025em; margin-bottom: 16px; }
        .hero-h1 em { color: #0a9280; font-style: normal; }
        .hero-p { font-size: 16px; color: #555; max-width: 620px; line-height: 1.75; }

        .divider { height: 1px; background: linear-gradient(90deg, #d0d0ca, transparent); margin: 52px 0; }
        .section { margin-bottom: 64px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #0a9280; margin-bottom: 8px; font-weight: 600; }
        .sh2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #0d0d0d; margin-bottom: 6px; }
        .sh3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .body-p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 12px; }
        .hl { color: #111; font-weight: 600; }
        .hl-teal { color: #0a9280; font-weight: 500; }
        .hl-amber { color: #b87000; font-weight: 500; }

        /* AUTHORITY */
        .auth-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 24px; }

        /* BREAKING NEWS TICKER - Broadcast Style */
        .ticker-wrap { position: sticky; top: 0; z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,.4); }
        .ticker-bar { background: #0d0d0d; border-bottom: 3px solid #cc0000; display: flex; align-items: stretch; overflow: hidden; height: 54px; }
        .ticker-label { flex-shrink: 0; background: #cc0000; color: #fff; padding: 0 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap; gap: 3px; min-width: 148px; }
        .ticker-label-row { display: flex; align-items: center; gap: 8px; }
        .ticker-label-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
        .ticker-label-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #ffd0d0; }
        .ticker-label-dot { width: 10px; height: 10px; border-radius: 50%; background: #fff; animation: tickerblink .8s infinite; flex-shrink: 0; }
        @keyframes tickerblink { 0%,100% { opacity:1; } 50% { opacity:0.05; } }
        .ticker-divider { width: 3px; background: #2a2a2a; flex-shrink: 0; }
        .ticker-track { flex: 1; overflow: hidden; display: flex; align-items: center; }
        .ticker-inner { display: flex; align-items: center; animation: tickerscroll 46s linear infinite; white-space: nowrap; }
        .ticker-inner:hover { animation-play-state: paused; }
        @keyframes tickerscroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-item { display: inline-flex; align-items: center; gap: 12px; padding: 0 44px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; color: #c8c8c8; line-height: 1; }
        .ticker-item strong { color: #ffffff; font-weight: 700; }
        .t-red { color: #ff6b6b; font-weight: 700; }
        .ticker-sep { color: #cc0000; font-size: 18px; padding: 0 4px; line-height: 1; font-weight: 700; }

        /* LAWLINE COMPONENT */
        .lawline-card { background: #fff; border: 1.5px solid #e8321424; border-radius: 16px; overflow: hidden; margin-top: 0; }
        .lawline-header { background: linear-gradient(135deg, #fff5f5, #fffcfc); border-bottom: 1px solid #e8321418; padding: 22px 26px 18px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .lawline-brand { display: flex; align-items: center; gap: 13px; }
        .lawline-icon { width: 46px; height: 46px; border-radius: 11px; background: #cc0000; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; letter-spacing: -.02em; }
        .lawline-name { font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 800; color: #111; letter-spacing: -.02em; }
        .lawline-tagline { font-size: 13px; color: #888; margin-top: 3px; }
        .lawline-live-badge { display: flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #0a9280; background: #e4faf5; border: 1px solid #0a928040; border-radius: 20px; padding: 5px 13px; white-space: nowrap; align-self: flex-start; margin-top: 4px; }
        .lawline-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #0a9280; animation: blink 1.5s infinite; flex-shrink: 0; }
        .lawline-body { padding: 22px 26px 26px; }
        .lawline-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }
        .lawline-col { background: #fafaf8; border: 1px solid #e8e8e2; border-radius: 10px; padding: 16px 18px; }
        .lawline-col-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: #c01a08; font-weight: 700; margin-bottom: 9px; }
        .lawline-col-text { font-size: 13px; color: #555; line-height: 1.75; }
        .lawline-col-text strong { color: #111; font-weight: 600; }
        .lawline-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px; }
        .lawline-metric { background: #fafaf8; border: 1px solid #e8e8e2; border-radius: 10px; padding: 14px 16px; }
        .lawline-metric-n { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #c01a08; letter-spacing: -.02em; }
        .lawline-metric-l { font-size: 11px; color: #888; margin-top: 3px; line-height: 1.4; }

        /* FULL-SPECTRUM BREADTH GRID */
        .breadth-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
        .breadth-row { display: flex; align-items: flex-start; gap: 0; background: #fff; border: 1px solid #e0e0da; border-radius: 10px; overflow: hidden; }
        .breadth-cat { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; min-width: 130px; padding: 13px 16px; background: #fafaf8; border-right: 1px solid #e8e8e2; display: flex; align-items: center; }
        .breadth-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; align-items: center; }
        .breadth-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555; background: #f4f4f1; border: 1px solid #e0e0da; border-radius: 5px; padding: 3px 9px; }
        .bt-hi { color: #0a7a6a; background: #e4faf5; border-color: #0a928030; font-weight: 600; }
        .bt-blue { color: #1d4ed8; background: #eff6ff; border-color: #3b82f630; font-weight: 600; }
        .bt-purple { color: #6d28d9; background: #f5f3ff; border-color: #8b5cf630; font-weight: 600; }
        .bt-amber { color: #b87000; background: #fffbeb; border-color: #d9920030; font-weight: 600; }
        .bt-red { color: #dc2626; background: #fef2f2; border-color: #dc262630; font-weight: 600; }
        .bt-cyan { color: #0e7490; background: #ecfeff; border-color: #0891b230; font-weight: 600; }
        @media (max-width: 640px) { .auth-grid { grid-template-columns: 1fr; } }
        .auth-card { background: #fff; border: 1px solid #e0e0da; border-radius: 14px; overflow: hidden; transition: box-shadow .2s, transform .2s; }
        .auth-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,.07); transform: translateY(-3px); }
        .auth-img-zone { width: 100%; aspect-ratio: 16/7; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .auth-img-zone img { width: 100%; height: 100%; object-fit: contain; padding: 20px 44px; }
        .auth-img-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; padding: 16px 18px; }
        .auth-org { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 5px; }
        .auth-chip { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; font-weight: 600; border: 1px solid; }
        .auth-body { padding: 18px 20px 22px; }
        .auth-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #111; margin-bottom: 9px; line-height: 1.3; }
        .auth-desc { font-size: 14px; color: #555; line-height: 1.8; }
        .auth-desc strong { color: #1a1a1a; font-weight: 600; }
        .auth-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .auth-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 9px; border-radius: 4px; border: 1px solid; font-weight: 500; }
        .auth-status { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; }
        .auth-dot { width: 6px; height: 6px; border-radius: 50%; animation: blink 2s infinite; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }

        /* INCIDENT TIMELINE */
        .incident-card { background: #fff; border: 1px solid #e0e0da; border-radius: 14px; padding: 26px; position: relative; overflow: hidden; }
        .incident-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg, #f59e0b, #0a9280); }
        .i-badge { display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #b87000; background: #fffbeb; border: 1px solid #d9920050; border-radius: 5px; padding: 4px 10px; margin-bottom: 12px; font-weight: 600; }
        .i-h { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700; color: #0d0d0d; margin-bottom: 6px; }
        .i-sub { font-size: 14px; color: #666; margin-bottom: 20px; }
        .tl { padding-left: 26px; position: relative; }
        .tl::before { content:''; position:absolute; left:6px; top:6px; bottom:6px; width:1px; background: linear-gradient(to bottom, #f59e0b, #0a9280); }
        .tl-item { position:relative; margin-bottom: 18px; }
        .tl-item:last-child { margin-bottom: 0; }
        .tl-item::before { content:''; position:absolute; left:-21px; top:5px; width:9px; height:9px; border-radius:50%; border:2px solid #f59e0b; background:#f4f4f1; }
        .tl-item:last-child::before { border-color: #0a9280; }
        .tl-t { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #b87000; margin-bottom: 3px; font-weight: 600; }
        .tl-item:last-child .tl-t { color: #0a9280; }
        .tl-txt { font-size: 14px; color: #555; line-height: 1.7; }
        .tl-txt strong { color: #111; font-weight: 600; }
        .pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .pillar { background: #fff; border: 1px solid #e0e0da; border-radius: 9px; padding: 18px; }
        .pillar-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 5px; }
        .pillar-text { font-size: 13px; color: #666; line-height: 1.65; }

        /* JD MAP */
        .jd-list { display: flex; flex-direction: column; gap: 3px; }
        .jd-row { background: #fff; border: 1px solid #e4e4df; border-radius: 9px; overflow: hidden; cursor: pointer; transition: border-color .15s; }
        .jd-row:hover { border-color: #0a928040; }
        .jd-row.open { border-color: #0a928060; }
        .jd-top { display: flex; align-items: center; gap: 12px; padding: 14px 18px; }
        .jd-chk { width: 22px; height: 22px; border-radius: 50%; background: #0a9280; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; font-weight: 700; flex-shrink: 0; }
        .jd-req { font-size: 14px; font-weight: 500; color: #111; flex: 1; }
        .jd-metric { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #0a7a6a; background: #e4faf5; border: 1px solid #0a928050; padding: 3px 9px; border-radius: 5px; white-space: nowrap; font-weight: 600; }
        .jd-arr { font-size: 12px; color: #999; transition: transform .2s; flex-shrink: 0; }
        .jd-row.open .jd-arr { transform: rotate(180deg); color: #0a9280; }
        .jd-detail { padding: 4px 18px 14px 52px; font-size: 13.5px; color: #555; line-height: 1.75; border-top: 1px solid #ebebeb; padding-top: 12px; animation: fd .15s ease; }
        @keyframes fd { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }

        /* WORK CARDS */
        .work-card { border: 1px solid #e0e0da; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
        .wc-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; cursor: pointer; background: #fafaf8; gap: 16px; transition: background .15s; }
        .wc-header:hover { background: #f4f4f1; }
        .wc-left { display: flex; align-items: center; gap: 14px; }
        .wc-init { width: 40px; height: 40px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; flex-shrink: 0; }
        .wc-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #0d0d0d; }
        .wc-role { font-size: 12px; color: #777; margin-top: 1px; }
        .wc-right { display: flex; align-items: center; gap: 10px; }
        .wc-period { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #aaa; }
        .wc-arrow { font-size: 13px; color: #999; transition: transform .2s; }
        .work-card.open .wc-arrow { transform: rotate(180deg); color: #0a9280; }
        .wc-body { padding: 24px 22px 28px; border-top: 1px solid #ebebeb; background: #f4f4f1; animation: fd .2s ease; }

        .chips-row { display: flex; flex-wrap: wrap; gap: 9px; margin: 16px 0; }
        .chip { background: #fff; border: 1px solid #e0e0da; border-radius: 7px; padding: 8px 12px; min-width: 90px; }
        .chip-n { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; }
        .chip-l { font-size: 11px; color: #777; margin-top: 1px; }

        .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
        .spec-card { background: #fff; border: 1px solid #e0e0da; border-radius: 9px; padding: 16px; }
        .spec-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 5px; font-family: 'JetBrains Mono', monospace; letter-spacing: .02em; }
        .spec-text { font-size: 13px; color: #555; line-height: 1.65; }
        .spec-text code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #0a7a6a; background: #e4faf5; padding: 1px 5px; border-radius: 3px; }

        .align-block { border-radius: 10px; padding: 18px 20px; margin-top: 20px; border: 1px solid; }
        .align-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; }
        .align-text { font-size: 14px; color: #555; line-height: 1.8; }
        .align-text strong { color: #111; font-weight: 600; }

        /* TERMINAL */
        .terminal { background: #fff; border: 1px solid #e0e0da; border-radius: 12px; overflow: hidden; }
        .t-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-bottom: 1px solid #ebebeb; background: #f4f4f1; }
        .t-dot { width: 10px; height: 10px; border-radius: 50%; }
        .t-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #888; margin-left: 6px; }
        .t-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
        .log { display: flex; gap: 10px; align-items: flex-start; }
        .log-time { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #aaa; min-width: 42px; padding-top: 3px; flex-shrink: 0; }
        .log-type { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .05em; text-transform: uppercase; padding: 3px 7px; border-radius: 4px; min-width: 68px; text-align: center; flex-shrink: 0; font-weight: 700; margin-top: 2px; }
        .log-msg { font-size: 13px; color: #555; line-height: 1.65; flex: 1; }
        .log-msg strong { color: #111; font-weight: 600; }

        /* STACK */
        .stack-wrap { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; }
        .stack-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 5px; border: 1px solid #e0e0da; background: #fff; color: #555; }
        .stack-tag.primary { background: #e4faf5; border-color: #0a928040; color: #0a7a6a; font-weight: 600; }

        /* VIDEO */
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
        .video-card { border: 1px solid #e0e0da; border-radius: 12px; overflow: hidden; cursor: pointer; background: #fff; transition: box-shadow .2s, transform .18s; }
        .video-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.07); transform: translateY(-3px); }
        .video-thumb { aspect-ratio: 16/8; display: flex; align-items: center; justify-content: center; }
        .play-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .play-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; transition: transform .2s; }
        .video-card:hover .play-btn { transform: scale(1.1); }
        .v-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; }
        .v-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .14em; }
        .v-info { padding: 12px 16px; border-top: 1px solid #ebebeb; }
        .v-title { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 3px; }
        .v-desc { font-size: 11px; color: #888; }

        /* MODAL */
        .overlay { position:fixed; inset:0; background:#000000cc; z-index:999; display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal { background:#fff; border-radius:14px; overflow:hidden; width:100%; max-width:780px; }
        .modal-top { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-bottom:1px solid #ebebeb; }
        .modal-ttl { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111; }
        .modal-x { width:28px; height:28px; border-radius:50%; background:#eeeeea; border:none; color:#777; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; }
        .modal-x:hover { background:#e0e0da; color:#111; }
        .modal-body { aspect-ratio:16/9; background:#f4f4f1; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px; }
        .modal-body p { font-family:'JetBrains Mono',monospace; font-size:11px; color:#aaa; }


        /* CTA BUTTONS */
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: #0a9280; color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; padding: 12px 26px; border-radius: 8px; text-decoration: none; transition: background .2s, transform .15s; }
        .cta-btn:hover { background: #087a6a; transform: translateY(-1px); }
        .cta-btn-ghost { background: transparent; color: #0a9280; border: 2px solid #0a928040; }
        .cta-btn-ghost:hover { background: #0a928010; transform: translateY(-1px); }

        /* CTA */
        .cta { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, #e4faf5, #f2fefb); border: 1px solid #0a928050; border-radius: 14px; padding: 28px 32px; margin-top: 52px; gap: 24px; flex-wrap: wrap; }
        .cta-h { font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 800; color: #0d0d0d; margin-bottom: 4px; }
        .cta-p { font-size: 14px; color: #666; }
        .cta-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .cta-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #0a7a6a; background: #fff; border: 1px solid #0a928040; border-radius: 5px; padding: 4px 10px; font-weight: 600; }

        .back { font-family:'JetBrains Mono',monospace; font-size:10px; color:#aaa; text-decoration:none; letter-spacing:.05em; margin-bottom:26px; display:inline-flex; align-items:center; gap:6px; transition:color .2s; }
        .back:hover { color:#0a9280; }


        @media (max-width: 640px) {
          .shell { padding: 28px 16px 60px; }
          .auth-grid, .spec-grid, .video-grid, .pillars, .lawline-cols, .lawline-metrics { grid-template-columns: 1fr; }
          .breadth-cat { min-width: 90px; font-size: 8px; }
          .cta { flex-direction: column; }
        }
      `}</style>


      {/* BREAKING NEWS TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <div className="ticker-label">
            <div className="ticker-label-row">
              <span className="ticker-label-dot" />
              <span className="ticker-label-title">Breaking</span>
            </div>
            <div className="ticker-label-sub">News Live</div>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-track">
            <div className="ticker-inner">
              {[
                <><span className="t-red">BREAKING</span> &mdash; Omkumar Solanki in active <strong>$1M investment conversation</strong> with President of Rogers around Lawline.tech</>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">BREAKING</span> &mdash; Capstone: <strong>AI Lost &amp; Found for TTC</strong> &mdash; pitch to Director of TTC scheduled <strong>May 2026</strong></>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">THIS MORNING</span> &mdash; Production outage 8 AM interview day &mdash; <strong>resolved in 24 min</strong>, zero data loss, made the interview on time</>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">LIVE</span> &mdash; Lawline.tech: legal AI platform, <strong>sub-4% hallucination</strong>, scaling to enterprise licensing at Rogers</>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">BREAKING</span> &mdash; Omkumar Solanki in active <strong>$1M investment conversation</strong> with President of Rogers around Lawline.tech</>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">BREAKING</span> &mdash; Capstone: <strong>AI Lost &amp; Found for TTC</strong> &mdash; pitch to Director of TTC scheduled <strong>May 2026</strong></>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">THIS MORNING</span> &mdash; Production outage 8 AM interview day &mdash; <strong>resolved in 24 min</strong>, zero data loss, made the interview on time</>,
                <><span className="ticker-sep">&#9670;</span></>,
                <><span className="t-red">LIVE</span> &mdash; Lawline.tech: legal AI platform, <strong>sub-4% hallucination</strong>, scaling to enterprise licensing at Rogers</>,
                <><span className="ticker-sep">&#9670;</span></>,
              ].map((item, i) => (
                <span key={i} className="ticker-item">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="shell">
        <a href="/" className="back">← back</a>

        <div className="badge-row">
          <span className="badge badge-tech"><span className="dot" />Tech Review</span>
          <span className="badge badge-co">American Express · AI Engineer I · Agentic AI · 26003145</span>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">American Express · Job ID 26003145 · AI Engineer I · Technical Review</div>
          <h1 className="hero-h1">8 requirements in the JD.<br /><em>8 systems in production.</em></h1>
          <p className="hero-p">This is not a skills summary. It is a direct map from Amex's requirements to production systems I built, deployed, and operate today. Every line is evidence.</p>
        </div>

        <div className="divider" />

        {/* LEADERSHIP STRIP */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 52 }}>
          {[
            { label: "8 AM outage · Fixed in 24 min", detail: "Production down on interview morning. Diagnosed, resolved, zero data loss. On time.", accent: '#dc2626' },
            { label: "CEO said fire him · I said mentor", detail: "Turned a termination into a teaching moment. Root cause, PR workflow, commit discipline.", accent: '#0a9280' },
            { label: "TTC Director · May 2026", detail: "AI Lost and Found system — pitching to TTC Director this May. 1.7M daily riders.", accent: '#b87000' },
            { label: "$1M conversation · Rogers President", detail: "Active investment discussion with the President of Rogers around Lawline.tech.", accent: '#c01a08' },
          ].map((p, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0e0da', borderLeft: `4px solid ${p.accent}`, borderRadius: 10, padding: '14px 18px', flex: '1 1 200px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{p.detail}</div>
            </div>
          ))}
        </div>

        {/* AUTHORITY */}
        <div className="section">
          <div className="eyebrow">Operating Above the Title</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Pitching to directors and presidents — before any career required it.</div>
          <p className="body-p" style={{ marginBottom: 0 }}>A deployment-ready AI system for 1.7M TTC riders — pitched to the Director. A $1M commercial conversation with the President of Rogers. These are not networking stories. They are proof of operating at a level most engineers reach years later, if at all.</p>

          <div className="auth-grid">
            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: 'linear-gradient(135deg, #fefce8, #f9f7e8)' }}>
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Toronto_Transit_Commission_logo.svg/1200px-Toronto_Transit_Commission_logo.svg.png" alt="TTC" style={{ opacity: .28 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, #fefce8f2 40%, transparent)' }}>
                  <div className="auth-org" style={{ color: '#7a5800' }}>TTC</div>
                  <span className="auth-chip" style={{ color: '#7a5800', background: '#f5e9b8', borderColor: '#c8a030' }}>Capstone · Pitching May 2026</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">AI system for 1.7M riders — deployment-ready, pitched to the Director</div>
                <div className="auth-desc">
                  <strong>1.7M passengers daily.</strong> Their lost-and-found: paper logs, phone calls, zero search intelligence. I built the replacement — <strong>vector similarity search over live inventory</strong>, SMS claim tracking, self-serve portal, staff triage dashboard. 3x faster resolution. Pitching the Director in May 2026. Not a prototype. A deployable product.
                </div>
                <div className="auth-tags">
                  <span className="auth-tag" style={{ color: '#7a5800', borderColor: '#c8a03050', background: '#fefce8' }}>TTC Director · May 2026</span>
                  <span className="auth-tag" style={{ color: '#7a5800', borderColor: '#c8a03050', background: '#fefce8' }}>1.7M Riders</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Vector Search</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>FastAPI</span>
                </div>
                <div className="auth-status" style={{ color: '#7a5800' }}>
                  <span className="auth-dot" style={{ background: '#7a5800' }} />Pitch Scheduled · May 2026
                </div>
              </div>
            </div>

            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: 'linear-gradient(135deg, #fff1f0, #f9f7f7)' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Rogers_logo.svg/1200px-Rogers_logo.svg.png" alt="Rogers" style={{ opacity: .22 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, #fff1f0f2 40%, transparent)' }}>
                  <div className="auth-org" style={{ color: '#c01a08' }}>Rogers</div>
                  <span className="auth-chip" style={{ color: '#c01a08', background: '#fde0db', borderColor: '#e8321460' }}>$1M Investment · Rogers President</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">$1M investment conversation with the President of a $15B company — before any title required it</div>
                <div className="auth-desc">
                  Rogers: <strong>$15B in annual revenue.</strong> Direct connection to their President — active <strong>$1M investment discussion</strong> around <a href="https://www.lawline.tech" target="_blank" rel="noopener" style={{ color: '#c01a08', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Lawline.tech ↗</a>: <strong>RAG over Canadian legal corpora, air-gapped, sub-4% hallucination</strong>. Enterprise licensing for Rogers' legal and compliance teams, B2B resale path. A real commercial conversation — not a cold pitch.
                </div>
                <div className="auth-tags">
                  <span className="auth-tag" style={{ color: '#c01a08', borderColor: '#e8321440', background: '#fff5f5' }}>$1M Investment · Rogers</span>
                  <span className="auth-tag" style={{ color: '#c01a08', borderColor: '#e8321440', background: '#fff5f5' }}>$15B Company</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Legal AI</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Air-Gapped RAG</span>
                </div>
                <div className="auth-status" style={{ color: '#c01a08' }}>
                  <span className="auth-dot" style={{ background: '#c01a08' }} />Investment Conversation Active
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* LAWLINE.TECH */}
        <div className="section">
          <div className="eyebrow">Founder · Builder · Operator</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Lawline.tech — custom RAG stack, air-gapped, already in a $1M investment conversation.</div>
          <p className="body-p" style={{ marginBottom: 18 }}>
            No third-party legal APIs. No OpenAI in prod. A fully custom RAG pipeline — HNSW retrieval, GGUF-quantized models, cross-encoder reranking, Pydantic validation on every output. Hallucination rate: <strong style={{ color: '#c01a08' }}>14% → 3.8%</strong> through six layers of validation. Now in an active <strong>$1M investment conversation</strong> with the President of Rogers.
          </p>
          <div className="lawline-card">
            <div className="lawline-header">
              <div className="lawline-brand">
                <div className="lawline-icon">L</div>
                <div>
                  <div className="lawline-name"><a href="https://www.lawline.tech" target="_blank" rel="noopener" style={{ color: '#c01a08', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 700 }}>Lawline.tech ↗</a></div>
                  <div className="lawline-tagline">RAG pipeline over Canadian legal corpora &mdash; air-gapped &middot; enterprise-licensed</div>
                </div>
              </div>
              <div className="lawline-live-badge">
                <span className="lawline-live-dot" />
                Live &middot; Active Users
              </div>
            </div>
            <div className="lawline-body">
              <div className="lawline-cols">
                <div className="lawline-col">
                  <div className="lawline-col-label">Retrieval Layer</div>
                  <div className="lawline-col-text"><strong>HNSW vector store</strong>, semantic chunking (512-token, 128 overlap), BGE cross-encoder reranker. Top-K=12 candidates → reranked to 4. Sub-1s retrieval over 200K+ legal documents.</div>
                </div>
                <div className="lawline-col">
                  <div className="lawline-col-label">Generation Layer</div>
                  <div className="lawline-col-text"><strong>GGUF-quantized LLMs</strong> on 16GB hardware. Pydantic BaseModel on every output — constrained re-prompt on failure, DLQ after max retries. Hallucination rate: <strong>14% → 3.8%</strong>.</div>
                </div>
                <div className="lawline-col">
                  <div className="lawline-col-label">Deployment</div>
                  <div className="lawline-col-text"><strong>Air-gapped, zero telemetry</strong>, attorney-client privilege mode. FastAPI + Next.js 15. On-prem deployment on client hardware. <strong>Zero cloud dependency</strong> in production enterprise mode.</div>
                </div>
              </div>
              <div className="lawline-metrics">
                <div className="lawline-metric">
                  <div className="lawline-metric-n">3.8%</div>
                  <div className="lawline-metric-l">Hallucination on legal eval sets</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">&lt;1s</div>
                  <div className="lawline-metric-l">RAG retrieval latency</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">$1M</div>
                  <div className="lawline-metric-l">Rogers investment conversation</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">0</div>
                  <div className="lawline-metric-l">Telemetry &middot; cloud calls in prod</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* PRODUCTION INCIDENT */}
        <div className="section">
          <div className="eyebrow">Leadership Under Pressure</div>
          <div className="sh2" style={{ marginBottom: 18 }}>The morning of this interview</div>

          <div className="incident-card">
            <div className="i-badge">March 17, 2026 · 8:00 AM · Interview at 12:30 PM · 4.5 hours of runway</div>
            <div className="i-h">Production broke. I fixed it. Then I showed up.</div>
            <div className="i-sub">Our platform went down on the most important morning of my career. Here is exactly what happened.</div>

            <div className="tl">
              <div className="tl-item">
                <div className="tl-t">8:00 AM — The call</div>
                <div className="tl-txt">Founder calls. Production is down. First move — <strong>call the intern</strong> and ask calmly: what did you push last night?</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">8:10 AM — Root cause</div>
                <div className="tl-txt">He <strong>force-pushed to production</strong> without review. Vector DB connection pool broke. Agent routing crashed downstream.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">8:20 AM — Decision</div>
                <div className="tl-txt"><strong>Did not patch prod under pressure.</strong> Spun up staging, wired it to production databases, redirected live traffic. Customers back in minutes.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">9:00 AM — Restored</div>
                <div className="tl-txt"><strong>Zero data loss. Zero session interruption.</strong> Founder confirmed. Proper rollback running in parallel.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">9:15 AM — Harder conversation</div>
                <div className="tl-txt">CEO wanted to fire the intern. I stepped in — walked him through what broke, set a clear standard, and <strong>saved his job</strong>.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">12:30 PM — This interview</div>
                <div className="tl-txt"><strong>On time. Prepared. Calm.</strong> This is what owning production looks like.</div>
              </div>
            </div>
          </div>

          <div className="pillars" style={{ marginTop: 18 }}>
            <div className="pillar">
              <div className="pillar-title">Service before code. Every time.</div>
              <div className="pillar-text">Prod was back online before the root cause was fixed. Customers never knew it happened. That is the right order of operations.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Interview in 4 hours. Zero panic.</div>
              <div className="pillar-text">Production down at 8 AM, Amex interview at noon. Root cause in 5 minutes, service restored in 24. Walked into the room composed.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">The CEO said fire him. I said teach him.</div>
              <div className="pillar-text">Root cause, PR workflow, commit discipline. Accountability and belief held at the same time. He is still on the team.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Redirected prod in minutes. Because I built it.</div>
              <div className="pillar-text">Knew exactly which wire to pull — because I laid every wire. Ownership is not a title. It is what happens when no one else can fix it.</div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* JD MAP */}
        <div className="section">
          <div className="eyebrow">JD Match · 8 of 8 Requirements</div>
          <div className="sh2" style={{ marginBottom: 8 }}>What Amex needs. What I have shipped. Every single one.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #0a928030', borderRadius: 10, padding: '12px 18px', marginBottom: 22 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#0a9280', whiteSpace: 'nowrap' as const }}>8 / 8 matched</div>
            <div style={{ flex: 1, height: 6, background: '#e8e8e2', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #0a9280, #0fc4a7)', borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#0a928090', whiteSpace: 'nowrap' as const }}>100% · all in production</div>
          </div>

          <div className="jd-list">
            {jdMap.map((item, i) => (
              <div key={i} className={`jd-row ${expanded === i ? "open" : ""}`} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="jd-top">
                  <div className="jd-chk">✓</div>
                  <div className="jd-req">{item.req}</div>
                  <div className="jd-metric">{item.metric}</div>
                  <span className="jd-arr">▾</span>
                </div>
                {expanded === i && <div className="jd-detail">{item.detail}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* RESSO DEEP DIVE */}
        <div className="section">
          <div className="eyebrow">Current Role · Deep Dive</div>
          <div className="sh2" style={{ marginBottom: 18 }}>Resso.ai — technically</div>

          <div className={`work-card ${ressoOpen ? "open" : ""}`}>
            <div className="wc-header" onClick={() => setRessoOpen(!ressoOpen)}>
              <div className="wc-left">
                <div className="wc-init" style={{ background: '#e4faf5', color: '#0a7a6a', border: '1px solid #0a928030' }}>R</div>
                <div>
                  <div className="wc-name">Resso.ai</div>
                  <div className="wc-role">AI Engineer · Agent Orchestration · Azure OpenAI · 2023–Present</div>
                </div>
              </div>
              <div className="wc-right">
                <span className="wc-period">Full-time</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {ressoOpen && (
              <div className="wc-body">
                <p className="body-p">
                  Real-time AI conversation platform. I architected and built the entire AI layer — <span className="hl">orchestration, memory, persona engine, evaluation</span>. Everything that makes it intelligent, aware, and fast under load.
                </p>

                <div className="chips-row">
                  {[
                    { n: "sub-800ms", l: "Latency" },
                    { n: "200+", l: "Live sessions" },
                    { n: "72%→98%", l: "Context retention" },
                    { n: "3.8%", l: "Hallucination rate" },
                  ].map((m, i) => (
                    <div key={i} className="chip">
                      <div className="chip-n" style={{ color: '#0a7a6a' }}>{m.n}</div>
                      <div className="chip-l">{m.l}</div>
                    </div>
                  ))}
                </div>

                <div className="sh3" style={{ marginTop: 22 }}>Architecture decisions</div>
                <div className="spec-grid">
                  <div className="spec-card">
                    <div className="spec-title">Multi-Agent Routing</div>
                    <div className="spec-text">State machine over conversation events. <code>barge_in</code>, <code>topic_switch</code>, <code>silence_timeout</code> each trigger a different sub-agent. All invisible to the user.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">Vector Session Memory</div>
                    <div className="spec-text"><code>HNSW</code> index per session. Only relevant past turns retrieved — no context overflow, no lost thread even at turn 80+.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">Redis Hot Path</div>
                    <div className="spec-text">Active session state in <code>Redis</code>. Cold sessions evicted to PostgreSQL. Sub-50ms state reads under concurrent load.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">Persona Template Engine</div>
                    <div className="spec-text">Each client: versioned <code>persona.json</code> — tone, knowledge base, tool access, eval thresholds. Changing one never affects others.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#e4faf5', borderColor: '#0a928040' }}>
                  <div className="align-label" style={{ color: '#0a9280' }}>Amex alignment</div>
                  <div className="align-text">Amex agents handle financial conversations — disputes, fraud alerts, account queries. <strong>Same architecture. Higher stakes.</strong> Multi-agent routing, session memory, live eval tooling — all already built and running.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COROL DEEP DIVE */}
        <div className="section">
          <div className="eyebrow">ML Deployment · Domain Learning</div>
          <div className="sh2" style={{ marginBottom: 18 }}>Corol / NunaFab — technically</div>

          <div className={`work-card ${corolOpen ? "open" : ""}`}>
            <div className="wc-header" onClick={() => setCorolOpen(!corolOpen)}>
              <div className="wc-left">
                <div className="wc-init" style={{ background: '#fffbeb', color: '#9a6000', border: '1px solid #d9920040' }}>C</div>
                <div>
                  <div className="wc-name">Corol / NunaFab</div>
                  <div className="wc-role">ML Engineer · UHPC Strength Prediction · 2023–2024</div>
                </div>
              </div>
              <div className="wc-right">
                <span className="wc-period">Contract</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {corolOpen && (
              <div className="wc-body">
                <p className="body-p">
                  UHPC concrete strength prediction. Entered a domain I knew nothing about, learned it, built an ML model scientists trusted, shipped it as a <span className="hl-amber">production daily tool</span> used by 12 engineers.
                </p>

                <div className="chips-row">
                  {[
                    { n: "R² 0.73", l: "Accuracy" },
                    { n: "2,200", l: "Samples" },
                    { n: "12", l: "Daily users" },
                    { n: "2 sec", l: "Prediction" },
                  ].map((m, i) => (
                    <div key={i} className="chip">
                      <div className="chip-n" style={{ color: '#b87000' }}>{m.n}</div>
                      <div className="chip-l">{m.l}</div>
                    </div>
                  ))}
                </div>

                <div className="sh3" style={{ marginTop: 22 }}>Technical decisions</div>
                <div className="spec-grid">
                  <div className="spec-card">
                    <div className="spec-title">Model Selection</div>
                    <div className="spec-text">Random Forest over XGBoost — better variance stability on small dataset (2,200 samples). 150 estimators, max depth 10, cross-validated over 5 folds.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">Feature Engineering + Trust</div>
                    <div className="spec-text">SHAP feature importance showed water-cement ratio as top predictor — matching domain expert intuition. Scientists trusted it because it reflected their knowledge.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">FastAPI + React Deployment</div>
                    <div className="spec-text"><code>POST /predict</code> endpoint, Pydantic input schema, joblib model serialization. React dashboard with real-time result display and mix comparison.</div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-title">Business Metric Focus</div>
                    <div className="spec-text">Goal was not R² — it was hours saved per week and fewer physical tests. Measured both. Delivered both.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#fffbeb', borderColor: '#d9920040' }}>
                  <div className="align-label" style={{ color: '#b87000' }}>Amex alignment</div>
                  <div className="align-text">
                    At Amex I will learn financial domain fast — same way I learned concrete science. <strong>Sit with experts, earn trust, build tools they actually use.</strong> The pattern is identical.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* INCIDENT */}
        <div className="section">
          <div className="eyebrow">Production Incident · March 17, 2026 · 8:00 AM</div>
          <div className="sh2" style={{ marginBottom: 18 }}>The morning of this interview — raw incident log, unedited</div>

          <div className="terminal">
            <div className="t-bar">
              <div className="t-dot" style={{ background: '#dc2626' }} />
              <div className="t-dot" style={{ background: '#f59e0b' }} />
              <div className="t-dot" style={{ background: '#22c55e' }} />
              <div className="t-label">prod-incident · 2026-03-17</div>
            </div>
            <div className="t-body">
              {incidentLog.map((l, i) => (
                <div key={i} className="log">
                  <div className="log-time">{l.time}</div>
                  <div className="log-type" style={{ color: l.color, background: l.color + '15', border: `1px solid ${l.color}30` }}>{l.type}</div>
                  <div className="log-msg">{l.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STACK */}
        <div className="section">
          <div className="eyebrow">Full-Spectrum Engineer</div>
          <div className="sh2" style={{ marginBottom: 6 }}>iOS to blockchain, CI/CD to cloud — every layer, every time.</div>
          <p className="body-p" style={{ marginBottom: 20 }}>Deep in AI/ML. Wide across the entire stack. I don&apos;t hand off to specialists — I understand every layer and bridge it back to what the business needs.</p>

          <div className="breadth-grid">
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#0a9280' }}>AI / ML</div>
              <div className="breadth-tags">
                {['Python','PyTorch','LangGraph','LangChain','GPT-4o','GGUF Quant','HNSW','RAG','Pydantic','Cross-encoder Reranker'].map(t => <span key={t} className="breadth-tag bt-hi">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#1d4ed8' }}>Cloud &amp; Infra</div>
              <div className="breadth-tags">
                {['Azure OpenAI','Azure Slots Deploy','AWS EC2/S3/Lambda','SageMaker','Kubernetes HPA','Docker','Rolling Updates','Liveness/Readiness Probes'].map(t => <span key={t} className="breadth-tag bt-blue">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#6d28d9' }}>CI/CD</div>
              <div className="breadth-tags">
                {['GitHub Actions','K8s Rolling Deploys','Staging → Prod pipelines','Blue/Green','Docker Compose','Automated eval on push'].map(t => <span key={t} className="breadth-tag bt-purple">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#0a9280' }}>Backend</div>
              <div className="breadth-tags">
                {['FastAPI','Go (goroutines)','Node.js','PostgreSQL','Redis','Kafka','gRPC','REST','WebSocket','Prisma ORM','DLQ'].map(t => <span key={t} className="breadth-tag bt-hi">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#b87000' }}>Frontend</div>
              <div className="breadth-tags">
                {['Next.js 15','React','TypeScript','Tailwind CSS','Real-time WS UI','Eval dashboards'].map(t => <span key={t} className="breadth-tag bt-amber">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#6d28d9' }}>Mobile</div>
              <div className="breadth-tags">
                {['iOS','Swift','SwiftUI','Mobile-first architecture'].map(t => <span key={t} className="breadth-tag bt-purple">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#0e7490' }}>Blockchain</div>
              <div className="breadth-tags">
                {['Solidity','Smart Contracts','Web3.js','Ethereum','Token standards','DApp architecture'].map(t => <span key={t} className="breadth-tag bt-cyan">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#dc2626' }}>Security</div>
              <div className="breadth-tags">
                {['Air-gapped LLM','Zero telemetry','On-prem inference','Auth flows','Attorney-client privilege mode','Zero cloud dependency in prod'].map(t => <span key={t} className="breadth-tag bt-red">{t}</span>)}
              </div>
            </div>
          </div>

        </div>

        {/* PLATFORMS */}
        <div className="section">
          <div className="eyebrow">Live in Production</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Not demos. Systems with real users, real load, real stakes.</div>
          <div className="video-grid">
            <div className="video-card" onClick={() => setVideoOpen("resso")}>
              <div className="video-thumb" style={{ background: 'linear-gradient(135deg, #e4faf5, #f0fdf9)' }}>
                <div className="play-wrap">
                  <div className="v-name" style={{ color: '#0a7a6a' }}>Resso.ai</div>
                  <div className="v-sub" style={{ color: '#0a928080' }}>AGENT ORCHESTRATION</div>
                  <div className="play-btn" style={{ background: '#0a9280', color: '#fff' }}>▶</div>
                </div>
              </div>
              <div className="v-info">
                <div className="v-title">Multi-Agent Real-Time Conversation Platform</div>
                <div className="v-desc">sub-800ms · Azure OpenAI GPT-4o · LangGraph · K8s</div>
              </div>
            </div>

            <div className="video-card" onClick={() => setVideoOpen("uhpc")}>
              <div className="video-thumb" style={{ background: 'linear-gradient(135deg, #fffbeb, #faf7ee)' }}>
                <div className="play-wrap">
                  <div className="v-name" style={{ color: '#b87000' }}>UHPC Platform</div>
                  <div className="v-sub" style={{ color: '#b8700080' }}>ML PREDICTION</div>
                  <div className="play-btn" style={{ background: '#c47d00', color: '#fff' }}>▶</div>
                </div>
              </div>
              <div className="v-info">
                <div className="v-title">Concrete Strength Prediction Dashboard</div>
                <div className="v-desc">R² 0.73 · Random Forest · FastAPI · React</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cta">
          <div>
            <div className="cta-h">8 of 8. All shipped. Hire the engineer who is already doing this work.</div>
            <div className="cta-p" style={{ marginBottom: 14 }}>Every requirement already in production. Real systems. Real metrics. Real stakes. Day one contributor — not a six-month ramp.</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              <a href="mailto:emailtosolankiom@gmail.com" className="cta-btn">emailtosolankiom@gmail.com →</a>
              <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">LinkedIn ↗</a>
            <a href="https://www.lawline.tech" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">Lawline.tech ↗</a>
            </div>
          </div>
          <div className="cta-tags">
            {["Python", "Go", "Kafka", "K8s", "RAG", "Agents", "Fintech"].map(t => (
              <span key={t} className="cta-tag">{t} ✓</span>
            ))}
          </div>
        </div>
      </div>

      {videoOpen && (
        <div className="overlay" onClick={() => setVideoOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-ttl">{videoOpen === "resso" ? "Resso.ai — Agent Orchestration" : "UHPC — Strength Prediction"}</div>
              <button className="modal-x" onClick={() => setVideoOpen(null)}>x</button>
            </div>
            <div className="modal-body">
              <p>Add your video URL here</p>
              <p>{videoOpen === "resso" ? "resso-demo.mp4" : "uhpc-demo.mp4"}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
