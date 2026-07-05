import Link from "next/link";
import OmMark from "@/components/OmMark";
import BrandName from "@/components/BrandName";

/**
 * Home — the doorway. Two paths, monochrome five-tone system.
 *   Engineering (Carbon)    → applied AI portfolio: agents shipped to production
 *   Consultancy (Porcelain) → Polymath Consultancy Group
 */
export default function Home() {
  return (
    <div className="door">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .door { min-height:100vh; display:flex; flex-direction:column; background:#0A0A0C;
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue','Inter',sans-serif;
          font-optical-sizing:auto; -webkit-font-smoothing:antialiased; }
        .door *, .door *::before, .door *::after { box-sizing:border-box; }
        .door a { text-decoration:none; }
        .door ::selection { background:#26262E; color:#FAFAF8; }

        .door-bar { display:flex; align-items:center; justify-content:space-between; height:64px;
          padding:0 clamp(20px,4vw,40px); background:#0A0A0C; flex-shrink:0;
          border-bottom:1px solid #26262E; }
        .door-brand { display:flex; align-items:center; gap:11px; font-size:17px;
          font-weight:600; letter-spacing:-0.015em; color:#FAFAF8; }
        .door-mail { font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.08em;
          color:#6E6E78; transition:color 0.15s; }
        .door-mail:hover { color:#FAFAF8; }
        .door-foot { border-top:1px solid #26262E; border-bottom:none; height:56px; }
        .door-foot span { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em;
          text-transform:uppercase; color:#6E6E78; }

        .door-split { flex:1; display:flex; overflow:hidden; }
        @media (max-width: 760px) { .door-split { flex-direction:column; } }
        .door-half { position:relative; flex:1; display:flex; flex-direction:column; justify-content:center;
          padding:clamp(36px,6vw,80px); overflow:hidden; }

        .eng { background:#0A0A0C; }
        .con { background:#FAFAF8; border-left:1px solid #26262E; }
        @media (max-width: 760px) { .con { border-left:none; border-top:1px solid #26262E; } }

        .door-eye { font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.22em;
          text-transform:uppercase; margin-bottom:24px; color:#6E6E78; }
        .door-h { font-size:clamp(30px,3.6vw,46px); font-weight:600; letter-spacing:-0.028em;
          line-height:1.07; margin:0 0 18px; max-width:15ch; text-wrap:balance; }
        .eng .door-h { color:#FAFAF8; }
        .con .door-h { color:#0A0A0C; }
        .door-p { font-size:clamp(14px,1.3vw,17px); font-weight:400; line-height:1.7;
          max-width:38ch; margin:0 0 32px; color:#6E6E78; text-wrap:pretty; }

        .door-go { display:inline-block; width:fit-content; font-size:15px; font-weight:500;
          padding:14px 26px; border-radius:8px; transition:background 0.15s; }
        .eng .door-go { background:#FAFAF8; color:#0A0A0C; }
        .eng .door-go:hover { background:#E9E9E5; }
        .con .door-go { background:#0A0A0C; color:#FAFAF8; }
        .con .door-go:hover { background:#26262E; }

        .door-meta { margin-top:auto; padding-top:36px; font-family:'Geist Mono',monospace;
          font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; }

        .door a:focus-visible { outline:1px solid #6E6E78; outline-offset:3px; }
      `}</style>

      {/* header */}
      <header className="door-bar">
        <Link href="/" className="door-brand">
          <OmMark size={26} ink="#FAFAF8" sw={1.4} dot={2.1} animate />
          <BrandName />
        </Link>
        <a href="mailto:emailtosolankiom@gmail.com" className="door-mail">emailtosolankiom@gmail.com</a>
      </header>

      {/* split */}
      <main className="door-split">
        <div className="door-half eng">
          <span className="door-eye">For teams · Engineering</span>
          <h2 className="door-h">AI agents, shipped to production.</h2>
          <p className="door-p">
            Applied AI engineer — agent orchestration, on-premise RAG, and real-time
            systems, built to run in production.
          </p>
          <Link href="/engineering" className="door-go">Enter</Link>
          <span className="door-meta">Work · Case studies · Resume</span>
        </div>

        <div className="door-half con">
          <span className="door-eye">For businesses · Consultancy</span>
          <h2 className="door-h">The intelligence layer for your business.</h2>
          <p className="door-p">
            Polymath Consultancy Group — AI agents that remove friction from how your
            business actually works. One consultancy, every industry.
          </p>
          <Link href="/consulting" className="door-go">Enter</Link>
          <span className="door-meta">What we do · Industries · Book a consultation</span>
        </div>
      </main>

      {/* footer */}
      <footer className="door-bar door-foot">
        <span>© 2026 Omkumar Solanki</span>
        <span>Applied AI · Agents &amp; orchestration</span>
      </footer>
    </div>
  );
}
