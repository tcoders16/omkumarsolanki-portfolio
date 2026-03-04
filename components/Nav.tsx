"use client";
import { useEffect, useState } from "react";

const links = [
  { label: "Work",     href: "/#work" },
  { label: "Agents",   href: "/#agents" },
  { label: "Math",     href: "/#math" },
  { label: "Story",    href: "/#story" },
  { label: "Terminal", href: "/#terminal" },
  { label: "About",    href: "/#about" },
  { label: "Rates",    href: "/#rates" },
  { label: "Contact",  href: "/#contact" },
];

const GITHUB_URL = "https://github.com/omkumarsolanki";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 60,
        padding: "0 clamp(16px, 3vw, 48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: scrolled ? "rgba(0,0,0,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>

        {/* Logo */}
        <a href="/" style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1.1rem",
          color: "var(--white)",
          textDecoration: "none",
          letterSpacing: "-0.04em",
          flexShrink: 0,
        }}>
          OS<span style={{ color: "var(--accent)" }}>.</span>
        </a>

        {/* Desktop nav links — centered */}
        <div className="hide-mobile" style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(12px, 1.5vw, 24px)",
          flex: 1,
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} className="nav-link" style={{ whiteSpace: "nowrap" }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop right — Book a Call + Resume */}
        <div className="hide-mobile" style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}>
          <a
            href="/book"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#3dba7e",
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "6px 12px",
              border: "1px solid rgba(61,186,126,0.35)",
              borderRadius: 3,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(61,186,126,0.1)";
              e.currentTarget.style.borderColor = "rgba(61,186,126,0.65)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(61,186,126,0.35)";
            }}
          >
            Book a Call ↗
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--accent)",
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "6px 12px",
              border: "1px solid var(--accent-ring)",
              borderRadius: 3,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--accent-dim)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--accent-ring)";
            }}
          >
            Resume ↓
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          style={{ zIndex: 101 }}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map(l => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          <a
            href="/book"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "#3dba7e",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            BOOK A CALL ↗
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--muted)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            GITHUB ↗
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            RESUME ↓
          </a>
        </div>
      </div>
    </>
  );
}
