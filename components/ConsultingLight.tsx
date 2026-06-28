"use client";

/**
 * Consultancy — for AI startups.
 * Identity: the agent's runtime. The signature is a live execution trace —
 * the exact artifact agent builders stare at when something breaks.
 * Palette: cobalt on cool paper (deliberately NOT the teal engineering side).
 * Structural language: mono step keys, numbered because an agent run is a sequence.
 */
import { useState } from "react";
import ConsultAgentFlow from "@/components/ConsultAgentFlow";
import CheckoutAgent from "@/components/CheckoutAgent";

/* The signature: an agent run, with the two layers I fix flipped from broken → handled. */
const TRACE = [
  { k: "input.receive",  s: "ok" },
  { k: "memory.recall",  s: "fix", note: "context persisted across sessions" },
  { k: "plan.decompose", s: "ok" },
  { k: "tools.invoke",   s: "fix", note: "timeout → retried, recovered" },
  { k: "output.return",  s: "ok" },
] as const;

/* What I do — three layers, the real work. */
const LAYERS = [
  {
    id: "memory",
    t: "Memory",
    b: "Agents forget when a session ends. I build memory that holds — so context survives and scales past a single chat.",
  },
  {
    id: "workflows",
    t: "Workflows",
    b: "Multi-step runs die on the first failed tool call. I add orchestration with retries and recovery, so a run finishes.",
  },
  {
    id: "architecture",
    t: "Architecture",
    b: "The demo won't survive real traffic. I design the system underneath — state, tools, evals — to reach production.",
  },
];

const PROOF = [
  { tag: "agent memory", t: "Retrieval that never leaves the building", b: "Persistent memory over 50,000+ private records — fully offline, sub-second." },
  { tag: "reliable RAG", t: "An agent lawyers can trust", b: "Air-gapped assistant, under 4% hallucination, zero data egress." },
  { tag: "real-time", t: "Decisions while it's live", b: "Streaming inference cut to under 2s, scoring live at 0.94 AUC." },
];

/* Execution framework — a number frozen on day one, measured at the end. */
const FRAMEWORK = [
  { t: "Diagnose", b: "Map the real problem, write a one-paragraph statement you agree with, then freeze the metric we're moving and its number today." },
  { t: "Frame", b: "An SOW with one success metric, a target delta, a timeline — and the commercial structure: fee, fee + share, or equity." },
  { t: "Build", b: "The smallest system that moves the number, shipped in weekly demos. The metric is instrumented from week one." },
  { t: "Harden", b: "Guardrails, evals, observability, load testing — the trust layer that makes the value defensible, not anecdotal." },
  { t: "Transfer", b: "Runbooks, training, a codebase your team owns. The system keeps working and improving after I leave." },
  { t: "Compound", b: "Realized value is measured against the day-one baseline. That delta is where a performance share or equity crystallizes." },
];

/* Engagements — money, or money plus a stake in the outcome. */
const ENGAGE = [
  { label: "FEE", name: "Diagnostic", sub: "1–2 weeks", pay: "You pay a fixed fee.", b: "A Revenue-Leak Audit: a ranked, dollar-sized map of where AI moves the most money, plus the baseline to build against. No commitment beyond this.", items: ["Opportunity map", "Baseline + $ at stake", "Architecture proposal"] },
  { label: "FEE + SHARE", name: "Build partner", sub: "4–10 weeks", pay: "Reduced fee + a share of the value created.", b: "I build and ship the system that moves your number, then take a share of the measured upside — so I win big only if you do.", items: ["End-to-end build", "Performance share", "Full source + handoff"], hl: true },
  { label: "RETAINER + EQUITY", name: "Venture build", sub: "Ongoing", pay: "Small retainer + equity.", b: "Your fractional AI cofounder for the build — core system, architecture, capability transfer — aligned through equity.", items: ["Fractional cofounder", "Equity-aligned", "Long horizon"] },
];

