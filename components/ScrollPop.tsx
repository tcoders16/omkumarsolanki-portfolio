"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   ScrollPop — scroll-driven "grow to fullscreen" stage.

   • Visible from the start: at rest it's a normal, readable card.
   • As it scrolls to centre it GROWS (real width/height, so text stays
     crisp — not a transform-scale that shrinks the type) toward near-
     fullscreen, leaving a `margin` on all sides, rising on the z-axis
     with a dimming backdrop, then recedes back to a card.
   • No overlap: a sticky pin inside a tall track reserves the vertical
     space, so neighbouring sections are always off-screen while it's open.
═══════════════════════════════════════════════════════════════ */

export default function ScrollPop({
  children,
  margin = 28, // gap (px) on all sides when fully open
  track = 200, // scroll runway in vh
}: {
  children: ReactNode;
  margin?: number;
  track?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [d, setD] = useState({ w: 760, h: 540, eased: 0, active: false });

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const total = rect.height - vh; // sticky pin is 100vh
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const t = total > 0 ? scrolled / total : 0; // 0..1 through runway
      // Triangle with plateau: ramp up, hold fully open, ramp down.
      const up = 0.34, down = 0.66;
      let p = t < up ? t / up : t > down ? (1 - t) / (1 - down) : 1;
      p = Math.min(Math.max(p, 0), 1);
      const eased = p * p * (3 - 2 * p); // smoothstep

      const fullW = vw - 2 * margin;
      const fullH = vh - 2 * margin;
      const restW = Math.min(780, vw - 2 * margin);
      const restH = Math.min(Math.round(vh * 0.6), 560);
      const w = restW + (fullW - restW) * eased;
      const h = restH + (fullH - restH) * eased;
      setD({ w, h, eased, active: eased > 0.02 });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [margin]);

  const { w, h, eased, active } = d;

  return (
    <div ref={trackRef} style={{ position: "relative", width: "100%", height: `${track}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* dimming backdrop — fades in only as it opens; invisible at rest */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: eased > 0.04 ? "blur(3px)" : "none",
            WebkitBackdropFilter: eased > 0.04 ? "blur(3px)" : "none",
            opacity: eased * 0.88,
            zIndex: active ? 8990 : -1,
            pointerEvents: "none",
            transition: "opacity .1s linear",
          }}
        />
        {/* the box — real width/height animation keeps the text crisp */}
        <div
          style={{
            position: "relative",
            width: `${Math.round(w)}px`,
            height: `${Math.round(h)}px`,
            zIndex: active ? 9000 : 2,
            borderRadius: 14,
            overflow: "hidden",
            border: `1.5px solid rgba(57,217,180,${(0.3 + eased * 0.6).toFixed(3)})`,
            boxShadow: `0 30px 90px rgba(0,0,0,.6), 0 0 ${Math.round(16 + eased * 48)}px rgba(57,217,180,${(0.1 + eased * 0.4).toFixed(3)})`,
            willChange: "width, height",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
