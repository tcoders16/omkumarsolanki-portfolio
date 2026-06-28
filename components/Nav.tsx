"use client";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   Smooth-scroll helper — no double-click bug
───────────────────────────────────────────── */
function goTo(id: string, closeFn?: () => void) {
  closeFn?.();
  if (id.startsWith("/")) {
    window.location.href = id;
    return;
  }
  // These nav links target ENGINEERING-PAGE sections. Only scroll in-page when
  // we're actually on /engineering — other pages (e.g. /consulting) have
  // colliding ids (#about, #process, #contact) and we'd scroll to the wrong one.
  const onEngineering = window.location.pathname === "/engineering";
  const el = onEngineering ? document.getElementById(id) : null;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  } else {
    // Not on the engineering page (or section not found) — store target, go there.
    sessionStorage.setItem("scrollTo", id);
    window.location.href = "/engineering";
  }
}

/* Desktop nav:
   Primary (bright)  → About, Experience, Consulting
   Secondary (dimmer) → Agents, Math, Terminal, Services
   Last (bright)     → Contact
*/
const PRIMARY = [
  { label: "About",      id: "about",       href: null,          dim: false },
  { label: "Work",       id: "work",        href: null,          dim: false },
  { label: "Process",    id: "process",     href: null,          dim: true  },
  { label: "Contact",    id: "contact",     href: null,          dim: false },
];

