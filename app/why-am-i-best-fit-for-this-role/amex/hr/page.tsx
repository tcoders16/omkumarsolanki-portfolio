"use client";
import { useState } from "react";

export default function AmexHRFit() {
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [ressoOpen, setRessoOpen] = useState(true);
  const [corolOpen, setCorolOpen] = useState(true);

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


        @media (max-width: 640px) {
          .shell { padding: 28px 16px 60px; }
          .auth-grid, .built-grid, .pillars, .video-grid { grid-template-columns: 1fr; }
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

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">American Express · AI Engineer I · March 17, 2026</div>
          <h1 className="hero-h1">Most AI engineers demo.<br />I <em>deploy, defend, and lead.</em></h1>
          <p className="hero-p">
            Production AI at Resso.ai. A $1M pitch to the President of Rogers. A city-scale capstone for the TTC Director. This page is the evidence — not the claim.
          </p>
        </div>

        <div className="divider" />

        {/* LEADERSHIP STRIP */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 52 }}>
          {[
            { label: "8 AM outage · Fixed in 24 min", detail: "Production down on interview day. Zero data loss. Made it on time.", accent: '#dc2626' },
            { label: "CEO said fire him · I said mentor", detail: "Turned a would-be termination into a teaching moment. He is still on the team.", accent: '#0a9280' },
            { label: "TTC Director · May 2026", detail: "Pitching AI Lost and Found to TTC Director — 1.7M daily riders, city-scale stakes.", accent: '#b87000' },
            { label: "$1M conversation · Rogers President", detail: "In active investment discussion with the President of a $15B company around Lawline.tech.", accent: '#c01a08' },
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
          <div className="sh2" style={{ marginBottom: 6 }}>Pitching to directors and presidents — before any job required it.</div>
          <p className="body-p" style={{ marginBottom: 0 }}>
            Most candidates list skills. This is different. A capstone pitch directly to the TTC Director. An active $1M investment conversation with the President of Rogers. Real rooms. Real stakes. Real outcomes.
          </p>

          <div className="auth-grid">
            {/* TTC */}
            <div className="auth-card">
              <div className="auth-img-zone" style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden' }}>
                <img src="/images/portfolio/LostAndFound.png" alt="TTC Lost & Found system" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 1 }} />
                <div className="auth-img-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}>
                  <div className="auth-org" style={{ color: '#fff' }}>TTC</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(122,88,0,0.85)', borderColor: 'rgba(200,160,48,0.5)', backdropFilter: 'blur(4px)' }}>Capstone · Pitching May 2026</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">An AI system for 1.7M daily riders — built as a capstone, pitched to the Director</div>
                <div className="auth-desc">
                  The TTC handles <strong>1.7 million passengers every day</strong> — and loses track of their belongings on manual paper logs and phone calls. I built the fix: <strong>NLP vector matching against live inventory</strong>, SMS status updates, self-serve passenger portal, staff triage dashboard. Claim resolution 3x faster. Pitching this to the TTC Director in May 2026. Not a demo. A deployment-ready proposal.
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
                  <div className="auth-org" style={{ color: '#fff' }}>Rogers</div>
                  <span className="auth-chip" style={{ color: '#fff', background: 'rgba(192,26,8,0.85)', borderColor: 'rgba(232,50,20,0.5)', backdropFilter: 'blur(4px)' }}>$1M Investment · Rogers President</span>
                </div>
              </div>
              <div className="auth-body">
                <div className="auth-title">In a $1M conversation with the President of a $15B company — before any career title required it</div>
                <div className="auth-desc">
                  Rogers runs <strong>$15B+ in annual revenue</strong>. I am in an active <strong>$1M investment discussion</strong> with their President around <a href="https://www.lawline.tech" target="_blank" rel="noopener" style={{ color: '#c01a08', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Lawline.tech ↗</a> — a legal AI platform live in production, serving users today. The pitch: <strong>enterprise licensing for Rogers' legal and compliance teams</strong>, B2B resale path. Sub-4% hallucination on legal eval sets. This is not networking — it is a real commercial conversation at the highest level.
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
          <div className="sh2" style={{ marginBottom: 6 }}>Lawline.tech — live, scaling, and already in a $1M investment conversation.</div>
          <p className="body-p" style={{ marginBottom: 18 }}>
            Not a portfolio piece. Not a proof of concept. A legal AI platform in production — with real users, real enterprise conversations, and a hallucination rate that dropped from 14% to <strong style={{ color: '#c01a08' }}>3.8%</strong> through six layers of validation.
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
                  <div className="lawline-col-text">RAG over <strong>Canadian statutes, case law, and compliance docs.</strong> Instant, cited, attorney-client-privilege-safe answers. Air-gapped for enterprise — no data leaves the client&apos;s environment.</div>
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
              <div className="pillar-text">Production down at 8 AM, Amex interview at noon. Diagnosed root cause in 5 minutes, restored service in 24, walked into the room composed.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">The CEO said fire him. I said teach him.</div>
              <div className="pillar-text">Walked him through root cause, PR workflow, commit discipline. Accountability and belief at the same time. He is still on the team.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Redirected prod in minutes. Because I built it.</div>
              <div className="pillar-text">Knew exactly which wire to pull — because I laid every wire. Ownership is not a title. It is what happens when no one else can fix it.</div>
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
                <span className="wc-period">2023 — Present</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {ressoOpen && (
              <div className="wc-body">
                <p className="body-p">
                  Real-time AI conversation platform. I built the entire AI layer — <span className="hl">multi-agent routing, context memory, persona engine, and evaluation pipeline</span>. Sub-800ms response under live load, 30+ personas, 200+ live sessions.
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
                    <div className="built-desc">State-machine routing that switches agents in real time as the conversation shifts — barge-in, topic switch, silence timeout all handled automatically.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Context Memory System</div>
                    <div className="built-desc">Vector session memory over HNSW index. Only relevant past turns are retrieved — no context window overflow, no lost thread.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">30+ Persona Engine</div>
                    <div className="built-desc">Each client gets a versioned AI persona — tone, knowledge base, tool access. Changing one persona never breaks another.</div>
                  </div>
                  <div className="built-card">
                    <div className="built-title">Evaluation Dashboards</div>
                    <div className="built-desc">Daily per-persona tracking of accuracy, latency, and session completion. We know before a customer complains.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#e4faf5', borderColor: '#0a928040' }}>
                  <div className="align-label" style={{ color: '#0a9280' }}>Why this aligns to Amex</div>
                  <div className="align-text">
                    Amex's AI agents handle real financial conversations — disputes, fraud, account management. <strong>I built that system already.</strong> Different domain, identical architecture: multi-agent routing, context memory, live performance monitoring. The only thing that changes is the training data.
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
                <span className="wc-period">2023 — 2024</span>
                <span className="wc-arrow">▾</span>
              </div>
            </div>

            {corolOpen && (
              <div className="wc-body">
                <p className="body-p">
                  Built an <span className="hl-amber">AI strength prediction platform</span> for Ultra-High Performance Concrete — a domain I had zero background in when I started. 12 research engineers used it daily to replace hours of manual testing with a 2-second prediction.
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
                    <div className="built-desc">Measured success in hours saved per week, fewer physical tests, lower material waste — not just R² score.</div>
                  </div>
                </div>

                <div className="align-block" style={{ background: '#fffbeb', borderColor: '#d9920040' }}>
                  <div className="align-label" style={{ color: '#b87000' }}>Why this aligns to Amex</div>
                  <div className="align-text">
                    Financial risk, credit models, dispute logic — a domain I do not know yet. But I learned concrete science in weeks by sitting with experts and building tools they actually trusted. <strong>That is the exact same ramp.</strong> I will do it again, faster, with higher stakes, and I will enjoy it.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* FULL STACK */}
        <div className="section">
          <div className="eyebrow">Full-Spectrum Engineer</div>
          <div className="sh2" style={{ marginBottom: 6 }}>iOS to blockchain, CI/CD to cloud — every layer, bridged to business.</div>
          <p className="body-p" style={{ marginBottom: 20 }}>
            I don&apos;t need a specialist for every layer. I understand the model, the API, the pipeline, the UI, the infra, and the business requirement sitting behind all of it. That is what makes me dangerous as a hire — I close gaps other engineers leave open.
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

        <div className="cta">
          <div className="cta-h">The frameworks are built. The proof is above. Make the call.</div>
          <div className="cta-p" style={{ marginBottom: 20 }}>Production AI. Leadership under pressure. Enterprise-level conversations. Day one contributor — not a six-month ramp.</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <a href="mailto:emailtosolankiom@gmail.com" className="cta-btn">emailtosolankiom@gmail.com →</a>
            <a href="https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">LinkedIn ↗</a>
            <a href="https://www.lawline.tech" target="_blank" rel="noopener" className="cta-btn cta-btn-ghost">Lawline.tech ↗</a>
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
