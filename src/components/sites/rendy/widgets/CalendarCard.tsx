"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { daysLong, daysShort, monthsLong, type Locale, type L10n } from "@/data/site";
import { BookingDialog } from "../BookingDialog";

interface Props {
  locale: Locale;
  todayISO: string;
  hint: L10n;
  ariaLabel: string;
}

/**
 * Kartu kalender kaca — sumber: 150×150, hari ini di-highlight.
 * Klik = dialog penjadwalan mandiri bertema macOS (lihat BookingDialog).
 */
export function CalendarCard({ locale, todayISO, hint, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const today = useMemo(() => new Date(`${todayISO}T12:00:00`), [todayISO]);
  const year = today.getFullYear();
  const month = today.getMonth();

  const grid = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const weekday = daysLong[locale][today.getDay()];
  const dayLabel = daysShort[locale];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        title={ariaLabel}
        className="glass-card group block h-[150px] w-[150px] p-3.5 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#ef4444]">
          {weekday.slice(0, 3)}
        </p>
        <p className="-mt-0.5 text-[26px] font-extrabold leading-tight text-black">{today.getDate()}</p>

        <div className="mt-1 grid grid-cols-7 gap-y-[3px] text-center text-[8px] leading-none text-neutral-500 max-md:hidden">
          {dayLabel.map((d) => (
            <span key={d} className="font-semibold text-neutral-400">
              {d.slice(0, 1)}
            </span>
          ))}
          {grid.map((d, i) => (
            <span
              key={i}
              className={cn(
                "mx-auto flex h-[11px] w-[11px] items-center justify-center rounded-full",
                d === today.getDate() && "bg-black font-bold text-white",
              )}
            >
              {d ?? ""}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-neutral-500 max-md:mt-3 md:hidden">{hint[locale]}</p>
        <p className="sr-only">
          {monthsLong[locale][month]} {year}
        </p>
      </button>

      {open
        ? createPortal(
            <BookingDialog
              locale={locale}
              todayISO={todayISO}
              onClose={() => setOpen(false)}
              triggerRef={triggerRef}
            />,
            document.body,
          )
        : null}
    </>
  );
}

function cn(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(" ");
}
