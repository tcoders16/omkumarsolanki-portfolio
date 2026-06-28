"use client";
import { useEffect } from "react";

/**
 * On mount, checks sessionStorage for a pending scroll target
 * (set by Nav when navigating cross-page) and scrolls to it.
 * Falls back to window.location.hash so direct URL links also work.
 */
export default function HashScroller() {
  useEffect(() => {
    // Priority 1: cross-page nav set a target in sessionStorage
    const stored = sessionStorage.getItem("scrollTo");
    const id = stored ?? window.location.hash.slice(1);
    if (!id) return;

    if (stored) sessionStorage.removeItem("scrollTo");

    // Retry until the element is in the DOM (components mount async)
    let attempts = 0;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts++ < 12) {
        setTimeout(scroll, 150);
      }
    };
    // Small initial delay so all sections have rendered
    setTimeout(scroll, 80);
  }, []);

  return null;
}
