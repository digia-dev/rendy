"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { daysShort, monthsLong, profile, ui, widgets, type Locale } from "@/data/site";
import { Wheel } from "./widgets/Wheel";

/**
 * Dialog penjadwalan mandiri bertema macOS (keputusan pengguna — menggantikan
 * popup DaySchedule eksternal). Penunjuk memilih tanggal + jam, lalu tombol
 * membangkitkan tautan Google Calendar (template event) yang mengisi judul,
 * waktu (zona Asia/Jakarta), detail, dan lokasi. Tanpa backend/OAuth; WhatsApp
 * tetap tersedia sebagai cadangan.
 *
 * Aksesibilitas: `role=dialog` + `aria-modal`, jebakan fokus, Escape menutup,
 * fokus kembali ke pemicu, kunci gulir latar, dan tombol tutup berlabel.
 */

interface Props {
  locale: Locale;
  todayISO: string;
  onClose: () => void;
  /** Elemen pemicu — fokus dikembalikan ke sini saat dialog ditutup. */
  triggerRef: React.RefObject<HTMLElement | null>;
}

const cal = widgets.calendar;

/* ------------------------------------------------------------------ copy */
// Semua teks diambil dari `ui.booking` (site.ts) — tanpa hardcoded di komponen.
const b = ui.booking;
const uiTitle = (l: Locale): string => b.title[l];
const uiSubtitle = (l: Locale): string => b.subtitle[l];
const uiPrev = (l: Locale): string => b.prevMonth[l];
const uiNext = (l: Locale): string => b.nextMonth[l];
const uiSlotsLabel = (l: Locale): string => b.slotsLabel[l];
const uiPickPrompt = (l: Locale): string => b.pickPrompt[l];
const uiAdd = (l: Locale): string => b.addLabel[l];
const uiWhats = (l: Locale): string => b.whatsLabel[l];
const uiClose = (l: Locale): string => b.closeLabel[l];

