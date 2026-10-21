"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ui, type Locale } from "@/data/site";
import { NavGlyph } from "./icons";
import { BookingDialog } from "./BookingDialog";
import { createPortal } from "react-dom";

const items: {
  key: string;
  glyph: "home" | "folder" | "sparkle" | "heart" | "calendar" | "phone";
  href: string;
  label: { id: string; en: string };
  /** Warna ikon (gradients untuk aksen, netral untuk home & calendar). */
  iconCls: string;
}[] = [
  {
    key: "home",
    glyph: "home",
    href: "#top",
    label: { id: "Beranda", en: "Home" },
    iconCls: "text-neutral-700",
  },
  {
    key: "pillars",
    glyph: "folder",
    href: ui.sectionNav.pillars.href,
    label: ui.sectionNav.pillars.label,
    iconCls: "text-white bg-gradient-to-b from-[#5FB0FF] to-[#2E7CF6]",
  },
  {
    key: "achievements",
    glyph: "sparkle",
    href: ui.sectionNav.achievements.href,
    label: ui.sectionNav.achievements.label,
    iconCls: "text-white bg-gradient-to-b from-[#C489FB] to-[#8231E8]",
  },
  {
    key: "about",
    glyph: "heart",
    href: ui.sectionNav.about.href,
    label: ui.sectionNav.about.label,
    iconCls: "text-white bg-gradient-to-b from-[#FF7A93] to-[#F92D50]",
  },
  {
    key: "booking",
    glyph: "calendar",
    href: ui.sectionNav.booking.href,
    label: ui.sectionNav.booking.label,
    iconCls: "text-neutral-700 bg-white",
  },
  {
    key: "contact",
    glyph: "phone",
    href: ui.sectionNav.contact.href,
    label: ui.sectionNav.contact.label,
    iconCls: "text-white bg-gradient-to-b from-[#4FDE73] to-[#1FB84A]",
  },
];

/**
 * Dock navigasi ala macOS (rekreasi Hamza "QuantumOS"):
 * Bar kaca (simple-glass), setiap icon "dock-icon" membesar & terangkat saat
 * pointer mendekat (magnification formula `max(1, 1.7 - d/120)`,
 * `translateY((s-1)*-25px)`), dengan titik indicator di bawah icon.
 * Mode "top" = sticky atas (desktop), "bottom" = sticky bawah (mobile).
 */
export function SectionDock({
  locale,
  dayOfMonth,
  weekdayShort,
  todayISO,
  mode = "top",
}: {
  locale: Locale;
  dayOfMonth: number;
  weekdayShort: string;
  todayISO: string;
  mode?: "top" | "bottom";
}) {
  const [openBooking, setOpenBooking] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLElement | null)[]>([]);

  // Magnification ala macOS: hitung jarak pointer → pusat tiap icon,
  // lalu scale + translateY (persis kode Hamza).
  useLayoutEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const onMove = (e: PointerEvent) => {
      for (const icon of iconsRef.current) {
        if (!icon) continue;
        const r = icon.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const s = Math.max(1, 1.7 - d / 120);
        icon.style.transform = `scale(${s}) translateY(${(s - 1) * -25}px)`;
        icon.style.zIndex = String(Math.floor(100 - d));
      }
    };
    const onLeave = () => {
      for (const icon of iconsRef.current) {
        if (!icon) continue;
        icon.style.transform = "scale(1)";
        icon.style.zIndex = "auto";
      }
    };

    dock.addEventListener("pointermove", onMove);
    dock.addEventListener("pointerleave", onLeave);
    return () => {
      dock.removeEventListener("pointermove", onMove);
      dock.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const wrapCls =
    mode === "top"
      ? "pointer-events-none sticky top-12 z-[60] flex justify-center px-4 py-3 hidden md:flex"
      : "pointer-events-none sticky bottom-4 z-[60] flex justify-center px-4 pb-2 md:hidden";

  return (
    <div className={wrapCls}>
      {/* Bar kaca dock */}
      <div
        ref={dockRef}
        className="simple-glass pointer-events-auto flex items-end gap-2 rounded-2xl p-2"
      >
        {items.map((item, i) => {
          const isCalendar = item.glyph === "calendar";
          const scaleCls =
            "dock-icon relative inline-flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

          return (
            <span key={item.key} className="relative flex items-end">
              {isCalendar ? (
                <button
                  ref={(el) => {
                    iconsRef.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setOpenBooking(true)}
                  aria-label={item.label[locale]}
                  title={item.label[locale]}
                  className={`${scaleCls} h-10 w-10 md:h-12 md:w-12`}
                >
                  {/* Ikon kalender ala Calendar.app macOS: kotak putih membulat,
                      hari kecil di atas + tanggal besar hitam di tengah. */}
                  <span className="relative flex h-full w-full flex-col overflow-hidden rounded-[20%] bg-white/95 shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-1 ring-black/10 md:rounded-[22%]">
                    {/* Area hari — background merah, teks putih */}
                    <span className="flex w-full shrink-0 items-center justify-center bg-[#ff3b30] pb-[2px] pt-[1px] text-[6px] font-bold uppercase leading-none tracking-wide text-white md:pb-[3px] md:text-[7px]">
                      {weekdayShort}
                    </span>
                    {/* Tanggal — font thin besar hampir memenuhi, warna gelap */}
                    <span className="flex min-h-0 flex-1 items-center justify-center text-[22px] font-extralight leading-none text-neutral-900 md:text-[26px]">
                      {dayOfMonth}
                    </span>
                  </span>
                  <span className="active-indicator" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  ref={(el) => {
                    iconsRef.current[i] = el;
                  }}
                  href={item.href}
                  aria-label={item.label[locale]}
                  title={item.label[locale]}
                  className={`${scaleCls} h-10 w-10 rounded-[20%] md:h-12 md:w-12 md:rounded-[24%]`}
                >
                  <span
                    className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[20%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${item.iconCls} md:rounded-[24%]`}
                  >
                    <NavGlyph id={item.glyph} />
                  </span>
                  <span className="active-indicator" aria-hidden="true" />
                </Link>
              )}
            </span>
          );
        })}
      </div>
      {openBooking ? createPortal(
        <BookingDialog locale={locale} todayISO={todayISO} onClose={() => setOpenBooking(false)} triggerRef={{ current: null }} />,
        document.body,
      ) : null}
    </div>
  );
}