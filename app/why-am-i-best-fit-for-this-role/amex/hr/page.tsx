"use client";
import { useState, useEffect, useRef } from "react";

const hrJdNav = [
  { req: 'Business → Technical Translation', section: 'sec-biz-tech', proof: 'Boardroom brief → production system, 3 times', metric: 'Resso · Lawline · Corol' },
  { req: 'Discovery-First Approach', section: 'sec-biz-req-hr', proof: 'Shadowed TTC, interviewed 4 attorneys, 2-3 days with clients', metric: 'Before writing a line of code' },
  { req: 'Stakeholder Alignment', section: 'sec-biz-req-hr', proof: 'Eval dashboards shared weekly. Clients sign off on metrics', metric: 'No surprises. Ever.' },
  { req: 'LLM Security + Zero Hallucination', section: 'sec-hallucination-hr', proof: '6-layer defense: schema, RAG, SHAP, confidence, retry, DLQ', metric: '14% → 3.8% hallucination' },
  { req: 'Observability + Production Ownership', section: 'sec-observability-hr', proof: 'OpenTelemetry, Prometheus, Grafana, 500-doc eval pipeline', metric: 'Monitors every system shipped' },
  { req: 'Resilience + Failure Mode Design', section: 'sec-resilience-hr', proof: 'P0 resolved in 24 min. Circuit breakers, DLQ, Redis state', metric: 'P0 → 24 min → interview on time' },
  { req: 'Azure / Cloud Depth', section: 'sec-water', proof: 'Azure OpenAI, AKS, deployment slots, data residency', metric: 'AWS certified · Azure prod' },
  { req: 'Language Runtime Decisions', section: 'sec-languages-hr', proof: 'Python vs Java vs Go - with latency numbers', metric: 'Go 180ms vs Python 800ms' },
  { req: 'Full-Stack + BA-to-Tech Bridge', section: 'sec-water', proof: 'Solo end-to-end on 3 production systems', metric: 'Every layer. Every time.' },
  { req: 'Deep ML/AI Foundation', section: 'sec-water', proof: 'PyTorch, SHAP, RAG, GGUF, LangGraph in prod', metric: 'Not academic - deployed' },
];