/** Susun tautan template Google Calendar untuk satu slot (zona WIB via `ctz`). */
function googleCalendarUrl(dateISO: string, startHM: string, locale: Locale): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [sh, sm] = startHM.split(":").map(Number);
  const endTotal = sh * 60 + sm + cal.duration;
  const eh = Math.floor(endTotal / 60) % 24;
  const em = endTotal % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = (hh: number, mm: number) => `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: cal.event.title[locale],
    dates: `${stamp(sh, sm)}/${stamp(eh, em)}`,
    details: cal.event.details[locale],
    location: cal.event.location[locale],
    ctz: cal.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function BookingDialog({ locale, todayISO, onClose, triggerRef }: Props) {
  const today = useMemo(() => new Date(`${todayISO}T12:00:00`), [todayISO]);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const panelRef = useRef<HTMLDivElement>(null);

  const daysShortL = daysShort[locale];

  // Jam 07–20, menit kelipatan 15 agar pilihan rapi & nyata.
  const hours = useMemo(() => Array.from({ length: 14 }, (_, i) => String(i + 7).padStart(2, "0")), []);
  const minutes = useMemo(() => ["00", "15", "30", "45"], []);
  const selectedSlot = useMemo(() => `${hour}:${minute}`, [hour, minute]);

  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const total = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (string | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= total; d++) cells.push(`${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    return cells;
  }, [view]);

  const isPast = useCallback((iso: string) => iso < todayISO, [todayISO]);

  // Pindahkan ke tanggal terpilih saat ganti bulan agar slot selalu relevan.
  const changeMonth = (delta: number) => {
    setView((v) => {
      const next = new Date(v.y, v.m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  };

  // Tutup dengan Escape + jebakan fokus + kunci gulir latar.
  useEffect(() => {
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],input,[tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    // Fokus awal ke panel.
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey, true);
      trigger?.focus();
    };
  }, [onClose, triggerRef]);

  const monthLabel = `${monthsLong[locale][view.m]} ${view.y}`;
  const canAdd = Boolean(selectedDate);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] backdrop-enter"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Jendela mobile = bottom-sheet full-width, desktop = modal centered */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-full flex-col  overflow-hidden rounded-t-2xl border-t border-black/10 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.18)] outline-none md:max-h-[90vh] md:max-w-[720px] md:rounded-xl md:border md:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
      >
        {/* Grabber — affordance bottom sheet iOS (mobile) */}
        <div className="flex shrink-0 justify-center pt-2 md:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-black/15" />
        </div>

        {/* Titlebar dengan lampu lalu lintas macOS */}
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-black/10 bg-[#f4f4f5] px-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={uiClose(locale)}
            className="-ml-1 flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
          >
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity group-hover:opacity-80" />
          </button>
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="flex-1 text-center text-[13px] text-neutral-600">{cal.desktopTitle[locale]}</span>
          <span className="w-7" />
        </div>

        {/* Badan — scrollable di mobile, grid 2 kolom di desktop */}
        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto overscroll-contain p-4 pb-2 md:grid-cols-[minmax(0,1fr)_240px] md:gap-6 md:overflow-visible md:p-6 md:pb-6">
          {/* Kalender */}
          <div>
            <h2 id="booking-title" className="text-[15px] font-bold text-black">
              {uiTitle(locale)}
            </h2>
            <p className="mt-1 text-[12.5px] leading-5 text-neutral-500">{uiSubtitle(locale)}</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label={uiPrev(locale)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[13px] font-semibold text-neutral-800">{monthLabel}</span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label={uiNext(locale)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid w-full grid-cols-7 gap-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none touch-none" role="grid" aria-label={monthLabel}>
              {daysShortL.map((d) => (
                <span key={d} className="py-0.5 text-center text-[10px] font-semibold text-neutral-400 tracking-wide">
                  {d.slice(0, 2)}
                </span>
              ))}
              {grid.map((iso, i) => {
                if (iso === null) return <span key={`e${i}`} />;
                const past = isPast(iso);
                const isToday = iso === todayISO;
                const isSelected = iso === selectedDate;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={past}
                    onClick={() => {
                      setSelectedDate(iso);
                    }}
                    aria-pressed={isSelected}
                    className="flex aspect-square w-full items-center justify-center rounded-full text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] disabled:cursor-not-allowed disabled:text-neutral-300 md:text-[13px]"
                    style={
                      isSelected
                        ? { backgroundColor: "#0069d9", color: "#fff", fontWeight: 700 }
                        : isToday
                          ? { color: "#0069d9", fontWeight: 700, boxShadow: "inset 0 0 0 1px #0069d9" }
                          : past
                            ? undefined
                            : { color: "#262626" }
                    }
                  >
                    {Number(iso.slice(8))}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot waktu — wheel picker jam + menit (scroll rolling) */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium text-neutral-500 tracking-tight text-center">{uiSlotsLabel(locale)}</p>

            <div className="mx-auto mt-2 flex items-center justify-center gap-1.5 md:mt-3">
              <div className="rounded-2xl border border-black/10 bg-white px-2 py-1 shadow-sm">
                <Wheel
                  items={hours}
                  value={hour}
                  onChange={setHour}
                  ariaLabel={locale === "id" ? "Jam" : "Hour"}
                />
              </div>
              <span className="text-[20px] font-semibold text-neutral-400" aria-hidden="true">:</span>
              <div className="rounded-2xl border border-black/10 bg-white px-2 py-1 shadow-sm">
                <Wheel
                  items={minutes}
                  value={minute}
                  onChange={setMinute}
                  ariaLabel={locale === "id" ? "Menit" : "Minute"}
                />
              </div>
            </div>

            <p className="mt-3 text-center text-[12px] text-neutral-400">{selectedSlot}</p>

            <div className="sticky bottom-0 z-10 -mx-4 mt-auto shrink-0 border-t border-black/10 bg-white/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:static md:mx-0 md:mt-4 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
              {canAdd ? (
                <a
                  href={googleCalendarUrl(selectedDate, selectedSlot, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-gradient-to-b from-[#57a4f0] to-[#3e8fe4] px-4 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(62,143,228,0.35)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                >
                  {uiAdd(locale)}
                </a>
              ) : (
                <p className="rounded-lg bg-neutral-50 px-3 py-2.5 text-center text-[12px] leading-4 text-neutral-400">
                  {uiPickPrompt(locale)}
                </p>
              )}
              <a
                href={cal.fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full rounded-full border border-black/10 px-4 py-2 text-center text-[12.5px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                {uiWhats(locale)}
              </a>
              <p className="mt-2 text-center text-[11px] text-neutral-400">{profile.whatsappDisplay}</p>
            </div>
          </div>
        </div>

        {/* Tombol tutup pojok (kanan atas) sebagai jalur tutup eksplisit */}
        <button
          type="button"
          onClick={onClose}
          aria-label={uiClose(locale)}
          className="absolute right-3 top-2.5 flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
