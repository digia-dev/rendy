"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { daysShort, monthsLong, profile, ui, widgets, type Locale } from "@/data/site";

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
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const panelRef = useRef<HTMLDivElement>(null);

  const daysShortL = daysShort[locale];

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
    setSelectedSlot(null);
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
  const canAdd = Boolean(selectedDate && selectedSlot);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Jendela macOS */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        className="relative w-full max-w-[720px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] outline-none"
      >
        {/* Titlebar dengan lampu lalu lintas macOS */}
        <div className="flex h-9 items-center gap-2 border-b border-black/10 bg-[#f4f4f5] px-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={uiClose(locale)}
            className="group flex h-3 w-3 items-center justify-center"
          >
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity group-hover:opacity-80" />
          </button>
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="flex-1 text-center text-[13px] text-neutral-600">{cal.desktopTitle[locale]}</span>
          <span className="w-12" />
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_240px]">
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

            <div className="mt-2 grid grid-cols-7 gap-y-1 text-center" role="grid" aria-label={monthLabel}>
              {daysShortL.map((d) => (
                <span key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
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
                      setSelectedSlot(null);
                    }}
                    aria-pressed={isSelected}
                    className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] disabled:cursor-not-allowed disabled:text-neutral-300"
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

          {/* Slot jam */}
          <div className="flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">{uiSlotsLabel(locale)}</p>
            <div className="mt-3 grid max-h-[236px] grid-cols-2 gap-2 overflow-y-auto pr-1 md:grid-cols-1">
              {cal.slots.map((slot) => {
                const active = slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    aria-pressed={active}
                    className="rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                    style={
                      active
                        ? { backgroundColor: "#0069d9", borderColor: "#0069d9", color: "#fff" }
                        : { borderColor: "rgba(0,0,0,0.12)", color: "#262626", background: "#fff" }
                    }
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4">
              {canAdd ? (
                <a
                  href={googleCalendarUrl(selectedDate, selectedSlot!, locale)}
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
