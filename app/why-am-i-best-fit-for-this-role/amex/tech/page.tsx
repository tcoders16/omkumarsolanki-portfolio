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
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [activeReq, setActiveReq] = useState(-1);

  const jdNav = [
    { req: 'LLM-Powered Agentic Features', section: 'sec-architecture', icon: '🧠' },
    { req: 'RAG Over Enterprise Data', section: 'sec-lawline', icon: '🔍' },
    { req: 'Agent Orchestration + Tool Calling', section: 'sec-mcp', icon: '⚡' },
    { req: 'Python, Go, TypeScript', section: 'sec-stack', icon: '💻' },
    { req: 'AWS, Kubernetes, Kafka', section: 'sec-stack', icon: '☁️' },
    { req: 'Schema Validation + Structured Outputs', section: 'sec-mcp', icon: '🛡️' },
    { req: 'Evaluation and Monitoring', section: 'sec-architecture', icon: '📊' },
    { req: 'Fintech + Regulated Environments', section: 'sec-lawline', icon: '🏛️' },
  ];

  const scrollToReq = (idx: number) => {
    setActiveReq(idx);
    const el = document.getElementById(jdNav[idx].section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const walkAll = () => {
    let i = 0;
    setActiveReq(0);
    const el0 = document.getElementById(jdNav[0].section);
    if (el0) el0.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const interval = setInterval(() => {
      i++;
      if (i >= jdNav.length) { clearInterval(interval); return; }
      setActiveReq(i);
      const el = document.getElementById(jdNav[i].section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2800);
  };

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
        .auth-img-zone { width: 100%; aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .auth-img-zone img { width: 100%; height: 100%; object-fit: cover; padding: 0; }
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


        /* FLOATING JD TRACKER */
        @keyframes floatPulse { 0%,100% { box-shadow: 0 8px 32px rgba(10,146,128,.25), 0 0 0 1px rgba(10,146,128,.2); } 50% { box-shadow: 0 8px 40px rgba(10,146,128,.45), 0 0 0 2px rgba(10,146,128,.4); } }
        .jd-tracker-pill { position: fixed; bottom: 24px; right: 24px; z-index: 500; cursor: pointer; display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 14px 24px; border-radius: 14px; animation: floatPulse 3s ease-in-out infinite; transition: all .25s; border: 1px solid rgba(10,146,128,.25); }
        .jd-tracker-pill:hover { transform: translateY(-3px) scale(1.02); animation: none; box-shadow: 0 12px 44px rgba(10,146,128,.5), 0 0 0 2px rgba(10,146,128,.5); }
        .jd-tracker-pill .pill-dot { width: 10px; height: 10px; border-radius: 50%; background: #0a9280; animation: blink 1.5s infinite; flex-shrink: 0; }
        .jd-tracker-pill .pill-count { color: #0a9280; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; }
        .jd-tracker-pill .pill-arrow { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #0a9280; color: #fff; font-size: 14px; margin-left: 4px; transition: transform .2s; }
        .jd-tracker-pill:hover .pill-arrow { transform: translateX(3px); }
        .jd-tracker-panel { position: fixed; bottom: 24px; right: 24px; z-index: 500; width: 380px; max-height: 85vh; overflow-y: auto; background: #0d0d0d; border: 1px solid #222; border-radius: 16px; box-shadow: 0 16px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06); animation: fd .2s ease; }
        .jd-tracker-panel::-webkit-scrollbar { width: 4px; }
        .jd-tracker-panel::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .jd-tracker-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; border-bottom: 1px solid #1a1a1a; position: sticky; top: 0; background: #0d0d0d; z-index: 2; }
        .jd-tracker-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #f0f0f0; }
        .jd-tracker-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0a9280; letter-spacing: .12em; font-weight: 600; }
        .jd-tracker-close { width: 28px; height: 28px; border-radius: 50%; background: #1a1a1a; border: 1px solid #2a2a2a; color: #888; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .jd-tracker-close:hover { background: #222; color: #fff; border-color: #333; }
        .jd-tracker-body { padding: 10px 12px 16px; }
        .jd-tracker-item { display: flex; gap: 10px; padding: 10px 10px; border-radius: 10px; cursor: pointer; transition: background .15s; text-decoration: none; }
        .jd-tracker-item:hover { background: #1a1a1a; }
        .jd-tracker-chk { width: 22px; height: 22px; border-radius: 50%; background: #0a9280; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .jd-tracker-req { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: #e0e0e0; line-height: 1.4; margin-bottom: 3px; }
        .jd-tracker-proof { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #888; line-height: 1.5; }
        .jd-tracker-proof strong { color: #0a9280; font-weight: 600; }
        .jd-tracker-metric { display: inline-flex; margin-top: 5px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0a9280; background: #0a928015; border: 1px solid #0a928030; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
        .jd-tracker-footer { padding: 12px 20px 16px; border-top: 1px solid #1a1a1a; }
        .jd-tracker-footer-text { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #555; line-height: 1.6; text-align: center; }
        .jd-tracker-footer-text strong { color: #0a9280; }

        /* ACTIVE REQ INDICATOR (floats at top during walkthrough) */
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .req-indicator { position: fixed; top: 58px; left: 50%; transform: translateX(-50%); z-index: 400; display: flex; align-items: center; gap: 12px; background: #0d0d0d; color: #fff; padding: 12px 24px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.5); border: 1px solid #0a928040; animation: slideDown .3s ease; max-width: 600px; }
        .req-indicator-icon { font-size: 20px; flex-shrink: 0; }
        .req-indicator-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0a9280; letter-spacing: .16em; text-transform: uppercase; font-weight: 700; }
        .req-indicator-text { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #f0f0f0; }
        .req-indicator-progress { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
        .req-indicator-dot { width: 8px; height: 8px; border-radius: 50%; background: #333; transition: background .3s; }
        .req-indicator-dot.active { background: #0a9280; }
        .req-indicator-dot.done { background: #0a928060; }
        .req-indicator-close { width: 24px; height: 24px; border-radius: 50%; background: #1a1a1a; border: 1px solid #333; color: #888; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; margin-left: 8px; flex-shrink: 0; }
        .req-indicator-close:hover { background: #222; color: #fff; }

        @media (max-width: 640px) {
          .shell { padding: 28px 16px 60px; }
          .auth-grid, .spec-grid, .video-grid, .pillars, .lawline-cols, .lawline-metrics { grid-template-columns: 1fr; }
          .breadth-cat { min-width: 90px; font-size: 8px; }
          .cta { flex-direction: column; }
          .jd-tracker-panel { width: calc(100vw - 32px); right: 16px; bottom: 16px; }
          .jd-tracker-pill { bottom: 16px; right: 16px; }
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
        <div id="sec-authority" className="section">
          <div className="eyebrow">Operating Above the Title</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Pitching to directors and presidents — before any career required it.</div>
          <p className="body-p" style={{ marginBottom: 0 }}>A deployment-ready AI system for 1.7M TTC riders — pitched to the Director. A $1M commercial conversation with the President of Rogers. These are not networking stories. They are proof of operating at a level most engineers reach years later, if at all.</p>

          <div className="auth-grid">
            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden' }}>
                <img src="/images/portfolio/LostAndFound.png" alt="TTC Lost & Found system" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 1 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}>
                  <div className="auth-org" style={{ color: '#fff' }}>TTC</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(122,88,0,0.85)', borderColor: 'rgba(200,160,48,0.5)', backdropFilter: 'blur(4px)' }}>Capstone · Pitching May 2026</span>
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
                </div></div>
            </div>

            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden' }}>
                <img src="/images/portfolio/rogers_pre.JPG" alt="Rogers meeting" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 1 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}>
                  <div className="auth-org" style={{ color: '#fff' }}>Rogers</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(192,26,8,0.85)', borderColor: 'rgba(232,50,20,0.5)', backdropFilter: 'blur(4px)' }}>$1M Investment · Rogers President</span>
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
        <div id="sec-lawline" className="section">
          <div className="eyebrow">Founder · Builder · Operator</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Lawline.tech — custom RAG stack, air-gapped, already in a $1M investment conversation.</div>
          <p className="body-p" style={{ marginBottom: 18 }}>
            No third-party legal APIs. No OpenAI in prod. A fully custom RAG pipeline — HNSW retrieval, GGUF-quantized models, cross-encoder reranking, Pydantic validation on every output. Hallucination rate: <strong style={{ color: '#c01a08' }}>14% → 3.8%</strong> through six layers of validation. Now in an active <strong>$1M investment conversation</strong> with the President of Rogers.
          </p>
          <div className="lawline-card">
            <div style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', position: 'relative', background: '#0a0a0a', lineHeight: 0 }}>
              <img src="/images/portfolio/lawline.png" alt="Lawline.tech platform" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.93 }} />
              <div style={{ position: 'absolute', bottom: 14, left: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#fff', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75, background: '#0008', padding: '3px 8px', borderRadius: 4 }}>lawline.tech · live platform</div>
            </div>
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
              </div></div>
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
        <div id="sec-jdmap" className="section">
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

        {/* ARCHITECTURE DEEP DIVES */}
        <div id="sec-architecture" className="section">
          <div className="eyebrow">End-to-End Architecture</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Problem → Tech → Architecture → Outcome: four systems, every layer owned.</div>
          <p className="body-p" style={{ marginBottom: 28 }}>Not a contributor. Not a feature engineer. The person who understood why the system needed to exist, designed how it would work, picked the right tech, and shipped a working product. Four times over.</p>

          {/* RESSO ARCHITECTURE */}
          <div style={{ background: '#fff', border: '1.5px solid #0a928030', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #f0fdfb, #fff)', borderBottom: '1px solid #0a928020', padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#0a9280', marginBottom: 5, fontWeight: 700 }}>Production · AI Startup · 2024–Present</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Resso.ai — Multi-Agent Voice Platform</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Full-stack AI engineer. Owned architecture, backend, infra, and product.</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#0a9280', background: '#e4faf5', border: '1px solid #0a928040', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>● LIVE · resso.ai</span>
            </div>
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ background: '#f0fdfb', border: '1px solid #0a928025', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0a9280', fontWeight: 700, marginBottom: 7 }}>The Business Problem</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.75 }}>Enterprise clients needed <strong>AI voice agents</strong> for their customer calls — real-time, low latency, switching topics mid-conversation without losing context. No off-shelf solution handled barge-in detection, silence timeout, and multi-persona routing together. <strong>We had to build it from scratch.</strong></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 12 }}>Architecture Flow</div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 8 }}>
                  {[
                    { label: 'WebSocket\nIngest', color: '#0a9280' },
                    { label: 'LangGraph\nState Machine', color: '#7c3aed' },
                    { label: 'GPT-4o\nRouting', color: '#1d4ed8' },
                    { label: 'MCP Tool\nServer (Go)', color: '#b87000' },
                    { label: 'Redis\nSession', color: '#dc2626' },
                    { label: 'K8s HPA\nScale-out', color: '#0a9280' },
                  ].map((node, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: '#fafaf8', border: `1.5px solid ${node.color}35`, borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 82 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: node.color, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{node.label}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{ color: '#ccc', fontSize: 14, padding: '0 4px', flexShrink: 0 }}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="spec-grid" style={{ marginBottom: 18 }}>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Why LangGraph over raw LangChain?</div>
                  <div className="spec-text">LangGraph gave us a <code>StateGraph</code> with explicit node transitions — critical for multi-turn voice where state (topic, silence, barge-in) had to be deterministic. Raw LangChain chains lost context on branching conversation paths.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>Why MCP servers in Go, not Python?</div>
                  <div className="spec-text">Python GIL blocks concurrent tool calls. Go goroutines handled 200+ simultaneous sessions with <code>sub-800ms</code> end-to-end. Impossible with Python threads. Tool adapters (REST, gRPC, WebSocket) all lived in the Go network layer.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Why Azure OpenAI over direct OpenAI API?</div>
                  <div className="spec-text">Enterprise SLA, Canadian data residency, dedicated capacity. Azure deployment slot strategy: staging → prod swap with <code>zero-downtime</code> rollouts. K8s HPA integration out-of-the-box with Azure AKS.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#dc2626' }}>Why Redis for session state?</div>
                  <div className="spec-text">Conversation context needed <code>sub-5ms</code> reads between turns. PostgreSQL too slow for real-time. Redis TTL-based sessions auto-expired stale conversations, preventing memory leaks across 200+ live concurrent sessions.</div>
                </div>
              </div>
              <div className="chips-row" style={{ marginTop: 0 }}>
                {[{ n: 'sub-800ms', l: 'E2E latency' }, { n: '200+', l: 'Concurrent sessions' }, { n: '14%→3.8%', l: 'Hallucination rate' }, { n: '72%→98%', l: 'Context retention' }, { n: '5 deploys', l: 'Zero-downtime' }].map((c, i) => (
                  <div key={i} className="chip"><div className="chip-n" style={{ color: '#0a9280', fontSize: 14 }}>{c.n}</div><div className="chip-l">{c.l}</div></div>
                ))}
              </div>
            </div>
          </div>

          {/* COROL ARCHITECTURE */}
          <div style={{ background: '#fff', border: '1.5px solid #b8700030', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fff)', borderBottom: '1px solid #b8700018', padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#b87000', marginBottom: 5, fontWeight: 700 }}>Production · Materials ML · 2023–2024</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Corol — UHPC Strength Prediction Platform</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>ML Engineer. Built AI prediction tool for Ultra-High Performance Concrete research at corol.org.</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#b87000', background: '#fffbeb', border: '1px solid #b8700040', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>12 Engineers · Daily Use</span>
            </div>
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #b8700025', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#b87000', fontWeight: 700, marginBottom: 7 }}>The Business Problem</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.75 }}>UHPC research engineers were running physical lab tests for every experimental concrete mix — a process taking hours per test. With hundreds of mix variables (water-cement ratio, silica fume, fibre content, curing temperature), <strong>the combinatorial space was too large for manual testing.</strong> They needed a model that could predict compressive strength in 2 seconds so they could screen hundreds of mixes before committing to a physical pour.</div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 12 }}>Architecture Flow</div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 8 }}>
                  {[
                    { label: 'Mix Feature\nInput', color: '#b87000' },
                    { label: 'Feature\nEngineering', color: '#0a9280' },
                    { label: 'Ensemble\nML Model', color: '#7c3aed' },
                    { label: 'SHAP\nExplainability', color: '#1d4ed8' },
                    { label: 'FastAPI\nBackend', color: '#b87000' },
                    { label: 'React\nDashboard', color: '#0a9280' },
                  ].map((node, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: '#fafaf8', border: `1.5px solid ${node.color}35`, borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 82 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: node.color, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{node.label}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{ color: '#ccc', fontSize: 14, padding: '0 4px', flexShrink: 0 }}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="spec-grid" style={{ marginBottom: 18 }}>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Why Random Forest over XGBoost?</div>
                  <div className="spec-text">UHPC mix data has high feature interaction — silica fume effect depends on w/c ratio. XGBoost overfitted on 2,200 samples (small dataset). Random Forest (150 estimators, max depth 10, 5-fold CV) gave better <strong>variance stability</strong> and achieved <code>R² 0.73</code> without the hyperparameter sensitivity. On a small dataset, simpler ensemble wins.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Why SHAP explainability was non-negotiable</div>
                  <div className="spec-text">Scientists would not trust a black-box model making decisions that affected their research roadmap. SHAP feature rankings matched their domain intuition (w/c ratio most influential). <strong>Seeing their expertise reflected in the model</strong> was the moment they switched from skeptics to daily users.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>Why FastAPI + React, not a Jupyter notebook?</div>
                  <div className="spec-text">Notebooks are one-time demos. Scientists needed a tool they could use mid-experiment, on any machine, without running Python. FastAPI served the model as a REST endpoint. React dashboard gave instant results from a clean input form. <strong>2 seconds vs. hours of physical lab testing.</strong></div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>How I learned concrete science from scratch</div>
                  <div className="spec-text">Zero materials science background. Read ACI papers alongside the research engineers before touching any data — why does silica fume matter? what does curing temperature do to fibre bonding? Domain understanding drove feature engineering. <strong>The model was only as good as the features.</strong></div>
                </div>
              </div>
              <div className="chips-row" style={{ marginTop: 0 }}>
                {[{ n: 'R² 0.73', l: 'Prediction accuracy' }, { n: '2,200', l: 'Training samples' }, { n: '2 sec', l: 'vs. hours of lab testing' }, { n: '12', l: 'Daily engineer users' }, { n: 'SHAP', l: 'Full explainability' }].map((c, i) => (
                  <div key={i} className="chip"><div className="chip-n" style={{ color: '#b87000', fontSize: 14 }}>{c.n}</div><div className="chip-l">{c.l}</div></div>
                ))}
              </div>
            </div>
          </div>

          {/* LAWLINE ARCHITECTURE */}
          <div style={{ background: '#fff', border: '1.5px solid #dc262630', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #fff5f5, #fff)', borderBottom: '1px solid #dc262618', padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#dc2626', marginBottom: 5, fontWeight: 700 }}>Live · Legal AI · 2024</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Lawline.tech — Attorney-Grade Legal AI</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Sole engineer. Attorney-client privilege, zero telemetry, fully on-premise inference.</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #dc262640', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>● LIVE · lawline.tech</span>
            </div>
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #dc262620', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#dc2626', fontWeight: 700, marginBottom: 7 }}>The Business Problem</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.75 }}>Attorneys needed an AI research assistant over their case documents — but <strong>attorney-client privilege made any cloud LLM legally unusable</strong>. Every query, every document, every response had to remain local. We built a fully air-gapped platform with zero telemetry, local inference, and an audit log attorneys could present in court if the system was ever challenged.</div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 12 }}>Architecture Flow</div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 8 }}>
                  {[
                    { label: 'Local\nDoc Upload', color: '#dc2626' },
                    { label: 'AES-256\nEncrypted Index', color: '#b87000' },
                    { label: 'GGUF\nLocal Inference', color: '#dc2626' },
                    { label: 'Pydantic\nValidation', color: '#0a9280' },
                    { label: 'Zero-log\nAudit Trail', color: '#6d28d9' },
                  ].map((node, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: '#fafaf8', border: `1.5px solid ${node.color}35`, borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 82 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: node.color, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{node.label}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{ color: '#ccc', fontSize: 14, padding: '0 4px', flexShrink: 0 }}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="spec-grid" style={{ marginBottom: 18 }}>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#dc2626' }}>Why zero-telemetry architecture?</div>
                  <div className="spec-text">Attorney-client privilege is a <strong>legal privilege, not a preference</strong>. Any telemetry — even crash logs sent externally — could create a discovery obligation. We built structured local logging with <code>zero external calls</code>. Attorneys can export logs as court-admissible evidence.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Why AES-256 encrypted vector store?</div>
                  <div className="spec-text">Case documents are privileged records. We used AES-256 encrypted FAISS index with key derivation from attorney credentials. <strong>A stolen machine cannot expose document embeddings</strong> without the attorney passphrase — encryption at rest by default.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Why Pydantic on every LLM output?</div>
                  <div className="spec-text">In legal context, a hallucinated case citation is malpractice risk. Every output through <code>BaseModel</code> schema validation: citation-format regex, confidence threshold checks, fallback: "I cannot find a source for this in your documents." 6-layer hallucination defense system.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#6d28d9' }}>Why build the entire stack solo?</div>
                  <div className="spec-text">The attorneys needed a single point of accountability across every privacy boundary. I owned FastAPI backend, Next.js frontend, model quantization pipeline, and deployment. That <strong>single-owner architecture was itself a selling point</strong> — attorneys knew exactly who to call.</div>
                </div>
              </div>
              <div className="chips-row" style={{ marginTop: 0 }}>
                {[{ n: 'Zero', l: 'External telemetry' }, { n: 'AES-256', l: 'Doc encryption' }, { n: 'Live', l: 'lawline.tech' }, { n: '6-layer', l: 'Hallucination defense' }, { n: '100%', l: 'Local inference' }].map((c, i) => (
                  <div key={i} className="chip"><div className="chip-n" style={{ color: '#dc2626', fontSize: 14 }}>{c.n}</div><div className="chip-l">{c.l}</div></div>
                ))}
              </div>
            </div>
          </div>

          {/* TTC ARCHITECTURE */}
          <div style={{ background: '#fff', border: '1.5px solid #1d4ed830', borderRadius: 16, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #fff)', borderBottom: '1px solid #1d4ed820', padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#1d4ed8', marginBottom: 5, fontWeight: 700 }}>Capstone · Transit AI · Pitching May 2026</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>TTC Lost &amp; Found — Intelligent Transit Recovery</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Full-stack capstone. AI-powered item matching across Toronto&apos;s entire transit network.</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #1d4ed840', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Pitching May 2026</span>
            </div>
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #1d4ed820', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#1d4ed8', fontWeight: 700, marginBottom: 7 }}>The Business Problem</div>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.75 }}>TTC handles thousands of lost items per year with a <strong>manual, paper-based tracking system</strong>. Riders submit reports online. Staff match items by eye. Recovery rates are low, turnaround is slow, there is no ML component. We are building an intelligent matching engine that links rider reports to found items using computer vision and semantic text similarity — and a dashboard TTC staff can actually use.</div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 12 }}>Architecture Flow</div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 8 }}>
                  {[
                    { label: 'Rider\nSubmission', color: '#1d4ed8' },
                    { label: 'CV Feature\nExtraction', color: '#0a9280' },
                    { label: 'Semantic\nEmbedding', color: '#7c3aed' },
                    { label: 'pgvector\nMatching', color: '#b87000' },
                    { label: 'Staff\nDashboard', color: '#1d4ed8' },
                    { label: 'SMS/Email\nNotify', color: '#dc2626' },
                  ].map((node, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: '#fafaf8', border: `1.5px solid ${node.color}35`, borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 82 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: node.color, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{node.label}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{ color: '#ccc', fontSize: 14, padding: '0 4px', flexShrink: 0 }}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="spec-grid" style={{ marginBottom: 18 }}>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Why combine CV + semantic text matching?</div>
                  <div className="spec-text">Text descriptions of lost items are vague ("blue bag"). CV features from staff photos are precise but need a similarity engine. Combined: CV extracts colour/shape embeddings, semantic model matches description to photo features. <strong>Neither alone is reliable enough for production.</strong></div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Why Next.js 15 + pgvector in PostgreSQL?</div>
                  <div className="spec-text">TTC staff need a fast dashboard on existing hardware — no special ML stack. Next.js server components gave <code>0ms client waterfall</code> on the staff portal. pgvector extension handles both structured queries and vector similarity in one database, zero extra infra.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>Why async notification queues?</div>
                  <div className="spec-text">TTC riders do not have an app. Outreach had to use channels they already have. Async notification queues with retry logic, priority by match-confidence score: high-confidence triggers <strong>immediate SMS</strong>, low-confidence triggers weekly email digest.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Scope: this is production architecture</div>
                  <div className="spec-text">Submission portal, staff dashboard, ML matching pipeline, notification system, admin analytics — all production-ready. Not a prototype. Every component designed to hand off to TTC engineering after the <strong>May 2026 pitch</strong>.</div>
                </div>
              </div>
              <div className="chips-row" style={{ marginTop: 0 }}>
                {[{ n: 'CV + NLP', l: 'Dual matching' }, { n: 'Next.js 15', l: 'Full-stack' }, { n: 'pgvector', l: 'Vector search' }, { n: 'May 2026', l: 'TTC pitch' }, { n: 'Full system', l: 'Every layer owned' }].map((c, i) => (
                  <div key={i} className="chip"><div className="chip-n" style={{ color: '#1d4ed8', fontSize: 14 }}>{c.n}</div><div className="chip-l">{c.l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* MCP PLATFORM ARCHITECTURE */}
        <div id="sec-mcp" className="section">
          <div className="eyebrow">Platform Architecture · MCP Integration</div>
          <div className="sh2" style={{ marginBottom: 6 }}>One protocol, every system: why I built MCP servers as the integration backbone.</div>
          <p className="body-p" style={{ marginBottom: 28 }}>Every system I built — voice AI, legal research, UHPC prediction, transit matching — needed the same thing: an LLM that could call external tools reliably, validate responses, retry on failure, and never lose a request. Instead of custom glue code per project, I designed a <strong>unified MCP server layer</strong> that became the architectural pattern across all four platforms.</p>

          {/* WHY MCP ARCHITECTURE */}
          <div style={{ background: '#111', borderRadius: 14, overflow: 'hidden', marginBottom: 24, border: '1px solid #2a2a2a' }}>
            <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #222' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#0a9280', fontWeight: 700, marginBottom: 6 }}>Why This Architectural Approach</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-.02em' }}>The problem with direct API coupling</div>
            </div>
            <div style={{ padding: '18px 24px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: '#1a1a1a', border: '1px solid #dc262640', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#dc2626', fontWeight: 700, marginBottom: 8 }}>Without MCP (what most teams do)</div>
                <div style={{ fontSize: 13, color: '#999', lineHeight: 1.7 }}>LLM calls a REST endpoint directly. If schema changes, agent breaks. If you add a new tool, you rewrite the prompt. If a call fails, the agent hallucinates a response. <strong style={{ color: '#dc2626' }}>Every integration is a snowflake.</strong> Testing is manual. Retry logic is per-endpoint. No observability.</div>
              </div>
              <div style={{ background: '#1a1a1a', border: '1px solid #0a928040', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#0a9280', fontWeight: 700, marginBottom: 8 }}>With MCP Server Layer (what I built)</div>
                <div style={{ fontSize: 13, color: '#999', lineHeight: 1.7 }}>Agent emits standardized <code style={{ color: '#0a9280', background: '#0a928015', padding: '1px 5px', borderRadius: 3, fontSize: 11.5 }}>tool_call</code> JSON. MCP server validates via Pydantic, routes to the right adapter (REST, gRPC, WebSocket), handles retry + DLQ. <strong style={{ color: '#0a9280' }}>New tool = new adapter, zero agent changes.</strong> One protocol, every system.</div>
              </div>
            </div>
          </div>

          {/* MCP FLOW DIAGRAM */}
          <div style={{ background: '#fff', border: '1.5px solid #e0e0da', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #ebebeb', background: '#fafaf8' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700 }}>MCP Server Protocol Flow</div>
            </div>
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap', rowGap: 12 }}>
                {[
                  { label: 'LLM Agent', sub: 'emits tool_call', color: '#7c3aed', bg: '#f5f3ff' },
                  { label: 'Pydantic Schema', sub: 'validates JSON', color: '#0a9280', bg: '#f0fdfb' },
                  { label: 'MCP Router', sub: 'Go goroutines', color: '#b87000', bg: '#fffbeb' },
                  { label: 'Adapter Layer', sub: 'REST / gRPC / WS', color: '#1d4ed8', bg: '#eff6ff' },
                  { label: 'External Tool', sub: 'DB / API / Model', color: '#555', bg: '#f4f4f1' },
                  { label: 'Retry + DLQ', sub: '3 attempts → dead letter', color: '#dc2626', bg: '#fef2f2' },
                ].map((node, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: node.bg, border: `1.5px solid ${node.color}30`, borderRadius: 10, padding: '12px 14px', textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: node.color, lineHeight: 1.3 }}>{node.label}</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 3, lineHeight: 1.3 }}>{node.sub}</div>
                    </div>
                    {i < arr.length - 1 && <div style={{ color: '#ccc', fontSize: 14, padding: '0 6px', flexShrink: 0 }}>→</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PER-SYSTEM MCP INTEGRATION */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 14 }}>How MCP Integrates Across Each System</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {/* Resso MCP */}
            <div style={{ background: '#fff', border: '1.5px solid #0a928025', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#f0fdfb', padding: '12px 16px', borderBottom: '1px solid #0a928015' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#0d0d0d' }}>Resso.ai</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', fontWeight: 600 }}>VOICE AI · MCP IN GO</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>Agent sends <code style={{ fontSize: 11, color: '#0a7a6a', background: '#e4faf5', padding: '1px 5px', borderRadius: 3 }}>tool_call</code> JSON during live voice conversations. MCP server in Go routes to CRM lookups, booking APIs, knowledge base retrieval — all via goroutines for concurrent execution. <strong>200+ sessions, each calling 3–5 tools per turn, sub-800ms total.</strong></div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {['Go goroutines', 'REST + gRPC adapters', 'Redis session', 'Pydantic validation', 'DLQ after 3 retries'].map(t => (
                    <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a7a6a', background: '#e4faf5', border: '1px solid #0a928030', borderRadius: 4, padding: '2px 7px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Lawline MCP */}
            <div style={{ background: '#fff', border: '1.5px solid #dc262625', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#fef2f2', padding: '12px 16px', borderBottom: '1px solid #dc262615' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#0d0d0d' }}>Lawline.tech</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#dc2626', fontWeight: 600 }}>LEGAL AI · AIR-GAPPED MCP</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>Same MCP protocol — but <strong>every adapter is local</strong>. No external HTTP calls. Tool calls route to encrypted local vector DB, local GGUF model, local audit log. The MCP layer enforced the zero-egress invariant at the protocol level: if an adapter tried to make an external call, the router rejected it.</div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {['Zero-egress enforcement', 'Local-only adapters', 'AES-256 vector DB', 'Audit log tool', 'Pydantic + citation regex'].map(t => (
                    <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#c01a08', background: '#fef2f2', border: '1px solid #dc262630', borderRadius: 4, padding: '2px 7px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Corol MCP */}
            <div style={{ background: '#fff', border: '1.5px solid #b8700025', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#fffbeb', padding: '12px 16px', borderBottom: '1px solid #b8700015' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#0d0d0d' }}>Corol (UHPC)</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#b87000', fontWeight: 600 }}>MATERIALS ML · MODEL-AS-TOOL</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>The ML ensemble model itself was registered as a tool in the MCP protocol. Scientists queried through the React UI, which sent <code style={{ fontSize: 11, color: '#9a6000', background: '#fffbeb', padding: '1px 5px', borderRadius: 3 }}>predict_strength</code> tool calls to FastAPI. Same Pydantic validation, same retry logic, same structured response format — but the &quot;tool&quot; was an in-process ML model, not an external API.</div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {['Model-as-tool pattern', 'FastAPI adapter', 'SHAP as tool response', 'Pydantic mix schema', 'Batch prediction mode'].map(t => (
                    <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9a6000', background: '#fffbeb', border: '1px solid #b8700030', borderRadius: 4, padding: '2px 7px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* TTC MCP */}
            <div style={{ background: '#fff', border: '1.5px solid #1d4ed825', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#eff6ff', padding: '12px 16px', borderBottom: '1px solid #1d4ed815' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#0d0d0d' }}>TTC Lost &amp; Found</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#1d4ed8', fontWeight: 600 }}>TRANSIT AI · MULTI-TOOL PIPELINE</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>Each step in the matching pipeline is a registered tool: <code style={{ fontSize: 11, color: '#1d4ed8', background: '#eff6ff', padding: '1px 5px', borderRadius: 3 }}>extract_features</code>, <code style={{ fontSize: 11, color: '#1d4ed8', background: '#eff6ff', padding: '1px 5px', borderRadius: 3 }}>match_items</code>, <code style={{ fontSize: 11, color: '#1d4ed8', background: '#eff6ff', padding: '1px 5px', borderRadius: 3 }}>notify_rider</code>. The orchestrator chains tool calls sequentially, with confidence-gated branching: high-confidence matches skip manual review and trigger notification directly.</div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {['CV tool', 'Semantic match tool', 'pgvector tool', 'Notification tool', 'Confidence-gated routing'].map(t => (
                    <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #1d4ed830', borderRadius: 4, padding: '2px 7px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KEY ARCHITECTURAL DECISIONS */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555', fontWeight: 700, marginBottom: 14 }}>Key Architectural Decisions</div>
          <div className="spec-grid" style={{ marginBottom: 0 }}>
            <div className="spec-card">
              <div className="spec-title" style={{ color: '#0a9280' }}>Why Go for the MCP network layer?</div>
              <div className="spec-text">Python GIL serializes threads. In a voice platform with 200+ concurrent sessions each making 3–5 tool calls, Python could not handle the fan-out. Go goroutines gave us <strong>true concurrency</strong>. Each tool call is a goroutine with its own timeout, retry counter, and circuit breaker. The Python agent calls the Go server over a local socket — separation of concerns at the process boundary.</div>
            </div>
            <div className="spec-card">
              <div className="spec-title" style={{ color: '#7c3aed' }}>Why Pydantic schema validation on every call?</div>
              <div className="spec-text">LLMs hallucinate JSON. A missing field in a <code>tool_call</code> crashes the adapter. Pydantic <code>BaseModel</code> on every inbound request: strict types, required fields, enum constraints. If validation fails → constrained re-prompt to the LLM with the schema error. After 3 failures → safe default + dead letter queue. <strong>Zero silent failures in production.</strong></div>
            </div>
            <div className="spec-card">
              <div className="spec-title" style={{ color: '#dc2626' }}>Why dead letter queues, not just retries?</div>
              <div className="spec-text">Retries handle transient failures. But some calls fail permanently (wrong schema, unavailable service, rate limit). After 3 retries, the request moves to a DLQ with full context: original tool_call, error trace, session ID. We review DLQ daily. <strong>Every failed interaction is a training signal</strong> — we used DLQ analysis to improve prompts and reduce failure rates by 60%.</div>
            </div>
            <div className="spec-card">
              <div className="spec-title" style={{ color: '#1d4ed8' }}>Why this pattern scales across domains</div>
              <div className="spec-text">Voice AI, legal research, materials ML, transit matching — <strong>four completely different domains, one architectural pattern</strong>. The MCP protocol does not care what the tool does. It only cares about: valid input schema, adapter routing, timeout, retry policy, structured output. New domain = new adapters plugged into the same server. Zero changes to the agent, the router, or the validation layer.</div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* STACK */}
        <div id="sec-stack" className="section">
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
        <div id="sec-platforms" className="section">
          <div className="eyebrow">Live in Production</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Not demos. Systems with real users, real load, real stakes.</div>
          <div className="video-grid">
            <a href="https://www.resso.ai" target="_blank" rel="noopener" className="video-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="video-thumb" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden', position: 'relative' }}>
                <img src="/images/portfolio/resso.png" alt="Resso.ai" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 0.9 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0006 30%, transparent)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#0a9280', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.1em' }}>LIVE ↗</div>
              </div>
              <div className="v-info">
                <div className="v-title">Multi-Agent Real-Time Conversation Platform</div>
                <div className="v-desc">sub-800ms · Azure OpenAI GPT-4o · LangGraph · K8s</div>
              </div>
            </a>

            <a href="https://www.corol.org" target="_blank" rel="noopener" className="video-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="video-thumb" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden', position: 'relative' }}>
                <img src="/images/portfolio/uhpc.png" alt="UHPC Platform" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 0.9 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0006 30%, transparent)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#c47d00', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.1em' }}>LIVE ↗</div>
              </div>
              <div className="v-info">
                <div className="v-title">Concrete Strength Prediction Dashboard</div>
                <div className="v-desc">R² 0.73 · XGBoost · SHAP explainability · FastAPI</div>
              </div>
            </a>
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

      {/* ACTIVE REQUIREMENT INDICATOR (shown during walkthrough) */}
      {activeReq >= 0 && activeReq < jdNav.length && (
        <div className="req-indicator" key={activeReq}>
          <span className="req-indicator-icon">{jdNav[activeReq].icon}</span>
          <div>
            <div className="req-indicator-label">JD Requirement {activeReq + 1} of 8</div>
            <div className="req-indicator-text">{jdNav[activeReq].req}</div>
          </div>
          <div className="req-indicator-progress">
            {jdNav.map((_, i) => (
              <div key={i} className={`req-indicator-dot ${i === activeReq ? 'active' : i < activeReq ? 'done' : ''}`} />
            ))}
          </div>
          <button className="req-indicator-close" onClick={() => setActiveReq(-1)}>✕</button>
        </div>
      )}

      {/* FLOATING JD TRACKER */}
      {!trackerOpen ? (
        <div className="jd-tracker-pill" onClick={() => setTrackerOpen(true)}>
          <span className="pill-dot" />
          <span className="pill-count">8/8</span>
          <span>Click here — I&apos;ll show you every JD match</span>
          <span className="pill-arrow">→</span>
        </div>
      ) : (
        <div className="jd-tracker-panel">
          <div className="jd-tracker-head">
            <div>
              <div className="jd-tracker-title">This Is What You&apos;re Looking For</div>
              <div className="jd-tracker-sub">AMEX JD 26003145 · 8 of 8 REQUIREMENTS</div>
            </div>
            <button className="jd-tracker-close" onClick={() => setTrackerOpen(false)}>✕</button>
          </div>

          {/* WALK-THROUGH CTA */}
          <div style={{ padding: '12px 16px 6px' }}>
            <div onClick={() => { setTrackerOpen(false); walkAll(); }} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #0a9280, #087a6a)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform .15s, box-shadow .15s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(10,146,128,.4)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>▶</div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' }}>Walk me through all 8 requirements</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,.7)', letterSpacing: '.1em' }}>Auto-scrolls to each section with evidence</div>
              </div>
            </div>
          </div>

          <div className="jd-tracker-body">
            {[
              { req: 'LLM-Powered Agentic Features', proof: 'Multi-agent voice orchestration at Resso.ai — LangGraph, barge-in, topic switching.', metric: 'sub-800ms · 200+ sessions', idx: 0 },
              { req: 'RAG Over Enterprise Data', proof: 'Lawline.tech — HNSW vector stores, semantic chunking, cross-encoder rerankers.', metric: 'sub-1s retrieval · 7 clients', idx: 1 },
              { req: 'Agent Orchestration + Tool Calling', proof: 'MCP servers in Go — Pydantic validation → adapter routing. Retry + DLQ.', metric: '4 systems · one protocol', idx: 2 },
              { req: 'Python, Go, TypeScript', proof: 'Python: FastAPI/PyTorch. Go: MCP goroutines. TS: Next.js 15 + Prisma.', metric: 'All 3 in production', idx: 3 },
              { req: 'AWS, Kubernetes, Kafka', proof: 'AWS certified. Kafka (exactly-once). K8s: HPA, rolling updates, probes.', metric: 'Production across all three', idx: 4 },
              { req: 'Schema Validation + Structured Outputs', proof: 'Pydantic BaseModel every output. Re-prompt on failure. DLQ after 3.', metric: '14% → 3.8% hallucination', idx: 5 },
              { req: 'Evaluation and Monitoring', proof: 'Per-persona dashboards. 500-doc eval pipeline. Regression on push.', metric: '72% → 98% retention', idx: 6 },
              { req: 'Fintech + Regulated Environments', proof: '7 enterprise clients. Compliance sign-off. Zero telemetry at Lawline.', metric: '7 enterprise clients', idx: 7 },
            ].map((item) => (
              <div key={item.idx} className="jd-tracker-item" onClick={() => { setTrackerOpen(false); scrollToReq(item.idx); }} style={{ background: activeReq === item.idx ? '#1a2a25' : undefined }}>
                <div className="jd-tracker-chk" style={{ background: activeReq === item.idx ? '#0a9280' : '#0a928080' }}>{jdNav[item.idx].icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="jd-tracker-req">{item.req}</div>
                  <div className="jd-tracker-proof">{item.proof}</div>
                  <div className="jd-tracker-metric">{item.metric}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="jd-tracker-footer">
            <div className="jd-tracker-footer-text"><strong>8 of 8 requirements</strong> mapped to production systems. Click any item or hit ▶ to walk through all.</div>
          </div>
        </div>
      )}
    </>
  );
}
