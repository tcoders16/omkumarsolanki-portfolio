"use client";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    num: "01",
    title: "Diagnose",
    sub: "Week 1",
    body: "I sit with your team, map the actual problem against what you think the problem is, and identify the root cause. No solution proposed until I can write a one-paragraph problem statement you fully agree with.",
    tags: ["Stakeholder interviews", "System audit", "Root cause analysis"],
  },
  {
    num: "02",
    title: "Scope",
    sub: "Week 1-2",
    body: "I write a Statement of Work with a fixed deliverable, success metric, and timeline. You know exactly what you're getting and how you'll know if it worked — before a single line of code is written.",
    tags: ["SoW", "Success metrics", "Risk register"],
  },
  {
    num: "03",
    title: "Build",
    sub: "Week 2-6",
    body: "I ship in weekly increments. Each Friday you get a working demo, not a slide. Every agent, model, or API is tested in an environment that mirrors production — not a notebook.",
    tags: ["Weekly demos", "CI/CD from day 1", "Real data testing"],
  },
  {
    num: "04",
    title: "Harden",
    sub: "Week 6-8",
    body: "Guardrails, observability, and load testing before anything touches your users. I instrument every pipeline node so you can see latency, error rates, and model drift without calling me.",
    tags: ["Observability", "Guardrails", "Load testing"],
  },
  {
    num: "05",
    title: "Transfer",
    sub: "Week 8+",
    body: "I document everything, train your team, and hand over a codebase your engineers can own. The goal is for you to not need me — and for the system to keep working after I leave.",
    tags: ["Runbooks", "Team training", "Clean handoff"],
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } },
      { threshold: 0 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} className={`pr-wrap${visible ? " visible" : ""}`}>
      <style>{`
        .pr-wrap {
          background: #000;
          color: #f0f0f0;
          padding: 100px 24px 100px;
          font-family: 'Space Grotesk', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .pr-inner { max-width: 1100px; margin: 0 auto; }

        .pr-fade {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .pr-wrap.visible .pr-fade { opacity: 1; transform: none; }
        .pr-wrap.visible .pr-d1 { transition-delay: 0.05s; }
        .pr-wrap.visible .pr-d2 { transition-delay: 0.12s; }
        .pr-wrap.visible .pr-d3 { transition-delay: 0.20s; }

        .pr-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #39d9b4;
          margin-bottom: 14px;
        }
        .pr-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 800; line-height: 1.1;
          margin: 0 0 12px; color: #f0f0f0;
        }
        .pr-sub {
          font-size: 0.92rem; color: #606060;
          max-width: 480px; line-height: 1.7; margin: 0 0 56px;
        }

        /* Layout */
        .pr-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 0 60px;
          align-items: start;
        }
        @media (max-width: 760px) {
          .pr-layout { grid-template-columns: 1fr; gap: 32px; }
        }

        /* Step list (left) */
        .pr-steps { display: flex; flex-direction: column; gap: 2px; }
        .pr-step-btn {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 6px;
          cursor: pointer; border: none; background: transparent;
          text-align: left; width: 100%;
          transition: background 0.2s;
        }
        .pr-step-btn:hover { background: rgba(255,255,255,0.03); }
        .pr-step-btn.active { background: rgba(57,217,180,0.07); }

        .pr-step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          color: rgba(57,217,180,0.35); flex-shrink: 0;
          transition: color 0.2s;
        }
        .pr-step-btn.active .pr-step-num { color: rgba(57,217,180,0.8); }

        .pr-step-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.92rem; font-weight: 700;
          color: rgba(240,240,240,0.4);
          transition: color 0.2s;
        }
        .pr-step-btn.active .pr-step-name { color: #f0f0f0; }

        .pr-step-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px; color: rgba(255,255,255,0.2);
          margin-left: auto; flex-shrink: 0;
          transition: color 0.2s;
        }
        .pr-step-btn.active .pr-step-sub { color: rgba(57,217,180,0.5); }

        /* Detail panel (right) */
        .pr-detail {
          padding: 32px 36px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          background: rgba(255,255,255,0.015);
          min-height: 220px;
        }

        .pr-detail-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          color: rgba(57,217,180,0.4);
          text-transform: uppercase; margin-bottom: 10px;
        }
        .pr-detail-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          color: #f0f0f0; margin-bottom: 16px; line-height: 1.1;
        }
        .pr-detail-body {
          font-size: 0.88rem; color: #686868;
          line-height: 1.75; margin: 0 0 20px;
        }
        .pr-detail-tags {
          display: flex; flex-wrap: wrap; gap: 7px;
        }
        .pr-detail-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.06em;
          padding: 4px 10px; border-radius: 3px;
          border: 1px solid rgba(57,217,180,0.2);
          color: rgba(57,217,180,0.55);
          background: rgba(57,217,180,0.04);
        }

        /* progress bar */
        .pr-bar {
          height: 2px; background: rgba(255,255,255,0.05);
          border-radius: 2px; margin-bottom: 32px; overflow: hidden;
        }
        .pr-bar-fill {
          height: 100%; background: #39d9b4; border-radius: 2px;
          transition: width 0.4s ease;
        }
      `}</style>

      <div className="pr-inner">
        <p className="pr-eyebrow pr-fade pr-d1">How I Work</p>
        <h2 className="pr-h2 pr-fade pr-d2">Problem to production, no slide decks.</h2>
        <p className="pr-sub pr-fade pr-d2">A repeatable five-step engagement that ships real software and transfers ownership cleanly.</p>

        <div className="pr-layout pr-fade pr-d3">
          {/* Left: step list */}
          <div className="pr-steps">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                className={`pr-step-btn${active === i ? " active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="pr-step-num">{s.num}</span>
                <span className="pr-step-name">{s.title}</span>
                <span className="pr-step-sub">{s.sub}</span>
              </button>
            ))}
          </div>

          {/* Right: detail */}
          <div className="pr-detail">
            <div className="pr-bar">
              <div className="pr-bar-fill" style={{ width: `${((active + 1) / STEPS.length) * 100}%` }} />
            </div>
            <div className="pr-detail-num">{STEPS[active].num} / {String(STEPS.length).padStart(2, "0")}</div>
            <div className="pr-detail-title">{STEPS[active].title}</div>
            <p className="pr-detail-body">{STEPS[active].body}</p>
            <div className="pr-detail-tags">
              {STEPS[active].tags.map(t => (
                <span key={t} className="pr-detail-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
