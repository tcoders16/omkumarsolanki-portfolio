"use client";

/**
 * Lightweight first-party visitor tracker. No cookies, no third party.
 * Sends events to /api/track:
 *   • pageview  — on every route change
 *   • click     — on links/buttons or any [data-track] element
 *   • section   — when a section[id] / [data-track-section] scrolls into view
 *   • heartbeat — every 45s while the tab is visible (powers "online now")
 *
 * Rendered once from the root layout. Fails silently — never blocks the page.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSid(): string {
  try {
    let sid = localStorage.getItem("om_sid");
    if (!sid) {
      sid =
        (crypto.randomUUID?.() ??
          `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);
      localStorage.setItem("om_sid", sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

// External referrer captured once per session (entry referrer).
function getEntryRef(): string | undefined {
  try {
    const stored = sessionStorage.getItem("om_ref");
    if (stored !== null) return stored || undefined;
    let ref: string | undefined;
    if (document.referrer) {
      try {
        const h = new URL(document.referrer).hostname.replace(/^www\./, "");
        if (h && h !== location.hostname.replace(/^www\./, "")) ref = h;
      } catch { /* ignore */ }
    }
    sessionStorage.setItem("om_ref", ref ?? "");
    return ref;
  } catch {
    return undefined;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const sid = useRef<string>("");
  const device = useRef<"mobile" | "tablet" | "desktop">("desktop");

  function send(type: string, path: string, label?: string) {
    // Never track the admin portal itself.
    if (path.startsWith("/admin")) return;
    try {
      const payload = JSON.stringify({
        type, sid: sid.current, path, label,
        device: device.current, ref: getEntryRef(),
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/track", blob)) return;
      fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    } catch { /* ignore */ }
  }

  // Init once.
  useEffect(() => {
    sid.current = getSid();
    device.current = getDevice();
  }, []);

  // Pageview on every route change.
  useEffect(() => {
    if (!pathname) return;
    send("pageview", pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Click tracking (delegated) + section observer.
  useEffect(() => {
    const path = pathname ?? location.pathname;

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-track], a, button",
      );
      if (!el) return;
      const label =
        el.getAttribute("data-track") ||
        el.getAttribute("aria-label") ||
        (el as HTMLAnchorElement).getAttribute?.("href") ||
        el.textContent?.trim().slice(0, 60) ||
        el.tagName.toLowerCase();
      send("click", path, label);
    }
    document.addEventListener("click", onClick, { capture: true });

    // Section visibility (fires once per section per page load).
    const seen = new Set<string>();
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-track-section], section[id]",
    );
    const io = new IntersectionObserver(
      entries => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          const t = ent.target as HTMLElement;
          const name =
            t.getAttribute("data-track-section") || t.id || "section";
          if (seen.has(name)) continue;
          seen.add(name);
          send("section", path, name);
        }
      },
      { threshold: 0.4 },
    );
    targets.forEach(t => io.observe(t));

    return () => {
      document.removeEventListener("click", onClick, { capture: true } as never);
      io.disconnect();
    };
  }, [pathname]);

  // Heartbeat while visible.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    function beat() {
      if (document.visibilityState === "visible") {
        send("heartbeat", pathname ?? location.pathname);
      }
    }
    timer = setInterval(beat, 45_000);
    return () => clearInterval(timer);
  }, [pathname]);

  return null;
}
