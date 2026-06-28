import Link from "next/link";

/**
 * Home — the doorway. Header, two paths, footer. Minimal.
 *   Engineering (dark)  → production-AI portfolio
 *   Consultancy (light) → agents that do real tasks: workflows with memory
 */
export default function Home() {
  return (
    <div className="door">
      <style>{`
        .door { min-height:100vh; display:flex; flex-direction:column; background:#0a0a0a;
          font-family:'Space Grotesk',system-ui,sans-serif; }

        /* header / footer frame */
        .door-bar { display:flex; align-items:center; justify-content:space-between; height:66px; padding:0 clamp(18px,4vw,40px);
          background:#0a0a0a; color:#f0f0f0; flex-shrink:0; }
        .door-brand { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:800; letter-spacing:-.04em; color:#f0f0f0; text-decoration:none; }
        .door-brand i { color:#39d9b4; font-style:normal; }
        .door-bar a.door-mail { font-family:'JetBrains Mono',monospace; font-size:11px; color:#7a7a7a; text-decoration:none; }
        .door-bar a.door-mail:hover { color:#f0f0f0; }
        .door-foot { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#5a5a5a; }
        .door-foot span { color:#5a5a5a; }

        /* split */
        .door-split { flex:1; display:flex; overflow:hidden; }
        @media(max-width:760px){ .door-split { flex-direction:column; } }
        .door-half { position:relative; flex:1; display:flex; flex-direction:column; justify-content:center;
          padding:clamp(32px,6vw,76px); text-decoration:none; overflow:hidden;
          transition:flex .55s cubic-bezier(.4,0,.2,1); animation:doorIn .7s cubic-bezier(.2,.8,.2,1) both; }
        .door-half:nth-child(2){ animation-delay:.08s; }
        @media(min-width:761px){
          .door-split:hover .door-half { flex:.85; }
          .door-split:hover .door-half:hover { flex:1.25; }
        }
        @keyframes doorIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }

        .eng { background:#0a0a0a; color:#f0f0f0; }
        .eng::after { content:''; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(120% 90% at 0% 100%, rgba(57,217,180,.12), transparent 60%); }
        .con { background:#eceef2; color:#0b0f19; border-left:1px solid rgba(0,0,0,.08); }
        .con::after { content:''; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(120% 90% at 100% 0%, rgba(47,91,255,.10), transparent 60%); }

        .door-eye { position:relative; z-index:1; font-family:'JetBrains Mono',monospace; font-size:11px;
          letter-spacing:.18em; text-transform:uppercase; margin-bottom:20px; }
        .eng .door-eye { color:#39d9b4; }
        .con .door-eye { color:#2f5bff; }

        .door-h { position:relative; z-index:1; font-family:'Space Grotesk',sans-serif; font-weight:700;
          font-size:clamp(30px,4.2vw,50px); line-height:1.03; letter-spacing:-.04em; margin:0 0 16px; max-width:11ch; }
        .door-p { position:relative; z-index:1; font-size:clamp(13px,1.4vw,16px); line-height:1.6; font-weight:300;
          max-width:32ch; margin:0 0 28px; }
        .eng .door-p { color:#9a9a9a; }
        .con .door-p { color:#5b6373; }

        .door-go { position:relative; z-index:1; display:inline-flex; align-items:center; gap:10px;
          font-family:'JetBrains Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.01em;
          padding:12px 22px; transition:gap .2s, transform .2s, background .2s, color .2s; width:fit-content; }
        .eng .door-go { background:#39d9b4; color:#001512; }
        .con .door-go { background:#0b0f19; color:#fff; }
        .con .door-half:hover .door-go, .door-half:hover .door-go { gap:15px; transform:translateY(-2px); }

        .door-meta { position:relative; z-index:1; margin-top:auto; padding-top:30px;
          font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.05em; }
        .eng .door-meta { color:#5a5a5a; }
        .con .door-meta { color:#8a8f9c; }
      `}</style>

      {/* header */}
      <header className="door-bar">
        <Link href="/" className="door-brand">om<i>.</i></Link>
        <a href="mailto:emailtosolankiom@gmail.com" className="door-mail">emailtosolankiom@gmail.com</a>
      </header>

      {/* split */}
      <main className="door-split">
        <Link href="/engineering" className="door-half eng">
          <span className="door-eye">For teams · Engineering</span>
          <h2 className="door-h">Production AI systems.</h2>
          <p className="door-p">
            Senior AI/ML engineer — agents, RAG, real-time inference, and MLOps,
            built to run in production.
          </p>
          <span className="door-go">Enter →</span>
          <span className="door-meta">work · case studies · resume</span>
        </Link>

        <Link href="/consulting" className="door-half con">
          <span className="door-eye">For startups · Agents</span>
          <h2 className="door-h">Agents that do real work.</h2>
          <p className="door-p">
            Real tasks, multi-step workflows, and memory that persists — I help
            startups take agents from demo to production.
          </p>
          <span className="door-go">Fix my agent →</span>
          <span className="door-meta">memory · workflows · architecture</span>
        </Link>
      </main>

      {/* footer */}
      <footer className="door-bar door-foot">
        <span>© 2026 Om Solanki</span>
        <span>AI engineer &amp; agent consultant</span>
      </footer>
    </div>
  );
}