export default function AmexHRFit() {
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [ressoOpen, setRessoOpen] = useState(true);
  const [corolOpen, setCorolOpen] = useState(true);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(240);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    setTimeLeft(240);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setChecked(new Set());
          setTimerActive(false);
          return 240;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCheck = (idx: number) => {
    const next = new Set(checked);
    if (next.has(idx)) { next.delete(idx); } else { next.add(idx); if (!timerActive) startTimer(); }
    setChecked(next);
    const el = document.getElementById(hrJdNav[idx].section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f7f7f5; color: #111; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.75; -webkit-font-smoothing: antialiased; }
        .shell { max-width: 860px; margin: 0 auto; padding: 52px 28px 100px; }

        .badge-row { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; border: 1px solid; }
        .badge-hr { color: #b87000; border-color: #d9920040; background: #fffbeb; }
        .badge-co { color: #666; border-color: #d4d4ce; }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        .hero { margin-bottom: 56px; }
        .hero-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: #0a9280; margin-bottom: 14px; }
        .hero-h1 { font-family: 'Syne', sans-serif; font-size: clamp(32px, 5.5vw, 52px); font-weight: 800; color: #080808; line-height: 1.1; letter-spacing: -.025em; margin-bottom: 18px; }
        .hero-h1 em { color: #0a9280; font-style: normal; }
        .hero-p { font-size: 17px; color: #555; max-width: 580px; line-height: 1.75; }

        .divider { height: 1px; background: linear-gradient(90deg, #d0d0ca, transparent); margin: 52px 0; }
        .section { margin-bottom: 64px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #0a9280; margin-bottom: 8px; font-weight: 600; }
        .sh2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #0d0d0d; margin-bottom: 6px; }
        .sh3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .body-p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 12px; }
        .body-p:last-child { margin-bottom: 0; }
        .hl { color: #111; font-weight: 600; }
        .hl-teal { color: #0a9280; font-weight: 500; }
        .hl-amber { color: #b87000; font-weight: 500; }

        /* AUTHORITY CARDS */
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
        .auth-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 9px; border-radius: 4px; border: 1px solid; }
        .auth-status { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; }
        .auth-dot { width: 6px; height: 6px; border-radius: 50%; animation: blink 2s infinite; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }

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
        @keyframes fd { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }

        .chips-row { display: flex; flex-wrap: wrap; gap: 9px; margin: 16px 0; }
        .chip { background: #fff; border: 1px solid #e0e0da; border-radius: 7px; padding: 8px 12px; min-width: 100px; }
        .chip-n { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; }
        .chip-l { font-size: 11px; color: #777; margin-top: 1px; }

        .built-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }
        .built-card { background: #fff; border: 1px solid #e0e0da; border-radius: 9px; padding: 16px; }
        .built-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 5px; letter-spacing: .01em; }
        .built-desc { font-size: 13px; color: #666; line-height: 1.65; }

        .align-block { border-radius: 10px; padding: 18px 20px; margin-top: 20px; border: 1px solid; }
        .align-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; }
        .align-text { font-size: 14px; color: #555; line-height: 1.8; }
        .align-text strong { color: #111; font-weight: 600; }

        /* INCIDENT */
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

        /* VIDEO */
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
        .video-card { border: 1px solid #e0e0da; border-radius: 12px; overflow: hidden; cursor: pointer; background: #fff; transition: box-shadow .2s, transform .18s; }
        .video-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.07); transform: translateY(-3px); }
        .video-thumb { aspect-ratio: 16/8; display: flex; align-items: center; justify-content: center; }
        .play-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .play-btn { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: transform .2s; }
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
        .cta { background: linear-gradient(135deg, #e4faf5, #f2fefb); border: 1px solid #0a928050; border-radius: 14px; padding: 34px; text-align: center; margin-top: 52px; }
        .cta-h { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0d0d0d; margin-bottom: 6px; }
        .cta-p { font-size: 14px; color: #666; }

        .back { font-family:'JetBrains Mono',monospace; font-size:10px; color:#aaa; text-decoration:none; letter-spacing:.05em; margin-bottom:26px; display:inline-flex; align-items:center; gap:6px; transition:color .2s; }
        .back:hover { color:#0a9280; }


        /* FLOATING HR CHECKLIST */
        @keyframes floatBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes rippleOut { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes fd { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink2 { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        .hr-fab-wrap { position: fixed; bottom: 28px; right: 28px; z-index: 500; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; }
        .hr-fab-label { background: #111; color: #0abfa8; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 7px 18px; border-radius: 8px; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,.4); border: 1px solid #0a928050; position: relative; animation: floatBob 2.2s ease-in-out infinite; }
        .hr-fab-label::after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #111; }
        .hr-fab { position: relative; width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(145deg, #0abfa8, #087060); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(10,146,128,.6); transition: transform .2s, box-shadow .2s; }
        .hr-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(10,146,128,.8); }
        .hr-fab-ring { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(10,191,168,.6); animation: rippleOut 2s ease-out infinite; }
        .hr-fab-ring2 { animation-delay: 1s; }
        .hr-fab-inner { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .hr-fab-num { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; line-height: 1; }
        .hr-fab-lbl { font-family: 'JetBrains Mono', monospace; font-size: 7px; color: rgba(255,255,255,.85); letter-spacing: .08em; text-transform: uppercase; }
        .hr-tracker-panel { position: fixed; bottom: 24px; right: 24px; z-index: 500; width: 380px; max-height: 85vh; overflow-y: auto; background: #0d0d0d; border: 1px solid #222; border-radius: 16px; box-shadow: 0 16px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06); animation: fd .2s ease; }
        .hr-tracker-panel::-webkit-scrollbar { width: 4px; }
        .hr-tracker-panel::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .hr-tracker-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; border-bottom: 1px solid #1a1a1a; position: sticky; top: 0; background: #0d0d0d; z-index: 2; }
        .hr-tracker-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #f0f0f0; }
        .hr-tracker-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0a9280; letter-spacing: .12em; font-weight: 600; }
        .hr-tracker-close { width: 26px; height: 26px; border-radius: 50%; background: #1a1a1a; border: 1px solid #333; color: #888; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hr-tracker-item { display: flex; align-items: flex-start; gap: 11px; padding: 10px 16px; border-bottom: 1px solid #111; cursor: pointer; transition: background .15s; }
        .hr-tracker-item:hover { background: #111; }
        .hr-tracker-item:last-child { border-bottom: none; }
        .hr-tracker-cb { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #333; background: #111; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .hr-tracker-cb.done { background: #0a9280; border-color: #0a9280; }
        .hr-tracker-req { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #f0f0f0; line-height: 1.3; margin-bottom: 2px; }
        .hr-tracker-proof { font-size: 11px; color: #888; line-height: 1.4; margin-bottom: 3px; }
        .hr-tracker-metric { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0a9280; font-weight: 600; }
        .hr-tracker-footer { padding: 12px 16px; border-top: 1px solid #1a1a1a; }
        .hr-tracker-footer-text { font-size: 12px; color: #666; line-height: 1.5; }

        /* SPEC CARDS */
        .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
        .spec-card { background: #fafaf8; border: 1px solid #e0e0da; border-radius: 10px; padding: 16px 18px; }
        .spec-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 7px; letter-spacing: .01em; }
        .spec-text { font-size: 13px; color: #555; line-height: 1.7; }
        .spec-text code { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: #ebebeb; padding: 1px 5px; border-radius: 3px; }

        @media (max-width: 640px) {
          .shell { padding: 28px 16px 60px; }
          .auth-grid, .built-grid, .pillars, .video-grid, .spec-grid { grid-template-columns: 1fr; }
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
          <span className="badge badge-hr"><span className="dot" />HR Round</span>
          <span className="badge badge-co">American Express · AI Engineer I · Agentic AI</span>
        </div>

        {/* HERO - HR VERSION */}
        <div className="hero">
          <div className="hero-eyebrow">American Express · AI Engineer I · March 17, 2026</div>
          <h1 className="hero-h1">I find the problem.<br />Build the fix. <em>Own the outcome.</em></h1>
          <p className="hero-p">
            Four businesses had real problems. I sat with the people who had them, built the solutions, and stayed accountable for the results. Here is what changed.
          </p>
        </div>

        {/* 30-SECOND SUMMARY - what an HR person needs in one glance */}
        <div style={{ background: '#0d0d0d', borderRadius: 16, padding: '28px 32px', marginBottom: 52 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>30-second summary - what I do and what changes when I join</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            {[
              { n: '4', label: 'production systems shipped', sub: 'Not demos. Real users daily.' },
              { n: '$1M', label: 'active investment discussion', sub: 'Rogers President. Lawline.tech.' },
              { n: '24 min', label: 'P0 resolved, interview day', sub: 'Zero data loss. Made the call.' },
              { n: '1.7M', label: 'riders TTC pitch targets', sub: 'Director meeting, May 2026.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 900, color: '#0abfa8', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: '#f0f0f0', fontWeight: 600, margin: '6px 0 3px', lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#555' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BUSINESS IMPACT DASHBOARD */}
        <div className="section">
          <div className="eyebrow">4 Problems · 4 Systems · Results That Speak</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Every project started with a real person who had a real problem.</div>
          <p className="body-p" style={{ marginBottom: 28 }}>I did not wait for a ticket. I walked into the room, listened, translated it into a system, and measured what changed.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            {[
              {
                company: 'Resso.ai',
                color: '#0a9280', bg: 'linear-gradient(135deg, #f0fdfb, #fff)',
                border: '#0a928030',
                problem: 'Edtech clients were losing learners because AI call agents forgot context mid-conversation and kept restarting from zero. Students dropped off. Clients lost engagement.',
                action: 'Sat with edtech clients for 2-3 days before writing a line of code. Mapped exactly where context broke. Built the stateful platform from scratch. Owned every layer - model, API, infra, dashboard.',
                quote: 'They renewed the contract and expanded from 1 AI persona to 5 within 3 months of go-live.',
                outcomes: [
                  { before: '72%', after: '98%', label: 'Conversations stayed on track' },
                  { before: '14%', after: '3.8%', label: 'Wrong AI answers' },
                  { before: '1', after: '5', label: 'Personas - client expanded' },
                ],
                status: '● Live in production'
              },
              {
                company: 'Lawline.tech',
                color: '#dc2626', bg: 'linear-gradient(135deg, #fff5f5, #fff)',
                border: '#dc262630',
                problem: 'Attorneys needed AI for legal research but could not use any cloud service - one data leak and careers end. The privacy requirement was not a preference, it was a legal constraint.',
                action: 'Interviewed 4 attorneys before speccing anything. Built a fully local AI - no data ever leaves the office. Showed them the proof on screen: zero outbound network traffic during a query. That closed the trust gap.',
                quote: 'Attorneys started demoing the "zero outbound packets" screen to their law society contacts. The architecture became the sales pitch. Now in active $1M discussion with the President of Rogers.',
                outcomes: [
                  { before: 'Cloud AI', after: 'Fully local', label: 'Privacy guarantee' },
                  { before: 'Impossible', after: 'Live daily', label: 'AI research for attorneys' },
                  { before: 'Startup', after: '$1M conversation', label: 'Rogers President interest' },
                ],
                status: '● Live · lawline.tech'
              },
              {
                company: 'Corol / UHPC Research',
                color: '#b87000', bg: 'linear-gradient(135deg, #fffbeb, #fff)',
                border: '#b8700030',
                problem: 'Research engineers were running hours of physical lab tests for every concrete mix experiment. They could only test a handful of combinations per week when they needed to test hundreds.',
                action: 'Shadowed the engineers for 3 days - watched every step, learned the domain. Built an ML model that predicts strength in 2 seconds. Made it explainable so scientists could see their own expertise reflected in the results.',
                quote: 'Scientists who started as skeptics ended up demoing the tool to their own colleagues. They trusted it because it matched what they already knew.',
                outcomes: [
                  { before: 'Hours', after: '2 sec', label: 'Per test prediction' },
                  { before: '0', after: '12', label: 'Engineers using it daily' },
                  { before: 'Weeks', after: 'One afternoon', label: 'To screen 100s of mixes' },
                ],
                status: '● 12 engineers · daily'
              },
              {
                company: 'Lost and Found',
                color: '#1d4ed8', bg: 'linear-gradient(135deg, #eff6ff, #fff)',
                border: '#1d4ed830',
                problem: "Toronto's transit system handles 1.7 million riders daily and tracks lost items on paper logs and phone calls. Staff match items manually. Recovery rates are low. Nobody built a better system.",
                action: 'Shadowed TTC staff at Union Station for a full day before writing a line of code. Built the AI matching engine, staff dashboard, rider portal, and notification system. Pitching to the Director in May 2026.',
                quote: 'This is a capstone project - but it is production-ready architecture, not a school demo. The TTC Director is the stakeholder.',
                outcomes: [
                  { before: 'Paper logs', after: 'AI-matched', label: 'Item recovery process' },
                  { before: '1.7M riders', after: 'City-scale', label: 'Scope of impact' },
                  { before: 'No system', after: 'Director pitch', label: 'May 2026 presentation' },
                ],
                status: '◎ Pitching May 2026'
              },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0d0d0d' }}>{item.company}</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: item.color, fontWeight: 700 }}>{item.status}</span>
                </div>
                {/* Problem */}
                <div style={{ padding: '16px 22px 0' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#dc2626', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>The problem</div>
                  <div style={{ fontSize: 14, color: '#333', lineHeight: 1.75, marginBottom: 14 }}>{item.problem}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: item.color, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>What I did</div>
                  <div style={{ fontSize: 14, color: '#444', lineHeight: 1.75, marginBottom: 14 }}>{item.action}</div>
                  {/* Human quote */}
                  <div style={{ borderLeft: `3px solid ${item.color}`, paddingLeft: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: '#555', lineHeight: 1.75, fontStyle: 'italic' }}>{item.quote}</div>
                  </div>
                </div>
                {/* Outcome chips - before → after */}
                <div style={{ padding: '0 22px 18px', display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {item.outcomes.map((o, j) => (
                    <div key={j} style={{ background: '#fff', border: `1px solid ${item.color}20`, borderRadius: 10, padding: '10px 14px', flex: '1 1 110px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#bbb' }}>{o.before}</span>
                        <span style={{ color: item.color, fontSize: 16, fontWeight: 700 }}>→</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: item.color }}>{o.after}</span>
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#888', letterSpacing: '.05em' }}>{o.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* AUTHORITY */}
        <div className="section">
          <div className="eyebrow">Operating Above the Title</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Pitching to directors and presidents - before any job required it.</div>
          <p className="body-p" style={{ marginBottom: 0 }}>
            Most candidates list skills. This is different. A capstone pitch directly to the TTC Director. An active $1M investment conversation with the President of Rogers. Real rooms. Real stakes. Real outcomes.
          </p>

          <div className="auth-grid">
            {/* TTC */}
            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden' }}>
                <img src="/images/portfolio/LostAndFound.png" alt="TTC Lost & Found system" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 1 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}>
                  <div className="auth-org" style={{ color: '#fff' }}>Lost and Found</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(122,88,0,0.85)', borderColor: 'rgba(200,160,48,0.5)', backdropFilter: 'blur(4px)' }}>TTC · Capstone · Pitching May 2026</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">An AI system for 1.7M daily riders - built as a capstone, pitched to the Director</div>
                <div className="auth-desc">
                  The TTC handles <strong>1.7 million passengers every day</strong> - and loses track of their belongings on manual paper logs and phone calls. I built the fix: <strong>NLP vector matching against live inventory</strong>, SMS status updates, self-serve passenger portal, staff triage dashboard. Claim resolution 3x faster. Pitching this to the TTC Director in May 2026. Not a demo. A deployment-ready proposal.
                </div>
                <div className="auth-tags">
                  <span className="auth-tag" style={{ color: '#7a5800', borderColor: '#c8a03060', background: '#fefce8' }}>TTC Director · May 2026</span>
                  <span className="auth-tag" style={{ color: '#7a5800', borderColor: '#c8a03060', background: '#fefce8' }}>1.7M Daily Riders</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Vector Search</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>City Infrastructure</span>
                </div>
                <div className="auth-status" style={{ color: '#7a5800' }}>
                  <span className="auth-dot" style={{ background: '#7a5800' }} />
                  Pitch Scheduled · May 2026
                </div></div>
            </div>

            {/* ROGERS */}
            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden' }}>
                <img src="/images/portfolio/rogers_pre.JPG" alt="Rogers meeting" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 1 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}>
                  <div className="auth-org" style={{ color: '#fff' }}>Lawline.tech</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(192,26,8,0.85)', borderColor: 'rgba(232,50,20,0.5)', backdropFilter: 'blur(4px)' }}>$1M · Rogers President</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">In a $1M conversation with the President of a $15B company - before any career title required it</div>
                <div className="auth-desc">
                  Rogers runs <strong>$15B+ in annual revenue</strong>. I am in an active <strong>$1M investment discussion</strong> with their President around <a href="https://www.lawline.tech" target="_blank" rel="noopener" style={{ color: '#c01a08', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Lawline.tech ↗</a> - a legal AI platform live in production, serving users today. The pitch: <strong>enterprise licensing for Rogers' legal and compliance teams</strong>, B2B resale path. Sub-4% hallucination on legal eval sets. This is not networking - it is a real commercial conversation at the highest level.
                </div>
                <div className="auth-tags">
                  <span className="auth-tag" style={{ color: '#c01a08', borderColor: '#e8321440', background: '#fff5f5' }}>$1M Investment · Rogers</span>
                  <span className="auth-tag" style={{ color: '#c01a08', borderColor: '#e8321440', background: '#fff5f5' }}>$15B Company</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Legal AI</span>
                  <span className="auth-tag" style={{ color: '#555', borderColor: '#ddd', background: '#f9f9f7' }}>Enterprise Scaling</span>
                </div>
                <div className="auth-status" style={{ color: '#c01a08' }}>
                  <span className="auth-dot" style={{ background: '#c01a08' }} />
                  Investment Conversation Active
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* LAWLINE.TECH */}
        <div className="section">
          <div className="eyebrow">Founder · Builder · Operator</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Lawline.tech - live, scaling, and already in a $1M investment conversation.</div>
          <p className="body-p" style={{ marginBottom: 18 }}>
            Not a portfolio piece. Not a proof of concept. A legal AI platform in production - with real users, real enterprise conversations, and a hallucination rate that dropped from 14% to <strong style={{ color: '#c01a08' }}>3.8%</strong> through six layers of validation.
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
                  <div className="lawline-tagline">Legal AI platform for Canadian law &mdash; live, scaling, enterprise-ready</div>
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
                  <div className="lawline-col-label">The $400/hr Problem</div>
                  <div className="lawline-col-text"><strong>87% of Canadians</strong> avoid legal help due to cost. Corporate compliance teams spend hundreds of hours on manual regulation review. Legal access is gated behind $400/hr consultations.</div>
                </div>
                <div className="lawline-col">
                  <div className="lawline-col-label">The AI Answer</div>
                  <div className="lawline-col-text">RAG over <strong>Canadian statutes, case law, and compliance docs.</strong> Instant, cited, attorney-client-privilege-safe answers. Air-gapped for enterprise - no data leaves the client&apos;s environment.</div>
                </div>
                <div className="lawline-col">
                  <div className="lawline-col-label">Built With</div>
                  <div className="lawline-col-text"><strong>GGUF-quantized LLMs</strong>, HNSW vector store, cross-encoder reranker, Pydantic validation on every output. FastAPI backend, Next.js 15 frontend. Zero telemetry.</div>
                </div>
              </div>
              <div className="lawline-metrics">
                <div className="lawline-metric">
                  <div className="lawline-metric-n">3.8%</div>
                  <div className="lawline-metric-l">Hallucination rate on legal eval sets</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">$1M</div>
                  <div className="lawline-metric-l">Investment conversation &middot; Rogers President</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">7</div>
                  <div className="lawline-metric-l">Enterprise clients deployed</div>
                </div>
                <div className="lawline-metric">
                  <div className="lawline-metric-n">0</div>
                  <div className="lawline-metric-l">Telemetry &middot; zero data leakage</div>
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
                <div className="tl-t">8:00 AM - The call</div>
                <div className="tl-txt">Founder calls. Production is down. First move - <strong>call the intern</strong> and ask calmly: what did you push last night?</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">8:10 AM - Root cause</div>
                <div className="tl-txt">He <strong>force-pushed to production</strong> without review. Vector DB connection pool broke. Agent routing crashed downstream.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">8:20 AM - Decision</div>
                <div className="tl-txt"><strong>Did not patch prod under pressure.</strong> Spun up staging, wired it to production databases, redirected live traffic. Customers back in minutes.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">9:00 AM - Restored</div>
                <div className="tl-txt"><strong>Zero data loss. Zero session interruption.</strong> Founder confirmed. Proper rollback running in parallel.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">9:15 AM - Harder conversation</div>
                <div className="tl-txt">CEO wanted to fire the intern. I stepped in - walked him through what broke, set a clear standard, and <strong>saved his job</strong>.</div>
              </div>
              <div className="tl-item">
                <div className="tl-t">12:30 PM - This interview</div>
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
              <div className="pillar-text">Production down at 8 AM, Amex interview at noon. Diagnosed root cause in 5 minutes, restored service in 24, walked into the room composed.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">The CEO said fire him. I said teach him.</div>
              <div className="pillar-text">Walked him through root cause, PR workflow, commit discipline. Accountability and belief at the same time. He is still on the team.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Redirected prod in minutes. Because I built it.</div>
              <div className="pillar-text">Knew exactly which wire to pull - because I laid every wire. Ownership is not a title. It is what happens when no one else can fix it.</div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* RESSO.AI */}
        <div className="section">
          <div className="eyebrow">Current Role</div>
          <div className="sh2" style={{ marginBottom: 18 }}>What I built at Resso.ai</div>

          <div className={`work-card ${ressoOpen ? "open" : ""}`}>
            <div className="wc-header" onClick={() => setRessoOpen(!ressoOpen)}>
              <div className="wc-left">
                <div className="wc-init" style={{ background: '#e4faf5', color: '#0a7a6a', border: '1px solid #0a928030' }}>R</div>
                <div>
                  <div className="wc-name">Resso.ai</div>
                  <div className="wc-role">AI Engineer · Agent Orchestration Lead</div>
                </div>
              </div>
              <div className="wc-right">
                <span className="wc-period">2023 - Present</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {ressoOpen && (
              <div className="wc-body">
                <p className="body-p">
                  Real-time AI conversation platform. I built the entire AI layer - <span className="hl">multi-agent routing, context memory, persona engine, and evaluation pipeline</span>. Sub-800ms response under live load, 30+ personas, 200+ live sessions.
                </p>

                <div className="chips-row">
                  {[
                    { n: "sub-800ms", l: "Latency" },
                    { n: "200+", l: "Live sessions" },
                    { n: "72%→98%", l: "Context retention" },
                    { n: "30+", l: "AI personas" },
                  ].map((m, i) => (
                    <div key={i} className="chip">
                      <div className="chip-n" style={{ color: '#0a7a6a' }}>{m.n}</div>
                      <div className="chip-l">{m.l}</div>
                    </div>
                  ))}
                </div>

                <div className="sh3" style={{ marginTop: 22 }}>What I built</div>
                <div className="built-grid">
                  <div className="built-card">
                    <div className="built-title">Agent Orchestration Layer</div>
                    <div className="built-desc">State-machine routing that switches agents in real time as the conversation shifts - barge-in, topic switch, silence timeout all handled automatically.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Context Memory System</div>
                    <div className="built-desc">Vector session memory over HNSW index. Only relevant past turns are retrieved - no context window overflow, no lost thread.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">30+ Persona Engine</div>
                    <div className="built-desc">Each client gets a versioned AI persona - tone, knowledge base, tool access. Changing one persona never breaks another.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Evaluation Dashboards</div>
                    <div className="built-desc">Daily per-persona tracking of accuracy, latency, and session completion. We know before a customer complains.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#e4faf5', borderColor: '#0a928040' }}>
                  <div className="align-label" style={{ color: '#0a9280' }}>Why this aligns to Amex</div>
                  <div className="align-text">
                    Amex's AI agents handle real financial conversations - disputes, fraud, account management. <strong>I built that system already.</strong> Different domain, identical architecture: multi-agent routing, context memory, live performance monitoring. The only thing that changes is the training data.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COROL */}
        <div className="section">
          <div className="eyebrow">Domain Learning + ML</div>
          <div className="sh2" style={{ marginBottom: 18 }}>What I did at Corol / NunaFab</div>

          <div className={`work-card ${corolOpen ? "open" : ""}`}>
            <div className="wc-header" onClick={() => setCorolOpen(!corolOpen)}>
              <div className="wc-left">
                <div className="wc-init" style={{ background: '#fffbeb', color: '#9a6000', border: '1px solid #d9920040' }}>C</div>
                <div>
                  <div className="wc-name">Corol / NunaFab</div>
                  <div className="wc-role">ML Engineer · Research Tool Builder</div>
                </div>
              </div>
              <div className="wc-right">
                <span className="wc-period">2023 - 2024</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {corolOpen && (
              <div className="wc-body">
                <p className="body-p">
                  Built an <span className="hl-amber">AI strength prediction platform</span> for Ultra-High Performance Concrete - a domain I had zero background in when I started. 12 research engineers used it daily to replace hours of manual testing with a 2-second prediction.
                </p>

                <div className="chips-row">
                  {[
                    { n: "R² 0.73", l: "Accuracy" },
                    { n: "2,200", l: "Training samples" },
                    { n: "12", l: "Daily users" },
                    { n: "2 sec", l: "Prediction time" },
                  ].map((m, i) => (
                    <div key={i} className="chip">
                      <div className="chip-n" style={{ color: '#b87000' }}>{m.n}</div>
                      <div className="chip-l">{m.l}</div>
                    </div>
                  ))}
                </div>

                <div className="sh3" style={{ marginTop: 22 }}>What made it hard</div>
                <div className="built-grid">
                  <div className="built-card">
                    <div className="built-title">Learning a New Domain Fast</div>
                    <div className="built-desc">Zero concrete science background. Read ACI papers with the scientists, asked questions, learned why each feature mattered before touching the model.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Making Scientists Trust AI</div>
                    <div className="built-desc">Ran SHAP analysis and showed feature rankings matched their domain intuition. They saw their expertise reflected in the model.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Production, Not Demo</div>
                    <div className="built-desc">Built a FastAPI + React tool that replaced physical lab tests with a 2-second prediction. Used every day, not once in a presentation.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Business Outcome First</div>
                    <div className="built-desc">Measured success in hours saved per week, fewer physical tests, lower material waste - not just R² score.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#fffbeb', borderColor: '#d9920040' }}>
                  <div className="align-label" style={{ color: '#b87000' }}>Why this aligns to Amex</div>
                  <div className="align-text">
                    Financial risk, credit models, dispute logic - a domain I do not know yet. But I learned concrete science in weeks by sitting with experts and building tools they actually trusted. <strong>That is the exact same ramp.</strong> I will do it again, faster, with higher stakes, and I will enjoy it.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* BUSINESS REQUIREMENTS & PROBLEM SOLVING */}
        <div id="sec-biz-req-hr" className="section">
          <div className="eyebrow">Business Requirement Approach</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Discovery → Spec → Alignment → Delivery: end-to-end business ownership.</div>
          <p className="body-p" style={{ marginBottom: 28 }}>I have never waited for a PM to hand me requirements. Every project started with me in the room with stakeholders - understanding the real problem, translating it to specs, aligning everyone on the plan, and staying accountable until delivery.</p>

          {/* RESSO BIZ REQ */}
          <div style={{ background: '#fff', border: '1.5px solid #0a928030', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #f0fdfb, #fff)', borderBottom: '1px solid #0a928020', padding: '18px 24px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#0a9280', marginBottom: 4, fontWeight: 700 }}>Production · AI Startup · 2024-Present</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Resso.ai - Multi-Agent Voice Platform</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#0a9280', background: '#e4faf5', border: '1px solid #0a928040', borderRadius: 20, padding: '4px 12px', alignSelf: 'flex-start' }}>● LIVE</span>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <div className="spec-grid">
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Requirement Discovery</div>
                  <div className="spec-text">Sat with enterprise clients (edtech) for 2-3 days before writing a line of code. Mapped their current call workflows - where agents dropped context, what triggered escalation, which silences meant confusion vs. thinking. <strong>Built the spec from observed pain, not assumptions.</strong></div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>Translation to Engineering Spec</div>
                  <div className="spec-text">Converted stakeholder pain into measurable acceptance criteria: barge-in response under 400ms, context retention across 8+ turns, topic-switch without re-greeting the caller. Each criterion became a test in our eval pipeline. Stakeholders signed off on metrics, not vague feature descriptions.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Stakeholder Alignment</div>
                  <div className="spec-text">Weekly eval dashboard shared with clients: per-persona accuracy, latency percentiles, completion rate. Stakeholders could see their own numbers before approval calls. <strong>No surprises. No "it's almost ready."</strong> Every deployment had a client-signed eval report attached.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Delivered Business Outcome</div>
                  <div className="spec-text">Hallucination rate dropped from 14% to 3.8%. Context retention 72% → 98%. 200+ concurrent sessions at sub-800ms end-to-end. Clients renewed. One client expanded from 1 persona to 5 within 3 months of go-live - the product worked well enough they wanted more of it.</div>
                </div>
              </div>
            </div>
          </div>

          {/* COROL BIZ REQ */}
          <div style={{ background: '#fff', border: '1.5px solid #b8700030', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fff)', borderBottom: '1px solid #b8700018', padding: '18px 24px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#b87000', marginBottom: 4, fontWeight: 700 }}>Production · Materials ML · 2023-2024</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Corol - UHPC Strength Prediction Platform</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#b87000', background: '#fffbeb', border: '1px solid #b8700040', borderRadius: 20, padding: '4px 12px', alignSelf: 'flex-start' }}>12 Engineers · Daily Use</span>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <div className="spec-grid">
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Requirement Discovery</div>
                  <div className="spec-text">Shadowed 12 research engineers for 3 days before touching the data. Watched them run physical lab tests, record results manually, and repeat for every mix variation. <strong>The real bottleneck was not analysis - it was the hours waiting for each physical test result.</strong> That single insight changed the entire problem framing: predict before you pour.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Translation to Engineering Spec</div>
                  <div className="spec-text">Translated domain knowledge into ML acceptance criteria: R² must exceed 0.70 on holdout, feature importance rankings must match the engineers&apos; known influential variables (w/c ratio, silica fume %), prediction latency under 3 seconds. Each criterion was a test. Scientists signed off on what &quot;good enough to trust&quot; meant before I started training.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Stakeholder Alignment</div>
                  <div className="spec-text">Research engineers are skeptical of ML by default - they spent years building intuition about concrete behaviour. Used SHAP to show that the model&apos;s top features matched their expertise exactly. <strong>Seeing the model reflect their domain knowledge</strong> converted them from critics to champions. They demoed the tool to the broader team themselves.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#dc2626' }}>Delivered Business Outcome</div>
                  <div className="spec-text">12 research engineers using the platform daily. R² 0.73 on 2,200 training samples. 2-second predictions replaced hours of physical lab testing per mix iteration. The team could screen hundreds of mix combinations in a single afternoon that previously took weeks. <strong>Domain learning completed in weeks, tool trusted on day one of launch.</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* LAWLINE BIZ REQ */}
          <div style={{ background: '#fff', border: '1.5px solid #dc262630', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #fff5f5, #fff)', borderBottom: '1px solid #dc262618', padding: '18px 24px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#dc2626', marginBottom: 4, fontWeight: 700 }}>Live · Legal AI · 2024</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>Lawline.tech - Attorney-Grade Legal AI</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #dc262640', borderRadius: 20, padding: '4px 12px', alignSelf: 'flex-start' }}>● LIVE</span>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <div className="spec-grid">
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#dc2626' }}>Requirement Discovery</div>
                  <div className="spec-text">Interviewed 4 attorneys before writing a line of code. The real requirement was not "AI search" - it was <strong>privilege-safe research that held up in court</strong>. Attorneys needed to prove, if challenged, that no client data ever left their office. That became the primary constraint that shaped every architectural decision.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Translation to Engineering Spec</div>
                  <div className="spec-text">Translated privilege requirements to concrete system invariants: (1) zero external HTTP calls after initial setup, (2) all embeddings encrypted at rest with attorney-controlled keys, (3) structured local audit log exportable as PDF for court. Every spec item had a test proving the invariant held.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Stakeholder Alignment</div>
                  <div className="spec-text">Attorneys are not technical. Ran a demo showing network activity monitor: zero outbound packets during a query. That visual proof - <strong>watching the network stay silent</strong> while the AI worked - closed the trust gap faster than any technical document. Attorneys shared that demo with their law society contacts.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#6d28d9' }}>Delivered Business Outcome</div>
                  <div className="spec-text">Platform is live at lawline.tech. Attorneys use it for case research daily. The zero-telemetry architecture became a word-of-mouth differentiator - in a profession where trust is the product, <strong>the architecture was the pitch</strong>. Zero compliance incidents since launch.</div>
                </div>
              </div>
            </div>
          </div>

          {/* TTC BIZ REQ */}
          <div style={{ background: '#fff', border: '1.5px solid #1d4ed830', borderRadius: 16, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #fff)', borderBottom: '1px solid #1d4ed820', padding: '18px 24px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#1d4ed8', marginBottom: 4, fontWeight: 700 }}>Capstone · Transit AI · Pitching May 2026</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: '#0d0d0d', letterSpacing: '-.02em' }}>TTC Lost &amp; Found - Intelligent Transit Recovery</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #1d4ed840', borderRadius: 20, padding: '4px 12px', alignSelf: 'flex-start' }}>Pitching May 2026</span>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <div className="spec-grid">
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>Requirement Discovery</div>
                  <div className="spec-text">Shadowed TTC lost-and-found staff at Union Station for a full day. Watched them manually cross-reference printed item logs with incoming online submissions. The bottleneck was not staff - it was <strong>the absence of any matching logic</strong>. A "blue bag" report matched nothing because there was no system to match it to.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Translation to Engineering Spec</div>
                  <div className="spec-text">Defined success as measurable recovery-rate improvement. Spec required: (1) ML match confidence score per pair, (2) staff-facing review queue ranked by confidence, (3) automated notification to rider within 24 hours of high-confidence match, (4) admin analytics showing recovery trends over time.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>Stakeholder Alignment</div>
                  <div className="spec-text">TTC has procurement, IT security, and operations - three different stakeholders with different concerns. Built a presentation layer showing each audience only their relevant metrics. Operations saw recovery rates. IT saw the security model. Procurement saw cost vs. manual-staff comparison. <strong>Same product, three different narratives, all true.</strong></div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Delivered Business Outcome</div>
                  <div className="spec-text">Full system built: submission portal, staff dashboard, ML matching pipeline, notification system, admin analytics. Production-ready architecture. Pitching to TTC stakeholders in <strong>May 2026</strong> with a working demo and recovery-rate projections based on 3 months of historical TTC data.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* LANGUAGE & RUNTIME - INTENTIONAL DECISIONS */}
        <div id="sec-languages-hr" className="section">
          <div className="eyebrow">Engineering Judgment · Language Selection</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Every technology choice was deliberate - not default</div>
          <p className="body-p" style={{ marginBottom: 24 }}>Senior engineers do not pick languages because they are comfortable. They pick them because the trade-offs fit the problem. Here is how I think through every runtime decision - with numbers to back it up.</p>

          <div style={{ background: '#fff', border: '1.5px solid #e0e0da', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: '#fafaf8', padding: '16px 22px 14px', borderBottom: '1px solid #ebebeb' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: '#0d0d0d' }}>Python vs Java vs Go - why each language lives where it does</div>
            </div>
            <div style={{ padding: '18px 22px 22px' }}>
              <div className="spec-grid">
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#0a9280' }}>Why Python for ML, not Java</div>
                  <div className="spec-text">Java JVM cold start: 2-8 seconds. Unacceptable for containerised inference pods. PyTorch, SHAP, and LangGraph have no Java equivalents - you would be bridging JNI calls into C++ with marshalling overhead on every inference. Python FastAPI with uvicorn achieves <strong>sub-5ms p99 latency</strong> for structured inference. The ML ecosystem simply does not exist in Java.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#b87000' }}>Why Go for the network layer, not Node</div>
                  <div className="spec-text">Node.js is single-threaded - it uses an event loop for I/O, not true parallelism. Go goroutines are multiplexed across OS threads: 1,000 goroutines costs ~4MB. The same load in Node: ~1GB. At 200 concurrent voice sessions × 5 tool calls per turn, Go handled the fan-out at <strong>180ms end-to-end</strong>. Python at the same load: 800ms. The maths was not close.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#7c3aed' }}>The GIL problem, explained plainly</div>
                  <div className="spec-text">Python's Global Interpreter Lock means only one thread executes at a time. asyncio masks this for I/O - it does not fix it for CPU-bound work. Model inference is CPU-bound. We moved concurrency to Go (which has no GIL) and kept ML logic in Python. <strong>Each process does exactly what it is fastest at.</strong> The boundary is a local Unix socket - sub-1ms overhead.</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title" style={{ color: '#1d4ed8' }}>The Amex implication</div>
                  <div className="spec-text">Amex runs Java and Python at scale. I understand the trade-offs deeply - when to use each, how they interact, and where the performance cliffs are. I will not advocate for a rewrite. I will understand the existing architecture, identify where the language choice is causing friction, and propose targeted solutions backed by data.</div>
                </div>
              </div>
              <div style={{ background: '#0d0d0d', borderRadius: 10, padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#555', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>Measured latency at 200 concurrent sessions</div>
                {[
                  { label: 'Go MCP layer', val: '180ms', color: '#0abfa8' },
                  { label: 'Node equivalent', val: '420ms', color: '#b87000' },
                  { label: 'Python only', val: '800ms', color: '#dc2626' },
                  { label: 'Python cold start', val: '380ms', color: '#0abfa8' },
                  { label: 'Java cold start', val: '4,200ms', color: '#dc2626' },
                ].map((b, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: b.color }}>{b.val}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#555', marginTop: 2 }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* ZERO HALLUCINATION - HR ANGLE */}
        <div id="sec-hallucination-hr" className="section">
          <div className="eyebrow">Quality Engineering · Accountability</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Zero Hallucination - I ship AI that can be trusted</div>
          <p className="body-p" style={{ marginBottom: 24 }}>In financial services, a hallucinated AI response is not a UX bug - it is a compliance incident. I built a 6-layer defense that dropped hallucination rate from <strong>14% to 3.8%</strong> at Resso and to near-zero at Lawline. Every layer is independently verifiable.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            {[
              { num: '01', title: 'Schema-First Output Constraints', color: '#0a9280', bg: '#f0fdfb', desc: 'Every LLM output passes through a Pydantic BaseModel. Required fields, enum constraints, confidence score ranges. The model cannot hallucinate a field that does not exist in the schema. Structurally impossible to produce malformed output.', metric: '14% → 3.8%', metricLabel: 'hallucination' },
              { num: '02', title: 'RAG - Ground Every Claim', color: '#7c3aed', bg: '#f5f3ff', desc: 'Retrieval-Augmented Generation: retrieve document chunks first, generate strictly from those chunks. At Lawline: FAISS vector store over case documents. If the answer is not in the source, the model says so. No confabulation.', metric: 'Zero', metricLabel: 'hallucinated citations' },
              { num: '03', title: 'SHAP Explainability', color: '#b87000', bg: '#fffbeb', desc: 'For ML models (Corol UHPC): SHAP values decompose every prediction into per-feature contributions. Engineers audit why a strength value was predicted. No black-box inference where stakes are high.', metric: 'R² 0.73', metricLabel: 'with full audit trail' },
              { num: '04', title: 'Confidence-Gated Routing', color: '#1d4ed8', bg: '#eff6ff', desc: 'Every model output carries a confidence score. Below threshold: route to human review, not to downstream action. The system knows what it does not know and admits it rather than guessing.', metric: 'Human review', metricLabel: 'on all low-confidence' },
              { num: '05', title: 'Constrained Re-prompt', color: '#dc2626', bg: '#fef2f2', desc: 'On validation failure: re-prompt the LLM with the exact schema error. Max 3 attempts. After that: safe default + dead letter queue. 80% of validation failures recovered on re-prompt.', metric: '80%', metricLabel: 'failures recovered' },
              { num: '06', title: 'DLQ Pattern Analysis', color: '#6d28d9', bg: '#faf5ff', desc: 'Every failed interaction enters a dead letter queue with full context. Reviewed weekly. DLQ analysis over 3 months identified 4 systematic prompt gaps driving 60% of failures - fixed each one.', metric: '60%', metricLabel: 'DLQ volume reduced' },
            ].map((layer, i) => (
              <div key={i} style={{ background: layer.bg, border: `1.5px solid ${layer.color}25`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 900, color: `${layer.color}25`, lineHeight: 1, flexShrink: 0 }}>{layer.num}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: '#0d0d0d', lineHeight: 1.3 }}>{layer.title}</div>
                </div>
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.65, marginBottom: 10 }}>{layer.desc}</div>
                <div style={{ background: '#0d0d0d', borderRadius: 6, padding: '6px 10px', display: 'inline-flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: layer.color }}>{layer.metric}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: '#666' }}>{layer.metricLabel}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Why this matters at Amex</div>
            <div style={{ fontSize: 13, color: '#999', lineHeight: 1.8 }}>Financial AI that hallucinates is a regulatory incident. Every layer in this stack directly maps to financial AI safety requirements: schema constraints prevent invalid transaction data, confidence gating prevents uncertain recommendations from reaching customers, DLQ analysis creates an audit trail of every failure. <strong style={{ color: '#f0f0f0' }}>I have already built the safety architecture fintech requires - in production, not on a whiteboard.</strong></div>
          </div>
        </div>

        <div className="divider" />

        {/* OBSERVABILITY - HR ANGLE */}
        <div id="sec-observability-hr" className="section">
          <div className="eyebrow">Production Ownership · You cannot fix what you cannot see</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Observability - I monitor every system I ship</div>
          <p className="body-p" style={{ marginBottom: 24 }}>Shipping is not the end of the job. I own the systems I build after they go live - logs, metrics, traces, alerts, and daily eval dashboards. When something breaks, I know about it before the user does.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            {[
              {
                title: 'Structured Logging', color: '#0a9280',
                desc: 'Every FastAPI request emits structured JSON: request_id, session_id, tool_name, input/output tokens, latency_ms, validation result, retry count. Machine-parseable - no regex needed. Audit-ready format for regulated environments.',
                tags: ['JSON structured logs', 'Correlation IDs', 'Zero PII in logs', 'Audit-ready']
              },
              {
                title: 'Distributed Tracing', color: '#7c3aed',
                desc: 'OpenTelemetry spans from WebSocket ingest through LangGraph state through Go MCP server through tool adapters. Every hop is a child span. When a voice turn exceeds 800ms SLA, the trace shows exactly which node added the latency.',
                tags: ['OpenTelemetry', 'Span per tool call', 'SLA violation detection', 'Cross-service traces']
              },
              {
                title: 'Prometheus + Grafana Dashboards', color: '#dc2626',
                desc: 'Per-persona dashboards: tool call latency histogram, validation failure counter, DLQ depth gauge, context retention rate. PagerDuty alert if p99 exceeds 1.5s for 3 minutes. I see spikes before clients call.',
                tags: ['Prometheus histograms', 'Grafana per-persona', 'PagerDuty alerts', 'SLO burn rate']
              },
              {
                title: 'LLM Eval Pipeline', color: '#b87000',
                desc: '500-document automated eval suite on every git push: accuracy (F1), context retention, latency percentiles, hallucination rate. Build blocked if accuracy drops more than 2% from baseline. Regression-detected before it reaches production.',
                tags: ['500-doc golden set', 'F1 entity accuracy', 'Build-blocking checks', 'Daily regression detection']
              },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: `1.5px solid ${item.color}20`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 10 }}>{item.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {item.tags.map(t => <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}20`, borderRadius: 4, padding: '2px 7px' }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fafaf8', border: '1px solid #e0e0da', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Metrics I watch every morning</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
              {['p99 agent response latency', 'Validation failure rate', 'DLQ depth', 'Context retention score', 'Tool call success rate', 'Hallucination rate'].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0a9280', flexShrink: 0 }} />{m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* RESILIENCE ENGINEERING - HR ANGLE */}
        <div id="sec-resilience-hr" className="section">
          <div className="eyebrow">Engineering Maturity · Failure Mode Design</div>
          <div className="sh2" style={{ marginBottom: 6 }}>I design for failure before I write the happy path</div>
          <p className="body-p" style={{ marginBottom: 24 }}>Junior engineers write code that works when everything goes right. Senior engineers enumerate what can go wrong before writing a line. Here is how I handle each critical failure mode in the systems I shipped - and the P0 I resolved the morning of this interview.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {[
              {
                failure: 'LLM API timeout / rate limit', severity: 'P1', color: '#dc2626',
                naive: 'Throw an exception, page the engineer, user sees an error.',
                real: 'Exponential backoff with jitter (100ms to 200ms to 400ms + random offset). After 3 attempts: safe fallback response + DLQ entry. Rate limit: token bucket on our side before hitting the API. Zero silent failures.',
                pattern: 'Retry + jitter + circuit breaker + graceful fallback'
              },
              {
                failure: 'Schema validation failure', severity: 'P2', color: '#b87000',
                naive: 'Crash the request, log the error, hope it does not recur.',
                real: 'Re-prompt with the exact Pydantic error. Max 3 attempts, each with the previous error context. 80% of failures recovered on re-prompt. Remainder to DLQ for pattern analysis.',
                pattern: 'Constrained re-prompt x3 then DLQ then pattern fix'
              },
              {
                failure: 'K8s pod OOMKilled during inference', severity: 'P1', color: '#1d4ed8',
                naive: 'Pod restarts, in-flight requests dropped, user session lost.',
                real: 'Session state in Redis - not in-process. Restarted pod reconnects to existing session. Readiness probe prevents traffic until model is warm. HPA scales out before memory pressure hits.',
                pattern: 'Redis state + liveness probe + readiness probe + HPA'
              },
              {
                failure: 'Production force-push (March 17, 2026)', severity: 'P0', color: '#6d28d9',
                naive: 'Rollback. Escalate. Fire the intern.',
                real: 'Wired staging to prod PostgreSQL + vector DB + Redis. Redirected DNS to staging. 24 minutes to full restoration. Zero data loss. Fixed root cause: mandatory PR review + commit signing. Made the Amex interview on time.',
                pattern: 'DNS redirect + staging-as-prod + root cause fix + process change'
              },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: `1.5px solid ${item.color}20`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px 10px', background: `${item.color}08`, borderBottom: `1px solid ${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#0d0d0d' }}>{item.failure}</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}30`, borderRadius: 10, padding: '2px 9px' }}>{item.severity}</span>
                </div>
                <div style={{ padding: '12px 16px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#dc2626', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Naive approach</div>
                  <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>{item.naive}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#0a9280', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>What I built</div>
                  <div style={{ fontSize: 12, color: '#444', lineHeight: 1.7, marginBottom: 10 }}>{item.real}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}20`, borderRadius: 6, padding: '5px 10px' }}>{item.pattern}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 12, padding: '18px 22px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>The principle</div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8 }}>Resilience is not about preventing failures - it is about <strong style={{ color: '#f0f0f0' }}>bounding the blast radius</strong>. Every service has a degradation path: full service → cached fallback → safe default → human escalation. No path ends in silence or a 500.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { val: '24 min', label: 'P0 resolution time' },
                { val: '0', label: 'silent failures (everything logged)' },
                { val: '60%', label: 'DLQ reduction after pattern analysis' },
                { val: '0', label: 'session losses on pod restart' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, color: '#0a9280', minWidth: 52 }}>{s.val}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#888' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* FULL STACK */}
        <div className="section">
          <div className="eyebrow">Full-Spectrum Engineer</div>
          <div className="sh2" style={{ marginBottom: 6 }}>iOS to blockchain, CI/CD to cloud - every layer, bridged to business.</div>
          <p className="body-p" style={{ marginBottom: 20 }}>
            I don&apos;t need a specialist for every layer. I understand the model, the API, the pipeline, the UI, the infra, and the business requirement sitting behind all of it. That is what makes me dangerous as a hire - I close gaps other engineers leave open.
          </p>
          <div className="breadth-grid">
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#0a9280' }}>AI / ML Core</div>
              <div className="breadth-tags">
                {['Python','PyTorch','LangGraph','LangChain','GPT-4o','GGUF Quant','HNSW','RAG','Pydantic'].map(t => <span key={t} className="breadth-tag bt-hi">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#1d4ed8' }}>Cloud &amp; Infra</div>
              <div className="breadth-tags">
                {['Azure OpenAI','Azure Slots','AWS EC2/S3/Lambda','SageMaker','Kubernetes','Docker','HPA','Rolling Deploys'].map(t => <span key={t} className="breadth-tag bt-blue">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#6d28d9' }}>CI/CD &amp; DevOps</div>
              <div className="breadth-tags">
                {['GitHub Actions','K8s Rolling Updates','Liveness Probes','Readiness Probes','Staging Environments','Blue/Green','Docker Compose'].map(t => <span key={t} className="breadth-tag bt-purple">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#0a9280' }}>Backend</div>
              <div className="breadth-tags">
                {['FastAPI','Go','Node.js','PostgreSQL','Redis','Kafka','gRPC','REST','WebSocket','Prisma ORM'].map(t => <span key={t} className="breadth-tag bt-hi">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#b87000' }}>Frontend</div>
              <div className="breadth-tags">
                {['Next.js 15','React','TypeScript','Tailwind CSS','WebSocket UI','Real-time dashboards'].map(t => <span key={t} className="breadth-tag bt-amber">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#6d28d9' }}>Mobile</div>
              <div className="breadth-tags">
                {['iOS','Swift','SwiftUI','Mobile-first design'].map(t => <span key={t} className="breadth-tag bt-purple">{t}</span>)}
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
                {['Air-gapped LLM deploy','Zero telemetry','On-prem inference','Auth flows','Attorney-client privilege mode','Zero cloud dependency'].map(t => <span key={t} className="breadth-tag bt-red">{t}</span>)}
              </div>
            </div>
            <div className="breadth-row">
              <div className="breadth-cat" style={{ color: '#b87000' }}>Business Bridge</div>
              <div className="breadth-tags">
                {['Stakeholder pitching','Requirement analysis','Domain expert interviews','Product thinking','ROI framing','Board-level communication'].map(t => <span key={t} className="breadth-tag bt-amber">{t}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* PLATFORMS */}
        <div className="section">
          <div className="eyebrow">Live in Production</div>
          <div className="sh2" style={{ marginBottom: 6 }}>Not demos. Systems with real users, real load, real stakes.</div>
          <p className="body-p" style={{ marginBottom: 18 }}>Click to see. These are the platforms I architected, built, and still operate today.</p>

          <div className="video-grid">
            <a href="https://www.resso.ai" target="_blank" rel="noopener" className="video-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="video-thumb" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden', position: 'relative' }}>
                <img src="/images/portfolio/resso.png" alt="Resso.ai" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 0.9 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0006 30%, transparent)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#0a9280', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.1em' }}>LIVE ↗</div>
              </div>
              <div className="v-info">
                <div className="v-title">Multi-Agent Real-Time Conversation Platform</div>
                <div className="v-desc">200+ sessions · sub-800ms · Azure OpenAI · 30+ personas</div>
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
                <div className="v-desc">R² 0.73 · 12 engineers daily · FastAPI · React</div>
              </div>
            </a>
          </div>
        </div>

        <div className="divider" />

        {/* BUSINESS TO TECH BRIDGE */}
        <div id="sec-biz-tech" className="section">
          <div className="eyebrow">The Bridge · Business Requirement to Production System</div>
          <div className="sh2" style={{ marginBottom: 6 }}>I am the translator between the boardroom and the codebase</div>
          <p className="body-p" style={{ marginBottom: 24 }}>Most engineers wait for someone to hand them a ticket. I sit in the room where the problem is first articulated, translate it into a spec, build it, ship it, and report back in the language the business understands. Here is that exact loop - shown end-to-end on real projects.</p>

          {[
            {
              project: 'Resso.ai', color: '#0a9280', bg: '#f0fdfb',
              biz: 'Enterprise clients are losing revenue because their AI call agents drop context mid-conversation and confuse customers. The CEO wants a fix in 30 days.',
              gap: 'The business problem is "lost revenue." The technical problem is stateful multi-turn conversation at sub-second latency under concurrency. These are not the same sentence.',
              tech: 'LangGraph StateGraph for deterministic state transitions. Redis for sub-5ms session reads between turns. K8s HPA to scale before peak. Go goroutines for concurrent tool calls. Pydantic for schema-validated outputs.',
              outcome: 'Context retention 72% → 98%. Hallucination 14% → 3.8%. Client renewed and expanded from 1 persona to 5. The business metric (revenue retention) moved because the right technical decisions were made.',
            },
            {
              project: 'Lawline.tech', color: '#dc2626', bg: '#fef2f2',
              biz: 'Attorneys want AI research assistance but cannot use any cloud service. Attorney-client privilege means one data leak ends careers. The requirement is "AI that cannot breach privilege."',
              gap: '"Cannot breach privilege" is a legal constraint, not a feature request. Translating it means: zero external HTTP calls, all inference local, encrypted storage with attorney-controlled keys, exportable audit log.',
              tech: 'GGUF-quantised local model. AES-256 encrypted FAISS index. FastAPI with network firewall rules blocking outbound. Local audit log exportable as PDF. Zero telemetry - not reduced telemetry.',
              outcome: 'Zero compliance incidents. Platform is live. Attorneys demo the "zero outbound packets" screen to their law society contacts. The architecture became the sales pitch.',
            },
            {
              project: 'Corol UHPC', color: '#b87000', bg: '#fffbeb',
              biz: 'Research engineers spend hours on each physical concrete test. The lab director wants to run more mix experiments per week without expanding the lab team.',
              gap: '"More experiments per week" is not a data science brief. It means: prediction latency under 3 seconds, R² high enough for engineers to trust without physical verification, explainability they can show their PI.',
              tech: 'Random Forest (not XGBoost) for variance stability on small dataset. SHAP for feature-level explainability. FastAPI endpoint with Pydantic mix schema. React dashboard usable mid-experiment on any machine.',
              outcome: 'Engineers screen hundreds of mixes in one afternoon that previously took weeks. 12 daily users. The tool was trusted because the business requirement (explain your reasoning) was baked into the model, not bolted on.',
            },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', border: `1.5px solid ${item.color}25`, borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ background: `${item.bg}`, padding: '14px 22px 12px', borderBottom: `1px solid ${item.color}15` }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#0d0d0d' }}>{item.project}</div>
              </div>
              <div style={{ padding: '16px 22px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#fafaf8', border: '1px solid #ebebeb', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: item.color, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Business said</div>
                  <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>{item.biz}</div>
                </div>
                <div style={{ background: '#fafaf8', border: '1px solid #ebebeb', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#7c3aed', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>The translation gap</div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{item.gap}</div>
                </div>
                <div style={{ background: '#fafaf8', border: '1px solid #ebebeb', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#1d4ed8', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Technical decisions made</div>
                  <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>{item.tech}</div>
                </div>
                <div style={{ background: item.bg, border: `1px solid ${item.color}20`, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#0a9280', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Business outcome</div>
                  <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>{item.outcome}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* WATER - ROLE ADAPTABILITY */}
        <div id="sec-water" className="section">
          <div className="eyebrow">Adaptability · Be Like Water</div>
          <div className="sh2" style={{ marginBottom: 6 }}>I fit the shape of any role - with depth, not dilution</div>
          <p className="body-p" style={{ marginBottom: 8 }}>Most engineers are T-shaped: deep in one thing, shallow elsewhere. I am more like water - I take the shape of whatever role the team needs, without losing the depth that makes me useful. Here is the evidence across every role Amex might need.</p>
          <p className="body-p" style={{ marginBottom: 28 }}>The key: every role below is backed by <strong>production systems, not side projects</strong>. And underpinning all of it is deep ML/AI fluency - which means I understand why the tools work, not just how to use them.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              {
                role: 'Azure / Cloud Engineer', color: '#0078d4', bg: '#eff6ff',
                depth: 'Azure OpenAI GPT-4o deployment slots with zero-downtime staging → prod swap. Azure AKS with HPA + liveness/readiness probes. Azure data residency configured for Canadian compliance. AWS certified: EC2, S3, Lambda, SageMaker.',
                proof: 'Resso.ai runs on Azure in production. 200+ concurrent sessions. Zero unplanned downtime.',
                ml: 'Understand how Azure OpenAI deployment quotas, TPM limits, and dedicated capacity affect model response latency - not just that they exist.'
              },
              {
                role: 'CI/CD Engineer', color: '#6d28d9', bg: '#f5f3ff',
                depth: 'GitHub Actions pipelines: build → test → eval → deploy. Automated 500-doc LLM eval on every push - build blocked on accuracy regression. K8s rolling updates. Staging environments wired to production data stores for realistic testing.',
                proof: 'The morning of this interview: restored a broken prod environment in 24 minutes by redirecting DNS to staging. Root cause fixed. PR review enforced.',
                ml: 'Know that LLM eval pipelines need different CI gates than traditional unit tests - F1, hallucination rate, and context retention are not pass/fail booleans.'
              },
              {
                role: 'LLM Security Engineer', color: '#dc2626', bg: '#fef2f2',
                depth: 'Prompt injection defense in production. AES-256 encrypted vector stores. Zero-egress enforcement at the MCP layer - adapters blocked from making external calls. Local audit logs exportable for court. Zero PII in structured logs.',
                proof: 'Lawline.tech: zero compliance incidents. Attorneys use the "zero outbound packets" demo as their trust proof.',
                ml: 'Understand jailbreak vectors, indirect prompt injection via retrieved documents, and why RAG-based systems need output filtering on top of retrieval filtering.'
              },
              {
                role: 'Prompt Engineer', color: '#b87000', bg: '#fffbeb',
                depth: 'Prompt engineering is not creative writing - it is systematic. Built constrained re-prompt loops: schema error → structured correction → retry. Persona prompts for 30+ enterprise clients. Chain-of-thought prompts for multi-step legal reasoning. System prompt versioning in git.',
                proof: 'Context retention 72% → 98%. The difference was prompt architecture, not model upgrade.',
                ml: 'Know why chain-of-thought works (forces scratchpad reasoning), when few-shot beats zero-shot, and how to measure prompt quality with automated eval.'
              },
              {
                role: 'Full-Stack AI Engineer', color: '#0a9280', bg: '#f0fdfb',
                depth: 'FastAPI backend + Next.js 15 App Router frontend + WebSocket real-time layer + Prisma ORM + PostgreSQL + Redis. Built every layer. No handoff to frontend specialists, no handoff to backend specialists. The entire system is mine.',
                proof: 'Resso.ai platform end-to-end. Lawline.tech end-to-end. TTC full-stack capstone. Solo on all three.',
                ml: 'Can wire a PyTorch model prediction directly into a React dashboard with a FastAPI endpoint in between - and understand the latency budget at each hop.'
              },
              {
                role: 'Business Analyst to Tech', color: '#0e7490', bg: '#ecfeff',
                depth: 'Shadowed TTC staff for a full day before writing a line of code. Interviewed 4 attorneys before speccing Lawline. Sat with enterprise call centre clients for 2-3 days at Resso. Every project started with me in the room with the people who had the problem.',
                proof: 'Every project on this page. None started with a ticket. All started with a conversation.',
                ml: 'Can translate "our AI is giving wrong answers" into a hallucination rate metric, identify which of the 6 defense layers is failing, and fix it - without needing a BA to mediate.'
              },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: `1.5px solid ${item.color}20`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: item.bg, padding: '12px 16px 10px', borderBottom: `1px solid ${item.color}15` }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#0d0d0d' }}>{item.role}</div>
                </div>
                <div style={{ padding: '12px 16px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: item.color, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>Depth</div>
                  <div style={{ fontSize: 12, color: '#444', lineHeight: 1.65, marginBottom: 10 }}>{item.depth}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#0a9280', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>Production proof</div>
                  <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>{item.proof}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#7c3aed', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>ML/AI understanding underneath</div>
                  <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6, background: '#f5f3ff', border: '1px solid #7c3aed15', borderRadius: 6, padding: '7px 10px' }}>{item.ml}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 14, padding: '22px 26px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#0a9280', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>The ML/AI foundation that makes all of this possible</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { title: 'Model internals', color: '#0abfa8', text: 'Understand transformer attention, context window limits, temperature effects, and why chain-of-thought forces better reasoning. This is not a user-level understanding - it drives architectural decisions.' },
                { title: 'Training and eval', color: '#7c3aed', text: 'Built custom eval pipelines. Know F1 vs. accuracy trade-offs. Understand when R² is the wrong metric. Can design a golden dataset, detect distribution shift, and run regression tests on model updates.' },
                { title: 'Production ML patterns', color: '#b87000', text: 'RAG architecture, vector store trade-offs (HNSW vs flat index), SHAP explainability, model quantization (GGUF), ensemble methods. Deployed all of these. They are not academic references.' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: item.color, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#999', lineHeight: 1.75 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="cta">
          <div className="cta-h">The frameworks are built. The proof is above. Make the call.</div>
          <div className="cta-p" style={{ marginBottom: 20 }}>Production AI. Leadership under pressure. Enterprise-level conversations. Day one contributor - not a six-month ramp.</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <a href="mailto:emailtosolankiom@gmail.com" className="cta-btn">emailtosolankiom@gmail.com →</a>
            <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">LinkedIn ↗</a>
            <a href="https://www.lawline.tech" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">Lawline.tech ↗</a>
          </div>
        </div>
      </div>

      {/* FLOATING HR CHECKLIST */}
      {!trackerOpen ? (
        <div className="hr-fab-wrap" onClick={() => setTrackerOpen(true)}>
          <div className="hr-fab-label">
            Click Here
            {timerActive && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: timeLeft <= 60 ? '#f87171' : '#0abfa8', fontWeight: 800, marginLeft: 8 }}>{fmtTime(timeLeft)}</span>}
          </div>
          <div className="hr-fab">
            <div className="hr-fab-ring" />
            <div className="hr-fab-ring hr-fab-ring2" />
            <div className="hr-fab-inner">
              <div className="hr-fab-num">{checked.size}/10</div>
              <div className="hr-fab-lbl">checklist</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hr-tracker-panel">
          <div className="hr-tracker-head">
            <div>
              <div className="hr-tracker-title">Amex HR - Requirements Checklist</div>
              <div className="hr-tracker-sub">CHECK OFF EACH AS YOU VERIFY IT IN THIS PAGE</div>
            </div>
            <button className="hr-tracker-close" onClick={() => setTrackerOpen(false)}>x</button>
          </div>

          <div style={{ padding: '12px 16px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888', fontWeight: 600 }}>{checked.size}/10 checked</span>
              {timerActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: timeLeft <= 60 ? '#dc2626' : '#0a9280', animation: 'blink2 1s infinite' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: timeLeft <= 60 ? '#dc2626' : '#0a9280', fontWeight: 800, letterSpacing: '.06em' }}>{fmtTime(timeLeft)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#555', letterSpacing: '.1em' }}>RESETS</span>
                </div>
              )}
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 6, height: 4, overflow: 'hidden' }}>
              <div style={{ background: timerActive && timeLeft <= 60 ? 'linear-gradient(90deg, #dc2626, #f87171)' : 'linear-gradient(90deg, #0a9280, #0abfa8)', height: '100%', width: `${(checked.size / 10) * 100}%`, borderRadius: 6, transition: 'width .4s ease, background .3s' }} />
            </div>
            {timerActive && (
              <div style={{ background: '#1a1a1a', borderRadius: 6, height: 2, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ background: timeLeft <= 60 ? '#dc262660' : '#0a928040', height: '100%', width: `${(timeLeft / 240) * 100}%`, borderRadius: 6, transition: 'width 1s linear' }} />
              </div>
            )}
          </div>

          <div style={{ padding: '4px 0 4px' }}>
            {hrJdNav.map((item, idx) => {
              const isChecked = checked.has(idx);
              return (
                <div key={idx} className="hr-tracker-item" onClick={() => toggleCheck(idx)}>
                  <div className={`hr-tracker-cb${isChecked ? ' done' : ''}`}>
                    {isChecked && <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, opacity: isChecked ? 0.5 : 1, transition: 'opacity .2s' }}>
                    <div className="hr-tracker-req" style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>{item.req}</div>
                    <div className="hr-tracker-proof">{item.proof}</div>
                    <div className="hr-tracker-metric">{item.metric}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hr-tracker-footer">
            <div className="hr-tracker-footer-text">
              {!timerActive && checked.size === 0 && <>Click each to check it off and jump to the evidence. <strong>Timer starts on first check.</strong></>}
              {timerActive && checked.size < 10 && <><strong>{10 - checked.size} remaining</strong> - resets in {fmtTime(timeLeft)}.</>}
              {checked.size === 10 && <><strong>All 10 verified.</strong> Every one maps to a production system.</>}
            </div>
          </div>
        </div>
      )}

      {videoOpen && (
        <div className="overlay" onClick={() => setVideoOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-ttl">{videoOpen === "resso" ? "Resso.ai - Agent Orchestration" : "UHPC - Strength Prediction"}</div>
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
