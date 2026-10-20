"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ui, type Locale } from "@/data/site";
import { NavGlyph } from "./icons";

const items: {
  key: string;
  glyph: "home" | "folder" | "sparkle" | "heart" | "calendar" | "phone";
  href: string;
  label: { id: string; en: string };
  /** kelas background rounded-square icon (putih untuk home, gradien untuk lainnya). */
  bgCls: string;
}[] = [
  {
    key: "home",
    glyph: "home",
    href: "#top",
    label: { id: "Beranda", en: "Home" },
    bgCls: "border border-black/10 bg-white text-black hover:bg-[#f3f3f3]",
  },
  {
    key: "pillars",
    glyph: "folder",
    href: ui.sectionNav.pillars.href,
    label: ui.sectionNav.pillars.label,
    bgCls: "text-white bg-gradient-to-b from-[#5FB0FF] to-[#2E7CF6]",
  },
  {
    key: "achievements",
    glyph: "sparkle",
    href: ui.sectionNav.achievements.href,
    label: ui.sectionNav.achievements.label,
    bgCls: "text-white bg-gradient-to-b from-[#C489FB] to-[#8231E8]",
  },
  {
    key: "about",
    glyph: "heart",
    href: ui.sectionNav.about.href,
    label: ui.sectionNav.about.label,
    bgCls: "text-white bg-gradient-to-b from-[#FF7A93] to-[#F92D50]",
  },
  {
    key: "booking",
    glyph: "calendar",
    href: ui.sectionNav.booking.href,
    label: ui.sectionNav.booking.label,
    bgCls: "border border-black/10 bg-white text-black",
  },
  {
    key: "contact",
    glyph: "phone",
    href: ui.sectionNav.contact.href,
    label: ui.sectionNav.contact.label,
    bgCls: "text-white bg-gradient-to-b from-[#4FDE73] to-[#1FB84A]",
  },
];

const BASE = 40; // ukuran dasar ikon (pin)
const MAX_SCALE = 1.45; // pembesaran maksimum di tengah
const RADIUS = 96; // radius pengaruh pointer (px)
const MAX_LIFT = 12; // pengangkatan maksimum (px) saat membesar

/** Skala & angkat ala macOS Dock berdasarkan jarak ikon → pointer. */
function magnify(dist: number): number {
  if (dist >= RADIUS) return 1;
  const t = 1 - dist / RADIUS; // 0..1 (dekat = 1)
  // kurva smooth (ease-out kuadratik)
  const ease = 1 - (1 - t) * (1 - t);
  return 1 + (MAX_SCALE - 1) * ease;
}

/**
 * Dock navigasi dengan magnification ala macOS (icon membesar saat pointer
 * mendekat/sliding). mode="top" utk desktop (sticky atas), mode="bottom"
 * utk mobile (sticky bawah, naik saat footer).
 */
export function SectionDock({
  locale,
  dayOfMonth,
  weekdayShort,
  mode = "top",
}: {
  locale: Locale;
  dayOfMonth: number;
  weekdayShort: string;
  mode?: "top" | "bottom";
}) {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [centers, setCenters] = useState<number[]>([]);

  const wrapCls =
    mode === "top"
      ? "pointer-events-none sticky top-4 z-[60] flex justify-center px-4 py-3 md:flex md:-mt-32 md:h-32 md:items-start md:py-0 hidden"
      : "pointer-events-none sticky bottom-4 z-[60] flex justify-center px-4 pb-2 md:hidden";

  // Ukur posisi pusat tiap ikon (relatif nav) sekali & saat ukuran berubah.
  useLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      if (!nav) return;
      const navRect = nav.getBoundingClientRect();
      const cs = items.map((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.left - navRect.left + r.width / 2;
      });
      setCenters(cs);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Posisi pointer relatif terhadap nav.
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  const onPointerLeave = useCallback(() => setMouseX(null), []);

  const scaleFor = (i: number): number => {
    if (mouseX == null || centers.length === 0) return 1;
    return magnify(Math.abs(centers[i] - mouseX));
  };

  return (
    <div className={wrapCls}>
      <nav
        ref={navRef}
        aria-label={ui.navAria[locale]}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="glass-card pointer-events-auto flex items-end gap-2 rounded-2xl px-3 pb-1.5 pt-2"
      >
        {items.map((item, i) => {
          const external = item.href.startsWith("http");
          const label = item.label[locale];
          const scale = scaleFor(i);
          const lift = scale - 1 > 0.02 ? MAX_LIFT * (scale - 1) / (MAX_SCALE - 1) : 0;

          // kelas dasar ikon: gradien/putih + visual; transform di-set inline via scale.
          const iconCls =
            "flex h-full w-full items-center justify-center overflow-hidden rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[filter,background-color] duration-150 " +
            item.bgCls;

          return (
            <span key={item.key} className="relative flex items-end">
              {i === 1 ? (
                <span className="w-px self-start bg-black/15 md:mt-0.5 md:h-8" aria-hidden="true" />
              ) : null}
              <a
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={item.href}
                title={label}
                aria-label={label}
                {...(external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {})}
                className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                style={{
                  width: BASE, // pin maintain — transform scale akan memperbesarnya
                  height: BASE,
                  transform: `translateY(-${lift}px) scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition: "transform 0.18s cubic-bezier(0.16,1,0.3,1), width 0.18s, height 0.18s",
                  willChange: "transform",
                  zIndex: scale > 1.05 ? 30 : 10,
                }}
              >
                {item.glyph === "calendar" ? (
                  <span className={iconCls} data-nav-cal>
                    <span
                      className="flex h-[38%] w-full shrink-0 items-center justify-center px-0.5 text-[6px] font-bold uppercase text-white"
                      style={{ backgroundColor: "#ff3b30", paddingTop: "1px" }}
                    >
                      {weekdayShort}
                    </span>
                    <span className="flex h-[62%] w-full items-center justify-center text-[12px] font-extrabold leading-none text-black" data-nav-day>
                      {dayOfMonth}
                    </span>
                  </span>
                ) : (
                  <span className={iconCls}>
                    <NavGlyph id={item.glyph} />
                  </span>
                )}
              </a>
            </span>
          );
        })}
      </nav>
    </div>
  );
}