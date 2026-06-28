"use client";
import { useState, useEffect, useRef } from "react";
import ResumeDocument from "@/components/ResumeDocument";

/* ── Floating checklist ── */
const checklist = [
  { req: "Problem Structuring & MECE Thinking",  metric: "4 industries · hypothesis-first" },
  { req: "Client Discovery & Requirements",       metric: "On-site before any code" },
  { req: "Stakeholder Alignment",                 metric: "Weekly eval dashboards · sign-offs" },
  { req: "Cross-Industry Experience",             metric: "Legal · EdTech · Eng · Transit" },
  { req: "Data-Driven Business Case",             metric: "$1M conversation · renewed contracts" },
  { req: "AI / Technology Strategy",              metric: "P&L framing, not feature lists" },
  { req: "End-to-End Delivery",                   metric: "Solo: scoping → prod → P0 support" },
  { req: "Executive Communication",               metric: "Briefs that close the room" },
];

const TICKER = [
  { label: "Context Retention",   val: "72% → 98%",     sub: "Resso.ai" },
  { label: "Hallucination",       val: "14% → 3.8%",    sub: "LLM quality" },
  { label: "Data Egress",         val: "0 bytes",        sub: "Lawline · Air-gapped" },
  { label: "Investment Unlocked", val: "$1M",            sub: "Rogers President" },
  { label: "Rider Base",          val: "1.7M / day",    sub: "TTC Lost and Found" },
  { label: "Prediction R²",       val: "0.89",           sub: "Corol · UHPC ML" },
  { label: "P0 Incident",         val: "24 min",         sub: "Resolved in prod" },
  { label: "Lab Cycle",           val: "Weeks → 1 day", sub: "UHPC screening" },
  { label: "Clients Consulted",   val: "10+",            sub: "Startups & scale-ups" },
  { label: "MCP Deployments",     val: "5",              sub: "4 wks → 3 days" },
];

export default function ConsultingFitPage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [listOpen, setListOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setTimerActive(false); setChecked(new Set()); return 300; }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : (next.add(i), !timerActive && startTimer());
    setChecked(next);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const ticker = [...TICKER, ...TICKER];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e8e5e0; }

        /* TICKER */
        .c-ticker { position: sticky; top: 0; z-index: 500; }
        .c-tbar  { background: #111; border-bottom: 2px solid #0a7a6a; display: flex; height: 44px; overflow: hidden; }
        .c-tlbl  { flex-shrink: 0; background: #0a7a6a; color: #fff; padding: 0 18px; display: flex; align-items: center; gap: 7px; min-width: 130px; }
        .c-tdot  { width: 7px; height: 7px; border-radius: 50%; background: #fff; animation: tdot .8s infinite; }
        @keyframes tdot { 0%,100%{opacity:1}50%{opacity:.05} }
        .c-ttitle { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; }
        .c-ttrack { flex:1; overflow:hidden; display:flex; align-items:center; }
        .c-tinner { display:flex; white-space:nowrap; animation:tscroll 50s linear infinite; }
        .c-tinner:hover { animation-play-state:paused; }
        @keyframes tscroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .c-titem  { display:inline-flex; align-items:center; gap:8px; padding:0 28px; font-size:11.5px; color:#777; }
        .c-titem strong { color:#e0e0e0; font-weight:700; }
        .c-tsep   { color:#0a7a6a; font-size:13px; }

        /* CHECKLIST */
        .c-float  { position:fixed; right:16px; top:50%; transform:translateY(-50%); z-index:400; width:272px; }
        .c-fbtn   { width:100%; background:#0a7a6a; color:#fff; border:none; padding:9px 13px; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; cursor:pointer; border-radius:5px 5px 0 0; display:flex; justify-content:space-between; align-items:center; }
        .c-fbody  { background:#fff; border:1.5px solid #c5e0da; border-top:none; border-radius:0 0 7px 7px; overflow:hidden; }
        .c-fhead  { background:#f0faf8; padding:9px 12px; border-bottom:1px solid #d0e8e4; }
        .c-fhtitle { font-family:'JetBrains Mono',monospace; font-size:8.5px; font-weight:700; color:#0a7a6a; letter-spacing:.12em; text-transform:uppercase; }
        .c-fhsub  { font-size:10px; color:#999; margin-top:2px; }
        .c-ftimer { font-family:'JetBrains Mono',monospace; font-size:17px; font-weight:700; color:#0a7a6a; text-align:center; padding:6px 0; border-bottom:1px solid #eee; }
        .c-flist  { list-style:none; max-height:300px; overflow-y:auto; }
        .c-fitem  { display:flex; align-items:flex-start; gap:8px; padding:7px 12px; cursor:pointer; border-bottom:1px solid #f5f5f3; transition:background .1s; }
        .c-fitem:last-child { border-bottom:none; }
        .c-fitem:hover { background:#f7fdfb; }
        .c-fitem.done { background:#f0faf8; }
        .c-fbox   { width:14px; height:14px; border-radius:3px; border:1.5px solid #ccc; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; font-size:8px; }
        .c-fitem.done .c-fbox { background:#0a7a6a; border-color:#0a7a6a; color:#fff; }
        .c-freq   { font-size:10.5px; color:#333; font-weight:500; line-height:1.35; }
        .c-fmet   { font-family:'JetBrains Mono',monospace; font-size:8.5px; color:#0a7a6a; margin-top:1px; }
        @media(max-width:900px){ .c-float{ display:none; } }

        @media print { .c-ticker, .c-float { display: none !important; } }
      `}</style>

      {/* TICKER */}
      <div className="c-ticker">
        <div className="c-tbar">
          <div className="c-tlbl">
            <div className="c-tdot" />
            <span className="c-ttitle">Live Record</span>
          </div>
          <div className="c-ttrack">
            <div className="c-tinner">
              {ticker.map((t, i) => (
                <span key={i} className="c-titem">
                  <span>{t.label}</span>
                  <strong>{t.val}</strong>
                  <span style={{ fontSize: 10.5, color: "#555" }}>{t.sub}</span>
                  <span className="c-tsep">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="c-float">
        <button className="c-fbtn" onClick={() => setListOpen(v => !v)}>
          <span>Consulting Checklist</span>
          <span>{listOpen ? "▲" : "▼"}</span>
        </button>
        {listOpen && (
          <div className="c-fbody">
            <div className="c-fhead">
              <div className="c-fhtitle">What Top Firms Need</div>
              <div className="c-fhsub">Tap each to verify</div>
            </div>
            {timerActive && <div className="c-ftimer">{fmt(timeLeft)}</div>}
            <ul className="c-flist">
              {checklist.map((item, i) => (
                <li key={i} className={`c-fitem${checked.has(i) ? " done" : ""}`} onClick={() => toggleCheck(i)}>
                  <div className="c-fbox">{checked.has(i) && "✓"}</div>
                  <div>
                    <div className="c-freq">{item.req}</div>
                    <div className="c-fmet">{item.metric}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RESUME — shared component, consulting variant */}
      <ResumeDocument
        variant="consulting"
        pdfFilename="Omkumar-Solanki-Consulting-Resume"
        hideSaveBtn={false}
      />
    </>
  );
}
