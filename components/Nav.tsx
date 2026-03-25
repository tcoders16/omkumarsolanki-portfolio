"use client";
import { useEffect, useRef, useState } from "react";

const PRIMARY_LINKS = [
  { label: "Work",       href: "/#work" },
  { label: "Consulting", href: "/consulting", highlight: true },
  { label: "Agents",     href: "/#agents" },
  { label: "About",      href: "/#about" },
  { label: "Contact",    href: "/#contact" },
];

const LAB_LINKS = [
  { label: "Math",      href: "/#math",     desc: "ML models & optimization" },
  { label: "Story",     href: "/#story",    desc: "The journey so far"        },
  { label: "Terminal",  href: "/#terminal", desc: "Interactive CLI experience" },
  { label: "Services",  href: "/#rates",    desc: "Rates & engagement models"  },
];

const ALL_MOBILE_LINKS = [
  { label: "Work",      href: "/#work",     group: "main" },
  { label: "Consulting",href: "/consulting",group: "main", highlight: true },
  { label: "Agents",    href: "/#agents",   group: "main" },
  { label: "About",     href: "/#about",    group: "main" },
  { label: "Contact",   href: "/#contact",  group: "main" },
  { label: "Math",      href: "/#math",     group: "lab"  },
  { label: "Story",     href: "/#story",    group: "lab"  },
  { label: "Terminal",  href: "/#terminal", group: "lab"  },
  { label: "Services",  href: "/#rates",    group: "lab"  },
];

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [labOpen,   setLabOpen]   = useState(false);
  const labRef = useRef<HTMLDivElement>(null);

  /* ── scroll effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* ── close Lab dropdown on outside click ── */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (labRef.current && !labRef.current.contains(e.target as Node)) {
        setLabOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      <style>{`
        /* ── Nav base ── */
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100; height: 60px;
          padding: 0 clamp(16px, 3vw, 48px);
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
        }
        .nav-root.scrolled {
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-root:not(.scrolled) {
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        /* ── Logo ── */
        .nav-logo {
          font-family: var(--font-display);
          font-weight: 800; font-size: 1.1rem;
          color: var(--white); text-decoration: none;
          letter-spacing: -0.04em; flex-shrink: 0;
        }
        .nav-logo-dot { color: var(--accent); }

        /* ── Desktop center ── */
        .nav-center {
          display: flex; align-items: center;
          gap: clamp(6px, 1.2vw, 22px);
          flex: 1; justify-content: center; overflow: hidden;
        }

        /* ── Standard nav link ── */
        .nav-link {
          font-family: var(--font-mono);
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,240,240,0.55);
          text-decoration: none; white-space: nowrap;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #f0f0f0; }

        /* ── Consulting pill ── */
        .nav-link-consulting {
          font-family: var(--font-mono);
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffffff; font-weight: 700;
          text-decoration: none; white-space: nowrap;
          padding: 4px 11px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 3px;
          background: rgba(255,255,255,0.05);
          transition: all 0.2s;
        }
        .nav-link-consulting:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.45);
        }

        /* ── Lab dropdown trigger ── */
        .nav-lab-wrap { position: relative; }
        .nav-lab-btn {
          display: flex; align-items: center; gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,240,240,0.55);
          background: transparent; border: none;
          cursor: pointer; white-space: nowrap;
          padding: 0; transition: color 0.2s;
        }
        .nav-lab-btn:hover, .nav-lab-btn.open { color: #f0f0f0; }
        .nav-lab-caret {
          display: inline-block; font-size: 7px;
          transition: transform 0.2s;
          color: rgba(57,217,180,0.5);
        }
        .nav-lab-btn.open .nav-lab-caret { transform: rotate(180deg); }

        /* ── Lab dropdown panel ── */
        .nav-lab-panel {
          position: absolute; top: calc(100% + 16px); left: 50%;
          transform: translateX(-50%);
          width: 230px;
          background: rgba(8,8,8,0.97);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(57,217,180,0.06);
          opacity: 0; pointer-events: none;
          transform: translateX(-50%) translateY(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .nav-lab-panel.open {
          opacity: 1; pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }
        .nav-lab-item {
          display: flex; flex-direction: column; gap: 2px;
          padding: 10px 12px; border-radius: 6px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nav-lab-item:hover { background: rgba(255,255,255,0.04); }
        .nav-lab-item-label {
          font-family: var(--font-mono);
          font-size: 0.62rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(240,240,240,0.8);
          font-weight: 600;
        }
        .nav-lab-item-desc {
          font-family: var(--font-body);
          font-size: 0.7rem; color: rgba(255,255,255,0.28);
          line-height: 1.3;
        }

        /* ── Desktop CTA buttons ── */
        .nav-ctas {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .nav-btn-ai {
          font-family: var(--font-mono);
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #39d9b4; padding: 6px 13px;
          border: 1px solid rgba(57,217,180,0.4);
          border-radius: 3px; background: rgba(57,217,180,0.06);
          cursor: pointer; white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s;
        }
        .nav-btn-ai:hover {
          background: rgba(57,217,180,0.14);
          border-color: rgba(57,217,180,0.7);
        }
        .nav-btn-call {
          font-family: var(--font-mono);
          font-size: 0.58rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #3dba7e; text-decoration: none; white-space: nowrap;
          padding: 6px 12px;
          border: 1px solid rgba(61,186,126,0.35);
          border-radius: 3px;
          transition: all 0.2s;
        }
        .nav-btn-call:hover {
          background: rgba(61,186,126,0.1);
          border-color: rgba(61,186,126,0.65);
        }
        .nav-btn-resume {
          font-family: var(--font-mono);
          font-size: 0.58rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--accent); text-decoration: none; white-space: nowrap;
          padding: 6px 12px;
          border: 1px solid var(--accent-ring);
          border-radius: 3px;
          transition: all 0.2s;
        }
        .nav-btn-resume:hover {
          background: var(--accent-dim);
          border-color: var(--accent);
        }

        /* ── Hide/show ── */
        @media (max-width: 860px) {
          .nav-center, .nav-ctas { display: none !important; }
        }
        @media (min-width: 861px) {
          .nav-hamburger { display: none !important; }
        }

        /* ── Hamburger ── */
        .nav-hamburger {
          background: transparent; border: none; cursor: pointer;
          width: 28px; height: 28px;
          display: flex; flex-direction: column; justify-content: center;
          gap: 5px; padding: 0; z-index: 101;
        }
        .nav-hamburger span {
          display: block; width: 100%; height: 1.5px;
          background: rgba(240,240,240,0.8);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── Mobile menu ── */
        .nav-mobile {
          position: fixed; inset: 0; z-index: 99;
          background: rgba(4,4,4,0.98);
          backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          padding: 80px 32px 48px;
          opacity: 0; pointer-events: none;
          transform: translateY(-8px);
          transition: opacity 0.28s ease, transform 0.28s ease;
          overflow-y: auto;
        }
        .nav-mobile.open { opacity: 1; pointer-events: all; transform: none; }

        .nav-mobile-group-label {
          font-family: var(--font-mono);
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(57,217,180,0.4); margin-bottom: 10px;
        }
        .nav-mobile-links {
          display: flex; flex-direction: column; gap: 2px;
          margin-bottom: 28px;
        }
        .nav-mobile-link {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 800;
          color: rgba(240,240,240,0.65); text-decoration: none;
          padding: 8px 0; letter-spacing: -0.03em;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.15s;
        }
        .nav-mobile-link:hover { color: #f0f0f0; }
        .nav-mobile-link.highlight { color: #ffffff; }

        .nav-mobile-lab-links {
          display: flex; flex-direction: column; gap: 2px;
          margin-bottom: 36px;
        }
        .nav-mobile-lab-link {
          font-family: var(--font-mono);
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(240,240,240,0.38); text-decoration: none;
          padding: 7px 0;
          transition: color 0.15s;
        }
        .nav-mobile-lab-link:hover { color: rgba(57,217,180,0.8); }

        .nav-mobile-ctas {
          display: flex; flex-direction: row; flex-wrap: wrap;
          gap: 10px;
        }
        .nav-mobile-cta {
          flex: 1; min-width: 120px; text-align: center;
          font-family: var(--font-mono);
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 12px 16px; border-radius: 6px;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s;
        }
        .nav-mobile-cta-ai {
          color: #39d9b4;
          border: 1px solid rgba(57,217,180,0.4);
          background: rgba(57,217,180,0.07);
        }
        .nav-mobile-cta-call {
          color: #3dba7e;
          border: 1px solid rgba(61,186,126,0.4);
          background: rgba(61,186,126,0.07);
        }
        .nav-mobile-cta-resume {
          color: var(--accent);
          border: 1px solid var(--accent-ring);
          background: var(--accent-dim);
        }
      `}</style>

      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>

        {/* Logo */}
        <a href="/" className="nav-logo">
          OS<span className="nav-logo-dot">.</span>
        </a>

        {/* Desktop center — primary links + Lab dropdown */}
        <div className="nav-center">
          {PRIMARY_LINKS.map(l =>
            l.highlight ? (
              <a key={l.label} href={l.href} className="nav-link-consulting">
                {l.label}
              </a>
            ) : (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            )
          )}

          {/* Lab dropdown */}
          <div className="nav-lab-wrap" ref={labRef}>
            <button
              className={`nav-lab-btn${labOpen ? " open" : ""}`}
              onClick={() => setLabOpen(v => !v)}
              onMouseEnter={() => setLabOpen(true)}
            >
              Lab
              <span className="nav-lab-caret">▾</span>
            </button>

            <div
              className={`nav-lab-panel${labOpen ? " open" : ""}`}
              onMouseLeave={() => setLabOpen(false)}
            >
              {LAB_LINKS.map(l => (
                <a key={l.label} href={l.href} className="nav-lab-item" onClick={() => setLabOpen(false)}>
                  <span className="nav-lab-item-label">{l.label}</span>
                  <span className="nav-lab-item-desc">{l.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop CTAs */}
        <div className="nav-ctas">
          <button
            className="nav-btn-ai"
            onClick={() => (window as unknown as Record<string, () => void>).openBusinessChat?.()}
          >
            <span style={{ fontSize: 9 }}>✦</span> Ask AI
          </button>
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

      {/* Mobile full-screen menu */}
      <div className={`nav-mobile${menuOpen ? " open" : ""}`}>
        <p className="nav-mobile-group-label">Navigate</p>
        <div className="nav-mobile-links">
          {ALL_MOBILE_LINKS.filter(l => l.group === "main").map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`nav-mobile-link${l.highlight ? " highlight" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>

        <p className="nav-mobile-group-label">Lab</p>
        <div className="nav-mobile-lab-links">
          {ALL_MOBILE_LINKS.filter(l => l.group === "lab").map(l => (
            <a
              key={l.label}
              href={l.href}
              className="nav-mobile-lab-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-mobile-ctas">
          <button
            className="nav-mobile-cta nav-mobile-cta-ai"
            onClick={() => { setMenuOpen(false); (window as unknown as Record<string, () => void>).openBusinessChat?.(); }}
          >
            ✦ Ask AI
          </button>
          <a
            href="/book"
            className="nav-mobile-cta nav-mobile-cta-call"
            onClick={() => setMenuOpen(false)}
          >
            Book a Call ↗
          </a>
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-mobile-cta nav-mobile-cta-resume"
            onClick={() => setMenuOpen(false)}
          >
            Resume ↓
          </a>
        </div>
      </div>
    </>
  );
}