/* Mobile menu — every section */
const MOBILE_ALL = [
  { label: "Home",        id: "hero",        href: null         },
  { label: "About",       id: "about",       href: null         },
  { label: "Work",        id: "work",        href: null         },
  { label: "Process",     id: "process",     href: null         },
  { label: "Consulting",  id: "consulting",  href: "/consulting", accent: true },
  { label: "Contact",     id: "contact",     href: null         },
];

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        /* ── base ── */
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 60px;
          padding: 0 clamp(14px, 3vw, 48px);
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          transition: background .3s, border-color .3s, backdrop-filter .3s;
        }
        .nav-root.scrolled {
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-root:not(.scrolled) { background: transparent; border-bottom: 1px solid transparent; }

        /* ── logo ── */
        .nav-logo {
          font-family: var(--font-display); font-weight: 800; font-size: 1.1rem;
          color: var(--white); background: none; border: none;
          cursor: pointer; letter-spacing: -.04em; flex-shrink: 0; padding: 0;
        }
        .nav-logo-dot { color: var(--accent); }

        /* ── desktop center ── */
        .nav-center {
          display: flex; align-items: center;
          gap: clamp(3px, .9vw, 16px);
          flex: 1; justify-content: center;
        }

        /* ── nav link (button) ── */
        .nav-link {
          font-family: var(--font-mono); font-size: .57rem;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(240,240,240,.5); background: none; border: none;
          cursor: pointer; white-space: nowrap; padding: 4px 3px;
          transition: color .18s;
        }
        .nav-link:hover { color: #f0f0f0; }
        /* secondary items — visually de-prioritised */
        .nav-link.dim { color: rgba(240,240,240,.3); font-size: .53rem; }
        .nav-link.dim:hover { color: rgba(240,240,240,.7); }

        /* ── consulting pill ── */
        .nav-pill {
          font-family: var(--font-mono); font-size: .57rem;
          letter-spacing: .1em; text-transform: uppercase;
          color: #fff; font-weight: 700;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.22);
          cursor: pointer; white-space: nowrap;
          padding: 4px 11px; border-radius: 3px;
          transition: all .18s;
        }
        .nav-pill:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.45); }

        /* ── CTA cluster ── */
        .nav-ctas { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }

        /* ── mode toggle (Engineering | Consultancy) — same control as the consulting site ── */
        .nav-toggle { display: flex; border: 1px solid rgba(255,255,255,.18); border-radius: 4px; overflow: hidden; margin-right: 3px; }
        .nav-seg {
          font-family: var(--font-mono); font-size: .56rem; font-weight: 600;
          letter-spacing: .06em; text-transform: uppercase; padding: 6px 11px;
          color: rgba(240,240,240,.55); background: transparent; text-decoration: none;
          cursor: pointer; white-space: nowrap; transition: color .18s, background .18s;
        }
        .nav-seg:hover { color: #fff; }
        .nav-seg.active { background: #39d9b4; color: #001512; }
        .nav-seg.active:hover { color: #001512; }

        .nav-btn-ai {
          font-family: var(--font-mono); font-size: .56rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #39d9b4; padding: 6px 12px;
          border: 1px solid rgba(57,217,180,.4); border-radius: 3px;
          background: rgba(57,217,180,.06); cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: all .2s; white-space: nowrap;
        }
        .nav-btn-ai:hover {
          background: rgba(57,217,180,.14); border-color: rgba(57,217,180,.7);
          box-shadow: 0 0 14px rgba(57,217,180,.16);
        }
        .nav-btn-consult {
          font-family: var(--font-mono);
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #001512; padding: 6px 13px;
          border: 1px solid #39d9b4;
          border-radius: 3px; background: #39d9b4;
          cursor: pointer; white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s;
        }
        .nav-btn-consult:hover { background: #4fe7c4; border-color: #4fe7c4; }
        .nav-btn-call {
          font-family: var(--font-mono); font-size: .56rem; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--white); text-decoration: none; white-space: nowrap;
          padding: 6px 11px;
          border: 1px solid rgba(255,255,255,.18); border-radius: 3px;
          background: rgba(255,255,255,.04); transition: all .2s;
        }
        .nav-btn-call:hover { background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.4); }
        .nav-btn-resume {
          font-family: var(--font-mono); font-size: .56rem;
          letter-spacing: .08em; text-transform: uppercase;
          color: rgba(240,240,240,.38); text-decoration: none; white-space: nowrap;
          padding: 6px 8px; transition: color .2s;
        }
        .nav-btn-resume:hover { color: var(--accent); }

        /* ── breakpoints ── */
        @media (max-width: 960px) {
          .nav-center, .nav-ctas { display: none !important; }
        }
        @media (min-width: 961px) {
          .nav-hamburger { display: none !important; }
        }

        /* ── hamburger ── */
        .nav-hamburger {
          background: transparent; border: none; cursor: pointer;
          width: 28px; height: 28px;
          display: flex; flex-direction: column; justify-content: center;
          gap: 5px; padding: 0; z-index: 1001;
        }
        .nav-hamburger span {
          display: block; width: 100%; height: 1.5px;
          background: rgba(240,240,240,.8); border-radius: 2px;
          transition: all .3s ease; transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── mobile overlay ── */
        .nav-mobile {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(3,3,3,.98); backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          padding: 72px 28px 48px; overflow-y: auto;
          opacity: 0; pointer-events: none;
          transform: translateY(-8px);
          transition: opacity .28s ease, transform .28s ease;
        }
        .nav-mobile.open { opacity: 1; pointer-events: all; transform: none; }

        /* group label */
        .nm-group {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: .22em; text-transform: uppercase;
          color: rgba(57,217,180,.4); margin-bottom: 8px; margin-top: 4px;
        }
        /* section divider */
        .nm-divider {
          width: 100%; height: 1px;
          background: rgba(255,255,255,.06);
          margin: 20px 0 22px;
        }

        /* main link (big) */
        .nm-link-main {
          font-family: var(--font-display); font-size: 1.55rem; font-weight: 800;
          color: rgba(240,240,240,.6); background: none; border: none;
          cursor: pointer; text-align: left; display: block; width: 100%;
          padding: 9px 0; letter-spacing: -.03em;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: color .15s;
        }
        .nm-link-main:hover, .nm-link-main:active { color: #f0f0f0; }
        .nm-link-main.accent { color: rgba(57,217,180,.7); }
        .nm-link-main.accent:hover { color: #39d9b4; }

        /* lab link (small) */
        .nm-link-lab {
          font-family: var(--font-mono); font-size: .72rem;
          letter-spacing: .08em; text-transform: uppercase;
          color: rgba(240,240,240,.35); background: none; border: none;
          cursor: pointer; text-align: left; display: block; width: 100%;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,.03);
          transition: color .15s;
        }
        .nm-link-lab:hover { color: rgba(57,217,180,.8); }

        /* cta row */
        .nm-ctas {
          display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px;
        }
        .nm-cta {
          flex: 1; min-width: 120px; text-align: center;
          font-family: var(--font-mono); font-size: .64rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 13px 16px; border-radius: 7px;
          cursor: pointer; text-decoration: none; transition: all .2s;
        }
        .nm-cta-consult { color: #001512; border: 1px solid #39d9b4; background: #39d9b4; }
        .nm-cta-ai   { color: #39d9b4; border: 1px solid rgba(57,217,180,.4); background: rgba(57,217,180,.07); }
        .nm-cta-call { color: rgba(240,240,240,.8); border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.04); }
        .nm-cta-resume { color: rgba(240,240,240,.38); border: 1px solid rgba(255,255,255,.1); background: transparent; }
      `}</style>

      {/* ── Desktop navbar ── */}
      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>

        {/* Logo → scroll to top */}
        <button className="nav-logo" onClick={() => goTo("hero")}>
          OS<span className="nav-logo-dot">.</span>
        </button>

        {/* Primary links */}
        <div className="nav-center">
          {PRIMARY.map(l => (
            <button
              key={l.label}
              className={`nav-link${l.dim ? " dim" : ""}`}
              onClick={() => goTo(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTAs — mode toggle makes the two sites unmistakable. */}
        <div className="nav-ctas">
          <div className="nav-toggle">
            <span className="nav-seg active">Engineering</span>
            <a href="/consulting" className="nav-seg">Consultancy</a>
          </div>
          <a href="/book" className="nav-btn-call">Book a Call ↗</a>
          <a href="/resume" target="_blank" rel="noopener noreferrer" className="nav-btn-resume">
            Resume ↓
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile overlay ── */}
      <div className={`nav-mobile${menuOpen ? " open" : ""}`}>

        <p className="nm-group">All Sections</p>
        {MOBILE_ALL.map(l =>
          l.href ? (
            <a
              key={l.label}
              href={l.href}
              className={`nm-link-main${l.accent ? " accent" : ""}`}
              onClick={close}
            >
              {l.label}
            </a>
          ) : (
            <button
              key={l.label}
              className="nm-link-main"
              onClick={() => goTo(l.id, close)}
            >
              {l.label}
            </button>
          )
        )}

        <div className="nm-ctas">
          <button
            className="nm-cta nm-cta-consult"
            onClick={() => { close(); (window as unknown as Record<string, () => void>).openAgent?.(); }}
          >
            ◆ Ask Om&apos;s AI
          </button>
          <a
            href="/book"
            className="nm-cta nm-cta-call"
            onClick={close}
          >
            Book a Call ↗
          </a>
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="nm-cta nm-cta-resume"
            onClick={close}
          >
            Resume ↓
          </a>
        </div>
      </div>
    </>
  );
}
