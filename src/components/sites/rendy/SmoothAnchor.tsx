"use client";

import { useEffect } from "react";

/**
 * Smooth scroll pilihan (cross-browser, tak bergantung CSS `scroll-behavior`).
 * Menangkap klik ke anchor `#...` dan menggulir halus via `scrollIntoView`,
 * dengan offset (scroll-margin) agar target tak tertutup elemen sticky.
 * Menghormati `prefers-reduced-motion` (pakai auto bila diminta).
 */
export function SmoothAnchor() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}