export default function ConsultingLight() {
  const [checkout, setCheckout] = useState<{ name: string; label: string } | null>(null);
  return (
    <div className="cl2">
      <style>{`
        .cl2 {
          --ink:#0b0f19; --paper:#eceef2; --panel:#f7f8fb; --card:#ffffff;
          --line:#d3d7e0; --line-soft:#e3e6ec; --muted:#5b6373;
          --accent:#2f5bff; --accent-soft:rgba(47,91,255,.10); --signal:#f59e0b; --ok:#2f5bff;
          background:var(--paper); color:var(--ink);
          font-family:'Inter',system-ui,sans-serif; min-height:100vh;
          -webkit-font-smoothing:antialiased;
        }
        .cl2 a { text-decoration:none; }
        .cl2-w { max-width:1080px; margin:0 auto; padding:0 28px; }
        .cl2-mono { font-family:'JetBrains Mono',monospace; }

        /* top bar */
        .cl2-bar { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between;
          padding:0 28px; height:58px; background:rgba(236,238,242,.82); backdrop-filter:blur(12px);
          border-bottom:1px solid var(--line); }
        .cl2-brand { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600; color:var(--ink); letter-spacing:-.01em; }
        .cl2-brand i { color:var(--accent); font-style:normal; }
        .cl2-bar-r { display:flex; align-items:center; gap:12px; }
        .cl2-toggle { display:flex; border:1px solid var(--line); border-radius:8px; overflow:hidden; }
        .cl2-seg { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; padding:8px 14px;
          color:var(--muted); background:transparent; text-decoration:none; transition:color .15s, background .15s; }
        .cl2-seg:hover { color:var(--ink); }
        .cl2-seg.active { background:var(--accent); color:#fff; }
        .cl2-seg.active:hover { color:#fff; }
        .cl2-bar-cta { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.02em;
          color:#fff; background:var(--ink); padding:8px 15px; border:1px solid var(--ink); transition:background .15s, border-color .15s; }
        .cl2-bar-cta:hover { background:var(--accent); border-color:var(--accent); }

        /* hero — two columns: thesis + the trace signature */
        .cl2-hero { display:grid; grid-template-columns:1.05fr .95fr; gap:56px; align-items:center;
          padding:78px 0 70px; border-bottom:1px solid var(--line); }
        @media(max-width:880px){ .cl2-hero { grid-template-columns:1fr; gap:40px; padding:52px 0; } }
        .cl2-eye { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase;
          color:var(--accent); margin-bottom:22px; display:flex; align-items:center; gap:9px; }
        .cl2-eye::before { content:""; width:22px; height:1px; background:var(--accent); }
        .cl2-h1 { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:clamp(33px,4.6vw,52px);
          line-height:1.04; letter-spacing:-.035em; margin:0 0 22px; max-width:15ch; }
        .cl2-lead { font-size:clamp(15px,1.5vw,17px); line-height:1.65; color:var(--muted); max-width:46ch; margin:0 0 32px; }
        .cl2-cta { display:flex; gap:12px; flex-wrap:wrap; }
        .cl2-btn { font-family:'JetBrains Mono',monospace; font-size:12.5px; font-weight:600; letter-spacing:.01em;
          padding:13px 20px; cursor:pointer; border:1px solid var(--ink); transition:transform .14s, background .15s, color .15s, border-color .15s;
          display:inline-flex; align-items:center; gap:8px; }
        .cl2-btn-fill { background:var(--ink); color:#fff; }
        .cl2-btn-fill:hover { background:var(--accent); border-color:var(--accent); transform:translateY(-2px); }
        .cl2-btn-line { background:transparent; color:var(--ink); }
        .cl2-btn-line:hover { border-color:var(--accent); color:var(--accent); }

        /* the trace panel — signature */
        .cl2-trace { background:var(--card); border:1px solid var(--line); box-shadow:0 28px 60px -38px rgba(11,15,25,.4); }
        .cl2-trace-hd { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--line-soft); }
        .cl2-trace-ttl { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--ink); }
        .cl2-trace-ttl b { color:var(--accent); font-weight:600; }
        .cl2-trace-live { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); display:flex; align-items:center; gap:6px; }
        .cl2-led { width:7px; height:7px; border-radius:50%; background:var(--signal); box-shadow:0 0 0 0 rgba(245,158,11,.5); animation:cl2pulse 2s infinite; }
        @keyframes cl2pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(245,158,11,.5);} 70%{ box-shadow:0 0 0 5px rgba(245,158,11,0);} }

        .cl2-steps { padding:8px 0 12px; }
        .cl2-step { position:relative; display:flex; align-items:flex-start; gap:14px; padding:11px 18px 11px 22px;
          opacity:0; animation:cl2in .5s cubic-bezier(.2,.8,.2,1) forwards; }
        .cl2-step:nth-child(1){ animation-delay:.15s; } .cl2-step:nth-child(2){ animation-delay:.3s; }
        .cl2-step:nth-child(3){ animation-delay:.45s; } .cl2-step:nth-child(4){ animation-delay:.6s; }
        .cl2-step:nth-child(5){ animation-delay:.75s; }
        @keyframes cl2in { from{ opacity:0; transform:translateX(-6px);} to{ opacity:1; transform:none;} }
        /* connector rail */
        .cl2-step::before { content:""; position:absolute; left:27px; top:24px; bottom:-11px; width:1px; background:var(--line-soft); }
        .cl2-step:last-child::before { display:none; }
        .cl2-node { flex-shrink:0; width:11px; height:11px; margin-top:3px; border-radius:50%; background:#fff;
          border:2px solid var(--ok); z-index:1; }
        .cl2-node.fix { border-color:var(--signal); background:var(--signal); }
        .cl2-step-k { font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--ink); }
        .cl2-step-note { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--signal); margin-top:3px; }
        .cl2-tag { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.06em; text-transform:uppercase;
          margin-left:auto; padding:2px 7px; border:1px solid; align-self:center; }
        .cl2-tag.ok  { color:var(--ok);     border-color:rgba(47,91,255,.3); }
        .cl2-tag.fix { color:var(--signal); border-color:rgba(245,158,11,.35); }
        .cl2-trace-ft { padding:12px 18px; border-top:1px solid var(--line-soft); font-family:'JetBrains Mono',monospace;
          font-size:10.5px; color:var(--muted); }
        .cl2-trace-ft b { color:var(--ink); font-weight:600; }

        /* generic section scaffold — spec-sheet rows with a mono index rail */
        .cl2-sec { padding:78px 0; border-bottom:1px solid var(--line); }
        .cl2-sec.tint { background:var(--panel); }
        .cl2-head { display:flex; align-items:baseline; gap:16px; margin-bottom:6px; }
        .cl2-ix { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--accent); letter-spacing:.1em; padding-top:7px; }
        .cl2-h2 { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:clamp(24px,3.1vw,34px);
          letter-spacing:-.025em; margin:0; line-height:1.1; }
        .cl2-sub { font-size:15px; line-height:1.6; color:var(--muted); max-width:54ch; margin:14px 0 0; }

        /* layers — sharp spec blocks, hairline, mono key */
        .cl2-layers { margin-top:40px; border-top:1px solid var(--line); }
        .cl2-layer { display:grid; grid-template-columns:200px 1fr; gap:32px; padding:26px 4px;
          border-bottom:1px solid var(--line-soft); transition:background .15s; }
        @media(max-width:680px){ .cl2-layer { grid-template-columns:1fr; gap:8px; } }
        .cl2-layer:hover { background:rgba(47,91,255,.025); }
        .cl2-layer-k { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--accent); }
        .cl2-layer-t { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:19px; letter-spacing:-.01em; margin-top:6px; }
        .cl2-layer-b { font-size:14.5px; line-height:1.66; color:var(--muted); max-width:62ch; }

        /* agent flow wrap */
        .cl2-agent { max-width:780px; margin:36px auto 0; }
        .cl2-sec .cl2-center { text-align:center; }
        .cl2-center .cl2-head { justify-content:center; }
        .cl2-center .cl2-sub { margin-left:auto; margin-right:auto; }

        /* metrics — real numbers */
        .cl2-metrics { display:grid; grid-template-columns:repeat(4,1fr); margin-top:42px; border:1px solid var(--line); }
        @media(max-width:680px){ .cl2-metrics { grid-template-columns:1fr 1fr; } }
        .cl2-metric { padding:26px 22px; border-right:1px solid var(--line-soft); }
        .cl2-metric:nth-child(4n){ border-right:none; }
        @media(max-width:680px){ .cl2-metric:nth-child(2n){ border-right:none; } .cl2-metric { border-bottom:1px solid var(--line-soft); } }
        .cl2-metric-n { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:clamp(28px,3.4vw,38px); letter-spacing:-.03em; }
        .cl2-metric-l { font-size:13px; color:var(--ink); margin-top:8px; }
        .cl2-metric-s { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.04em; margin-top:4px; text-transform:uppercase; }

        /* process — ordered run */
        .cl2-proc { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin-top:40px; background:var(--line); border:1px solid var(--line); }
        @media(max-width:680px){ .cl2-proc { grid-template-columns:1fr; } }
        .cl2-pstep { background:var(--paper); padding:28px 24px; }
        .cl2-pn { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--accent); }
        .cl2-pt { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:18px; letter-spacing:-.01em; margin:12px 0 8px; }
        .cl2-pb { font-size:13.5px; line-height:1.6; color:var(--muted); }

        /* proof */
        .cl2-proof { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:40px; }
        @media(max-width:820px){ .cl2-proof { grid-template-columns:1fr; } }
        .cl2-pcard { background:var(--card); border:1px solid var(--line); padding:24px 22px; }
        .cl2-ptag { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
        .cl2-pcard-t { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:17px; letter-spacing:-.01em; margin:12px 0 10px; line-height:1.25; }
        .cl2-pcard-b { font-size:13.5px; line-height:1.6; color:var(--muted); }

        /* final */
        .cl2-final { background:var(--ink); color:#fff; padding:88px 0; }
        .cl2-final .cl2-eye { color:#7d94ff; }
        .cl2-final .cl2-eye::before { background:#7d94ff; }
        .cl2-final h2 { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:clamp(26px,3.6vw,42px);
          letter-spacing:-.03em; margin:0 0 16px; max-width:18ch; line-height:1.08; }
        .cl2-final p { color:#9aa3b7; font-size:16px; max-width:46ch; margin:0 0 30px; line-height:1.6; }
        .cl2-final .cl2-btn-fill { background:#fff; color:var(--ink); border-color:#fff; }
        .cl2-final .cl2-btn-fill:hover { background:var(--accent); color:#fff; border-color:var(--accent); }
        .cl2-foot { background:var(--ink); color:#5b6373; padding:0 0 40px; }
        .cl2-foot .cl2-w { display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px;
          font-family:'JetBrains Mono',monospace; font-size:11px; }
        .cl2-foot a { color:#7d94ff; }

        /* engagements — money + stakes tiers */
        .cl2-tiers { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:40px; }
        @media(max-width:820px){ .cl2-tiers { grid-template-columns:1fr; } }
        .cl2-tier { position:relative; background:var(--card); border:1px solid var(--line); padding:26px 22px; }
        .cl2-tier.hl { border-color:var(--accent); box-shadow:0 18px 44px -30px rgba(47,91,255,.55); }
        .cl2-tier.hl::after { content:"MOST COMMON"; position:absolute; top:14px; right:16px;
          font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:.1em; color:var(--accent);
          border:1px solid rgba(47,91,255,.4); padding:3px 7px; }
        .cl2-tier-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; color:var(--accent); }
        .cl2-tier-name { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:22px; letter-spacing:-.02em; margin:8px 0 2px; }
        .cl2-tier-sub { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--muted); margin-bottom:14px; }
        .cl2-tier-pay { font-size:14px; font-weight:600; color:var(--ink); margin-bottom:10px; }
        .cl2-tier-b { font-size:13.5px; line-height:1.6; color:var(--muted); margin:0 0 16px; }
        .cl2-tier-items { border-top:1px solid var(--line-soft); padding-top:14px; }
        .cl2-tier-item { display:flex; gap:8px; align-items:baseline; font-family:'JetBrains Mono',monospace;
          font-size:11.5px; color:var(--muted); margin-bottom:7px; }
        .cl2-tier-item span { color:var(--accent); flex-shrink:0; }
        .cl2-tier-cta { width:100%; margin-top:18px; font-family:'JetBrains Mono',monospace; font-size:12px;
          font-weight:600; letter-spacing:.01em; padding:11px; cursor:pointer; border:1px solid var(--ink);
          background:transparent; color:var(--ink); transition:background .15s, color .15s, border-color .15s; }
        .cl2-tier-cta:hover { background:var(--ink); color:#fff; }
        .cl2-tier-cta.hl { background:var(--accent); border-color:var(--accent); color:#fff; }
        .cl2-tier-cta.hl:hover { background:#1f44d6; }
        .cl2-tier-note { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted);
          line-height:1.6; margin:18px 0 0; max-width:60ch; }

        .cl2 a:focus-visible, .cl2 button:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
        @media(prefers-reduced-motion:reduce){
          .cl2-step { opacity:1; animation:none; } .cl2-led { animation:none; }
        }
      `}</style>

      {/* top bar — brand shows you're on the consultancy site; switch to engineering is explicit */}
      <div className="cl2-bar">
        <a className="cl2-brand" href="/">om<i>.</i>agents</a>
        <div className="cl2-bar-r">
          <div className="cl2-toggle">
            <a className="cl2-seg" href="/engineering">Engineering</a>
            <span className="cl2-seg active">Consultancy</span>
          </div>
          <a className="cl2-bar-cta" href="/book">Book a call</a>
        </div>
      </div>

      {/* hero */}
      <header className="cl2-hero cl2-w">
        <div>
          <p className="cl2-eye">For AI startups</p>
          <h1 className="cl2-h1">Agents that do real work.</h1>
          <p className="cl2-lead">
            Real tasks, multi-step workflows, and memory that persists. I help startups
            take agents from demo to production.
          </p>
          <div className="cl2-cta">
            <a className="cl2-btn cl2-btn-fill" href="#agent">Describe your agent →</a>
            <a className="cl2-btn cl2-btn-line" href="/book">Book a call</a>
          </div>
        </div>

        {/* signature: a live agent trace, two layers flipped from broken → handled */}
        <div className="cl2-trace" role="img" aria-label="An agent execution trace where memory and tool steps recover instead of failing.">
          <div className="cl2-trace-hd">
            <span className="cl2-trace-ttl">POST <b>/agent.run</b></span>
            <span className="cl2-trace-live"><span className="cl2-led" />trace · live</span>
          </div>
          <div className="cl2-steps">
            {TRACE.map(step => (
              <div className="cl2-step" key={step.k}>
                <span className={`cl2-node ${step.s === "fix" ? "fix" : ""}`} />
                <span>
                  <span className="cl2-step-k">{step.k}</span>
                  {"note" in step && step.note && <span className="cl2-step-note">↳ {step.note}</span>}
                </span>
                <span className={`cl2-tag ${step.s}`}>{step.s === "fix" ? "handled" : "ok"}</span>
              </div>
            ))}
          </div>
          <div className="cl2-trace-ft">run complete · <b>0 dropped steps</b> · the two amber nodes are what I rebuilt</div>
        </div>
      </header>

      {/* where agents break — the layers */}
      <section className="cl2-sec">
        <div className="cl2-w">
          <div className="cl2-head">
            <span className="cl2-ix">01</span>
            <h2 className="cl2-h2">What I do</h2>
          </div>
          <p className="cl2-sub" style={{ marginLeft: 47 }}>
            Three layers. I work on the one that&apos;s hurting — or all of them.
          </p>
          <div className="cl2-layers">
            {LAYERS.map((l, i) => (
              <div className="cl2-layer" key={l.id}>
                <div>
                  <div className="cl2-layer-k">{String(i + 1).padStart(2, "0")} · {l.id}</div>
                  <div className="cl2-layer-t">{l.t}</div>
                </div>
                <p className="cl2-layer-b">{l.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* the agent — try it */}
      <section className="cl2-sec tint" id="agent">
        <div className="cl2-w cl2-center">
          <div className="cl2-head">
            <span className="cl2-ix">02</span>
            <h2 className="cl2-h2">Tell it where your agent breaks</h2>
          </div>
          <p className="cl2-sub">
            Describe your agent and the failure. It reads the problem and writes the actual
            fix — the same way I&apos;d scope it on a call.
          </p>
          <div className="cl2-agent"><ConsultAgentFlow /></div>
        </div>
      </section>

      {/* proof */}
      <section className="cl2-sec">
        <div className="cl2-w">
          <div className="cl2-head">
            <span className="cl2-ix">03</span>
            <h2 className="cl2-h2">Built and running</h2>
          </div>
          <div className="cl2-proof">
            {PROOF.map(p => (
              <div className="cl2-pcard" key={p.t}>
                <div className="cl2-ptag">{p.tag}</div>
                <div className="cl2-pcard-t">{p.t}</div>
                <div className="cl2-pcard-b">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how I solve your problem — the execution framework */}
      <section className="cl2-sec tint">
        <div className="cl2-w">
          <div className="cl2-head">
            <span className="cl2-ix">04</span>
            <h2 className="cl2-h2">How I solve your problem</h2>
          </div>
          <p className="cl2-sub" style={{ marginLeft: 47 }}>
            A six-phase run. A number is frozen on day one and measured at the end — so when I take
            part of my pay in your upside, the upside is real, not a guess.
          </p>
          <div className="cl2-proc">
            {FRAMEWORK.map((p, i) => (
              <div className="cl2-pstep" key={p.t}>
                <div className="cl2-pn">{String(i + 1).padStart(2, "0")}</div>
                <div className="cl2-pt">{p.t}</div>
                <div className="cl2-pb">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how we engage — money + stakes */}
      <section className="cl2-sec">
        <div className="cl2-w">
          <div className="cl2-head">
            <span className="cl2-ix">05</span>
            <h2 className="cl2-h2">How we engage</h2>
          </div>
          <p className="cl2-sub" style={{ marginLeft: 47 }}>
            Money, or money plus a stake in the outcome. Every engagement starts with a paid
            Diagnostic — from there you choose how aligned you want me.
          </p>
          <div className="cl2-tiers">
            {ENGAGE.map(t => (
              <div className={`cl2-tier${t.hl ? " hl" : ""}`} key={t.name}>
                <div className="cl2-tier-label">{t.label}</div>
                <div className="cl2-tier-name">{t.name}</div>
                <div className="cl2-tier-sub">{t.sub}</div>
                <div className="cl2-tier-pay">{t.pay}</div>
                <p className="cl2-tier-b">{t.b}</p>
                <div className="cl2-tier-items">
                  {t.items.map(it => (
                    <div className="cl2-tier-item" key={it}><span>+</span>{it}</div>
                  ))}
                </div>
                <button className={`cl2-tier-cta${t.hl ? " hl" : ""}`}
                  onClick={() => setCheckout({ name: t.name, label: t.label })}>
                  Select &amp; checkout →
                </button>
              </div>
            ))}
          </div>
          <p className="cl2-tier-note">
            Checkout doesn&apos;t charge you — it opens an AI intake that takes down your requirements
            and books the call. You pick a time whenever you like.
          </p>
        </div>
      </section>

      {/* final */}
      <section className="cl2-final">
        <div className="cl2-w">
          <p className="cl2-eye">Next step</p>
          <h2>Tell me where your agent breaks.</h2>
          <p>A 20-minute call. Bring one failing run — leave with a plan to fix the layer underneath it.</p>
          <a className="cl2-btn cl2-btn-fill" href="/book">Book a call →</a>
        </div>
      </section>

      <footer className="cl2-foot">
        <div className="cl2-w">
          <span>om.agents · agent architecture for startups</span>
          <span><a href="mailto:emailtosolankiom@gmail.com">emailtosolankiom@gmail.com</a> · <a href="/engineering">engineering ↗</a></span>
        </div>
      </footer>

      {checkout && <CheckoutAgent service={checkout} onClose={() => setCheckout(null)} />}
    </div>
  );
}
